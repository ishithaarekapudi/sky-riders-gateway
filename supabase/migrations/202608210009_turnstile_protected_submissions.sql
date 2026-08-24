-- Public forms now submit through /api/public-submissions, where Cloudflare
-- Turnstile is verified before the service-role client writes the row.
-- Removing browser-level INSERT policies prevents bypassing that verification.

drop policy if exists "Anyone can submit an opportunity" on public.opportunity_submissions;
drop policy if exists "Anyone can apply to mentor" on public.mentor_applications;
drop policy if exists "Anyone can request a mentor" on public.mentee_applications;
drop policy if exists "Anyone can send a contact inquiry" on public.contact_inquiries;
drop policy if exists "Anyone can subscribe" on public.newsletter_subscribers;
