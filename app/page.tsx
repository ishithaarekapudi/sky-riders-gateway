import Link from "next/link";
import { Footer, Header, Icon } from "./ui";

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
        </div>
      </section>

      <section className="homepage-pathways">
        <div className="section-heading"><span>YOUR STARTING POINT</span><h2>Find Your Place in Aviation and Aerospace</h2><p>Sky Riders Gateway is a pathway finder. Start with an area that interests you, learn what it can lead to, then use Explore to discover matching careers, programs, scholarships, organizations, and practical next steps.</p></div>
        <div className="pathway-explainer" aria-label="How to use this resource">
          <div><strong>1</strong><span><b>Choose an interest</b>Begin with the part of aviation or aerospace that catches your attention.</span></div>
          <div><strong>2</strong><span><b>See where it can lead</b>Understand the careers, training, and communities connected to it.</span></div>
          <div><strong>3</strong><span><b>Build your next step</b>Use Explore to receive opportunities that fit your age, location, and goals.</span></div>
        </div>
        <div className="aviation-path-grid">
          {aviationPaths.map(([icon, title, text]) => (
            <article className="aviation-path-card" key={title}>
              <span className="path-symbol" aria-hidden="true"><Icon name={icon} /></span>
              <strong>{title}</strong>
              <small>{text}</small>
            </article>
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
