import { manuscriptResources } from "../content";
import { Icon, PageShell } from "../ui";

export default function Resources() {
  return <PageShell active="resources">
    <section className="sub-hero resources-hero"><div>
      <span className="eyebrow">LEARN. CONNECT. TAKE FLIGHT.</span>
      <h1>Your Aviation Resource Hub</h1>
      <p>Practical guidance adapted from Ishitha Arekapudi’s <i>Cleared for Takeoff</i>.</p>
      <label className="search-box"><Icon name="search"/><input placeholder="What do you want to learn?"/></label>
    </div></section>
    <section className="section">
      <div className="section-heading"><span>CLEARED FOR TAKEOFF</span><h2>Start With the Information You Need Most</h2><p>You do not need to understand the entire aviation world at once. Choose the next useful step and build from there.</p></div>
      <div className="collection-grid">{manuscriptResources.map(([icon,title,text,action])=><article key={title}><div className="square-icon"><Icon name={icon}/></div><h3>{title}</h3><p>{text}</p><button>{action} →</button></article>)}</div>
      <section className="mentor-promo"><div><span className="eyebrow">ISHITHA’S CORE ADVICE</span><h2>Start early, but let your plan change.</h2><p>Research thoroughly, find mentors, turn long-term goals into manageable milestones, seek practical experience, and remain resilient when progress feels slow.</p><button className="primary-button">Build My First Steps →</button></div><div className="mentor-visual"><Icon name="path"/><span>CURIOSITY → COMMUNITY → ACTION</span></div></section>
    </section>
  </PageShell>;
}
