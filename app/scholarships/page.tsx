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
const scholarshipSponsor = (title: string) => {
  if (/EAA|Ray Aviation|Harrison Ford|Adapt to Fly|John S\. Bradbury|Noah Favaregh|Jason Kurt Lohr|Elgin Wells|Florence Coffy|WomenSoar|Top Gun Naval|Ceci Stratford/.test(title)) return { name: "Experimental Aircraft Association", logo: "/organization-logos/eaa.svg" };
  if (/AOPA/.test(title)) return { name: "Aircraft Owners and Pilots Association", logo: "/scholarship-logos/aopa.svg" };
  if (/Civil Air Patrol/.test(title)) return { name: "Civil Air Patrol", logo: "/organization-logos/civil-air-patrol.svg" };
  if (/Ninety-Nines|Amelia Earhart|Vicki Cruse|Kitty Houghton/.test(title)) return { name: "The Ninety-Nines", logo: "/scholarship-logos/ninety-nines.svg" };
  if (/WSPA|Women.?s Soaring/.test(title)) return { name: "Women’s Soaring Pilots Association", logo: "/organization-logos/wspa-official-upload.svg" };
  if (/SSA|Soaring|Purduski|Stoffel|1-26 Association|Kolstad/.test(title)) return { name: "Soaring Society of America", logo: "/scholarship-logos/ssa.svg" };
  if (/Astronaut Scholarship/.test(title)) return { name: "Astronaut Scholarship Foundation", logo: "/scholarship-logos/asf.svg" };
  if (/LeRoy W\. Homer/.test(title)) return { name: "LeRoy W. Homer Jr. Foundation", logo: "/scholarship-logos/leroy-homer.svg" };
  if (/Women in Aviation International/.test(title)) return { name: "Women in Aviation International", logo: "/organization-logos/women-in-aviation.svg" };
  if (/Sling Pilot Academy/.test(title)) return { name: "Sling Pilot Academy", logo: "/scholarship-logos/sling.svg" };
  if (/Alaska Airlines|Benjamin L\. Ellison|Frank Sam and Betty Houston|Red-Tailed Hawks/.test(title)) return { name: "Red-Tailed Hawks Flying Club", logo: "/scholarship-logos/red-tailed-hawks.svg" };
  if (/NBAA/.test(title)) return { name: "National Business Aviation Association", logo: "/scholarship-logos/nbaa.svg" };
  if (/GAMA/.test(title)) return { name: "General Aviation Manufacturers Association", logo: "/scholarship-logos/gama.svg" };
  if (/Air & Space Forces/.test(title)) return { name: "Air & Space Forces Association", logo: "/scholarship-logos/afa.svg" };
  return { name: sponsor(title), logo: "/organization-logos/eaa.svg" };
};

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
    <section className="sub-hero resources-hero directory-resource-hero"><div>
      <span className="eyebrow">FUND YOUR NEXT STEP.</span>
      <h1>Fund Your Future in Flight</h1>
      <p>Discover aviation and aerospace scholarships, compare your options, and take the next step toward your goals.</p>
      <label className="search-box"><Icon name="search"/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search scholarships by name, pathway, or eligibility"/></label>
    </div></section>
    <section className="scholarship-search-deck">
      <div className="scholarship-filter-row">{filters.map(x=><button className={filter===x?"active":""} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div>
    </section>
    <section className="directory scholarship-directory runway-directory">
      <div className="directory-heading"><div><span className="eyebrow">SCHOLARSHIP DIRECTORY</span><h2>Opportunities to move you forward</h2></div><span>{visible.length} scholarships found</span></div>
      <p className="data-note">*Awards, eligibility, and deadlines can change. Always verify the current application cycle on the sponsoring organization’s official website before applying.</p>
      <div className="scholar-grid runway-scholar-grid">{visible.map(([,title,amount,tags])=>{ const identity = scholarshipSponsor(title); return <article className="scholar-card runway-scholar-card directory-profile-card" key={title}>
        <div className="scholar-sponsor directory-profile-brand"><div className="scholarship-logo-lockup"><img src={identity.logo} alt={`${identity.name} logo`}/><span>{identity.name}</span></div></div>
        <div className="scholar-copy directory-profile-copy"><span className="scholar-type">{sponsor(title)}</span><h3><Link href={`/scholarships/${slugify(title)}`}>{title}</Link></h3><p className="scholarship-card-intro">A funding opportunity for students building an aviation or aerospace pathway.</p><div className="runway-scholar-facts"><div><span>Award</span><strong>{amount}</strong></div><div><span>Eligibility</span><b>{tags}</b></div><div><span>Application</span><b>Verify the current official cycle</b></div></div><div className="card-actions"><Link href={`/scholarships/${slugify(title)}`}>View scholarship →</Link></div></div>
        <SaveButton id={`scholarship:${title}`} label={title}/>
      </article>})}</div>
      <div className="scholarship-account-cta"><Icon name="plane"/><div><span>YOUR PERSONAL FUNDING DASHBOARD</span><h2>Save scholarships. Track your progress. Build a stronger application.</h2><p>Create a Gateway account to keep promising scholarships and see your personalized next steps in one place.</p></div><Link className="primary-button" href="/dashboard">Open My Gateway →</Link></div>
      <div className="community-submit-callout"><div><span>HELP THE DIRECTORY GROW</span><h2>Know a scholarship we should include?</h2><p>Share the official source and eligibility information. Gateway will verify it before adding it to the directory.</p></div><Link className="small-button" href="/get-involved/submit">Submit a Scholarship →</Link></div>
    </section>
  </PageShell>;
}
