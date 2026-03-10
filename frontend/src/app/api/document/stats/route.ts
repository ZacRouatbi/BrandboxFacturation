import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(`${process.env.NEST_BASEURL}/document/stats`, {
    cache: "no-store",
  });
  const data = await res.json();
  return NextResponse.json(data);
}