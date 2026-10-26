"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useHasMounted } from "@/lib/use-mounted";

export function CartButton() {
  const mounted = useHasMounted();
  const items = useCartStore((state) => state.items);

  const totalItems = mounted
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E5E6E3] dark:border-[#2D3035] bg-[#ECEDEA] dark:bg-[#24272B] hover:bg-[#E5E6E3] dark:hover:bg-[#2D3035] text-xs font-medium uppercase tracking-widest text-[#17181A] dark:text-[#F7F7F5] transition-all cursor-pointer"
      aria-label={`Shopping Bag (${totalItems} items)`}
    >
      <ShoppingBag className="w-3.5 h-3.5 text-[#666A70] dark:text-[#9DA2A9]" />
      <span className="hidden sm:inline">Bag</span>
      {totalItems > 0 && (
        <span className="inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#17181A] dark:bg-[#F7F7F5] px-1 text-[10px] font-bold text-[#F7F7F5] dark:text-[#17181A]">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
