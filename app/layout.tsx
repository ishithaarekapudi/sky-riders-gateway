import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Sky Riders Gateway", template: "%s | Sky Riders Gateway" },
  description: "Accessible aviation pathways, mentors, scholarships, and opportunities for young people.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
