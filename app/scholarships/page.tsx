"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SaveButton } from "../components/SaveButton";
import { scholarships, slugify } from "../content";
import { Icon, PageShell } from "../ui";

const filters = ["All Opportunities","Flight Training","Gliders","College","Youth Programs"] as const;
const sponsor = (title:string) => /EAA|Ray Aviation|Harrison Ford|Adapt to Fly/.test(title) ? "EAA"
  : /AOPA/.test(title) ? "AOPA"
  : /Civil Air Patrol/.test(title) ? "CAP"
  : /Ninety-Nines|Amelia Earhart/.test(title) ? "THE 99s"
  : /Soaring Society|Kolstad|Purduski/.test(title) ? "SSA"
  : /Women’s Soaring/.test(title) ? "WSPA"
  : /Astronaut/.test(title) ? "ASF" : "FLIGHT FUNDING";
const sponsorLogo = (title:string) => /EAA|Ray Aviation|Harrison Ford|Adapt to Fly/.test(title)
  ? "https://www.eaa.org/-/media/Images/EAA/Chapters/resources/YE_logo_color-png.png?o=1"
  : /Civil Air Patrol/.test(title)
    ? "https://www.gocivilairpatrol.com/local/public/shared/assets/images/websites/CAP-2017-logo-horizontal-optimized-d73f31575f10142a77f0888cdfb36256.png"
    : "";

export default function Scholarships() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All Opportunities");
  const visible = useMemo(() => scholarships.filter(([,title,,tags]) => {
    const text = `${title} ${tags}`.toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase());
    const matchesFilter = filter === "All Opportunities"
      || (filter === "Gliders" && /glider|soaring/i.test(text))
      || (filter === "College" && /college|post-secondary/i.test(text))
      || (filter === "Youth Programs" && /age|youth|high school|cadet/i.test(text))
      || (filter === "Flight Training" && !/college|post-secondary/i.test(text));
    return matchesQuery && matchesFilter;
  }), [query, filter]);

  return <PageShell active="scholarships">
    <section className="sub-hero scholarships-hero"><div>
      <h1>Fund Your Aviation Journey</h1>
      <p>Explore flight training, glider, college, technical, and diversity-focused funding gathered in <i>Cleared for Takeoff</i>.</p>
      <label className="search-box"><Icon name="search"/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search scholarships"/></label>
      <div className="filter-row">{filters.map(x=><button className={filter===x?"active":""} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div>
    </div></section>
    <section className="directory scholarship-directory">
      <div className="directory-heading"><div><span className="eyebrow">SEARCH BY YOUR NEXT STEP</span><h2>Scholarship Starting Points</h2></div><span>Showing {visible.length} of {scholarships.length}</span></div>
      <p className="data-note">*Awards, eligibility, and deadlines can change. Always verify the current application cycle on the sponsoring organization’s official website before applying.</p>
      <div className="scholar-layout"><div className="scholar-grid">{visible.map(([,title,amount,tags])=><article className="scholar-card" key={title}>
        <div className="scholar-sponsor">{sponsorLogo(title) ? <img src={sponsorLogo(title)} alt="" /> : <strong>{sponsor(title)}</strong>}</div>
        <div className="scholar-copy"><span className="scholar-type">{tags}</span><h3><Link href={`/scholarships/${slugify(title)}`}>{title}</Link></h3><div className="scholar-meta"><strong>{amount}</strong><span>Deadline: verify current cycle</span></div><div className="card-actions"><Link href={`/scholarships/${slugify(title)}`}>View scholarship →</Link><SaveButton id={`scholarship:${title}`} label="Save"/></div></div>
      </article>)}</div>
      <aside className="match-card"><span className="eyebrow">APPLICATION DESK</span><div className="round-icon"><Icon name="user"/></div><h2>Build a stronger application</h2><p>Check eligibility first, track deadlines, save reusable answers, and tell the story behind your aviation goal.</p><a className="small-button" href="/explore">Find My Matches →</a></aside></div>
    </section>
  </PageShell>;
}
