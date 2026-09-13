"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { type CatalogItem, type CatalogKind } from "../../lib/catalog-model";

type Submission = { id: string; name: string; description: string; official_url: string; submission_type: string; logo_url?: string | null; logo_path?: string | null; previewUrl?: string; cost_or_award: string | null; eligible_ages: string | null; location: string | null };
const blank = (kind: CatalogKind): CatalogItem => ({ id: "", kind, title: "", slug: "", summary: "", logoUrl: "", published: false, partner: false, order: 0, tags: [], award: "", deadline: "", location: "", education: "", category: "", icon: "plane", info: { officialUrl: "", sourceLabel: "", overview: "", highlights: [], nextSteps: [] } });
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export function ContentManager({ initial, submissions, setupError }: { initial: CatalogItem[]; submissions: Submission[]; setupError: boolean }) {
  const [items, setItems] = useState(initial), [kind, setKind] = useState<CatalogKind>("organizations"), [query, setQuery] = useState("");
  const [editing, setEditing] = useState<CatalogItem | null>(null), [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  const [submissionId, setSubmissionId] = useState("");
  async function save(item: CatalogItem) {
    if (busy) return;
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save.");
      setItems(current => [...current.filter(row => row.id !== result.item.id || row.kind !== item.kind), result.item]);
      setEditing(null); setMessage("Saved. Published changes appear on the website immediately after refresh.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save. Please try again."); }
    finally { setBusy(false); }
  }
  async function upload(file?: File, fromSubmission?: string) {
    if (busy) return;
    setBusy(true); setMessage("");
    try {
      const data = new FormData(); if (file) data.set("logo", file); if (fromSubmission) data.set("submissionId", fromSubmission);
      const response = await fetch("/api/admin/logo", { method: "POST", body: data }); const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed.");
      setEditing(current => current ? { ...current, logoUrl: result.url } : current);
      setMessage("Logo ready. Save the listing to apply it.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed."); } finally { setBusy(false); }
  }
  function useSubmission() {
    const row = submissions.find(item => item.id === submissionId); if (!row) return;
    const nextKind = row.submission_type === "Organization" ? "organizations" : row.submission_type === "Scholarship" ? "scholarships" : "careers";
    setKind(nextKind); setEditing({ ...blank(nextKind), title: row.name, slug: slugify(row.name), summary: row.description, logoUrl: row.logo_url || "", award: row.cost_or_award || "", tags: row.eligible_ages ? [row.eligible_ages] : [], location: row.location || "", info: { officialUrl: row.official_url, sourceLabel: row.name, overview: row.description, highlights: [], nextSteps: [] } }); setMessage("Submission copied into a draft. Review it, import its logo if supplied, and save when ready.");
  }
  const visible = items.filter(row => row.kind === kind && `${row.title} ${row.summary}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="content-manager" aria-labelledby="content-manager-title">
    <div className="section-heading"><span>YOUR WEBSITE CONTENT</span><h2 id="content-manager-title">Update your website content</h2><p>Choose a category, find an existing listing, then edit it or add a new one. For organizations, you can also choose whether it appears as a homepage partner.</p></div>
    <ol className="content-manager-steps"><li>Choose a category</li><li>Search or add a listing</li><li>Save when you are ready</li></ol>
    {setupError && <p role="alert" className="form-error">Content tools need the database update before they can save. Existing review queues are still available below.</p>}
    <div className="admin-tabs">{(["organizations", "careers", "scholarships"] as const).map(tab => <button disabled={busy} type="button" className={kind === tab ? "active" : ""} key={tab} onClick={() => {setKind(tab); setEditing(null);}}>{tab[0].toUpperCase() + tab.slice(1)}</button>)}</div>
    <div className="content-toolbar"><label>Search listings<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name" /></label><button className="primary-button" disabled={busy || setupError} onClick={() => {setEditing(blank(kind)); setSubmissionId(""); setMessage("");}}>+ Add {kind === "organizations" ? "organization" : kind === "careers" ? "career" : "scholarship"}</button></div>
    <details className="submission-import"><summary>Create a listing from a community submission</summary><label>Choose a submission<select value={submissionId} onChange={e => setSubmissionId(e.target.value)}><option value="">Select…</option>{submissions.map(row => <option key={row.id} value={row.id}>{row.submission_type}: {row.name}</option>)}</select></label><button disabled={!submissionId || busy || setupError} onClick={useSubmission}>Use as a draft</button></details>
    {message && <p role="status" className="admin-message">{message}</p>}
    {editing && <form className="content-editor" key={`${editing.kind}:${editing.id}`} onSubmit={(e: FormEvent<HTMLFormElement>) => { e.preventDefault(); void save(editing); }}>
      <h3>{editing.id ? "Edit listing" : "New listing"}</h3>
      <fieldset disabled={busy} className="content-fields">
        <label>Name / title<input required maxLength={200} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })}/></label>
        <label>Page address<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" readOnly={Boolean(editing.id)} value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })}/><small>/{editing.kind}/{editing.slug || "your-listing"}{editing.id && " · Kept stable to protect saved links"}</small></label>
        <label className="full">Short description<textarea required maxLength={1500} value={editing.summary} onChange={e => setEditing({ ...editing, summary: e.target.value })}/></label>
        <label>Official website<input type="url" value={editing.info.officialUrl} onChange={e => setEditing({ ...editing, info: { ...editing.info, officialUrl: e.target.value } })}/></label>
        <label>Organization / source name<input value={editing.info.sourceLabel} onChange={e => setEditing({ ...editing, info: { ...editing.info, sourceLabel: e.target.value } })}/></label>
        <label>Logo URL<input value={editing.logoUrl} placeholder="https://…" onChange={e => setEditing({ ...editing, logoUrl: e.target.value })}/></label>
        <label>Or upload a logo<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => { const file = e.target.files?.[0]; if (file) void upload(file); }}/><small>PNG, JPEG, or WebP · maximum 2 MB</small></label>
        {editing.logoUrl && <div className="full logo-preview"><img src={editing.logoUrl} alt="Listing logo preview"/><button type="button" onClick={() => setEditing({ ...editing, logoUrl: "" })}>Remove logo</button></div>}
        {submissionId && submissions.find(row => row.id === submissionId)?.logo_path && <div className="full"><button type="button" onClick={() => upload(undefined, submissionId)}>Import uploaded submission logo</button></div>}
        <label className="full">Full overview<textarea rows={5} value={editing.info.overview} onChange={e => setEditing({ ...editing, info: { ...editing.info, overview: e.target.value } })}/></label>
        <label>Highlights (one per line)<textarea rows={5} value={editing.info.highlights.join("\n")} onChange={e => setEditing({ ...editing, info: { ...editing.info, highlights: e.target.value.split("\n") } })}/></label>
        <label>Next steps (one per line)<textarea rows={5} value={editing.info.nextSteps.join("\n")} onChange={e => setEditing({ ...editing, info: { ...editing.info, nextSteps: e.target.value.split("\n") } })}/></label>
        <label>Tags / eligibility (one per line)<textarea value={editing.tags.join("\n")} onChange={e => setEditing({ ...editing, tags: e.target.value.split("\n") })}/></label>
        <label>Category<input value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}/></label>
        {kind === "scholarships" && <><label>Award amount / funding<input value={editing.award} onChange={e => setEditing({ ...editing, award: e.target.value })}/></label><label>Application deadline<input type="date" value={editing.deadline} onChange={e => setEditing({ ...editing, deadline: e.target.value })}/></label><label>Location<input value={editing.location} onChange={e => setEditing({ ...editing, location: e.target.value })}/></label></>}
        {kind === "careers" && <label>Education and training<textarea value={editing.education} onChange={e => setEditing({ ...editing, education: e.target.value })}/></label>}
        <label>Display order (smaller first)<input type="number" min="0" max="9999" value={editing.order} onChange={e => setEditing({ ...editing, order: Number(e.target.value) })}/></label>
        <label className="consent-check"><input type="checkbox" checked={editing.published} onChange={e => setEditing({ ...editing, published: e.target.checked })}/>Published on website</label>
        {kind === "organizations" && <label className="consent-check"><input type="checkbox" checked={editing.partner} onChange={e => setEditing({ ...editing, partner: e.target.checked })}/>Show as a homepage partner (requires Published)</label>}
      </fieldset>
      <div className="card-actions"><button className="primary-button" disabled={busy || setupError}>{busy ? "Saving…" : "Save listing"}</button><button type="button" disabled={busy} onClick={() => setEditing(null)}>Cancel</button></div>
    </form>}
    <div className="content-list">{visible.map(row => <article key={row.id || row.slug}><div>{row.logoUrl && <img src={row.logoUrl} alt="" loading="lazy"/>}<h3>{row.title}</h3><span>{row.published ? "Published" : "Draft / hidden"}</span></div><div className="card-actions"><button disabled={busy || setupError} onClick={() => { setEditing(row); setSubmissionId(""); setMessage(""); }}>Edit</button><button disabled={busy || setupError} onClick={() => save({ ...row, published: !row.published })}>{row.published ? "Unpublish" : "Publish"}</button>{kind === "organizations" && <button disabled={busy || setupError} aria-pressed={row.partner} onClick={() => save({ ...row, partner: !row.partner })}>{row.partner ? "✓ Homepage partner — remove" : "Show as homepage partner"}</button>}{row.published && <Link href={`/${kind}/${row.slug}`} target="_blank">View ↗</Link>}</div></article>)}</div>
    {!visible.length && <p>No listings found. Add a listing or change your search.</p>}
  </section>;
}
