import Link from "next/link";
import { careerPaths } from "../content";
import { Icon, PageShell } from "../ui";

export default function Careers() {
  return <PageShell active="careers">
    <section className="sub-hero careers-hero"><div>
      <span className="eyebrow">MORE THAN THE COCKPIT</span>
      <h1>There’s a Place for You in Aviation</h1>
      <p>The aviation world connects flight with engineering, healthcare, law, business, technology, weather, safety, and service.</p>
      <Link className="primary-button" href="/explore">Find My Best Fit →</Link>
    </div></section>
    <section className="section">
      <div className="section-heading"><span>FROM CLEARED FOR TAKEOFF</span><h2>Where Could Aviation Take You?</h2><p>Start with what you enjoy. Your interests can lead to a role in the cockpit, at an airport, in a laboratory, or beyond Earth.</p></div>
      <div className="career-grid">{careerPaths.map(([icon,title,text])=><article key={title}><div className="round-icon"><Icon name={icon}/></div><h3>{title}</h3><p>{text}</p><Link href="/explore">Add to my roadmap →</Link></article>)}</div>
      <div className="roadmap-banner"><div><span>ISHITHA’S ADVICE</span><h2>Where you start is not always where you’ll end up.</h2><p>Aviation keeps evolving. Explore widely, follow your strengths, and stay open to careers you may not have discovered yet.</p></div><Link className="primary-button" href="/explore">Build My Roadmap →</Link></div>
    </section>
  </PageShell>;
}
