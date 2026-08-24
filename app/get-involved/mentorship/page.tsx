import Link from "next/link";
import type { Metadata } from "next";
import { MentorshipApplicationForms } from "../../components/CommunityForms";
import { Icon, PageShell } from "../../ui";

export const metadata: Metadata = { title: "Aviation and Aerospace Mentorship", description: "Apply to become a reviewed Sky Riders Gateway mentor or request aviation and aerospace guidance through a safeguarded matching process.", alternates: { canonical: "/get-involved/mentorship" } };

export default function MentorshipPage() {
  return <PageShell active="get-involved">
    <section className="community-page-heading mentorship-heading"><Link href="/get-involved">← Get Involved</Link><span>GATEWAY MENTORSHIP</span><h1>Experience Becomes a Path Forward</h1><p>Gateway brings thoughtful mentors and motivated mentees together through reviewed, supported, and goal-focused matches.</p></section>
    <section className="mentor-process">
      <div><span>1</span><Icon name="document" /><strong>Apply</strong><p>Tell us about your experience, interests, goals, and availability.</p></div>
      <div><span>2</span><Icon name="search" /><strong>Review</strong><p>Gateway reviews applications, references, safety requirements, and fit.</p></div>
      <div><span>3</span><Icon name="people" /><strong>Match</strong><p>A coordinator suggests a match and confirms that everyone wants to proceed.</p></div>
      <div><span>4</span><Icon name="path" /><strong>Meet and Grow</strong><p>Set goals, meet consistently, and keep communication open and accountable.</p></div>
    </section>
    <section className="mentor-form-section">
      <div className="mentor-safety-card"><span>SAFETY BY DESIGN</span><h2>Mentorship should feel encouraging and secure.</h2><ul><li>Mentors are reviewed before matching.</li><li>Profiles are never publicly searchable.</li><li>Parents or guardians are included for minors.</li><li>No private adult-to-minor messaging.</li><li>Matches have clear goals, boundaries, and reporting options.</li></ul><p>Gateway will begin arranging matches only after its screening, consent, privacy, and communication systems are active.</p></div>
      <MentorshipApplicationForms />
    </section>
  </PageShell>;
}
