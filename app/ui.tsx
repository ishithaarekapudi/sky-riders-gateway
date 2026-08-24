import Link from "next/link";
import { AboutMenu } from "./components/AboutMenu";
import { MobileNav } from "./components/MobileNav";
import { AccountActions } from "./components/AccountActions";

export function Logo() { return <BrandLogo />; }

export function BrandLogo({ footer = false }: { footer?: boolean }) {
  return <Link href="/" className={`brand-logo${footer ? " brand-logo-footer" : ""}`} aria-label="Sky Riders Gateway home">
    <span className="brand-mark-wrap" aria-hidden="true">
      <img className="brand-mark" src="/brand/sky-riders-mark-v3.png" alt="" />
    </span>
    <span className="brand-words"><b>SKY RIDERS</b><small>GATEWAY</small></span>
  </Link>;
}

export function Header({ active, originalLogo = false }: { active?: string; originalLogo?: boolean }) {
  const links = [["Scholarships","/scholarships"],["Organizations","/organizations"],["Careers","/careers"],["Resources","/resources"],["Get Involved","/get-involved"]];
  return <header className="site-header">{originalLogo?<BrandLogo />:<Logo />}<nav><Link className={active==="home"?"active":""} href="/">Home</Link><Link className={active==="explore"?"active":""} href="/explore">Explore</Link><AboutMenu active={active}/>{links.map(([label,href])=><Link className={active===label.toLowerCase().replace(" ","-")?"active":""} href={href} key={href}>{label}</Link>)}</nav><AccountActions/><MobileNav active={active}/></header>;
}

export function Footer() { return <footer><div className="footer-grid"><div><BrandLogo footer /><p>Connecting students to opportunities in aviation and aerospace, and building a more inclusive future.</p></div><div><h4>Explore</h4><Link href="/careers">Career Paths</Link><Link href="/scholarships">Scholarships</Link><Link href="/organizations">Organizations</Link></div><div><h4>Get Involved</h4><Link href="/get-involved/submit">Submit an Opportunity</Link><Link href="/get-involved/mentorship">Become a Mentor</Link><Link href="/get-involved/mentorship">Find a Mentor</Link></div><div><h4>About</h4><Link href="/about/gateway">About Gateway</Link><Link href="/about">Meet the Founder</Link></div><div className="footer-resources"><h4>Resources</h4><Link href="/resources">Resource Hub</Link><Link href="/resources#book-excerpt">Cleared for Takeoff</Link><Link href="/about/media">Media &amp; Press</Link><Link href="/privacy">Privacy</Link><Link href="/parent-consent">Parent Controls</Link><Link href="/privacy/delete">Data Requests</Link><Link href="/youth-safety">Youth Safety</Link><Link href="/disclaimer">Terms &amp; Disclaimer</Link></div></div><div className="footer-bottom">© 2026 Sky Riders Gateway <span><Link href="/privacy">Privacy</Link> · <Link href="/parent-consent">Parent Controls</Link> · <Link href="/privacy/delete">Data Requests</Link> · <Link href="/youth-safety">Youth Safety</Link> · <Link href="/disclaimer">Terms &amp; Disclaimer</Link> · Accessibility</span></div></footer>; }

