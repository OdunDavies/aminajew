import { NextResponse } from "next/server";
import { validateContactForm } from "@/lib/validation";
import { resend, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/resend";

export async function POST(request: Request) {
  const body = await request.json();

  const result = validateContactForm(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Send email notification
  const subject = result.data.subject
    ? `New Contact: ${result.data.subject}`
    : "New Contact Message";

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject,
    text: [
      `Name: ${result.data.name}`,
      `Email: ${result.data.email}`,
      result.data.subject ? `Subject: ${result.data.subject}` : "",
      ``,
      result.data.message,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  return NextResponse.json({ ok: true });
}
