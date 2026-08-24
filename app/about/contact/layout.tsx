import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact Ishitha Arekapudi", description: "Contact Ishitha Arekapudi about media, speaking, partnerships, research, the book, or Sky Riders Gateway.", alternates: { canonical: "/about/contact" }, robots: { index: false, follow: true } };

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
