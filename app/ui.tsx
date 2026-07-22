import Link from "next/link";

export function Logo() { return <Link href="/" className="logo"><Icon name="wing" /><span><b>SKY RIDERS</b><small>GATEWAY</small></span></Link>; }

export function Header({ active, originalLogo = false }: { active?: string; originalLogo?: boolean }) {
  const links = [["Explore","/explore"],["Scholarships","/scholarships"],["Organizations","/organizations"],["Careers","/careers"],["Resources","/resources"]];
  return <header className="site-header">{originalLogo?<Link href="/" className="live-brand-logo" aria-label="Sky Riders Gateway home"><img src="/sky-riders-logo-original.jpg" alt="Sky Riders Gateway" /></Link>:<Logo />}<nav>{links.map(([label,href])=><Link className={active===label.toLowerCase()?"active":""} href={href} key={href}>{label}</Link>)}</nav><div className="account-actions"><button className="ghost-button">Log In</button><button className="small-button">Sign Up</button></div></header>;
}

export function Footer() { return <footer><div className="footer-grid"><div><Logo /><p>Connecting students to opportunities in aviation and building a more inclusive future.</p></div><div><h4>Explore</h4><Link href="/careers">Career Paths</Link><Link href="/scholarships">Scholarships</Link><Link href="/organizations">Organizations</Link></div><div><h4>Resources</h4><Link href="/resources">Career Guide</Link><Link href="/resources">Podcasts & Stories</Link><Link href="/resources">School Talks</Link></div><div><h4>About</h4><a>Our Mission</a><a>Partners</a><a>Contact</a></div></div><div className="footer-bottom">© 2026 Sky Riders Gateway <span>Privacy · Terms · Accessibility</span></div></footer>; }

export function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    wing:<><path d="M4 10c4 0 7 1 10 4-5 1-8 0-10-4Zm16 0c-4 0-7 1-10 4 5 1 8 0 10-4ZM12 14v6"/></>,
    user:<><circle cx="12" cy="7" r="4"/><path d="M4 21c0-5 3-8 8-8s8 3 8 8"/></>,
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
    wrench:<><path d="M14 6a5 5 0 0 0-6 6L3 17l4 4 5-5a5 5 0 0 0 6-6l-3 3-4-4 3-3Z"/></>,
    code:<><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></>,
  };
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]||paths.plane}</svg>;
}

export function PillarCard({icon,title,text,bullets}:{icon:string;title:string;text:string;bullets:string[]}) { return <article className="pillar-card"><div className={`pillar-image pillar-image-${icon}`} aria-hidden="true"/><div className="round-icon"><Icon name={icon}/></div><h3>{title}</h3><p>{text}</p><ul>{bullets.map(b=><li key={b}>✓ <span>{b}</span></li>)}</ul></article>; }

export function PageShell({active,children}:{active:string;children:React.ReactNode}) { return <main><div className="concept-pill">SKY RIDERS GATEWAY</div><div className="page-shell"><Header active={active} originalLogo/>{children}</div><Footer/></main>; }
