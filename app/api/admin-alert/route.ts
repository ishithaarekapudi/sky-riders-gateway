import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const alertTypes: Record<string, { label: string; queue: string }> = {
  opportunity_submissions: { label: "community submission", queue: "Submissions" },
  mentor_applications: { label: "mentor application", queue: "Mentors" },
  mentee_applications: { label: "mentee application", queue: "Mentees" },
  contact_inquiries: { label: "contact inquiry", queue: "Contacts" },
};

function secureEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
  const resendKey = process.env.RESEND_API_KEY;
  const recipient = process.env.ADMIN_ALERT_EMAIL;
  const providedSecret = request.headers.get("x-webhook-secret") || "";

  if (!webhookSecret || !resendKey || !recipient) return NextResponse.json({ error: "Email alerts are not configured." }, { status: 503 });
  if (!secureEqual(providedSecret, webhookSecret)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const payload = await request.json().catch(() => null) as { type?: string; table?: string } | null;
  if (!payload || payload.type !== "INSERT" || !payload.table || !alertTypes[payload.table]) {
    return NextResponse.json({ error: "Unsupported webhook payload." }, { status: 400 });
  }

  const alert = alertTypes[payload.table];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ishitha.us";
  const adminUrl = `${siteUrl.replace(/\/$/, "")}/admin`;
  const sender = process.env.ALERT_FROM_EMAIL || "Sky Riders Gateway <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      subject: `New Sky Riders ${alert.label}`,
      html: `<div style="font-family:Arial,sans-serif;color:#08264a;line-height:1.6"><p style="color:#1674e8;font-size:12px;letter-spacing:.16em">SKY RIDERS GATEWAY</p><h1 style="font-size:24px">A new ${alert.label} is ready for review.</h1><p>Open the private administrator dashboard and select <strong>${alert.queue}</strong> to review it. Personal details have intentionally been left out of this email.</p><p><a href="${adminUrl}" style="display:inline-block;background:#1378e8;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none">Open Admin Dashboard</a></p></div>`,
      text: `A new Sky Riders ${alert.label} is ready for review. Open ${adminUrl} and select ${alert.queue}. Personal details have intentionally been left out of this email.`,
    }),
  });

  if (!response.ok) return NextResponse.json({ error: "Email provider rejected the alert." }, { status: 502 });
  return NextResponse.json({ delivered: true });
}
