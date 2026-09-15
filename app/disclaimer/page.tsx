import { withPageSeo } from "../../lib/seo";
import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "../ui";

export const metadata: Metadata = withPageSeo({ title: "Terms and Disclaimer", description: "Read the educational-use, external-link, accuracy, mentorship, privacy, and verification terms for Sky Riders Gateway.", alternates: { canonical: "/disclaimer" } });

export default function DisclaimerPage() {
  return <PageShell active="resources">
    <main className="policy-page">
      <span>TERMS &amp; DISCLAIMER</span>
      <h1>Use Gateway as a starting point, then verify every next step.</h1>
      <p className="policy-updated">Informational-use notice · Updated September 15, 2026</p>

      <section>
        <h2>Educational information</h2>
        <p>Sky Riders Gateway provides educational information and planning tools for exploring aviation and aerospace. The website does not provide legal, financial, medical, academic, employment, or professional advice, and it does not guarantee admission, selection, funding, certification, employment, or any other outcome.</p>
      </section>

      <section>
        <h2>Scholarships, programs, careers, and events</h2>
        <p>Deadlines, award amounts, eligibility requirements, program availability, locations, and application procedures can change. Before applying, traveling, paying a fee, or sharing information, confirm the current details on the sponsoring organization’s official website. Gateway summaries are intended to make opportunities easier to understand, not to replace official rules.</p>
      </section>

      <section>
        <h2>Independent organizations and external links</h2>
        <p>Organizations listed on Gateway are independently operated unless a page expressly identifies a formal partnership. A listing, logo, or external link does not by itself imply endorsement, sponsorship, or affiliation. Gateway is not responsible for the content, privacy practices, availability, or actions of external websites and organizations.</p>
      </section>

      <section>
        <h2>Mentorship and youth safety</h2>
        <p>Mentorship is educational guidance, not therapy, emergency support, professional counseling, flight instruction, or employment placement. Submitting a form does not guarantee a match. Matches involving a minor require Gateway’s safety review and verified parent or guardian consent before mentorship activity begins. Read the <Link href="/youth-safety">Youth Safety Policy</Link> for current safeguards.</p>
      </section>

      <section>
        <h2>Accounts and acceptable use</h2>
        <p>Users are responsible for providing accurate information, protecting account access, and using Gateway lawfully and respectfully. Do not submit sensitive personal information, confidential records, precise schedules, financial account information, government identification numbers, or another person’s information without authorization.</p>
      </section>

      <section>
        <h2>Book purchases</h2>
        <p><i>Cleared for Takeoff</i> is offered as a paperback through Stripe checkout. The listed book price does not include shipping or applicable taxes; Stripe presents the final amount after you provide the delivery address and before payment is submitted. Stripe processes payment and sends the purchase receipt. Before purchasing, review the checkout details carefully and contact Gateway through the <Link href="/about/contact">contact form</Link> with order questions. Any returns, replacements, or fulfillment decisions are handled individually and may depend on the order and delivery status.</p>
      </section>

      <section>
        <h2>Content ownership and fair use</h2>
        <p>Unless otherwise stated, Gateway&apos;s written content, design, and original materials are owned by Sky Riders Gateway or their respective creators. Do not reproduce substantial portions without permission. Third-party names, logos, and links belong to their respective owners and are used only to identify the referenced organization or resource.</p>
      </section>

      <section>
        <h2>Disclosures</h2>
        <p>Gateway will clearly identify paid placements, sponsorships, affiliate links, gifted products, or other material relationships near the related recommendation or promotion. A partner listing alone does not mean the organization has paid Gateway.</p>
      </section>

      <section>
        <h2>Privacy</h2>
        <p>How Gateway collects, uses, and protects information is described in the <Link href="/privacy">Privacy Policy</Link>. Parents and guardians may contact Gateway to request access, correction, or deletion of a young person’s information.</p>
      </section>

      <section>
        <h2>Questions and corrections</h2>
        <p>If you find inaccurate or outdated information, or have a question about these terms, use the <Link href="/about/contact">Gateway contact form</Link>. Please identify the relevant page and official source without including sensitive personal information.</p>
      </section>

      <p className="policy-legal-note">This notice is a practical public-facing disclaimer, not a substitute for legal advice. It should be reviewed by qualified counsel before paid sales or active youth mentorship launches.</p>
    </main>
  </PageShell>;
}
