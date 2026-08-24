import type { MetadataRoute } from "next";
import { careerPaths, organizations, scholarships, slugify } from "./content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base="https://sky-riders-gateway.vercel.app";
  const staticPages=["","/explore","/gliding","/scholarships","/careers","/organizations","/resources","/about","/about/gateway","/get-involved","/privacy","/privacy/delete","/parent-consent","/youth-safety","/disclaimer"];
  return [
    ...staticPages.map((path,index)=>({url:`${base}${path}`,lastModified:new Date(),changeFrequency:index===0?"weekly" as const:"monthly" as const,priority:index===0?1:.8})),
    ...scholarships.map(([,title])=>({url:`${base}/scholarships/${slugify(title)}`,lastModified:new Date(),changeFrequency:"monthly" as const,priority:.72})),
    ...careerPaths.map(([,title])=>({url:`${base}/careers/${slugify(title)}`,lastModified:new Date(),changeFrequency:"monthly" as const,priority:.72})),
    ...organizations.map(([title])=>({url:`${base}/organizations/${slugify(title)}`,lastModified:new Date(),changeFrequency:"monthly" as const,priority:.72})),
  ];
}
