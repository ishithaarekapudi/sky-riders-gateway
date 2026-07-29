import Link from "next/link";
import { PageShell } from "../ui";

const milestones = [
  ["Sixth grade", "A classroom conversation about astrophysics helped Ishitha recognize her goal of becoming an astronaut."],
  ["Age 14", "A Young Eagles flight opened the door to general aviation and showed that flight training could begin much earlier than she imagined."],
  ["Age 15", "She soloed a glider after early mornings, winter training, study, persistence, and support from her aviation community."],
  ["Age 16", "She earned her private glider pilot certificate and continued building experience, mentorship, and scholarship knowledge."],
  ["Age 17", "She earned her airplane Private Pilot License and began working toward advanced training."],
  ["Today", "Sky Riders Gateway turns the lessons, organizations, and opportunities she gathered into a clearer starting point for other students."],
] as const;

export default function AboutPage() {
  return <PageShell active="about">
    <section className="sub-hero about-hero"><div>
      <span className="eyebrow">TEEN PILOT · ADVOCATE · RESEARCHER · AUTHOR</span>
      <h1>Meet Ishitha Arekapudi</h1>
      <p className="founder-title">Founder of Sky Riders Gateway</p>
      <p>A young pilot and future astronaut turning her experience in aviation into clearer pathways for the next generation.</p>
    </div></section>
    <section className="section founder-introduction">
      <div>
        <span className="eyebrow">THE FOUNDER BEHIND GATEWAY</span>
        <h2>A Pilot Building the Gateway She Wished Existed</h2>
      </div>
      <div>
        <p>Ishitha’s path began with a passion for space and a Young Eagles flight at age 14. As she learned to fly, she also learned how difficult it can be for a young person to find trustworthy information, mentors, scholarships, and a clear place to begin.</p>
        <p>Sky Riders Gateway transforms those lessons into a resource for others. Her goal is to make aviation and aerospace easier to enter, and easier for every young person to imagine themselves in.</p>
        <div className="founder-role-row"><span>Private Pilot</span><span>Author</span><span>Youth Advocate</span><span>Aerospace Researcher</span></div>
      </div>
    </section>
    <section className="section about-book founder-book" id="book">
      <img className="actual-book-cover" src="/cleared-for-takeoff-cover.jpg" alt="Cleared for Takeoff book cover by Ishitha Arekapudi"/>
      <div><span className="eyebrow">CLEARED FOR TAKEOFF</span><h2>The book behind the Gateway mission.</h2><p>Ishitha wrote <i>Cleared for Takeoff: Bridging Gaps to Access for Youth in Aviation</i> as a guide for students navigating paths into aviation and space. It brings together careers, organizations, scholarships, practical advice, and the lessons she learned while becoming a young pilot.</p><blockquote>“The future of aviation and space is waiting, and it’s calling for people like you to answer.”</blockquote><Link className="primary-button" href="/resources#book-excerpt">Read the Excerpt & Buy →</Link></div>
    </section>
    <section className="section about-timeline-section founder-accomplishments">
      <div className="section-heading"><span>MILESTONES BY AGE</span><h2>Built in the Air, Then Built for Others</h2><p>Each milestone strengthened Ishitha’s belief that access, guidance, and representation can change who feels welcome in aviation and aerospace.</p></div>
      <div className="about-timeline">{milestones.map(([time,text], index)=><article key={time}><span>{String(index + 1).padStart(2, "0")}</span><strong>{time}</strong><p>{text}</p></article>)}</div>
    </section>
    <section className="section founder-story">
      <span className="eyebrow">ON THE FLIGHT LINE</span>
      <h2>Flying With Purpose</h2>
      <div className="founder-story-grid">
        <p>Ishitha began in aviation at 14 with a passion for space. Two years of consistent glider training led to her private glider pilot certificate at the youngest eligible age. Early mornings, weather cancellations, written and oral exams, and difficult setbacks taught her that progress in aviation is built through patience and persistence.</p>
        <p>As an Irish-born Indian young woman, Ishitha has often been one of the only teen girls and one of the only people of color in aviation spaces. She uses her work to make the industry more visible and reachable for young people who may not yet see themselves represented in it.</p>
      </div>
    </section>
    <section className="section founder-media">
      <div className="section-heading"><span>MEDIA & PRESS</span><h2>Ideas That Travel Beyond the Flight Line</h2><p>Explore Ishitha’s interviews, advocacy, writing, and public work across aviation, aerospace, access, and representation.</p></div>
      <div className="founder-media-grid">
        <Link href="/about/media#press"><span>PRESS</span><h3>Interviews & Features</h3><p>Read and watch conversations about flying, youth access, and the future of aviation.</p><b>View Media Coverage →</b></Link>
        <Link href="/about/media#writing"><span>WRITING</span><h3>On the Flight Line</h3><p>Follow reflections, updates, and lessons from Ishitha’s aviation and aerospace journey.</p><b>Read Ishitha’s Writing →</b></Link>
        <Link href="/about/media#portfolio"><span>PORTFOLIO</span><h3>Projects & Research</h3><p>See the work connecting aviation, space, advocacy, research, and education.</p><b>Explore the Portfolio →</b></Link>
      </div>
    </section>
    <section className="section founder-connect">
      <div><span className="eyebrow">CONNECT WITH ISHITHA</span><h2>For media, speaking, and collaboration.</h2><p>Connect with Ishitha about youth aviation, aerospace pathways, research, representation, the book, or the Sky Riders Gateway mission.</p></div>
      <div className="founder-connect-actions"><Link className="primary-button" href="/about/contact">Contact Ishitha →</Link><Link className="ghost-button" href="/about/media">View Media & Press →</Link></div>
    </section>
  </PageShell>;
}
