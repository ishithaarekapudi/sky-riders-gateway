-- Align the editable directory with current official scholarship requirements.
-- The public application also carries these corrections while this migration is
-- awaiting application in an existing Supabase project.
update public.opportunities
set directory_content = jsonb_set(
  jsonb_set(
    jsonb_set(directory_content, '{award}', '"Up to $12,000*"'::jsonb, true),
    '{tags}', '["Ages 16–18 · GPA and test requirements"]'::jsonb, true
  ),
  '{info}', '{"officialUrl":"https://www.aopa.org/training-and-safety/students/aopa-flight-training-scholarships","sourceLabel":"AOPA Foundation","overview":"AOPA''s current cycle offers flight-training awards for eligible high-school students. Confirm the current cycle before applying.","highlights":["At least 90 awards of $12,000 in the current cycle","High-school students ages 16–18","Minimum 2.7 GPA","FAA Private Pilot knowledge exam before applying"],"nextSteps":["Review current AOPA scholarship listings","Confirm age, membership, and academic criteria","Plan for the FAA knowledge test"]}'::jsonb,
  true
)
where type = 'scholarship' and slug = 'aopa-high-school-flight-training';

update public.opportunities
set directory_content = jsonb_set(
  jsonb_set(
    jsonb_set(directory_content, '{award}', '"Award varies*"'::jsonb, true),
    '{tags}', '["Women ages 15–24 · Glider certificate"]'::jsonb, true
  ),
  '{info}', '{"officialUrl":"https://womensoaring.org/scholarships/","sourceLabel":"Women’s Soaring Pilots Association","overview":"The Sky Ghost Scholarship supports a woman who is at least 15 by May 1 of the application year and under 25, pursuing glider training toward a private certificate. Award amounts and requirements are set for each WSPA cycle.","highlights":["For women ages 15–24","WSPA membership required","Training toward a Private Glider Certificate","Mentoring accompanies WSPA’s scholarship community"],"nextSteps":["Review the current WSPA scholarship guide","Confirm WSPA and SSA membership requirements","Prepare your training record and aviation goals"]}'::jsonb,
  true
)
where type = 'scholarship' and slug = 'wspa-sky-ghost-scholarship';

update public.opportunities
set directory_content = jsonb_set(
  jsonb_set(
    jsonb_set(directory_content, '{award}', '"Award varies*"'::jsonb, true),
    '{tags}', '["Women age 25+ · Glider certificate or add-on"]'::jsonb, true
  ),
  '{info}', '{"officialUrl":"https://womensoaring.org/scholarships/","sourceLabel":"Women’s Soaring Pilots Association","overview":"The Mid Kolstad Scholarship supports eligible women age 25 or older pursuing a Private Glider Certificate or add-on glider rating. Award amounts and requirements are set for each WSPA cycle.","highlights":["Women age 25+","Glider certificate or add-on","WSPA and SSA requirements"],"nextSteps":["Review the current WSPA scholarship guide","Confirm eligibility, dates, and location details","Save the opportunity and prepare early"]}'::jsonb,
  true
)
where type = 'scholarship' and slug = 'wspa-mid-kolstad-scholarship';
