import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Star, CheckCircle, Shield, Truck } from "lucide-react";
import { getProductBySlug, getRelatedProducts, PRODUCTS } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { ProductDetailsActions } from "@/components/product-details-actions";
import { ProductCard } from "@/components/product-card";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = getProductBySlug(resolvedParams.slug);

  if (!product) {
    return {
      title: "Product Not Found | Mivo",
    };
  }

  return {
    title: `${product.name} | Mivo`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Mivo`,
      description: product.tagline,
      images: [{ url: product.image }],
    },
  };
}

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product.slug, 3);

  return (
    <div className="bg-[#F7F7F5] dark:bg-[#17181A] text-[#17181A] dark:text-[#F7F7F5] min-h-screen py-10 pb-24 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Navigation */}
        <div>
          <Link
            href="/#catalogue"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9] hover:text-[#17181A] dark:hover:text-[#F7F7F5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalogue
          </Link>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Product Image Preview */}
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#ECEDEA] dark:bg-[#24272B]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-[#F7F7F5]/90 dark:bg-[#17181A]/90 text-[#666A70] dark:text-[#9DA2A9] text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full border border-[#E5E6E3] dark:border-[#2D3035] backdrop-blur-sm">
                {product.category}
              </span>
            </div>
          </div>

          {/* Product Information & Details */}
          <div className="flex flex-col space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#666A70] dark:text-[#9DA2A9] mb-2">
                <Star className="w-4 h-4 fill-[#A8B2A5] text-[#A8B2A5]" />
                <span className="font-semibold text-[#17181A] dark:text-[#F7F7F5]">
                  {product.rating}
                </span>
                <span>({product.reviewsCount} reviews)</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif text-[#17181A] dark:text-[#F7F7F5] tracking-tight">
                {product.name}
              </h1>

              <p className="text-sm text-[#666A70] dark:text-[#9DA2A9] font-medium mt-1.5">
                {product.tagline}
              </p>
            </div>

            <div className="flex items-baseline gap-3 pb-4 border-b border-[#E5E6E3] dark:border-[#2D3035]">
              <span className="text-3xl font-semibold text-[#17181A] dark:text-[#F7F7F5]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#666A70] dark:text-[#9DA2A9] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 ml-auto">
                In Stock &amp; Ready to Ship
              </span>
            </div>

            <p className="text-sm text-[#666A70] dark:text-[#9DA2A9] leading-relaxed">
              {product.description}
            </p>

            {/* Key Features List */}
            <div className="space-y-3 pt-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9]">
                Product Highlights
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#17181A] dark:text-[#F7F7F5]">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#A8B2A5] shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Product Specifications */}
            <div className="space-y-3 pt-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9]">
                Technical Specifications
              </h3>
              <div className="divide-y divide-[#E5E6E3] dark:divide-[#2D3035] rounded-xl border border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#1E2023] p-4 text-xs">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2.5 first:pt-0 last:pb-0">
                    <span className="text-[#666A70] dark:text-[#9DA2A9]">{key}</span>
                    <span className="font-medium text-[#17181A] dark:text-[#F7F7F5]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantee Badges */}
            <div className="grid grid-cols-2 gap-4 text-xs text-[#666A70] dark:text-[#9DA2A9] pt-2 border-t border-[#E5E6E3] dark:border-[#2D3035]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#A8B2A5]" />
                <span>Free Delivery across India</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#A8B2A5]" />
                <span>2-Year Mivo Warranty</span>
              </div>
            </div>

            {/* Quantity & Bag/Buy Now Actions */}
            <ProductDetailsActions product={product} />
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-16 border-t border-[#E5E6E3] dark:border-[#2D3035] space-y-8">
            <h2 className="text-2xl font-serif text-[#17181A] dark:text-[#F7F7F5]">
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
