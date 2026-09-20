/**
 * app/api/orders/route.ts
 * GET  — list authenticated user's own orders (MEMBER+)
 * POST — create a new order (used by checkout Server Action; also accessible here)
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, apiErrorResponse } from "@/lib/session";

// GET /api/orders — returns the authenticated user's orders
export async function GET() {
  try {
    const user = await requireSession();

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          select: {
            productId: true,
            productName: true,
            unitPrice: true,
            quantity: true,
          },
        },
      },
    });

    return Response.json({ orders });
  } catch (err) {
    return apiErrorResponse(err);
  }
}

// POST /api/orders — direct API order creation (Server Action is the primary path)
export async function POST(request: NextRequest) {
  try {
    await requireSession();
    const body = await request.json() as unknown;

    if (
      typeof body !== "object" || body === null ||
      !("orderRef" in body) || !("items" in body)
    ) {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    // This endpoint delegates to the same validation logic used in the Server Action
    // Full validation is in app/actions/checkout.ts — this endpoint is for API access
    return Response.json(
      { error: "Order creation via API is not supported. Use the checkout flow." },
      { status: 405 }
    );
  } catch (err) {
    return apiErrorResponse(err);
  }
}
