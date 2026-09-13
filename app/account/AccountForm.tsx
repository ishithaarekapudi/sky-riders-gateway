"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { BrandLogo } from "../ui";
import { friendlyAuthError } from "../../lib/auth-errors";
import { Turnstile } from "../components/Turnstile";

import { type AccountMode, recoveryPath } from "../../lib/auth-navigation";

export function AccountForm({ initialMode = "login", nextPath = "/dashboard", invalidLink = false }: {
  initialMode?: AccountMode; nextPath?: string; invalidLink?: boolean;
}) {
  const [mode, setMode] = useState<AccountMode>(initialMode);
  const [message, setMessage] = useState(invalidLink ? "That email link is invalid or expired. Request a new link and open it in the same browser where you requested it." : "");
  const [messageType, setMessageType] = useState<"info" | "error" | "success">(invalidLink ? "error" : "info");
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(initialMode === "update-password");
  const requestInFlight = useRef(false);
  const [captchaAttempt, setCaptchaAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  useEffect(() => {
    if (!configured) return;
    let active = true;
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get("access_token");
    const refreshToken = fragment.get("refresh_token");
    const legacySession = Boolean(accessToken && refreshToken);
    const recovering = initialMode === "update-password" || fragment.get("type") === "recovery";
    if (legacySession || fragment.has("error")) {
      // Remove credentials before the PKCE client inspects the URL.
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    const supabase = createClient();
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" && session) {
        setMode("update-password");
        setRecoveryReady(true);
        setCheckingSession(false);
        setMessage("");
      }
      if (event === "SIGNED_OUT") setRecoveryReady(false);
    });
    async function checkSession() {
      if (fragment.has("error")) throw new Error("Auth session missing");
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        if (error) throw error;
      }
      if (!recovering && !legacySession) return;
      const { data, error } = await supabase.auth.getUser();
      if (!active) return;
      if (!data.user || error) throw error || new Error("Auth session missing");
      if (recovering) {
        setMode("update-password");
        setRecoveryReady(true);
        setMessage("");
        window.history.replaceState(null, "", recoveryPath);
      } else window.location.assign(nextPath);
    }
    checkSession().catch((error) => {
      if (!active) return;
      setRecoveryReady(false);
      setMessage(friendlyAuthError(error));
      setMessageType("error");
    }).finally(() => { if (active) setCheckingSession(false); });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, [configured, initialMode, nextPath]);

  function changeMode(nextMode: AccountMode) {
    if (requestInFlight.current) return;
    setMode(nextMode);
    setMessage("");
    setShowPassword(false);
    const query = new URLSearchParams({ mode: nextMode, next: nextPath });
    window.history.replaceState(null, "", `/account?${query}`);
  }

  function showMessage(text: string, type: "info" | "error" | "success" = "info") {
    setMessage(text);
    setMessageType(type);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requestInFlight.current) return;
    if (!configured) {
      showMessage("Account features are ready, but the Supabase project still needs to be connected.", "error");
      return;
    }

    const form = new FormData(event.currentTarget);
    const submittedEmail = String(form.get("email") || email).trim();
    const submittedName = String(form.get("name") || name).trim();
    const password = String(form.get("password") || "");
    const captchaToken = String(form.get("cf-turnstile-response") || "");
    if (mode === "signup" || mode === "update-password") {
      if (password.length < 8) { showMessage("Please choose a password with at least 8 characters.", "error"); return; }
      if (password !== String(form.get("confirm-password") || "")) { showMessage("The passwords do not match. Please enter the same password in both fields.", "error"); return; }
    }
    const next = nextPath;
    setBusy(true);
    setMessage("");
    requestInFlight.current = true;
    let attempted = false;
    try {
      const supabase = createClient();

      if (mode !== "update-password" && !captchaToken) {
        showMessage("Please complete the security check before continuing.", "error");
        return;
      }

      if (mode === "forgot") {
        attempted = true;
        const { error } = await supabase.auth.resetPasswordForEmail(submittedEmail, {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(recoveryPath)}`,
          captchaToken,
        });
        if (error) showMessage(friendlyAuthError(error), "error");
        else showMessage("If an account exists for that email, a reset link is on its way. Open the newest email in this same browser.", "success");
        return;
      }

      if (mode === "update-password") {
        if (!recoveryReady) { showMessage("Please open a valid reset link before changing your password.", "error"); return; }
        attempted = true;
        const { error } = await supabase.auth.updateUser({ password });
        if (error) showMessage(friendlyAuthError(error), "error");
        else {
          showMessage("Your password has been updated. Taking you to your Gateway...", "success");
          window.setTimeout(() => window.location.assign("/dashboard"), 900);
        }
        return;
      }

      if (mode === "login") {
        attempted = true;
        const { error } = await supabase.auth.signInWithPassword({ email: submittedEmail, password, options: { captchaToken } });
        if (error) showMessage(friendlyAuthError(error), "error");
        else window.location.assign(next);
        return;
      }

      if (!ageGroup) {
        showMessage("Please choose your age group.", "error");
        return;
      }
      if (ageGroup === "under-13") {
        showMessage("If you are under 13, please ask a parent or guardian to create and manage a Gateway account for you.", "error");
        return;
      }
      const callback = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      attempted = true;
      const { data, error } = await supabase.auth.signUp({
        email: submittedEmail,
        password,
        options: {
          emailRedirectTo: callback,
          captchaToken,
          data: { display_name: submittedName, first_name: submittedName, age_group: ageGroup },
        },
      });
      if (error) showMessage(friendlyAuthError(error), "error");
      else if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        setMode("login");
        showMessage("An account already exists for this email. Log in below, or use Forgot password if you do not remember your password.", "info");
      }
      else if (data.session) window.location.assign(next);
      else showMessage("Your account is almost ready. Check your email and open the newest confirmation link in this browser.", "success");
    } catch (error) {
      showMessage(friendlyAuthError(error), "error");
    } finally {
      requestInFlight.current = false;
      setBusy(false);
      if (attempted && mode !== "update-password") setCaptchaAttempt((value) => value + 1);
    }
  }

  async function resendConfirmation() {
    if (requestInFlight.current) return;
    if (!configured) {
      showMessage("Account service is not configured. Please try again later.", "error");
      return;
    }
    if (!email.trim()) {
      showMessage("Enter your email above first, then resend the confirmation.", "error");
      return;
    }
    setBusy(true);
    const next = nextPath;
    const captchaToken = (document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value || "";
    if (!captchaToken) {
      setBusy(false);
      showMessage("Please complete the security check before resending your confirmation.", "error");
      return;
    }
    requestInFlight.current = true;
    try {
    const { error } = await createClient().auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`, captchaToken },
    });
    setBusy(false);
    if (error) showMessage(friendlyAuthError(error), "error");
    else showMessage("If this account needs confirmation, a new email is on its way. Open the newest link in this browser.", "success");
    } catch (error) {
      showMessage(friendlyAuthError(error), "error");
    } finally {
      requestInFlight.current = false;
      setBusy(false);
      setCaptchaAttempt((value) => value + 1);
    }
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
        <button type="button" disabled={busy} className={mode === "login" ? "active" : ""} onClick={() => changeMode("login")}>Log In</button>
        <button type="button" disabled={busy} className={mode === "signup" ? "active" : ""} onClick={() => changeMode("signup")}>Sign Up</button>
      </div>}

      {checkingSession && <p role="status">Checking your reset link…</p>}
      {mode === "update-password" && !checkingSession && !recoveryReady && <button className="primary-button wide" type="button" disabled={busy} onClick={() => changeMode("forgot")}>Request a new reset link</button>}
      {(mode !== "update-password" || recoveryReady) && <form onSubmit={submit}>
        {mode === "signup" && <label>First name
          <input name="name" type="text" required minLength={2} maxLength={50} value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your first name" autoComplete="given-name" />
        </label>}
        {mode === "signup" && <label className="account-age-field"><span>Age group</span>
          <div className="account-select-wrap">
          <select name="age_group" required value={ageGroup} onChange={(event) => setAgeGroup(event.target.value)}>
            <option value="" disabled>Select your age group</option>
            <option value="under-13">Under 13</option>
            <option value="13-15">13–15</option>
            <option value="16-17">16–17</option>
            <option value="18-plus">18 or older</option>
          </select>
          </div>
          <small className="account-field-note"><span aria-hidden="true">i</span><span>Gateway accounts are available for ages 13 and older. If you are under 13, ask a parent or guardian to create an adult account, then use the <Link href="/parent-consent">parent-managed Explore controls</Link>. Mentorship for teens includes additional guardian consent and safety review.</span></small>
        </label>}
        {mode !== "update-password" && <label>Email
          <input name="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" />
        </label>}
        {mode !== "forgot" && <label>{mode === "update-password" ? "New password" : "Password"}
          <div className="account-password-field">
            <input
              key={mode}
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={mode === "login" ? 1 : 8}
              placeholder={mode === "login" ? "Enter your password" : "At least 8 characters"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
            <button
              type="button"
              className="account-password-toggle"
              aria-pressed={showPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((visible) => !visible)}
            >{showPassword ? "Hide" : "Show"}</button>
          </div>
        </label>}
        {(mode === "signup" || mode === "update-password") && <label>Confirm password
          <input key={`confirm:${mode}`} name="confirm-password" type={showPassword ? "text" : "password"} required minLength={8} autoComplete="new-password" placeholder="Enter the password again" />
        </label>}
        {mode !== "update-password" && <Turnstile key={`${mode}:${captchaAttempt}`} />}
        <button className="primary-button wide" type="submit" disabled={busy}>
          {busy ? "Please wait..." : mode === "login" ? "Log In →" : mode === "signup" ? "Create Account →" : mode === "forgot" ? "Send Reset Link →" : "Update Password →"}
        </button>
      </form>}

      {mode === "login" && <div className="account-help-links" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "-2px 0 22px" }}>
        <button style={{ minHeight: 44, padding: "10px 12px", border: "1px solid #cbdced", borderRadius: 8, background: "#f7faff", color: "#1269d3", fontSize: 13, fontWeight: 650 }} type="button" disabled={busy} onClick={() => changeMode("forgot")}>Forgot password?</button>
        <button style={{ minHeight: 44, padding: "10px 12px", border: "1px solid #cbdced", borderRadius: 8, background: "#f7faff", color: "#1269d3", fontSize: 13, fontWeight: 650 }} type="button" onClick={resendConfirmation} disabled={busy}>Resend confirmation</button>
      </div>}
      {message && <div className={`account-message ${messageType}`} role="status">{message}</div>}
      {!configured && <p className="account-setup-note">Supabase connection required for live accounts. The rest of the website works without it.</p>}
      <p className="account-privacy-note">By continuing, you agree to our <Link href="/privacy">Privacy Policy</Link> and <Link href="/youth-safety">Youth Safety Policy</Link>.</p>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginTop: 20, paddingTop: 18, borderTop: "1px solid #e2eaf3" }}>
        {(mode === "forgot" || mode === "update-password") && <button style={{ minHeight: 42, padding: "9px 14px", border: "1px solid #cbdced", borderRadius: 8, background: "#f7faff", color: "#1269d3", fontSize: 13, fontWeight: 650 }} type="button" disabled={busy} onClick={() => changeMode("login")}>← Back to login</button>}
        <Link style={{ minHeight: 42, display: "inline-flex", alignItems: "center", padding: "9px 14px", border: "1px solid #cbdced", borderRadius: 8, background: "white", color: "#244a74", fontSize: 13, fontWeight: 650 }} href="/">← Return home</Link>
      </div>
    </section>
  </main>;
}

