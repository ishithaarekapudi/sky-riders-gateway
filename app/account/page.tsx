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

    const callback = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { data, error } = await supabase.auth.signUp({
      email: submittedEmail,
      password,
      options: { emailRedirectTo: callback },
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
      <h1>{title}</h1>
      <p>{description}</p>

      {(mode === "login" || mode === "signup") && <div className="account-tabs">
        <button type="button" className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setMessage(""); }}>Log In</button>
        <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setMessage(""); }}>Sign Up</button>
      </div>}

      <form onSubmit={submit}>
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

      {mode === "login" && <div className="account-help-links">
        <button type="button" onClick={() => { setMode("forgot"); setMessage(""); }}>Forgot password?</button>
        <button type="button" onClick={resendConfirmation} disabled={busy}>Resend confirmation</button>
      </div>}
      {(mode === "forgot" || mode === "update-password") && <button className="account-back-button" type="button" onClick={() => { setMode("login"); setMessage(""); }}>← Back to login</button>}
      {message && <div className={`account-message ${messageType}`} role="status">{message}</div>}
      {!configured && <p className="account-setup-note">Supabase connection required for live accounts. The rest of the website works without it.</p>}
      <Link href="/">← Return home</Link>
    </section>
  </main>;
}
