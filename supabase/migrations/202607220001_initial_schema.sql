create extension if not exists pgcrypto;

create type public.opportunity_type as enum ('scholarship', 'event', 'mentor', 'resource', 'program');
create type public.education_stage as enum ('middle_school', 'high_school', 'college', 'other');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  education_stage public.education_stage,
  city text,
  state text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  website_url text,
  logo_url text,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.career_paths (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  icon text,
  education text,
  skills text[] not null default '{}',
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  career_path_id uuid references public.career_paths(id) on delete set null,
  slug text not null unique,
  type public.opportunity_type not null,
  title text not null,
  summary text not null,
  amount_cents integer check (amount_cents is null or amount_cents >= 0),
  deadline date,
  location text,
  eligibility text[] not null default '{}',
  application_url text,
  featured boolean not null default false,
  published boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profile_interests (
  user_id uuid not null references public.profiles(id) on delete cascade,
  interest text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, interest)
);

create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, opportunity_id)
);

create table public.quiz_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  interest text not null,
  education_stage public.education_stage not null,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index organizations_published_featured_idx on public.organizations (published, featured);
create index career_paths_published_sort_idx on public.career_paths (published, sort_order);
create index opportunities_discovery_idx on public.opportunities (published, type, featured);
create index opportunities_organization_idx on public.opportunities (organization_id);
create index opportunities_career_idx on public.opportunities (career_path_id);
create index favorites_user_idx on public.favorites (user_id);
create index quiz_responses_user_idx on public.quiz_responses (user_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger organizations_updated_at before update on public.organizations for each row execute function public.set_updated_at();
create trigger career_paths_updated_at before update on public.career_paths for each row execute function public.set_updated_at();
create trigger opportunities_updated_at before update on public.opportunities for each row execute function public.set_updated_at();
create trigger quiz_responses_updated_at before update on public.quiz_responses for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.career_paths enable row level security;
alter table public.opportunities enable row level security;
alter table public.profile_interests enable row level security;
alter table public.favorites enable row level security;
alter table public.quiz_responses enable row level security;

create policy "Published organizations are public" on public.organizations for select to anon, authenticated using (published);
create policy "Published careers are public" on public.career_paths for select to anon, authenticated using (published);
create policy "Published opportunities are public" on public.opportunities for select to anon, authenticated using (published);

create policy "Users can read their profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Users can update their profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "Users manage their interests" on public.profile_interests for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users manage their favorites" on public.favorites for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users manage their quiz responses" on public.quiz_responses for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant usage on schema public to anon, authenticated;
grant select on public.organizations, public.career_paths, public.opportunities to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.profile_interests, public.favorites, public.quiz_responses to authenticated;

