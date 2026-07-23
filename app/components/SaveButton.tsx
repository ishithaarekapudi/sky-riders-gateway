"use client";

import { useEffect, useState } from "react";

export function SaveButton({ id, label = "Save" }: { id: string; label?: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("sky-riders-saved") || "[]") as string[];
    setSaved(items.includes(id));
  }, [id]);

  function toggleSaved() {
    const items = new Set(JSON.parse(localStorage.getItem("sky-riders-saved") || "[]") as string[]);
    if (items.has(id)) items.delete(id); else items.add(id);
    localStorage.setItem("sky-riders-saved", JSON.stringify([...items]));
    setSaved(items.has(id));
  }

  return <button type="button" className={saved ? "saved-button" : ""} onClick={toggleSaved}>{saved ? "✓ Saved" : `${label} →`}</button>;
}

