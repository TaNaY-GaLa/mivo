"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

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
    <div className="group flex flex-col justify-between h-full bg-[#FFFFFF] dark:bg-[#1E2023] rounded-lg border border-[#E5E6E3] dark:border-[#2D3035] overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-4/3 w-full overflow-hidden bg-[#ECEDEA] dark:bg-[#24272B]"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-[#F7F7F5]/90 dark:bg-[#17181A]/90 text-[#666A70] dark:text-[#9DA2A9] text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border border-[#E5E6E3] dark:border-[#2D3035]">
            {product.category}
          </span>
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif text-lg text-[#17181A] dark:text-[#F7F7F5] group-hover:text-[#666A70] dark:group-hover:text-[#9DA2A9] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-[#666A70] dark:text-[#9DA2A9] line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Price & Actions */}
        <div className="pt-3 border-t border-[#E5E6E3] dark:border-[#2D3035] space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-base font-semibold text-[#17181A] dark:text-[#F7F7F5]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#666A70] dark:text-[#9DA2A9] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`inline-flex items-center justify-center gap-1 rounded-md px-3 py-2 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                added
                  ? "bg-emerald-700 text-white"
                  : "bg-[#ECEDEA] dark:bg-[#24272B] text-[#17181A] dark:text-[#F7F7F5] hover:bg-[#A8B2A5] hover:text-[#17181A]"
              }`}
              aria-label={`Add ${product.name} to bag`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added
                </>
              ) : (
                "Add to Bag"
              )}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="inline-flex items-center justify-center rounded-md px-3 py-2 text-xs font-medium uppercase tracking-wider bg-[#17181A] dark:bg-[#F7F7F5] text-[#F7F7F5] dark:text-[#17181A] hover:bg-[#666A70] dark:hover:bg-[#E5E6E3] transition-all cursor-pointer"
              aria-label={`Buy ${product.name} now`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
