"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { SaveButton } from "../components/SaveButton";
import { Icon, PageShell } from "../ui";
import { createClient } from "../../lib/supabase/client";

const interests = [
  ["airplane", "Pilot"],
  ["spacecraft", "Space Exploration"],
  ["gear", "Aerospace Engineering"],
  ["cloud", "Weather & Meteorology"],
  ["wrench", "Aircraft Mechanics"],
  ["drone", "Drones"],
  ["tower", "Air Traffic Control"],
  ["people", "Aviation Service"],
  ["path", "Still Exploring"],
] as const;

const ageRanges = ["5–7", "8–12", "13–15", "16–18", "19–24", "25+"] as const;

function stageForAge(age: string) {
  if (age === "5–7") return "Elementary School";
  if (age === "8–12") return "Middle School";
  if (age === "13–15" || age === "16–18") return "High School";
  if (age === "19–24") return "Young Adult";
  return "Adult";
}

const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "Outside the United States",
];

const opportunities = [
  {
    icon: "airplane", title: "EAA Young Eagles",
    text: "Discover free introductory flights and a welcoming first step into aviation.",
    href: "/organizations/experimental-aircraft-association-and-young-eagles",
    interests: ["Pilot", "Still Exploring"],
  },
  {
    icon: "spacecraft", title: "NASA Student Opportunities",
    text: "Explore NASA challenges, internships, activities, and learning experiences for students.",
    href: "https://www.nasa.gov/learning-resources/nasa-stem-opportunities-activities/",
    interests: ["Space Exploration", "Aerospace Engineering", "Still Exploring"], external: true,
  },
  {
    icon: "gear", title: "Aeronautical Engineering",
    text: "See how engineers design and improve aircraft, structures, systems, and technology.",
    href: "/careers/aeronautical-engineering",
    interests: ["Aerospace Engineering", "Space Exploration"],
  },
  {
    icon: "cloud", title: "Meteorology",
    text: "Learn how aviation forecasters help flight crews understand weather and fly safely.",
    href: "/careers/meteorology",
    interests: ["Weather & Meteorology", "Aviation Service"],
  },
  {
    icon: "wrench", title: "Aircraft Maintenance",
    text: "Learn how aviation technicians inspect, troubleshoot, and repair aircraft.",
    href: "/careers/aircraft-maintenance",
    interests: ["Aircraft Mechanics", "Aerospace Engineering"],
  },
  {
    icon: "drone", title: "Drone Pilot",
    text: "Explore how uncrewed aircraft support photography, mapping, and public safety.",
    href: "/careers/drone-pilot",
    interests: ["Drones", "Aerospace Engineering"],
  },
  {
    icon: "tower", title: "Air Traffic Control",
    text: "See how focused teams safely direct aircraft in the air and on the ground.",
    href: "/careers/air-traffic-control",
    interests: ["Air Traffic Control", "Aviation Service"],
  },
  {
    icon: "people", title: "Civil Air Patrol",
    text: "Build leadership skills and explore aerospace through its cadet program.",
    href: "/organizations/civil-air-patrol",
    interests: ["Aviation Service", "Pilot", "Still Exploring"],
  },
  {
    icon: "school", title: "AOPA Foundation Scholarship",
    text: "Explore flight-training funding and check the current eligibility details.",
    href: "/scholarships/aopa-foundation-scholarship",
    interests: ["Pilot", "Still Exploring"],
  },
  {
    icon: "people", title: "OBAP ACE Academy",
    text: "Join an immersive summer academy with aerospace career exposure, hands-on learning, mentors, and, at many locations, a discovery flight.",
    href: "https://obap.org/outreach-programs/ace-academy/",
    interests: ["Pilot", "Aerospace Engineering", "Aviation Service", "Still Exploring"], external: true,
  },
  {
    icon: "people", title: "Girls in Aviation Day",
    text: "Find a free Women in Aviation International event with role models, aviation activities, and aerospace career exploration.",
    href: "https://www.wai.org/giad",
    interests: ["Pilot", "Space Exploration", "Aerospace Engineering", "Aircraft Mechanics", "Aviation Service", "Still Exploring"], external: true,
  },
  {
    icon: "spacecraft", title: "NASA Internships and Challenges",
    text: "Search current NASA internships, student challenges, research experiences, and mission-connected learning programs.",
    href: "https://stemgateway.nasa.gov/public/s/explore-opportunities",
    interests: ["Space Exploration", "Aerospace Engineering", "Weather & Meteorology"], external: true,
  },
  {
    icon: "airplane", title: "FAA ACE Academies",
    text: "Explore regional youth academies that introduce aviation careers through airports, professionals, activities, and hands-on experiences.",
    href: "https://www.faa.gov/education/ace_academy",
    interests: ["Pilot", "Air Traffic Control", "Aircraft Mechanics", "Aviation Service", "Still Exploring"], external: true,
  },
  {
    icon: "airplane", title: "Academy of Model Aeronautics Youth Programs",
    text: "Build practical flight knowledge through model aviation, local clubs, STEM activities, and youth events.",
    href: "/organizations/academy-of-model-aeronautics",
    interests: ["Pilot", "Aerospace Engineering", "Drones", "Still Exploring"],
  },
  {
    icon: "school", title: "AOPA High School Flight Training Scholarship",
    text: "Check the current AOPA Foundation cycle for student flight-training awards and application requirements.",
    href: "/scholarships/aopa-high-school-flight-training",
    interests: ["Pilot"],
  },
];

