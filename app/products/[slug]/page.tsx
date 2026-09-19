import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Star, CheckCircle, Shield, Truck } from "lucide-react";
import { getProductBySlug, getRelatedProducts, PRODUCTS } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { ProductDetailsActions } from "@/components/product-details-actions";
import { ProductGrid } from "@/components/product-grid";
import { Badge } from "@/components/ui/badge";

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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Back Navigation */}
      <div>
        <Link
          href="/#products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Product Image Preview */}
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 text-xs tracking-wide">
              {product.category}
            </Badge>
          </div>
        </div>

        {/* Product Information & Details */}
        <div className="flex flex-col space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-500 font-medium mb-2">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="font-bold text-neutral-900 dark:text-white text-sm">
                {product.rating}
              </span>
              <span className="text-neutral-400 dark:text-neutral-500">({product.reviewsCount} customer reviews)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-neutral-900 dark:text-white tracking-tight">
              {product.name}
            </h1>

            <p className="text-base text-neutral-600 dark:text-neutral-300 font-medium mt-2">
              {product.tagline}
            </p>
          </div>

          <div className="flex items-baseline gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-3xl font-bold text-neutral-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 ml-auto">
              In Stock & Ready to Ship
            </span>
          </div>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {product.description}
          </p>

          {/* Key Features List */}
          <div className="space-y-2.5 pt-2">
            <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">
              Product Highlights
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700 dark:text-neutral-300">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Specifications */}
          <div className="space-y-2.5 pt-2">
            <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">
              Product Specifications
            </h3>
            <div className="divide-y divide-neutral-200/60 dark:divide-neutral-800 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/50 p-4 text-xs">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 first:pt-0 last:pb-0">
                  <span className="text-neutral-500 dark:text-neutral-400">{key}</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-4 text-xs text-neutral-500 dark:text-neutral-400 pt-2">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              <span>Free Delivery across India</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              <span>2-Year Mivo Warranty</span>
            </div>
          </div>

          {/* Quantity & Bag/Buy Now Actions */}
          <ProductDetailsActions product={product} />
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-neutral-200 dark:border-neutral-800 space-y-8">
          <h2 className="text-2xl font-serif font-medium text-neutral-900 dark:text-white">
            You might also like
          </h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
