import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/seo";
import { getCatalog } from "../lib/catalog";

export const revalidate = 60;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const kinds = ["organizations", "careers", "scholarships"] as const;
  const catalog = await Promise.all(kinds.map(kind => getCatalog(kind)));
  const base=siteUrl;
  const staticPages=["","/explore","/gliding","/scholarships","/careers","/organizations","/resources","/about","/about/gateway","/about/media","/get-involved","/get-involved/mentorship","/get-involved/submit","/privacy","/youth-safety","/accessibility","/disclaimer"];
  return [
    ...staticPages.map((path,index)=>({url:`${base}${path}`,changeFrequency:index===0?"weekly" as const:"monthly" as const,priority:index===0?1:.8})),
    ...catalog.flatMap((rows, index) => rows.map(row => ({url: `${base}/${kinds[index]}/${row.slug}`, changeFrequency: "monthly" as const, priority: .72}))),
  ];
}
