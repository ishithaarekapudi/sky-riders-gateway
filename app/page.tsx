import Link from "next/link";
import { Footer, Header, Icon, PillarCard } from "./ui";

const features = [
  ["user", "Personalized for You", "Tailored to your interests and goals"],
  ["cap", "Scholarships", "Find funding for your dreams"],
  ["people", "Mentors", "Connect with aviation professionals"],
  ["globe", "Organizations", "Discover programs and communities"],
  ["calendar", "Events", "Find events and opportunities"],
] as const;

const resources = [
  ["user", "Personalized Guidance", "Get recommendations based on your interests, goals, and stage."],
  ["video", "Live Mentor Sessions", "Join live Q&As and small-group sessions with aviation professionals."],
  ["document", "Career Guide", "Explore career paths, skills, and education requirements."],
  ["headphones", "Podcasts & Stories", "Hear real stories from people across the world of aviation."],
  ["presentation", "School Talks", "Bring aviation education directly to your school or organization."],
  ["handshake", "Partnership Opportunities", "Help expand aviation access in communities nationwide."],
] as const;

export default function Home() {
  return (
    <main>
      <div className="concept-pill">SKY RIDERS GATEWAY</div>
      <section className="hero-shell">
        <Header />
        <div className="gateway-stage">
          <img className="gateway-art" src="/hero-gateway.png" alt="A runway beneath a monumental gateway arch, with an airplane approaching at sunrise" />
          <div className="gateway-shade" aria-hidden="true" />
          <div className="hero-copy">
            <h1>Welcome to<br />Sky Riders Gateway</h1>
            <p>Connecting students to<br />opportunities in aviation.</p>
            <Link className="primary-button" href="/explore">Start My Journey <span>→</span></Link>
            <small>◷ &nbsp; Takes less than 3 minutes!</small>
          </div>
          <div className="feature-row">
            {features.map(([icon, title, text]) => (
              <Link href={title === "Scholarships" ? "/scholarships" : title === "Organizations" ? "/organizations" : title === "Mentors" ? "/resources" : "/explore"} className="feature-item" key={title}>
                <Icon name={icon} /><strong>{title}</strong><span>{text}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section light-section">
        <div className="section-heading"><span>YOUR JOURNEY</span><h2>A Clear Path to Aviation</h2><p>We connect students to opportunities, mentors, and resources that turn curiosity into a career.</p></div>
        <div className="pillar-grid">
          <PillarCard icon="telescope" title="Exposure" text="Discover aviation through hands-on experiences." bullets={["Hands-on STEM experiences", "Aviation events & competitions", "School clubs & simulators"]} />
          <PillarCard icon="people" title="Mentorship" text="Learn from those who have paved the way." bullets={["Connect with pilots", "Learn from engineers", "Guidance from aviation experts"]} />
          <PillarCard icon="path" title="Pathways" text="Build your future with structure and support." bullets={["Structured roadmaps", "Scholarships & funding", "Real-world opportunities"]} />
        </div>
      </section>

      <section className="section navy-section">
        <div className="section-heading inverse"><span>THE GATEWAY PLATFORM</span><h2>Everything You Need to Move Forward</h2><p>Resources and support designed to help you take the next step with confidence.</p></div>
        <div className="resource-grid">
          {resources.map(([icon,title,text]) => <article key={title}><Icon name={icon} /><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="impact-section">
        <div className="section-heading inverse"><span>OUR VISION</span><h2>Building a More Inclusive Future in Aviation</h2></div>
        <div className="impact-grid">
          <div><Icon name="people" /><strong>10,000+</strong><span>Students empowered to explore</span></div>
          <div><Icon name="school" /><strong>100+</strong><span>School partners nationwide</span></div>
          <div><Icon name="globe" /><strong>Nationwide</strong><span>Access from every community</span></div>
        </div>
      </section>

      <section className="section partner-section">
        <div className="section-heading"><span>COLLABORATION</span><h2>Proudly Building With Aviation Communities</h2></div>
        <div className="partner-row">{["Schools", "Flight Clubs", "STEM Programs", "Mentor Networks", "Community Partners"].map(x=><div key={x}><Icon name="wing" /><span>{x}</span></div>)}</div>
        <div className="final-cta"><div><h2>Ready to find your path?</h2><p>Join students already exploring their future in aviation.</p><Link className="primary-button" href="/explore">Start My Journey →</Link></div></div>
      </section>
      <Footer />
    </main>
  );
}
