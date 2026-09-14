import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { careerPaths, organizations, scholarships, slugify } from "../app/content";
import { careerDetails, organizationDetails, scholarshipDetails } from "../app/detail-content";
import { organizationLogos } from "../app/logo-library";
import { catalogTables, type CatalogItem, type CatalogKind } from "./catalog-model";

// These three listings have time-sensitive eligibility or award details that
// were corrected against their current official scholarship pages. Keep the
// public directory accurate while the editable database content is refreshed.
const currentScholarshipFacts: Record<string, Pick<CatalogItem, "award" | "tags" | "summary" | "info">> = {
  "aopa-high-school-flight-training": {
    award: "Up to $12,000*",
    tags: ["Ages 16–18 · GPA and test requirements"],
    summary: "AOPA's current cycle offers flight-training awards for eligible high-school students. Confirm the current cycle before applying.",
    info: scholarshipDetails["aopa-high-school-flight-training"],
  },
  "wspa-sky-ghost-scholarship": {
    award: "Award varies*",
    tags: ["Women ages 15–24 · Glider certificate"],
    summary: "The Sky Ghost Scholarship supports eligible young women pursuing glider training toward a private certificate.",
    info: scholarshipDetails["wspa-sky-ghost-scholarship"],
  },
  "wspa-mid-kolstad-scholarship": {
    award: "Award varies*",
    tags: ["Women age 25+ · Glider certificate or add-on"],
    summary: "The Mid Kolstad Scholarship supports eligible women age 25 or older pursuing a private glider certificate or add-on rating.",
    info: scholarshipDetails["wspa-mid-kolstad-scholarship"],
  },
};

export function seededCatalog(kind: CatalogKind): CatalogItem[] {
  const base = { published: true, partner: false, order: 0, award: "", deadline: "", location: "", education: "", logoUrl: "", category: "", icon: "plane" };
  if (kind === "organizations") return organizations.map(([title, summary, tags]) => ({ ...base, id: "", kind, slug: slugify(title), title, summary, tags: [...tags], logoUrl: organizationLogos[title]?.[0] || "", info: organizationDetails[slugify(title)] }));
  if (kind === "careers") return careerPaths.map(([icon, title, summary]) => ({ ...base, id: "", kind, slug: slugify(title), title, summary, tags: [], icon, info: careerDetails[slugify(title)] }));
  return scholarships.map(([icon, title, award, tags]) => ({ ...base, id: "", kind, slug: slugify(title), title, summary: scholarshipDetails[slugify(title)]?.overview || title, tags: [tags], icon, award, info: scholarshipDetails[slugify(title)] }));
}
export function fromRow(kind: CatalogKind, row: Record<string, unknown>): CatalogItem {
  const content = (row.directory_content || {}) as Partial<CatalogItem>;
  const title = content.title || String(row.name || row.title || "");
  const summary = content.summary || String(row.description || row.summary || "");
  return { id: String(row.id), kind, slug: content.slug || String(row.slug), title, summary,
    published: row.published === true, partner: row.homepage_partner === true, order: Number(row.partner_order || row.sort_order || 0),
    logoUrl: String(row.logo_url || content.logoUrl || ""), tags: content.tags || (row.eligibility as string[]) || [], award: content.award || "",
    deadline: String(row.deadline || ""), location: String(row.location || ""), education: String(row.education || ""), icon: String(row.icon || content.icon || "plane"), category: content.category || "",
    info: content.info || { officialUrl: String(row.website_url || row.application_url || ""), sourceLabel: title, overview: summary, highlights: [], nextSteps: [] } };
}
export const getCatalog = unstable_cache(async (kind: CatalogKind): Promise<CatalogItem[]> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return seededCatalog(kind);
  const client = createClient(url, key, { auth: { persistSession: false } });
  let query = client.from(catalogTables[kind]).select("*").eq("published", true);
  if (kind === "scholarships") query = query.eq("type", "scholarship");
  const { data, error } = await query;
  // Keep the public directory available during a database rollout or a brief
  // provider outage. Published database records take over automatically once
  // the query succeeds again.
  if (error) return seededCatalog(kind);
  const seed = seededCatalog(kind);
  const saved = (data || []).map(row => fromRow(kind, row)).map(item => {
    const original = seed.find(entry => entry.slug === item.slug);
    // Keep the curated detail-page logo when an editable record has not added
    // its own image yet.
    const withLogo = original && !item.logoUrl ? { ...item, logoUrl: original.logoUrl } : item;
    return kind === "scholarships" && currentScholarshipFacts[withLogo.slug]
      ? { ...withLogo, ...currentScholarshipFacts[withLogo.slug] }
      : withLogo;
  });
  // The original directory remains available while individual entries are
  // progressively moved into the editable database.
  return [...seed.filter(seed => !saved.some(item => item.slug === seed.slug)), ...saved]
    .sort((a,b) => a.order - b.order || a.title.localeCompare(b.title));
}, ["gateway-catalog-v1"], { revalidate: 60, tags: ["gateway-catalog"] });
