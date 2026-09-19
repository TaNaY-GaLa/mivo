import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { CheckoutForm } from "@/components/checkout-form";
import { OrderSummary } from "@/components/order-summary";

export const metadata: Metadata = {
  title: "Checkout | Mivo",
  description: "Complete your order with secure delivery and instant order confirmation.",
};

function CheckoutSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-12 w-full bg-neutral-200 dark:bg-neutral-800 rounded-2xl mb-4" />
      <div className="h-12 w-full bg-neutral-200 dark:bg-neutral-800 rounded-2xl mb-4" />
      <div className="h-12 w-full bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back link & Title */}
      <div className="space-y-2">
        <Link
          href="/#products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Collection
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-3xl font-serif font-medium tracking-tight text-neutral-900 dark:text-white">
            Checkout
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Secure SSL Encrypted Transaction</span>
          </div>
        </div>
      </div>

      {/* Responsive Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Checkout Form */}
        <div className="lg:col-span-7 rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900 shadow-xs">
          <Suspense fallback={<CheckoutSkeleton />}>
            <CheckoutForm />
          </Suspense>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <Suspense
            fallback={
              <div className="animate-pulse h-64 rounded-3xl bg-neutral-200 dark:bg-neutral-800" />
            }
          >
            <OrderSummary />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
