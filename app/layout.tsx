import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mivo-lifestyle.example.com"),
  title: {
    default: "Mivo — Things you'll want to keep around.",
    template: "%s | Mivo",
  },
  description:
    "A curated collection of everyday products designed to fit naturally into your life. Audio, desk accessories, carry essentials, and tech accessories.",
  keywords: [
    "Mivo",
    "Everyday Essentials",
    "Studio Headphones",
    "Wool Desk Mat",
    "Mechanical Keyboard",
    "Wireless Charger",
    "Leather Daypack",
  ],
  authors: [{ name: "Mivo Design Studio" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://mivo-lifestyle.example.com",
    title: "Mivo — Things you'll want to keep around.",
    description:
      "A curated collection of everyday products designed to fit naturally into your life.",
    siteName: "Mivo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mivo — Things you'll want to keep around.",
    description: "Everyday products designed to fit naturally into your life.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#F7F7F5] dark:bg-[#17181A] text-[#17181A] dark:text-[#F7F7F5] transition-colors">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
