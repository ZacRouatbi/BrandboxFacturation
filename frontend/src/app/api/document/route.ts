import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEST_BASEURL ?? "http://localhost:3001";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const qs = searchParams.toString();
    const cookie = req.headers.get("cookie") ?? "";

    const res = await fetch(`${API}/document${qs ? `?${qs}` : ""}`, {
      headers: { cookie },
    });

    const text = await res.text();           // ← read as text first
  
    const data = JSON.parse(text);           // ← then parse
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("Proxy error:", e);        // ← log the real error
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const cookie = req.headers.get("cookie") ?? "";

    const res = await fetch(`${API}/document`, {
      method:  "POST",
      headers: { "Content-Type": "application/json", cookie },
      body:    JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}