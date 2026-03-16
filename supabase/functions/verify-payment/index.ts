import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error('PAYSTACK_SECRET_KEY is not configured');
    }

    const { reference } = await req.json();
    if (!reference) {
      return new Response(
        JSON.stringify({ error: 'Reference is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify transaction with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Paystack verify error [${response.status}]: ${JSON.stringify(data)}`);
    }

    // If payment was successful, create an order
    if (data.data?.status === 'success') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const metadata = data.data.metadata || {};

      // Create or find customer
      let customerId: string | null = null;
      if (metadata.customer_email) {
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('email', metadata.customer_email)
          .maybeSingle();

        if (existingCustomer) {
          customerId = existingCustomer.id;
          // Update customer stats
          await supabase
            .from('customers')
            .update({
              order_count: (existingCustomer as any).order_count + 1,
              total_spent: (existingCustomer as any).total_spent + (data.data.amount / 100),
            })
            .eq('id', customerId);
        } else {
          const { data: newCustomer } = await supabase
            .from('customers')
            .insert({
              name: metadata.customer_name || 'Guest',
              email: metadata.customer_email,
              phone: metadata.customer_phone || null,
              address: metadata.shipping_address || null,
              order_count: 1,
              total_spent: data.data.amount / 100,
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
        total: data.data.amount / 100,
        status: 'processing',
        shipping_address: metadata.shipping_address_obj || null,
        tracking_number: reference,
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
