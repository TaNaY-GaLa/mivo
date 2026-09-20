import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-[#E5E6E3] dark:border-[#2D3035] bg-[#FFFFFF] dark:bg-[#17181A] text-[#17181A] dark:text-[#F7F7F5] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <h3 className="text-2xl font-serif tracking-tight text-[#17181A] dark:text-[#F7F7F5]">
              Mivo
            </h3>
            <p className="text-xs text-[#666A70] dark:text-[#9DA2A9] leading-relaxed max-w-xs font-sans">
              Things you&apos;ll want to keep around.
            </p>
            <p className="text-xs text-[#666A70] dark:text-[#9DA2A9] pt-2 font-sans">
              Curated everyday technology, workspace ergonomics, and carry essentials.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-sans text-[#666A70] dark:text-[#9DA2A9]">
              <li>
                <Link href="/#catalogue" className="hover:text-[#17181A] dark:hover:text-[#F7F7F5] transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-[#17181A] dark:hover:text-[#F7F7F5] transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/#editorial" className="hover:text-[#17181A] dark:hover:text-[#F7F7F5] transition-colors">
                  Editorial Spotlight
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-[#17181A] dark:hover:text-[#F7F7F5] transition-colors">
                  Bag &amp; Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9]">
              Categories
            </h4>
            <ul className="space-y-2 text-xs font-sans text-[#666A70] dark:text-[#9DA2A9]">
              <li>
                <Link href="/?category=audio#catalogue" className="hover:text-[#17181A] dark:hover:text-[#F7F7F5] transition-colors">
                  Audio &amp; Acoustics
                </Link>
              </li>
              <li>
                <Link href="/?category=desk#catalogue" className="hover:text-[#17181A] dark:hover:text-[#F7F7F5] transition-colors">
                  Desk Essentials
                </Link>
              </li>
              <li>
                <Link href="/?category=carry#catalogue" className="hover:text-[#17181A] dark:hover:text-[#F7F7F5] transition-colors">
                  Carry &amp; Travel
                </Link>
              </li>
              <li>
                <Link href="/?category=accessories#catalogue" className="hover:text-[#17181A] dark:hover:text-[#F7F7F5] transition-colors">
                  Tech Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9]">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs font-sans text-[#666A70] dark:text-[#9DA2A9]">
              <li>Shipping across India</li>
              <li>30-Day Effortless Returns</li>
              <li>2-Year Mivo Warranty</li>
              <li>support@mivo.example.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#E5E6E3] dark:border-[#2D3035] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666A70] dark:text-[#9DA2A9]">
          <p>© {new Date().getFullYear()} Mivo Lifestyle &amp; Technologies. All rights reserved.</p>
          <div className="flex gap-6 text-xs">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Shipping Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
