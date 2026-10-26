"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { AuditAction, OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
  const user = await getServerSession();

  if (!user) {
    return { success: false, message: "You must be signed in to cancel an order." };
  }

  let order;
  try {
    order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, userId: true, status: true, orderRef: true },
    });
  } catch {
    return { success: false, message: "Failed to fetch order. Please try again." };
  }

  if (!order) {
    return { success: false, message: "Order not found." };
  }

  // Only the order owner or an ADMIN can cancel
  const isOwner = order.userId === user.id;
  const isAdmin = user.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return { success: false, message: "You are not authorized to cancel this order." };
  }

  // Only PENDING or CONFIRMED orders can be cancelled
  const cancellableStatuses: string[] = ["PENDING", "CONFIRMED"];
  if (!cancellableStatuses.includes(order.status as string)) {
    return {
      success: false,
      message: `Order ${order.orderRef} cannot be cancelled — current status: ${order.status}.`,
    };
  }

  try {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED, updatedAt: new Date() },
      }),
      prisma.auditLog.create({
        data: {
          action: AuditAction.ORDER_STATUS_UPDATED,
          userId: user.id,
          orderId: orderId,
          metadata: {
            previousStatus: order.status,
            newStatus: "CANCELLED",
            orderRef: order.orderRef,
            cancelledBy: user.id,
          },
        },
      }),
    ]);
  } catch {
    return { success: false, message: "Failed to cancel the order. Please try again." };
  }

  revalidatePath(`/account/orders/${orderId}`);
  revalidatePath("/account/orders");
  revalidatePath("/account");

  return { success: true, message: `Order ${order.orderRef} has been cancelled successfully.` };
}
