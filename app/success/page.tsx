import Link from "next/link";
import { CheckCircle2, ArrowRight, Package, ShieldCheck, Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.orderId || "MIVO-10482";

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="rounded-3xl border border-neutral-200/80 bg-white p-8 sm:p-12 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm text-center space-y-8">
        {/* Success Icon */}
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
            Order Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-neutral-900 dark:text-white tracking-tight">
            Thank you for shopping with Mivo.
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
            Your order has been placed successfully. We are preparing your items for dispatch.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 dark:border-neutral-800 dark:bg-neutral-950/50 text-left space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-200/80 dark:border-neutral-800">
            <div>
              <span className="text-neutral-500 block">Order Reference</span>
              <span className="font-mono font-bold text-sm text-neutral-900 dark:text-white">
                #{orderId}
              </span>
            </div>
            <div className="sm:text-right">
              <span className="text-neutral-500 block">Estimated Delivery</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                2–4 Business Days
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <span className="text-neutral-500 block">Order Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1.5 mt-0.5">
                <Package className="w-3.5 h-3.5" /> Processing
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Delivery Charge</span>
              <span className="font-semibold text-neutral-900 dark:text-white mt-0.5 block">
                Free Delivery
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Warranty</span>
              <span className="font-semibold text-neutral-900 dark:text-white inline-flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" /> 2-Year Cover
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/#products"
            className={buttonVariants({
              size: "lg",
              className: "w-full sm:w-auto px-8 py-6 rounded-xl text-sm font-semibold gap-2 shadow-md bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 cursor-pointer",
            })}
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "w-full sm:w-auto px-8 py-6 rounded-xl text-sm font-semibold gap-2 cursor-pointer",
            })}
          >
            <Home className="w-4 h-4" />
            Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
