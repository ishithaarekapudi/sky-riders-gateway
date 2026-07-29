import Link from "next/link";
import { Icon, PageShell } from "../../ui";

const gatewayPillars = [
  ["search", "See What Is Possible", "Discover aviation and aerospace careers, programs, scholarships, and communities in one clear place."],
  ["people", "Find the Right Support", "Connect curiosity with trustworthy organizations, mentors, and resources that make the next step easier to understand."],
  ["path", "Move Forward With Direction", "Turn a broad interest into personalized starting points and practical actions you can take now."],
] as const;

export default function GatewayAboutPage() {
  return (
    <PageShell active="gateway">
      <section className="sub-hero gateway-about-hero">
        <div>
          <span className="eyebrow">ABOUT SKY RIDERS GATEWAY</span>
          <h1>Our mission is not just to inform, it is to transform.</h1>
          <p>Sky Riders Gateway turns curiosity into a tangible path forward by making aviation and aerospace opportunities easier to see, understand, and pursue.</p>
          <Link className="primary-button" href="/explore">Explore Your Gateway →</Link>
        </div>
      </section>
      <section className="gateway-vision gateway-about-vision">
        <div className="vision-copy">
          <span className="eyebrow">WHY GATEWAY</span>
          <h2>The Sky Shouldn’t Have Barriers</h2>
          <p>Aviation and aerospace should feel possible for every young person, regardless of background, location, resources, or whether they already know someone in the field.</p>
          <p className="vision-mission">Gateway brings reliable guidance, organizations, scholarships, careers, and practical next steps together in one welcoming place.</p>
        </div>
        <div className="vision-roadmap-image">
          <img src="/gateway-vision-roadmap-clean.png" alt="A curved Gateway roadmap connecting Exposure, Mentorship, and Pathways" />
        </div>
      </section>
      <section className="mission-statement gateway-mission-statement">
        <div className="mission-visual" aria-hidden="true">
          <img src="/brand/sky-riders-mark-v3.png" alt="" />
          <span>Curiosity becomes possibility.<br />Possibility becomes a path.</span>
        </div>
        <div className="mission-copy">
          <span>THE NARRATIVE WE ARE CHANGING</span>
          <blockquote>Sky Riders is here to rewrite the narrative.</blockquote>
          <p>Talent is everywhere, but access to information, mentors, training, and opportunity is not. Gateway helps young people recognize that there is a place for them in aviation and aerospace, then shows them a practical way forward.</p>
        </div>
      </section>
      <section className="section gateway-about-pillars">
        <div className="section-heading">
          <span>HOW IT HELPS</span>
          <h2>From Curiosity to a Real Next Step</h2>
        </div>
        <div className="collection-grid">
          {gatewayPillars.map(([icon, title, text]) => (
            <article key={title}>
              <div className="square-icon"><Icon name={icon} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="blue-callout">
          <Icon name="plane" />
          <div><h2>Every journey begins differently.</h2><p>Gateway meets people where they are, whether they are five years old, changing careers, already training, or simply curious about what exists.</p></div>
          <Link className="small-button" href="/explore">Find My Starting Point</Link>
        </div>
      </section>
    </PageShell>
  );
}
