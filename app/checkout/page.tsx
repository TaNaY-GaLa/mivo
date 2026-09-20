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
    <div className="animate-pulse space-y-4">
      <div className="h-12 w-full bg-[#ECEDEA] dark:bg-[#24272B] rounded-lg" />
      <div className="h-12 w-full bg-[#ECEDEA] dark:bg-[#24272B] rounded-lg" />
      <div className="h-12 w-full bg-[#ECEDEA] dark:bg-[#24272B] rounded-lg" />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="bg-[#F7F7F5] dark:bg-[#17181A] text-[#17181A] dark:text-[#F7F7F5] min-h-screen py-10 pb-24 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back link & Title */}
        <div className="space-y-2">
          <Link
            href="/#catalogue"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9] hover:text-[#17181A] dark:hover:text-[#F7F7F5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Catalogue
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E5E6E3] dark:border-[#2D3035] pb-4">
            <h1 className="text-3xl font-serif text-[#17181A] dark:text-[#F7F7F5]">
              Checkout
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-[#666A70] dark:text-[#9DA2A9]">
              <ShieldCheck className="w-4 h-4 text-[#A8B2A5]" />
              <span>Secure SSL Encrypted Transaction</span>
            </div>
          </div>
        </div>

        {/* Responsive Checkout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Checkout Form */}
          <div className="lg:col-span-7 rounded-xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] p-6 sm:p-8">
            <Suspense fallback={<CheckoutSkeleton />}>
              <CheckoutForm />
            </Suspense>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <Suspense
              fallback={
                <div className="animate-pulse h-64 rounded-xl bg-[#FFFFFF] dark:bg-[#1E2023] border border-[#E5E6E3] dark:border-[#2D3035]" />
              }
            >
              <OrderSummary />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
