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
    <section className="scholarship-runway-hero"><div>
      <span>SCHOLARSHIPS</span>
      <h1>Fund Your Future<br/>in Flight</h1>
      <p>Discover aviation and aerospace scholarships, compare your options, and take the next step toward your goals.</p>
      <Link className="primary-button" href="/explore">Find My Matches →</Link>
    </div></section>
    <section className="scholarship-search-deck">
      <label className="scholarship-search"><Icon name="search"/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search scholarships by name, pathway, or eligibility"/></label>
      <div className="scholarship-filter-row">{filters.map(x=><button className={filter===x?"active":""} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div>
    </section>
    <section className="directory scholarship-directory runway-directory">
      <div className="directory-heading"><div><span className="eyebrow">SCHOLARSHIP DIRECTORY</span><h2>Opportunities to move you forward</h2></div><span>{visible.length} scholarships found</span></div>
      <p className="data-note">*Awards, eligibility, and deadlines can change. Always verify the current application cycle on the sponsoring organization’s official website before applying.</p>
      <div className="scholar-grid runway-scholar-grid">{visible.map(([,title,amount,tags])=><article className="scholar-card runway-scholar-card" key={title}>
        <div className="scholar-sponsor">{sponsorLogo(title) ? <img src={sponsorLogo(title)} alt="" /> : <strong>{sponsor(title)}</strong>}</div>
        <div className="scholar-copy"><span className="scholar-type">{sponsor(title)}</span><h3><Link href={`/scholarships/${slugify(title)}`}>{title}</Link></h3><div className="runway-scholar-facts"><div><span>Award</span><strong>{amount}</strong></div><div><span>Deadline</span><b>Verify current cycle</b></div><div><span>Eligibility</span><b>{tags}</b></div></div><div className="card-actions"><Link href={`/scholarships/${slugify(title)}`}>View Details</Link><Link className="scholar-apply-action" href={`/scholarships/${slugify(title)}`}>Prepare to Apply →</Link></div></div>
        <SaveButton id={`scholarship:${title}`} label={title}/>
      </article>)}</div>
      <div className="scholarship-account-cta"><Icon name="plane"/><div><span>YOUR PERSONAL FUNDING DASHBOARD</span><h2>Save scholarships. Track your progress. Build a stronger application.</h2><p>Create a Gateway account to keep promising scholarships and see your personalized next steps in one place.</p></div><Link className="primary-button" href="/dashboard">Open My Gateway →</Link></div>
      <div className="community-submit-callout"><div><span>HELP THE DIRECTORY GROW</span><h2>Know a scholarship we should include?</h2><p>Share the official source and eligibility information. Gateway will verify it before adding it to the directory.</p></div><Link className="small-button" href="/get-involved/submit">Submit a Scholarship →</Link></div>
    </section>
  </PageShell>;
}
