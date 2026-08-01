"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

export function SaveButton({ id, label = "Save" }: { id: string; label?: string }) {
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return;
      const user = data.user;
      setUserId(user?.id || null);
      if (user) {
        const { data: item } = await supabase.from("saved_items").select("item_id").eq("user_id", user.id).eq("item_id", id).maybeSingle();
        if (active) setSaved(Boolean(item));
      }
      if (active) setBusy(false);
    });
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    if (!showAccountPrompt) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setShowAccountPrompt(false);
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [showAccountPrompt]);

  async function toggleSaved() {
    if (!userId) {
      setShowAccountPrompt(true);
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const result = saved
      ? await supabase.from("saved_items").delete().eq("user_id", userId).eq("item_id", id)
      : await supabase.from("saved_items").upsert({ user_id: userId, item_id: id, item_label: label });
    if (!result.error) setSaved(!saved);
    setBusy(false);
  }

  const itemLabel = label === "Save" ? "item" : label.replace(/^Save\s*/i, "") || "item";

  const next = typeof window === "undefined" ? "/" : `${window.location.pathname}${window.location.search}`;
  const message = "Create an account or log in to save favorites and find them again later.";
  const accountQuery = `next=${encodeURIComponent(next)}&message=${encodeURIComponent(message)}`;

  return <>
    <button
      type="button"
      className={`heart-save-button${saved ? " saved" : ""}`}
      aria-label={saved ? `Remove ${itemLabel} from saved items` : `Save ${itemLabel}`}
      aria-pressed={saved}
      title={!userId ? "Log in to save" : saved ? "Saved" : "Save"}
      onClick={toggleSaved}
      disabled={busy}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
      </svg>
    </button>
    {showAccountPrompt && <div className="account-required-overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) setShowAccountPrompt(false);
    }}>
      <section className="account-required-modal" role="dialog" aria-modal="true" aria-labelledby={`account-required-${id.replace(/[^a-z0-9]/gi, "-")}`}>
        <button className="account-required-close" type="button" aria-label="Close" onClick={() => setShowAccountPrompt(false)}>×</button>
        <span>SAVE YOUR GATEWAY</span>
        <h2 id={`account-required-${id.replace(/[^a-z0-9]/gi, "-")}`}>Create an account to save this.</h2>
        <p>Your favorites stay connected to your profile, so you can return to opportunities, scholarships, organizations, and careers from any device.</p>
        <div className="account-required-actions">
          <Link className="primary-button" href={`/account?mode=signup&${accountQuery}`}>Sign Up →</Link>
          <Link className="account-login-link" href={`/account?mode=login&${accountQuery}`}>Log In</Link>
        </div>
        <button className="account-not-now" type="button" onClick={() => setShowAccountPrompt(false)}>Not now</button>
      </section>
    </div>}
  </>;
}
