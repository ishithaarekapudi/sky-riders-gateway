insert into public.organizations (slug, name, description, featured, published) values
  ('eaa', 'Experimental Aircraft Association', 'Aviation experiences, education, and a community for people who love flight.', true, true),
  ('civil-air-patrol', 'Civil Air Patrol', 'Leadership, aerospace education, emergency services, and youth development.', true, true),
  ('young-eagles', 'Young Eagles', 'Introductory flights and resources that help young people discover aviation.', true, true),
  ('women-in-aviation', 'Women in Aviation International', 'Mentorship, scholarships, and a global community advancing women in aviation.', true, true),
  ('nasa', 'NASA', 'Science, aeronautics, space exploration, and learning opportunities for students.', true, true);

insert into public.career_paths (slug, title, summary, icon, skills, published, sort_order) values
  ('pilot-flight-operations', 'Pilot & Flight Operations', 'Fly aircraft, coordinate missions, and connect the world.', 'plane', array['communication','leadership','decision-making'], true, 1),
  ('aircraft-maintenance', 'Aircraft Maintenance', 'Keep aircraft safe through skilled inspection, repair, and technology.', 'wrench', array['mechanical','problem-solving','precision'], true, 2),
  ('aerospace-engineering', 'Aerospace Engineering', 'Design aircraft, spacecraft, systems, and the future of flight.', 'code', array['math','design','technology'], true, 3),
  ('air-traffic-operations', 'Air Traffic & Operations', 'Guide aircraft safely and manage complex aviation systems.', 'globe', array['focus','communication','planning'], true, 4),
  ('aviation-business', 'Aviation Business', 'Lead airports, airlines, programs, communications, and communities.', 'people', array['leadership','business','communication'], true, 5),
  ('safety-investigation', 'Safety & Investigation', 'Study systems, improve safety, and help aviation learn and evolve.', 'document', array['analysis','research','safety'], true, 6);

insert into public.opportunities (slug, type, title, summary, amount_cents, eligibility, featured, published) values
  ('future-aviators-scholarship', 'scholarship', 'Future Aviators Scholarship', 'Support for high-school students beginning pilot training.', 250000, array['High School','Pilot Training'], true, true),
  ('women-in-aviation-opportunity', 'scholarship', 'Women in Aviation Opportunity', 'Funding for students pursuing aviation and leadership goals.', 300000, array['Aviation','Leadership'], true, true),
  ('young-eagles-flight-training', 'scholarship', 'Young Eagles Flight Training', 'Support for youth gaining meaningful flight experience.', 100000, array['Youth','Flight Experience'], true, true),
  ('aviation-stem-scholars', 'scholarship', 'Aviation STEM Scholars', 'Funding for students exploring aviation, STEM, and innovation.', 200000, array['STEM','Innovation'], true, true),
  ('community-flight-grant', 'scholarship', 'Community Flight Grant', 'Need-based support that expands access to aviation experiences.', 150000, array['Community','Need-Based'], true, true),
  ('gateway-access-award', 'scholarship', 'Gateway Access Award', 'A first-generation student award supporting an aviation pathway.', 100000, array['First-Gen','Aviation'], true, true);

