"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";

type Section = "content" | "media" | "inbox";
export function AdminWorkspace({ content, media, inbox }: { content: ReactNode; media: ReactNode; inbox: ReactNode }) {
  const [section, setSection] = useState<Section>("content");
  const tabs: Array<[Section, string, string]> = [
    ["content", "Website content", "Organizations, careers, and scholarships"],
    ["media", "Media & press", "Featured outlets and logos"],
    ["inbox", "Review inbox", "Submissions, messages, and privacy requests"],
  ];
  return <main className="admin-workspace">
    <header className="admin-workspace-header">
      <div><span className="eyebrow">SKY RIDERS GATEWAY</span><h1>Your control center</h1><p>Choose an area below to update the website or review incoming requests.</p></div>
      <Link href="/dashboard" className="admin-return-link">Return to My Gateway →</Link>
    </header>
    <nav className="admin-workspace-nav" aria-label="Admin areas">{tabs.map(([key, title, description]) => <button type="button" key={key} className={section === key ? "active" : ""} onClick={() => setSection(key)}><strong>{title}</strong><span>{description}</span></button>)}</nav>
    <section className="admin-workspace-panel">{section === "content" && content}{section === "media" && media}{section === "inbox" && inbox}</section>
  </main>;
}
