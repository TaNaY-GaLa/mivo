import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, ArrowRight, ShoppingBag } from "lucide-react";

export const metadata = {
  title: "My Orders | Mivo",
  description: "View all your Mivo orders, their statuses and complete details.",
};

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

export default async function MyOrdersPage() {
  const user = await getServerSession();

  if (!user) {
    redirect("/auth/sign-in?callbackUrl=/account/orders");
  }

  let orders: Array<{
    id: string;
    orderRef: string;
    status: string;
    paymentMethod: string;
    total: number;
    subtotal: number;
    createdAt: Date;
    items: Array<{ productName: string; quantity: number; unitPrice: number }>;
  }> = [];

  try {
    orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          select: { productName: true, quantity: true, unitPrice: true },
        },
      },
    });
  } catch (err) {
    console.warn("[My Orders] DB error:", err);
  }

  return (
    <div className="bg-[#F7F7F5] dark:bg-[#17181A] text-[#17181A] dark:text-[#F7F7F5] min-h-screen py-12 pb-24 transition-colors">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <div className="space-y-2">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9] hover:text-[#17181A] dark:hover:text-[#F7F7F5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Account
          </Link>
          <div className="flex items-center justify-between border-b border-[#E5E6E3] dark:border-[#2D3035] pb-4">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-[#666A70] dark:text-[#9DA2A9]" />
              <h1 className="text-3xl font-serif text-[#17181A] dark:text-[#F7F7F5]">
                My Orders
              </h1>
            </div>
            <span className="text-xs text-[#666A70] dark:text-[#9DA2A9] font-medium">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
          </div>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#E5E6E3] dark:border-[#2D3035] bg-[#ECEDEA] dark:bg-[#24272B] text-[#666A70] dark:text-[#9DA2A9]">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl text-[#17181A] dark:text-[#F7F7F5]">
                No orders yet.
              </h2>
              <p className="text-sm text-[#666A70] dark:text-[#9DA2A9]">
                Your orders will appear here once you make a purchase.
              </p>
            </div>
            <Link
              href="/#catalogue"
              className="inline-flex items-center gap-2 rounded-full bg-[#17181A] dark:bg-[#F7F7F5] px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#F7F7F5] dark:text-[#17181A] hover:bg-[#666A70] dark:hover:bg-[#E5E6E3] transition-colors shadow-sm"
            >
              Explore Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const gst = Math.round(order.subtotal * 0.18);
              const grandTotal = order.total; // already includes GST
              const placedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] shadow-sm overflow-hidden hover:border-[#17181A] dark:hover:border-[#F7F7F5] transition-all group"
                >
                  {/* Order header row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-[#E5E6E3] dark:border-[#2D3035] bg-[#F7F7F5] dark:bg-[#17181A]">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9] font-semibold">
                          Order ID
                        </p>
                        <p className="font-mono font-bold text-[#17181A] dark:text-[#F7F7F5]">
                          #{order.orderRef}
                        </p>
                      </div>
                      <div className="hidden sm:block h-8 w-px bg-[#E5E6E3] dark:bg-[#2D3035]" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9] font-semibold">
                          Placed On
                        </p>
                        <p className="text-sm font-medium text-[#17181A] dark:text-[#F7F7F5]">
                          {placedDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest ${statusColor(order.status)}`}
                      >
                        {order.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest border-[#E5E6E3] dark:border-[#2D3035] text-[#666A70] dark:text-[#9DA2A9] bg-[#ECEDEA] dark:bg-[#24272B]"
                      >
                        {order.paymentMethod}
                      </Badge>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="px-5 py-4 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ECEDEA] dark:bg-[#24272B] text-[10px] font-bold text-[#17181A] dark:text-[#F7F7F5]">
                            {item.quantity}
                          </span>
                          <span className="font-medium text-[#17181A] dark:text-[#F7F7F5]">
                            {item.productName}
                          </span>
                        </div>
                        <span className="font-mono text-[#666A70] dark:text-[#9DA2A9]">
                          ₹{((item.unitPrice * item.quantity) / 100).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer: total + link */}
                  <div className="flex items-center justify-between px-5 py-4 border-t border-[#E5E6E3] dark:border-[#2D3035]">
                    <div className="text-xs space-y-0.5">
                      <p className="text-[#666A70] dark:text-[#9DA2A9]">
                        Subtotal: ₹{(order.subtotal / 100).toLocaleString("en-IN")} + GST: ₹{(gst / 100).toLocaleString("en-IN")}
                      </p>
                      <p className="font-bold text-sm text-[#17181A] dark:text-[#F7F7F5]">
                        Grand Total: ₹{(grandTotal / 100).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#17181A] dark:border-[#F7F7F5] bg-transparent px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-[#17181A] dark:text-[#F7F7F5] hover:bg-[#17181A] hover:text-[#F7F7F5] dark:hover:bg-[#F7F7F5] dark:hover:text-[#17181A] transition-all cursor-pointer"
                    >
                      View Details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
