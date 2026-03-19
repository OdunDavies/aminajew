import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-paystack-signature, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const REFERENCE_REGEX = /^[A-Za-z0-9_-]{6,100}$/;

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

const getFiniteNumber = (value: unknown, fieldName: string, options: { min?: number; max?: number } = {}) => {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${fieldName} must be a valid number`);
  }

  if (options.min !== undefined && parsed < options.min) {
    throw new Error(`${fieldName} must be at least ${options.min}`);
  }

  if (options.max !== undefined && parsed > options.max) {
    throw new Error(`${fieldName} must be at most ${options.max}`);
  }

  return parsed;
};

export const getRequestOrigin = (req: Request) => {
  const origin = req.headers.get("origin");
  if (origin) return origin;

  const referer = req.headers.get("referer");
  if (!referer) return null;

  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
};

export const createServiceClient = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL is not configured");
  }

  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }

  return createClient(supabaseUrl, supabaseKey);
};

export const getRateLimitIdentifier = (req: Request, value: string) => {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = req.headers.get("x-real-ip")?.trim();
  const ip = forwarded || realIp || "unknown";
  return `${value.toLowerCase()}|${ip}`;
};

export async function assertRateLimit(
  supabase: ReturnType<typeof createClient>,
  action: string,
  identifier: string,
  maxAttempts: number,
  windowMinutes: number,
) {
  const threshold = new Date(Date.now() - windowMinutes * 60_000).toISOString();

  const { count, error } = await supabase
    .from("rate_limit_events")
    .select("id", { count: "exact", head: true })
    .eq("action", action)
    .eq("identifier", identifier)
    .gt("created_at", threshold);

  if (error) {
    throw new Error(`Rate limit lookup failed: ${error.message}`);
  }

  if ((count ?? 0) >= maxAttempts) {
    throw new Error("Too many requests. Please try again later.");
  }

  const { error: insertError } = await supabase.from("rate_limit_events").insert({
    action,
    identifier,
  });

  if (insertError) {
    throw new Error(`Rate limit tracking failed: ${insertError.message}`);
  }
}

export function validateReferencePayload(body: unknown) {
  const reference = typeof (body as { reference?: unknown })?.reference === "string"
    ? (body as { reference: string }).reference.trim()
    : "";

  if (!REFERENCE_REGEX.test(reference)) {
    throw new Error("Reference format is invalid");
  }

  return { reference };
}

export function validateInitializePaymentPayload(body: unknown, requestOrigin: string | null) {
  if (!requestOrigin) {
    throw new Error("Request origin is missing");
  }

  if (!isRecord(body)) {
    throw new Error("Invalid request payload");
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const amount = getFiniteNumber(body.amount, "Amount", { min: 100, max: 10000000 });
  const callbackUrl = typeof body.callback_url === "string" ? body.callback_url.trim() : "";

  if (!EMAIL_REGEX.test(email) || email.length > 255) {
    throw new Error("Email format is invalid");
  }

  if (!callbackUrl) {
    throw new Error("Callback URL is required");
  }

  let parsedCallback: URL;
  try {
    parsedCallback = new URL(callbackUrl);
  } catch {
    throw new Error("Callback URL is invalid");
  }

  if (parsedCallback.origin !== requestOrigin || parsedCallback.pathname !== "/payment/verify") {
    throw new Error("Callback URL is not allowed");
  }

  const metadata = isRecord(body.metadata) ? body.metadata : {};
  const encodedMetadata = new TextEncoder().encode(JSON.stringify(metadata));
  if (encodedMetadata.byteLength > 12000) {
    throw new Error("Metadata is too large");
  }

  const customerName = typeof metadata.customer_name === "string" ? normalizeWhitespace(metadata.customer_name) : "";
  const customerEmail = typeof metadata.customer_email === "string" ? metadata.customer_email.trim().toLowerCase() : email;
  const customerPhone = typeof metadata.customer_phone === "string" ? normalizeWhitespace(metadata.customer_phone) : "";
  const shippingAddress = typeof metadata.shipping_address === "string" ? normalizeWhitespace(metadata.shipping_address) : "";
  const subtotal = getFiniteNumber(metadata.subtotal ?? 0, "Subtotal", { min: 0, max: 10000000 });
  const shippingCost = getFiniteNumber(metadata.shipping_cost ?? 0, "Shipping cost", { min: 0, max: 1000000 });
  const items = Array.isArray(metadata.items) ? metadata.items : [];

  if (!customerName || customerName.length > 100) {
    throw new Error("Customer name is invalid");
  }

  if (!EMAIL_REGEX.test(customerEmail) || customerEmail.length > 255) {
    throw new Error("Customer email is invalid");
  }

  if (customerPhone && customerPhone.length > 20) {
    throw new Error("Customer phone is invalid");
  }

  if (!shippingAddress || shippingAddress.length < 10 || shippingAddress.length > 250) {
    throw new Error("Shipping address is invalid");
  }

  if (!items.length || items.length > 25) {
    throw new Error("Items payload is invalid");
  }

  const normalizedItems = items.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`Item ${index + 1} is invalid`);
    }

    const id = typeof item.id === "string" ? item.id.trim() : "";
    const name = typeof item.name === "string" ? normalizeWhitespace(item.name) : "";
    const price = getFiniteNumber(item.price, `Item ${index + 1} price`, { min: 0, max: 10000000 });
    const quantity = getFiniteNumber(item.quantity, `Item ${index + 1} quantity`, { min: 1, max: 20 });

    if (!id || id.length > 100 || !name || name.length > 120) {
      throw new Error(`Item ${index + 1} is invalid`);
    }

    return {
      id,
      name,
      price,
      quantity,
    };
  });

  const expectedTotal = Number((subtotal + shippingCost).toFixed(2));
  if (Math.abs(expectedTotal - amount) > 0.01) {
    throw new Error("Amount does not match order totals");
  }

  const shippingAddressObject = isRecord(metadata.shipping_address_obj)
    ? metadata.shipping_address_obj
    : { address: shippingAddress };

  return {
    email,
    amount,
    callbackUrl: parsedCallback.toString(),
    metadata: {
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      shipping_address: shippingAddress,
      shipping_address_obj: shippingAddressObject,
      items: normalizedItems,
      subtotal,
      shipping_cost: shippingCost,
    },
  };
}

export function extractVerifiedPaymentDetails(payload: unknown) {
  if (!isRecord(payload)) {
    throw new Error("Payment payload is invalid");
  }

  const reference = typeof payload.reference === "string" ? payload.reference.trim() : "";
  if (!REFERENCE_REGEX.test(reference)) {
    throw new Error("Payment reference is invalid");
  }

  const amountInKobo = getFiniteNumber(payload.amount, "Verified amount", { min: 100, max: 1000000000 });
  const total = Number((amountInKobo / 100).toFixed(2));
  const metadata = isRecord(payload.metadata) ? payload.metadata : {};
  const customer = isRecord(payload.customer) ? payload.customer : {};

  const customerEmailRaw = typeof customer.email === "string" && customer.email.trim()
    ? customer.email
    : metadata.customer_email;
  const customerNameRaw = typeof metadata.customer_name === "string" && metadata.customer_name.trim()
    ? metadata.customer_name
    : customer.first_name;
  const customerPhoneRaw = typeof metadata.customer_phone === "string" ? metadata.customer_phone : customer.phone;
  const shippingAddress = typeof metadata.shipping_address === "string" ? normalizeWhitespace(metadata.shipping_address) : "";

  const customerEmail = typeof customerEmailRaw === "string" ? customerEmailRaw.trim().toLowerCase() : "";
  const customerName = typeof customerNameRaw === "string" ? normalizeWhitespace(customerNameRaw) : "Guest";
  const customerPhone = typeof customerPhoneRaw === "string" ? normalizeWhitespace(customerPhoneRaw) : null;
  const subtotal = getFiniteNumber(metadata.subtotal ?? total, "Subtotal", { min: 0, max: 10000000 });
  const shipping = getFiniteNumber(metadata.shipping_cost ?? 0, "Shipping cost", { min: 0, max: 1000000 });
  const items = Array.isArray(metadata.items) ? metadata.items : [];

  if (customerEmail && (!EMAIL_REGEX.test(customerEmail) || customerEmail.length > 255)) {
    throw new Error("Verified customer email is invalid");
  }

  return {
    reference,
    total,
    subtotal,
    shipping,
    customerEmail: customerEmail || null,
    customerName,
    customerPhone,
    shippingAddress: shippingAddress || null,
    shippingAddressObject: isRecord(metadata.shipping_address_obj) ? metadata.shipping_address_obj : null,
    items,
  };
}

export async function getOrCreateCustomer(
  supabase: ReturnType<typeof createClient>,
  details: { email: string | null; name: string; phone: string | null; address: string | null },
) {
  if (!details.email) {
    return null;
  }

  const { data: existingCustomer, error: fetchError } = await supabase
    .from("customers")
    .select("id")
    .eq("email", details.email)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Customer lookup failed: ${fetchError.message}`);
  }

  if (existingCustomer) {
    return existingCustomer.id;
  }

  const { data: newCustomer, error: insertError } = await supabase
    .from("customers")
    .insert({
      name: details.name || "Guest",
      email: details.email,
      phone: details.phone,
      address: details.address,
      order_count: 0,
      total_spent: 0,
    })
    .select("id")
    .single();

  if (insertError) {
    throw new Error(`Customer creation failed: ${insertError.message}`);
  }

  return newCustomer.id;
}

