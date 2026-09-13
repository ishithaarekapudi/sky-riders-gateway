create table if not exists public.media_outlets (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  logo_url text not null,
  website_url text,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.media_outlets enable row level security;
create policy "Public reads published media outlets" on public.media_outlets for select using (published = true);
create policy "Administrators manage media outlets" on public.media_outlets for all to authenticated using ((select public.is_gateway_admin())) with check ((select public.is_gateway_admin()));
grant select, insert, update, delete on public.media_outlets to authenticated;
