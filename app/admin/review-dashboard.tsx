"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";
import type { Database } from "../../lib/supabase/database.types";

type Opportunity = Database["public"]["Tables"]["opportunity_submissions"]["Row"];
type Mentor = Database["public"]["Tables"]["mentor_applications"]["Row"];
type Mentee = Database["public"]["Tables"]["mentee_applications"]["Row"];
type Contact = Database["public"]["Tables"]["contact_inquiries"]["Row"];
type QueueKey = "opportunities" | "mentors" | "mentees" | "contacts";
type ReviewItem = Opportunity | Mentor | Mentee | Contact;

const tableByQueue = {
  opportunities: "opportunity_submissions",
  mentors: "mentor_applications",
  mentees: "mentee_applications",
  contacts: "contact_inquiries",
} as const;

const statuses: Record<QueueKey, string[]> = {
  opportunities: ["pending", "needs_information", "approved", "declined"],
  mentors: ["pending", "screening", "approved", "declined", "paused"],
  mentees: ["pending", "guardian_consent", "approved", "matched", "declined", "paused"],
  contacts: ["new", "in_progress", "closed"],
};

function titleFor(item: ReviewItem, queue: QueueKey) {
  if (queue === "opportunities") return (item as Opportunity).name;
  if (queue === "contacts") return `${(item as Contact).name}: ${(item as Contact).topic}`;
  const person = item as Mentor | Mentee;
  return `${person.first_name} ${person.last_name}`;
}

function emailFor(item: ReviewItem, queue: QueueKey) {
  if (queue === "opportunities") return (item as Opportunity).submitter_email;
  return (item as Mentor | Mentee | Contact).email;
}

function Summary({ item, queue }: { item: ReviewItem; queue: QueueKey }) {
  if (queue === "opportunities") {
    const row = item as Opportunity;
    return <><p>{row.description}</p><dl><div><dt>Type</dt><dd>{row.submission_type}</dd></div><div><dt>Submitted by</dt><dd>{row.submitter_name} · {row.submitter_connection}</dd></div><div><dt>Location</dt><dd>{row.location || "Not supplied"}</dd></div><div><dt>Official source</dt><dd><a href={row.official_url} target="_blank" rel="noreferrer">Open website ↗</a></dd></div></dl></>;
  }
  if (queue === "contacts") {
    const row = item as Contact;
    return <><p>{row.message}</p><dl><div><dt>Topic</dt><dd>{row.topic}</dd></div><div><dt>Organization</dt><dd>{row.organization || "Not supplied"}</dd></div></dl></>;
  }
  if (queue === "mentors") {
    const row = item as Mentor;
    return <><p>{row.experience_qualifications}</p><dl><div><dt>Age</dt><dd>{row.age_range}</dd></div><div><dt>Location</dt><dd>{row.city_state}</dd></div><div><dt>Role</dt><dd>{row.current_role_organization}</dd></div><div><dt>Interests</dt><dd>{row.interest_areas.join(", ")}</dd></div><div><dt>Preferred mentees</dt><dd>{row.preferred_mentee_age}</dd></div><div><dt>Availability</dt><dd>{row.availability}</dd></div></dl></>;
  }
  const row = item as Mentee;
  const minor = ["13–15", "16–17"].includes(row.age_range);
  return <><p>{row.guidance_requested}</p><dl><div><dt>Age</dt><dd>{row.age_range}</dd></div><div><dt>General location</dt><dd>{row.city_state}</dd></div><div><dt>Stage</dt><dd>{row.current_stage}</dd></div><div><dt>Interests</dt><dd>{row.interest_areas.join(", ")}</dd></div><div><dt>Availability</dt><dd>{row.availability}</dd></div>{minor && <div><dt>Guardian attestation</dt><dd>{row.guardian_consent_confirmed ? "Provided, independent verification still required" : "Missing"}</dd></div>}</dl></>;
}

