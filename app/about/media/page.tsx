import Link from "next/link";
import { PageShell } from "../../ui";
import { SubscribeForm } from "../ContactSubscribeForms";

const pressTopics = [
  { tag: "PILOT STORY", title: "From a Young Eagles Flight to the Flight Deck", text: "Ishitha’s aviation journey began with an introductory flight at 14 and grew through glider training, pilot certificates, scholarships, and a commitment to make the route into aviation easier to understand." },
  { tag: "YOUTH ACCESS", title: "Why the Sky Should Not Have Barriers", text: "A conversation about the information, cost, representation, and mentorship gaps that can keep young people from seeing aviation and aerospace as reachable futures." },
  { tag: "AUTHOR", title: "Cleared for Takeoff", text: "The story behind a student-centered guide to aviation and space careers, organizations, scholarships, and practical first steps." },
] as const;

const writing = [
  { title: "The First Flight Is Only the Beginning", label: "ON THE FLIGHT LINE", text: "An introductory flight can make aviation feel possible, but students still need a clear way to find training, mentors, funding, and the next right question to ask." },
  { title: "What Persistence Looks Like in Flight Training", label: "REFLECTION", text: "Early mornings, weather delays, studying, setbacks, and steady practice shaped Ishitha’s understanding that progress is not always visible, but every careful step matters." },
  { title: "Representation Changes Who Can Imagine the Future", label: "ADVOCACY", text: "When young people see pilots, engineers, researchers, and leaders who share their backgrounds, possibility becomes more personal and more real." },
] as const;

const projects = [
  { number: "01", title: "Sky Riders Gateway", text: "A growing pathway finder connecting students with aviation and aerospace careers, scholarships, organizations, mentors, and location-based opportunities." },
  { number: "02", title: "Cleared for Takeoff", text: "A practical book created to bridge knowledge and access gaps for youth who are curious about aviation and space but do not know where to begin." },
  { number: "03", title: "Aerospace Research", text: "Research interests spanning aeronautical engineering, astrobiology, extraterrestrial habitats, and the human challenges of future exploration." },
] as const;

export default function MediaPage() {
  return <PageShell active="about">
    <section className="sub-hero media-page-hero"><div><span className="eyebrow">ISHITHA AREKAPUDI · MEDIA & PRESS</span><h1>Ideas That Travel Beyond the Flight Line</h1><p>Read Ishitha’s stories, writing, research, and public work here, without leaving Sky Riders Gateway.</p></div></section>

    <nav className="media-local-nav" aria-label="Media page sections"><a href="#press">Press & Interviews</a><a href="#writing">Writing</a><a href="#portfolio">Projects & Research</a><a href="#inquiries">Media Inquiries</a></nav>

    <section className="section media-editorial-section" id="press">
      <div className="media-section-intro"><span className="eyebrow">PRESS & INTERVIEWS</span><h2>Stories worth carrying forward.</h2><p>Background and story angles for conversations about youth aviation, aerospace access, representation, authorship, and building a clearer route into flight.</p></div>
      <div className="media-feature-list">{pressTopics.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{item.tag}</small><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div>
    </section>

    <section className="section media-writing-section" id="writing">
      <div className="section-heading"><span>WRITING · ON THE FLIGHT LINE</span><h2>Notes from a journey still in motion.</h2><p>Short essays and reflections from Ishitha’s experience as a young pilot, researcher, advocate, and founder.</p></div>
      <div className="media-writing-grid">{writing.map(item => <article key={item.title}><span>{item.label}</span><h3>{item.title}</h3><p>{item.text}</p><div className="article-rule" /></article>)}</div>
    </section>

    <section className="section media-portfolio-section" id="portfolio">
      <div className="media-section-intro"><span className="eyebrow">PROJECTS & RESEARCH</span><h2>Work built to open doors.</h2><p>Each project connects curiosity with practical guidance, wider access, and a more inclusive future in aviation and aerospace.</p></div>
      <div className="media-project-list">{projects.map(item => <article key={item.number}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div>
    </section>

    <section className="section media-inquiry-section" id="inquiries"><div><span className="eyebrow">MEDIA INQUIRIES</span><h2>Bring the conversation to your audience.</h2><p>For interviews, speaking invitations, research conversations, book inquiries, or collaborations, send the details directly through Gateway.</p><Link className="primary-button" href="/about/contact">Contact Ishitha →</Link></div><div className="media-topic-panel"><h3>Conversation areas</h3><ul><li>Youth pathways into aviation</li><li>Representation and access</li><li>Flight training and persistence</li><li>Aviation and aerospace careers</li><li>Cleared for Takeoff</li><li>Building Sky Riders Gateway</li></ul></div></section>

    <section className="section subscribe-section media-subscribe"><div><span className="eyebrow">FOLLOW THE WORK</span><h2>New stories, opportunities, and ideas.</h2><p>Join the Sky Riders list for occasional updates from the flight line and beyond.</p></div><SubscribeForm /></section>
  </PageShell>;
}
