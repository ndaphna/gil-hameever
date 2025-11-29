import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST() {
  const headers = new Headers();
  // Clear the demo cookie
  headers.append(
    "Set-Cookie",
    "member=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
  );
  headers.append("Location", "/");
  return new NextResponse(null, { status: 302, headers });
}


