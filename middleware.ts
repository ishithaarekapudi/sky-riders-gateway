import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0].toLowerCase();
  if ((hostname === "ishitha.us" || hostname === "www.ishitha.us") && request.nextUrl.pathname !== "/about") {
    const destination = request.nextUrl.clone();
    destination.pathname = "/about";
    destination.search = "";
    return NextResponse.redirect(destination, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