export function AdminReviewDashboard({ adminId, adminEmail, initial }: {
  adminId: string;
  adminEmail: string;
  initial: { opportunities: Opportunity[]; mentors: Mentor[]; mentees: Mentee[]; contacts: Contact[] };
}) {
  const [queue, setQueue] = useState<QueueKey>("opportunities");
  const [records, setRecords] = useState(initial);
  const [filter, setFilter] = useState("open");
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const items = useMemo(() => records[queue].filter((item) => {
    if (filter === "all") return true;
    if (queue === "contacts") return item.status !== "closed";
    return !["approved", "declined", "matched"].includes(item.status);
  }), [records, queue, filter]);

  async function review(id: string, status: string, notes: string) {
    setSaving(id); setMessage("");
    const reviewed = !["pending", "new"].includes(status);
    const payload = { status, review_notes: notes.trim() || null, reviewed_at: reviewed ? new Date().toISOString() : null, reviewed_by: adminId };
    const supabase = createClient();
    const { error } = await supabase.from(tableByQueue[queue]).update(payload).eq("id", id);
    if (error) setMessage(error.message);
    else {
      setRecords((current) => ({ ...current, [queue]: current[queue].map((item) => item.id === id ? { ...item, ...payload } : item) }));
      setMessage("Review saved.");
    }
    setSaving(null);
  }

  const counts = (Object.keys(records) as QueueKey[]).reduce((result, key) => ({ ...result, [key]: records[key].filter((item) => key === "contacts" ? item.status !== "closed" : !["approved", "declined", "matched"].includes(item.status)).length }), {} as Record<QueueKey, number>);

  return <main className="admin-page">
    <header className="admin-header"><div><span className="eyebrow">PRIVATE ADMINISTRATOR AREA</span><h1>Submission Review</h1><p>Review applications and community submissions without placing private details in email.</p></div><div className="admin-identity"><span>Signed in securely as</span><strong>{adminEmail}</strong><Link href="/dashboard">My Gateway</Link></div></header>
    <nav className="admin-tabs" aria-label="Review queues">
      {(Object.keys(records) as QueueKey[]).map((key) => <button key={key} className={queue === key ? "active" : ""} onClick={() => setQueue(key)}><span>{key === "opportunities" ? "Submissions" : key[0].toUpperCase() + key.slice(1)}</span><b>{counts[key]}</b></button>)}
    </nav>
    <section className="admin-toolbar"><h2>{queue === "opportunities" ? "Opportunity and organization submissions" : queue}</h2><div><button className={filter === "open" ? "active" : ""} onClick={() => setFilter("open")}>Needs review</button><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All records</button></div></section>
    {message && <p className="admin-message" role="status">{message}</p>}
    <section className="admin-review-list">
      {items.length === 0 && <div className="admin-empty"><h3>Queue clear</h3><p>There are no records in this view.</p></div>}
      {items.map((item) => <ReviewCard key={item.id} item={item} queue={queue} saving={saving === item.id} onSave={review} />)}
    </section>
  </main>;
}

function ReviewCard({ item, queue, saving, onSave }: { item: ReviewItem; queue: QueueKey; saving: boolean; onSave: (id: string, status: string, notes: string) => void }) {
  const [status, setStatus] = useState(item.status);
  const [notes, setNotes] = useState(item.review_notes || "");
  return <article className="admin-review-card">
    <div className="admin-card-heading"><div><span>{queue === "opportunities" ? (item as Opportunity).submission_type : queue.slice(0, -1)}</span><h3>{titleFor(item, queue)}</h3><a href={`mailto:${emailFor(item, queue)}`}>{emailFor(item, queue)}</a></div><time>{new Date(item.created_at).toLocaleString()}</time></div>
    <Summary item={item} queue={queue} />
    <div className="admin-review-controls"><label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}>{statuses[queue].map((option) => <option key={option} value={option}>{option.replaceAll("_", " ")}</option>)}</select></label><label>Private review notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Only administrators can read these notes." /></label><button className="primary-button" disabled={saving} onClick={() => onSave(item.id, status, notes)}>{saving ? "Saving…" : "Save Review"}</button></div>
  </article>;
}
