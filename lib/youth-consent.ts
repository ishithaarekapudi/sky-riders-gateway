import { createHash, randomBytes } from "crypto";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export const PRIVACY_NOTICE_VERSION = "2026-08-21-parent-managed-explore-v1";
export const FOLLOW_UP_DELAY_HOURS = 24;

export function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Secure database access is not configured.");
  return createServiceClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function newToken() {
  return randomBytes(32).toString("hex");
}

export function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function publicSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.ishitha.us").replace(/\/$/, "");
}

export const completeParentNotice = `Sky Riders Gateway offers an optional parent-managed Explore profile for children ages 5–12. Before verified consent, Gateway does not collect the child's nickname, interests, state, or Explore answers. After consent is active, a parent may create a private profile containing an optional nickname, broad age range, state, interests, and current stage. The profile is used only to personalize Gateway Explore recommendations. It is not public, is not used for behavioral advertising, and is not shared with mentors. Under-13 mentorship is unavailable. Parents can review or delete the profile and revoke consent at any time. Gateway uses Supabase for protected database storage, Vercel for hosting, Resend for consent email, Cloudflare Turnstile for abuse prevention, and Stripe only when a separate purchase is made.`;

export async function sendConsentEmail(args: { to: string; subject: string; heading: string; body: string; actionLabel: string; actionUrl: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Consent email delivery is not configured.");
  const sender = process.env.ALERT_FROM_EMAIL || "Sky Riders Gateway <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: sender,
      to: [args.to],
      subject: args.subject,
      html: `<div style="max-width:620px;margin:auto;font-family:Arial,sans-serif;color:#08264a;line-height:1.65"><p style="color:#1674e8;font-size:12px;letter-spacing:.18em">SKY RIDERS GATEWAY</p><h1 style="font-size:26px">${args.heading}</h1><p>${args.body}</p><div style="padding:18px;background:#f1f7fd;border-radius:10px"><strong>Complete privacy notice</strong><p>${completeParentNotice}</p></div><p><a href="${args.actionUrl}" style="display:inline-block;background:#1674e8;color:white;padding:12px 18px;border-radius:8px;text-decoration:none">${args.actionLabel}</a></p><p>If you did not request this, do not select the button.</p></div>`,
      text: `${args.heading}\n\n${args.body}\n\nComplete privacy notice:\n${completeParentNotice}\n\n${args.actionLabel}: ${args.actionUrl}`,
    }),
  });
  if (!response.ok) throw new Error("The email provider rejected the message.");
}

