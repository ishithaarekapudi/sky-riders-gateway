import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "../../ui";
import { SubscribeForm } from "../ContactSubscribeForms";
import { mediaLogos } from "../media-logos";

export const metadata: Metadata = { title: "Ishitha Arekapudi Media and Press", description: "Explore selected interviews and media features about Ishitha Arekapudi, aviation, aerospace, youth access, and Sky Riders Gateway.", alternates: { canonical: "/about/media" } };

export default function MediaPage() {
  return <PageShell active="about">
    <section className="sub-hero media-page-hero"><div><span className="eyebrow">ISHITHA AREKAPUDI · MEDIA & PRESS</span><h1>Featured Across Media</h1><p>Selected television, podcast, newspaper, and aviation media that have interviewed or featured Ishitha and her work.</p></div></section>

    <section className="section media-logo-section">
      <div className="section-heading"><span>AS SEEN & HEARD IN</span><h2>Media that shared the story.</h2><p>Aviation, youth access, flight training, leadership, and the journey behind Sky Riders Gateway.</p></div>
      <div className="media-logo-wall">{mediaLogos.map(outlet => <article key={outlet.name}><img src={outlet.src} alt={`${outlet.name} logo`} /><span>{outlet.name}</span></article>)}</div>
    </section>

    <section className="section media-inquiry-section" id="inquiries"><div><span className="eyebrow">MEDIA INQUIRIES</span><h2>Bring the conversation to your audience.</h2><p>For interviews, speaking invitations, book inquiries, or collaborations, send the details directly through Gateway.</p><Link className="primary-button" href="/about/contact">Contact Ishitha →</Link></div><div className="media-topic-panel"><h3>Conversation areas</h3><ul><li>Youth pathways into aviation</li><li>Representation and access</li><li>Flight training and persistence</li><li>Aviation and aerospace careers</li><li>Cleared for Takeoff</li><li>Building Sky Riders Gateway</li></ul></div></section>

    <section className="section subscribe-section media-subscribe"><div><span className="eyebrow">FOLLOW THE WORK</span><h2>Stay connected to the journey.</h2><p>Join the Sky Riders list for occasional updates from the flight line and beyond.</p></div><SubscribeForm /></section>
  </PageShell>;
}
