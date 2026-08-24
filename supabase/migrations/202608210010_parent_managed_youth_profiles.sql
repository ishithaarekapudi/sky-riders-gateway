-- Parent-managed private Explore profiles and privacy operations.
-- Under-13 mentorship remains prohibited. No child profile can be created
-- until the parent consent record reaches the active state.

create table if not exists public.parental_consents (
  id uuid primary key default gen_random_uuid(),
  parent_user_id uuid not null references auth.users(id) on delete cascade,
  parent_email text not null,
  parent_name text not null,
  relationship_to_child text not null,
  status text not null default 'pending_parent_response'
    check (status in ('pending_parent_response', 'waiting_period', 'active', 'revoked', 'expired')),
  privacy_notice_version text not null,
  consent_token_hash text not null unique,
  revocation_token_hash text not null unique,
  initial_notice_sent_at timestamptz not null default now(),
  parent_affirmed_at timestamptz,
  second_notice_due_at timestamptz,
  second_notice_sent_at timestamptz,
  revoked_at timestamptz,
  expires_at timestamptz not null default (now() + interval '1 year'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.parent_managed_explore_profiles (
  id uuid primary key default gen_random_uuid(),
  parent_user_id uuid not null references auth.users(id) on delete cascade,
  parental_consent_id uuid not null references public.parental_consents(id) on delete cascade,
  child_nickname text,
  age_range text not null check (age_range in ('5–7', '8–12')),
  state text not null,
  interests text[] not null default '{}',
  current_stage text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.data_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  requester_name text not null,
  requester_email text not null,
  request_scope text not null,
  details text,
  status text not null default 'pending' check (status in ('pending', 'identity_verification', 'in_progress', 'completed', 'declined')),
  review_notes text,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.mentee_applications
  add column if not exists guardian_consent_verified_at timestamptz,
  add column if not exists guardian_consent_verified_by uuid references auth.users(id) on delete set null,
  add column if not exists guardian_consent_verification_method text,
  add column if not exists retention_delete_after timestamptz;

alter table public.mentor_applications add column if not exists retention_delete_after timestamptz;
alter table public.opportunity_submissions add column if not exists retention_delete_after timestamptz;
alter table public.contact_inquiries add column if not exists retention_delete_after timestamptz;
alter table public.mentorship_matches add column if not exists retention_delete_after timestamptz;

alter table public.mentee_applications drop constraint if exists verified_guardian_before_minor_approval;
alter table public.mentee_applications add constraint verified_guardian_before_minor_approval check (
  status not in ('approved', 'matched')
  or age_range not in ('13–15', '16–17')
  or guardian_consent_verified_at is not null
) not valid;

alter table public.parental_consents enable row level security;
alter table public.parent_managed_explore_profiles enable row level security;
alter table public.data_deletion_requests enable row level security;

drop policy if exists "Parents can read their consent records" on public.parental_consents;
create policy "Parents can read their consent records" on public.parental_consents
  for select to authenticated using (auth.uid() = parent_user_id);

drop policy if exists "Parents manage their private youth profiles" on public.parent_managed_explore_profiles;
create policy "Parents manage their private youth profiles" on public.parent_managed_explore_profiles
  for all to authenticated using (auth.uid() = parent_user_id) with check (
    auth.uid() = parent_user_id and exists (
      select 1 from public.parental_consents consent
      where consent.id = parental_consent_id
        and consent.parent_user_id = auth.uid()
        and consent.status = 'active'
        and consent.expires_at > now()
    )
  );

drop policy if exists "Admins review parental consent" on public.parental_consents;
create policy "Admins review parental consent" on public.parental_consents
  for select to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid()));
drop policy if exists "Admins review youth profiles" on public.parent_managed_explore_profiles;
create policy "Admins review youth profiles" on public.parent_managed_explore_profiles
  for select to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid()));
drop policy if exists "Admins review deletion requests" on public.data_deletion_requests;
create policy "Admins review deletion requests" on public.data_deletion_requests
  for all to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

create index if not exists parental_consents_parent_idx on public.parental_consents(parent_user_id, status);
create index if not exists parental_consents_followup_idx on public.parental_consents(second_notice_due_at)
  where status = 'waiting_period';
create index if not exists youth_profiles_parent_idx on public.parent_managed_explore_profiles(parent_user_id);
create index if not exists deletion_requests_status_idx on public.data_deletion_requests(status, created_at desc);

comment on table public.parental_consents is 'Consent audit trail for parent-managed, private under-13 Explore profiles only. It does not authorize mentorship.';
comment on column public.mentee_applications.guardian_consent_confirmed is 'Applicant attestation only; not verified consent.';
comment on column public.mentee_applications.guardian_consent_verified_at is 'Set by an authorized Gateway reviewer after separate guardian verification.';

create or replace function public.assign_gateway_retention_date()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.status in ('declined', 'closed') and new.retention_delete_after is null then
    new.retention_delete_after := coalesce(new.reviewed_at, now()) + interval '90 days';
  elsif new.status not in ('declined', 'closed') then
    new.retention_delete_after := null;
  end if;
  return new;
end;
$$;

drop trigger if exists mentor_retention_date on public.mentor_applications;
create trigger mentor_retention_date before insert or update of status on public.mentor_applications for each row execute function public.assign_gateway_retention_date();
drop trigger if exists mentee_retention_date on public.mentee_applications;
create trigger mentee_retention_date before insert or update of status on public.mentee_applications for each row execute function public.assign_gateway_retention_date();
drop trigger if exists opportunity_retention_date on public.opportunity_submissions;
create trigger opportunity_retention_date before insert or update of status on public.opportunity_submissions for each row execute function public.assign_gateway_retention_date();
drop trigger if exists contact_retention_date on public.contact_inquiries;
create trigger contact_retention_date before insert or update of status on public.contact_inquiries for each row execute function public.assign_gateway_retention_date();
