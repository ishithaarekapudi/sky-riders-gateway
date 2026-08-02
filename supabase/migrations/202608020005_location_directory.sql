create table if not exists public.location_directory (
  id uuid primary key default gen_random_uuid(),
  organization_slug text not null,
  organization_name text not null,
  location_name text not null,
  location_type text not null check (location_type in ('chapter', 'squadron', 'club', 'program', 'official_finder')),
  city text,
  state text not null,
  postal_code text,
  latitude double precision,
  longitude double precision,
  official_url text not null,
  source_url text not null,
  description text not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists location_directory_state_idx on public.location_directory (state) where published = true;
alter table public.location_directory enable row level security;
drop policy if exists "Published location records are public" on public.location_directory;
create policy "Published location records are public" on public.location_directory for select using (published = true);

insert into public.location_directory
  (organization_slug, organization_name, location_name, location_type, state, official_url, source_url, description)
select 'eaa', 'Experimental Aircraft Association', 'Find EAA chapters in ' || state_name,
  'official_finder', state_name, 'https://www.eaa.org/eaa/eaa-chapters/find-an-eaa-chapter',
  'https://www.eaa.org/eaa/eaa-chapters/find-an-eaa-chapter',
  'Use EAA’s official chapter finder to see verified chapters, Young Eagles activities, and local contacts.'
from unnest(array['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']) as state_name
on conflict do nothing;

insert into public.location_directory
  (organization_slug, organization_name, location_name, location_type, state, official_url, source_url, description)
select 'civil-air-patrol', 'Civil Air Patrol', 'Find Civil Air Patrol squadrons in ' || state_name,
  'official_finder', state_name, 'https://www.gocivilairpatrol.com/cap-unit-locator',
  'https://www.gocivilairpatrol.com/cap-unit-locator',
  'Use Civil Air Patrol’s official unit locator to see verified squadrons, meeting information, and local contacts.'
from unnest(array['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']) as state_name
on conflict do nothing;
