import { NextRequest, NextResponse } from "next/server";
import { publicSiteUrl, serviceClient, tokenHash } from "../../../../lib/youth-consent";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") || "";
  if (token.length < 32) return NextResponse.redirect(`${publicSiteUrl()}/parent-consent?revoked=invalid`);
  const admin = serviceClient();
  const { data } = await admin.from("parental_consents").update({ status: "revoked", revoked_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("revocation_token_hash", tokenHash(token)).neq("status", "revoked").select("id").maybeSingle();
  if (data) await admin.from("parent_managed_explore_profiles").delete().eq("parental_consent_id", data.id);
  return NextResponse.redirect(`${publicSiteUrl()}/parent-consent?revoked=${data ? "true" : "invalid"}`);
}
