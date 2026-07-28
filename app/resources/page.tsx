import Link from "next/link";
import { manuscriptResources } from "../content";
import { Icon, PageShell } from "../ui";
import { BookStore } from "../components/BookStore";

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
      <BookStore/>
      <div className="resource-groups">{groups.map(([label,note,indexes],groupIndex)=><section key={label}>
        <header><span>0{groupIndex+1}</span><div><h2>{label}</h2><p>{note}</p></div></header>
        <div>{indexes.map(index=>{const [icon,title,text,action]=manuscriptResources[index]; return <article key={title}><div className="square-icon"><Icon name={icon}/></div><div><h3>{title}</h3><p>{text}</p><Link href={links[index]}>{action} →</Link></div></article>})}</div>
      </section>)}</div>
    </section>
  </PageShell>;
}
