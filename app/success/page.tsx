import Link from "next/link";
import {
  CheckCircle2, ArrowRight, Package, ShieldCheck, User,
  MapPin, CreditCard, QrCode, Banknote, Tag, Truck,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

const DEMO_ORDER = {
  orderRef: "MIVO-84721",
  status: "CONFIRMED",
  paymentMethod: "UPI",
  customerName: "Tanay Gala",
  address: "12, Sector 7, Andheri West",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400058",
  subtotal: 2499700,   // in paise (before GST)
  total: 2949646,      // in paise (with 18% GST)
  items: [
    { productName: "Studio Headphones", quantity: 1, unitPrice: 1299900 },
    { productName: "Mechanical Keyboard", quantity: 1, unitPrice: 899900 },
    { productName: "Crafted Desk Mat", quantity: 1, unitPrice: 299900 },
  ],
};

function paymentLabel(method: string): { label: string; Icon: React.ElementType } {
  const m = method?.toUpperCase();
  if (m === "CARD") return { label: "Card Payment (Visa / Mastercard)", Icon: CreditCard };
  if (m === "COD") return { label: "Cash on Delivery", Icon: Banknote };
  return { label: "UPI / QR (GPay, PhonePe)", Icon: QrCode };
}

function fmt(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const resolvedParams = await searchParams;
  const rawOrderId = resolvedParams.orderId;

  let order = null;
  if (rawOrderId) {
    try {
      order = await prisma.order.findFirst({
        where: { OR: [{ id: rawOrderId }, { orderRef: rawOrderId }] },
        include: { items: true },
      });
    } catch (err) {
      console.warn("[Success Page] DB error:", err);
    }
  }

  const display = order
    ? {
        orderRef: order.orderRef,
        status: order.status,
        paymentMethod: order.paymentMethod,
        customerName: order.customerName,
        address: order.address,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        subtotal: order.subtotal,
        total: order.total,
        items: order.items,
      }
    : DEMO_ORDER;

  // GST = total - subtotal (correct for newly placed orders with 18% GST)
  const gstPaise = display.total - display.subtotal;

  const orderDetailHref = order ? `/account/orders/${order.id}` : "/account/orders";
  const { label: payLabel, Icon: PayIcon } = paymentLabel(display.paymentMethod as string);

  return (
    <div className="bg-[#F7F7F5] dark:bg-[#17181A] text-[#17181A] dark:text-[#F7F7F5] min-h-screen py-16 transition-colors">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] p-8 sm:p-12 shadow-sm space-y-8">

          {/* Success Badge */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <span className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold">
              Order Confirmed!
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#17181A] dark:text-[#F7F7F5] tracking-tight">
              Thank you for shopping with Mivo.
            </h1>
            <p className="text-xs sm:text-sm text-[#666A70] dark:text-[#9DA2A9] max-w-md leading-relaxed">
              Your order has been placed and saved. We are preparing your curated items for dispatch.
            </p>
          </div>

          {/* Order Summary Box */}
          <div className="rounded-2xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#F7F7F5] dark:bg-[#17181A] p-6 space-y-5 text-xs">

            {/* Order Ref + Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E5E6E3] dark:border-[#2D3035]">
              <div>
                <span className="text-[#666A70] dark:text-[#9DA2A9] block text-[11px] uppercase tracking-wider font-medium">Order ID</span>
                <span className="font-mono font-bold text-sm sm:text-base text-[#17181A] dark:text-[#F7F7F5]">
                  #{display.orderRef}
                </span>
              </div>
              <div className="sm:text-right flex flex-col gap-0.5">
                <span className="text-[#666A70] dark:text-[#9DA2A9] block text-[11px] uppercase tracking-wider font-medium">Status</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" /> {display.status}
                </span>
              </div>
            </div>

            {/* Items */}
            <div>
              <span className="text-[#666A70] dark:text-[#9DA2A9] block text-[11px] uppercase tracking-wider font-medium mb-2">
                Items Ordered
              </span>
              <div className="divide-y divide-[#E5E6E3] dark:divide-[#2D3035]">
                {display.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E5E6E3] dark:bg-[#2D3035] text-[10px] font-bold text-[#17181A] dark:text-[#F7F7F5]">
                        {item.quantity}
                      </span>
                      <span className="font-medium text-[#17181A] dark:text-[#F7F7F5]">{item.productName}</span>
                    </div>
                    <span className="font-mono text-[#666A70] dark:text-[#9DA2A9]">
                      {fmt(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 pt-3 border-t border-[#E5E6E3] dark:border-[#2D3035]">
              <div className="flex justify-between">
                <span className="text-[#666A70] dark:text-[#9DA2A9]">Subtotal (before GST)</span>
                <span className="font-mono font-medium text-[#17181A] dark:text-[#F7F7F5]">{fmt(display.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666A70] dark:text-[#9DA2A9] inline-flex items-center gap-1">
                  <Tag className="w-3 h-3" /> GST (18%)
                </span>
                <span className="font-mono font-medium text-[#17181A] dark:text-[#F7F7F5]">+ {fmt(gstPaise)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666A70] dark:text-[#9DA2A9] inline-flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Delivery
                </span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E5E6E3] dark:border-[#2D3035] font-bold text-sm text-[#17181A] dark:text-[#F7F7F5]">
                <span>Grand Total (incl. GST)</span>
                <span className="font-mono text-base">{fmt(display.total)}</span>
              </div>
            </div>

            {/* Payment + Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E5E6E3] dark:border-[#2D3035]">
              <div>
                <span className="text-[#666A70] dark:text-[#9DA2A9] block text-[11px] uppercase tracking-wider font-medium mb-1">Payment Method</span>
                <span className="font-semibold text-[#17181A] dark:text-[#F7F7F5] inline-flex items-center gap-1.5">
                  <PayIcon className="w-3.5 h-3.5 text-[#666A70] dark:text-[#9DA2A9]" /> {payLabel}
                </span>
              </div>
              <div>
                <span className="text-[#666A70] dark:text-[#9DA2A9] block text-[11px] uppercase tracking-wider font-medium mb-1">Delivery Address</span>
                <span className="font-medium text-[#17181A] dark:text-[#F7F7F5] inline-flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#666A70]" />
                  <span>{display.address}, {display.city}, {display.state} – {display.pincode}</span>
                </span>
              </div>
            </div>

            {/* Delivery estimate + Warranty */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E5E6E3] dark:border-[#2D3035]">
              <span className="text-[#666A70] dark:text-[#9DA2A9] text-[11px] uppercase tracking-wider font-medium">Estimated Delivery</span>
              <span className="font-semibold text-[#17181A] dark:text-[#F7F7F5] inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A8B2A5]" /> 2–4 Business Days
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={orderDetailHref}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#17181A] text-[#F7F7F5] dark:bg-[#F7F7F5] dark:text-[#17181A] hover:bg-[#666A70] dark:hover:bg-[#E5E6E3] px-8 py-3.5 text-xs font-semibold uppercase tracking-widest transition-colors shadow-md cursor-pointer"
            >
              <User className="w-4 h-4" />
              View My Orders
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
