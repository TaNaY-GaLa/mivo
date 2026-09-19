import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200/80 bg-neutral-900 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <h3 className="text-xl font-bold font-serif uppercase tracking-widest text-white">
              Mivo
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs">
              Things you&apos;ll want to keep around.
            </p>
            <p className="text-xs text-neutral-500 pt-2">
              Curated everyday technology, workspace ergonomics, and carry essentials.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#products" className="hover:text-white transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">
                  About Mivo
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition-colors">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#categories" className="hover:text-white transition-colors">
                  Audio & Acoustics
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-white transition-colors">
                  Desk Essentials
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-white transition-colors">
                  Carry & Travel
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-white transition-colors">
                  Tech Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-neutral-400">Shipping & Delivery across India</span>
              </li>
              <li>
                <span className="text-neutral-400">30-Day Effortless Returns</span>
              </li>
              <li>
                <span className="text-neutral-400">2-Year Brand Warranty</span>
              </li>
              <li>
                <span className="text-neutral-400">support@mivo-lifestyle.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Mivo Lifestyle & Technologies. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-neutral-400">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Shipping Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
