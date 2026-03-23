import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: "Payment not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const paystackRes = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const paystackData = await paystackRes.json();

  if (!paystackRes.ok || !paystackData.status) {
    return NextResponse.json(
      { error: paystackData.message ?? "Verification failed" },
      { status: 502 }
    );
  }

  return NextResponse.json({ data: paystackData.data });
}
