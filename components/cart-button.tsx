"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useHasMounted } from "@/lib/use-mounted";

export function CartButton() {
  const mounted = useHasMounted();
  const items = useCartStore((state) => state.items);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const totalItems = mounted
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <button
      type="button"
      onClick={toggleCart}
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-neutral-200/80 bg-neutral-100/80 hover:bg-neutral-200/80 dark:border-neutral-800 dark:bg-neutral-900/80 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-900 dark:text-neutral-100 transition-all cursor-pointer"
      aria-label={`Shopping Bag (${totalItems} items)`}
    >
      <ShoppingBag className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
      <span>Bag ({totalItems})</span>
    </button>
  );
}
