"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { BrandLogo } from "../ui";

export default function AccountPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "signup") setMode("signup");
    setMessage(params.get("message") || "");
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) {
      setMessage("Account features are ready, but the Supabase project still needs to be connected.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const supabase = createClient();
    const params = new URLSearchParams(window.location.search);
    const requestedNext = params.get("next") || "/dashboard";
    const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/dashboard";
    setBusy(true);
    const result = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}${next}` } });
    setBusy(false);
    if (result.error) setMessage(result.error.message);
    else if (mode === "login") window.location.assign(next);
    else setMessage("Check your email to confirm your account, then return to log in.");
  }

  return <main className="account-page">
    <div className="account-brand"><BrandLogo /></div>
    <section className="account-panel">
      <span className="eyebrow">YOUR GATEWAY PROFILE</span>
      <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      <p>Save opportunities, keep your roadmap, and receive personalized aviation recommendations.</p>
      <div className="account-tabs"><button className={mode==="login"?"active":""} onClick={()=>setMode("login")}>Log In</button><button className={mode==="signup"?"active":""} onClick={()=>setMode("signup")}>Sign Up</button></div>
      <form onSubmit={submit}>
        <label>Email<input name="email" type="email" required placeholder="you@example.com"/></label>
        <label>Password<input name="password" type="password" required minLength={6} placeholder="At least 6 characters"/></label>
        <button className="primary-button wide" type="submit" disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Log In →" : "Create Account →"}</button>
      </form>
      {message && <div className="account-message">{message}</div>}
      {!configured && <p className="account-setup-note">Supabase connection required for live accounts. The rest of the website works without it.</p>}
      <Link href="/">← Return home</Link>
    </section>
  </main>;
}
