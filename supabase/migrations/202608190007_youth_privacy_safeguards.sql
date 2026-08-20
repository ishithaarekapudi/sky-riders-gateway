-- Youth privacy and mentorship safeguards.
-- Run this migration in Supabase before accepting the updated mentorship form.

alter table public.mentee_applications
  add column if not exists guardian_consent_confirmed boolean not null default false;

alter table public.mentee_applications
  drop constraint if exists guardian_required_for_minors;

alter table public.mentee_applications
  add constraint guardian_required_for_minors check (
    age_range not in ('13–15', '16–17')
    or (
      guardian_email is not null
      and length(trim(guardian_email)) > 3
      and guardian_consent_confirmed
    )
  ) not valid;

alter table public.mentee_applications
  drop constraint if exists no_under_13_mentorship_requests;

alter table public.mentee_applications
  add constraint no_under_13_mentorship_requests check (
    age_range not in ('Under 13', 'Under 13, parent or guardian completing form')
  ) not valid;

alter table public.mentor_applications
  drop constraint if exists mentors_must_be_adults;

alter table public.mentor_applications
  add constraint mentors_must_be_adults check (
    age_range in ('18–24', '25–39', '40+')
  ) not valid;

drop policy if exists "Anyone can request a mentor" on public.mentee_applications;
create policy "Anyone can request a mentor" on public.mentee_applications
  for insert to anon, authenticated
  with check (
    status = 'pending'
    and conduct_consent
    and age_range not in ('Under 13', 'Under 13, parent or guardian completing form')
    and (
      age_range not in ('13–15', '16–17')
      or (guardian_email is not null and guardian_consent_confirmed)
    )
    and review_notes is null
    and reviewed_at is null
  );

comment on column public.mentee_applications.guardian_consent_confirmed is
  'Applicant attestation only. A coordinator must still obtain and record verified guardian consent before matching a minor.';
