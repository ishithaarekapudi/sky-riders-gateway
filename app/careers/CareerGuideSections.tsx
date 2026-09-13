import Link from "next/link";
import type { CareerGuide } from "./career-guides";
import styles from "./career-guide.module.css";

export function CareerGuideSections({ guide }: { guide: CareerGuide }) {
  return <div className={styles.guide}>
    <section id="key-details" className={styles.section} aria-labelledby="career-work-title">
      <span className="eyebrow">BEHIND THE JOB TITLE</span>
      <h2 id="career-work-title">What the work is like</h2>
      <p>{guide.work}</p>
      <h3>Could this fit you?</h3>
      <p>{guide.fit}</p>
    </section>
    <section id="training" className={styles.section} aria-labelledby="career-training-title">
      <span className="eyebrow">FIND YOUR WAY IN</span>
      <h2 id="career-training-title">Training and routes into the field</h2>
      <p>{guide.training}</p>
      <p className={styles.note}>This guide focuses on U.S. pathways. Use the linked sources and current job or course listings to check the requirements for your situation.</p>
    </section>
    <section id="career-terms" className={styles.section} aria-labelledby="career-terms-title">
      <span className="eyebrow">PLAIN ENGLISH</span>
      <h2 id="career-terms-title">Terms you will hear</h2>
      <dl className={styles.terms}>{guide.terms.map(([term, meaning]) => <div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>)}</dl>
    </section>
    <section id="next-steps" className={`${styles.section} ${styles.start}`} aria-labelledby="career-next-title">
      <span className="eyebrow">START SMALL</span>
      <h2 id="career-next-title">Try a first step</h2>
      <p>{guide.tryIt}</p>
      <h3>A question to ask someone in this field</h3>
      <p>{guide.ask}</p>
      <div className={styles.actions}><Link href="/scholarships">Explore funding →</Link><Link href="/organizations">Find a community →</Link><Link href="/careers">Compare other careers →</Link></div>
    </section>
    <section id="career-sources" className={styles.section} aria-labelledby="career-sources-title">
      <span className="eyebrow">KEEP EXPLORING</span>
      <h2 id="career-sources-title">Sources and further reading</h2>
      <ul>{guide.sources.map(([label, url]) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{label} ↗</a></li>)}</ul>
      <p className={styles.note}>Career exploration builds on Ishitha&apos;s <Link href="/resources#book-excerpt">Cleared for Takeoff</Link>, “Careers in the Aviation Industry,” pages 32–42, with additional explanations and suggested activities from Gateway. Official sources reviewed September 13, 2026.</p>
    </section>
  </div>;
}
