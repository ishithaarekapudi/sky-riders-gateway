"use client";
import { useEffect } from "react";
import { authLinkDestination } from "../../lib/auth-navigation";

/** Recover older email links that fell back to the site's home URL. */
export function AuthLandingRedirect() {
  useEffect(() => {
    const destination = authLinkDestination(window.location.search, window.location.hash);
    if (destination) window.location.replace(destination);
  }, []);
  return null;
}
