"use client";

import { FormEvent, useState } from "react";

function PreviewNotice() {
  return <p className="form-preview-notice"><strong>Preview mode:</strong> Your form is ready, but it will begin securely storing submissions after the Gateway database is connected.</p>;
}

export function OpportunitySubmissionForm() {
  const [kind, setKind] = useState("Organization");
  const [complete, setComplete] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setComplete(true);
  }

  if (complete) return <div className="form-success" role="status">
    <span>SUBMISSION PREPARED</span>
    <h2>Thank you for helping Gateway grow.</h2>
    <p>This preview confirms that the form works. Once the database is connected, submissions will enter a private review queue before anything is published.</p>
    <button type="button" className="small-button" onClick={() => setComplete(false)}>Submit Another Opportunity</button>
  </div>;

  return <form className="community-form" onSubmit={submit}>
    <PreviewNotice />
    <div className="community-form-grid">
      <label><span>What are you submitting?</span><select value={kind} onChange={event => setKind(event.target.value)}>
        <option>Organization</option><option>Scholarship</option><option>Program or Event</option><option>Career Resource</option><option>Other Opportunity</option>
      </select></label>
      <label><span>{kind} name</span><input required placeholder={`Official ${kind.toLowerCase()} name`} /></label>
      <label className="full"><span>Official website</span><input required type="url" placeholder="https://" /></label>
      <label className="full"><span>What does it offer?</span><textarea required placeholder="Describe the opportunity, who it serves, and why it would help the Gateway community." /></label>
      <label><span>Eligible ages</span><input placeholder="Example: ages 13–18, college, or all ages" /></label>
      <label><span>Location</span><input placeholder="City, state, nationwide, or virtual" /></label>
      <label><span>Deadline or availability</span><input placeholder="Date, annual cycle, or year-round" /></label>
      <label><span>Cost or award amount</span><input placeholder="Free, varies, or award amount" /></label>
      <label><span>Your name</span><input required /></label>
      <label><span>Your email</span><input required type="email" /></label>
      <label className="full"><span>Your connection to this opportunity</span><input required placeholder="Organizer, participant, educator, community member, or other" /></label>
      <label className="full consent-check"><input required type="checkbox" /><span>I confirm that this information is accurate to the best of my knowledge and may be reviewed by Sky Riders Gateway.</span></label>
    </div>
    <button className="primary-button" type="submit">Send for Review →</button>
  </form>;
}

const mentorAreas = ["Piloting", "Aerospace Engineering", "Aircraft Maintenance", "Space", "Drones", "Air Traffic Control", "Meteorology", "Aviation Business", "Scholarships", "Still Exploring"];

export function MentorshipApplicationForms() {
  const [role, setRole] = useState<"mentor" | "mentee">("mentee");
  const [complete, setComplete] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setComplete(true);
  }

  function changeRole(next: "mentor" | "mentee") {
    setRole(next);
    setComplete(false);
  }

  return <div className="mentorship-application">
    <div className="mentor-role-switch" role="tablist" aria-label="Choose an application">
      <button type="button" role="tab" aria-selected={role === "mentee"} className={role === "mentee" ? "active" : ""} onClick={() => changeRole("mentee")}>Find a Mentor</button>
      <button type="button" role="tab" aria-selected={role === "mentor"} className={role === "mentor" ? "active" : ""} onClick={() => changeRole("mentor")}>Become a Mentor</button>
    </div>
    {complete ? <div className="form-success" role="status">
      <span>APPLICATION PREPARED</span>
      <h2>Thank you for joining the Gateway mentorship community.</h2>
      <p>Once secure submissions are activated, every application will be reviewed before a match is suggested. No profiles will be publicly searchable.</p>
      <button type="button" className="small-button" onClick={() => setComplete(false)}>Review the Form</button>
    </div> : <form className="community-form" onSubmit={submit}>
      <PreviewNotice />
      <div className="community-form-heading">
        <span>{role === "mentor" ? "SHARE YOUR EXPERIENCE" : "BUILD YOUR SUPPORT SYSTEM"}</span>
        <h2>{role === "mentor" ? "Mentor Application" : "Mentee Application"}</h2>
        <p>{role === "mentor" ? "Tell us where your experience could help someone take a confident next step." : "Tell us what you want to explore and what kind of guidance would help."}</p>
      </div>
      <div className="community-form-grid">
        <label><span>First name</span><input required /></label>
        <label><span>Last name</span><input required /></label>
        <label><span>Email</span><input required type="email" /></label>
        <label><span>Age range</span><select required defaultValue="">
          <option value="" disabled>Select one</option>
          {role === "mentee" && <><option>Under 13, parent or guardian completing form</option><option>13–15</option><option>16–17</option></>}
          <option>18–24</option><option>25–39</option><option>40+</option>
        </select></label>
        <label><span>City and state</span><input required placeholder="Virtual matches are available" /></label>
        <label><span>Preferred meeting format</span><select><option>Virtual</option><option>In person through an approved organization</option><option>Either</option></select></label>
        <fieldset className="full mentor-interest-field"><legend>{role === "mentor" ? "Areas you can mentor in" : "Areas you want to explore"}</legend>
          <div>{mentorAreas.map(area => <label key={area}><input type="checkbox" /><span>{area}</span></label>)}</div>
        </fieldset>
        {role === "mentor" ? <>
          <label className="full"><span>Current role and organization</span><input required /></label>
          <label className="full"><span>Experience and qualifications</span><textarea required placeholder="Share relevant professional, education, volunteer, certification, and mentoring experience." /></label>
          <label><span>Preferred mentee age group</span><select><option>18 and older only</option><option>High school with guardian included</option><option>Any approved age group</option></select></label>
          <label><span>Availability</span><input required placeholder="Example: one hour twice a month" /></label>
          <label className="full consent-check"><input required type="checkbox" /><span>I understand that mentor approval may require identity verification, references, training, and an appropriate background check.</span></label>
        </> : <>
          <label className="full"><span>What would you like help with?</span><textarea required placeholder="Tell us about your goals, questions, and what a helpful mentor could help you understand or do next." /></label>
          <label><span>Current school or career stage</span><input required /></label>
          <label><span>Meeting availability</span><input required placeholder="Days, times, and time zone" /></label>
          <label className="full"><span>Parent or guardian email, required for minors</span><input type="email" /></label>
        </>}
        <label className="full consent-check"><input required type="checkbox" /><span>I agree to the Gateway mentorship code of conduct and understand that matches are reviewed and facilitated by an approved coordinator.</span></label>
      </div>
      <button className="primary-button" type="submit">{role === "mentor" ? "Apply to Mentor" : "Request a Mentor"} →</button>
    </form>}
  </div>;
}
