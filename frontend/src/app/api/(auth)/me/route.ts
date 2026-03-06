import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEST_BASEURL ?? "http://localhost:3000";

// Proxies GET /auth/me to NestJS server-side.
// The browser never calls NestJS directly — no CORS issue.
// The cookie is forwarded in the request headers so NestJS
// JwtAuthGuard can validate it and return req.user.
// The fresh cookie NestJS re-signs is forwarded back to the
// browser so the sliding expiry keeps working.

export async function GET(req: NextRequest) {
  try {
    const nestRes = await fetch(`${API}/auth/me`, {
      method:  "GET",
      headers: {
        // Forward the cookie so JwtAuthGuard can read access_token
        cookie: req.headers.get("cookie") ?? "",
      },
    });

    if (!nestRes.ok) {
      return NextResponse.json(
        { message: "Non autorisé." },
        { status: nestRes.status }
      );
    }

    const data = await nestRes.json();
    const res  = NextResponse.json(data, { status: 200 });

    // Forward the refreshed cookie NestJS re-signs on every request
    const setCookie = nestRes.headers.get("set-cookie");
    if (setCookie) {
      res.headers.set("set-cookie", setCookie);
    }

    return res;
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur." },
      { status: 500 }
    );
  }
}