"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

export function SaveButton({ id, label = "Save" }: { id: string; label?: string }) {
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);

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

  async function toggleSaved() {
    if (!userId) {
      const next = `${window.location.pathname}${window.location.search}`;
      window.location.assign(`/account?next=${encodeURIComponent(next)}&message=${encodeURIComponent("Log in or create an account to save favorites.")}`);
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

  return (
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
  );
}
