import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Old member-based auth check (kept for backward compatibility)
  if (pathname.startsWith("/members")) {
    const isMember = request.cookies.get("member")?.value === "true";
    if (!isMember) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Note: Supabase auth is handled client-side for better performance
  // The client-side code in dashboard/page.tsx handles authentication checks
  // This avoids blocking requests and allows for better user experience
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/members/:path*"],
};
