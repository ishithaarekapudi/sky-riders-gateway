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

const gatewayBenefits = [
  ["user", "Personalized for You", "Tailored to your interests and goals."],
  ["cap", "Scholarships", "Find funding for your dreams."],
  ["people", "Mentors", "Connect with aviation and aerospace professionals."],
  ["globe", "Organizations", "Discover programs and communities."],
  ["calendar", "Events", "Find events and opportunities."],
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
          <div className="gateway-benefit-strip" aria-label="What Sky Riders Gateway helps you discover">
            {gatewayBenefits.map(([icon, title, text]) => (
              <article key={title}>
                <span aria-hidden="true"><Icon name={icon} /></span>
                <div><strong>{title}</strong><small>{text}</small></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="homepage-guide">
        <div className="how-it-works">
          <span className="guide-eyebrow">HOW IT WORKS</span>
          <h3>Four Steps From Curiosity to Direction</h3>
          <p>Tell us what interests you, then Gateway helps turn that starting point into opportunities and a practical plan.</p>
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

      <section className="mission-statement homepage-narrative">
        <div className="mission-visual" aria-hidden="true">
          <img src="/brand/sky-riders-mark-v3.png" alt="" />
          <span>Curiosity becomes possibility.<br />Possibility becomes a path.</span>
        </div>
        <div className="mission-copy">
          <span>WHY THIS MATTERS</span>
          <blockquote>Sky Riders is here to rewrite the narrative.</blockquote>
          <p>Talent is everywhere, but access to information, mentors, training, and opportunity is not. Gateway helps young people recognize that there is a place for them in aviation and aerospace, then shows them a practical way forward.</p>
        </div>
      </section>

      <section className="homepage-pathways">
        <div className="section-heading"><span>EXPLORE YOUR PATH</span><h2>Find Your Place in Aviation and Aerospace</h2><p>These six areas are starting points, not limits. Choose what catches your attention to understand the work, skills, and possibilities connected to it.</p></div>
        <div className="aviation-path-grid">
          {aviationPaths.map(([icon, title, text]) => (
            <article className="aviation-path-card" key={title}>
              <span className="path-symbol" aria-hidden="true"><Icon name={icon} /></span>
              <strong>{title}</strong>
              <small>{text}</small>
            </article>
          ))}
        </div>
        <div className="homepage-journey-preview">
          <div>
            <span>YOUR PERSONAL GATEWAY</span>
            <h3>Answer a few questions and see what fits you.</h3>
            <p>Gateway matches your interests and current stage with relevant careers, programs, scholarships, organizations, and next steps.</p>
            <Link className="primary-button" href="/explore">Start My Journey →</Link>
            <small>◷ &nbsp; Takes less than 3 minutes!</small>
          </div>
          <div className="journey-preview-card" aria-hidden="true">
            <header><span>Question 3 of 7</span><b>43%</b></header>
            <div className="preview-progress"><i /></div>
            <strong>What interests you most?</strong>
            <div>{aviationPaths.slice(0, 4).map(([icon, title]) => <span key={title}><Icon name={icon} /><small>{title}</small></span>)}</div>
          </div>
        </div>
      </section>

      <section className="gliding-spotlight" aria-labelledby="gliding-spotlight-title">
        <div className="gliding-spotlight-art" aria-hidden="true">
          <span className="glider-wing" />
          <span className="glider-trail" />
          <small>PATHWAY SPOTLIGHT</small>
        </div>
        <div className="gliding-spotlight-copy">
          <span>DISCOVER SOARING</span>
          <h2 id="gliding-spotlight-title">Your First Flight Could Be Without an Engine.</h2>
          <p>Start flying sooner than you think. Gliding gives young people a hands-on introduction to aircraft control, weather, judgment, and the aviation community.</p>
          <div className="gliding-age-row" aria-label="United States glider age milestones">
            <div><strong>No FAA minimum</strong><small>Begin lessons with an instructor</small></div>
            <div><strong>14</strong><small>Eligible to solo a glider</small></div>
            <div><strong>16</strong><small>Eligible for a private glider certificate</small></div>
          </div>
          <div className="gliding-spotlight-actions">
            <Link className="primary-button" href="/gliding">Explore Gliding →</Link>
            <Link className="gliding-secondary-link" href="/explore?interest=Gliding%20%26%20Soaring#near-you">Find a Soaring Club Near Me</Link>
          </div>
          <small className="gliding-source-note">U.S. age milestones. Training and local program requirements vary.</small>
        </div>
      </section>

      <section className="homepage-partner-section" aria-labelledby="homepage-partner-title">
        <div className="homepage-partner-heading">
          <span>BUILDING THE GATEWAY TOGETHER</span>
          <h2 id="homepage-partner-title">Partnered Organizations</h2>
          <p>Meet aviation and aerospace organizations helping expand access to education, mentorship, scholarships, and hands-on experiences.</p>
        </div>
        <div className="homepage-partner-logos homepage-partner-placeholders" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <div className="homepage-partner-placeholder" key={index} />
          ))}
        </div>
        <Link className="homepage-partner-link" href="/organizations">Meet Our Partnered Organizations →</Link>
      </section>
      <Footer />
    </main>
  );
}
