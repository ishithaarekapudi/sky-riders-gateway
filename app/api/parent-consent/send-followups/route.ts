import { NextRequest, NextResponse } from "next/server";
import { newToken, publicSiteUrl, sendConsentEmail, serviceClient, tokenHash } from "../../../../lib/youth-consent";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const admin = serviceClient();
  const { data: due, error } = await admin.from("parental_consents").select("id,parent_email")
    .eq("status", "waiting_period").lte("second_notice_due_at", new Date().toISOString()).limit(50);
  if (error) return NextResponse.json({ error: "Could not load follow-ups." }, { status: 500 });

  let sent = 0;
  for (const record of due || []) {
    const revokeToken = newToken();
    const revokeUrl = `${publicSiteUrl()}/api/parent-consent/revoke?token=${revokeToken}`;
    try {
      await sendConsentEmail({
        to: record.parent_email,
        subject: "Parent-managed Explore access is now active",
        heading: "Your second privacy confirmation",
        body: "Your parent-managed Explore access is now active. This second message repeats the original notice after the waiting period. You can review and delete profiles from your parent controls. Select the button below if you want to revoke consent and delete every associated child profile.",
        actionLabel: "Revoke Consent and Delete Profiles",
        actionUrl: revokeUrl,
      });
      await admin.from("parental_consents").update({ status: "active", revocation_token_hash: tokenHash(revokeToken), second_notice_sent_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", record.id).eq("status", "waiting_period");
      sent += 1;
    } catch { /* leave pending so a later run can retry */ }
  }
  return NextResponse.json({ sent });
}
