"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

interface CatalogueSectionProps {
  products: Product[];
}

const CATEGORY_TABS = ["ALL", "AUDIO", "DESK", "CARRY", "ACCESSORIES"];

export function CatalogueSection({ products }: CatalogueSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = (searchParams.get("category") || "ALL").toUpperCase();

  const filteredProducts = useMemo(() => {
    if (currentCategory === "ALL") return products;
    return products.filter(
      (p) => p.category.toUpperCase() === currentCategory
    );
  }, [products, currentCategory]);

  const handleSelectTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "ALL") {
      params.delete("category");
    } else {
      params.set("category", tab.toLowerCase());
    }
    const queryString = params.toString();
    const newUrl = queryString ? `/?${queryString}#catalogue` : "/#catalogue";
    router.push(newUrl, { scroll: false });
  };

  return (
    <section id="catalogue" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E5E6E3] dark:border-[#2D3035] pb-6 gap-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9] block mb-1">
            Product Catalogue
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#17181A] dark:text-[#F7F7F5]">
            Curated Essentials
          </h2>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar pb-1">
          {CATEGORY_TABS.map((tab) => {
            const isActive = currentCategory === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => handleSelectTab(tab)}
                className={`text-xs font-medium uppercase tracking-widest px-4 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#17181A] text-[#F7F7F5] dark:bg-[#F7F7F5] dark:text-[#17181A] shadow-sm font-semibold"
                    : "text-[#666A70] dark:text-[#9DA2A9] hover:bg-[#ECEDEA] dark:hover:bg-[#24272B] hover:text-[#17181A] dark:hover:text-[#F7F7F5]"
                }`}
              >
                {tab === "ALL" ? "All Products" : tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtered Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-[#666A70] dark:text-[#9DA2A9] font-sans">
          No products found in this category.
        </div>
      )}
    </section>
  );
}
