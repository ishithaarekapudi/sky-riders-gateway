import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { recoveryPath, safeNext } from "../../../lib/auth-navigation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = safeNext(url.searchParams.get("next"));
  const failed = () => {
    const target = new URL("/account", url.origin);
    target.searchParams.set("auth_error", "invalid_link");
    if (next === recoveryPath) target.searchParams.set("mode", "forgot");
    return NextResponse.redirect(target, { headers: { "Cache-Control": "no-store" } });
  };
  const code = url.searchParams.get("code");
  if (!code || url.searchParams.has("error")) return failed();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.session) return failed();
    const destination = ("redirectType" in data && data.redirectType === "recovery") ? recoveryPath : next;
    return NextResponse.redirect(new URL(destination, url.origin), { headers: { "Cache-Control": "no-store" } });
  } catch { return failed(); }
}
