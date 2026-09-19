"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Truck, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
      <Card className="rounded-2xl border-neutral-200/80 dark:border-neutral-800 animate-pulse">
        <CardHeader>
          <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-20 w-full bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
          <div className="h-20 w-full bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 sticky top-24">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-base font-semibold">
          <span>Order Summary</span>
          <span className="text-xs font-normal text-neutral-500">
            {activeItems.length} {activeItems.length === 1 ? "item" : "items"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeItems.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <ShoppingBag className="w-8 h-8 mx-auto text-neutral-400" />
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Your bag is empty
            </p>
            <Link
              href="/#products"
              className="text-xs text-neutral-600 dark:text-neutral-400 underline inline-block hover:text-neutral-900 dark:hover:text-white"
            >
              Explore the collection
            </Link>
          </div>
        ) : (
          <>
            <div className="max-h-80 overflow-y-auto divide-y divide-neutral-200/60 dark:divide-neutral-800 pr-1">
              {activeItems.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 py-3 first:pt-0">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
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
                      <p className="font-medium text-neutral-900 dark:text-neutral-100 line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-neutral-500 mt-0.5">
                        Qty: {quantity} × {formatPrice(product.price)}
                      </p>
                    </div>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-2" />

            <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-200">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="inline-flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-500" /> Standard Delivery
                </span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (Included)</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-200">
                  {formatPrice(tax)}
                </span>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="flex justify-between items-center text-sm font-bold text-neutral-900 dark:text-white pt-1">
              <span>Total Amount</span>
              <span className="text-base">{formatPrice(total)}</span>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/80 p-3 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Complimentary shipping & 30-day effortless return policy.</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
