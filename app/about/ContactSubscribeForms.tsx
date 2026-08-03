"use client";

import { FormEvent, useState } from "react";
import { createClient } from "../../lib/supabase/client";

const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "busy" | "sent" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) { setStatus("error"); return; }
    setStatus("busy");
    const form = new FormData(event.currentTarget);
    const { error } = await createClient().from("contact_inquiries").insert({
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      organization: String(form.get("organization") || "") || null,
      topic: String(form.get("topic") || ""),
      message: String(form.get("message") || ""),
    });
    if (error) { setStatus("error"); return; }
    event.currentTarget.reset();
    setStatus("sent");
  }

  return <form className="contact-form" onSubmit={submit}>
    <label>Name<input name="name" autoComplete="name" required /></label>
    <label>Email<input name="email" type="email" autoComplete="email" required /></label>
    <label className="full">Organization or school<input name="organization" autoComplete="organization" /></label>
    <label className="full">What would you like to discuss?<select name="topic" required defaultValue=""><option value="" disabled>Select a topic</option><option>Media or interview</option><option>Speaking opportunity</option><option>Partnership or collaboration</option><option>Research</option><option>Book inquiry</option><option>Sky Riders Gateway</option><option>Other</option></select></label>
    <label className="full">Message<textarea name="message" required /></label>
    <button className="primary-button" type="submit" disabled={status === "busy"}>{status === "busy" ? "Sending..." : "Send Inquiry →"}</button>
    {status === "sent" && <p className="form-success-message" role="status">Thank you. Your message has been securely received.</p>}
    {status === "error" && <p className="form-error" role="alert">We could not send your message. Please try again in a moment.</p>}
    <small>Please do not include sensitive personal information.</small>
  </form>;
}

export function SubscribeForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "busy" | "sent" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) { setStatus("error"); return; }
    setStatus("busy");
    const form = new FormData(event.currentTarget);
    const { error } = await createClient().from("newsletter_subscribers").upsert({
      email: String(form.get("email") || "").trim().toLowerCase(),
      first_name: String(form.get("first_name") || "").trim() || null,
      source: "about-ishitha",
      status: "subscribed",
    }, { onConflict: "email" });
    if (error) { setStatus("error"); return; }
    event.currentTarget.reset();
    setStatus("sent");
  }

  return <form className={compact ? "subscribe-form compact" : "subscribe-form"} onSubmit={submit}>
    {!compact && <label>First name<input name="first_name" autoComplete="given-name" placeholder="First name" /></label>}
    <label><span className="sr-only">Email address</span><input name="email" type="email" autoComplete="email" required placeholder="Email address" /></label>
    <button className="primary-button" type="submit" disabled={status === "busy"}>{status === "busy" ? "Joining..." : "Subscribe →"}</button>
    {status === "sent" && <p role="status">You’re on the list. Welcome to Gateway.</p>}
    {status === "error" && <p className="form-error" role="alert">We could not add you right now. Please try again.</p>}
  </form>;
}
