import Link from "next/link";
import type { DetailInfo } from "../detail-content";
import { Icon, PageShell } from "../ui";
import { SaveButton } from "./SaveButton";

export function DetailPage({ active, kind, title, summary, tags, info, backHref }: {
  active: string;
  kind: "Career" | "Organization" | "Scholarship";
  title: string;
  summary: string;
  tags?: readonly string[];
  info: DetailInfo;
  backHref: string;
}) {
  return <PageShell active={active}>
    <section className="detail-hero"><div className="detail-hero-inner">
      <Link className="detail-back" href={backHref}>← Back to {active}</Link>
      <span className="eyebrow">{kind.toUpperCase()} GUIDE</span>
      <h1>{title}</h1>
      <p>{summary}</p>
      {tags && <div className="tag-row">{tags.map(tag=><span key={tag}>{tag}</span>)}</div>}
      <div className="detail-actions"><a className="primary-button" href={info.officialUrl} target="_blank" rel="noreferrer">Visit Official Website ↗</a><SaveButton id={`${kind.toLowerCase()}:${title}`} label={`Save ${kind}`}/></div>
    </div></section>
    <section className="detail-content">
      <article className="detail-main">
        <span className="eyebrow">OVERVIEW</span>
        <h2>What to Know</h2>
        <p>{info.overview}</p>
        <h2>Key Details</h2>
        <ul className="detail-list">{info.highlights.map(item=><li key={item}><Icon name="plane"/><span>{item}</span></li>)}</ul>
      </article>
      <aside className="detail-sidebar">
        <div className="detail-source"><Icon name="document"/><span>Information checked against</span><strong>{info.sourceLabel}</strong><a href={info.officialUrl} target="_blank" rel="noreferrer">Open official source ↗</a></div>
        <div className="detail-next"><h3>Your Next Steps</h3><ol>{info.nextSteps.map(step=><li key={step}>{step}</li>)}</ol><Link className="small-button" href="/explore">Add to My Roadmap →</Link></div>
      </aside>
    </section>
  </PageShell>;
}

