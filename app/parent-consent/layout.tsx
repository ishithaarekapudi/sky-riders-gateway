import type { Metadata } from "next";

export const metadata: Metadata = { title: "Parent and Guardian Controls", robots: { index: false, follow: false } };

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
