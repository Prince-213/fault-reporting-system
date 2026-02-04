import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "faultee_session";

export function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  // Define protected routes
  const isProtectedRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/super-admin");

  if (isProtectedRoute && !session) {
    // Redirect to login if trying to access protected route without session
    const loginUrl = new URL("/login", request.url);
    // Optional: add a redirect parameter to return after login
    // loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and trying to access login page, redirect to admin
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
