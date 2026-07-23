import { organizations } from "../content";
import { Icon, PageShell } from "../ui";

export default function Organizations() {
  return <PageShell active="organizations">
    <section className="sub-hero org-hero"><div>
      <span className="eyebrow">COMMUNITY OPENS DOORS</span>
      <h1>Find Your Aviation Community</h1>
      <p>Educational opportunities, mentors, flights, scholarships, and welcoming communities can make the first step much clearer.</p>
      <button className="primary-button">Explore Organizations →</button>
    </div></section>
    <section className="section">
      <div className="section-heading"><span>FROM CLEARED FOR TAKEOFF</span><h2>Opportunity Starts With Connection</h2><p>Begin with these national and community organizations, then look for local chapters, clubs, airports, and flight schools near you.</p></div>
      <div className="org-grid">{organizations.map(([title,text,tags],i)=><article key={title}><div className="square-icon"><Icon name={i>9?"plane":i>6?"people":"globe"}/></div><div><h3>{title}</h3><p>{text}</p><div className="tag-row">{tags.map(tag=><span key={tag}>{tag}</span>)}</div><button>Save Organization →</button></div></article>)}</div>
      <div className="blue-callout"><Icon name="handshake"/><div><h2>Do not overlook your local aviation community.</h2><p>Smaller clubs and nearby flight organizations can offer mentoring, volunteer experience, discovery flights, and local funding with less competition.</p></div><button className="small-button">Build My Network</button></div>
    </section>
  </PageShell>;
}
