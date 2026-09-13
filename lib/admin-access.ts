import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "./supabase/server";
export async function adminClient(): Promise<SupabaseClient | null> {
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) return null;
  const { data } = await client.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  return data ? client : null;
}
