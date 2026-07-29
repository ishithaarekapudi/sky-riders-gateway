"use client";

import Link from "next/link";
import { useState } from "react";

export function AboutMenu({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`about-nav-menu${active === "about" || active === "gateway" ? " active" : ""}`}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        About
      </button>
      {open && (
        <div className="about-nav-dropdown" role="menu">
          <Link href="/about/gateway" role="menuitem" onClick={() => setOpen(false)}>Gateway</Link>
          <Link href="/about" role="menuitem" onClick={() => setOpen(false)}>Ishitha Arekapudi</Link>
        </div>
      )}
    </div>
  );
}
