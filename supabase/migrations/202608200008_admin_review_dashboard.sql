-- Private administrator review workflow for Sky Riders Gateway.
-- Run after the youth privacy safeguards migration.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_gateway_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_gateway_admin() from public;
grant execute on function public.is_gateway_admin() to authenticated;

insert into public.admin_users (user_id, email)
select id, lower(email)
from auth.users
where lower(email) = 'ishithaarekapudi@gmail.com'
on conflict (user_id) do update set email = excluded.email;

drop policy if exists "Administrators can view their role" on public.admin_users;
create policy "Administrators can view their role" on public.admin_users
  for select to authenticated
  using (user_id = auth.uid());

alter table public.opportunity_submissions add column if not exists reviewed_by uuid references auth.users(id);
alter table public.mentor_applications add column if not exists reviewed_by uuid references auth.users(id);
alter table public.mentee_applications add column if not exists reviewed_by uuid references auth.users(id);
alter table public.contact_inquiries add column if not exists review_notes text;
alter table public.contact_inquiries add column if not exists reviewed_at timestamptz;
alter table public.contact_inquiries add column if not exists reviewed_by uuid references auth.users(id);

drop policy if exists "Administrators review opportunity submissions" on public.opportunity_submissions;
create policy "Administrators review opportunity submissions" on public.opportunity_submissions
  for select to authenticated using ((select public.is_gateway_admin()));
drop policy if exists "Administrators update opportunity submissions" on public.opportunity_submissions;
create policy "Administrators update opportunity submissions" on public.opportunity_submissions
  for update to authenticated
  using ((select public.is_gateway_admin()))
  with check ((select public.is_gateway_admin()) and reviewed_by = auth.uid());

drop policy if exists "Administrators review mentor applications" on public.mentor_applications;
create policy "Administrators review mentor applications" on public.mentor_applications
  for select to authenticated using ((select public.is_gateway_admin()));
drop policy if exists "Administrators update mentor applications" on public.mentor_applications;
create policy "Administrators update mentor applications" on public.mentor_applications
  for update to authenticated
  using ((select public.is_gateway_admin()))
  with check ((select public.is_gateway_admin()) and reviewed_by = auth.uid());

drop policy if exists "Administrators review mentee applications" on public.mentee_applications;
create policy "Administrators review mentee applications" on public.mentee_applications
  for select to authenticated using ((select public.is_gateway_admin()));
drop policy if exists "Administrators update mentee applications" on public.mentee_applications;
create policy "Administrators update mentee applications" on public.mentee_applications
  for update to authenticated
  using ((select public.is_gateway_admin()))
  with check ((select public.is_gateway_admin()) and reviewed_by = auth.uid());

drop policy if exists "Administrators review contact inquiries" on public.contact_inquiries;
create policy "Administrators review contact inquiries" on public.contact_inquiries
  for select to authenticated using ((select public.is_gateway_admin()));
drop policy if exists "Administrators update contact inquiries" on public.contact_inquiries;
create policy "Administrators update contact inquiries" on public.contact_inquiries
  for update to authenticated
  using ((select public.is_gateway_admin()))
  with check ((select public.is_gateway_admin()) and reviewed_by = auth.uid());

grant select, update on public.opportunity_submissions to authenticated;
grant select, update on public.mentor_applications to authenticated;
grant select, update on public.mentee_applications to authenticated;
grant select, update on public.contact_inquiries to authenticated;
grant select on public.admin_users to authenticated;

comment on table public.admin_users is 'Private allowlist for the protected Gateway administrator dashboard.';
