/**
 * lib/session.ts — Server-side session helper utilities
 * Use these in Server Components, Server Actions, and Route Handlers.
 * NEVER trust client-provided user identity or role.
 */

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import type { Role } from "@prisma/client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/**
 * getServerSession — retrieves the authenticated user from the database
 * by validating the Better Auth session from incoming request headers.
 * Returns null if the request is unauthenticated.
 */
export async function getServerSession(): Promise<AuthUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) return null;

    // Always fetch role from database — never trust session-embedded role alone
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, role: true },
    });

    return dbUser;
  } catch {
    return null;
  }
}

/**
 * requireSession — throws a standardized 401 error if not authenticated.
 * Use in Route Handlers and Server Actions that require authentication.
 */
export async function requireSession(): Promise<AuthUser> {
  const user = await getServerSession();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

/**
 * requireRole — throws a standardized error if the user doesn't have
 * the required role. Always checks the database role, not client state.
 */
export async function requireRole(role: Role): Promise<AuthUser> {
  const user = await requireSession();

  const roleHierarchy: Record<Role, number> = {
    GUEST: 0,
    MEMBER: 1,
    ADMIN: 2,
  };

  if (roleHierarchy[user.role] < roleHierarchy[role]) {
    throw new Error("FORBIDDEN");
  }

  return user;
}

/**
 * apiErrorResponse — returns standard JSON error responses for Route Handlers
 */
export function apiErrorResponse(
  error: unknown,
  defaultStatus = 500
): Response {
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return Response.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }
    if (error.message === "FORBIDDEN") {
      return Response.json(
        { error: "You do not have permission to access this resource." },
        { status: 403 }
      );
    }
  }
  // Never expose internal error details to the client
  console.error("[API Error]", error);
  return Response.json(
    { error: "An unexpected error occurred." },
    { status: defaultStatus }
  );
}
