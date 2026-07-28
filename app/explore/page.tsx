"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Icon, PageShell } from "../ui";

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

const stages = [
  ["school", "Middle School"],
  ["cap", "High School"],
  ["school", "College"],
  ["path", "Other"],
] as const;

const ageRanges = ["8–12", "13–15", "16–18", "College", "Adult"] as const;

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
];

const featuredOrganizations = [
  { className: "eaa-mark", href: "/organizations/experimental-aircraft-association-and-young-eagles", logo: "https://www.eaa.org/-/media/Images/EAA/Chapters/resources/EAA_logo_2color-png.png?o=1", title: "EAA", description: "A welcoming worldwide aviation community." },
  { className: "cap-mark", href: "/organizations/civil-air-patrol", logo: "https://www.gocivilairpatrol.com/local/public/shared/assets/images/websites/CAP-2017-logo-horizontal-optimized-d73f31575f10142a77f0888cdfb36256.png", title: "Civil Air Patrol", description: "Leadership, aerospace education, and service." },
  { className: "eagles-mark", href: "/organizations/experimental-aircraft-association-and-young-eagles", logo: "https://www.eaa.org/-/media/Images/EAA/Chapters/resources/YE_logo_color-png.png?o=1", title: "Young Eagles", description: "Free discovery flights for youth ages 8 to 17." },
  { className: "women-mark", href: "/organizations/women-in-aviation-international", logo: "https://assets.noviams.com/novi-file-uploads/wai/structure/wai-full-color-logo.png", title: "Women in Aviation", description: "Education, mentoring, and a global network." },
  { className: "nasa-mark", href: "https://www.nasa.gov/learning-resources/", title: "NASA STEM", description: "Explore, learn, build, and innovate.", external: true },
];

