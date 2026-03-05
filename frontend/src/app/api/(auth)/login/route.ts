import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEST_BASEURL ?? "http://localhost:3000";

// Why a proxy instead of calling NestJS directly from the browser?
//
// The httpOnly cookie is set by NestJS on its domain (:3000).
// If the browser called NestJS directly, the cookie would be scoped
// to localhost:3000 and would never be sent on requests to localhost:3001
// (the Next.js frontend). The middleware would never see it.
//
// By proxying through here (/api/login on :3001), we receive the
// NestJS response server-side and forward its Set-Cookie header
// back to the browser — so the cookie is scoped to :3001 where
// the middleware and all subsequent requests live.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const nestRes = await fetch(`${API}/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });

    const data = await nestRes.json();

    if (!nestRes.ok) {
      // NestJS throws UnauthorizedException with message "Invalid credentials"
      return NextResponse.json(
        { message: data?.message ?? "Identifiants incorrects." },
        { status: nestRes.status }
      );
    }

    // Forward the Set-Cookie header from NestJS to the browser
    const res = NextResponse.json(data, { status: 200 });
    const setCookie = nestRes.headers.get("set-cookie");
    if (setCookie) {
      res.headers.set("set-cookie", setCookie);
    }

    return res;
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur. Veuillez réessayer." },
      { status: 500 }
    );
  }
}