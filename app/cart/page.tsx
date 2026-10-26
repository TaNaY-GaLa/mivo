"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft,
  Truck, ShieldCheck, Tag, Package,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useHasMounted } from "@/lib/use-mounted";
import { formatPrice } from "@/lib/utils";

const GST_RATE = 0.18;

export default function CartPage() {
  const router = useRouter();
  const mounted = useHasMounted();

  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const increaseQuantity = useCartStore((s) => s.increaseQuantity);
  const decreaseQuantity = useCartStore((s) => s.decreaseQuantity);

  const cartItems = mounted ? items : [];
  const subtotal = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const gst = Math.round(subtotal * GST_RATE);
  const delivery = 0;
  const grand = subtotal + gst + delivery;
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="bg-[#F7F7F5] dark:bg-[#17181A] text-[#17181A] dark:text-[#F7F7F5] min-h-screen py-10 pb-24 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <div className="space-y-2">
          <Link
            href="/#catalogue"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9] hover:text-[#17181A] dark:hover:text-[#F7F7F5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
          <div className="flex items-center justify-between border-b border-[#E5E6E3] dark:border-[#2D3035] pb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-serif text-[#17181A] dark:text-[#F7F7F5]">
                Shopping Bag
              </h1>
              {totalItems > 0 && (
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#17181A] dark:bg-[#F7F7F5] text-[#F7F7F5] dark:text-[#17181A] text-[10px] font-bold">
                  {totalItems}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#E5E6E3] dark:border-[#2D3035] bg-[#ECEDEA] dark:bg-[#24272B] text-[#666A70] dark:text-[#9DA2A9]">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl text-[#17181A] dark:text-[#F7F7F5]">
                Your bag is empty.
              </h2>
              <p className="text-sm text-[#666A70] dark:text-[#9DA2A9]">
                Add something you&apos;ll want to keep around.
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* ── Left: Cart Items ──────────────────────────────────────── */}
            <div className="lg:col-span-7 space-y-4">
              {cartItems.map(({ product, quantity }) => {
                const itemSubtotal = product.price * quantity;
                return (
                  <div
                    key={product.id}
                    className="flex gap-4 sm:gap-6 rounded-2xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] p-4 sm:p-5 shadow-sm transition-all hover:border-[#17181A] dark:hover:border-[#F7F7F5]"
                  >
                    {/* Product Image */}
                    <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#ECEDEA] dark:bg-[#24272B]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-0.5 min-w-0">
                          <Link
                            href={`/products/${product.slug}`}
                            className="font-serif text-base sm:text-lg text-[#17181A] dark:text-[#F7F7F5] hover:underline line-clamp-2 block"
                          >
                            {product.name}
                          </Link>
                          <p className="text-xs text-[#666A70] dark:text-[#9DA2A9]">
                            {product.category}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          className="shrink-0 p-1.5 text-[#666A70] dark:text-[#9DA2A9] hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                          aria-label={`Remove ${product.name} from bag`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                        {/* Qty Controls */}
                        <div className="flex items-center gap-1 border border-[#E5E6E3] dark:border-[#2D3035] rounded-lg bg-[#F7F7F5] dark:bg-[#17181A]">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(product.id)}
                            className="p-2 text-[#666A70] dark:text-[#9DA2A9] hover:text-[#17181A] dark:hover:text-[#F7F7F5] cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-[#17181A] dark:text-[#F7F7F5]">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => increaseQuantity(product.id)}
                            className="p-2 text-[#666A70] dark:text-[#9DA2A9] hover:text-[#17181A] dark:hover:text-[#F7F7F5] cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Unit + Subtotal */}
                        <div className="text-right space-y-0.5">
                          <p className="text-xs text-[#666A70] dark:text-[#9DA2A9] font-mono">
                            {formatPrice(product.price)} × {quantity}
                          </p>
                          <p className="text-base font-bold font-mono text-[#17181A] dark:text-[#F7F7F5]">
                            {formatPrice(itemSubtotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Right: Order Summary ──────────────────────────────────── */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] p-6 sticky top-24 space-y-5 shadow-sm">

                <h2 className="font-serif text-xl border-b border-[#E5E6E3] dark:border-[#2D3035] pb-4">
                  Order Summary
                </h2>

                {/* Items List (compact) */}
                <div className="space-y-2 text-xs max-h-52 overflow-y-auto divide-y divide-[#E5E6E3] dark:divide-[#2D3035]">
                  {cartItems.map(({ product, quantity }) => (
                    <div key={product.id} className="flex justify-between items-center py-2 first:pt-0">
                      <span className="text-[#17181A] dark:text-[#F7F7F5] font-medium line-clamp-1 max-w-[60%]">
                        {product.name}
                        <span className="text-[#666A70] dark:text-[#9DA2A9] font-normal ml-1">× {quantity}</span>
                      </span>
                      <span className="font-mono text-[#17181A] dark:text-[#F7F7F5]">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-2.5 text-xs text-[#666A70] dark:text-[#9DA2A9] pt-2 border-t border-[#E5E6E3] dark:border-[#2D3035]">
                  <div className="flex justify-between">
                    <span>Subtotal (before GST)</span>
                    <span className="font-mono font-medium text-[#17181A] dark:text-[#F7F7F5]">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="inline-flex items-center gap-1">
                      <Tag className="w-3 h-3 text-[#A8B2A5]" /> GST (18%)
                    </span>
                    <span className="font-mono font-medium text-[#17181A] dark:text-[#F7F7F5]">
                      + {formatPrice(gst)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="inline-flex items-center gap-1">
                      <Truck className="w-3 h-3 text-[#A8B2A5]" /> Delivery
                    </span>
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      FREE
                    </span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="flex justify-between items-center font-bold text-[#17181A] dark:text-[#F7F7F5] pt-3 border-t-2 border-[#17181A] dark:border-[#F7F7F5]">
                  <span className="text-sm">Grand Total (incl. GST)</span>
                  <span className="text-xl font-mono">{formatPrice(grand)}</span>
                </div>

                {/* Trust badge */}
                <div className="flex items-center gap-2 text-[11px] text-[#666A70] dark:text-[#9DA2A9] bg-[#F7F7F5] dark:bg-[#17181A] p-3 rounded-xl border border-[#E5E6E3] dark:border-[#2D3035]">
                  <ShieldCheck className="w-4 h-4 text-[#A8B2A5] shrink-0" />
                  <span>Free delivery & 30-day returns included.</span>
                </div>

                {/* Checkout CTA */}
                <button
                  type="button"
                  onClick={() => router.push("/checkout")}
                  className="w-full py-4 text-xs font-bold uppercase tracking-wider rounded-full gap-2 cursor-pointer inline-flex items-center justify-center bg-[#17181A] text-[#F7F7F5] dark:bg-[#F7F7F5] dark:text-[#17181A] hover:bg-[#666A70] dark:hover:bg-[#E5E6E3] transition-colors shadow-md"
                >
                  <Package className="w-4 h-4" />
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-[10px] text-[#666A70] dark:text-[#9DA2A9]">
                  GST of {formatPrice(gst)} will be charged. All prices are in INR.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
