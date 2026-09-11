import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/seo";
import { scholarshipDetails, careerDetails, organizationDetails } from "./detail-content";
import { careerPaths, organizations, scholarships, slugify } from "./content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base=siteUrl;
  const staticPages=["","/explore","/gliding","/scholarships","/careers","/organizations","/resources","/about","/about/gateway","/about/media","/get-involved","/get-involved/mentorship","/get-involved/submit","/privacy","/youth-safety","/disclaimer"];
  return [
    ...staticPages.map((path,index)=>({url:`${base}${path}`,changeFrequency:index===0?"weekly" as const:"monthly" as const,priority:index===0?1:.8})),
    ...scholarships.filter(([, title]) => scholarshipDetails[slugify(title)]).map(([,title])=>({url:`${base}/scholarships/${slugify(title)}`,changeFrequency:"monthly" as const,priority:.72})),
    ...careerPaths.filter(([, title]) => careerDetails[slugify(title)]).map(([,title])=>({url:`${base}/careers/${slugify(title)}`,changeFrequency:"monthly" as const,priority:.72})),
    ...organizations.filter(([title]) => organizationDetails[slugify(title)]).map(([title])=>({url:`${base}/organizations/${slugify(title)}`,changeFrequency:"monthly" as const,priority:.72})),
  ];
}
