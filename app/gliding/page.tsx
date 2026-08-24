import type { Metadata } from "next";
import Link from "next/link";
import { Icon, PageShell } from "../ui";

export const metadata: Metadata = {
  title: "Gliding and Soaring for Young Pilots",
  description: "Learn how to begin glider training, find soaring clubs, and discover youth gliding scholarships and programs.",
  alternates: { canonical: "/gliding" },
  openGraph: { title: "Gliding and Soaring for Young Pilots | Sky Riders Gateway", description: "Learn how to begin glider training, find soaring clubs, and discover youth gliding scholarships and programs.", url: "/gliding" },
};

const reasons = [
  ["cloud", "Read the sky", "Learn how wind, lift, clouds, and terrain shape every flight."],
  ["airplane", "Fly the aircraft", "Build coordination, judgment, and energy-management skills with an instructor."],
  ["people", "Join a community", "Meet instructors, mentors, youth pilots, and volunteers at soaring clubs."],
] as const;

export default function GlidingPage() {
  return (
    <PageShell active="explore">
      <section className="gliding-page-hero">
        <div>
          <span>GLIDING &amp; SOARING</span>
          <h1>Flight Begins<br />With the Air Around You.</h1>
          <p>Gliders turn weather, judgment, and precise aircraft control into a quiet, hands-on way to enter aviation.</p>
          <div><a className="primary-button" href="https://www.ssa.org/where-to-fly-map/" target="_blank" rel="noreferrer">Find a Place to Fly ↗</a><Link href="/scholarships?filter=Gliders">Explore Glider Scholarships</Link></div>
        </div>
      </section>

      <section className="gliding-intro">
        <div className="section-heading"><span>WHY TRY GLIDING?</span><h2>A Different First Step Into Aviation</h2><p>You do not need prior flight experience to take a lesson. A certified instructor flies with you while you learn how a sailplane is launched, controlled, and safely returned to the runway.</p></div>
        <div className="gliding-reason-grid">{reasons.map(([icon,title,text])=><article key={title}><Icon name={icon}/><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="gliding-milestones">
        <div><span>U.S. TRAINING MILESTONES</span><h2>You Can Start Before You Can Solo.</h2><p>The FAA does not set a minimum age to begin lessons with an instructor. A student pilot certificate for glider solo flight is available at 14, and a private glider certificate is available at 16.</p></div>
        <ol><li><b>01</b><div><strong>Take an introductory flight</strong><span>Visit a local club or commercial soaring site and fly with an instructor.</span></div></li><li><b>02</b><div><strong>Train toward solo</strong><span>Build safe launch, landing, aircraft-control, and decision-making skills.</span></div></li><li><b>03</b><div><strong>Keep building your pathway</strong><span>Continue toward a certificate, competitions, scholarships, mentoring, or powered flight.</span></div></li></ol>
      </section>

      <section className="gliding-opportunities">
        <div className="section-heading"><span>STARTING POINTS</span><h2>Turn Interest Into a First Flight</h2></div>
        <div>
          <article><small>FIND A CLUB</small><h3>Soaring Society of America</h3><p>Use the national Where to Fly map to find clubs, commercial glider schools, and instruction.</p><a href="https://www.ssa.org/where-to-fly-map/" target="_blank" rel="noreferrer">Open the official map ↗</a></article>
          <article><small>FIND FUNDING</small><h3>Glider Scholarships</h3><p>Compare SSA and WSPA awards for beginner training, certificates, camps, and advanced ratings.</p><Link href="/scholarships?filter=Gliders">View glider scholarships →</Link></article>
          <article><small>FIND COMMUNITY</small><h3>Women’s Soaring Pilots Association</h3><p>Discover scholarships, seminars, mentorship, and a community supporting women in soaring.</p><Link href="/organizations/women-s-soaring-pilots-association">Explore WSPA →</Link></article>
        </div>
      </section>
    </PageShell>
  );
}
