import type { Metadata } from "next";
import "./globals.css";
import "./explore-refinement.css";

import { siteUrl, socialImage } from "../lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Sky Riders Gateway", template: "%s | Sky Riders Gateway" },
  description: "Explore youth aviation, aerospace, flight, drones, computer science, engineering, STEM careers, scholarships, mentors, and organizations with a personalized pathway from Sky Riders Gateway.",
  keywords: ["aviation careers","aerospace careers","aviation scholarships","youth aviation programs","student pilot resources","flight training scholarships","drone careers","UAS programs","aerospace engineering","computer science careers","engineering opportunities","STEM opportunities","aviation mentors","Sky Riders Gateway"],
  authors: [{ name: "Sky Riders Gateway" }, { name: "Ishitha Arekapudi" }],
  creator: "Sky Riders Gateway",
  publisher: "Sky Riders Gateway",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    type: "website", locale: "en_US", url: "/", siteName: "Sky Riders Gateway",
    title: "Sky Riders Gateway | Aviation and Aerospace Pathways",
    description: "Turn curiosity into a clear aviation, aerospace, drone, computer science, engineering, or STEM path through trusted careers, scholarships, programs, mentors, and next steps.",
    images: [socialImage],
  },
  twitter: { card: "summary_large_image", title: "Sky Riders Gateway", description: "Find aviation, aerospace, drone, computer science, engineering, and STEM careers, scholarships, programs, mentors, and practical next steps.", images: ["/hero-gateway-live.jpg"] },
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
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}}/>{children}</body></html>;
}
