"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Truck, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { useHasMounted } from "@/lib/use-mounted";

export function OrderSummary() {
  const mounted = useHasMounted();
  const { items, buyNowItems } = useCartStore();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("flow") === "buynow";

  const activeItems = mounted
    ? isBuyNow && buyNowItems.length > 0 ? buyNowItems : items
    : [];

  const subtotal = mounted
    ? activeItems.reduce((t, i) => t + i.product.price * i.quantity, 0)
    : 0;
  const shipping = 0;
  const tax = Math.round((subtotal * 18) / 118);
  const total = subtotal + shipping;

  if (!mounted) {
    return (
      <div className="rounded-3xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] p-6 animate-pulse space-y-4">
        <div className="h-6 w-32 bg-[#ECEDEA] dark:bg-[#24272B] rounded" />
        <div className="h-20 w-full bg-[#ECEDEA] dark:bg-[#24272B] rounded-xl" />
        <div className="h-20 w-full bg-[#ECEDEA] dark:bg-[#24272B] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] p-6 sticky top-24 space-y-6 text-[#17181A] dark:text-[#F7F7F5] shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E6E3] dark:border-[#2D3035]">
        <h2 className="font-serif text-xl font-normal">Order Summary</h2>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9]">
          {activeItems.length} {activeItems.length === 1 ? "item" : "items"}
        </span>
      </div>

      {activeItems.length === 0 ? (
        <div className="py-8 text-center space-y-3">
          <ShoppingBag className="w-8 h-8 mx-auto text-[#666A70] dark:text-[#9DA2A9]" />
          <p className="text-sm font-serif">
            Your bag is empty
          </p>
          <Link
            href="/#catalogue"
            className="text-xs text-[#666A70] underline inline-block hover:text-[#17181A] dark:hover:text-[#F7F7F5]"
          >
            Explore the collection
          </Link>
        </div>
      ) : (
        <>
          <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E6E3] dark:divide-[#2D3035] pr-1">
            {activeItems.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3 py-3 first:pt-0">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#F7F7F5] dark:bg-[#17181A]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="flex flex-1 justify-between items-start text-xs">
                  <div>
                    <p className="font-serif text-[#17181A] dark:text-[#F7F7F5] line-clamp-1 text-sm">
                      {product.name}
                    </p>
                    <p className="text-[#666A70] dark:text-[#9DA2A9] font-mono mt-0.5">
                      Qty: {quantity} × {formatPrice(product.price)}
                    </p>
                  </div>
                  <span className="font-bold font-mono text-[#17181A] dark:text-[#F7F7F5]">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 text-xs text-[#666A70] dark:text-[#9DA2A9] pt-4 border-t border-[#E5E6E3] dark:border-[#2D3035]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono font-medium text-[#17181A] dark:text-[#F7F7F5]">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="inline-flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#A8B2A5]" /> Standard Delivery
              </span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">FREE</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (Included 18% GST)</span>
              <span className="font-mono font-medium text-[#17181A] dark:text-[#F7F7F5]">
                {formatPrice(tax)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm font-bold text-[#17181A] dark:text-[#F7F7F5] pt-4 border-t border-[#E5E6E3] dark:border-[#2D3035]">
            <span>Total Amount</span>
            <span className="text-lg font-mono">{formatPrice(total)}</span>
          </div>

          <div className="pt-2 flex items-center gap-2 text-[11px] text-[#666A70] dark:text-[#9DA2A9] bg-[#F7F7F5] dark:bg-[#17181A] p-3.5 rounded-2xl border border-[#E5E6E3] dark:border-[#2D3035]">
            <ShieldCheck className="w-4 h-4 text-[#A8B2A5] shrink-0" />
            <span>Complimentary shipping & 30-day effortless return policy.</span>
          </div>
        </>
      )}
    </div>
  );
}
