import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { safeNext } from "./lib/auth-navigation";
import type { Database } from "./lib/supabase/database.types";

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0].toLowerCase();
  if ((hostname === "ishitha.us" || hostname === "www.ishitha.us") && request.nextUrl.pathname !== "/about") {
    const destination = request.nextUrl.clone();
    destination.pathname = "/about";
    destination.search = "";
    return NextResponse.redirect(destination, 308);
  }
  // Supabase may send older email links to Site URL instead of the callback.
  // Redirect before browser clients can consume the one-time PKCE code.
  if (request.nextUrl.pathname === "/" && request.nextUrl.searchParams.has("code")) {
    const target = request.nextUrl.clone();
    target.pathname = "/auth/callback";
    target.search = "";
    target.searchParams.set("code", request.nextUrl.searchParams.get("code")!);
    target.searchParams.set("next", safeNext(request.nextUrl.searchParams.get("next")));
    return NextResponse.redirect(target, { headers: { "Cache-Control": "no-store" } });
  }
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
