import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { AdminReviewDashboard } from "./review-dashboard";

export const metadata = { title: "Administrator Review" };
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

  return <AdminReviewDashboard
    adminId={user.id}
    adminEmail={admin.email}
    initial={{
      opportunities: opportunities.data ?? [],
      mentors: mentors.data ?? [],
      mentees: mentees.data ?? [],
      contacts: contacts.data ?? [],
      privacy: privacy.data ?? [],
    }}
  />;
}
