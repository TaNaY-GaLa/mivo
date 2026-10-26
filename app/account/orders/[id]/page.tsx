import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Shield, Truck, User, MapPin, Tag } from "lucide-react";
import { CancelOrderButton } from "./cancel-button";

export const metadata = {
  title: "Order Details | Mivo",
  description: "View itemized order breakdown and delivery status.",
};

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

function statusColor(status: string) {
  switch (status) {
    case "CONFIRMED":
    case "DELIVERED":
      return "border-emerald-300 text-emerald-700 bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:bg-emerald-950/40";
    case "SHIPPED":
      return "border-blue-300 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:bg-blue-950/40";
    case "CANCELLED":
    case "REFUNDED":
      return "border-red-300 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-400 dark:bg-red-950/40";
    default:
      return "border-[#E5E6E3] dark:border-[#2D3035] text-[#666A70] dark:text-[#9DA2A9] bg-[#ECEDEA] dark:bg-[#24272B]";
  }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const user = await getServerSession();
  const { id } = await params;

  if (!user) {
    redirect(`/auth/sign-in?callbackUrl=/account/orders/${id}`);
  }

  let order = null;
  try {
    order = await prisma.order.findFirst({
      where: { OR: [{ id: id }, { orderRef: id }] },
      include: { items: true },
    });
  } catch (err) {
    console.warn("[Order Details] DB error:", err);
  }

  if (!order) {
    return (
      <div className="bg-[#F7F7F5] dark:bg-[#17181A] min-h-screen py-16 text-[#17181A] dark:text-[#F7F7F5]">
        <div className="mx-auto max-w-xl px-4 text-center space-y-6">
          <Package className="h-12 w-12 mx-auto text-[#666A70] dark:text-[#9DA2A9]" />
          <h1 className="font-serif text-3xl">Order Not Found</h1>
          <p className="text-xs text-[#666A70] dark:text-[#9DA2A9]">
            We could not locate an order matching reference &ldquo;{id}&rdquo;.
          </p>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 rounded-full border border-[#E5E6E3] dark:border-[#2D3035] bg-[#ECEDEA] dark:bg-[#24272B] px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#17181A] dark:text-[#F7F7F5] hover:bg-[#E5E6E3] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Return to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = order.userId === user.id;
  const isAdmin = user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return (
      <div className="bg-[#F7F7F5] dark:bg-[#17181A] min-h-screen py-16 text-[#17181A] dark:text-[#F7F7F5]">
        <div className="mx-auto max-w-xl px-4 text-center space-y-6">
          <Shield className="h-12 w-12 mx-auto text-amber-500" />
          <h1 className="font-serif text-3xl">Access Restricted</h1>
          <p className="text-xs text-[#666A70] dark:text-[#9DA2A9]">
            You do not have authorization to view this order.
          </p>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 rounded-full border border-[#E5E6E3] dark:border-[#2D3035] bg-[#ECEDEA] dark:bg-[#24272B] px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#17181A] dark:text-[#F7F7F5] hover:bg-[#E5E6E3] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Return to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const gstPaise = order.total - order.subtotal;
  const canCancel = order.status === "PENDING" || order.status === "CONFIRMED";

  return (
    <div className="bg-[#F7F7F5] dark:bg-[#17181A] text-[#17181A] dark:text-[#F7F7F5] min-h-screen py-12 pb-24 transition-colors">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9] hover:text-[#17181A] dark:hover:text-[#F7F7F5] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Orders
          </Link>
          <span className="text-xs text-[#666A70] dark:text-[#9DA2A9]">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>

        {/* Header Summary Card */}
        <div className="rounded-2xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E5E6E3] dark:border-[#2D3035] pb-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9] font-semibold block mb-1">
                Order Reference
              </span>
              <h1 className="font-mono text-2xl sm:text-3xl font-bold text-[#17181A] dark:text-[#F7F7F5]">
                #{order.orderRef}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={`px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest ${statusColor(order.status)}`}
              >
                {order.status}
              </Badge>
              <Badge
                variant="outline"
                className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-widest border-[#E5E6E3] dark:border-[#2D3035] text-[#666A70] dark:text-[#9DA2A9] bg-[#ECEDEA] dark:bg-[#24272B]"
              >
                {order.paymentMethod}
              </Badge>
            </div>
          </div>

          {/* Customer + Shipping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <h3 className="font-semibold uppercase tracking-wider text-[#666A70] dark:text-[#9DA2A9] text-[11px] flex items-center gap-2">
                <User className="h-4 w-4 text-[#A8B2A5]" /> Customer Information
              </h3>
              <div className="space-y-1 text-[#17181A] dark:text-[#F7F7F5]">
                <p className="font-semibold text-sm">{order.customerName}</p>
                <p className="text-[#666A70] dark:text-[#9DA2A9]">{order.customerEmail}</p>
                <p className="text-[#666A70] dark:text-[#9DA2A9]">{order.customerPhone}</p>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold uppercase tracking-wider text-[#666A70] dark:text-[#9DA2A9] text-[11px] flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#A8B2A5]" /> Shipping Address
              </h3>
              <div className="space-y-1 text-[#17181A] dark:text-[#F7F7F5]">
                <p>{order.address}</p>
                <p>{order.city}, {order.state} - {order.pincode}</p>
                <p className="text-[#666A70] dark:text-[#9DA2A9] inline-flex items-center gap-1.5 pt-1">
                  <Truck className="h-3.5 w-3.5" /> Complimentary Standard Delivery
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items + Pricing */}
        <div className="rounded-2xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="font-serif text-xl border-b border-[#E5E6E3] dark:border-[#2D3035] pb-4">
            Ordered Items ({order.items.length})
          </h2>

          <div className="divide-y divide-[#E5E6E3] dark:divide-[#2D3035]">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4 text-xs first:pt-0 last:pb-0">
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-[#17181A] dark:text-[#F7F7F5]">
                    {item.productName}
                  </p>
                  <p className="text-[#666A70] dark:text-[#9DA2A9] font-mono">
                    Qty: {item.quantity} × ₹{(item.unitPrice / 100).toLocaleString("en-IN")}
                  </p>
                </div>
                <span className="font-mono font-bold text-sm text-[#17181A] dark:text-[#F7F7F5]">
                  ₹{((item.unitPrice * item.quantity) / 100).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          {/* GST Breakdown */}
          <div className="pt-6 border-t border-[#E5E6E3] dark:border-[#2D3035] space-y-2.5 text-xs text-[#666A70] dark:text-[#9DA2A9]">
            <div className="flex justify-between">
              <span>Subtotal (before GST)</span>
              <span className="font-mono font-medium text-[#17181A] dark:text-[#F7F7F5]">
                ₹{(order.subtotal / 100).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="inline-flex items-center gap-1">
                <Tag className="w-3 h-3 text-[#A8B2A5]" /> GST (18%)
              </span>
              <span className="font-mono font-medium text-[#17181A] dark:text-[#F7F7F5]">
                + ₹{(gstPaise / 100).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="inline-flex items-center gap-1">
                <Truck className="w-3 h-3 text-[#A8B2A5]" /> Delivery
              </span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">Free</span>
            </div>
            <div className="flex justify-between pt-3 border-t-2 border-[#17181A] dark:border-[#F7F7F5] text-sm font-bold text-[#17181A] dark:text-[#F7F7F5]">
              <span>Grand Total ({order.paymentMethod})</span>
              <span className="font-mono text-base">
                ₹{(order.total / 100).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Cancel Order */}
        {canCancel && (
          <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">Cancel this order?</p>
              <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-0.5">
                You can cancel orders in PENDING or CONFIRMED status. This action cannot be undone.
              </p>
            </div>
            <CancelOrderButton orderId={order.id} />
          </div>
        )}

      </div>
    </div>
  );
}
