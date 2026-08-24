import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { serviceClient } from "../../../../lib/youth-consent";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const [{ data: consents }, { data: profiles }] = await Promise.all([
    supabase.from("parental_consents").select("id,status,privacy_notice_version,initial_notice_sent_at,parent_affirmed_at,second_notice_due_at,second_notice_sent_at,expires_at,revoked_at").order("created_at", { ascending: false }),
    supabase.from("parent_managed_explore_profiles").select("id,child_nickname,age_range,state,interests,current_stage,updated_at").order("created_at", { ascending: false }),
  ]);
  return NextResponse.json({ consents: consents || [], profiles: profiles || [] });
}

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const admin = serviceClient();
  const now = new Date().toISOString();
  const { error } = await admin.from("parental_consents").update({ status: "revoked", revoked_at: now, updated_at: now }).eq("parent_user_id", user.id).in("status", ["pending_parent_response", "waiting_period", "active"]);
  if (error) return NextResponse.json({ error: "Consent could not be revoked." }, { status: 500 });
  await admin.from("parent_managed_explore_profiles").delete().eq("parent_user_id", user.id);
  return NextResponse.json({ ok: true });
}
