"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingBag, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

interface ProductDetailsActionsProps {
  product: Product;
}

export function ProductDetailsActions({ product }: ProductDetailsActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const setBuyNow = useCartStore((state) => state.setBuyNow);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    toast.success(`Added ${quantity} × ${product.name} to bag`, {
      description: `Subtotal: ${formatPrice(product.price * quantity)}`,
    });
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    setBuyNow(product, quantity);
    router.push("/checkout?flow=buynow");
  };

  return (
    <div className="space-y-6 pt-6 border-t border-[#E5E6E3] dark:border-[#2D3035]">
      <div className="flex items-center gap-6">
        <div className="flex items-center border border-[#E5E6E3] dark:border-[#2D3035] rounded-md bg-[#ECEDEA] dark:bg-[#24272B] p-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2 text-[#666A70] dark:text-[#9DA2A9] hover:text-[#17181A] dark:hover:text-[#F7F7F5] rounded-md transition-colors cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center text-sm font-semibold text-[#17181A] dark:text-[#F7F7F5]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="p-2 text-[#666A70] dark:text-[#9DA2A9] hover:text-[#17181A] dark:hover:text-[#F7F7F5] rounded-md transition-colors cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-[#666A70] dark:text-[#9DA2A9] uppercase tracking-widest font-semibold">Subtotal</span>
          <span className="text-xl font-semibold text-[#17181A] dark:text-[#F7F7F5]">
            {formatPrice(product.price * quantity)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`inline-flex items-center justify-center gap-2 rounded-md py-3.5 px-6 text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer border ${
            added
              ? "bg-emerald-700 text-white border-emerald-700"
              : "bg-[#ECEDEA] dark:bg-[#24272B] text-[#17181A] dark:text-[#F7F7F5] border-[#E5E6E3] dark:border-[#2D3035] hover:bg-[#A8B2A5] hover:text-[#17181A]"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" /> Added to Bag
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" /> Add to Bag
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          className="inline-flex items-center justify-center gap-2 rounded-md py-3.5 px-6 text-xs font-semibold uppercase tracking-widest bg-[#17181A] dark:bg-[#F7F7F5] text-[#F7F7F5] dark:text-[#17181A] hover:bg-[#666A70] dark:hover:bg-[#E5E6E3] transition-all cursor-pointer"
        >
          Buy Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
