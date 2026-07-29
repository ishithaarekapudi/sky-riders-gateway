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
          <h1>A Clearer Way Into Aviation and Aerospace</h1>
          <p>Gateway brings scattered opportunities, guidance, and pathways together so young people can spend less time wondering where to begin.</p>
          <Link className="primary-button" href="/explore">Explore Your Gateway →</Link>
        </div>
      </section>
      <section className="section gateway-about-intro">
        <div>
          <span className="eyebrow">WHY GATEWAY</span>
          <h2>The sky should not have barriers.</h2>
          <p>Aviation and aerospace should feel possible for every young person, regardless of background, location, resources, or whether they already know someone in the field.</p>
          <p>Sky Riders Gateway makes pathways easier to see, understand, and pursue by gathering reliable guidance, organizations, scholarships, careers, and practical next steps in one welcoming place.</p>
        </div>
        <blockquote>Sky Riders is here to rewrite the narrative.<small>Curiosity can become possibility, and possibility can become a path.</small></blockquote>
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
