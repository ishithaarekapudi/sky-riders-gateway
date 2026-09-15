"use client";
import { useState, type FormEvent } from "react";
import type { MediaOutlet } from "../../lib/media-outlets";

const blank = (): MediaOutlet => ({ id: "", name: "", logoUrl: "", websiteUrl: "", published: true, sortOrder: 0 });
export function MediaOutletManager({ initial, setupError }: { initial: MediaOutlet[]; setupError: boolean }) {
  const [items, setItems] = useState(initial), [editing, setEditing] = useState<MediaOutlet | null>(null), [message, setMessage] = useState(""), [busy, setBusy] = useState(false);
  async function save(event: FormEvent) {
    event.preventDefault(); if (!editing || busy) return; setBusy(true); setMessage("");
    try { const response = await fetch("/api/admin/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) }); const result = await response.json(); if (!response.ok) throw new Error(result.error || "Could not save."); setItems(current => [...current.filter(item => item.id !== result.item.id), result.item]); setEditing(null); setMessage("Saved. Refresh the media page to see the update."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not save."); } finally { setBusy(false); }
  }
  return <section className="content-manager media-outlet-manager"><div className="admin-section-intro"><div><span className="eyebrow">MEDIA & PRESS</span><h2>Manage press features</h2><p>Add a logo and link for an interview, feature, podcast, newspaper, or television outlet.</p></div></div>
    {setupError && <p className="form-error">Media-logo controls need the database update before they can save.</p>}
    <button className="primary-button" disabled={setupError || busy} onClick={() => { setEditing(blank()); setMessage(""); }}>+ Add media outlet</button>
    {message && <p className="admin-message" role="status">{message}</p>}
    {editing && <form className="content-editor" onSubmit={save}><h3>{editing.id ? "Edit media outlet" : "New media outlet"}</h3><fieldset disabled={busy} className="content-fields">
      <label>Outlet name<input required value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}/></label>
      <label>Logo URL<input required placeholder="https://… or /media-logos/logo.svg" value={editing.logoUrl} onChange={e => setEditing({ ...editing, logoUrl: e.target.value })}/><small>Use an uploaded logo URL or an HTTPS image address.</small></label>
      <label>Feature or outlet URL<input placeholder="https://…" value={editing.websiteUrl} onChange={e => setEditing({ ...editing, websiteUrl: e.target.value })}/></label>
      <label>Display order<input type="number" min="0" value={editing.sortOrder} onChange={e => setEditing({ ...editing, sortOrder: Number(e.target.value) })}/></label>
      <label className="consent-check"><input type="checkbox" checked={editing.published} onChange={e => setEditing({ ...editing, published: e.target.checked })}/>Publish this logo</label>
    </fieldset><div className="card-actions"><button className="primary-button">{busy ? "Saving…" : "Save media outlet"}</button><button type="button" onClick={() => setEditing(null)}>Cancel</button></div></form>}
    <div className="content-list">{items.map(item => <article key={item.id}><div><img src={item.logoUrl} alt="" loading="lazy"/><h3>{item.name}</h3><span>{item.published ? "Published" : "Draft / hidden"}</span></div><button disabled={busy || setupError} onClick={() => { setEditing(item); setMessage(""); }}>Edit</button></article>)}</div>
  </section>;
}
