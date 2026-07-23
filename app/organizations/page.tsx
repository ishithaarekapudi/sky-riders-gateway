import Link from "next/link";
import { SaveButton } from "../components/SaveButton";
import { organizations, slugify } from "../content";
import { Icon, PageShell } from "../ui";

export default function Organizations() {
  return <PageShell active="organizations">
    <section className="sub-hero org-hero"><div>
      <span className="eyebrow">COMMUNITY OPENS DOORS</span>
      <h1>Find Your Aviation Community</h1>
      <p>Educational opportunities, mentors, flights, scholarships, and welcoming communities can make the first step much clearer.</p>
      <a className="primary-button" href="#organization-directory">Explore Organizations →</a>
    </div></section>
    <section className="section" id="organization-directory">
      <div className="section-heading"><span>FROM CLEARED FOR TAKEOFF</span><h2>Opportunity Starts With Connection</h2><p>Begin with these national and community organizations, then look for local chapters, clubs, airports, and flight schools near you.</p></div>
      <div className="org-grid">{organizations.map(([title,text,tags],i)=><article key={title}><div className="square-icon"><Icon name={i>9?"plane":i>6?"people":"globe"}/></div><div><h3><Link href={`/organizations/${slugify(title)}`}>{title}</Link></h3><p>{text}</p><div className="tag-row">{tags.map(tag=><span key={tag}>{tag}</span>)}</div><div className="card-actions"><Link href={`/organizations/${slugify(title)}`}>View Details →</Link><SaveButton id={`organization:${title}`} label="Save"/></div></div></article>)}</div>
      <div className="blue-callout"><Icon name="handshake"/><div><h2>Do not overlook your local aviation community.</h2><p>Smaller clubs and nearby flight organizations can offer mentoring, volunteer experience, discovery flights, and local funding with less competition.</p></div><Link className="small-button" href="/explore">Build My Network</Link></div>
    </section>
  </PageShell>;
}
