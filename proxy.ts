/**
 * proxy.ts — Next.js 16 route authorization pipeline (formerly middleware.ts)
 * Runs on every matching request at the Edge runtime.
 *
 * NOTE: Auth gate is TEMPORARILY DISABLED for screenshot/demo purposes.
 * To re-enable, uncomment the "PROTECTED SHOPPING ROUTES" block below.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// ─── Route protection matrix ─────────────────────────────────────────────────
const PROTECTED_ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES             = ["/auth/sign-in", "/auth/sign-up"];

function startsWithAny(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => pathname.startsWith(prefix));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for static assets and internal Next.js / API auth routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/webhooks") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/opengraph-image")
  ) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);
  const isAuthenticated = Boolean(sessionCookie);

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && startsWithAny(pathname, AUTH_ROUTES)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow auth pages for unauthenticated visitors
  if (startsWithAny(pathname, AUTH_ROUTES)) {
    return NextResponse.next();
  }

  // ─── PROTECTED SHOPPING ROUTES (temporarily disabled for screenshots) ──────
  // Uncomment the block below to re-enable the auth gate:
  //
  // if (!isAuthenticated) {
  //   if (pathname.startsWith("/api/")) {
  //     return NextResponse.json(
  //       { error: "Authentication required." },
  //       { status: 401 }
  //     );
  //   }
  //   const signInUrl = new URL("/auth/sign-in", request.url);
  //   signInUrl.searchParams.set("callbackUrl", pathname);
  //   return NextResponse.redirect(signInUrl);
  // }
  // ─────────────────────────────────────────────────────────────────────────────

  // Protect admin routes
  if (startsWithAny(pathname, PROTECTED_ADMIN_ROUTES) && !isAuthenticated) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

