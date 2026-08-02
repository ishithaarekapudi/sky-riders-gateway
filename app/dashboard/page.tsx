"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { slugify } from "../content";
import { Icon, PageShell } from "../ui";
import { ScholarshipTracker } from "../components/ScholarshipTracker";

type SavedItem = { item_id: string; item_label: string; created_at: string };
type Profile = { display_name: string | null; age_range: string; state: string; interests: string[] };

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [accountName, setAccountName] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user;
      if (!user) { setLoading(false); return; }
      setSignedIn(true);
      setEmail(user.email || "");
      setAccountName(String(user.user_metadata?.display_name || user.user_metadata?.full_name || ""));
      const [profileResult, savesResult] = await Promise.all([
        supabase.from("explore_profiles").select("display_name,age_range,state,interests").eq("user_id", user.id).maybeSingle(),
        supabase.from("saved_items").select("item_id,item_label,created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      setProfile(profileResult.data as Profile | null);
      setSaved((savesResult.data || []) as SavedItem[]);
      setLoading(false);
    });
  }, []);

  const applicationProgress = useMemo(() => saved.filter((item) => item.item_id.startsWith("application:")), [saved]);
  const savedItems = useMemo(() => saved.filter((item) => !item.item_id.startsWith("application:")), [saved]);
  const scholarshipSaves = useMemo(() => savedItems.filter((item) => item.item_id.startsWith("scholarship:")), [savedItems]);
  const organizationSaves = useMemo(() => savedItems.filter((item) => item.item_id.startsWith("organization:")), [savedItems]);
  const opportunitySaves = useMemo(() => savedItems.filter((item) => item.item_id.startsWith("opportunity:") || item.item_id.startsWith("career:")), [savedItems]);
  const firstName = (profile?.display_name || accountName).trim().split(/\s+/)[0];

  function savedHref(itemId: string) {
    const [type, ...rest] = itemId.split(":");
    const slug = slugify(rest.join(":"));
    if (type === "scholarship" && slug) return `/scholarships/${slug}`;
    if (type === "career" && slug) return `/careers/${slug}`;
    if (type === "organization" && slug) return `/organizations/${slug}`;
    return "/explore";
  }

  async function signOut() {
    await createClient().auth.signOut();
    window.location.assign("/");
  }

  return <PageShell active="dashboard">
    <section className="personal-dashboard">
      {loading ? <div className="dashboard-state"><span>Preparing your Gateway...</span></div> : !signedIn ? <div className="dashboard-state">
        <span className="eyebrow">YOUR PERSONAL GATEWAY</span>
        <h1>Log in to see your dashboard.</h1>
        <p>Your saved scholarships, opportunities, organizations, and Explore profile will appear here.</p>
        <Link className="primary-button" href="/account?next=/dashboard">Log In or Sign Up →</Link>
      </div> : <>
        <div className="dashboard-navy-panel">
          <div className="dashboard-title-row">
            <div><span>MY GATEWAY</span><h1>{firstName ? `Welcome back, ${firstName}!` : "Welcome to your Gateway."}</h1><p>Your aviation and aerospace opportunities, organized into one clear path.</p></div>
            <div className="dashboard-profile-actions"><Link href="/explore">Edit My Answers</Link><button onClick={signOut}>Sign Out</button></div>
          </div>
          <div className="dashboard-stat-grid">
            <article><Icon name="search"/><span>Saved matches</span><strong>{savedItems.length}</strong><small>Across your Gateway</small></article>
            <article><Icon name="cap"/><span>Scholarships</span><strong>{scholarshipSaves.length}</strong><small>Funding to review</small></article>
            <article><Icon name="globe"/><span>Organizations</span><strong>{organizationSaves.length}</strong><small>Communities saved</small></article>
            <article><Icon name="path"/><span>Opportunities</span><strong>{opportunitySaves.length}</strong><small>Possible next steps</small></article>
          </div>
        </div>

        <section className="dashboard-guided-start">
          <div><span>YOUR SCHOLARSHIP FINDER</span><h2>Funding should be easier to find and understand.</h2><p>Use your interests to discover scholarships, save the strongest options, and track what you need before applying.</p><Link className="primary-button" href="/scholarships">Find Scholarships →</Link></div>
          <ol>
            <li><b>1</b><div><strong>Build your profile</strong><span>{profile ? `${profile.age_range} · ${profile.state}` : "Tell Gateway about your goals."}</span></div></li>
            <li><b>2</b><div><strong>Review your matches</strong><span>{profile?.interests?.length ? profile.interests.join(" · ") : "Choose the pathways that interest you."}</span></div></li>
            <li><b>3</b><div><strong>Save and prepare</strong><span>Track eligibility, deadlines, and application materials.</span></div></li>
          </ol>
        </section>

        <section className="dashboard-application-section">
          <div className="dashboard-section-heading"><div><span>APPLICATION PROGRESS</span><h2>Keep every scholarship moving.</h2></div><Link href="/scholarships">Find scholarships →</Link></div>
          {applicationProgress.length ? <div className="dashboard-application-list">{applicationProgress.map(item=>{
            const title=item.item_id.replace(/^application:/,"");
            return <ScholarshipTracker key={item.item_id} title={title} compact/>;
          })}</div> : <div className="dashboard-empty-saves"><Icon name="document"/><div><h3>No applications started yet.</h3><p>Open a scholarship and choose Preparing when you are ready to begin.</p></div><Link href="/scholarships">Browse Scholarships →</Link></div>}
        </section>

        <section className="dashboard-saved-section">
          <div className="dashboard-section-heading"><div><span>SAVED FOR LATER</span><h2>Your saved opportunities</h2></div><Link href="/scholarships">Browse more →</Link></div>
          {savedItems.length ? <div className="dashboard-saved-grid">{savedItems.slice(0,8).map((item) => {
            const type = item.item_id.split(":")[0];
            return <Link key={item.item_id} href={savedHref(item.item_id)} aria-label={`Open ${item.item_label}`} style={{ display: "block", color: "inherit" }}>
              <article><div className="dashboard-saved-icon"><Icon name={type === "scholarship" ? "cap" : type === "organization" ? "globe" : "path"}/></div><small>{type}</small><h3>{item.item_label}</h3><span>Open saved item →</span></article>
            </Link>;
          })}</div> : <div className="dashboard-empty-saves"><Icon name="heart"/><div><h3>Your saved list is ready.</h3><p>Tap the heart on any scholarship, career, organization, or opportunity to keep it here.</p></div><Link href="/scholarships">Explore Scholarships →</Link></div>}
        </section>

        <section className="dashboard-progress-panel">
          <div className="dashboard-progress-score"><strong>{profile ? "75%" : "25%"}</strong><span>Gateway profile strength</span></div>
          <div><span>YOUR NEXT STEPS</span><h2>Keep your journey moving.</h2><ul><li className={profile ? "complete" : ""}>Complete your Explore profile</li><li className={scholarshipSaves.length ? "complete" : ""}>Save a scholarship</li><li className={organizationSaves.length ? "complete" : ""}>Connect with an organization</li><li>Prepare your first application</li></ul></div>
          <Link className="small-button" href="/explore">Continue My Gateway →</Link>
        </section>
        <small className="dashboard-email">Signed in as {email}</small>
      </>}
    </section>
  </PageShell>;
}
