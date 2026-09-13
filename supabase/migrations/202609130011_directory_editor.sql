-- Editable public directories. Existing rows and published URLs are retained.
begin;
alter table public.organizations add column if not exists directory_content jsonb;
alter table public.organizations add column if not exists homepage_partner boolean not null default false;
alter table public.organizations add column if not exists partner_order integer not null default 0;
alter table public.career_paths add column if not exists directory_content jsonb;
alter table public.opportunities add column if not exists directory_content jsonb;
alter table public.opportunity_submissions add column if not exists logo_url text;
alter table public.opportunity_submissions add column if not exists logo_path text;
create unique index if not exists organizations_directory_slug on public.organizations ((coalesce(directory_content->>'slug', slug)));
create unique index if not exists careers_directory_slug on public.career_paths ((coalesce(directory_content->>'slug', slug)));
create unique index if not exists opportunities_directory_slug on public.opportunities ((coalesce(directory_content->>'slug', slug)));
create policy "Administrators manage organizations" on public.organizations for all to authenticated using ((select public.is_gateway_admin())) with check ((select public.is_gateway_admin()));
create policy "Administrators manage careers" on public.career_paths for all to authenticated using ((select public.is_gateway_admin())) with check ((select public.is_gateway_admin()));
create policy "Administrators manage opportunities" on public.opportunities for all to authenticated using ((select public.is_gateway_admin())) with check ((select public.is_gateway_admin()));
grant select, insert, update, delete on public.organizations, public.career_paths, public.opportunities to authenticated;
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types) values
 ('organization-logos','organization-logos',true,2097152,array['image/png','image/jpeg','image/webp']),
 ('submission-logos','submission-logos',false,2097152,array['image/png','image/jpeg','image/webp'])
on conflict (id) do nothing;
create policy "Administrators manage organization logos" on storage.objects for all to authenticated using (bucket_id = 'organization-logos' and (select public.is_gateway_admin())) with check (bucket_id = 'organization-logos' and (select public.is_gateway_admin()));
create policy "Administrators read submitted logos" on storage.objects for select to authenticated using (bucket_id = 'submission-logos' and (select public.is_gateway_admin()));
commit;
