import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_NEST_JS ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const body    = await req.json();
    const nestRes = await fetch(`${API}/auth/reset-password`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });

    const data = await nestRes.json();
    return NextResponse.json(data, { status: nestRes.status });
  } catch {
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}