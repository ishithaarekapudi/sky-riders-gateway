import Link from "next/link";
import { PageShell } from "../../ui";

export const metadata = {
  title: "Thank You for Your Purchase",
  robots: { index: false, follow: false },
};

export default function BookThankYouPage() {
  return <PageShell active="resources">
    <section className="book-thank-you">
      <span className="eyebrow">THANK YOU</span>
      <h1>Thank you for buying <i>Cleared for Takeoff</i>.</h1>
      <p>If your Stripe payment was completed, Stripe will send your receipt and order details to the email address you used at checkout.</p>
      <p>I hope this book helps you find a clear next step toward aviation, aerospace, and the future you want to build.</p>
      <div><Link className="primary-button" href="/resources">Explore Gateway resources →</Link><Link href="/">Return home</Link></div>
    </section>
  </PageShell>;
}
