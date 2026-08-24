import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

const allowedInterests = ["Pilot", "Gliding & Soaring", "Space Exploration", "Aerospace Engineering", "Weather & Meteorology", "Aircraft Mechanics", "Drones", "Air Traffic Control", "Aviation Service", "Still Exploring"];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { nickname, ageRange, state, interests } = await request.json();
  if (!["5–7", "8–12"].includes(ageRange) || typeof state !== "string" || !Array.isArray(interests) || !interests.length || interests.some(item => !allowedInterests.includes(item))) {
    return NextResponse.json({ error: "Complete the child profile using broad, non-sensitive details." }, { status: 400 });
  }
  const { data: consent } = await supabase.from("parental_consents").select("id,expires_at").eq("parent_user_id", user.id).eq("status", "active").gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (!consent) return NextResponse.json({ error: "Parent consent is not active yet." }, { status: 403 });
  const { error } = await supabase.from("parent_managed_explore_profiles").insert({
    parent_user_id: user.id, parental_consent_id: consent.id, child_nickname: typeof nickname === "string" ? nickname.trim().slice(0, 40) || null : null,
    age_range: ageRange, state: state.trim().slice(0, 80), interests, current_stage: ageRange === "5–7" ? "Elementary School" : "Middle School", updated_at: new Date().toISOString(),
  });
  if (error) return NextResponse.json({ error: "We could not save the private profile." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const id = request.nextUrl.searchParams.get("id") || "";
  const { error } = await supabase.from("parent_managed_explore_profiles").delete().eq("id", id).eq("parent_user_id", user.id);
  if (error) return NextResponse.json({ error: "We could not delete the profile." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
