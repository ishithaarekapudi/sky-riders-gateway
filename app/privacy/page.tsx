import Link from "next/link";
import { PageShell } from "../ui";

export default function PrivacyPage() {
  return <PageShell active="resources">
    <main className="policy-page">
      <span>PRIVACY AT SKY RIDERS GATEWAY</span>
      <h1>Your path is personal. Your information should be protected.</h1>
      <p className="policy-updated">Youth-focused privacy summary · Updated August 19, 2026</p>

      <section><h2>What we collect</h2><p>Explore can be used without an account. We may collect an optional first name or nickname, broad age range, state, interests, and current stage to personalize recommendations. Account, mentorship, submission, and contact forms collect only the information shown in those forms.</p></section>
      <section><h2>Children under 13</h2><p>Children under 13 may use Explore in private session mode with a parent or guardian. Their Explore answers are not saved to a Gateway account or database. Accounts and mentorship requests are not currently available to children under 13.</p></section>
      <section><h2>Teen accounts and mentorship</h2><p>Accounts are currently available for ages 13 and older. A mentorship request from someone aged 13–17 requires a parent or guardian email and confirmation. No match begins until Gateway separately verifies consent and completes its safety review.</p></section>
      <section><h2>How information is used</h2><p>Information is used to provide recommendations, maintain saved items and roadmaps, review community submissions, respond to messages, and safely administer mentorship. Gateway does not sell personal information or use youth information for behavioral advertising.</p></section>
      <section><h2>Sharing and visibility</h2><p>Explore profiles, mentor applications, mentee applications, guardian details, and contact submissions are not public. Approved staff and service providers may access the minimum information needed to operate and secure the service. Mentors do not receive a minor’s home address, school, private contact details, or precise location.</p></section>
      <section><h2>Retention, access, and deletion</h2><p>We keep personal information only as long as needed for the purpose described, safety obligations, or applicable legal requirements. A user or guardian may request access, correction, or deletion through the contact process below.</p></section>
      <section><h2>Contact</h2><p>For privacy questions or a data request, use the <Link href="/about/contact">Gateway contact form</Link>. Do not include sensitive personal information in the message.</p></section>
      <p className="policy-legal-note">This page describes the current product safeguards and should be reviewed by qualified youth-privacy counsel before mentorship launches.</p>
    </main>
  </PageShell>;
}
