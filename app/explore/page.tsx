"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Icon, PageShell } from "../ui";

const interests = [
  ["plane", "I love flying"],
  ["wrench", "I like building and fixing"],
  ["code", "I enjoy technology"],
  ["people", "I want to help people"],
  ["path", "I’m still exploring"],
];

const stages = [
  ["school", "Middle School"],
  ["cap", "High School"],
  ["school", "College"],
  ["path", "Other"],
];

const opportunities = [
  {
    icon: "plane",
    title: "EAA Young Eagles",
    text: "Discover free introductory flights and a welcoming first step into aviation.",
    href: "/organizations/experimental-aircraft-association-and-young-eagles",
    interests: ["I love flying", "I’m still exploring"],
  },
  {
    icon: "people",
    title: "Civil Air Patrol",
    text: "Build leadership skills and explore aerospace through its cadet program.",
    href: "/organizations/civil-air-patrol",
    interests: ["I want to help people", "I love flying", "I’m still exploring"],
  },
  {
    icon: "code",
    title: "Drone Pilot",
    text: "Explore how uncrewed aircraft support photography, mapping, and public safety.",
    href: "/careers/drone-pilot",
    interests: ["I enjoy technology", "I like building and fixing"],
  },
  {
    icon: "wrench",
    title: "Aircraft Maintenance",
    text: "Learn how aviation technicians inspect, troubleshoot, and repair aircraft.",
    href: "/careers/aircraft-maintenance",
    interests: ["I like building and fixing", "I enjoy technology"],
  },
  {
    icon: "school",
    title: "AOPA Foundation Scholarship",
    text: "Explore flight-training funding and check the current eligibility details.",
    href: "/scholarships/aopa-foundation-scholarship",
    interests: ["I love flying", "I’m still exploring"],
  },
  {
    icon: "globe",
    title: "Air Traffic Control",
    text: "See how focused teams safely direct aircraft in the air and on the ground.",
    href: "/careers/air-traffic-control",
    interests: ["I enjoy technology", "I want to help people"],
  },
];

export default function ExplorePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [region, setRegion] = useState("");
  const [interest, setInterest] = useState("");
  const [stage, setStage] = useState("");

  const recommendations = useMemo(() => {
    if (!interest) return opportunities.slice(0, 4);
    const matched = opportunities.filter((item) => item.interests.includes(interest));
    const remaining = opportunities.filter((item) => !matched.includes(item));
    return [...matched, ...remaining].slice(0, 4);
  }, [interest]);

  const ready = Boolean(age && region && interest && stage);

  function buildRoadmap() {
    if (!ready) return;
    localStorage.setItem(
      "sky-riders-roadmap",
      JSON.stringify({ name, age, region, interest, stage }),
    );
    router.push("/careers");
  }

  return (
    <PageShell active="explore">
      <section className="sub-hero explore-hero">
        <div>
          <h1>Explore Your Path<br />in Aviation</h1>
          <p>Tell us what inspires you,<br />and we’ll help you find a direction.</p>
          <div className="progress"><b>Step 1 of 3</b><span><i /></span></div>
        </div>
      </section>

      <section className="explore-builder">
        <div className="explore-form-panel">
          <div className="explore-section-heading">
            <span>YOUR GATEWAY</span>
            <h2>Let’s discover your future</h2>
            <p>A few quick details help us highlight paths that fit you.</p>
          </div>

          <div className="profile-fields">
            <label>
              <span>Name <small>optional</small></span>
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
            </label>
            <label>
              <span>Age range</span>
              <select value={age} onChange={(event) => setAge(event.target.value)}>
                <option value="">Choose your age</option>
                <option>Under 13</option>
                <option>13–15</option>
                <option>16–18</option>
                <option>19–24</option>
                <option>25+</option>
              </select>
            </label>
            <label>
              <span>Region</span>
              <select value={region} onChange={(event) => setRegion(event.target.value)}>
                <option value="">Choose your region</option>
                <option>Northeast</option>
                <option>Midwest</option>
                <option>South</option>
                <option>West</option>
                <option>Outside the United States</option>
              </select>
            </label>
          </div>

          <fieldset className="explore-choice-group">
            <legend>What interests you most?</legend>
            <p>Choose one that feels most like you.</p>
            <div className="explore-chip-grid">
              {interests.map(([icon, label]) => (
                <button
                  type="button"
                  className={interest === label ? "selected" : ""}
                  onClick={() => setInterest(label)}
                  key={label}
                >
                  <Icon name={icon} /><span>{label}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="explore-choice-group">
            <legend>What best describes your current stage?</legend>
            <p>This helps us personalize your recommendations.</p>
            <div className="explore-stage-grid">
              {stages.map(([icon, label]) => (
                <button
                  type="button"
                  className={stage === label ? "selected" : ""}
                  onClick={() => setStage(label)}
                  key={label}
                >
                  <Icon name={icon} /><span>{label}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <button className="primary-button explore-submit" disabled={!ready} onClick={buildRoadmap}>
            Build My Roadmap →
          </button>
          {!ready && <small className="explore-helper">Choose your age, region, interest, and stage to continue.</small>}
        </div>

        <aside className="explore-results">
          <div className="results-heading">
            <div>
              <span>OPPORTUNITIES FOR YOU</span>
              <h2>{name ? `${name}’s starting points` : "Your starting points"}</h2>
            </div>
            <small>{interest ? "Updated for your interest" : "A preview of what you can discover"}</small>
          </div>

          <div className="opportunity-preview-grid">
            {recommendations.map((item) => (
              <Link href={item.href} className="opportunity-preview" key={item.title}>
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

          <div className="roadmap-preview">
            <Icon name="path" />
            <div>
              <h3>Your Gateway Roadmap</h3>
              <p>{ready ? `${interest} · ${stage} · ${region}` : "Complete your profile to unlock personalized next steps."}</p>
            </div>
            <span>{ready ? "Ready" : "Locked"}</span>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
