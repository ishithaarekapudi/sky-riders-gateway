create extension if not exists pgcrypto;

create table if not exists public.opportunity_submissions (
  id uuid primary key default gen_random_uuid(),
  submission_type text not null check (submission_type in ('Organization', 'Scholarship', 'Program or Event', 'Career Resource', 'Other Opportunity')),
  name text not null,
  official_url text not null,
  description text not null,
  eligible_ages text,
  location text,
  deadline_or_availability text,
  cost_or_award text,
  submitter_name text not null,
  submitter_email text not null,
  submitter_connection text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined', 'needs_information')),
  review_notes text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.mentor_applications (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  age_range text not null,
  city_state text not null,
  meeting_format text not null,
  interest_areas text[] not null default '{}',
  current_role_organization text not null,
  experience_qualifications text not null,
  preferred_mentee_age text not null,
  availability text not null,
  screening_consent boolean not null default false,
  conduct_consent boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'screening', 'approved', 'declined', 'paused')),
  review_notes text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.mentee_applications (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  age_range text not null,
  city_state text not null,
  meeting_format text not null,
  interest_areas text[] not null default '{}',
  guidance_requested text not null,
  current_stage text not null,
  availability text not null,
  guardian_email text,
  conduct_consent boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'guardian_consent', 'approved', 'matched', 'declined', 'paused')),
  review_notes text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  constraint guardian_required_for_minors check (
    age_range not in ('Under 13, parent or guardian completing form', '13–15', '16–17')
    or (guardian_email is not null and length(trim(guardian_email)) > 3)
  )
);

create table if not exists public.mentorship_matches (
  id uuid primary key default gen_random_uuid(),
  mentor_application_id uuid not null references public.mentor_applications(id) on delete restrict,
  mentee_application_id uuid not null references public.mentee_applications(id) on delete restrict,
  status text not null default 'proposed' check (status in ('proposed', 'active', 'paused', 'completed', 'ended')),
  goals text,
  coordinator_notes text,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  unique (mentor_application_id, mentee_application_id)
);

create index if not exists opportunity_submissions_status_idx on public.opportunity_submissions (status, created_at desc);
create index if not exists mentor_applications_status_idx on public.mentor_applications (status, created_at desc);
create index if not exists mentee_applications_status_idx on public.mentee_applications (status, created_at desc);
create index if not exists mentorship_matches_status_idx on public.mentorship_matches (status, created_at desc);

alter table public.opportunity_submissions enable row level security;
alter table public.mentor_applications enable row level security;
alter table public.mentee_applications enable row level security;
alter table public.mentorship_matches enable row level security;

drop policy if exists "Anyone can submit an opportunity" on public.opportunity_submissions;
create policy "Anyone can submit an opportunity" on public.opportunity_submissions
  for insert to anon, authenticated
  with check (status = 'pending' and review_notes is null and reviewed_at is null);

drop policy if exists "Anyone can apply to mentor" on public.mentor_applications;
create policy "Anyone can apply to mentor" on public.mentor_applications
  for insert to anon, authenticated
  with check (status = 'pending' and screening_consent and conduct_consent and review_notes is null and reviewed_at is null);

drop policy if exists "Anyone can request a mentor" on public.mentee_applications;
create policy "Anyone can request a mentor" on public.mentee_applications
  for insert to anon, authenticated
  with check (status = 'pending' and conduct_consent and review_notes is null and reviewed_at is null);

grant usage on schema public to anon, authenticated;
grant insert on public.opportunity_submissions, public.mentor_applications, public.mentee_applications to anon, authenticated;
revoke all on public.mentorship_matches from anon, authenticated;

comment on table public.opportunity_submissions is 'Private community submissions awaiting Gateway review.';
comment on table public.mentor_applications is 'Private mentor applications. Never expose through a public select policy.';
comment on table public.mentee_applications is 'Private mentee applications. Never expose through a public select policy.';
comment on table public.mentorship_matches is 'Coordinator-managed mentorship matches. No browser access.';
