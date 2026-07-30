import Link from "next/link";
import { OpportunitySubmissionForm } from "../../components/CommunityForms";
import { PageShell } from "../../ui";

export default function SubmitOpportunityPage() {
  return <PageShell active="get-involved">
    <section className="community-page-heading"><Link href="/get-involved">← Get Involved</Link><span>COMMUNITY SUBMISSIONS</span><h1>Help Us Find the Next Open Door</h1><p>Know a trustworthy organization, scholarship, program, event, or career resource? Share it with Gateway for review.</p></section>
    <section className="community-form-section">
      <aside><span>WHAT HAPPENS NEXT</span><h2>Helpful, accurate, and reviewed.</h2><ol><li><b>1</b><p><strong>You submit the opportunity.</strong><br />Include an official source and enough detail for us to understand who it serves.</p></li><li><b>2</b><p><strong>Gateway reviews it.</strong><br />We verify the source, eligibility, current availability, and fit with the platform.</p></li><li><b>3</b><p><strong>Approved listings are published.</strong><br />The opportunity is added to the appropriate directory and can appear in personalized matches.</p></li></ol></aside>
      <OpportunitySubmissionForm />
    </section>
  </PageShell>;
}
