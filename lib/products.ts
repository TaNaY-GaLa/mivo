export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // INR
  originalPrice?: number;
  category: "Audio" | "Desk" | "Carry" | "Accessories";
  image: string;
  rating: number;
  reviewsCount: number;
  features: string[];
  specs: Record<string, string>;
  isFeatured?: boolean;
  inStock: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: "mivo-001",
    slug: "mivo-studio-headphones-v1",
    name: "Studio Wireless Headphones",
    tagline: "Acoustic precision, minimalist form.",
    description:
      "Crafted with memory foam cushions, high-definition acoustic drivers, and lightweight aluminum arms. Designed for long listening sessions with active noise cancellation and multi-point bluetooth connection.",
    price: 14999,
    originalPrice: 16999,
    category: "Audio",
    image: "/images/products/studio-headphones.jpg",
    rating: 4.9,
    reviewsCount: 128,
    features: [
      "Custom 40mm beryllium drivers",
      "Up to 36 hours continuous playback",
      "Active Noise Cancellation with Transparency Mode",
      "Supple lambskin memory foam ear cushions",
      "USB-C fast charging (15 min charge = 5 hours playback)",
    ],
    specs: {
      Connectivity: "Bluetooth 5.3 & 3.5mm Audio",
      "Battery Life": "36 Hours",
      Weight: "245 grams",
      Warranty: "2 Years Mivo Warranty",
    },
    isFeatured: true,
    inStock: true,
  },
  {
    id: "mivo-002",
    slug: "mivo-tactile-mechanical-keyboard",
    name: "Tactile Mechanical Keyboard",
    tagline: "Satisfying tactile feedback for everyday writing.",
    description:
      "Built with a solid aluminum frame, custom tuned tactile switches, and durable PBT keycaps. Features customizable white backlighting and seamless wireless pairing across three devices.",
    price: 8999,
    originalPrice: 9999,
    category: "Desk",
    image: "/images/products/mechanical-keyboard.jpg",
    rating: 4.8,
    reviewsCount: 94,
    features: [
      "Custom tuned lubricated tactile switches",
      "Solid CNC anodized aluminum chassis",
      "Dye-sublimated PBT keycaps for durability",
      "Multi-device pairing via Bluetooth & 2.4GHz dongle",
      "Removable braided USB-C cable included",
    ],
    specs: {
      Layout: "75% Compact (84 Keys)",
      Switches: "Mivo Custom Tactile (45g)",
      Battery: "4000 mAh (Up to 120 hrs)",
      Compatibility: "macOS, Windows, iOS, Android",
    },
    isFeatured: true,
    inStock: true,
  },
  {
    id: "mivo-003",
    slug: "mivo-wool-desk-mat",
    name: "Crafted Wool Desk Mat",
    tagline: "Soft merino wool to anchor your workspace.",
    description:
      "Made from 100% natural merino wool felt with a non-slip natural cork backing. Protects your desk surface, dampens keyboard acoustics, and adds warm texture to any workspace.",
    price: 2499,
    category: "Desk",
    image: "/images/products/crafted-desk-mat.jpg",
    rating: 4.7,
    reviewsCount: 62,
    features: [
      "100% biodegradable merino wool felt",
      "Eco-friendly non-slip natural cork backing",
      "Water-repellent anti-pill coating",
      "Smooth mouse tracking surface",
      "Precision die-cut rounded corners",
    ],
    specs: {
      Dimensions: "900mm × 300mm × 4mm",
      Material: "Merino Wool & Cork",
      Care: "Spot clean with damp cloth",
      Origin: "Made in India",
    },
    isFeatured: true,
    inStock: true,
  },
  {
    id: "mivo-004",
    slug: "mivo-walnut-wireless-charger",
    name: "Solid Walnut Wireless Charger",
    tagline: "Fast MagSafe charging wrapped in natural wood.",
    description:
      "Precision-milled from a single block of solid walnut wood with a heavy zinc alloy base. Delivers up to 15W fast wireless charging for Qi and MagSafe compatible devices.",
    price: 3499,
    originalPrice: 3999,
    category: "Accessories",
    image: "/images/products/wireless-charger.jpg",
    rating: 4.9,
    reviewsCount: 81,
    features: [
      "Sustainably sourced solid American walnut wood",
      "Weighted anti-slip base for single-handed pick up",
      "15W fast wireless charging output",
      "Braided 1.5m nylon USB-C cable included",
      "Built-in overcurrent and temperature protection",
    ],
    specs: {
      Output: "5W / 7.5W / 10W / 15W Max",
      Material: "Solid Walnut & Zinc Alloy",
      Dimensions: "95mm × 95mm × 14mm",
      Connector: "USB-C",
    },
    isFeatured: true,
    inStock: true,
  },
  {
    id: "mivo-005",
    slug: "mivo-commuter-leather-daypack",
    name: "Weatherproof Leather Daypack",
    tagline: "Refined capacity for daily movement.",
    description:
      "Constructed with water-resistant waxed canvas and full-grain leather accents. Features a padded 16-inch laptop sleeve, quick-access passport pocket, and ergonomic shoulder straps.",
    price: 6999,
    originalPrice: 7999,
    category: "Carry",
    image: "/images/products/leather-daypack.jpg",
    rating: 4.8,
    reviewsCount: 57,
    features: [
      "Water-resistant 18oz waxed canvas shell",
      "Full-grain vegetable-tanned leather trim",
      "Padded compartment fits up to 16\" laptop",
      "Luggage pass-through strap for travel",
      "Heavy-duty YKK weatherproof zippers",
    ],
    specs: {
      Capacity: "20 Liters",
      Dimensions: "44cm × 30cm × 15cm",
      Weight: "1.1 kg",
      "Laptop Sleeve": "Up to 16-inch MacBook Pro",
    },
    isFeatured: true,
    inStock: true,
  },
  {
    id: "mivo-006",
    slug: "mivo-wireless-acoustics-earbuds",
    name: "Wireless Acoustics Earbuds",
    tagline: "Pure audio clarity in a compact case.",
    description:
      "Ergonomically contoured earbuds featuring custom balanced armature drivers, IPX5 water resistance, and an anodized aluminum wireless charging case.",
    price: 5499,
    category: "Audio",
    image: "/images/products/wireless-earbuds.jpg",
    rating: 4.6,
    reviewsCount: 43,
    features: [
      "Dual hybrid drivers for deep bass & clear mids",
      "IPX5 splash and sweat resistance",
      "Total 28 hours playtime with pocket charging case",
      "Dual beamforming microphones for clear calls",
      "Touch controls for playback and volume",
    ],
    specs: {
      "Battery Life": "7 Hours (28 Hours with Case)",
      Waterproof: "IPX5 Rating",
      Weight: "4.5g per earbud",
      Charging: "Wireless Qi & USB-C",
    },
    isFeatured: false,
    inStock: true,
  },
];

export function getProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((product) => product.isFeatured);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((product) => product.category === category);
}

export function getRelatedProducts(currentSlug: string, limit = 3): Product[] {
  return PRODUCTS.filter((product) => product.slug !== currentSlug).slice(0, limit);
}
