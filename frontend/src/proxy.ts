import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard"];
const COOKIE_NAME        = "access_token";

function isAuthRoute(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password")
  );
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  // No token + trying to reach a protected route → back to login
  if (isProtected && !token) {
    const url = new URL("/", req.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Has token + trying to reach any auth page → straight to dashboard
  if (isAuthRoute(pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo-light\\.png|logo-dark\\.png).*)",
  ],
};