"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingBag, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";

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
    // Set isolated Buy Now selection — does NOT touch persistent bag
    setBuyNow(product, quantity);
    router.push("/checkout?flow=buynow");
  };

  return (
    <div className="space-y-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-6">
        <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 p-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center text-sm font-bold text-neutral-900 dark:text-white">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-neutral-500 font-mono">Subtotal</span>
          <span className="text-xl font-bold text-neutral-900 dark:text-white">
            {formatPrice(product.price * quantity)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          onClick={handleAddToCart}
          variant="outline"
          size="lg"
          className="w-full py-6 rounded-xl text-sm font-semibold gap-2 cursor-pointer"
        >
          {added ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" /> Added to Bag
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" /> Add to Bag
            </>
          )}
        </Button>

        <Button
          onClick={handleBuyNow}
          size="lg"
          className="w-full py-6 rounded-xl text-sm font-semibold gap-2 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 cursor-pointer shadow-md"
        >
          Buy Now
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
