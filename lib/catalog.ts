import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { careerPaths, organizations, scholarships, slugify } from "../app/content";
import { careerDetails, organizationDetails, scholarshipDetails } from "../app/detail-content";
import { organizationLogos } from "../app/logo-library";
import { catalogTables, type CatalogItem, type CatalogKind } from "./catalog-model";

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
  if (error) throw new Error("The directory is temporarily unavailable. Please try again.");
  return (data || []).map(row => fromRow(kind, row)).sort((a,b) => a.order - b.order || a.title.localeCompare(b.title));
}, ["gateway-catalog-v1"], { revalidate: 60, tags: ["gateway-catalog"] });
