import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules:{ userAgent:"*", allow:"/", disallow:["/account","/dashboard","/auth/"] }, sitemap:"https://sky-riders-gateway.vercel.app/sitemap.xml", host:"https://sky-riders-gateway.vercel.app" };
}
