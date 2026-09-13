import { ContentManager } from "./content-manager";
import { fromRow } from "../../lib/catalog";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { AdminReviewDashboard } from "./review-dashboard";

export const metadata = { title: "Administrator Review", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account?next=/admin");

  const { data: admin } = await supabase.from("admin_users").select("user_id,email").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/dashboard");

  const [opportunities, mentors, mentees, contacts, privacy] = await Promise.all([
    supabase.from("opportunity_submissions").select("*").order("created_at", { ascending: false }),
    supabase.from("mentor_applications").select("*").order("created_at", { ascending: false }),
    supabase.from("mentee_applications").select("*").order("created_at", { ascending: false }),
    supabase.from("contact_inquiries").select("*").order("created_at", { ascending: false }),
    supabase.from("data_deletion_requests").select("*").order("created_at", { ascending: false }),
  ]);

  const catalog = await Promise.all([supabase.from("organizations").select("*"), supabase.from("career_paths").select("*"), supabase.from("opportunities").select("*").eq("type", "scholarship")]);
  const kinds = ["organizations", "careers", "scholarships"] as const;
  const setupError = catalog.some(result => result.error || result.data?.some(row => !("directory_content" in row)));
  return <><div className="admin-content-shell"><ContentManager initial={catalog.flatMap((result, index) => (result.data || []).map(row => fromRow(kinds[index], row)))} submissions={opportunities.data || []} setupError={setupError}/></div><AdminReviewDashboard
    adminId={user.id}
    adminEmail={admin.email}
    initial={{
      opportunities: opportunities.data ?? [],
      mentors: mentors.data ?? [],
      mentees: mentees.data ?? [],
      contacts: contacts.data ?? [],
      privacy: privacy.data ?? [],
    }}
  /></>;
}
