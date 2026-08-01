"use client";

import { FormEvent, useState } from "react";
import { createClient } from "../../lib/supabase/client";

const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

function ConnectionNotice() {
  return configured
    ? <p className="form-connection-notice"><strong>Private submission:</strong> Your information goes to Gateway's review queue and is not displayed publicly.</p>
    : <p className="form-preview-notice"><strong>Setup incomplete:</strong> The form cannot save until the Gateway database tables are created.</p>;
}

export function OpportunitySubmissionForm() {
  const [kind, setKind] = useState("Organization");
  const [complete, setComplete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) { setError("The database connection is not active yet."); return; }
    setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    const { error: submitError } = await createClient().from("opportunity_submissions").insert({
      submission_type: kind,
      name: String(form.get("name") || ""),
      official_url: String(form.get("official_url") || ""),
      description: String(form.get("description") || ""),
      eligible_ages: String(form.get("eligible_ages") || "") || null,
      location: String(form.get("location") || "") || null,
      deadline_or_availability: String(form.get("deadline_or_availability") || "") || null,
      cost_or_award: String(form.get("cost_or_award") || "") || null,
      submitter_name: String(form.get("submitter_name") || ""),
      submitter_email: String(form.get("submitter_email") || ""),
      submitter_connection: String(form.get("submitter_connection") || ""),
    });
    setBusy(false);
    if (submitError) { setError("We could not save this submission. Please try again after the database setup is completed."); return; }
    setComplete(true);
  }

  if (complete) return <div className="form-success" role="status">
    <span>SUBMISSION RECEIVED</span>
    <h2>Thank you for helping Gateway grow.</h2>
    <p>Your recommendation is now in Gateway's private review queue. It will be verified before anything is published.</p>
    <button type="button" className="small-button" onClick={() => setComplete(false)}>Submit Another Opportunity</button>
  </div>;

  return <form className="community-form" onSubmit={submit}>
    <ConnectionNotice />
    <div className="community-form-grid">
      <label><span>What are you submitting?</span><select value={kind} onChange={event => setKind(event.target.value)}>
        <option>Organization</option><option>Scholarship</option><option>Program or Event</option><option>Career Resource</option><option>Other Opportunity</option>
      </select></label>
      <label><span>{kind} name</span><input name="name" required placeholder={`Official ${kind.toLowerCase()} name`} /></label>
      <label className="full"><span>Official website</span><input name="official_url" required type="url" placeholder="https://" /></label>
      <label className="full"><span>What does it offer?</span><textarea name="description" required placeholder="Describe the opportunity, who it serves, and why it would help the Gateway community." /></label>
      <label><span>Eligible ages</span><input name="eligible_ages" placeholder="Example: ages 13–18, college, or all ages" /></label>
      <label><span>Location</span><input name="location" placeholder="City, state, nationwide, or virtual" /></label>
      <label><span>Deadline or availability</span><input name="deadline_or_availability" placeholder="Date, annual cycle, or year-round" /></label>
      <label><span>Cost or award amount</span><input name="cost_or_award" placeholder="Free, varies, or award amount" /></label>
      <label><span>Your name</span><input name="submitter_name" required /></label>
      <label><span>Your email</span><input name="submitter_email" required type="email" /></label>
      <label className="full"><span>Your connection to this opportunity</span><input name="submitter_connection" required placeholder="Organizer, participant, educator, community member, or other" /></label>
      <label className="full consent-check"><input required type="checkbox" /><span>I confirm that this information is accurate to the best of my knowledge and may be reviewed by Sky Riders Gateway.</span></label>
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="primary-button" type="submit" disabled={busy || !configured}>{busy ? "Sending..." : "Send for Review →"}</button>
  </form>;
}

const mentorAreas = ["Piloting", "Aerospace Engineering", "Aircraft Maintenance", "Space", "Drones", "Air Traffic Control", "Meteorology", "Aviation Business", "Scholarships", "Still Exploring"];

