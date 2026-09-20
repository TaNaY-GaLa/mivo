/**
 * app/api/account/route.ts
 * GET — returns the authenticated user's profile (MEMBER+)
 */

import { prisma } from "@/lib/prisma";
import { requireSession, apiErrorResponse } from "@/lib/session";

export async function GET() {
  try {
    const user = await requireSession();

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        phone: true,
        createdAt: true,
        // Deliberately exclude: password, session tokens
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!profile) {
      return Response.json({ error: "User not found." }, { status: 404 });
    }

    return Response.json({ user: profile });
  } catch (err) {
    return apiErrorResponse(err);
  }
}
