import Link from "next/link";
import { PageShell } from "../ui";

export default function PrivacyPage() {
  return <PageShell active="resources">
    <main className="policy-page">
      <span>PRIVACY AT SKY RIDERS GATEWAY</span>
      <h1>Your path is personal. Your information should be protected.</h1>
      <p className="policy-updated">Youth-focused privacy summary · Updated August 21, 2026</p>

      <section><h2>What we collect</h2><p>Explore can be used without an account. We may collect an optional first name or nickname, broad age range, state, interests, and current stage to personalize recommendations. Account, mentorship, submission, and contact forms collect only the information shown in those forms.</p></section>
      <section><h2>Children under 13</h2><p>Children under 13 may use Explore in private session mode with a parent or guardian without saving answers. An adult parent or legal guardian may also request a parent-managed, private Explore profile. Gateway does not collect the child’s nickname, broad age range, state, or interests until the parent receives the complete notice, affirmatively responds, and receives a delayed second confirmation with revocation controls. Under-13 mentorship remains unavailable. <Link href="/parent-consent">Open parent controls</Link>.</p></section>
      <section><h2>Teen accounts and mentorship</h2><p>Accounts are currently available for ages 13 and older. A mentorship request from someone aged 13–17 requires a parent or guardian email and confirmation. No match begins until Gateway separately verifies consent and completes its safety review.</p></section>
      <section><h2>How information is used</h2><p>Information is used to provide recommendations, maintain saved items and roadmaps, review community submissions, respond to messages, and safely administer mentorship. Gateway does not sell personal information or use youth information for behavioral advertising.</p></section>
      <section><h2>Sharing and visibility</h2><p>Explore profiles, mentor applications, mentee applications, guardian details, and contact submissions are not public. Access is limited to the submitting user where applicable, authorized Gateway administrators, and carefully selected service providers performing necessary operations. Mentors do not receive a minor’s home address, school, private contact details, or precise location.</p></section>
      <section><h2>Service providers</h2><p>Gateway currently uses Supabase for protected database storage and authentication, Vercel for website hosting, Resend for transactional email, Cloudflare Turnstile for spam and abuse prevention, and Stripe for payment processing. Each provider receives only the information needed for its role and operates under its own privacy and security terms.</p></section>
      <section><h2>Retention, access, and deletion</h2><p>We keep personal information only as long as needed for the purpose described, safety obligations, or applicable legal requirements. Rejected applications are scheduled for deletion after 90 days unless a safety or legal need requires longer retention. Inactive mentorship records are scheduled for deletion after the published retention period. A user or guardian may <Link href="/privacy/delete">request access, correction, or deletion</Link>.</p></section>
      <section><h2>Contact</h2><p>For privacy questions, use the <Link href="/about/contact">Gateway contact form</Link>. For an access, correction, consent, or deletion request, use the <Link href="/privacy/delete">private data-request form</Link>. Do not include sensitive personal information in either message.</p></section>
      <p className="policy-legal-note">This page describes the current product safeguards and should be reviewed by qualified youth-privacy counsel before mentorship launches.</p>
    </main>
  </PageShell>;
}
