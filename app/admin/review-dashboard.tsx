"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";
import type { Database } from "../../lib/supabase/database.types";
import { BrandLogo } from "../ui";

type Opportunity = Database["public"]["Tables"]["opportunity_submissions"]["Row"];
type Mentor = Database["public"]["Tables"]["mentor_applications"]["Row"];
type Mentee = Database["public"]["Tables"]["mentee_applications"]["Row"];
type Contact = Database["public"]["Tables"]["contact_inquiries"]["Row"];
type Deletion = Database["public"]["Tables"]["data_deletion_requests"]["Row"];
type QueueKey = "opportunities" | "mentors" | "mentees" | "contacts" | "privacy";
type ReviewItem = Opportunity | Mentor | Mentee | Contact | Deletion;

const statuses: Record<QueueKey, string[]> = {
  opportunities: ["pending", "needs_information", "approved", "declined"], mentors: ["pending", "screening", "approved", "declined", "paused"], mentees: ["pending", "guardian_consent", "approved", "matched", "declined", "paused"], contacts: ["new", "in_progress", "closed"], privacy: ["pending", "identity_verification", "in_progress", "completed", "declined"],
};

function titleFor(item: ReviewItem, queue: QueueKey) {
  if (queue === "opportunities") return (item as Opportunity).name;
  if (queue === "contacts") return `${(item as Contact).name}: ${(item as Contact).topic}`;
  if (queue === "privacy") return `${(item as Deletion).requester_name}: ${(item as Deletion).request_scope}`;
  const person = item as Mentor | Mentee;
  return `${person.first_name} ${person.last_name}`;
}
function emailFor(item: ReviewItem, queue: QueueKey) {
  if (queue === "opportunities") return (item as Opportunity).submitter_email;
  if (queue === "privacy") return (item as Deletion).requester_email;
  return (item as Mentor | Mentee | Contact).email;
}
function isOpen(item: ReviewItem, queue: QueueKey) {
  if (queue === "contacts") return item.status !== "closed";
  if (queue === "privacy") return !["completed", "declined"].includes(item.status);
  return !["approved", "declined", "matched"].includes(item.status);
}

function Summary({ item, queue }: { item: ReviewItem; queue: QueueKey }) {
  if (queue === "opportunities") { const row = item as Opportunity; return <><p>{row.description}</p><dl><div><dt>Type</dt><dd>{row.submission_type}</dd></div><div><dt>Submitted by</dt><dd>{row.submitter_name} · {row.submitter_connection}</dd></div><div><dt>Location</dt><dd>{row.location || "Not supplied"}</dd></div><div><dt>Official source</dt><dd><a href={row.official_url} target="_blank" rel="noreferrer">Open website ↗</a></dd></div></dl></>; }
  if (queue === "contacts") { const row = item as Contact; return <><p>{row.message}</p><dl><div><dt>Topic</dt><dd>{row.topic}</dd></div><div><dt>Organization</dt><dd>{row.organization || "Not supplied"}</dd></div></dl></>; }
  if (queue === "privacy") { const row = item as Deletion; return <><p>{row.details}</p><dl><div><dt>Request</dt><dd>{row.request_scope}</dd></div><div><dt>Required step</dt><dd>Verify ownership before disclosing or deleting any record.</dd></div></dl></>; }
  if (queue === "mentors") { const row = item as Mentor; return <><p>{row.experience_qualifications}</p><dl><div><dt>Age</dt><dd>{row.age_range}</dd></div><div><dt>Location</dt><dd>{row.city_state}</dd></div><div><dt>Role</dt><dd>{row.current_role_organization}</dd></div><div><dt>Interests</dt><dd>{row.interest_areas.join(", ")}</dd></div><div><dt>Preferred mentees</dt><dd>{row.preferred_mentee_age}</dd></div><div><dt>Availability</dt><dd>{row.availability}</dd></div></dl></>; }
  const row = item as Mentee; const minor = ["13–15", "16–17"].includes(row.age_range);
  return <><p>{row.guidance_requested}</p><dl><div><dt>Age</dt><dd>{row.age_range}</dd></div><div><dt>General location</dt><dd>{row.city_state}</dd></div><div><dt>Stage</dt><dd>{row.current_stage}</dd></div><div><dt>Interests</dt><dd>{row.interest_areas.join(", ")}</dd></div><div><dt>Availability</dt><dd>{row.availability}</dd></div>{minor && <div><dt>Guardian status</dt><dd>{row.guardian_consent_verified_at ? `Independently verified${row.guardian_consent_verification_method ? `: ${row.guardian_consent_verification_method}` : ""}` : row.guardian_consent_confirmed ? "Applicant attestation only; independent verification required" : "Missing"}</dd></div>}</dl></>;
}

