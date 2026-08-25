import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "./explore-refinement.css";

const siteUrl = "https://www.ishitha.us";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Sky Riders Gateway", template: "%s | Sky Riders Gateway" },
  description: "Explore aviation and aerospace careers, scholarships, mentors, organizations, and youth opportunities with a personalized pathway from Sky Riders Gateway.",
  keywords: ["aviation careers","aerospace careers","aviation scholarships","youth aviation programs","student pilot resources","aerospace opportunities","aviation mentors","Sky Riders Gateway"],
  authors: [{ name: "Sky Riders Gateway" }, { name: "Ishitha Arekapudi" }],
  creator: "Sky Riders Gateway",
  publisher: "Sky Riders Gateway",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website", locale: "en_US", url: "/", siteName: "Sky Riders Gateway",
    title: "Sky Riders Gateway | Aviation and Aerospace Pathways",
    description: "Turn curiosity into a clear aviation or aerospace path through trusted careers, scholarships, programs, mentors, and next steps.",
    images: [{ url: "/hero-gateway-live.jpg", width: 2048, height: 1024, alt: "Sky Riders Gateway aviation and aerospace pathway" }],
  },
  twitter: { card: "summary_large_image", title: "Sky Riders Gateway", description: "Find aviation and aerospace careers, scholarships, programs, mentors, and practical next steps.", images: ["/hero-gateway-live.jpg"] },
  icons: { icon: "/brand/sky-riders-mark-v3.png", apple: "/brand/sky-riders-mark-v3.png" },
  category: "education",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context":"https://schema.org", "@graph":[
      { "@type":"Organization", "@id":`${siteUrl}/#organization`, name:"Sky Riders Gateway", url:siteUrl, logo:`${siteUrl}/brand/sky-riders-mark-v3.png`, founder:{"@type":"Person",name:"Ishitha Arekapudi",url:`${siteUrl}/about`}, description:"A gateway connecting young people with aviation and aerospace pathways, scholarships, organizations, mentors, and practical next steps." },
      { "@type":"WebSite", "@id":`${siteUrl}/#website`, url:siteUrl, name:"Sky Riders Gateway", publisher:{"@id":`${siteUrl}/#organization`}, inLanguage:"en-US", audience:{"@type":"EducationalAudience",educationalRole:"student"} }
    ]
  };
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}}/>{children}<Analytics /></body></html>;
}
