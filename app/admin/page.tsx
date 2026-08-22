import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { AdminReviewDashboard } from "./review-dashboard";

export const metadata = { title: "Administrator Review" };
export const dynamic = "force-dynamic";

const adminTypographyStyles = `
  .admin-page {
    font-family: Inter, "Avenir Next", "Segoe UI", Arial, sans-serif;
    font-weight: 400;
  }

  .admin-header h1 {
    font-weight: 560;
    line-height: 1.02;
    letter-spacing: -.035em;
  }

  .admin-header p {
    font-weight: 400;
    line-height: 1.6;
  }

  .admin-identity strong,
  .admin-toolbar h2,
  .admin-card-heading h3 {
    font-weight: 560;
  }

  .admin-toolbar h2,
  .admin-card-heading h3 {
    letter-spacing: -.015em;
  }

  .admin-card-heading span {
    font-weight: 560;
    letter-spacing: .18em;
  }

  .admin-review-controls label {
    font-weight: 540;
  }

  .admin-tabs,
  .admin-toolbar,
  .admin-review-list {
    width: min(1480px, 90vw);
  }

  .admin-tabs {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account?next=/admin");

  const { data: admin } = await supabase.from("admin_users").select("user_id,email").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/dashboard");

  const [opportunities, mentors, mentees, contacts] = await Promise.all([
    supabase.from("opportunity_submissions").select("*").order("created_at", { ascending: false }),
    supabase.from("mentor_applications").select("*").order("created_at", { ascending: false }),
    supabase.from("mentee_applications").select("*").order("created_at", { ascending: false }),
    supabase.from("contact_inquiries").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <>
      <style>{adminTypographyStyles}</style>
      <AdminReviewDashboard
        adminId={user.id}
        adminEmail={admin.email}
        initial={{
          opportunities: opportunities.data ?? [],
          mentors: mentors.data ?? [],
          mentees: mentees.data ?? [],
          contacts: contacts.data ?? [],
        }}
      />
    </>
  );
}
