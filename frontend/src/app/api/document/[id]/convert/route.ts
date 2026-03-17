import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_NEST_JS ?? "http://localhost:3001";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cookie = req.headers.get("cookie") ?? "";
    const res    = await fetch(`${API}/document/${id}/convert`, {
      method:  "POST",
      headers: { "Content-Type": "application/json", cookie },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}