import Link from "next/link";
import type { CSSProperties } from "react";
import { SaveButton } from "../components/SaveButton";
import { organizations, slugify } from "../content";
import { Icon, PageShell } from "../ui";

const organizationBrands: Record<string, { accent: string; background: string; initials: string; logo?: string }> = {
  "Experimental Aircraft Association & Young Eagles": { accent: "#1f67a7", background: "#eef7ff", initials: "EAA", logo: "https://www.eaa.org/-/media/Images/EAA/Chapters/resources/YE_logo_color-png.png?o=1" },
  "Aircraft Owners and Pilots Association": { accent: "#c9262f", background: "#fff1f2", initials: "AOPA" },
  "Civil Air Patrol": { accent: "#163e78", background: "#eef3fa", initials: "CAP", logo: "https://www.gocivilairpatrol.com/local/public/shared/assets/images/websites/CAP-2017-logo-horizontal-optimized-d73f31575f10142a77f0888cdfb36256.png" },
  "Junior ROTC": { accent: "#b08b43", background: "#fbf6e9", initials: "JROTC" },
  "Aviation Career Education Academy": { accent: "#e16c26", background: "#fff3eb", initials: "ACE" },
  "Academy of Model Aeronautics": { accent: "#225aa5", background: "#edf4ff", initials: "AMA" },
  "Red-Tailed Hawks Flying Club": { accent: "#a52c32", background: "#fff0f0", initials: "RTH" },
  "Women in Aviation International": { accent: "#396a98", background: "#f1f6fb", initials: "WAI", logo: "https://assets.noviams.com/novi-file-uploads/wai/structure/wai-full-color-logo.png" },
  "The Ninety-Nines": { accent: "#ad7d28", background: "#fff8e7", initials: "99s" },
  "Organization of Black Aerospace Professionals": { accent: "#171717", background: "#f2f2f2", initials: "OBAP" },
  "Soaring Society of America": { accent: "#1684b2", background: "#edfaff", initials: "SSA" },
  "Women's Soaring Pilots Association": { accent: "#76529e", background: "#f6f0fb", initials: "WSPA" },
};

export default function Organizations() {
  return <PageShell active="organizations">
    <section className="sub-hero org-hero"><div>
      <span className="eyebrow">COMMUNITY OPENS DOORS</span>
      <h1>Find Your Aviation Community</h1>
      <p>Educational opportunities, mentors, flights, scholarships, and welcoming communities can make the first step much clearer.</p>
      <a className="primary-button" href="#organization-directory">Explore Organizations →</a>
    </div></section>
    <section className="section" id="organization-directory">
      <div className="section-heading"><span>FROM CLEARED FOR TAKEOFF</span><h2>Opportunity Starts With Connection</h2><p>Begin with these national and community organizations, then look for local chapters, clubs, airports, and flight schools near you.</p></div>
      <div className="org-grid">{organizations.map(([title,text,tags])=>{
        const brand = organizationBrands[title];
        return <article className="organization-directory-card" style={{ "--org-accent": brand.accent, "--org-soft": brand.background } as CSSProperties} key={title}>
          <div className={`organization-directory-brand${brand.logo ? " has-logo" : ""}`} style={{ color: brand.accent, background: brand.background }}>
            {brand.logo ? <img src={brand.logo} alt={`${title} official logo`} loading="lazy" /> : <strong>{brand.initials}</strong>}
          </div>
          <div><h3><Link href={`/organizations/${slugify(title)}`}>{title}</Link></h3><p>{text}</p><div className="tag-row">{tags.map(tag=><span key={tag}>{tag}</span>)}</div><div className="card-actions"><Link href={`/organizations/${slugify(title)}`}>View Details →</Link><SaveButton id={`organization:${title}`} label="Save"/></div></div>
        </article>;
      })}</div>
      <div className="blue-callout"><Icon name="handshake"/><div><h2>Do not overlook your local aviation community.</h2><p>Smaller clubs and nearby flight organizations can offer mentoring, volunteer experience, discovery flights, and local funding with less competition.</p></div><Link className="small-button" href="/explore">Build My Network</Link></div>
    </section>
  </PageShell>;
}
