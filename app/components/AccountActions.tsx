"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

export function AccountActions({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session?.user)));
    return () => data.subscription.unsubscribe();
  }, []);

  if (signedIn) return <div className={mobile ? "mobile-account-actions signed-in" : "account-actions"}>
    <Link className="small-button" href="/dashboard" onClick={onNavigate}>My Gateway</Link>
  </div>;

  return <div className={mobile ? "mobile-account-actions" : "account-actions"}>
    <Link href="/account" className={mobile ? "" : "ghost-button"} onClick={onNavigate}>Log In</Link>
    <Link href="/account?mode=signup" className="small-button" onClick={onNavigate}>Sign Up</Link>
  </div>;
}
