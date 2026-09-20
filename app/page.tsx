import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, ShieldCheck, Compass, HeartHandshake } from "lucide-react";
import { getProducts } from "@/lib/products";
import { CategoryNavigation } from "@/components/category-navigation";
import { CatalogueSection } from "@/components/catalogue-section";
import { formatPrice } from "@/lib/utils";

export default function HomePage() {
  const products = getProducts();
  const heroProduct = products.find((p) => p.slug === "mivo-studio-headphones-v1") ?? products[0];
  const spotlightProduct = products.find((p) => p.slug === "mivo-studio-monitors") ?? products[3];

  return (
    <div className="space-y-16 bg-[#F7F7F5] dark:bg-[#17181A] text-[#17181A] dark:text-[#F7F7F5] transition-colors pb-20">
      
      {/* ─── 1. HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#E5E6E3] dark:border-[#2D3035] pt-12 pb-16 sm:pt-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Column: Editorial Headline & Single CTA */}
            <div className="lg:col-span-6 space-y-6 animate-fade-in-up">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9] block">
                Mivo Lifestyle Collection
              </span>

              <h1 className="font-serif text-4xl font-normal leading-[1.15] tracking-tight sm:text-6xl text-[#17181A] dark:text-[#F7F7F5]">
                Things you&apos;ll want to <br />
                <span className="italic text-[#666A70] dark:text-[#9DA2A9]">
                  keep around.
                </span>
              </h1>

              <p className="max-w-xl text-sm leading-relaxed text-[#666A70] dark:text-[#9DA2A9] sm:text-base">
                A curated collection of everyday products designed to fit naturally into your life.
                Engineered with merino wool, solid walnut, full-grain leather, and acoustic precision.
              </p>

              {/* Single Clear CTA */}
              <div className="pt-4 flex items-center gap-6">
                <a
                  href="#catalogue"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#17181A] dark:bg-[#F7F7F5] px-8 py-4 text-xs font-semibold uppercase tracking-widest text-[#F7F7F5] dark:text-[#17181A] hover:bg-[#666A70] dark:hover:bg-[#E5E6E3] transition-all cursor-pointer shadow-sm"
                >
                  Explore Catalogue
                  <ArrowRight className="h-4 w-4" />
                </a>

                <div className="hidden sm:flex flex-col text-xs border-l border-[#E5E6E3] dark:border-[#2D3035] pl-5">
                  <span className="text-[#666A70] dark:text-[#9DA2A9] font-medium">Featured Object</span>
                  <span className="font-serif text-sm font-semibold text-[#17181A] dark:text-[#F7F7F5] mt-0.5">
                    {heroProduct.name} • {formatPrice(heroProduct.price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Large Lifestyle Photography (LCP Image) */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="relative aspect-4/3 w-full max-w-xl overflow-hidden rounded-2xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#ECEDEA] dark:bg-[#24272B] shadow-sm">
                <Image
                  src={heroProduct.image}
                  alt={heroProduct.name}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 2. SHOP BY CATEGORY (Image-led Circular Navigation) ─────────────── */}
      <Suspense fallback={<div className="h-48 bg-[#F7F7F5] animate-pulse" />}>
        <CategoryNavigation />
      </Suspense>

      {/* ─── 3. FEATURED PRODUCTS / CATALOGUE ───────────────────────────────── */}
      <Suspense fallback={<div className="h-96 bg-[#F7F7F5] animate-pulse" />}>
        <CatalogueSection products={products} />
      </Suspense>

      {/* ─── 4. LARGE EDITORIAL PRODUCT SPOTLIGHT ───────────────────────────── */}
      <section id="editorial" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] p-8 sm:p-12">
          <div className="lg:col-span-7 relative aspect-16/10 w-full overflow-hidden rounded-xl bg-[#ECEDEA] dark:bg-[#24272B]">
            <Image
              src={spotlightProduct.image}
              alt={spotlightProduct.name}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9]">
              Editorial Spotlight
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#17181A] dark:text-[#F7F7F5]">
              {spotlightProduct.name}
            </h2>
            <p className="text-sm leading-relaxed text-[#666A70] dark:text-[#9DA2A9]">
              {spotlightProduct.description}
            </p>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xl font-semibold text-[#17181A] dark:text-[#F7F7F5]">
                {formatPrice(spotlightProduct.price)}
              </span>
              <Link
                href={`/products/${spotlightProduct.slug}`}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#17181A] dark:text-[#F7F7F5] hover:text-[#666A70] transition-colors"
              >
                View Details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. FINAL DISCOVERY & BRAND PHILOSOPHY ──────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10 rounded-2xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#ECEDEA]/50 dark:bg-[#24272B]/50 p-8 sm:p-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9]">
              The Mivo Philosophy
            </span>
            <h2 className="font-serif text-3xl font-normal text-[#17181A] dark:text-[#F7F7F5] sm:text-4xl">
              Everyday objects engineered with quiet confidence and lasting utility.
            </h2>
            <p className="text-sm leading-relaxed text-[#666A70] dark:text-[#9DA2A9]">
              We believe daily tools should carry quiet elegance. By pairing natural materials like merino wool, solid walnut wood, and full-grain leather with precision electronics, Mivo creates objects you&apos;ll want to keep around.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 border-t border-[#E5E6E3] dark:border-[#2D3035] pt-8 md:grid-cols-3">
            <div className="space-y-2">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] text-[#17181A] dark:text-[#F7F7F5]">
                <Compass className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#17181A] dark:text-[#F7F7F5]">Thoughtful Utility</h3>
              <p className="text-xs leading-relaxed text-[#666A70] dark:text-[#9DA2A9]">
                Every material choice serves a clear function, removing excess to highlight natural quality.
              </p>
            </div>

            <div className="space-y-2">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] text-[#17181A] dark:text-[#F7F7F5]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#17181A] dark:text-[#F7F7F5]">Built to Endure</h3>
              <p className="text-xs leading-relaxed text-[#666A70] dark:text-[#9DA2A9]">
                Crafted with durable metals, sustainable woods, and weather-resistant canvas made for daily use.
              </p>
            </div>

            <div className="space-y-2">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] text-[#17181A] dark:text-[#F7F7F5]">
                <HeartHandshake className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#17181A] dark:text-[#F7F7F5]">Contemporary Craft</h3>
              <p className="text-xs leading-relaxed text-[#666A70] dark:text-[#9DA2A9]">
                Warm tones, tactile textures, and balanced proportions designed for modern living.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}