export default function ExplorePage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [state, setState] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user;
      setUserId(user?.id || null);
      if (!user) return;
      const { data: profile } = await supabase.from("explore_profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (profile) {
        setName(profile.display_name || "");
        setAge(profile.age_range);
        setState(profile.state);
        setSelectedInterests(profile.interests);
      }
    });
  }, []);

  const recommendations = useMemo(() => {
    if (!selectedInterests.length) return opportunities.slice(0, 6);
    const matched = opportunities.filter((item) =>
      item.interests.some((interest) => selectedInterests.includes(interest)),
    );
    const remaining = opportunities.filter((item) => !matched.includes(item));
    return [...matched, ...remaining].slice(0, userId ? opportunities.length : 6);
  }, [selectedInterests, userId]);

  const aboutReady = Boolean(age && state);
  const ready = Boolean(aboutReady && selectedInterests.length);
  const stage = stageForAge(age);
  const firstName = name.trim().split(/\s+/)[0];
  const matchedCount = recommendations.filter((item) =>
    item.interests.some((interest) => selectedInterests.includes(interest)),
  ).length;

  function toggleInterest(label: string) {
    setSubmitted(false);
    setSelectedInterests((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    );
  }

  async function buildRoadmap() {
    if (!ready) return;
    localStorage.setItem(
      "sky-riders-roadmap",
      JSON.stringify({ name, age, state, interests: selectedInterests, stage }),
    );
    if (userId) {
      setSaving(true);
      await createClient().from("explore_profiles").upsert({
        user_id: userId, display_name: name.trim() || null, age_range: age, state,
        interests: selectedInterests, current_stage: stage, updated_at: new Date().toISOString(),
      });
      setSaving(false);
    }
    setSubmitted(true);
    window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  return (
    <PageShell active="explore">
      <section className="sub-hero explore-hero">
        <div>
          <h1>Explore Your Path<br />in Aviation</h1>
          <p>Tell us what inspires you,<br />and we’ll help you find a direction.</p>
          <div className={`progress ${submitted ? "progress-step-three" : formStep === 2 ? "progress-step-two" : ""}`}><b>Step {submitted ? "3" : formStep} of 3</b><span><i /></span></div>
        </div>
      </section>

      <section className={`explore-builder ${submitted ? "showing-results" : "showing-form"}`}>
        {!submitted ? (
          <div className="explore-form-panel">
            <div className={`explore-form-progress step-${formStep}`} aria-label="Gateway progress">
              <div className={formStep === 1 ? "active" : "complete"}><span>1</span><strong>About You</strong></div>
              <div className={formStep === 2 ? "active" : ""}><span>2</span><strong>Your Interests</strong></div>
              <div><span>3</span><strong>Your Matches</strong></div>
            </div>
            {formStep === 1 ? <>
              <div className="explore-section-heading">
                <span>YOUR GATEWAY</span>
                <h2><Icon name="user" /> About You</h2>
                <p>A few quick details help us highlight paths that fit your age and location.</p>
              </div>
              <div className="explore-step-card about-you-details">
                <label className="name-field">
                  <span>Name <small>optional</small></span>
                  <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your name" />
                  <small className={`live-name-greeting${name.trim() ? " has-name" : ""}`}>
                    {name.trim() ? `Hi, ${name.trim()}! Let’s find a path that feels like you.` : "Add your name for a more personal Gateway."}
                  </small>
                </label>

                <fieldset className="explore-choice-group age-choice-group">
                  <legend>Age</legend>
                  <div className="age-button-grid">
                    {ageRanges.map((range) => (
                      <button type="button" className={age === range ? "selected" : ""} onClick={() => setAge(range)} key={range}>{range}</button>
                    ))}
                  </div>
                </fieldset>

                <label className="state-field">
                  <span>State</span>
                  <select value={state} onChange={(event) => setState(event.target.value)}>
                    <option value="">Select your state</option>
                    {states.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
              </div>
              <button className="primary-button explore-submit" disabled={!aboutReady} onClick={() => { setFormStep(2); window.setTimeout(() => document.querySelector(".explore-builder")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0); }}>
                Continue to Interests →
              </button>
              {!aboutReady && <small className="explore-helper">Choose your age range and location to continue.</small>}
            </> : <>
              <div className="explore-section-heading">
                <span>EXPLORE YOUR PATH</span>
                <h2><Icon name="path" /> What interests you?</h2>
                <p>Select as many areas as you like. Gateway will use them to prioritize your matches.</p>
              </div>
              <div className="explore-profile-summary">
                <span>{name.trim() ? `Hi, ${name.trim()}!` : "Your profile"}</span><b>{age}</b><b>{state}</b>
                <button type="button" onClick={() => setFormStep(1)}>Edit details</button>
              </div>
              <fieldset className="explore-choice-group interest-choice-group explore-interests-step">
                <legend>Interests <small>Select all that apply</small></legend>
                <div className="interest-tile-grid">
                  {interests.map(([icon, label]) => (
                    <button type="button" aria-pressed={selectedInterests.includes(label)} className={selectedInterests.includes(label) ? "selected" : ""} onClick={() => toggleInterest(label)} key={label}>
                      <Icon name={icon} /><span>{label}</span><b aria-hidden="true">{selectedInterests.includes(label) ? "✓" : "+"}</b>
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="explore-step-actions">
                <button className="explore-back-button" type="button" onClick={() => setFormStep(1)}>← Back</button>
                <button className="primary-button" disabled={!ready || saving} onClick={buildRoadmap}>{saving ? "Saving Your Gateway..." : "Show My Opportunities →"}</button>
              </div>
              {!selectedInterests.length && <small className="explore-helper">Choose at least one interest to see your matches.</small>}
            </>}

          </div>
        ) : (
          <section className="explore-results gateway-dashboard" ref={resultsRef}>
            <div className="gateway-dashboard-hero">
              <div className="gateway-dashboard-topline">
                <span>YOUR PERSONALIZED GATEWAY</span>
                <button type="button" onClick={() => { setSubmitted(false); setFormStep(1); }}>Edit my answers</button>
              </div>
              <div className="gateway-dashboard-welcome">
                <div>
                  <h2>{firstName ? `Welcome, ${firstName}!` : "Your Gateway is ready."}</h2>
                  <p>Here are the strongest starting points for your interests, age, and location.</p>
                  <div className="gateway-profile-chips"><b>{age}</b><b>{state}</b><b>{selectedInterests.length} interests</b></div>
                </div>
                {!userId && <div className="gateway-dashboard-account">
                  <strong>Keep your full Gateway</strong>
                  <p>Create an account to unlock every match and save favorites.</p>
                  <div><Link href="/account">Sign Up</Link><Link href="/account">Log In</Link></div>
                </div>}
              </div>
              <div className="gateway-stat-grid">
                <article><span>Matches found</span><strong>{matchedCount}</strong><small>Selected for you</small></article>
                <article><span>Interests</span><strong>{selectedInterests.length}</strong><small>Guiding your results</small></article>
                <article><span>Pathways</span><strong>6</strong><small>Careers to explore</small></article>
                <article><span>Next steps</span><strong>4</strong><small>For your flight plan</small></article>
              </div>
            </div>

            <div className="gateway-recommendations">
              <div className="gateway-results-title">
                <div><span>RECOMMENDED FOR YOU</span><h2>Your strongest matches</h2></div>
                <small>{userId ? "Your complete personalized list" : "A preview of your personalized list"}</small>
              </div>
              <div className="gateway-match-grid">
                {recommendations.map((item, index) => (
                  <article className="gateway-match-card" key={item.title}>
                    <div className={`gateway-match-art tone-${index % 4}`}><Icon name={item.icon} /></div>
                    <div>
                      <small>{item.interests.find((interest) => selectedInterests.includes(interest)) || "Explore a new direction"}</small>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                      <Link href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined}>View opportunity →</Link>
                    </div>
                    <SaveButton id={`opportunity:${item.title}`} label={item.title} />
                  </article>
                ))}
              </div>
            </div>

            {!userId && <div className="gateway-unlock-strip">
              <div><span>READY FOR THE FULL LIST?</span><h3>Save your matches and keep building your path.</h3></div>
              <Link className="primary-button" href="/account">Create My Account →</Link>
            </div>}

            <div className="gateway-flight-plan">
              <div className="gateway-flight-plan-copy">
                <span>YOUR FLIGHT PLAN</span>
                <h2>A clear path from interest to action.</h2>
                <p>Your recommendations are the starting point. Follow these steps at your own pace and keep what matters close.</p>
              </div>
              <ol>
                <li><b>1</b><div><strong>Open a top match</strong><span>Learn what it offers and who it is for.</span></div></li>
                <li><b>2</b><div><strong>Compare opportunities</strong><span>Look at programs, careers, and scholarships.</span></div></li>
                <li><b>3</b><div><strong>Heart your favorites</strong><span>Keep promising options in one place.</span></div></li>
                <li><b>4</b><div><strong>Take one real next step</strong><span>Apply, attend, connect, or learn more.</span></div></li>
              </ol>
            </div>
          </section>
        )}
      </section>
    </PageShell>
  );
}