export function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    wing:<><path d="M4 10c4 0 7 1 10 4-5 1-8 0-10-4Zm16 0c-4 0-7 1-10 4 5 1 8 0 10-4ZM12 14v6"/></>,
    user:<><circle cx="12" cy="7" r="4"/><path d="M4 21c0-5 3-8 8-8s8 3 8 8"/></>,
    heart:<><path d="M20.8 4.8a5.4 5.4 0 0 0-7.6 0L12 6l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.6a5.4 5.4 0 0 0 0-7.6Z"/></>,
    cap:<><path d="m3 10 9-5 9 5-9 5-9-5Z"/><path d="M7 12v5c3 2 7 2 10 0v-5"/></>,
    people:<><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-5 2-8 6-8s6 3 6 8M14 14c4 0 7 2 7 6"/></>,
    globe:<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 4 6 4 9s-1 6-4 9c-3-3-4-6-4-9s1-6 4-9Z"/></>,
    calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 14h1M12 14h1M16 14h1"/></>,
    video:<><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/></>,
    document:<><path d="M6 3h8l4 4v14H6V3Z"/><path d="M14 3v5h5M9 12h6M9 16h6"/></>,
    headphones:<><path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h4v7H6a2 2 0 0 1-2-2v-5ZM20 14h-4v7h2a2 2 0 0 0 2-2v-5Z"/></>,
    presentation:<><path d="M4 4h16v12H4zM8 20l4-4 4 4"/></>,
    handshake:<><path d="m3 12 5-5 4 3 4-3 5 5-7 7-4-4-2 2-5-5Z"/></>,
    telescope:<><path d="m4 7 12-3 2 7-12 3-2-7ZM11 13l-2 8M14 12l4 9"/></>,
    path:<><path d="M5 21c0-8 14-5 14-13M16 8h3V5"/></>,
    school:<><path d="m3 10 9-6 9 6M5 10v10h14V10M9 20v-6h6v6"/></>,
    search:<><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></>,
    plane:<><path d="m3 11 18-6-6 14-3-6-6-2-3 0Z"/></>,
    airplane:<><path d="M12 3c.8 0 1.4.7 1.5 1.5l.8 6 6 3v2l-6-.9-.4 4 2.5 1.7v1.5L12 21l-4.4.8v-1.5l2.5-1.7-.4-4-6 .9v-2l6-3 .8-6C10.6 3.7 11.2 3 12 3Z"/></>,
    wrench:<><path d="M14 6a5 5 0 0 0-6 6L3 17l4 4 5-5a5 5 0 0 0 6-6l-3 3-4-4 3-3Z"/></>,
    code:<><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></>,
    cloud:<><path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 8.5 4.8 4.8 0 0 0 7 18Z"/></>,
    rocket:<><path d="M14 4c3-2 5-1 6-1 0 1 1 3-1 6l-6 6-5-1-1-5 6-6Z"/><path d="m11 13-4 4M8 12l-4 1-2 3 5 1M12 16l1 5 3-2 1-4"/><circle cx="16" cy="7" r="1.5"/></>,
    spacecraft:<><path d="M12 2.5c3.2 2.6 5 6 5 9.4 0 3.8-2 6.7-5 9.6-3-2.9-5-5.8-5-9.6 0-3.4 1.8-6.8 5-9.4Z"/><circle cx="12" cy="10" r="2.2"/><path d="m7.5 13-3 3v4l4.8-2M16.5 13l3 3v4l-4.8-2M10 21.5 12 24l2-2.5"/></>,
    gear:<><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/></>,
    drone:<><path d="M8 11h8l2 4H6l2-4ZM10 15v3M14 15v3M5 7h4M15 7h4M7 7l2 4M17 7l-2 4"/><circle cx="4" cy="7" r="2"/><circle cx="20" cy="7" r="2"/></>,
    tower:<><path d="M8 21h8l-2-12h-4L8 21ZM6 9h12M9 5h6v4H9zM12 2v3M5 14h14"/></>,
  };
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]||paths.plane}</svg>;
}

export function PillarCard({icon,title,text,bullets}:{icon:string;title:string;text:string;bullets:string[]}) { return <article className="pillar-card"><div className={`pillar-image pillar-image-${icon}`} aria-hidden="true"/><div className="round-icon"><Icon name={icon}/></div><h3>{title}</h3><p>{text}</p><ul>{bullets.map(b=><li key={b}>✓ <span>{b}</span></li>)}</ul></article>; }

export function PageShell({active,children}:{active:string;children:React.ReactNode}) { return <main><div className="page-shell"><Header active={active} originalLogo/>{children}</div><Footer/></main>; }
