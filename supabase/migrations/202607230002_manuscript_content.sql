insert into public.organizations (slug, name, description, featured, published) values
  ('eaa-young-eagles', 'Experimental Aircraft Association & Young Eagles', 'Youth flights, aviation education, scholarships, events, and a global recreational aviation community.', true, true),
  ('aopa', 'Aircraft Owners and Pilots Association', 'Training materials, safety education, scholarships, flying clubs, advocacy, and community for general aviation.', true, true),
  ('civil-air-patrol', 'Civil Air Patrol', 'Aerospace education, leadership, service, emergency response, and flight opportunities for cadets.', true, true),
  ('junior-rotc', 'Junior ROTC', 'High-school leadership, citizenship, service, and exposure to aviation and aerospace.', false, true),
  ('ace-academy', 'Aviation Career Education Academy', 'Hands-on workshops, field trips, mentorship, and flight experiences introducing aviation careers.', false, true),
  ('academy-model-aeronautics', 'Academy of Model Aeronautics', 'Model aviation education, safety, events, competitions, and community.', false, true),
  ('red-tailed-hawks', 'Red-Tailed Hawks Flying Club', 'Mentorship, workshops, flight experiences, and aviation access for underrepresented youth.', true, true),
  ('women-in-aviation', 'Women in Aviation International', 'Scholarships, mentoring, education, conferences, and a global network supporting women in aviation.', true, true),
  ('ninety-nines', 'The Ninety-Nines', 'An international community of women pilots offering scholarships, mentorship, and education.', true, true),
  ('nobap', 'National Organization of Black Aerospace Professionals', 'Mentorship, education, networking, and career development increasing Black representation in aerospace.', true, true),
  ('soaring-society-america', 'Soaring Society of America', 'Glider training resources, clubs, competitions, safety education, and scholarships.', false, true),
  ('womens-soaring-pilots', 'Women''s Soaring Pilots Association', 'Mentorship, fly-ins, workshops, community, and scholarships supporting women in soaring.', false, true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  featured = excluded.featured,
  published = excluded.published;

insert into public.career_paths (slug, title, summary, icon, skills, published, sort_order) values
  ('professional-pilot', 'Professional Pilot Careers', 'Airlines, corporate aviation, cargo, charter, public service, test piloting, and spaceflight.', 'plane', array['communication','decision-making','leadership'], true, 1),
  ('drone-pilot', 'Drone Pilot', 'Uncrewed aircraft work in photography, inspection, mapping, public safety, and emerging industries.', 'code', array['technology','safety','visual awareness'], true, 2),
  ('flight-instructor', 'Flight Instructor', 'Teach new pilots and build advanced knowledge and professional flight experience.', 'people', array['teaching','communication','leadership'], true, 3),
  ('air-traffic-control', 'Air Traffic Control', 'Direct aircraft safely in the air and on the ground.', 'globe', array['focus','communication','rapid decisions'], true, 4),
  ('airport-operations', 'Airport Operations', 'Support safe, secure, and efficient airfields and airport systems.', 'calendar', array['operations','safety','coordination'], true, 5),
  ('flight-dispatch', 'Flight Dispatch', 'Plan routes, analyze weather and fuel, and coordinate flight operations.', 'document', array['planning','weather','communication'], true, 6),
  ('aircraft-maintenance', 'Aircraft Maintenance', 'Inspect, troubleshoot, and repair aircraft structures, engines, avionics, and systems.', 'wrench', array['mechanical','precision','problem-solving'], true, 7),
  ('aeronautical-engineering', 'Aeronautical Engineering', 'Design and improve aircraft, structures, systems, and technology.', 'code', array['math','design','engineering'], true, 8),
  ('meteorology', 'Meteorology', 'Forecast atmospheric conditions and support safe flight decisions.', 'cloud', array['science','analysis','weather'], true, 9),
  ('cabin-customer-experience', 'Cabin Crew & Customer Experience', 'Protect passenger safety and comfort in flight and throughout the airport journey.', 'people', array['service','safety','communication'], true, 10),
  ('aerospace-medicine', 'Aerospace Medicine', 'Support the health and performance of people involved in air and space travel.', 'user', array['medicine','safety','human performance'], true, 11),
  ('aviation-law-business', 'Aviation Law & Business', 'Work across regulation, insurance, airport management, business, policy, and risk.', 'document', array['law','business','analysis'], true, 12)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  icon = excluded.icon,
  skills = excluded.skills,
  published = excluded.published,
  sort_order = excluded.sort_order;

insert into public.opportunities (slug, type, title, summary, amount_cents, eligibility, featured, published, metadata) values
  ('eaa-ray-aviation-scholarship', 'scholarship', 'EAA Ray Aviation Scholarship', 'Chapter-nominated support for youth flight training.', 1200000, array['Ages 16-19','Chapter nomination'], true, true, '{"source":"Cleared for Takeoff","verify_current_cycle":true}'),
  ('eaa-air-academy-alumni', 'scholarship', 'EAA Air Academy Alumni Scholarship', 'Initial flight training support for eligible EAA Air Academy alumni.', null, array['Initial flight training','Air Academy alumni'], false, true, '{"source":"Cleared for Takeoff","verify_current_cycle":true}'),
  ('harrison-ford-scholarship', 'scholarship', 'Harrison Ford Scholarship', 'Aviation education or flight training support for Young Eagles.', null, array['Young Eagles','Financial need considered'], false, true, '{"source":"Cleared for Takeoff","verify_current_cycle":true}'),
  ('adapt-to-fly-scholarship', 'scholarship', 'Adapt to Fly Scholarship', 'Aviation access support for a qualified person with a disability.', null, array['Disability focused','Medical or Sport Pilot eligibility'], true, true, '{"source":"Cleared for Takeoff","verify_current_cycle":true}'),
  ('cap-cadet-wings', 'scholarship', 'Civil Air Patrol Cadet Wings', 'Funded training pathway helping eligible cadets pursue a Private Pilot Certificate.', null, array['CAP cadets','Private pilot pathway'], true, true, '{"source":"Cleared for Takeoff","verify_current_cycle":true}'),
  ('aopa-foundation-scholarship', 'scholarship', 'AOPA Foundation Scholarship', 'Primary and advanced aviation training support for eligible AOPA members.', 250000, array['Age 16+','AOPA membership'], true, true, '{"source":"Cleared for Takeoff","amount_is_minimum":true,"verify_current_cycle":true}'),
  ('aopa-high-school-flight-training', 'scholarship', 'AOPA High School Flight Training Scholarship', 'Private pilot training support for eligible high-school students.', 1000000, array['Ages 16-18','GPA requirement','FAA knowledge test'], true, true, '{"source":"Cleared for Takeoff","verify_current_cycle":true}'),
  ('leroy-homer-jr-scholarship', 'scholarship', 'LeRoy W. Homer Jr. Scholarship', 'Private pilot training support for dedicated young applicants.', null, array['Ages 16-23','U.S. citizen or permanent resident'], true, true, '{"source":"Cleared for Takeoff","verify_current_cycle":true}'),
  ('ninety-nines-first-wings', 'scholarship', 'The Ninety-Nines First Wings', 'Milestone-based support for eligible student pilot members.', 600000, array['Student pilot member','Flight-time requirement'], true, true, '{"source":"Cleared for Takeoff","verify_current_cycle":true}'),
  ('amelia-earhart-memorial', 'scholarship', 'Amelia Earhart Memorial Scholarship', 'Advanced flight, academic, or technical training support for qualified members.', 2000000, array['The Ninety-Nines membership','Advanced training'], true, true, '{"source":"Cleared for Takeoff","verify_current_cycle":true}'),
  ('ssa-discover-soaring', 'scholarship', 'SSA Discover Soaring Scholarship', 'Training awards introducing young non-pilots to soaring.', null, array['Young non-pilots','Glider training'], true, true, '{"source":"Cleared for Takeoff","verify_current_cycle":true}'),
  ('dennis-purduski-flight-training', 'scholarship', 'Dennis Purduski Flight Training Scholarship', 'Direct glider flight training support for pre-solo SSA members.', 200000, array['SSA members','Ages 13-19','Pre-solo'], false, true, '{"source":"Cleared for Takeoff","verify_current_cycle":true}'),
  ('wspa-sky-ghost', 'scholarship', 'WSPA Sky Ghost Scholarship', 'Training support toward a Private Glider Certificate.', 150000, array['Women under 25','WSPA membership','Glider training'], false, true, '{"source":"Cleared for Takeoff","verify_current_cycle":true}'),
  ('eaa-post-secondary', 'scholarship', 'EAA Post-Secondary Scholarship', 'Support for aviation degrees, technical education, maintenance, management, and pilot training.', null, array['Post-secondary aviation study'], false, true, '{"source":"Cleared for Takeoff","verify_current_cycle":true}'),
  ('ssa-kolstad-award', 'scholarship', 'SSA Kolstad Award', 'College-level academic support for competitive young applicants.', 1000000, array['Ages 14-25','College study'], false, true, '{"source":"Cleared for Takeoff","verify_current_cycle":true}'),
  ('astronaut-scholarship', 'scholarship', 'Astronaut Scholarship', 'STEM scholarship, mentorship, and professional development for exceptional college students.', 1500000, array['College junior or senior','STEM research','U.S. citizen'], true, true, '{"source":"Cleared for Takeoff","verify_current_cycle":true}')
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  amount_cents = excluded.amount_cents,
  eligibility = excluded.eligibility,
  featured = excluded.featured,
  published = excluded.published,
  metadata = excluded.metadata;
