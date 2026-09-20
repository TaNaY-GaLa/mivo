"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

interface CategoryOption {
  id: string;
  name: string;
  image: string;
  tagline: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: "ALL",
    name: "All Products",
    image: "/images/products/studio-headphones.jpg",
    tagline: "Explore complete collection",
  },
  {
    id: "Audio",
    name: "Audio",
    image: "/images/products/studio-monitors.jpg",
    tagline: "Acoustic precision",
  },
  {
    id: "Desk",
    name: "Desk",
    image: "/images/products/crafted-desk-mat.jpg",
    tagline: "Tactile workspace",
  },
  {
    id: "Carry",
    name: "Carry",
    image: "/images/products/leather-daypack.jpg",
    tagline: "Refined travel",
  },
  {
    id: "Accessories",
    name: "Accessories",
    image: "/images/products/wireless-charger.jpg",
    tagline: "Essential additions",
  },
];

interface CategoryNavigationProps {
  onSelectCategory?: (category: string) => void;
}

export function CategoryNavigation({ onSelectCategory }: CategoryNavigationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "ALL";

  const handleSelect = (categoryId: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === "ALL") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    const queryString = params.toString();
    const newUrl = queryString ? `/?${queryString}#catalogue` : "/#catalogue";
    router.push(newUrl, { scroll: false });
  };

  return (
    <section id="categories" className="py-12 bg-[#F7F7F5] dark:bg-[#17181A] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-8">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#666A70] dark:text-[#9DA2A9] mb-2">
            Curated Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#17181A] dark:text-[#F7F7F5]">
            Shop by Category
          </h2>
        </div>

        {/* Horizontal Category Navigation */}
        <div className="flex items-center justify-start md:justify-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar pb-4 pt-2 px-2">
          {CATEGORIES.map((cat) => {
            const isActive =
              (cat.id === "ALL" && (!currentCategory || currentCategory === "ALL")) ||
              currentCategory.toLowerCase() === cat.id.toLowerCase();

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelect(cat.id)}
                className="flex flex-col items-center group cursor-pointer shrink-0 transition-transform duration-300 focus:outline-none"
              >
                {/* Image-based Circular Container */}
                <div
                  className={`relative h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden p-1 transition-all duration-300 ${
                    isActive
                      ? "ring-2 ring-[#17181A] dark:ring-[#F7F7F5] ring-offset-4 ring-offset-[#F7F7F5] dark:ring-offset-[#17181A]"
                      : "opacity-75 group-hover:opacity-100 group-hover:scale-105"
                  }`}
                >
                  <div className="relative h-full w-full rounded-full overflow-hidden bg-[#ECEDEA] dark:bg-[#24272B]">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 96px, 112px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Name & Active Indicator */}
                <div className="mt-3 flex flex-col items-center">
                  <span
                    className={`text-xs sm:text-sm font-medium tracking-wide transition-colors ${
                      isActive
                        ? "text-[#17181A] dark:text-[#F7F7F5] font-semibold"
                        : "text-[#666A70] dark:text-[#9DA2A9] group-hover:text-[#17181A] dark:group-hover:text-[#F7F7F5]"
                    }`}
                  >
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-[#666A70] dark:text-[#9DA2A9] mt-0.5 hidden sm:block">
                    {cat.tagline}
                  </span>
                  {isActive && (
                    <div className="h-0.5 w-6 bg-[#A8B2A5] mt-1 rounded-full animate-in fade-in duration-300" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
