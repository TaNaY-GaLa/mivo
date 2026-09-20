"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartButton } from "@/components/cart-button";
import { useSession, signOut } from "@/lib/auth-client";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E6E3] dark:border-[#2D3035] bg-[#F7F7F5]/90 dark:bg-[#17181A]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mivo Brand Logo */}
        <Link href="/" className="flex flex-col group">
          <span className="font-serif text-2xl tracking-tight text-[#17181A] dark:text-[#F7F7F5] group-hover:text-[#666A70] transition-colors">
            Mivo
          </span>
          <span className="text-[10px] text-[#666A70] dark:text-[#9DA2A9] font-sans tracking-wide hidden sm:inline-block">
            Things you&apos;ll want to keep around.
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-widest text-[#666A70] dark:text-[#9DA2A9]">
          <Link
            href="/#categories"
            className="hover:text-[#17181A] dark:hover:text-[#F7F7F5] transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/#catalogue"
            className="hover:text-[#17181A] dark:hover:text-[#F7F7F5] transition-colors"
          >
            Catalogue
          </Link>
          <Link
            href="/#editorial"
            className="hover:text-[#17181A] dark:hover:text-[#F7F7F5] transition-colors"
          >
            Editorial
          </Link>
        </nav>

        {/* Right Actions: Auth, Theme Toggle, Bag */}
        <div className="flex items-center gap-3">
          {session?.user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/account"
                className="flex items-center gap-2 text-xs font-medium text-[#17181A] dark:text-[#F7F7F5] hover:text-[#666A70] px-3.5 py-1.5 rounded-full border border-[#E5E6E3] dark:border-[#2D3035] bg-[#ECEDEA] dark:bg-[#24272B] transition-colors"
              >
                <User className="h-3.5 w-3.5 text-[#666A70] dark:text-[#9DA2A9]" />
                <span className="max-w-[110px] truncate">{session.user.name}</span>
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="p-1.5 text-[#666A70] dark:text-[#9DA2A9] hover:text-[#17181A] dark:hover:text-[#F7F7F5] transition-colors cursor-pointer"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/sign-in"
              className="hidden sm:inline-flex text-xs font-medium uppercase tracking-widest text-[#17181A] dark:text-[#F7F7F5] hover:bg-[#17181A] hover:text-[#F7F7F5] dark:hover:bg-[#F7F7F5] dark:hover:text-[#17181A] px-4 py-1.5 rounded-full border border-[#17181A] dark:border-[#F7F7F5] transition-all"
            >
              Sign In
            </Link>
          )}

          <ThemeToggle />
          <CartButton />

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#666A70] dark:text-[#9DA2A9] hover:bg-[#ECEDEA] dark:hover:bg-[#24272B] hover:text-[#17181A] dark:hover:text-[#F7F7F5] transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E6E3] dark:border-[#2D3035] bg-[#F7F7F5] dark:bg-[#17181A] px-6 py-5 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-medium uppercase tracking-widest text-[#17181A] dark:text-[#F7F7F5] py-1"
            >
              Categories
            </Link>
            <Link
              href="/#catalogue"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-medium uppercase tracking-widest text-[#17181A] dark:text-[#F7F7F5] py-1"
            >
              Catalogue
            </Link>
            <Link
              href="/#editorial"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-medium uppercase tracking-widest text-[#17181A] dark:text-[#F7F7F5] py-1"
            >
              Editorial
            </Link>
            {session?.user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-[#17181A] dark:text-[#F7F7F5] py-1 flex items-center gap-2"
                >
                  <User className="h-4 w-4 text-[#666A70]" /> Account ({session.user.name})
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium text-red-600 dark:text-red-400 text-left py-1 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#17181A] dark:text-[#F7F7F5] py-1 flex items-center gap-2"
              >
                <User className="h-4 w-4 text-[#666A70]" /> Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
