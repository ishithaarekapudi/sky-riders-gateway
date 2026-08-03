"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SaveButton } from "../components/SaveButton";
import { Icon, PageShell } from "../ui";
import { createClient } from "../../lib/supabase/client";
import { nationwideDirectories, verifiedLocations } from "./verified-locations";

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

type NearbyResource = {
  id: string; organization_slug: string; organization_name: string; location_name: string;
  location_type: string; city: string | null; state: string; postal_code?: string | null;
  latitude?: number | null; longitude?: number | null; official_url: string; description: string;
};

function milesBetween(a: {lat:number;lon:number}, b: {latitude?:number|null;longitude?:number|null}) {
  if (b.latitude == null || b.longitude == null) return Number.POSITIVE_INFINITY;
  const rad=(n:number)=>n*Math.PI/180;
  const dLat=rad(b.latitude-a.lat), dLon=rad(b.longitude-a.lon);
  const x=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.latitude))*Math.sin(dLon/2)**2;
  return 3958.8*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}

function matchCategory(item: (typeof opportunities)[number]) {
  if (item.href.startsWith("/scholarships")) return "Scholarship";
  if (item.href.startsWith("/careers")) return "Career Path";
  return "Opportunity";
}

function matchBrand(title: string) {
  if (/Young Eagles/.test(title)) return { src: "/organization-logos/young-eagles.png", alt: "EAA Young Eagles official logo" };
  if (/Civil Air Patrol/.test(title)) return { src: "/organization-logos/civil-air-patrol.png", alt: "Civil Air Patrol official logo" };
  if (/AOPA/.test(title)) return { src: "/organization-logos/aopa.svg", alt: "Aircraft Owners and Pilots Association official logo" };
  if (/OBAP/.test(title)) return { src: "https://obap.org/wp-content/uploads/2019/07/OBAP_Logo_280x280.png", alt: "Organization of Black Aerospace Professionals official logo" };
  if (/Girls in Aviation/.test(title)) return { src: "/organization-logos/women-in-aviation.png", alt: "Women in Aviation International official logo" };
  if (/FAA ACE/.test(title)) return { src: "/organization-logos/faa.svg", alt: "Federal Aviation Administration official logo" };
  if (/NASA/.test(title)) return { src: "/organization-logos/nasa.svg", alt: "NASA official logo" };
  return null;
}

function directoryBrand(item: NearbyResource) {
  if (item.organization_slug === "civil-air-patrol") return { short:"CAP", icon:"people", tone:"cap-mark", name:"Civil Air Patrol" };
  if (item.organization_slug === "federal-aviation-administration") return { short:"FAA", icon:"airplane", tone:"faa-mark", name:"Federal Aviation Administration" };
  if (item.organization_slug === "experimental-aircraft-association") return { short:"EAA", icon:"airplane", tone:"eaa-mark", name:"Experimental Aircraft Association" };
  if (item.location_type === "flight_school") return { short:"FLY", icon:"airplane", tone:"school-mark", name:item.organization_name };
  return { short:"STEM", icon:"spacecraft", tone:"program-mark", name:item.organization_name };
}

