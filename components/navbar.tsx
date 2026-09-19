"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartButton } from "@/components/cart-button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/60 bg-white/90 backdrop-blur-md dark:border-neutral-800/60 dark:bg-neutral-950/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mivo Brand Logo */}
        <Link href="/" className="flex flex-col group">
          <span className="font-bold text-xl tracking-widest text-neutral-900 dark:text-white uppercase font-serif">
            Mivo
          </span>
          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans tracking-tight hidden sm:inline-block">
            Things you&apos;ll want to keep around.
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/#products"
            className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/#categories"
            className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/#about"
            className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Right Actions: Bag & Theme Toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <CartButton />

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200/80 bg-white px-6 py-5 dark:border-neutral-800/80 dark:bg-neutral-950 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/#products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 py-1"
            >
              Shop
            </Link>
            <Link
              href="/#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 py-1"
            >
              Categories
            </Link>
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 py-1"
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
