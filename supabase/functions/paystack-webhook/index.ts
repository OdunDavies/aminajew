import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Paystack sends webhooks as POST with a signature header
// No CORS needed for server-to-server webhooks, but we include for flexibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const hashHex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex === signature;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error('PAYSTACK_SECRET_KEY is not configured');
    }

    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'No signature provided' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the webhook signature
    const isValid = await verifySignature(body, signature, PAYSTACK_SECRET_KEY);
    if (!isValid) {
      console.error('Invalid Paystack webhook signature');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const event = JSON.parse(body);
    console.log('Paystack webhook event:', event.event);

    // Only process successful charges
    if (event.event === 'charge.success') {
      const txData = event.data;
      const reference = txData.reference;
      const metadata = txData.metadata || {};

      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Check if order already exists (from verify-payment callback)
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('tracking_number', reference)
        .maybeSingle();

      if (existingOrder) {
        // Order already created via verify-payment, just ensure status is correct
        await supabase
          .from('orders')
          .update({ status: 'processing' })
          .eq('id', existingOrder.id);

        console.log('Order already exists, updated status:', existingOrder.id);
      } else {
        // Create customer if needed
        let customerId: string | null = null;
        const customerEmail = txData.customer?.email || metadata.customer_email;

        if (customerEmail) {
          const { data: existingCustomer } = await supabase
            .from('customers')
            .select('id, order_count, total_spent')
            .eq('email', customerEmail)
            .maybeSingle();

          if (existingCustomer) {
            customerId = existingCustomer.id;
            await supabase
              .from('customers')
              .update({
                order_count: (existingCustomer.order_count || 0) + 1,
                total_spent: (existingCustomer.total_spent || 0) + (txData.amount / 100),
              })
              .eq('id', customerId);
          } else {
            const { data: newCustomer } = await supabase
              .from('customers')
              .insert({
                name: metadata.customer_name || txData.customer?.first_name || 'Guest',
                email: customerEmail,
                phone: metadata.customer_phone || txData.customer?.phone || null,
                address: metadata.shipping_address || null,
                order_count: 1,
                total_spent: txData.amount / 100,
              })
              .select('id')
              .single();
            customerId = newCustomer?.id || null;
          }
        }

        // Create order
        await supabase.from('orders').insert({
          customer_id: customerId,
          items: metadata.items || [],
          subtotal: metadata.subtotal || 0,
          shipping: metadata.shipping_cost || 0,
          total: txData.amount / 100,
          status: 'processing',
          shipping_address: metadata.shipping_address_obj || null,
          tracking_number: reference,
        });

        console.log('New order created from webhook for reference:', reference);
      }
    }

    // Always return 200 to acknowledge receipt
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    // Still return 200 to prevent Paystack from retrying
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
