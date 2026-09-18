-- Delete records after the retention date assigned by the youth-safety policy.
-- Matches are deleted first so their foreign keys cannot block cleanup.
create or replace function public.delete_expired_gateway_records()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.mentorship_matches
    where retention_delete_after is not null and retention_delete_after <= now();
  delete from public.mentee_applications
    where retention_delete_after is not null and retention_delete_after <= now();
  delete from public.mentor_applications
    where retention_delete_after is not null and retention_delete_after <= now();
  delete from public.opportunity_submissions
    where retention_delete_after is not null and retention_delete_after <= now();
  delete from public.contact_inquiries
    where retention_delete_after is not null and retention_delete_after <= now();
end;
$$;

revoke all on function public.delete_expired_gateway_records() from public, anon, authenticated;
comment on function public.delete_expired_gateway_records() is
  'Called only by the protected daily retention-cleanup cron route.';
