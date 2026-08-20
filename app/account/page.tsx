"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { BrandLogo } from "../ui";

type AccountMode = "login" | "signup" | "forgot" | "update-password";

function friendlyError(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) return "That email or password does not match. Please try again, or reset your password.";
  if (normalized.includes("email not confirmed")) return "Please confirm your email before logging in. You can resend the confirmation below.";
  if (normalized.includes("user already registered") || normalized.includes("already been registered")) return "An account already exists for this email. Try logging in or resetting your password.";
  if (normalized.includes("password should be")) return "Please choose a password with at least 8 characters.";
  if (normalized.includes("rate limit")) return "Please wait a moment before trying again.";
  return message;
}

export default function AccountPage() {
  const [mode, setMode] = useState<AccountMode>(() => {
    if (typeof window === "undefined") return "login";
    const requested = new URLSearchParams(window.location.search).get("mode");
    return requested === "signup" || requested === "forgot" || requested === "update-password" ? requested : "login";
  });
  const [message, setMessage] = useState(() => typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("message") || "");
  const [messageType, setMessageType] = useState<"info" | "error" | "success">("info");
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  useEffect(() => {
    if (!configured) return;
    const supabase = createClient();
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setMode("update-password");
    });
    return () => data.subscription.unsubscribe();
  }, [configured]);

  function safeNext() {
    const requested = new URLSearchParams(window.location.search).get("next") || "/dashboard";
    return requested.startsWith("/") && !requested.startsWith("//") ? requested : "/dashboard";
  }

  function showMessage(text: string, type: "info" | "error" | "success" = "info") {
    setMessage(text);
    setMessageType(type);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) {
      showMessage("Account features are ready, but the Supabase project still needs to be connected.", "error");
      return;
    }

    const form = new FormData(event.currentTarget);
    const submittedEmail = String(form.get("email") || email).trim();
    const submittedName = String(form.get("name") || name).trim();
    const password = String(form.get("password") || "");
    const supabase = createClient();
    const next = safeNext();
    setBusy(true);
    setMessage("");

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(submittedEmail, {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/account?mode=update-password")}`,
      });
      setBusy(false);
      if (error) showMessage(friendlyError(error.message), "error");
      else showMessage("Check your email for a secure password-reset link.", "success");
      return;
    }

    if (mode === "update-password") {
      const { error } = await supabase.auth.updateUser({ password });
      setBusy(false);
      if (error) showMessage(friendlyError(error.message), "error");
      else {
        showMessage("Your password has been updated. Taking you to your Gateway...", "success");
        window.setTimeout(() => window.location.assign("/dashboard"), 900);
      }
      return;
    }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email: submittedEmail, password });
      setBusy(false);
      if (error) showMessage(friendlyError(error.message), "error");
      else window.location.assign(next);
      return;
    }

    if (!ageGroup) {
      setBusy(false);
      showMessage("Please choose your age group.", "error");
      return;
    }
    if (ageGroup === "under-13") {
      setBusy(false);
      showMessage("Accounts are currently available for ages 13 and older. Younger explorers can use Explore privately with a parent or guardian.", "error");
      return;
    }
    const callback = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { data, error } = await supabase.auth.signUp({
      email: submittedEmail,
      password,
      options: {
        emailRedirectTo: callback,
        data: { display_name: submittedName, full_name: submittedName, age_group: ageGroup },
      },
    });
    setBusy(false);
    if (error) showMessage(friendlyError(error.message), "error");
    else if (data.session) window.location.assign(next);
    else showMessage("Your account is almost ready. Check your email and select the confirmation link.", "success");
  }

  async function resendConfirmation() {
    if (!email.trim()) {
      showMessage("Enter your email above first, then resend the confirmation.", "error");
      return;
    }
    setBusy(true);
    const next = safeNext();
    const { error } = await createClient().auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    setBusy(false);
    if (error) showMessage(friendlyError(error.message), "error");
    else showMessage("A new confirmation email is on its way.", "success");
  }

  const title = mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : mode === "forgot" ? "Reset your password" : "Choose a new password";
  const description = mode === "forgot"
    ? "Enter your email and we will send you a secure reset link."
    : mode === "update-password"
      ? "Create a new password for your Sky Riders Gateway account."
      : "Save opportunities, keep your roadmap, and receive personalized aviation and aerospace recommendations.";

  return <main className="account-page">
    <div className="account-brand"><BrandLogo /></div>
    <section className="account-panel">
      <span className="eyebrow">YOUR GATEWAY PROFILE</span>
      <h1 style={{ fontWeight: mode === "signup" ? 550 : 600, letterSpacing: mode === "signup" ? ".025em" : ".005em", lineHeight: 1.08 }}>{title}</h1>
      <p>{description}</p>

      {(mode === "login" || mode === "signup") && <div className="account-tabs">
        <button type="button" className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setMessage(""); }}>Log In</button>
        <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setMessage(""); }}>Sign Up</button>
      </div>}

      <form onSubmit={submit}>
        {mode === "signup" && <label>Name
          <input name="name" type="text" required minLength={2} maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name" />
        </label>}
        {mode === "signup" && <label>Age group
          <select name="age_group" required value={ageGroup} onChange={(event) => setAgeGroup(event.target.value)}>
            <option value="" disabled>Select your age group</option>
            <option value="under-13">Under 13</option>
            <option value="13-15">13–15</option>
            <option value="16-17">16–17</option>
            <option value="18-plus">18 or older</option>
          </select>
          <small>Accounts are currently for ages 13+. Mentorship has additional guardian and safety requirements.</small>
        </label>}
        {mode !== "update-password" && <label>Email
          <input name="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" />
        </label>}
        {mode !== "forgot" && <label>{mode === "update-password" ? "New password" : "Password"}
          <input
            name="password"
            type="password"
            required
            minLength={mode === "login" ? 6 : 8}
            placeholder={mode === "login" ? "Enter your password" : "At least 8 characters"}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </label>}
        <button className="primary-button wide" type="submit" disabled={busy}>
          {busy ? "Please wait..." : mode === "login" ? "Log In →" : mode === "signup" ? "Create Account →" : mode === "forgot" ? "Send Reset Link →" : "Update Password →"}
        </button>
      </form>

      {mode === "login" && <div className="account-help-links" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "-2px 0 22px" }}>
        <button style={{ minHeight: 44, padding: "10px 12px", border: "1px solid #cbdced", borderRadius: 8, background: "#f7faff", color: "#1269d3", fontSize: 13, fontWeight: 650 }} type="button" onClick={() => { setMode("forgot"); setMessage(""); }}>Forgot password?</button>
        <button style={{ minHeight: 44, padding: "10px 12px", border: "1px solid #cbdced", borderRadius: 8, background: "#f7faff", color: "#1269d3", fontSize: 13, fontWeight: 650 }} type="button" onClick={resendConfirmation} disabled={busy}>Resend confirmation</button>
      </div>}
      {message && <div className={`account-message ${messageType}`} role="status">{message}</div>}
      {!configured && <p className="account-setup-note">Supabase connection required for live accounts. The rest of the website works without it.</p>}
      <p className="account-privacy-note">By continuing, you agree to our <Link href="/privacy">Privacy Policy</Link> and <Link href="/youth-safety">Youth Safety Policy</Link>.</p>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginTop: 20, paddingTop: 18, borderTop: "1px solid #e2eaf3" }}>
        {(mode === "forgot" || mode === "update-password") && <button style={{ minHeight: 42, padding: "9px 14px", border: "1px solid #cbdced", borderRadius: 8, background: "#f7faff", color: "#1269d3", fontSize: 13, fontWeight: 650 }} type="button" onClick={() => { setMode("login"); setMessage(""); }}>← Back to login</button>}
        <Link style={{ minHeight: 42, display: "inline-flex", alignItems: "center", padding: "9px 14px", border: "1px solid #cbdced", borderRadius: 8, background: "white", color: "#244a74", fontSize: 13, fontWeight: 650 }} href="/">← Return home</Link>
      </div>
    </section>
  </main>;
}
