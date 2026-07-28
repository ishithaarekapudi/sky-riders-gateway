"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  ["Home", "/"],
  ["Explore", "/explore"],
  ["Scholarships", "/scholarships"],
  ["Organizations", "/organizations"],
  ["Careers", "/careers"],
  ["Resources", "/resources"],
  ["About", "/about"],
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
            {links.map(([label, href]) => (
              <Link className={active === label.toLowerCase() ? "active" : ""} href={href} onClick={() => setOpen(false)} key={href}>{label}</Link>
            ))}
          </nav>
          <div className="mobile-account-actions">
            <Link href="/account" onClick={() => setOpen(false)}>Log In</Link>
            <Link className="small-button" href="/account" onClick={() => setOpen(false)}>Sign Up</Link>
          </div>
        </div>
      )}
    </div>
  );
}
