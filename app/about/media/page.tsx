import Link from "next/link";
import { PageShell } from "../../ui";

const mediaAreas = [
  ["PRESS & INTERVIEWS", "A Young Voice in Aviation", "Conversations about becoming a teen pilot, widening access, and helping more young people see themselves in aviation and aerospace."],
  ["WRITING", "On the Flight Line", "Firsthand reflections on flight training, persistence, representation, research, and the lessons that shaped Sky Riders Gateway."],
  ["SPEAKING", "From Curiosity to a Clear Path", "Talks and conversations for schools, youth groups, aviation organizations, and communities interested in access and the future of flight."],
  ["RESEARCH", "Aerospace With Human Purpose", "Work connecting aeronautical engineering, astrobiology, extraterrestrial habitats, and the challenges of future human space exploration."],
  ["ADVOCACY", "Representation Changes Possibility", "A focus on making aviation and aerospace more visible, welcoming, and reachable for girls, young people of color, and underrepresented communities."],
  ["AUTHOR", "Cleared for Takeoff", "A practical guide that turns aviation and aerospace careers, scholarships, organizations, and hard-earned lessons into a roadmap for students."],
] as const;

export default function MediaPage() {
  return <PageShell active="about">
    <section className="sub-hero media-page-hero">
      <div><span className="eyebrow">ISHITHA AREKAPUDI · MEDIA & PRESS</span><h1>Ideas That Travel Beyond the Flight Line</h1><p>Media, writing, research, and public work centered on aviation, aerospace, access, and the next generation.</p></div>
    </section>
    <section className="section media-page-section">
      <div className="section-heading"><span>MEDIA PROFILE</span><h2>Pilot, Author, Advocate, Researcher</h2><p>Ishitha brings the perspective of a young pilot who has experienced both the possibility of aviation and the barriers that can make the field difficult to enter.</p></div>
      <div className="media-page-grid">{mediaAreas.map(([label,title,text])=><article id={label.toLowerCase().split(" ")[0]} key={title}><span>{label}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      <div className="media-press-kit"><div><span className="eyebrow">MEDIA INQUIRIES</span><h2>Interview, speaking, and collaboration requests</h2><p>Share the topic, format, audience, and timing so Ishitha can understand the opportunity.</p></div><Link className="primary-button" href="/about/contact">Contact Ishitha →</Link></div>
    </section>
  </PageShell>;
}