export default function ExplorePage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [state, setState] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [nearQuery, setNearQuery] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [radiusMiles, setRadiusMiles] = useState("100");
  const [mapCenter, setMapCenter] = useState({ lat: 39.5, lon: -98.35 });
  const [mapSearching, setMapSearching] = useState(false);
  const [nearFilter, setNearFilter] = useState("All Locations");
  const [locationMessage, setLocationMessage] = useState("");
  const [nearbyResources, setNearbyResources] = useState<NearbyResource[]>([]);
  const [nearbyBusy, setNearbyBusy] = useState(false);
  const [roadmapDone, setRoadmapDone] = useState<number[]>([1]);
  const [matchFilter, setMatchFilter] = useState("All Matches");
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

  useEffect(() => {
    const chosenState = nearQuery.trim() || state;
    if (!chosenState || !states.includes(chosenState)) { setNearbyResources([]); return; }
    setNearbyBusy(true);
    createClient().from("location_directory").select("*").eq("state", chosenState).eq("published", true)
      .order("organization_name").then(({ data }) => {
        const database=(data || []) as NearbyResource[];
        const starter=[...verifiedLocations.filter((item)=>item.state===chosenState),...nationwideDirectories(chosenState)];
        setNearbyResources([...starter,...database.filter((item)=>!starter.some((entry)=>entry.location_name===item.location_name))]);
        setNearbyBusy(false);
      });
  }, [nearQuery, state]);

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
  const visibleMatches = useMemo(() => {
    if (matchFilter === "All Matches") return recommendations;
    const category = matchFilter === "Scholarships" ? "Scholarship" : matchFilter === "Careers" ? "Career Path" : "Opportunity";
    const pool = opportunities.filter((item) => matchCategory(item) === category);
    const relevant = pool.filter((item) => item.interests.some((interest) => selectedInterests.includes(interest)));
    const remaining = pool.filter((item) => !relevant.includes(item));
    return [...relevant, ...remaining].slice(0, userId ? pool.length : 6);
  }, [matchFilter, recommendations, selectedInterests, userId]);

  const mapUrl = useMemo(() => {
    const miles = Number(radiusMiles);
    const latDelta = Math.max(0.18, miles / 69);
    const lonDelta = Math.max(0.25, miles / (69 * Math.max(.35, Math.cos(mapCenter.lat * Math.PI / 180))));
    const bbox = [mapCenter.lon-lonDelta,mapCenter.lat-latDelta,mapCenter.lon+lonDelta,mapCenter.lat+latDelta].join(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${mapCenter.lat}%2C${mapCenter.lon}`;
  }, [mapCenter, radiusMiles]);

  const nearbyVisible = useMemo(() => {
    const categoryMatch=(item:NearbyResource)=>{
      if(nearFilter==="Squadrons") return item.location_type==="squadron" || item.organization_slug==="civil-air-patrol";
      if(nearFilter==="Flight Schools") return item.location_type==="flight_school" || item.organization_slug==="federal-aviation-administration";
      if(nearFilter==="Youth Programs") return item.location_type==="chapter" || item.location_type==="program" || item.organization_slug==="experimental-aircraft-association";
      return true;
    };
    const radius=Number(radiusMiles);
    return nearbyResources.map((item)=>({...item,distance:milesBetween(mapCenter,item)}))
      .filter((item)=>categoryMatch(item) && (item.distance<=radius || !Number.isFinite(item.distance)))
      .sort((a,b)=>a.distance-b.distance);
  },[nearbyResources,mapCenter,radiusMiles,nearFilter]);

  const mapBounds = useMemo(()=>{
    const miles=Number(radiusMiles), latDelta=Math.max(.18,miles/69);
    const lonDelta=Math.max(.25,miles/(69*Math.max(.35,Math.cos(mapCenter.lat*Math.PI/180))));
    return {north:mapCenter.lat+latDelta,south:mapCenter.lat-latDelta,east:mapCenter.lon+lonDelta,west:mapCenter.lon-lonDelta};
  },[mapCenter,radiusMiles]);

  function zoomMap(direction:number){
    const options=[25,50,100,250,500], current=options.indexOf(Number(radiusMiles));
    setRadiusMiles(String(options[Math.max(0,Math.min(options.length-1,current+direction))]));
  }

  function toggleInterest(label: string) {
    setSubmitted(false);
    setSelectedInterests((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    );
  }

  async function searchLocation(event?: FormEvent) {
    event?.preventDefault();
    const query = locationInput.trim() || state;
    if (!query) { setLocationMessage("Enter an address, city, state, or ZIP code."); return; }
    setMapSearching(true);
    setLocationMessage("Finding your location...");
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&countrycodes=us&q=${encodeURIComponent(query)}`);
      const results = await response.json();
      if (!results[0]) throw new Error("No location found");
      const foundState = results[0].address?.state || (states.includes(query) ? query : state);
      setMapCenter({ lat:Number(results[0].lat), lon:Number(results[0].lon) });
      if (foundState && states.includes(foundState)) setNearQuery(foundState);
      setLocationMessage(`Showing verified resources within ${radiusMiles} miles of ${results[0].display_name.split(",").slice(0,2).join(",")}.`);
    } catch {
      setLocationMessage("We could not find that location. Try a city, state, or ZIP code.");
    }
    setMapSearching(false);
  }

  function useLocation() {
    if (!navigator.geolocation) { setLocationMessage("Location is not available in this browser."); return; }
    setLocationMessage("Finding opportunities near you...");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        setMapCenter({ lat:coords.latitude, lon:coords.longitude });
        try {
          const response=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`);
          const result=await response.json();
          const foundState=result.address?.state;
          if(foundState && states.includes(foundState)) setNearQuery(foundState);
          setLocationInput([result.address?.city || result.address?.town || result.address?.village,foundState].filter(Boolean).join(", "));
        } catch {}
        setLocationMessage(`Showing verified resources within ${radiusMiles} miles of your location.`);
      },
      () => setLocationMessage("Enter your city, state, or ZIP code instead."),
    );
  }

  function toggleRoadmap(step: number) {
    setRoadmapDone((current) => current.includes(step) ? current.filter((item) => item !== step) : [...current, step]);
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
            <div className="explore-journey-steps" aria-label="Your Gateway journey">
              <div className="complete"><b>1</b><span>About You</span></div>
              <div className="complete"><b>2</b><span>Your Matches</span></div>
              <div><b>3</b><span>Near You</span></div>
              <div><b>4</b><span>Build Your Plan</span></div>
            </div>
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
              <div className="match-category-tabs" aria-label="Filter personalized matches">
                {["All Matches","Scholarships","Careers","Opportunities"].map((label)=><button type="button" className={matchFilter===label?"active":""} onClick={()=>setMatchFilter(label)} key={label}>{label}<span>{label==="All Matches"?recommendations.length:opportunities.filter(item=>matchCategory(item)===(label==="Scholarships"?"Scholarship":label==="Careers"?"Career Path":"Opportunity")).length}</span></button>)}
              </div>
              <div className="gateway-match-grid editorial-match-grid">
                {visibleMatches.map((item) => {
                  const category=matchCategory(item);
                  const matchedInterests=item.interests.filter((interest)=>selectedInterests.includes(interest));
                  const brand=matchBrand(item.title);
                  return <article className={`gateway-match-card editorial-match-card category-${category.toLowerCase().replace(" ","-")}`} key={item.title}>
                    <div className={`compact-match-icon option-c-brand ${brand ? "official-brand" : "pathway-brand"}`}>{brand ? <img src={brand.src} alt={brand.alt}/> : <Icon name={item.icon}/>}</div>
                    <div className="editorial-match-copy">
                      <small>{category}</small>
                      <h3>{item.title}</h3>
                      <div className="option-c-meta"><span>{matchedInterests[0] || item.interests[0]}</span><span>Ages {age}</span></div>
                      <p>{item.text}</p>
                      <div className="option-c-fit"><Icon name="star"/><span><strong>Strong fit</strong> · {matchedInterests.length ? `You selected ${matchedInterests.join(" and ")}.` : "This adds a useful direction to your Gateway."}</span><Link href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined}>View details →</Link></div>
                    </div>
                    <SaveButton id={`opportunity:${item.title}`} label={item.title} />
                  </article>;
                })}
              </div>
            </div>

            {!userId && <div className="gateway-unlock-strip">
              <div><span>READY FOR THE FULL LIST?</span><h3>Save your matches and keep building your path.</h3></div>
              <Link className="primary-button" href="/account">Create My Account →</Link>
            </div>}

            <section className="explore-nearby">
              <div className="nearby-heading"><div><span>NEAR YOU</span><h2>Opportunities Near You</h2><p>Discover programs, events, mentors, and resources in your area.</p></div><small>{state || "Choose a location"}</small></div>
              <div className="nearby-layout">
                <aside className="nearby-controls">
                  <form className="nearby-search-form" onSubmit={searchLocation}>
                    <label><Icon name="search"/><input aria-label="Address, city, state, or ZIP code" value={locationInput} onChange={(event)=>setLocationInput(event.target.value)} placeholder="City, state, or ZIP code"/></label>
                    <label className="nearby-radius"><span>Search radius</span><select aria-label="Search radius" value={radiusMiles} onChange={(event)=>setRadiusMiles(event.target.value)}><option value="25">25 miles</option><option value="50">50 miles</option><option value="100">100 miles</option><option value="250">250 miles</option><option value="500">500 miles</option></select></label>
                    <button type="submit" disabled={mapSearching}>{mapSearching ? "Searching..." : "Search Area"}</button>
                  </form>
                  <button type="button" className="nearby-location-button" onClick={useLocation}><Icon name="path"/> Use My Location</button>
                  <strong>Filter by</strong>
                  <div className="nearby-filters">{[["map","All Locations"],["people","Squadrons"],["airplane","Flight Schools"],["spacecraft","Youth Programs"]].map(([icon,label])=><button type="button" className={nearFilter===label?"active":""} onClick={()=>setNearFilter(label)} key={label}><Icon name={icon}/>{label}</button>)}</div>
                  <p className="nearby-location-message" role="status">{locationMessage || (nearQuery || state ? `Showing exact verified locations plus official statewide directories for ${nearQuery || state}.` : "Choose a state to find verified local resources.")}</p>
                </aside>
                <div className="gateway-map live-location-map">
                  <iframe title={`Opportunities map for ${locationInput || nearQuery || state || "the United States"}`} src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>
                  <div className="directory-map-pins" aria-hidden="true">{nearbyVisible.filter((item)=>Number.isFinite(item.distance) && item.latitude!=null && item.longitude!=null).map((item,index)=>{
                    const left=(item.longitude!-mapBounds.west)/(mapBounds.east-mapBounds.west)*100;
                    const top=(mapBounds.north-item.latitude!)/(mapBounds.north-mapBounds.south)*100;
                    if(left<0||left>100||top<0||top>100) return null;
                    return <span className={`directory-map-pin pin-${item.location_type}`} style={{left:`${left}%`,top:`${top}%`}} title={item.location_name} key={item.id}><b>{index+1}</b></span>;
                  })}</div>
                  <div className="map-zoom directory-map-zoom"><button type="button" aria-label="Zoom in" onClick={()=>zoomMap(-1)}>+</button><button type="button" aria-label="Zoom out" onClick={()=>zoomMap(1)}>−</button></div>
                  <div className="live-map-badge"><Icon name="path"/><div><strong>{locationInput || nearQuery || state || "United States"}</strong><span>{radiusMiles}-mile search radius</span></div></div>
                  <a className="open-large-map" href={`https://www.openstreetmap.org/?mlat=${mapCenter.lat}&mlon=${mapCenter.lon}#map=9/${mapCenter.lat}/${mapCenter.lon}`} target="_blank" rel="noreferrer">Open larger map ↗</a>
                </div>
                <aside className="nearby-results-panel">
                  <div><strong>{nearbyBusy ? "Searching..." : `${nearbyVisible.length} trusted results`}</strong><span>Exact pins + official finders</span></div>
                  {!nearbyBusy && nearbyVisible.length===0 && <p className="nearby-empty">No verified locations match this radius and filter yet. Increase the distance or choose All Locations.</p>}
                  {nearbyVisible.map((item,index)=>{ const brand=directoryBrand(item); return <article key={item.id}>
                    <div className={`nearby-result-logo ${brand.tone}`}><Icon name={brand.icon}/><strong>{brand.short}</strong></div>
                    <div className="nearby-result-copy"><div className="nearby-result-topline"><small>{item.location_type === "official_finder" ? "STATEWIDE DIRECTORY" : `MAP PIN ${index+1}`}</small><b>{brand.name}</b></div><h3>{item.location_name}</h3><span><Icon name="path"/>{item.city}, {item.state}{Number.isFinite(item.distance)?` · ${item.distance.toFixed(1)} miles`:""}</span><p>{item.description}</p><a href={item.official_url} target="_blank" rel="noreferrer">Open official resource <b>↗</b></a></div>
                  </article>;})}
                  <Link className="nearby-view-all" href="/organizations">View all opportunities</Link>
                </aside>
              </div>
            </section>

            <section className="gateway-roadmap-builder">
              <div className="roadmap-builder-heading"><span>BUILD YOUR PLAN</span><h2>Your Gateway Roadmap</h2><p>Turn your interests into clear, manageable next steps.</p></div>
              <div className="roadmap-builder-layout">
                <div className="roadmap-path">
                  {[ ["search","Explore Your Options","Review programs and opportunities that match your interests."], ["people","Connect With a Community","Find mentors, peers, and organizations that support you."], ["document","Apply for Opportunities","Prepare for programs, events, and scholarships."], ["cap","Build Your Skills","Take courses, train, and earn useful credentials."], ["airplane","Take Flight","Track your progress and achieve your goals."] ].map(([icon,title,text],index)=>{
                    const step=index+1; const done=roadmapDone.includes(step);
                    return <article className={done?"complete":""} key={title}><div className="roadmap-node"><Icon name={icon}/></div><div><h3>{step}. {title}</h3><p>{text}</p><button type="button" onClick={()=>toggleRoadmap(step)}>{done?"✓ Completed":"○ Mark complete"}</button></div></article>;
                  })}
                </div>
                <aside className="roadmap-side-panel">
                  <div className="roadmap-month"><div><Icon name="calendar"/><strong>This Month</strong></div><ul><li>Explore one top match <span>This week</span></li><li>Save a scholarship <span>Next</span></li><li>Connect with a mentor <span>This month</span></li></ul></div>
                  <div className="roadmap-saved"><div><Icon name="heart"/><strong>Saved Opportunities</strong></div>{recommendations.slice(0,3).map(item=><span key={item.title}>{item.title}</span>)}</div>
                  <div className="roadmap-score"><div><span>Roadmap</span><strong>{Math.round(roadmapDone.length/5*100)}%</strong><small>{roadmapDone.length} of 5 steps completed</small></div><b>{Math.round(roadmapDone.length/5*100)}%</b></div>
                </aside>
              </div>
              <Link className="primary-button roadmap-continue" href={userId?"/dashboard":"/account?next=/dashboard"}><Icon name="airplane"/> Continue My Journey</Link>
            </section>
          </section>
        )}
      </section>
    </PageShell>
  );
}
