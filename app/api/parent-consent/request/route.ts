import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { FOLLOW_UP_DELAY_HOURS, PRIVACY_NOTICE_VERSION, newToken, publicSiteUrl, sendConsentEmail, serviceClient, tokenHash } from "../../../../lib/youth-consent";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email || !user.email_confirmed_at) return NextResponse.json({ error: "Sign in with a verified adult account first." }, { status: 401 });
    if (user.user_metadata?.age_group !== "18-plus") return NextResponse.json({ error: "Only a verified adult account can request a parent-managed profile." }, { status: 403 });

    const { parentName, relationship, adultAttestation } = await request.json();
    if (!adultAttestation || typeof parentName !== "string" || parentName.trim().length < 2 || typeof relationship !== "string" || relationship.trim().length < 2) {
      return NextResponse.json({ error: "Complete the parent or guardian information and adult attestation." }, { status: 400 });
    }

    const consentToken = newToken();
    const revokeToken = newToken();
    const admin = serviceClient();
    const { error } = await admin.from("parental_consents").insert({
      parent_user_id: user.id,
      parent_email: user.email,
      parent_name: parentName.trim(),
      relationship_to_child: relationship.trim(),
      privacy_notice_version: PRIVACY_NOTICE_VERSION,
      consent_token_hash: tokenHash(consentToken),
      revocation_token_hash: tokenHash(revokeToken),
      status: "pending_parent_response",
    });
    if (error) return NextResponse.json({ error: "We could not start the consent request." }, { status: 500 });

    const site = publicSiteUrl();
    await sendConsentEmail({
      to: user.email,
      subject: "Review and confirm parent-managed Explore access",
      heading: "Review the parent privacy notice",
      body: `You requested a parent-managed, private Explore profile. Selecting the button below is your affirmative consent. A second confirmation will be sent no sooner than ${FOLLOW_UP_DELAY_HOURS} hours later. No child information is collected before the consent process is complete.`,
      actionLabel: "I Have Read This Notice and Consent",
      actionUrl: `${site}/api/parent-consent/confirm?token=${consentToken}`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "We could not begin the consent process." }, { status: 500 });
  }
}
