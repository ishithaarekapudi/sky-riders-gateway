import type { DetailInfo } from "../app/detail-content";
export type CatalogKind = "organizations" | "careers" | "scholarships";
export type CatalogItem = {
  id: string; kind: CatalogKind; slug: string; title: string; summary: string;
  logoUrl: string; published: boolean; partner: boolean; order: number;
  tags: string[]; award: string; deadline: string; location: string; education: string;
  icon: string; category: string; info: DetailInfo;
};
export const catalogTables = { organizations: "organizations", careers: "career_paths", scholarships: "opportunities" } as const;
export function isCatalogKind(value: unknown): value is CatalogKind { return typeof value === "string" && Object.hasOwn(catalogTables, value); }
export function safeImageUrl(value: string) {
  if (value.startsWith("/") && !value.startsWith("//") && !/[\\\s]/.test(value)) return value;
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password ? url.href : ""; } catch { return ""; }
}
export function validateItem(input: unknown): CatalogItem {
  if (!input || typeof input !== "object") throw new Error("Please complete the listing form.");
  const row = input as Record<string, unknown>;
  if (!isCatalogKind(row.kind)) throw new Error("Choose a directory.");
  const text = (v: unknown, max = 5000) => typeof v === "string" ? v.trim().slice(0, max) : "";
  const list = (v: unknown) => Array.isArray(v) ? v.slice(0, 30).map(x => text(x, 500)).filter(Boolean) : [];
  const info = row.info && typeof row.info === "object" ? row.info as Record<string, unknown> : {};
  const title = text(row.title, 200), summary = text(row.summary, 1500), slug = text(row.slug, 180);
  if (!title || !summary || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("A name, description, and valid page address are required.");
  const officialUrl = text(info.officialUrl, 2000);
  if (officialUrl && !/^https?:\/\//.test(officialUrl)) throw new Error("Official website must start with https:// or http://.");
  if (officialUrl) { try { const url = new URL(officialUrl); if (url.username || url.password) throw new Error(); } catch { throw new Error("Enter a valid official website."); } }
  const rawLogo = text(row.logoUrl, 2000), logoUrl = safeImageUrl(rawLogo);
  if (rawLogo && !logoUrl) throw new Error("Use an HTTPS logo URL or upload a logo.");
  const deadline = text(row.deadline, 10);
  if (deadline && (!/^\d{4}-\d{2}-\d{2}$/.test(deadline) || new Date(deadline).toISOString().slice(0,10) !== deadline)) throw new Error("Enter a valid deadline.");
  return { id: text(row.id, 80), kind: row.kind, slug, title, summary, logoUrl,
    published: row.published === true, partner: row.kind === "organizations" && row.partner === true,
    order: Math.max(0, Math.min(9999, Number(row.order) || 0)), tags: list(row.tags), award: text(row.award, 200), deadline,
    location: text(row.location, 300), education: text(row.education, 1000), icon: text(row.icon, 50) || "plane", category: text(row.category, 100),
    info: { officialUrl, sourceLabel: text(info.sourceLabel, 200) || title, overview: text(info.overview) || summary, highlights: list(info.highlights), nextSteps: list(info.nextSteps) } };
}
