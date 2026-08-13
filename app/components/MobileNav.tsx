"use client";

import Link from "next/link";
import { useState } from "react";
import { AccountActions } from "./AccountActions";

const links = [
  ["Scholarships", "/scholarships"],
  ["Organizations", "/organizations"],
  ["Careers", "/careers"],
  ["Resources", "/resources"],
  ["Get Involved", "/get-involved"],
] as const;

export function MobileNav({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-nav">
      <button
        className="mobile-menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-site-menu"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpen((current) => !current)}
      >
        <span /><span /><span />
      </button>
      {open && (
        <div className="mobile-nav-panel" id="mobile-site-menu">
          <nav aria-label="Mobile navigation">
            <Link className={active === "home" ? "active" : ""} href="/" onClick={() => setOpen(false)}>Home</Link>
            <Link className={active === "explore" ? "active" : ""} href="/explore" onClick={() => setOpen(false)}>Explore</Link>
            <span className="mobile-about-label">About</span>
            <Link className={active === "gateway" ? "active mobile-about-link" : "mobile-about-link"} href="/about/gateway" onClick={() => setOpen(false)}>Gateway</Link>
            <Link className={active === "about" ? "active mobile-about-link" : "mobile-about-link"} href="/about" onClick={() => setOpen(false)}>Ishitha Arekapudi, Founder</Link>
            {links.map(([label, href]) => (
              <Link className={active === label.toLowerCase().replace(" ", "-") ? "active" : ""} href={href} onClick={() => setOpen(false)} key={href}>{label}</Link>
            ))}
          </nav>
          <AccountActions mobile onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
