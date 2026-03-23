import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email(),
  amount: z.number().positive(),
  callback_url: z.string().url(),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(req: Request) {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: "Payment not configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { email, amount, callback_url, metadata } = parsed.data;

  const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amount * 100), // convert to kobo
      currency: "NGN",
      callback_url,
      metadata,
    }),
  });

  const paystackData = await paystackRes.json();

  if (!paystackRes.ok || !paystackData.status) {
    return NextResponse.json(
      { error: paystackData.message ?? "Paystack initialization failed" },
      { status: 502 }
    );
  }

  return NextResponse.json({ authorization_url: paystackData.data.authorization_url });
}
