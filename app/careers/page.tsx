"use client";

import { useState } from "react";
import Link from "next/link";
import { SaveButton } from "../components/SaveButton";
import { careerPaths, slugify } from "../content";
import { Icon, PageShell } from "../ui";

const families = [
  { icon: "plane", prompt: "I want to fly", label: "Flight & Instruction", note: "Operate aircraft, teach new pilots, or work with remotely piloted systems.", titles: ["Professional Pilot Careers","Airline Pilot","Corporate, Charter & Air Taxi Pilot","Cargo & Ferry Pilot","Medical & Air Ambulance Pilot","Government, Military & Law Enforcement Pilot","Firefighting & Agricultural Pilot","Air Tour, Media & Banner Pilot","Test, Airshow & Space Pilot","Flight Instructor","Drone Pilot"] },
  { icon: "tower", prompt: "I like coordination", label: "Operations & Safety", note: "Keep people, aircraft, airports, and the national airspace moving safely.", titles: ["Air Traffic Control","Airport Operations","Flight Dispatch","Cabin Crew & Customer Experience","Airport Customer Service","Airport Emergency Response","Airport Police & Security"] },
  { icon: "wrench", prompt: "I like building things", label: "Engineering, Space & Technical", note: "Design, maintain, test, and understand the systems that make flight and space missions possible.", titles: ["Aircraft Maintenance","Avionics Technician","Aeronautical Engineering","Airport Engineering & Construction","Meteorology","Space Science & Astronautics"] },
  { icon: "document", prompt: "I want to support the industry", label: "Business, Health & Policy", note: "Support aerospace through medicine, leadership, law, education, strategy, and service.", titles: ["Aerospace Medicine","Aviation Law & Business","Aviation Insurance & Risk","Aviation Training & Education"] },
] as const;

const careerFilters = ["All Careers", "Flight & Instruction", "Operations & Safety", "Engineering & Technical", "Business, Health & Policy"] as const;

export default function Careers() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof careerFilters)[number]>("All Careers");
  const visibleFamilies = families.filter(family => filter === "All Careers"
    || (filter === "Engineering & Technical" && family.label === "Engineering, Space & Technical")
    || family.label === filter);
  return <PageShell active="careers">
    <section className="sub-hero resources-hero directory-resource-hero"><div>
      <span className="eyebrow">CAREER PATHS.</span>
      <h1>Explore Aviation and Aerospace Careers</h1>
      <p>Compare careers across flight, engineering, healthcare, law, business, technology, weather, safety, and service.</p>
      <label className="search-box"><Icon name="search"/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search careers by title, field, or skill"/></label>
    </div></section>
    <section className="scholarship-search-deck directory-category-deck" aria-label="Career categories">
      <div className="scholarship-filter-row">{careerFilters.map(item=><button className={filter===item?"active":""} onClick={()=>setFilter(item)} key={item}>{item}</button>)}</div>
    </section>
    <section className="section careers-directory" id="top">
      <div className="section-heading"><span>START WITH YOUR INTERESTS</span><h2>What kind of work sounds like you?</h2><p>Choose the statement that feels closest. You can compare several paths, and you do not need to decide on one career yet.</p></div>
      <nav className="career-family-nav" aria-label="Career interests">{families.map((family,index)=><a href={`#career-family-${index}`} key={family.label}><Icon name={family.icon}/><span>{family.prompt}</span><strong>{family.label}</strong><small>See {family.titles.length} careers →</small></a>)}</nav>
      {visibleFamilies.map((family)=><section className="career-family" id={`career-family-${families.indexOf(family)}`} key={family.label}>
        <header><div><span>{family.prompt}</span><h2>{family.label}</h2><p>{family.note}</p></div><a href="#top">Back to choices ↑</a></header>
        <div className="career-grid organization-style-career-grid">{careerPaths.filter(([,title,text])=>family.titles.includes(title as never) && `${title} ${text} ${family.label}`.toLowerCase().includes(query.toLowerCase())).map(([icon,title,text])=><article className="directory-profile-card career-profile-card" key={title}><SaveButton id={`career:${title}`} label={title}/><div className="directory-profile-brand career-profile-brand"><div className="career-brand-icon"><Icon name={icon}/></div><strong>CAREER FIELD</strong><span>{family.prompt}</span></div><div className="directory-profile-copy"><span className="organization-type">{family.label}</span><h3><Link href={`/careers/${slugify(title)}`}>{title}</Link></h3><p>{text}</p><div className="tag-row"><span>Career guide</span><span>Skills & training</span><span>Next steps</span></div><div className="card-actions"><Link href={`/careers/${slugify(title)}`}>Explore this career →</Link></div></div></article>)}</div>
      </section>)}
      <div className="roadmap-banner"><div><span>ISHITHA’S ADVICE</span><h2>Where you start is not always where you’ll end up.</h2><p>Aviation keeps evolving. Explore widely, follow your strengths, and stay open to careers you may not have discovered yet.</p></div><Link className="primary-button" href="/explore">Build My Roadmap →</Link></div>
    </section>
  </PageShell>;
}
