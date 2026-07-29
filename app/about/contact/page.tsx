"use client";

import { FormEvent, useState } from "react";
import { PageShell } from "../../ui";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }
  return <PageShell active="about">
    <section className="section contact-page">
      <div><span className="eyebrow">CONNECT WITH ISHITHA</span><h1>Let’s Start a Conversation</h1><p>For media, speaking, partnerships, research, book inquiries, or collaboration with Sky Riders Gateway, share a few details below.</p><div className="contact-topics"><span>Media</span><span>Speaking</span><span>Partnerships</span><span>Research</span><span>Book</span><span>Sky Riders</span></div></div>
      <form className="contact-form" onSubmit={submit}>
        <label>Name<input name="name" required /></label>
        <label>Email<input name="email" type="email" required /></label>
        <label className="full">Organization or school<input name="organization" /></label>
        <label className="full">What would you like to discuss?<select name="topic" required defaultValue=""><option value="" disabled>Select a topic</option><option>Media or interview</option><option>Speaking opportunity</option><option>Partnership or collaboration</option><option>Research</option><option>Book inquiry</option><option>Sky Riders Gateway</option><option>Other</option></select></label>
        <label className="full">Message<textarea name="message" required /></label>
        <button className="primary-button" type="submit">{sent ? "Inquiry Saved ✓" : "Send Inquiry →"}</button>
        <small>{sent ? "Thank you. The inquiry form is designed and ready; direct email delivery will be connected before public launch." : "Please do not include sensitive personal information."}</small>
      </form>
    </section>
  </PageShell>;
}
