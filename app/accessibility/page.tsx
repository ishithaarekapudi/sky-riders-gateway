import { withPageSeo } from "../../lib/seo";
import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "../ui";

export const metadata: Metadata = withPageSeo({ title: "Accessibility", description: "Sky Riders Gateway's accessibility commitment and how to request help using the website.", alternates: { canonical: "/accessibility" } });

export default function AccessibilityPage() {
  return <PageShell active="resources">
    <main className="policy-page">
      <span>ACCESSIBILITY</span>
      <h1>Gateway should be usable by everyone who wants to explore a path forward.</h1>
      <p className="policy-updated">Accessibility statement · Updated September 15, 2026</p>
      <section><h2>Our commitment</h2><p>Sky Riders Gateway works to make its website understandable and usable with keyboard navigation, screen readers, browser zoom, and different devices. We use the Web Content Accessibility Guidelines as a practical reference while improving the site.</p></section>
      <section><h2>What we are working on</h2><p>We review page structure, labels, focus states, color contrast, image descriptions, and forms as the website changes. Some third-party services, including Stripe checkout and Cloudflare Turnstile, are provided outside Gateway and may have their own accessibility features and support channels.</p></section>
      <section><h2>Need help or found a barrier?</h2><p>Use the <Link href="/about/contact">contact form</Link> and select “Sky Riders Gateway.” Tell us the page, the issue you encountered, and the assistive technology or browser you used if you are comfortable sharing it. We will use that information to improve access.</p></section>
    </main>
  </PageShell>;
}
