import Link from "next/link";
import type { DetailInfo } from "../detail-content";
import { Icon, PageShell } from "../ui";
import { SaveButton } from "./SaveButton";
import { ScholarshipTracker } from "./ScholarshipTracker";

const sourceLogos: Record<string, string> = {
  EAA: "/organization-logos/eaa.png",
  "EAA Scholarships": "/organization-logos/eaa.png",
  "Civil Air Patrol": "/organization-logos/civil-air-patrol.png",
  "Women in Aviation International": "/organization-logos/women-in-aviation.png",
  NASA: "https://www.nasa.gov/wp-content/themes/nasa/assets/images/nasa-logo.svg",
  "NASA STEM Gateway": "https://www.nasa.gov/wp-content/themes/nasa/assets/images/nasa-logo.svg",
};

const factIcons = ["telescope", "document", "people", "plane"] as const;

function guideIcon(kind: "Career" | "Organization" | "Scholarship", title: string) {
  if (kind === "Scholarship") return "school";
  const value = title.toLowerCase();
  if (value.includes("maintenance") || value.includes("mechanic") || value.includes("avionics")) return "wrench";
  if (value.includes("traffic") || value.includes("airport")) return "tower";
  if (value.includes("space") || value.includes("astronaut")) return "spacecraft";
  if (value.includes("weather") || value.includes("meteorolog")) return "weather";
  if (value.includes("drone")) return "drone";
  if (value.includes("engineer")) return "engineering";
  return "plane";
}

export function DetailPage({ active, kind, title, summary, tags, info, backHref }: {
  active: string;
  kind: "Career" | "Organization" | "Scholarship";
  title: string;
  summary: string;
  tags?: readonly string[];
  info: DetailInfo;
  backHref: string;
}) {
  const logo = sourceLogos[info.sourceLabel];
  const typeLabel = kind === "Career" ? "CAREER PATH" : kind === "Scholarship" ? "FUNDING OPPORTUNITY" : "COMMUNITY GUIDE";
  const startTitle = kind === "Career" ? "Build Your Path" : "Prepare a Strong Application";
  const actionLabel = kind === "Career" ? "Explore Official Career Source ↗" : "Visit Official Scholarship ↗";

  return <PageShell active={active}>
    <section className={`organization-profile gateway-guide-profile gateway-guide-${kind.toLowerCase()}`}>
      <div className="organization-profile-sky">
        <Link className="organization-profile-back" href={backHref}>← Back to {active}</Link>
        <div className="organization-sky-copy"><span>SKY RIDERS GATEWAY</span><strong>{kind === "Career" ? "Understand the work, training, and next steps." : "Turn a promising opportunity into a clear application plan."}</strong></div>
      </div>

      <div className="organization-profile-header">
        <div className={`organization-profile-mark gateway-guide-mark${logo ? " has-logo" : ""}`}>
          {logo ? <img src={logo} alt={`${info.sourceLabel} official logo`}/> : <Icon name={guideIcon(kind, title)}/>} 
        </div>
        <div className="organization-profile-title">
          <span>{typeLabel}</span>
          <h1>{title}</h1>
          <p>{summary}</p>
        </div>
        <SaveButton id={`${kind.toLowerCase()}:${title}`} label={title}/>
      </div>

      <div className="organization-profile-facts">
        {(tags?.length ? tags : info.highlights.slice(0, 3)).map((tag, index) => <span key={tag}><Icon name={factIcons[index % factIcons.length]}/>{tag}</span>)}
        <span><Icon name="document"/> Verified against {info.sourceLabel}</span>
      </div>

      <nav className="organization-profile-tabs" aria-label={`${kind} page sections`}>
        <a href="#overview">Overview</a>
        <a href="#key-details">Key Details</a>
        <a href="#next-steps">Next Steps</a>
        <a href={info.officialUrl} target="_blank" rel="noreferrer">Official Source ↗</a>
      </nav>
    </section>

    <section className="organization-profile-content gateway-guide-content">
      <article id="overview" className="organization-overview gateway-guide-overview">
        <span className="eyebrow">OVERVIEW</span>
        <h2>What to Know</h2>
        <p>{info.overview}</p>
        <div className="gateway-source-note">
          {logo ? <img src={logo} alt=""/> : <Icon name="document"/>}
          <div><span>OFFICIAL INFORMATION</span><strong>{info.sourceLabel}</strong><a href={info.officialUrl} target="_blank" rel="noreferrer">Open official source ↗</a></div>
        </div>
      </article>

      <section id="key-details" className="organization-programs gateway-guide-details">
        <div className="organization-section-heading"><div><span className="eyebrow">KEY DETAILS</span><h2>{kind === "Career" ? "What This Path Can Include" : "What This Opportunity Offers"}</h2></div></div>
        <div className="organization-program-grid">
          {info.highlights.map((highlight, index) => <article key={highlight}><span><Icon name={factIcons[index % factIcons.length]}/></span><h3>{highlight}</h3><p>{kind === "Career" ? "Use this point to compare the pathway with your interests, strengths, and goals." : "Confirm the current amount, eligibility, and deadline on the official scholarship website."}</p></article>)}
        </div>
      </section>

      <section id="next-steps" className="organization-start gateway-guide-start">
        <div className="organization-section-heading"><div><span className="eyebrow">YOUR NEXT STEPS</span><h2>{startTitle}</h2></div></div>
        {kind === "Scholarship" && <ScholarshipTracker title={title}/>} 
        <div className="organization-start-grid">
          {info.nextSteps.map((step, index) => <article key={step}><span>{index + 1}</span><div><h3>{step}</h3><p>{kind === "Career" ? "A practical action to help you learn whether this career belongs in your Gateway roadmap." : "Complete this step early, then record your progress in your Gateway scholarship tracker."}</p></div></article>)}
        </div>
        <div className="organization-profile-cta">
          <div><h2>{kind === "Career" ? "Ready to explore this path?" : "Ready to move this application forward?"}</h2><p>Use the official source for current requirements, dates, and details, then keep the opportunity in your Gateway.</p></div>
          <a className="primary-button" href={info.officialUrl} target="_blank" rel="noreferrer">{actionLabel}</a>
          <Link className="ghost-button" href="/dashboard">Open My Gateway</Link>
        </div>
      </section>
    </section>
  </PageShell>;
}
