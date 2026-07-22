import Link from "next/link";
import { Footer, Header, Icon } from "./ui";

const features = [
  ["user", "Personalized for You", "Tailored to your interests and goals"],
  ["cap", "Scholarships", "Find funding for your dreams"],
  ["people", "Mentors", "Connect with aviation professionals"],
  ["globe", "Organizations", "Discover programs and communities"],
  ["calendar", "Events", "Find events and opportunities"],
] as const;

const aviationPaths = [
  ["✈", "Pilot", "Fly the skies and lead the way."],
  ["🚀", "Space", "Explore beyond our atmosphere."],
  ["⚙", "Engineer", "Design, build, and innovate."],
  ["☁", "Meteorology", "Understand the power of weather."],
  ["🛠", "Maintenance", "Keep aircraft safe and soaring."],
  ["⌘", "Drones", "The future is unmanned."],
] as const;

const journeySteps = [
  ["Tell us about", "yourself"],
  ["Receive personalized", "opportunities"],
  ["Save your", "favorites"],
  ["Build your", "aviation future"],
] as const;

export default function Home() {
  return (
    <main>
      <section className="live-home" aria-label="Sky Riders Gateway introduction">
        <Header originalLogo />
        <div className="gateway-stage">
          <img className="gateway-art" src="/hero-gateway-live.jpg" alt="A runway beneath a monumental gateway arch, with an airplane approaching at sunrise" />
          <div className="gateway-shade" aria-hidden="true" />
          <div className="hero-copy">
            <h1>Welcome to<br />Sky Riders Gateway</h1>
            <p>Connecting students to<br />opportunities in aviation.</p>
            <Link className="primary-button" href="/explore">Start My Journey <span aria-hidden="true">→</span></Link>
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

      <section className="homepage-pathways">
        <div className="section-heading"><span>YOUR JOURNEY</span><h2>A Clear Path to Aviation</h2><p>Explore the many ways you can build a future in flight.</p></div>
        <div className="aviation-path-grid">
          {aviationPaths.map(([symbol, title, text]) => (
            <Link href="/careers" className="aviation-path-card" key={title}>
              <span className="path-symbol" aria-hidden="true">{symbol}</span>
              <strong>{title}</strong>
              <small>{text}</small>
            </Link>
          ))}
        </div>
        <div className="how-it-works">
          <h3>How It Works</h3>
          <div className="journey-line" aria-hidden="true" />
          <div className="journey-steps">
            {journeySteps.map(([lineOne, lineTwo], index) => (
              <div className="journey-step" key={lineOne}>
                <span>{index + 1}</span>
                <strong>{lineOne}<br />{lineTwo}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="featured-organizations">
          <div className="featured-heading"><h3>Featured Organizations</h3><Link href="/organizations">View All →</Link></div>
          <div className="organization-logo-row">
            <Link href="/organizations" className="org-mark eaa-mark"><b>EAA</b></Link>
            <Link href="/organizations" className="org-mark cap-mark"><b>△</b><span>CIVIL AIR PATROL<small>U.S. AIR FORCE AUXILIARY</small></span></Link>
            <Link href="/organizations" className="org-mark eagles-mark"><b>YOUNG<br />EAGLES</b></Link>
            <Link href="/organizations" className="org-mark women-mark"><b>Women in Aviation</b><small>INTERNATIONAL</small></Link>
            <Link href="/organizations" className="org-mark nasa-mark"><b>NASA</b></Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
