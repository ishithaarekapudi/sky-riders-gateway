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

  const itemLabel = label === "Save" ? "item" : label.replace(/^Save\s*/i, "") || "item";

  return (
    <button
      type="button"
      className={`heart-save-button${saved ? " saved" : ""}`}
      aria-label={saved ? `Remove ${itemLabel} from saved items` : `Save ${itemLabel}`}
      aria-pressed={saved}
      title={saved ? "Saved" : "Save"}
      onClick={toggleSaved}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
      </svg>
    </button>
  );
}
