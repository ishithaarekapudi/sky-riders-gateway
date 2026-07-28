import Link from "next/link";
import { careerPaths, slugify } from "../content";
import { Icon, PageShell } from "../ui";

const families = [
  { label: "Flight & Instruction", note: "Operate aircraft, teach new pilots, or work with remotely piloted systems.", titles: ["Professional Pilot Careers","Flight Instructor","Drone Pilot"] },
  { label: "Operations & Safety", note: "Keep people, aircraft, airports, and the national airspace moving safely.", titles: ["Air Traffic Control","Airport Operations","Flight Dispatch","Cabin Crew & Customer Experience"] },
  { label: "Engineering & Technical", note: "Design, maintain, test, and understand the systems that make flight possible.", titles: ["Aircraft Maintenance","Aeronautical Engineering","Meteorology"] },
  { label: "Business, Health & Policy", note: "Support aerospace through medicine, leadership, law, strategy, and service.", titles: ["Aerospace Medicine","Aviation Law & Business"] },
] as const;

export default function Careers() {
  return <PageShell active="careers">
    <section className="sub-hero careers-hero"><div>
      <span className="eyebrow">MORE THAN THE COCKPIT</span>
      <h1>There’s a Place for You in Aviation</h1>
      <p>The aviation world connects flight with engineering, healthcare, law, business, technology, weather, safety, and service.</p>
      <Link className="primary-button" href="/explore">Find My Best Fit →</Link>
    </div></section>
    <section className="section careers-directory">
      <div className="section-heading"><span>EXPLORE BY CAREER FAMILY</span><h2>Start With the Kind of Work That Excites You</h2><p>You do not need to choose one job today. Explore a family of work, compare the roles inside it, and follow what keeps you curious.</p></div>
      <nav className="career-family-nav" aria-label="Career families">{families.map((family,index)=><a href={`#career-family-${index}`} key={family.label}><span>0{index+1}</span><strong>{family.label}</strong><small>{family.titles.length} pathways</small></a>)}</nav>
      {families.map((family,index)=><section className="career-family" id={`career-family-${index}`} key={family.label}>
        <header><span>0{index+1}</span><div><h2>{family.label}</h2><p>{family.note}</p></div></header>
        <div className="career-grid">{careerPaths.filter(([,title])=>family.titles.includes(title as never)).map(([icon,title,text])=><article key={title}><div className="round-icon"><Icon name={icon}/></div><div><h3><Link href={`/careers/${slugify(title)}`}>{title}</Link></h3><p>{text}</p><Link href={`/careers/${slugify(title)}`}>Explore this career →</Link></div></article>)}</div>
      </section>)}
      <div className="roadmap-banner"><div><span>ISHITHA’S ADVICE</span><h2>Where you start is not always where you’ll end up.</h2><p>Aviation keeps evolving. Explore widely, follow your strengths, and stay open to careers you may not have discovered yet.</p></div><Link className="primary-button" href="/explore">Build My Roadmap →</Link></div>
    </section>
  </PageShell>;
}
