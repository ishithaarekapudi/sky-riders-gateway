import Link from "next/link";
import type { DetailInfo } from "../detail-content";
import { Icon, PageShell } from "../ui";
import { SaveButton } from "./SaveButton";

const organizationMarks: Record<string, string> = {
  "Experimental Aircraft Association & Young Eagles": "EAA",
  "Aircraft Owners and Pilots Association": "AOPA",
  "Civil Air Patrol": "CAP",
  "Junior ROTC": "JROTC",
  "Aviation Career Education Academy": "ACE",
  "Academy of Model Aeronautics": "AMA",
  "Red-Tailed Hawks Flying Club": "RTH",
  "Women in Aviation International": "WAI",
  "The Ninety-Nines": "99s",
  "Organization of Black Aerospace Professionals": "OBAP",
  "Soaring Society of America": "SSA",
  "Women's Soaring Pilots Association": "WSPA",
};

const highlightIcons = ["telescope", "people", "globe", "handshake"] as const;

export function OrganizationProfile({ title, summary, tags, info }: {
  title: string;
  summary: string;
  tags: readonly string[];
  info: DetailInfo;
}) {
  const mark = organizationMarks[title] || title.split(" ").map((word) => word[0]).join("").slice(0, 4);

  return (
    <PageShell active="organizations">
      <section className="organization-profile">
        <div className="organization-profile-sky">
          <Link className="organization-profile-back" href="/organizations">← Back to organizations</Link>
          <div className="organization-sky-copy"><span>SKY RIDERS COMMUNITY</span><strong>Find people and programs that can help you move forward.</strong></div>
        </div>

        <div className="organization-profile-header">
          <div className="organization-profile-mark" aria-hidden="true">{mark}</div>
          <div className="organization-profile-title">
            <span>FEATURED ORGANIZATION</span>
            <h1>{title}</h1>
            <p>{summary}</p>
          </div>
          <SaveButton id={`organization:${title}`} label="Save" />
        </div>

        <div className="organization-profile-facts">
          {tags.map((tag, index) => <span key={tag}><Icon name={highlightIcons[index % highlightIcons.length]} /> {tag}</span>)}
          <span><Icon name="globe" /> Official information linked</span>
        </div>

        <nav className="organization-profile-tabs" aria-label="Organization page sections">
          <a href="#overview">Overview</a>
          <a href="#programs">Programs</a>
          <a href="#next-steps">Next Steps</a>
          <a href={info.officialUrl} target="_blank" rel="noreferrer">Official Site ↗</a>
        </nav>
      </section>

      <section className="organization-profile-content">
        <article id="overview" className="organization-overview">
          <span className="eyebrow">OVERVIEW</span>
          <h2>About {info.sourceLabel}</h2>
          <p>{info.overview}</p>
        </article>

        <section id="programs" className="organization-programs">
          <div className="organization-section-heading">
            <div><span className="eyebrow">PROGRAMS & BENEFITS</span><h2>What You Can Explore</h2></div>
            <a href={info.officialUrl} target="_blank" rel="noreferrer">View official programs →</a>
          </div>
          <div className="organization-program-grid">
            {info.highlights.map((highlight, index) => (
              <article key={highlight}>
                <span><Icon name={highlightIcons[index % highlightIcons.length]} /></span>
                <h3>{highlight}</h3>
                <p>Explore this pathway through {info.sourceLabel} and confirm current availability on the official website.</p>
              </article>
            ))}
          </div>
        </section>

        <section id="next-steps" className="organization-start">
          <div className="organization-section-heading">
            <div><span className="eyebrow">YOUR NEXT STEPS</span><h2>Ways to Get Started</h2></div>
          </div>
          <div className="organization-start-grid">
            {info.nextSteps.map((step, index) => (
              <article key={step}>
                <span>{index + 1}</span>
                <div><h3>{step}</h3><p>A practical first action you can take to begin connecting with this organization.</p></div>
              </article>
            ))}
          </div>
          <div className="organization-profile-cta">
            <div><h2>Ready to explore this community?</h2><p>Visit the official organization for current programs, eligibility, locations, and dates.</p></div>
            <a className="primary-button" href={info.officialUrl} target="_blank" rel="noreferrer">Visit Official Website ↗</a>
            <Link className="ghost-button" href="/explore">Add to My Gateway</Link>
          </div>
        </section>
      </section>
    </PageShell>
  );
}