export default function ExplorePage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [state, setState] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [stage, setStage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);

  const recommendations = useMemo(() => {
    if (!selectedInterests.length) return opportunities.slice(0, 6);
    const matched = opportunities.filter((item) =>
      item.interests.some((interest) => selectedInterests.includes(interest)),
    );
    const remaining = opportunities.filter((item) => !matched.includes(item));
    return [...matched, ...remaining].slice(0, 6);
  }, [selectedInterests]);

  const ready = Boolean(age && state && selectedInterests.length && stage);

  function toggleInterest(label: string) {
    setSubmitted(false);
    setSelectedInterests((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    );
  }

  function buildRoadmap() {
    if (!ready) return;
    localStorage.setItem(
      "sky-riders-roadmap",
      JSON.stringify({ name, age, state, interests: selectedInterests, stage }),
    );
    setSubmitted(true);
    window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  return (
    <PageShell active="explore">
      <section className="sub-hero explore-hero">
        <div>
          <h1>Explore Your Path<br />in Aviation</h1>
          <p>Tell us what inspires you,<br />and we’ll help you find a direction.</p>
          <div className={`progress ${submitted ? "progress-step-two" : ""}`}><b>Step {submitted ? "2" : "1"} of 3</b><span><i /></span></div>
        </div>
      </section>

      <section className={`explore-builder ${submitted ? "showing-results" : "showing-form"}`}>
        {!submitted ? (
          <div className="explore-form-panel">
            <div className="explore-section-heading">
              <span>YOUR GATEWAY</span>
              <h2><Icon name="user" /> About You</h2>
              <p>A few quick details help us highlight paths that fit you.</p>
            </div>

            <div className="about-you-grid">
              <div className="about-you-details">
                <label className="name-field">
                  <span>Name <small>optional</small></span>
                  <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your name" />
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

                <fieldset className="explore-choice-group stage-choice-group">
                  <legend>What best describes your current stage?</legend>
                  <div className="explore-stage-grid">
                    {stages.map(([icon, label]) => (
                      <button type="button" className={stage === label ? "selected" : ""} onClick={() => setStage(label)} key={label}>
                        <Icon name={icon} /><span>{label}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>

              <fieldset className="explore-choice-group interest-choice-group">
                <legend>Interests <small>Select all that apply</small></legend>
                <div className="interest-tile-grid">
                  {interests.map(([icon, label]) => (
                    <button
                      type="button"
                      aria-pressed={selectedInterests.includes(label)}
                      className={selectedInterests.includes(label) ? "selected" : ""}
                      onClick={() => toggleInterest(label)}
                      key={label}
                    >
                      <Icon name={icon} /><span>{label}</span>
                      <b aria-hidden="true">{selectedInterests.includes(label) ? "✓" : "+"}</b>
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <button className="primary-button explore-submit" disabled={!ready} onClick={buildRoadmap}>
              Show My Opportunities →
            </button>
            {!ready && <small className="explore-helper">Choose your age, state, at least one interest, and current stage to continue.</small>}

            <div className="explore-featured-teaser">
              <div className="featured-heading">
                <div><h3>Featured Organizations</h3><p>A preview of the communities and programs Gateway can help you discover.</p></div>
                <Link href="/organizations">View all →</Link>
              </div>
              <div className="explore-featured-card-row">
                {featuredOrganizations.map((organization) => (
                  <Link
                    className="explore-featured-card"
                    href={organization.href}
                    target={organization.external ? "_blank" : undefined}
                    rel={organization.external ? "noreferrer" : undefined}
                    key={organization.className}
                  >
                    <span className={`org-mark ${organization.className}`}>
                      {organization.logo
                        ? <img src={organization.logo} alt={`${organization.title} official logo`} width="180" height="90" loading="lazy" />
                        : <span className="nasa-custom-mark" aria-hidden="true">✦<small>NASA STEM</small></span>}
                    </span>
                    <strong>{organization.title}</strong>
                    <p>{organization.description}</p>
                    <small>Learn More →</small>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <section className="explore-results results-ready" ref={resultsRef}>
            <button className="edit-profile-button" type="button" onClick={() => setSubmitted(false)}>← Edit my answers</button>
            <div className="results-heading">
              <div>
                <span>OPPORTUNITIES FOR YOU</span>
                <h2>{name ? `${name}’s starting points` : "Your starting points"}</h2>
              </div>
              <small>Matched to {selectedInterests.length} interest{selectedInterests.length > 1 ? "s" : ""}</small>
            </div>

            <div className="account-opportunity-note">
              <Icon name="user" />
              <div><strong>Want your full personalized list?</strong><p>Sign up or log in to see all matching opportunities, scholarships, and career paths, and save your favorites.</p></div>
              <div className="account-note-actions"><Link href="/account">Sign Up</Link><Link href="/account">Log In</Link></div>
            </div>

            <div className="opportunity-preview-grid">
              {recommendations.map((item) => (
                <Link href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined} className="opportunity-preview" key={item.title}>
                  <div className="opportunity-art"><Icon name={item.icon} /></div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    <strong>Explore opportunity <span>→</span></strong>
                  </div>
                  <b className="opportunity-plus" aria-hidden="true">+</b>
                </Link>
              ))}
            </div>

            <div className="results-next-step">
              <div>
                <span>NEXT STEP</span>
                <h3>Keep your personalized Gateway</h3>
                <p>Create an account or log in to unlock the full list, save opportunities, and continue to your roadmap.</p>
              </div>
              <div>
                <Link className="primary-button" href="/account">Sign Up →</Link>
                <Link className="ghost-button" href="/account">Log In</Link>
              </div>
            </div>

            <div className="roadmap-preview">
              <Icon name="path" />
              <div>
                <h3>Your Gateway Roadmap</h3>
                <p>{selectedInterests.join(" · ")} · {stage} · {state}</p>
              </div>
              <span>Step 3</span>
            </div>
          </section>
        )}
      </section>
    </PageShell>
  );
}
