"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const setBuyNow = useCartStore((state) => state.setBuyNow);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    toast.success(`Added ${product.name} to bag`, {
      description: formatPrice(product.price),
    });

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBuyNow(product, 1);
    router.push("/checkout?flow=buynow");
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-900/80 transition-all duration-300 hover:shadow-md dark:hover:border-neutral-700">
      {/* Product Image Container */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800/80"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 text-xs tracking-wide border-neutral-200/50 dark:border-neutral-800/50"
          >
            {product.category}
          </Badge>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold text-neutral-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`inline-flex items-center justify-center gap-1 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                added
                  ? "bg-emerald-600 text-white dark:bg-emerald-500"
                  : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
              }`}
              aria-label={`Add ${product.name} to bag`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" /> Add to Bag
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="inline-flex items-center justify-center gap-1 rounded-xl px-2.5 py-2 text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-all duration-200 cursor-pointer"
              aria-label={`Buy ${product.name} now`}
            >
              Buy Now
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
