import Link from "next/link";
import { SaveButton } from "../components/SaveButton";
import { careerPaths, slugify } from "../content";
import { Icon, PageShell } from "../ui";

const families = [
  { icon: "plane", prompt: "I want to fly", label: "Flight & Instruction", note: "Operate aircraft, teach new pilots, or work with remotely piloted systems.", titles: ["Professional Pilot Careers","Flight Instructor","Drone Pilot"] },
  { icon: "tower", prompt: "I like coordination", label: "Operations & Safety", note: "Keep people, aircraft, airports, and the national airspace moving safely.", titles: ["Air Traffic Control","Airport Operations","Flight Dispatch","Cabin Crew & Customer Experience"] },
  { icon: "wrench", prompt: "I like building things", label: "Engineering & Technical", note: "Design, maintain, test, and understand the systems that make flight possible.", titles: ["Aircraft Maintenance","Aeronautical Engineering","Meteorology"] },
  { icon: "document", prompt: "I want to support the industry", label: "Business, Health & Policy", note: "Support aerospace through medicine, leadership, law, strategy, and service.", titles: ["Aerospace Medicine","Aviation Law & Business"] },
] as const;

export default function Careers() {
  return <PageShell active="careers">
    <section className="sub-hero careers-hero"><div>
      <span className="eyebrow">MORE THAN THE COCKPIT</span>
      <h1>There’s a Place for You in Aviation</h1>
      <p>The aviation world connects flight with engineering, healthcare, law, business, technology, weather, safety, and service.</p>
      <Link className="primary-button" href="/explore">Find My Best Fit →</Link>
    </div></section>
    <section className="section careers-directory" id="top">
      <div className="section-heading"><span>START WITH YOUR INTERESTS</span><h2>What kind of work sounds like you?</h2><p>Choose the statement that feels closest. You can compare several paths, and you do not need to decide on one career yet.</p></div>
      <nav className="career-family-nav" aria-label="Career interests">{families.map((family,index)=><a href={`#career-family-${index}`} key={family.label}><Icon name={family.icon}/><span>{family.prompt}</span><strong>{family.label}</strong><small>See {family.titles.length} careers →</small></a>)}</nav>
      {families.map((family,index)=><section className="career-family" id={`career-family-${index}`} key={family.label}>
        <header><div><span>{family.prompt}</span><h2>{family.label}</h2><p>{family.note}</p></div><a href="#top">Back to choices ↑</a></header>
        <div className="career-grid">{careerPaths.filter(([,title])=>family.titles.includes(title as never)).map(([icon,title,text])=><article key={title}><SaveButton id={`career:${title}`} label={title}/><div className="round-icon"><Icon name={icon}/></div><div><h3><Link href={`/careers/${slugify(title)}`}>{title}</Link></h3><p>{text}</p><Link href={`/careers/${slugify(title)}`}>Explore this career →</Link></div></article>)}</div>
      </section>)}
      <div className="roadmap-banner"><div><span>ISHITHA’S ADVICE</span><h2>Where you start is not always where you’ll end up.</h2><p>Aviation keeps evolving. Explore widely, follow your strengths, and stay open to careers you may not have discovered yet.</p></div><Link className="primary-button" href="/explore">Build My Roadmap →</Link></div>
    </section>
  </PageShell>;
}
