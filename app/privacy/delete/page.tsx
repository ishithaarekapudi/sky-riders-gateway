"use client";

import { FormEvent, useState } from "react";
import { PageShell } from "../../ui";
import { submitProtectedForm, Turnstile } from "../../components/Turnstile";

export default function DataDeletionPage() {
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(""); const form = new FormData(event.currentTarget);
    try { await submitProtectedForm("deletion", { requester_name: form.get("name"), requester_email: form.get("email"), request_scope: form.get("scope"), details: form.get("details") || null }, form); setMessage("Your request was received. Gateway will verify your identity before changing or deleting data."); event.currentTarget.reset(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "We could not submit the request."); }
    setBusy(false);
  }
  return <PageShell active="resources"><main className="policy-page"><span>YOUR PRIVACY CONTROLS</span><h1>Request access, correction, or deletion</h1><p>Use the email connected to the relevant account or submission. Gateway will verify the requester’s identity and authority before releasing, changing, or deleting information.</p><form className="privacy-request-form" onSubmit={submit}><label>Name<input name="name" required /></label><label>Email<input name="email" required type="email" /></label><label>Request<select name="scope" required><option>Delete my Gateway account and profile</option><option>Delete a parent-managed child profile</option><option>Revoke parental consent</option><option>Delete a mentorship application</option><option>Access or correct my information</option><option>Other privacy request</option></select></label><label>Details <small>(do not include sensitive information)</small><textarea name="details" /></label><Turnstile />{message && <p role="status">{message}</p>}<button className="primary-button" disabled={busy}>{busy ? "Sending…" : "Send Privacy Request →"}</button></form></main></PageShell>;
}

