import { PageShell } from "../../ui";
import { ContactForm, SubscribeForm } from "../ContactSubscribeForms";

export default function ContactPage() {
  return <PageShell active="about">
    <section className="section contact-page">
      <div><span className="eyebrow">CONNECT WITH ISHITHA</span><h1>Let’s Start a Conversation</h1><p>For media, speaking, partnerships, research, book inquiries, or collaboration with Sky Riders Gateway, share a few details below.</p><div className="contact-topics"><span>Media</span><span>Speaking</span><span>Partnerships</span><span>Research</span><span>Book</span><span>Sky Riders</span></div></div>
      <ContactForm />
    </section>
    <section className="section subscribe-section"><div><span className="eyebrow">STAY IN THE LOOP</span><h2>Follow the Gateway journey.</h2><p>Receive occasional updates about new opportunities, resources, the book, and Ishitha’s work.</p></div><SubscribeForm /></section>
  </PageShell>;
}
