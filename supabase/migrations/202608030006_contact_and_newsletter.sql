create extension if not exists pgcrypto;

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  organization text,
  topic text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  source text not null default 'website',
  status text not null default 'subscribed' check (status in ('subscribed', 'unsubscribed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contact_inquiries enable row level security;
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Anyone can send a contact inquiry" on public.contact_inquiries;
create policy "Anyone can send a contact inquiry" on public.contact_inquiries
  for insert to anon, authenticated with check (status = 'new');

drop policy if exists "Anyone can subscribe" on public.newsletter_subscribers;
create policy "Anyone can subscribe" on public.newsletter_subscribers
  for insert to anon, authenticated with check (status = 'subscribed');

grant usage on schema public to anon, authenticated;
grant insert on public.contact_inquiries to anon, authenticated;
grant insert on public.newsletter_subscribers to anon, authenticated;

comment on table public.contact_inquiries is 'Private contact requests submitted through the Sky Riders website.';
comment on table public.newsletter_subscribers is 'Private newsletter subscription list. Never expose through a public select policy.';
