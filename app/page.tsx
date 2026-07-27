import Link from "next/link";
import { Footer, Header, Icon } from "./ui";

const features = [
  ["user", "Personalized for You", "Tailored to your interests and goals"],
  ["cap", "Scholarships", "Find funding for your dreams"],
  ["people", "Mentors", "Connect with aviation and aerospace professionals"],
  ["globe", "Organizations", "Discover programs and communities"],
  ["calendar", "Events", "Find events and opportunities"],
] as const;

const aviationPaths = [
  ["airplane", "Pilot", "Learn how to begin a path toward the flight deck."],
  ["spacecraft", "Space", "Explore spacecraft, missions, and careers beyond Earth."],
  ["gear", "Aerospace Engineering", "Design and build the systems that make flight possible."],
  ["cloud", "Weather & Climate", "Understand the atmosphere that shapes every mission."],
  ["wrench", "Aircraft Maintenance", "Help keep aircraft safe, reliable, and ready to fly."],
  ["drone", "Drones & Robotics", "Build and operate the next generation of flight technology."],
] as const;

const journeySteps = [
  ["Choose your", "interests"],
  ["Tell us about", "yourself"],
  ["Review your", "best matches"],
  ["Save and plan", "your next steps"],
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
            <p>Connecting students to opportunities in<br />aviation and aerospace.</p>
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
          <p>Aviation and aerospace should feel possible for every young person, regardless of background, location, or resources. Sky Riders Gateway brings guidance, community, and opportunities together in one clear place.</p>
          <p className="vision-mission">Our mission is not just to inform. It is to transform curiosity into a tangible path forward.</p>
          <Link className="vision-button" href="#mission">See Our Vision <span aria-hidden="true">→</span></Link>
        </div>
        <div className="vision-roadmap-image">
          <img src="/gateway-vision-roadmap-clean.png" alt="A curved Gateway roadmap connecting Exposure, Mentorship, and Pathways" />
        </div>
      </section>

      <section className="mission-statement" id="mission">
        <div className="mission-visual" aria-hidden="true">
          <img src="/brand/sky-riders-mark-v3.png" alt="" />
          <span>Curiosity becomes possibility.<br />Possibility becomes a path.</span>
        </div>
        <div className="mission-copy">
          <span>OUR MISSION</span>
          <blockquote>Sky Riders is here to rewrite the narrative.</blockquote>
          <p>Sky Riders Gateway exists to make aviation and aerospace pathways easier to see, understand, and pursue. We connect young people with trustworthy guidance, mentors, scholarships, organizations, and practical next steps so curiosity can become a real future.</p>
        </div>
      </section>

      <section className="homepage-pathways">
        <div className="section-heading"><span>EXPLORE YOUR FUTURE</span><h2>Find Your Place in Aviation and Aerospace</h2><p>Choose an area that interests you. Then Gateway will help you discover relevant careers, programs, scholarships, and clear next steps.</p></div>
        <div className="aviation-path-grid">
          {aviationPaths.map(([icon, title, text]) => (
            <Link href="/careers" className="aviation-path-card" key={title}>
              <span className="path-symbol" aria-hidden="true"><Icon name={icon} /></span>
              <strong>{title}</strong>
              <small>{text}</small>
            </Link>
          ))}
        </div>
        <div className="how-it-works">
          <h3>How Gateway Guides You</h3>
          <p>Start with what interests you. Gateway turns that interest into personalized opportunities and practical next steps.</p>
          <div className="journey-steps">
            <div className="journey-line" aria-hidden="true" />
            {journeySteps.map(([lineOne, lineTwo], index) => (
              <div className="journey-step" key={lineOne}>
                <span>{index + 1}</span>
                <strong>{lineOne}<br />{lineTwo}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
