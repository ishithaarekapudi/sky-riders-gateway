create table if not exists public.saved_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null,
  item_label text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create table if not exists public.explore_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  age_range text not null,
  state text not null,
  interests text[] not null default '{}',
  current_stage text not null,
  updated_at timestamptz not null default now()
);

alter table public.saved_items enable row level security;
alter table public.explore_profiles enable row level security;

drop policy if exists "Users manage their saved items" on public.saved_items;
create policy "Users manage their saved items" on public.saved_items
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage their explore profile" on public.explore_profiles;
create policy "Users manage their explore profile" on public.explore_profiles
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.saved_items to authenticated;
grant select, insert, update, delete on public.explore_profiles to authenticated;

comment on table public.saved_items is 'Account-owned saved organizations, scholarships, careers, and opportunities.';
comment on table public.explore_profiles is 'Account-owned answers used to personalize the Explore experience.';
