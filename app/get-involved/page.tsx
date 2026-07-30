import Link from "next/link";
import { Icon, PageShell } from "../ui";

export default function GetInvolvedPage() {
  return <PageShell active="get-involved">
    <section className="sub-hero involved-hero"><div>
      <span className="eyebrow">BUILD THE GATEWAY WITH US</span>
      <h1>Open a Door for Someone Else</h1>
      <p>Share a trusted opportunity, offer guidance, or find a mentor who can help turn your questions into a practical next step.</p>
    </div></section>
    <section className="section involved-choice-section">
      <div className="section-heading"><span>CHOOSE HOW TO PARTICIPATE</span><h2>Connection Makes Opportunity Possible</h2><p>Every submission is reviewed. Every mentorship match is facilitated with safety, fit, and clear expectations in mind.</p></div>
      <div className="involved-choice-grid">
        <article><div className="round-icon"><Icon name="document" /></div><span>GROW THE DIRECTORY</span><h2>Share an Opportunity</h2><p>Recommend an organization, scholarship, event, program, or resource that could help young people find their place in aviation and aerospace.</p><Link className="primary-button" href="/get-involved/submit">Submit for Review →</Link></article>
        <article><div className="round-icon"><Icon name="people" /></div><span>GATEWAY MENTORSHIP</span><h2>Mentor or Be Mentored</h2><p>Offer the knowledge you have gained, or request guidance from someone whose experience aligns with your goals.</p><Link className="primary-button" href="/get-involved/mentorship">Explore Mentorship →</Link></article>
      </div>
      <div className="community-principles">
        <div><strong>Reviewed</strong><span>Opportunities and applications are checked before approval.</span></div>
        <div><strong>Purposeful</strong><span>Matches are based on goals, experience, availability, and fit.</span></div>
        <div><strong>Safeguarded</strong><span>Minor participation includes guardians and open communication.</span></div>
      </div>
    </section>
  </PageShell>;
}
