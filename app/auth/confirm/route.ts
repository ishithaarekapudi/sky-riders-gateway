import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { recoveryPath, safeNext } from "../../../lib/auth-navigation";

const allowedTypes = new Set(["signup", "invite", "magiclink", "recovery", "email_change", "email"]);
export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = type === "recovery" ? recoveryPath : safeNext(url.searchParams.get("next"));
  if (tokenHash && type && allowedTypes.has(type)) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as EmailOtpType });
      if (!error && data.session) return NextResponse.redirect(new URL(next, url.origin), { headers: { "Cache-Control": "no-store" } });
    } catch { /* Offer a fresh link instead of leaving the user on an error page. */ }
  }
  const target = new URL("/account", url.origin);
  target.searchParams.set("auth_error", "invalid_link");
  if (type === "recovery") target.searchParams.set("mode", "forgot");
  return NextResponse.redirect(target, { headers: { "Cache-Control": "no-store" } });
}
