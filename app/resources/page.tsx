import Link from "next/link";
import { manuscriptResources } from "../content";
import { Icon, PageShell } from "../ui";

const links = ["/careers","/scholarships","/organizations","/careers","/about#guidance","/about"];
const groups = [
  ["PLAN YOUR PATH", "Turn a broad dream into a route you can understand.", [0,3]],
  ["FUND THE JOURNEY", "Find funding early and prepare before deadlines arrive.", [1,4]],
  ["FIND YOUR PEOPLE", "Build the relationships and resilience that keep you moving.", [2,5]],
] as const;

export default function Resources() {
  return <PageShell active="resources">
    <section className="sub-hero resources-hero"><div>
      <span className="eyebrow">LEARN. CONNECT. TAKE FLIGHT.</span>
      <h1>Your Aviation Resource Hub</h1>
      <p>Practical guidance adapted from Ishitha Arekapudi’s <i>Cleared for Takeoff</i>.</p>
      <label className="search-box"><Icon name="search"/><input placeholder="What do you want to learn?"/></label>
    </div></section>
    <section className="section resource-editorial">
      <div className="resource-editorial-intro"><span>WHERE TO BEGIN</span><h2>One clear answer can change the direction of your journey.</h2><blockquote>“It’s never too early to start. From wherever you are right now, there are steps you can take to begin building your path.”</blockquote><small>From <i>Cleared for Takeoff</i></small></div>
      <div className="resource-groups">{groups.map(([label,note,indexes],groupIndex)=><section key={label}>
        <header><span>0{groupIndex+1}</span><div><h2>{label}</h2><p>{note}</p></div></header>
        <div>{indexes.map(index=>{const [icon,title,text,action]=manuscriptResources[index]; return <article key={title}><div className="square-icon"><Icon name={icon}/></div><div><h3>{title}</h3><p>{text}</p><Link href={links[index]}>{action} →</Link></div></article>})}</div>
      </section>)}</div>
      <section className="book-resource-feature" id="book-excerpt">
        <img className="actual-book-cover" src="/cleared-for-takeoff-cover.jpg" alt="Cleared for Takeoff book cover by Ishitha Arekapudi"/>
        <div className="inline-book-excerpt"><span className="eyebrow">FROM THE PREFACE</span><h2>Cleared for Takeoff</h2><p>Imagine looking up in 2037 and seeing a sky filled with airplanes, piloted by a new generation of aviators and knowing that somewhere beyond Earth’s atmosphere, humans are living and working on Mars. This vision is no longer science fiction. Aviation and space are transforming in ways once unimaginable.</p><p>These trends reveal a unique opportunity for today’s young people: the chance to lead in fields that are reshaping the future of our world and beyond. Today’s teens and young adults will be the next explorers, the pioneers who will push past Earth’s borders and redefine what’s possible. This generation, our generation, has the chance to mark milestones in human history.</p><p>I wrote <i>Cleared for Takeoff</i> as a guide to help you navigate the paths to becoming pilots, engineers, scientists, mechanics, and innovators, empowering you to explore careers in aviation and space. While opportunities in these fields are expanding, they can often seem out of reach. My goal with this book is to break down those barriers and show you how to access the knowledge, resources, and networks that will open doors and launch your journey.</p><p>Consider this book your roadmap, a way to help you find direction, gain confidence, and explore all the opportunities that aviation and space have to offer. The future of aviation and space is waiting, and it’s calling for people like you to answer.</p><a className="primary-button" href="#book-purchase">Buy From Sky Riders →</a></div>
      </section>
      <section className="resource-book-purchase" id="book-purchase"><div><span className="eyebrow">ORDER DIRECTLY</span><h2>Bring the roadmap with you.</h2><p>Online checkout is being prepared. This section is ready for direct book purchases once payment and shipping are connected.</p></div><button disabled>Checkout Coming Soon</button></section>
    </section>
  </PageShell>;
}
