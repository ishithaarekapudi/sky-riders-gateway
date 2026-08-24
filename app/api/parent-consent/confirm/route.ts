import { NextRequest, NextResponse } from "next/server";
import { FOLLOW_UP_DELAY_HOURS, publicSiteUrl, serviceClient, tokenHash } from "../../../../lib/youth-consent";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") || "";
  if (token.length < 32) return NextResponse.redirect(`${publicSiteUrl()}/parent-consent?consent=invalid`);
  const admin = serviceClient();
  const due = new Date(Date.now() + FOLLOW_UP_DELAY_HOURS * 60 * 60 * 1000).toISOString();
  const { data } = await admin.from("parental_consents").update({
    status: "waiting_period", parent_affirmed_at: new Date().toISOString(), second_notice_due_at: due, updated_at: new Date().toISOString(),
  }).eq("consent_token_hash", tokenHash(token)).eq("status", "pending_parent_response").select("id").maybeSingle();
  return NextResponse.redirect(`${publicSiteUrl()}/parent-consent?consent=${data ? "affirmed" : "invalid"}`);
}
