import Link from "next/link";
import { CheckCircle2, ArrowRight, Package, ShieldCheck, User } from "lucide-react";
import { prisma } from "@/lib/prisma";

interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const resolvedParams = await searchParams;
  const rawOrderId = resolvedParams.orderId;

  let order = null;
  if (rawOrderId) {
    try {
      order = await prisma.order.findFirst({
        where: {
          OR: [{ id: rawOrderId }, { orderRef: rawOrderId }],
        },
        include: {
          items: true,
        },
      });
    } catch (err) {
      console.warn("[Success Page] DB error:", err);
    }
  }

  const orderIdDisplay = order ? order.orderRef : (rawOrderId || "MIVO-10482");
  const orderDetailHref = order ? `/account/orders/${order.id}` : "/account#orders";

  return (
    <div className="bg-[#F7F7F5] dark:bg-[#17181A] text-[#17181A] dark:text-[#F7F7F5] min-h-screen py-16 transition-colors">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] p-8 sm:p-12 shadow-sm text-center space-y-8">
          {/* Success Icon */}
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          {/* Message */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold block">
              Order Confirmed
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#17181A] dark:text-[#F7F7F5] tracking-tight">
              Thank you for shopping with Mivo.
            </h1>
            <p className="text-xs sm:text-sm text-[#666A70] dark:text-[#9DA2A9] max-w-md mx-auto leading-relaxed">
              Your order has been placed successfully and recorded in PostgreSQL. We are preparing your curated items for dispatch.
            </p>
          </div>

          {/* Order Details Summary Box */}
          <div className="rounded-2xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#F7F7F5] dark:bg-[#17181A] p-6 text-left space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E5E6E3] dark:border-[#2D3035]">
              <div>
                <span className="text-[#666A70] dark:text-[#9DA2A9] block text-[11px] uppercase tracking-wider font-medium">Order Reference</span>
                <span className="font-mono font-bold text-sm sm:text-base text-[#17181A] dark:text-[#F7F7F5]">
                  #{orderIdDisplay}
                </span>
              </div>
              <div className="sm:text-right">
                <span className="text-[#666A70] dark:text-[#9DA2A9] block text-[11px] uppercase tracking-wider font-medium">Estimated Delivery</span>
                <span className="font-semibold text-[#17181A] dark:text-[#F7F7F5]">
                  2–4 Business Days
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <span className="text-[#666A70] dark:text-[#9DA2A9] block text-[11px] uppercase tracking-wider font-medium">Order Status</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1.5 mt-0.5">
                  <Package className="w-3.5 h-3.5" /> {order ? order.status : "CONFIRMED"}
                </span>
              </div>
              <div>
                <span className="text-[#666A70] dark:text-[#9DA2A9] block text-[11px] uppercase tracking-wider font-medium">Payment Method</span>
                <span className="font-semibold text-[#17181A] dark:text-[#F7F7F5] mt-0.5 block">
                  {order ? order.paymentMethod : "UPI / Card"}
                </span>
              </div>
              <div>
                <span className="text-[#666A70] dark:text-[#9DA2A9] block text-[11px] uppercase tracking-wider font-medium">Warranty</span>
                <span className="font-semibold text-[#17181A] dark:text-[#F7F7F5] inline-flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A8B2A5]" /> 2-Year Cover
                </span>
              </div>
            </div>

            {order && order.items.length > 0 && (
              <div className="pt-3 border-t border-[#E5E6E3] dark:border-[#2D3035] space-y-1">
                <span className="text-[#666A70] dark:text-[#9DA2A9] block text-[11px] uppercase tracking-wider font-medium">Items</span>
                <p className="font-medium text-[#17181A] dark:text-[#F7F7F5]">
                  {order.items.map((i) => `${i.productName} (x${i.quantity})`).join(", ")}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={orderDetailHref}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#17181A] text-[#F7F7F5] dark:bg-[#F7F7F5] dark:text-[#17181A] hover:bg-[#666A70] dark:hover:bg-[#E5E6E3] px-8 py-3.5 text-xs font-semibold uppercase tracking-widest transition-colors shadow-md cursor-pointer"
            >
              <User className="w-4 h-4" />
              View Order Details
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/#catalogue"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#E5E6E3] dark:border-[#2D3035] bg-[#ECEDEA] dark:bg-[#24272B] text-[#17181A] dark:text-[#F7F7F5] hover:bg-[#E5E6E3] px-8 py-3.5 text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
