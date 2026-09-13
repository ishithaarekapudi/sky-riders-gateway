export type AccountMode = "login" | "signup" | "forgot" | "update-password";
export const recoveryPath = "/account?mode=update-password";
export function accountMode(value?: string): AccountMode {
  return value === "signup" || value === "forgot" || value === "update-password" ? value : "login";
}

/** Only allow local destinations; reject browser-normalized external redirects. */
export function safeNext(value?: string | null, fallback = "/dashboard"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  let decoded = value;
  try {
    for (let i = 0; i < 3; i++) {
      if (/[\\\u0000-\u001f]/.test(decoded) || decoded.startsWith("//")) return fallback;
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
    const url = new URL(value, "https://gateway.invalid");
    if (url.origin !== "https://gateway.invalid" || url.pathname.startsWith("/auth/")) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch { return fallback; }
}

export function authLinkDestination(search: string, hash: string): string | null {
  const query = new URLSearchParams(search);
  const fragment = new URLSearchParams(hash.replace(/^#/, ""));
  if (query.has("error") || fragment.has("error")) return "/account?mode=forgot&auth_error=invalid_link";
  if (query.has("code")) {
    const callback = new URLSearchParams({ code: query.get("code")!, next: safeNext(query.get("next")) });
    return `/auth/callback?${callback}`;
  }
  if (fragment.has("access_token") && fragment.has("refresh_token")) {
    return `${fragment.get("type") === "recovery" ? recoveryPath : "/account"}${hash}`;
  }
  return null;
}
