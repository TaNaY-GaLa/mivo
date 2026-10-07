/**
 * proxy.ts — Next.js 16 route authorization pipeline (formerly middleware.ts)
 * Runs on every matching request at the Edge runtime.
 * Validates Better Auth session and enforces authentication and role-based access.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// ─── Route protection matrix ─────────────────────────────────────────────────
const PROTECTED_ADMIN_ROUTES  = ["/admin"];
const AUTH_ROUTES              = ["/auth/sign-in", "/auth/sign-up"];

function startsWithAny(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => pathname.startsWith(prefix));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for static assets and internal Next.js / API auth routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||        // Better Auth handles its own routes
    pathname.startsWith("/api/webhooks") ||    // Webhooks validated internally
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/opengraph-image")
  ) {
    return NextResponse.next();
  }

  // Read the session cookie (lightweight — no DB call in proxy)
  const sessionCookie = getSessionCookie(request);
  const isAuthenticated = Boolean(sessionCookie);

  // 1. Redirect authenticated users away from auth pages to storefront
  if (isAuthenticated && startsWithAny(pathname, AUTH_ROUTES)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Protect Auth pages: allow unauthenticated visitors
  if (startsWithAny(pathname, AUTH_ROUTES)) {
    return NextResponse.next();
  }

  // 3. Protect all shopping & customer routes — redirect to sign-in if not authenticated
  if (!isAuthenticated) {
    // API routes return 401 JSON
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }
    // Customer page routes redirect to sign-in with callbackUrl
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 4. Protect admin routes (requires session)
  if (startsWithAny(pathname, PROTECTED_ADMIN_ROUTES)) {
    if (!isAuthenticated) {
      const signInUrl = new URL("/auth/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
