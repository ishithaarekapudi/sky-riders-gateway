import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "../ui";

export const metadata: Metadata = { title: "Youth Safety Policy", description: "Review Sky Riders Gateway mentorship safeguards, guardian requirements, communication boundaries, and youth reporting procedures.", alternates: { canonical: "/youth-safety" } };

export default function YouthSafetyPage() {
  return <PageShell active="get-involved">
    <main className="policy-page">
      <span>YOUTH SAFETY</span>
      <h1>Mentorship should be encouraging, accountable, and safe.</h1>
      <section><h2>Before a match</h2><ul><li>Mentors must be at least 18 and are not publicly searchable.</li><li>Gateway reviews identity, experience, references, training, and appropriate screening requirements.</li><li>A parent or guardian must give verified consent before a minor can be matched.</li><li>Every match is manually approved by a Gateway coordinator.</li></ul></section>
      <section><h2>Communication boundaries</h2><ul><li>No unrestricted private adult-to-minor messaging.</li><li>Guardians or approved coordinators remain included in communications involving minors.</li><li>Participants may not move conversations to private social accounts or exchange unnecessary personal contact information.</li><li>Meetings use approved formats, clear goals, and documented schedules.</li></ul></section>
      <section><h2>Information mentors can see</h2><p>After approval, a mentor may receive only the information needed for the match, such as broad age range, general region, interests, and goals. School, home address, precise location, private contact details, and unrelated personal information remain private.</p></section>
      <section><h2>Report a concern</h2><p>Participants and guardians may pause or end a match at any time. Use the <Link href="/about/contact">contact form</Link> to report a concern. If someone is in immediate danger, contact local emergency services.</p></section>
      <section><h2>Current launch status</h2><p>Applications may be collected for review, but matches should not begin until screening, verified guardian consent, coordinator procedures, reporting tools, and legal review are fully active.</p></section>
    </main>
  </PageShell>;
}
