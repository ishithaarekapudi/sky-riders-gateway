import Link from "next/link";
import { Icon, PageShell } from "../ui";

const milestones = [
  ["Sixth grade", "A classroom conversation about astrophysics helped Ishitha recognize her goal of becoming an astronaut."],
  ["Age 14", "A Young Eagles flight opened the door to general aviation and showed that flight training could begin much earlier than she imagined."],
  ["Age 15", "She soloed a glider after early mornings, winter training, study, persistence, and support from her aviation community."],
  ["Age 16", "She earned her private glider pilot certificate and continued building experience, mentorship, and scholarship knowledge."],
  ["Age 17", "She earned her airplane Private Pilot License and began working toward advanced training."],
  ["Today", "Sky Riders Gateway turns the lessons, organizations, and opportunities she gathered into a clearer starting point for other students."],
] as const;

const guidance = [
  ["search", "Start Early & Research", "Explore careers, certificates, local programs, and the steps between your current stage and your goal."],
  ["people", "Find Mentors", "Meet people through airports, clubs, aviation events, schools, and organizations. Guidance can prevent avoidable mistakes."],
  ["path", "Set Clear Milestones", "Break a large dream into achievable steps while allowing your plan to change as you learn."],
  ["document", "Track Funding", "Organize scholarships, requirements, deadlines, essays, and recommendation letters well in advance."],
  ["wrench", "Gain Practical Experience", "Volunteer, attend events, use simulators, take a discovery flight, and look for entry-level ways to participate."],
  ["plane", "Stay Resilient & Curious", "Setbacks are part of aviation. Keep learning, follow new interests, and share what you discover with others."],
] as const;

export default function AboutPage() {
  return <PageShell active="about">
    <section className="sub-hero about-hero"><div>
      <span className="eyebrow">PILOT · AUTHOR · FOUNDER</span>
      <h1>Meet Ishitha Arekapudi</h1>
      <p>A young pilot building the resource she wished she had when she first began exploring aviation.</p>
      <Link className="primary-button" href="/explore">Start Your Journey →</Link>
    </div></section>
    <section className="section about-intro">
      <div>
        <span className="eyebrow">MY MISSION</span>
        <h2>Make aviation easier to enter—and easier to imagine yourself in.</h2>
        <p>Ishitha’s path began with a goal of becoming an astronaut and a realization: young people often have the curiosity and determination to pursue aviation, but not one clear place to find careers, training pathways, scholarships, mentors, and organizations.</p>
        <p>Her book, <i>Cleared for Takeoff: Bridging Gaps to Access for Youth in Aviation</i>, gathered the knowledge she developed while learning to fly. Sky Riders Gateway brings that mission online so students can move from wondering where to begin to taking a practical first step.</p>
      </div>
      <blockquote>“Often, the hardest part is figuring out where to begin.”<small>— Ishitha Arekapudi, <i>Cleared for Takeoff</i></small></blockquote>
    </section>
    <section className="section about-timeline-section">
      <div className="section-heading"><span>THE JOURNEY</span><h2>From a First Flight to Building a Gateway</h2></div>
      <div className="about-timeline">{milestones.map(([time,text])=><article key={time}><strong>{time}</strong><p>{text}</p></article>)}</div>
    </section>
    <section className="section about-guidance" id="guidance">
      <div className="section-heading"><span>WHAT I WISH I KNEW</span><h2>Guidance for Your First Steps</h2></div>
      <div className="collection-grid">{guidance.map(([icon,title,text])=><article key={title}><div className="square-icon"><Icon name={icon}/></div><h3>{title}</h3><p>{text}</p></article>)}</div>
      <div className="final-cta"><div><h2>Your path does not have to look like anyone else’s.</h2><p>Start with curiosity, find a community, and take the next useful step.</p><Link className="primary-button" href="/explore">Build My Roadmap →</Link></div></div>
    </section>
  </PageShell>;
}

