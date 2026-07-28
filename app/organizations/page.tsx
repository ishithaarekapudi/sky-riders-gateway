import Link from "next/link";
import { SaveButton } from "../components/SaveButton";
import { organizations, slugify } from "../content";
import { Icon, PageShell } from "../ui";

const officialLogos: Record<string, string> = {
  "Experimental Aircraft Association & Young Eagles": "https://www.eaa.org/-/media/Images/EAA/Chapters/resources/YE_logo_color-png.png?o=1",
  "Civil Air Patrol": "https://www.gocivilairpatrol.com/local/public/shared/assets/images/websites/CAP-2017-logo-horizontal-optimized-d73f31575f10142a77f0888cdfb36256.png",
  "Women in Aviation International": "https://assets.noviams.com/novi-file-uploads/wai/structure/wai-full-color-logo.png",
};

const shortNames: Record<string, string> = {
  "Aircraft Owners and Pilots Association": "AOPA",
  "Junior ROTC": "JROTC",
  "Aviation Career Education Academy": "ACE Academy",
  "Academy of Model Aeronautics": "AMA",
  "Red-Tailed Hawks Flying Club": "Red-Tailed Hawks",
  "The Ninety-Nines": "The 99s",
  "Organization of Black Aerospace Professionals": "OBAP",
  "Soaring Society of America": "SSA",
  "Women's Soaring Pilots Association": "WSPA",
};

export default function Organizations() {
  return <PageShell active="organizations">
    <section className="sub-hero org-hero"><div>
      <span className="eyebrow">COMMUNITY OPENS DOORS</span>
      <h1>Find Your Aviation Community</h1>
      <p>Educational opportunities, mentors, flights, scholarships, and welcoming communities can make the first step much clearer.</p>
      <a className="primary-button" href="#organization-directory">Explore Organizations →</a>
    </div></section>
    <section className="section editorial-directory" id="organization-directory">
      <div className="section-heading"><span>TRUSTED STARTING POINTS</span><h2>Opportunity Starts With Connection</h2><p>National organizations can open a door. Local chapters, clubs, airports, and flight schools can help you walk through it.</p></div>
      <div className="org-grid">{organizations.map(([title,text,tags], index)=>{
        const logo = officialLogos[title];
        return <article className="organization-directory-card" key={title}>
          <div className="organization-directory-brand">
            {logo ? <img src={logo} alt={`${title} official logo`} loading="lazy" /> : <div className="organization-wordmark"><span>ORGANIZATION</span><strong>{shortNames[title] || title}</strong></div>}
          </div>
          <div className="organization-card-copy">
            <span className="organization-type">AVIATION COMMUNITY</span>
            <h3><Link href={`/organizations/${slugify(title)}`}>{title}</Link></h3>
            <p>{text}</p>
            <div className="tag-row">{tags.map(tag=><span key={tag}>{tag}</span>)}</div>
            <div className="card-actions"><Link href={`/organizations/${slugify(title)}`}>View organization →</Link><SaveButton id={`organization:${title}`} label="Save"/></div>
          </div>
        </article>;
      })}</div>
      <div className="blue-callout"><Icon name="handshake"/><div><h2>Do not overlook your local aviation community.</h2><p>Smaller clubs and nearby flight organizations can offer mentoring, volunteer experience, discovery flights, and local funding with less competition.</p></div><Link className="small-button" href="/explore">Build My Network</Link></div>
    </section>
  </PageShell>;
}
