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
        <Header active="home" originalLogo />
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

      <section className="gateway-vision">
        <div className="vision-copy">
          <span>WHY GATEWAY</span>
          <h2>The Sky Shouldn’t Have Barriers</h2>
          <p>Aviation should feel possible for every young person—regardless of background, location, or resources. Sky Riders Gateway brings the guidance, community, and opportunities together in one clear place.</p>
          <p className="vision-mission">Our mission is not just to inform—it is to transform curiosity into a tangible path forward.</p>
          <Link className="vision-button" href="/about#guidance">See Our Vision <span aria-hidden="true">→</span></Link>
        </div>
        <div className="vision-roadmap" aria-label="Gateway roadmap from exposure to pathways">
          <div className="vision-flight" aria-hidden="true"><Icon name="plane" /></div>
          <svg className="roadmap-line" viewBox="0 0 620 520" preserveAspectRatio="none" aria-hidden="true">
            <path d="M90 455 C250 410 330 340 240 280 C150 220 250 170 390 126 C475 100 520 62 540 30" />
            <path className="roadmap-dash" d="M90 455 C250 410 330 340 240 280 C150 220 250 170 390 126 C475 100 520 62 540 30" />
          </svg>
          {[
            ["search", "Exposure", "See what is possible", "exposure"],
            ["people", "Mentorship", "Learn from people who have been there", "mentorship"],
            ["path", "Pathways", "Know exactly where to go next", "pathways"],
          ].map(([icon, title, text, position]) => (
            <div className={`roadmap-point roadmap-${position}`} key={title}>
              <div className="roadmap-icon"><Icon name={icon} /></div>
              <div><h3>{title}</h3><p>{text}</p></div>
            </div>
          ))}
          <div className="vision-sun" aria-hidden="true" />
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
