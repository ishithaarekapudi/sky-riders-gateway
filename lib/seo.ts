import type { Metadata } from "next";

export const siteUrl = "https://www.skyriders.org";
export const socialImage = {
  url: "/hero-gateway-live.jpg",
  width: 1672,
  height: 941,
  alt: "Sky Riders Gateway aviation and aerospace pathways",
};

/** Keep every public page's canonical and sharing metadata in sync. */
export function withPageSeo(metadata: Metadata): Metadata {
  const title = typeof metadata.title === "string" ? metadata.title : "Sky Riders Gateway";
  const description = metadata.description ?? "Explore aviation and aerospace opportunities with Sky Riders Gateway.";
  const canonical = metadata.alternates?.canonical;
  const url = typeof canonical === "string" || canonical instanceof URL ? canonical : canonical?.url ?? "/";
  return {
    ...metadata,
    openGraph: {
      type: metadata.openGraph && "type" in metadata.openGraph && metadata.openGraph.type === "article" ? "article" : "website",
      locale: "en_US",
      siteName: "Sky Riders Gateway",
      title: `${title} | Sky Riders Gateway`,
      description,
      url,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage.url],
    },
  };
}
