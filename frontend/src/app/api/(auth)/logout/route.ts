import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_NEST_JS ?? "http://localhost:3000";

// Two things happen here:
// 1. We call NestJS POST /auth/logout, forwarding the cookie header
//    so NestJS can do its own clearCookie() on its domain.
// 2. We explicitly expire the cookie on the Next.js domain (:3001)
//    so the browser removes it immediately — regardless of whether
//    the NestJS call succeeds or fails.
//
// The "even if NestJS fails, clear locally" approach means the user
// is always logged out from the frontend, which is the safe default.

export async function POST(req: NextRequest) {
  try {
    await fetch(`${API}/auth/logout`, {
      method:  "POST",
      headers: {
        // Forward the cookie so NestJS clearCookie targets the right session
        cookie: req.headers.get("cookie") ?? "",
      },
    });
  } catch {
    // Intentionally silent — we clear locally regardless
  }

  const res = NextResponse.json({ message: "Déconnexion réussie." });

  // Expire the cookie on the Next.js domain
  res.cookies.set("access_token", "", {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:   0,
    path:     "/",
  });

  return res;
}