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
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E5E6E3] dark:border-[#2D3035] bg-[#ECEDEA] dark:bg-[#24272B] hover:bg-[#E5E6E3] dark:hover:bg-[#2D3035] text-xs font-medium uppercase tracking-widest text-[#17181A] dark:text-[#F7F7F5] transition-all cursor-pointer"
      aria-label={`Shopping Bag (${totalItems} items)`}
    >
      <ShoppingBag className="w-3.5 h-3.5 text-[#666A70] dark:text-[#9DA2A9]" />
      <span>Bag ({totalItems})</span>
    </button>
  );
}
