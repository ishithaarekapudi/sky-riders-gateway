"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

export function AccountActions({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const [signedIn, setSignedIn] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const updateAccountState = async (userId?: string) => {
      setSignedIn(Boolean(userId));
      if (!userId) return setAdmin(false);
      const { data: adminUser } = await supabase.from("admin_users").select("user_id").eq("user_id", userId).maybeSingle();
      setAdmin(Boolean(adminUser));
    };
    supabase.auth.getUser().then(({ data }) => updateAccountState(data.user?.id));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => { void updateAccountState(session?.user?.id); });
    return () => data.subscription.unsubscribe();
  }, []);

  if (signedIn) return <div className={mobile ? "mobile-account-actions signed-in" : "account-actions"}>
    {admin && <Link className={mobile ? "" : "ghost-button"} href="/admin" onClick={onNavigate}>Admin</Link>}
    <Link className="small-button" href="/dashboard" onClick={onNavigate}>My Gateway</Link>
  </div>;

  return <div className={mobile ? "mobile-account-actions" : "account-actions"}>
    <Link href="/account" className={mobile ? "" : "ghost-button"} onClick={onNavigate}>Log In</Link>
    <Link href="/account?mode=signup" className="small-button" onClick={onNavigate}>Sign Up</Link>
  </div>;
}
