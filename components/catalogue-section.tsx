"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        currentCategory === "ALL" || p.category.toUpperCase() === currentCategory;
      
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, currentCategory, searchQuery]);

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

        {/* Search Bar & Category Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Instant Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#666A70] dark:text-[#9DA2A9]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalogue..."
              className="w-full rounded-full border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] pl-9 pr-8 py-1.5 text-xs text-[#17181A] dark:text-[#F7F7F5] placeholder:text-[#666A70] focus:outline-none focus:ring-1 focus:ring-[#17181A] dark:focus:ring-[#F7F7F5]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#666A70] hover:text-[#17181A] dark:hover:text-[#F7F7F5]"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
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
          No products found matching your search or category filter.
        </div>
      )}
    </section>
  );
}
