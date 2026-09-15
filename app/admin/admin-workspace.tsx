"use client";

import "./admin-workspace.css";

import { useState, type ReactNode } from "react";
import Link from "next/link";

type Section = "content" | "media" | "inbox";
export function AdminWorkspace({ content, media, inbox }: { content: ReactNode; media: ReactNode; inbox: ReactNode }) {
  const [section, setSection] = useState<Section>("content");
  const tabs: Array<[Section, string, string]> = [
    ["content", "Content", "Listings and homepage partners"],
    ["media", "Media", "Press features and logos"],
    ["inbox", "Inbox", "Submissions and requests"],
  ];
  return <main className="admin-workspace">
    <header className="admin-workspace-header">
      <div><span className="eyebrow">SKY RIDERS GATEWAY · ADMIN</span><h1>Manage Gateway</h1><p>Update what visitors see, add press features, or review new requests.</p></div>
      <Link href="/dashboard" className="admin-return-link">View my Gateway ↗</Link>
    </header>
    <nav className="admin-workspace-nav" aria-label="Admin areas">{tabs.map(([key, title, description]) => <button type="button" key={key} className={section === key ? "active" : ""} onClick={() => setSection(key)}><strong>{title}</strong><span>{description}</span></button>)}</nav>
    <section className="admin-workspace-panel">{section === "content" && content}{section === "media" && media}{section === "inbox" && inbox}</section>
  </main>;
}
