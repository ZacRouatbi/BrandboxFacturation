import { NextRequest, NextResponse } from "next/server";

// Runs on the Edge before any page renders.
// Reads the httpOnly cookie — JS on the client can never touch it,
// but the middleware can because it runs server-side.
//
// The cookie name "access_token" matches exactly what NestJS sets:
//   res.cookie('access_token', token, { httpOnly: true, ... })
//
// The guard re-signs a fresh cookie on every authenticated request
// (sliding expiry), so the 15min timer resets on activity automatically.
// The middleware just checks presence — NestJS validates the signature.

const PROTECTED_PREFIXES = ["/dashboard"];
const PUBLIC_ROUTES       = ["/"];
const COOKIE_NAME         = "access_token";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isPublic    = PUBLIC_ROUTES.includes(pathname);

  // No token + trying to reach a protected route → back to login
  if (isProtected && !token) {
    const url = new URL("/", req.url);
    url.searchParams.set("from", pathname); // preserve intended destination
    return NextResponse.redirect(url);
  }

  // Has token + trying to reach login → straight to dashboard
  if (isPublic && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next.js internals and static public files
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo-light\\.png|logo-dark\\.png).*)",
  ],
};