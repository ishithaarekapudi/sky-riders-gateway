"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SaveButton } from "../components/SaveButton";
import { organizations, slugify } from "../content";
import { Icon, PageShell } from "../ui";
import "../organization-branding.css";

const organizationFilters = ["All Organizations", "Youth & Education", "Flight & Training", "Mentorship", "Scholarships", "Aerospace & STEM"] as const;

export default function Organizations() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof organizationFilters)[number]>("All Organizations");
  const visible = useMemo(() => organizations.filter(([title,text,tags]) => {
    const searchable = `${title} ${text} ${tags.join(" ")}`.toLowerCase();
    const matchesQuery = searchable.includes(query.toLowerCase());
    const matchesFilter = filter === "All Organizations"
      || (filter === "Youth & Education" && /youth|student|cadet|education|academy|junior|young/i.test(searchable))
      || (filter === "Flight & Training" && /flight|pilot|flying|soaring|training|aircraft/i.test(searchable))
      || (filter === "Mentorship" && /mentor|network|community|leadership|representation/i.test(searchable))
      || (filter === "Scholarships" && /scholarship|funding/i.test(searchable))
      || (filter === "Aerospace & STEM" && /aerospace|space|stem|model|engineering/i.test(searchable));
    return matchesQuery && matchesFilter;
  }), [query, filter]);
  return <PageShell active="organizations">
    <section className="sub-hero resources-hero directory-resource-hero"><div>
      <span className="eyebrow">COMMUNITY OPENS DOORS.</span>
      <h1>Find Your Aviation Community</h1>
      <p>Educational opportunities, mentors, flights, scholarships, and welcoming communities can make the first step much clearer.</p>
      <label className="search-box"><Icon name="search"/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search organizations by name, program, or community"/></label>
    </div></section>
    <section className="scholarship-search-deck directory-category-deck" aria-label="Organization categories">
      <div className="scholarship-filter-row">{organizationFilters.map(item=><button className={filter===item?"active":""} onClick={()=>setFilter(item)} key={item}>{item}</button>)}</div>
    </section>
    <section className="section editorial-directory" id="organization-directory">
      <div className="section-heading"><span>TRUSTED STARTING POINTS</span><h2>Opportunity Starts With Connection</h2><p>National organizations can open a door. Local chapters, clubs, airports, and flight schools can help you walk through it.</p><small className="directory-result-count">{visible.length} organizations found</small></div>
      <div className="org-grid">{visible.map(([title,text,tags])=>{
        return <article className="organization-directory-card" key={title}>
          <div className="organization-card-copy">
            <span className="organization-type">AVIATION COMMUNITY</span>
            <h3><Link href={`/organizations/${slugify(title)}`}>{title}</Link></h3>
            <p>{text}</p>
            <div className="tag-row">{tags.map(tag=><span key={tag}>{tag}</span>)}</div>
            <div className="card-actions"><Link href={`/organizations/${slugify(title)}`}>View organization →</Link></div>
          </div>
          <SaveButton id={`organization:${title}`} label={title}/>
        </article>;
      })}</div>
      <div className="blue-callout"><Icon name="handshake"/><div><h2>Do not overlook your local aviation community.</h2><p>Smaller clubs and nearby flight organizations can offer mentoring, volunteer experience, discovery flights, and local funding with less competition.</p></div><Link className="small-button" href="/explore">Build My Network</Link></div>
      <div className="community-submit-callout"><div><span>HELP THE DIRECTORY GROW</span><h2>Know an organization we should include?</h2><p>Share a trustworthy aviation or aerospace community and its official website. Gateway will review it before publication.</p></div><Link className="small-button" href="/get-involved/submit">Submit an Organization →</Link></div>
    </section>
  </PageShell>;
}
