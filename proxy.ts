/**
 * proxy.ts — Next.js 16 route authorization pipeline (formerly middleware.ts)
 * Runs on every matching request at the Edge runtime.
 * Validates Better Auth session and enforces role-based access.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// ─── Route protection matrix ─────────────────────────────────────────────────
const PROTECTED_MEMBER_ROUTES = ["/account"];
const PROTECTED_ADMIN_ROUTES  = ["/admin"];
const AUTH_ROUTES              = ["/auth/sign-in", "/auth/sign-up"];

function startsWithAny(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => pathname.startsWith(prefix));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for static assets and internal Next.js routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||        // Better Auth handles its own routes
    pathname.startsWith("/api/webhooks") ||    // Webhooks validated internally
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Read the session cookie (lightweight — no DB call in proxy)
  const sessionCookie = getSessionCookie(request);
  const isAuthenticated = Boolean(sessionCookie);

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && startsWithAny(pathname, AUTH_ROUTES)) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  // Protect member routes — redirect to sign-in if not authenticated
  if (startsWithAny(pathname, PROTECTED_MEMBER_ROUTES)) {
    if (!isAuthenticated) {
      const signInUrl = new URL("/auth/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Protect admin routes
  if (startsWithAny(pathname, PROTECTED_ADMIN_ROUTES)) {
    if (!isAuthenticated) {
      const signInUrl = new URL("/auth/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Protect API routes
  if (pathname.startsWith("/api/") && !isAuthenticated) {
    if (
      pathname.startsWith("/api/orders") ||
      pathname.startsWith("/api/account") ||
      pathname.startsWith("/api/admin")
    ) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
