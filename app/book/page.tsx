import Link from "next/link";
import { PageShell } from "../ui";

export default function BookPage() {
  return <PageShell active="about">
    <section className="book-page-hero">
      <div className="book-cover"><span>CLEARED FOR</span><strong>TAKEOFF</strong><small>Bridging Gaps to Access<br/>for Youth in Aviation</small><i>ISHITHA AREKAPUDI</i></div>
      <div><span className="eyebrow">THE BOOK BEHIND SKY RIDERS GATEWAY</span><h1>Cleared for Takeoff</h1><p className="book-deck">A practical roadmap for young people ready to explore aviation and aerospace, even when the first step is not obvious.</p><a className="primary-button" href="#purchase">Buy From Sky Riders →</a></div>
    </section>
    <section className="section book-excerpt"><span className="eyebrow">AN EXCERPT</span><h2>The journey begins here.</h2><blockquote>“Consider this book your roadmap, a way to help you find direction, gain confidence, and explore all the opportunities that aviation and space have to offer. The future of aviation and space is waiting, and it’s calling for people like you to answer. I invite you to take on this challenge, to dream big, and to be part of humanity’s next great venture. Together, let’s clear the way for takeoff.”</blockquote><p>From the preface of <i>Cleared for Takeoff</i> by Ishitha Arekapudi.</p></section>
    <section className="section book-purchase" id="purchase"><div><span className="eyebrow">ORDER DIRECTLY</span><h2>Bring the roadmap with you.</h2><p>Online checkout is being prepared. This space is ready for direct book purchases once payment and shipping are connected.</p></div><div className="purchase-panel"><strong>Cleared for Takeoff</strong><span>Print edition</span><button disabled>Checkout Coming Soon</button><Link href="/account">Create an account for launch updates →</Link></div></section>
  </PageShell>;
}
