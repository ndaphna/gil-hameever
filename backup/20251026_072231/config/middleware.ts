import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // For now, we'll handle auth checks client-side
  // This middleware just ensures the routes exist
  
  // Old member-based auth check (kept for backward compatibility)
  if (pathname.startsWith("/members")) {
    const isMember = request.cookies.get("member")?.value === "true";
    if (!isMember) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/members/:path*"],
};
