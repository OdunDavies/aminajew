import { NextResponse } from "next/server";
import { getResend, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/resend";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export async function POST(request: Request) {
  try {
    const {
      reference,
      customerName,
      customerEmail,
      customerPhone,
      address,
      items,
      total,
    }: {
      reference: string;
      customerName: string;
      customerEmail: string;
      customerPhone?: string;
      address: string;
      items: OrderItem[];
      total: number;
    } = await request.json();

    const itemLines = (items ?? [])
      .map((i) => `  - ${i.name} × ${i.quantity} = ₦${(i.price * i.quantity).toLocaleString()}`)
      .join("\n");

    await getResend().emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Order — ${customerName}`,
      text: [
        `New order received on artsybrands.`,
        ``,
        `Reference: ${reference}`,
        ``,
        `Customer`,
        `  Name:    ${customerName}`,
        `  Email:   ${customerEmail}`,
        customerPhone ? `  Phone:   ${customerPhone}` : "",
        `  Address: ${address}`,
        ``,
        `Items`,
        itemLines,
        ``,
        `Total: ₦${total.toLocaleString()}`,
      ]
        .filter((line) => line !== undefined)
        .join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Log but don't fail — payment is already confirmed
    console.error("Payment notify email error:", err);
    return NextResponse.json({ ok: true });
  }
}
