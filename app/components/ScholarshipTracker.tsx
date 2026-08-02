"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

const statuses = ["Not started", "Preparing", "Applied", "Decision received"] as const;

export function ScholarshipTracker({ title, compact = false }: { title: string; compact?: boolean }) {
  const [status, setStatus] = useState<(typeof statuses)[number]>("Not started");
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const itemId = `application:${title}`;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setUserId(data.user.id);
      const { data: row } = await supabase.from("saved_items").select("item_label").eq("user_id", data.user.id).eq("item_id", itemId).maybeSingle();
      if (row?.item_label && statuses.includes(row.item_label as (typeof statuses)[number])) setStatus(row.item_label as (typeof statuses)[number]);
    });
  }, [itemId]);

  async function updateStatus(next: (typeof statuses)[number]) {
    if (!userId) return;
    setSaving(true);
    const supabase = createClient();
    const result = next === "Not started"
      ? await supabase.from("saved_items").delete().eq("user_id", userId).eq("item_id", itemId)
      : await supabase.from("saved_items").upsert({ user_id: userId, item_id: itemId, item_label: next });
    if (!result.error) setStatus(next);
    setSaving(false);
  }

  return <div className={`scholarship-tracker${compact ? " compact" : ""}`}>
    {!compact && <div><span>APPLICATION TRACKER</span><h3>Track your progress</h3><p>Keep your next step visible in My Gateway.</p></div>}
    {!userId ? <Link href={`/account?next=${encodeURIComponent(`/scholarships/${title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}`)}`}>Log in to track →</Link> : <label>
      <span>{compact ? title : "Current status"}</span>
      <select value={status} disabled={saving} onChange={(event)=>updateStatus(event.target.value as (typeof statuses)[number])}>
        {statuses.map(item=><option key={item}>{item}</option>)}
      </select>
    </label>}
  </div>;
}