export async function incrementCustomerStats(
  supabase: ReturnType<typeof createClient>,
  customerId: string,
  orderTotal: number,
) {
  const { data: customer, error: fetchError } = await supabase
    .from("customers")
    .select("order_count, total_spent")
    .eq("id", customerId)
    .single();

  if (fetchError) {
    throw new Error(`Customer stats lookup failed: ${fetchError.message}`);
  }

  const { error: updateError } = await supabase
    .from("customers")
    .update({
      order_count: (customer.order_count ?? 0) + 1,
      total_spent: Number(customer.total_spent ?? 0) + orderTotal,
    })
    .eq("id", customerId);

  if (updateError) {
    throw new Error(`Customer stats update failed: ${updateError.message}`);
  }
}

export async function ensureOrderRecorded(
  supabase: ReturnType<typeof createClient>,
  order: {
    customer_id: string | null;
    items: unknown[];
    subtotal: number;
    shipping: number;
    total: number;
    status: "processing";
    shipping_address: Record<string, unknown> | null;
    tracking_number: string;
  },
) {
  const { data: existingOrder, error: fetchError } = await supabase
    .from("orders")
    .select("id")
    .eq("tracking_number", order.tracking_number)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Order lookup failed: ${fetchError.message}`);
  }

  if (existingOrder) {
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "processing",
      })
      .eq("id", existingOrder.id);

    if (updateError) {
      throw new Error(`Order update failed: ${updateError.message}`);
    }

    return { id: existingOrder.id, created: false };
  }

  const { data: createdOrder, error: insertError } = await supabase
    .from("orders")
    .insert(order)
    .select("id")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      const { data: duplicateOrder, error: duplicateFetchError } = await supabase
        .from("orders")
        .select("id")
        .eq("tracking_number", order.tracking_number)
        .single();

      if (duplicateFetchError) {
        throw new Error(`Order duplicate lookup failed: ${duplicateFetchError.message}`);
      }

      return { id: duplicateOrder.id, created: false };
    }

    throw new Error(`Order creation failed: ${insertError.message}`);
  }

  return { id: createdOrder.id, created: true };
}
