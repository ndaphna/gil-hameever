import { NextResponse } from "next/server";

export async function POST() {
  const headers = new Headers();
  // Set a very simple demo cookie indicating membership
  headers.append(
    "Set-Cookie",
    `member=true; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24}`
  );
  headers.append("Location", "/members");
  return new NextResponse(null, { status: 302, headers });
}


