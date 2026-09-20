/**
 * app/api/admin/audit-logs/route.ts
 * GET — returns audit logs (ADMIN only)
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, apiErrorResponse } from "@/lib/session";
import { Role } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const adminUser = await requireRole(Role.ADMIN);

    const { searchParams } = new URL(request.url);
    const page  = Math.max(1, parseInt(searchParams.get("page")  ?? "1", 10));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "50", 10));

    const [logs, total] = await prisma.$transaction([
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true },
          },
          order: {
            select: { id: true, orderRef: true },
          },
        },
      }),
      prisma.auditLog.count(),
    ]);

    // Record that admin accessed audit logs
    await prisma.auditLog.create({
      data: {
        action: "ADMIN_AUDIT_VIEWED",
        userId: adminUser.id,
        metadata: { page, limit },
      },
    });

    return Response.json({
      logs,
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
