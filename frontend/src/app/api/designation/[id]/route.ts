import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_NEST_JS ?? "http://localhost:3000";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body   = await req.json();
    const cookie = req.headers.get("cookie") ?? "";
    const res    = await fetch(`${API}/designation/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json", cookie },
      body:    JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cookie = req.headers.get("cookie") ?? "";
    const res    = await fetch(`${API}/designation/${id}`, {
      method:  "DELETE",
      headers: { cookie },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}