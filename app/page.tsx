import { ArrowRight, Compass, ShieldCheck, HeartHandshake } from "lucide-react";
import { getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/product-grid";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const products = getProducts();

 const categories = [
  {
    name: "Audio",
    description: "Studio headphones & wireless acoustics",
    count: "2 Items",
  },
  {
    name: "Desk",
    description: "Wool desk mats & mechanical keyboards",
    count: "2 Items",
  },
  {
    name: "Carry",
    description: "Weatherproof canvas & leather daypacks",
    count: "1 Item",
  },
  {
    name: "Accessories",
    description: "Solid walnut wireless charging docks",
    count: "1 Item",
  },
];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-neutral-200/60 bg-gradient-to-b from-neutral-50/80 to-white py-24 transition-colors dark:border-neutral-800/60 dark:from-neutral-950 dark:to-neutral-900/50 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-8 text-center">

            {/* Collection Label */}
            <div className="inline-flex items-center rounded-full border border-neutral-200/80 bg-white/80 px-4 py-1.5 text-xs font-medium text-neutral-600 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-400">
              Mivo Lifestyle Collection
            </div>

            {/* Hero Heading */}
            <div className="space-y-3">
              <span className="block font-serif text-2xl font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-400 sm:text-3xl">
                Mivo
              </span>

              <h1 className="font-serif text-4xl font-medium leading-[1.15] tracking-tight text-neutral-900 dark:text-white sm:text-6xl">
                Things you&apos;ll want to <br />
                <span className="font-sans font-light italic text-neutral-500 dark:text-neutral-400">
                  keep around.
                </span>
              </h1>
            </div>

            {/* Hero Description */}
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg">
              A curated collection of everyday products designed to fit
              naturally into your life. Built with natural materials, tactile
              precision, and quiet durability.
            </p>

            {/* Hero Actions */}
            <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
              <a href="#products">
                <Button
                  size="lg"
                  className="w-full gap-2.5 rounded-xl px-8 py-6 text-sm font-medium shadow-md sm:w-auto"
                >
                  Shop now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>

              <a href="#categories">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-xl px-8 py-6 text-sm font-medium sm:w-auto"
                >
                  Explore categories
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section
        id="categories"
        className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-end justify-between border-b border-neutral-200/80 pb-4 dark:border-neutral-800/80">
          <div>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Curated Selection
            </span>

            <h2 className="font-serif text-2xl font-medium tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
              Shop by Category
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <a
              key={cat.name}
              href="#products"
              data-category={cat.name}
              className="group space-y-3 rounded-2xl border border-neutral-200/80 bg-white p-6 transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/60"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-neutral-900 transition-colors group-hover:text-neutral-600 dark:text-white dark:group-hover:text-neutral-300">
                    {cat.name}
                  </h3>
                </div>

                <span className="text-xs font-medium text-neutral-400">
                  {cat.count}
                </span>
              </div>

              <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                {cat.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section
        id="products"
        className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col justify-between gap-4 border-b border-neutral-200/80 pb-4 dark:border-neutral-800/80 md:flex-row md:items-end">
          <div>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Complete Collection
            </span>

            <h2 className="font-serif text-2xl font-medium tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
              Featured Products
            </h2>
          </div>

          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {products.length} products available
          </span>
        </div>

        <ProductGrid products={products} />
      </section>

      {/* Editorial Section / Brand Philosophy */}
      <section
        id="about"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="space-y-12 rounded-3xl border border-neutral-200/80 bg-neutral-100/70 p-8 dark:border-neutral-800/80 dark:bg-neutral-900/40 sm:p-14">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              The Mivo Philosophy
            </span>

            <h2 className="font-serif text-2xl font-medium leading-snug text-neutral-900 dark:text-white sm:text-3xl">
              Everyday objects engineered with quiet confidence and lasting
              utility.
            </h2>

            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
              We believe daily tools should carry quiet elegance. By pairing
              natural materials like merino wool, solid walnut wood, and
              full-grain leather with precision electronics, Mivo creates
              objects you&apos;ll want to keep around.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 border-t border-neutral-200/80 pt-6 dark:border-neutral-800/80 md:grid-cols-3">
            {/* Thoughtful Utility */}
            <div className="space-y-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                <Compass className="h-5 w-5" />
              </div>

              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Thoughtful Utility
              </h3>

              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                Every material choice serves a clear function, removing excess
                to highlight natural quality.
              </p>
            </div>

            {/* Built to Endure */}
            <div className="space-y-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Built to Endure
              </h3>

              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                Crafted with durable metals, sustainable woods, and
                weather-resistant canvas made for daily use.
              </p>
            </div>

            {/* Contemporary Indian Craft */}
            <div className="space-y-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                <HeartHandshake className="h-5 w-5" />
              </div>

              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Contemporary Indian Craft
              </h3>

              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                Warm tones, tactile textures, and balanced proportions
                designed for modern living.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}