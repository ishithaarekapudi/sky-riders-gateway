import { scholarships } from "../content";
import { Icon, PageShell } from "../ui";

export default function Scholarships() {
  return <PageShell active="scholarships">
    <section className="sub-hero scholarships-hero"><div>
      <h1>Fund Your Aviation Journey</h1>
      <p>Explore flight training, glider, college, technical, and diversity-focused funding gathered in <i>Cleared for Takeoff</i>.</p>
      <label className="search-box"><Icon name="search"/><input placeholder="Search scholarships"/></label>
      <div className="filter-row">{["All Opportunities","Flight Training","Gliders","College","Youth Programs"].map((x,i)=><button className={i===0?"active":""} key={x}>{x}</button>)}</div>
    </div></section>
    <section className="directory">
      <div className="directory-heading"><h2>Scholarship Starting Points</h2><span>{scholarships.length} opportunities from the manuscript</span></div>
      <p className="data-note">*Awards, eligibility, and deadlines can change. Always verify the current application cycle on the sponsoring organization’s official website before applying.</p>
      <div className="scholar-layout"><div className="scholar-grid">{scholarships.map(([icon,title,amount,tags])=><article className="scholar-card" key={title}><div className="square-icon"><Icon name={icon}/></div><div><h3>{title}</h3><strong>{amount} <small>Manuscript reference</small></strong><p>▣ &nbsp; Deadline: Verify current cycle</p><span className="tag">{tags}</span><button>Save Opportunity →</button></div></article>)}</div>
      <aside className="match-card"><div className="round-icon"><Icon name="user"/></div><h2>Build a stronger application</h2><p>Check eligibility first, track deadlines, save reusable answers, and tell the story behind your aviation goal.</p><button className="small-button">Find My Matches →</button></aside></div>
    </section>
  </PageShell>;
}