export function AdminReviewDashboard({ adminId, adminEmail, initial }: { adminId: string; adminEmail: string; initial: { opportunities: Opportunity[]; mentors: Mentor[]; mentees: Mentee[]; contacts: Contact[]; privacy: Deletion[] } }) {
  const [queue, setQueue] = useState<QueueKey>("opportunities"); const [records, setRecords] = useState(initial); const [filter, setFilter] = useState("open"); const [saving, setSaving] = useState<string | null>(null); const [message, setMessage] = useState("");
  const items = useMemo(() => records[queue].filter((item) => filter === "all" || isOpen(item, queue)), [records, queue, filter]);
  const counts = (Object.keys(records) as QueueKey[]).reduce((result, key) => ({ ...result, [key]: records[key].filter((item) => isOpen(item, key)).length }), {} as Record<QueueKey, number>);

  async function review(id: string, status: string, notes: string, guardianVerified = false, guardianMethod = "") {
    setSaving(id); setMessage(""); const reviewed = !["pending", "new"].includes(status);
    const payload: Record<string, string | null> = { status, review_notes: notes.trim() || null, reviewed_at: reviewed ? new Date().toISOString() : null, reviewed_by: adminId };
    if (queue === "mentees" && guardianVerified) { payload.guardian_consent_verified_at = new Date().toISOString(); payload.guardian_consent_verified_by = adminId; payload.guardian_consent_verification_method = guardianMethod.trim() || "Verified outside the applicant form"; }
    const supabase = createClient();
    let error: { message: string } | null = null;
    if (queue === "opportunities") error = (await supabase.from("opportunity_submissions").update(payload as Database["public"]["Tables"]["opportunity_submissions"]["Update"]).eq("id", id)).error;
    if (queue === "mentors") error = (await supabase.from("mentor_applications").update(payload as Database["public"]["Tables"]["mentor_applications"]["Update"]).eq("id", id)).error;
    if (queue === "mentees") error = (await supabase.from("mentee_applications").update(payload as Database["public"]["Tables"]["mentee_applications"]["Update"]).eq("id", id)).error;
    if (queue === "contacts") error = (await supabase.from("contact_inquiries").update(payload as Database["public"]["Tables"]["contact_inquiries"]["Update"]).eq("id", id)).error;
    if (queue === "privacy") error = (await supabase.from("data_deletion_requests").update(payload as Database["public"]["Tables"]["data_deletion_requests"]["Update"]).eq("id", id)).error;
    if (error) setMessage(error.message); else { setRecords((current) => ({ ...current, [queue]: current[queue].map((item) => item.id === id ? { ...item, ...payload } : item) })); setMessage("Review saved."); }
    setSaving(null);
  }

  return <main className="admin-page">
    <header className="admin-header"><div className="admin-brand"><BrandLogo /></div><div className="admin-heading"><span className="eyebrow">PRIVATE ADMINISTRATOR AREA</span><h1>Gateway Review Center</h1><p>Review mentorship applications, community submissions, privacy requests, and inquiries in one secure place.</p></div><div className="admin-identity"><span>Signed in securely as</span><strong>{adminEmail}</strong><Link href="/dashboard">Return to My Gateway →</Link></div></header>
    <aside className="admin-security-note"><strong>Safety checklist</strong><span>Use MFA on every administrator service, verify guardian consent outside the teen application, keep sensitive identity documents out of notes and email, and review the administrator allowlist regularly.</span></aside>
    <nav className="admin-tabs" aria-label="Review queues">{(Object.keys(records) as QueueKey[]).map((key) => <button key={key} className={queue === key ? "active" : ""} onClick={() => setQueue(key)}><span>{key === "opportunities" ? "Submissions" : key[0].toUpperCase() + key.slice(1)}</span><b>{counts[key]}</b></button>)}</nav>
    <section className="admin-toolbar"><h2>{queue === "opportunities" ? "Opportunity and organization submissions" : queue === "privacy" ? "Privacy and deletion requests" : queue}</h2><div><button className={filter === "open" ? "active" : ""} onClick={() => setFilter("open")}>Needs review</button><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All records</button></div></section>
    {message && <p className="admin-message" role="status">{message}</p>}<section className="admin-review-list">{items.length === 0 && <div className="admin-empty"><h3>Queue clear</h3><p>There are no records in this view.</p></div>}{items.map((item) => <ReviewCard key={item.id} item={item} queue={queue} saving={saving === item.id} onSave={review} />)}</section>
  </main>;
}

function ReviewCard({ item, queue, saving, onSave }: { item: ReviewItem; queue: QueueKey; saving: boolean; onSave: (id: string, status: string, notes: string, guardianVerified?: boolean, guardianMethod?: string) => void }) {
  const [status, setStatus] = useState(item.status); const [notes, setNotes] = useState(item.review_notes || ""); const mentee = queue === "mentees" ? item as Mentee : null; const teen = mentee ? ["13–15", "16–17"].includes(mentee.age_range) : false; const [guardianVerified, setGuardianVerified] = useState(Boolean(mentee?.guardian_consent_verified_at)); const [guardianMethod, setGuardianMethod] = useState(mentee?.guardian_consent_verification_method || "");
  return <article className="admin-review-card"><div className="admin-card-heading"><div><span>{queue === "opportunities" ? (item as Opportunity).submission_type : queue === "privacy" ? "privacy request" : queue.slice(0, -1)}</span><h3>{titleFor(item, queue)}</h3><a href={`mailto:${emailFor(item, queue)}`}>{emailFor(item, queue)}</a></div><time>{new Date(item.created_at).toLocaleString()}</time></div><Summary item={item} queue={queue} /><div className="admin-review-controls">{teen && <fieldset className="admin-guardian-check"><legend>Independent guardian verification</legend><label><input type="checkbox" checked={guardianVerified} onChange={(event) => setGuardianVerified(event.target.checked)} /> I independently verified the guardian outside this application.</label><input value={guardianMethod} onChange={(event) => setGuardianMethod(event.target.value)} placeholder="Method, for example verified call and follow-up email" /></fieldset>}<label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}>{statuses[queue].map((option) => <option key={option} value={option}>{option.replaceAll("_", " ")}</option>)}</select></label><label>Private review notes<textarea maxLength={600} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Do not enter identity documents, child details, or other sensitive information." /></label><button className="primary-button" disabled={saving} onClick={() => onSave(item.id, status, notes, guardianVerified, guardianMethod)}>{saving ? "Saving…" : "Save Review"}</button></div></article>;
}
