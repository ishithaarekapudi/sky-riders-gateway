import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/admin", "/dashboard", "/auth/", "/parent-consent", "/privacy/delete", "/api/"],
    },
    sitemap: "https://www.ishitha.us/sitemap.xml",
    host: "https://www.ishitha.us",
  };
}
