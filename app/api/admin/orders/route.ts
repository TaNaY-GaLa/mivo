/**
 * app/api/admin/orders/route.ts
 * GET — returns ALL orders across all users (ADMIN only)
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, apiErrorResponse } from "@/lib/session";
import { Role } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    await requireRole(Role.ADMIN);

    const { searchParams } = new URL(request.url);
    const page    = Math.max(1, parseInt(searchParams.get("page")  ?? "1", 10));
    const limit   = Math.min(50, parseInt(searchParams.get("limit") ?? "20", 10));
    const status  = searchParams.get("status") ?? undefined;

    const where = status ? { status: status as never } : {};

    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true },
          },
          items: {
            select: {
              productId: true,
              productName: true,
              unitPrice: true,
              quantity: true,
            },
          },
          _count: { select: { items: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return Response.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return apiErrorResponse(err);
  }
}