export function MentorshipApplicationForms() {
  const [role, setRole] = useState<"mentor" | "mentee">("mentee");
  const [complete, setComplete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ageRange, setAgeRange] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) { setError("The database connection is not active yet."); return; }
    const form = new FormData(event.currentTarget);
    const areas = form.getAll("interest_areas").map(String);
    if (!areas.length) { setError("Please choose at least one interest area."); return; }
    setBusy(true); setError("");
    const common = {
      first_name: String(form.get("first_name") || ""), last_name: String(form.get("last_name") || ""),
      email: String(form.get("email") || ""), age_range: ageRange,
      city_state: String(form.get("city_state") || ""), meeting_format: String(form.get("meeting_format") || ""),
      interest_areas: areas, availability: String(form.get("availability") || ""), conduct_consent: form.get("conduct_consent") === "on",
    };
    const result = role === "mentor"
      ? await createClient().from("mentor_applications").insert({ ...common,
          current_role_organization: String(form.get("current_role_organization") || ""),
          experience_qualifications: String(form.get("experience_qualifications") || ""),
          preferred_mentee_age: String(form.get("preferred_mentee_age") || ""),
          screening_consent: form.get("screening_consent") === "on",
        })
      : await createClient().from("mentee_applications").insert({ ...common,
          guidance_requested: String(form.get("guidance_requested") || ""), current_stage: String(form.get("current_stage") || ""),
          guardian_email: String(form.get("guardian_email") || "") || null,
        });
    setBusy(false);
    if (result.error) { setError("We could not save this application. Check the required fields or complete the database setup, then try again."); return; }
    setComplete(true);
  }

  function changeRole(next: "mentor" | "mentee") {
    setRole(next);
    setComplete(false);
    setError("");
    setAgeRange("");
  }

  return <div className="mentorship-application">
    <div className="mentor-role-switch" role="tablist" aria-label="Choose an application">
      <button type="button" role="tab" aria-selected={role === "mentee"} className={role === "mentee" ? "active" : ""} onClick={() => changeRole("mentee")}>Find a Mentor</button>
      <button type="button" role="tab" aria-selected={role === "mentor"} className={role === "mentor" ? "active" : ""} onClick={() => changeRole("mentor")}>Become a Mentor</button>
    </div>
    {complete ? <div className="form-success" role="status">
      <span>APPLICATION RECEIVED</span>
      <h2>Thank you for joining the Gateway mentorship community.</h2>
      <p>Your application is securely stored for review. Gateway will contact you before suggesting a match, and no profile will be publicly searchable.</p>
      <button type="button" className="small-button" onClick={() => setComplete(false)}>Review the Form</button>
    </div> : <form className="community-form" onSubmit={submit}>
      <ConnectionNotice />
      <div className="community-form-heading">
        <span>{role === "mentor" ? "SHARE YOUR EXPERIENCE" : "BUILD YOUR SUPPORT SYSTEM"}</span>
        <h2>{role === "mentor" ? "Mentor Application" : "Mentee Application"}</h2>
        <p>{role === "mentor" ? "Tell us where your experience could help someone take a confident next step." : "Tell us what you want to explore and what kind of guidance would help."}</p>
      </div>
      <div className="community-form-grid">
        <label><span>First name</span><input name="first_name" required /></label>
        <label><span>Last name</span><input name="last_name" required /></label>
        <label><span>Email</span><input name="email" required type="email" /></label>
        <label><span>Age range</span><select name="age_range" required value={ageRange} onChange={event => setAgeRange(event.target.value)}>
          <option value="" disabled>Select one</option>
          {role === "mentee" && <><option>Under 13, parent or guardian completing form</option><option>13–15</option><option>16–17</option></>}
          <option>18–24</option><option>25–39</option><option>40+</option>
        </select></label>
        <label><span>City and state</span><input name="city_state" required placeholder="Virtual matches are available" /></label>
        <label><span>Preferred meeting format</span><select name="meeting_format"><option>Virtual</option><option>In person through an approved organization</option><option>Either</option></select></label>
        <fieldset className="full mentor-interest-field"><legend>{role === "mentor" ? "Areas you can mentor in" : "Areas you want to explore"}</legend>
          <div>{mentorAreas.map(area => <label key={area}><input name="interest_areas" value={area} type="checkbox" /><span>{area}</span></label>)}</div>
        </fieldset>
        {role === "mentor" ? <>
          <label className="full"><span>Current role and organization</span><input name="current_role_organization" required /></label>
          <label className="full"><span>Experience and qualifications</span><textarea name="experience_qualifications" required placeholder="Share relevant professional, education, volunteer, certification, and mentoring experience." /></label>
          <label><span>Preferred mentee age group</span><select name="preferred_mentee_age"><option>18 and older only</option><option>High school with guardian included</option><option>Any approved age group</option></select></label>
          <label><span>Availability</span><input name="availability" required placeholder="Example: one hour twice a month" /></label>
          <label className="full consent-check"><input name="screening_consent" required type="checkbox" /><span>I understand that mentor approval may require identity verification, references, training, and an appropriate background check.</span></label>
        </> : <>
          <label className="full"><span>What would you like help with?</span><textarea name="guidance_requested" required placeholder="Tell us about your goals, questions, and what a helpful mentor could help you understand or do next." /></label>
          <label><span>Current school or career stage</span><input name="current_stage" required /></label>
          <label><span>Meeting availability</span><input name="availability" required placeholder="Days, times, and time zone" /></label>
          <label className="full"><span>Parent or guardian email, required for minors</span><input name="guardian_email" required={ageRange === "Under 13, parent or guardian completing form" || ageRange === "13–15" || ageRange === "16–17"} type="email" /></label>
        </>}
        <label className="full consent-check"><input name="conduct_consent" required type="checkbox" /><span>I agree to the Gateway mentorship code of conduct and understand that matches are reviewed and facilitated by an approved coordinator.</span></label>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary-button" type="submit" disabled={busy || !configured}>{busy ? "Sending..." : role === "mentor" ? "Apply to Mentor →" : "Request a Mentor →"}</button>
    </form>}
  </div>;
}
