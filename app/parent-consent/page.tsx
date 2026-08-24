"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { PageShell } from "../ui";

const choices = ["Pilot", "Gliding & Soaring", "Space Exploration", "Aerospace Engineering", "Weather & Meteorology", "Aircraft Mechanics", "Drones", "Air Traffic Control", "Aviation Service", "Still Exploring"];
type Consent = { id: string; status: string; initial_notice_sent_at: string; second_notice_due_at: string | null; second_notice_sent_at: string | null; expires_at: string };
type YouthProfile = { id: string; child_nickname: string | null; age_range: string; state: string; interests: string[]; current_stage: string };

export default function ParentConsentPage() {
  const [loading, setLoading] = useState(true);
  const [consents, setConsents] = useState<Consent[]>([]);
  const [profiles, setProfiles] = useState<YouthProfile[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const active = consents.find(item => item.status === "active" && new Date(item.expires_at) > new Date());

  async function refresh() {
    const response = await fetch("/api/parent-consent/status", { cache: "no-store" });
    if (response.status === 401) { setMessage("Sign in with a verified adult Gateway account to use parent controls."); setLoading(false); return; }
    const result = await response.json();
    setConsents(result.consents || []); setProfiles(result.profiles || []); setLoading(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh();
      const params = new URLSearchParams(window.location.search);
      if (params.get("consent") === "affirmed") setMessage("Your affirmative response was recorded. The second privacy confirmation will be emailed after the waiting period. No child information is collected yet.");
      if (params.get("revoked") === "true") setMessage("Consent was revoked and associated child Explore profiles were deleted.");
      if (params.get("consent") === "invalid" || params.get("revoked") === "invalid") setMessage("That consent link is invalid or has already been used.");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function requestConsent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/parent-consent/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ parentName: form.get("parent_name"), relationship: form.get("relationship"), adultAttestation: form.get("adult_attestation") === "on" }) });
    const result = await response.json(); setBusy(false);
    setMessage(response.ok ? "Check your verified account email for the complete privacy notice and affirmative consent link." : result.error);
    if (response.ok) refresh();
  }

  async function createProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/parent-consent/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nickname: form.get("nickname"), ageRange: form.get("age_range"), state: form.get("state"), interests: form.getAll("interests") }) });
    const result = await response.json(); setBusy(false);
    setMessage(response.ok ? "The private Explore profile was created." : result.error);
    if (response.ok) { event.currentTarget.reset(); refresh(); }
  }

  async function deleteProfile(id: string) {
    if (!window.confirm("Delete this private child profile and its Explore preferences?")) return;
    const response = await fetch(`/api/parent-consent/profile?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const result = await response.json(); setMessage(response.ok ? "The profile was deleted." : result.error); if (response.ok) refresh();
  }

  async function revokeConsent() {
    if (!window.confirm("Revoke consent and permanently delete every parent-managed child Explore profile?")) return;
    setBusy(true);
    const response = await fetch("/api/parent-consent/status", { method: "DELETE" });
    const result = await response.json();
    setBusy(false);
    setMessage(response.ok ? "Consent was revoked and every associated child profile was deleted." : result.error);
    if (response.ok) refresh();
  }

  return <PageShell active="resources"><main className="parent-controls-page">
    <span className="eyebrow">PARENT AND GUARDIAN CONTROLS</span>
    <h1>Private Explore profiles for children ages 5–12</h1>
    <p className="parent-controls-intro">This feature is limited to parent-managed Explore recommendations. It does not make under-13 mentorship available, and it does not certify legal compliance.</p>
    {message && <p className="parent-controls-message" role="status">{message}</p>}
    {loading ? <p>Loading secure parent controls…</p> : <>
      <section className="parent-privacy-summary"><h2>Before any child information is collected</h2><ol><li>Sign in with a verified account belonging to an adult parent or legal guardian.</li><li>Receive the complete privacy notice by email and affirmatively consent.</li><li>Wait for the second confirmation email, which repeats the notice and includes a revocation link.</li><li>Only after access becomes active can you create a private child Explore profile.</li></ol><p>Parents can review and delete profiles here. Revoking consent deletes every associated child profile. Under-13 information is never shared with a mentor.</p></section>
      {!active && <section className="parent-control-card"><h2>Request parent-managed access</h2><form onSubmit={requestConsent}><label>Parent or legal guardian full name<input name="parent_name" required autoComplete="name" /></label><label>Relationship to child<input name="relationship" required placeholder="Parent or legal guardian" /></label><label className="consent-check"><input name="adult_attestation" required type="checkbox" /><span>I confirm that I am at least 18 and am the child’s parent or legal guardian.</span></label><button className="primary-button" disabled={busy}>{busy ? "Sending…" : "Email the Privacy Notice →"}</button></form>{consents[0] && <p className="consent-status">Current status: <strong>{consents[0].status.replaceAll("_", " ")}</strong></p>}</section>}
      {active && <><section className="parent-control-card"><h2>Create a private child Explore profile</h2><p>Use only broad details. Do not enter a legal name, exact address, school, phone number, or other sensitive information.</p><form onSubmit={createProfile}><label>Nickname <small>(optional)</small><input name="nickname" maxLength={40} /></label><label>Broad age range<select name="age_range" required defaultValue=""><option value="" disabled>Select one</option><option>5–7</option><option>8–12</option></select></label><label>State or general region<input name="state" required maxLength={80} /></label><fieldset><legend>Interests</legend><div className="parent-interest-grid">{choices.map(choice => <label key={choice}><input type="checkbox" name="interests" value={choice} /><span>{choice}</span></label>)}</div></fieldset><button className="primary-button" disabled={busy}>{busy ? "Saving…" : "Create Private Profile →"}</button></form></section><section className="parent-control-card"><h2>Your private child profiles</h2>{profiles.length ? <div className="parent-profile-list">{profiles.map(profile => <article key={profile.id}><div><strong>{profile.child_nickname || "Private Explore profile"}</strong><span>{profile.age_range} · {profile.state}</span><p>{profile.interests.join(", ")}</p></div><button onClick={() => deleteProfile(profile.id)}>Delete profile</button></article>)}</div> : <p>No child profiles have been created.</p>}<button className="parent-revoke-button" onClick={revokeConsent} disabled={busy}>Revoke consent and delete all profiles</button></section></>}
    </>}
    <p className="parent-controls-links"><Link href="/privacy">Read the Privacy Policy</Link> · <Link href="/privacy/delete">Request data deletion</Link></p>
  </main></PageShell>;
}
