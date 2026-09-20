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
  // ─── AUDIO (4 Products) ──────────────────────────────────────────────────
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
    slug: "mivo-wireless-acoustics-earbuds",
    name: "Wireless Acoustics Earbuds",
    tagline: "Pure audio clarity in a compact case.",
    description:
      "Ergonomically contoured earbuds featuring custom balanced armature drivers, IPX5 water resistance, and an anodized aluminum wireless charging case.",
    price: 5499,
    originalPrice: 6499,
    category: "Audio",
    image: "/images/products/wireless-earbuds.jpg",
    rating: 4.7,
    reviewsCount: 84,
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
    isFeatured: true,
    inStock: true,
  },
  {
    id: "mivo-003",
    slug: "mivo-portable-speaker",
    name: "Aura Portable Speaker",
    tagline: "Rich 360-degree sound for open spaces.",
    description:
      "Precision-milled aluminum chassis producing room-filling acoustic output with deep bass response and 24-hour battery endurance.",
    price: 8999,
    originalPrice: 9999,
    category: "Audio",
    image: "/images/products/portable-speaker.jpg",
    rating: 4.8,
    reviewsCount: 62,
    features: [
      "Custom neodymium acoustic drivers & dual passive radiators",
      "IP67 dustproof and waterproof build",
      "Multi-speaker pairing for stereo sound field",
      "Seamless touch panel with haptic feedback",
    ],
    specs: {
      Connectivity: "Bluetooth 5.3",
      "Battery Life": "24 Hours",
      Dimensions: "180mm × 85mm",
      Weight: "580g",
    },
    isFeatured: false,
    inStock: true,
  },
  {
    id: "mivo-004",
    slug: "mivo-studio-monitors",
    name: "Over-Ear Studio Monitors",
    tagline: "Uncompromising spatial precision for creators.",
    description:
      "Open-back reference headphones engineered for mixing, mastering, and critical listening. Features planar magnetic transducers and plush velour padding.",
    price: 21999,
    originalPrice: 24999,
    category: "Audio",
    image: "/images/products/studio-monitors.jpg",
    rating: 4.9,
    reviewsCount: 41,
    features: [
      "50mm planar magnetic transducers",
      "Ultra-wide 5Hz - 45kHz frequency response",
      "Detachable audiophile grade silver-plated cable",
      "Breathable velour acoustic ear pads",
    ],
    specs: {
      Impedance: "32 Ohms",
      Cable: "3m Braided 6.35mm / 3.5mm",
      Weight: "310g",
      Warranty: "3 Years Mivo Pro Warranty",
    },
    isFeatured: false,
    inStock: true,
  },

  // ─── DESK (4 Products) ───────────────────────────────────────────────────
  {
    id: "mivo-005",
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
    id: "mivo-006",
    slug: "mivo-wool-desk-mat",
    name: "Crafted Wool Desk Mat",
    tagline: "Soft merino wool to anchor your workspace.",
    description:
      "Made from 100% natural merino wool felt with a non-slip natural cork backing. Protects your desk surface, dampens keyboard acoustics, and adds warm texture to any workspace.",
    price: 2499,
    originalPrice: 2999,
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
    id: "mivo-007",
    slug: "mivo-charging-stand",
    name: "MagDual Charging Stand",
    tagline: "Floating magnetic power for desk setup.",
    description:
      "Dual wireless charging architecture holding phone at an ergonomic viewing angle while powering wireless earbuds simultaneously.",
    price: 4499,
    originalPrice: 4999,
    category: "Desk",
    image: "/images/products/charging-stand.jpg",
    rating: 4.9,
    reviewsCount: 53,
    features: [
      "Solid weighted zinc alloy base with non-slip silicone",
      "15W MagSafe fast charging for smartphone",
      "5W secondary pad for wireless earbuds",
      "Integrated braided 1.8m USB-C power cable",
    ],
    specs: {
      Power: "20W Total Fast Charge",
      Material: "Anodized Aluminum & Zinc",
      Height: "145mm",
      Weight: "420g",
    },
    isFeatured: false,
    inStock: true,
  },
  {
    id: "mivo-008",
    slug: "mivo-minimal-desk-lamp",
    name: "Lumina Minimal Desk Lamp",
    tagline: "Glare-free architectural illumination.",
    description:
      "Slim linear LED luminaire with capacitive touch dimming, automatic ambient light sensor, and high CRI spectrum designed to eliminate eye fatigue.",
    price: 6499,
    originalPrice: 7499,
    category: "Desk",
    image: "/images/products/minimal-desk-lamp.jpg",
    rating: 4.8,
    reviewsCount: 38,
    features: [
      "High CRI (>95) true color spectrum LEDs",
      "Dual articulated aluminum arm with 360 rotation",
      "Capacitive touch brightness slider (10% - 100%)",
      "Auto ambient light level sensor",
    ],
    specs: {
      Power: "12W Energy Efficient LED",
      ColorTemp: "2700K - 5000K Adjustable",
      Height: "420mm",
      Base: "Weighted Cast Aluminum",
    },
    isFeatured: false,
    inStock: true,
  },

  // ─── CARRY (3 Products) ──────────────────────────────────────────────────
  {
    id: "mivo-009",
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
    id: "mivo-010",
    slug: "mivo-everyday-tote",
    name: "Structured Everyday Tote",
    tagline: "Understated elegance for city travel.",
    description:
      "Handcrafted from heavy cotton duck canvas reinforced with full-grain leather trim and brass hardware. Includes magnetic closure and padded laptop divider.",
    price: 4999,
    originalPrice: 5499,
    category: "Carry",
    image: "/images/products/everyday-tote.jpg",
    rating: 4.7,
    reviewsCount: 46,
    features: [
      "Organic heavy-weight canvas body",
      "Full-grain leather carry handles & base trim",
      "Internal 14-inch sleeve & zippered phone pocket",
      "Magnetic silent top closure",
    ],
    specs: {
      Capacity: "16 Liters",
      Dimensions: "38cm × 34cm × 14cm",
      Weight: "780g",
    },
    isFeatured: false,
    inStock: true,
  },
  {
    id: "mivo-011",
    slug: "mivo-tech-organizer",
    name: "Leather Tech Organizer",
    tagline: "Essential cable management, compact form.",
    description:
      "Structured accessory pouch with elastic loop dividers, zippered mesh pockets, and weather-resistant shell to keep cables and dongles protected.",
    price: 2999,
    originalPrice: 3499,
    category: "Carry",
    image: "/images/products/tech-organizer.jpg",
    rating: 4.9,
    reviewsCount: 72,
    features: [
      "Weather-resistant cordura exterior",
      "Soft micro-fleece interior lining",
      "Custom elastic organizing loops for cables & pens",
      "External quick-access ticket slip pocket",
    ],
    specs: {
      Dimensions: "24cm × 15cm × 6cm",
      Weight: "220g",
      Zippers: "YKK AquaGuard",
    },
    isFeatured: false,
    inStock: true,
  },

  // ─── ACCESSORIES (3 Products) ─────────────────────────────────────────────
  {
    id: "mivo-012",
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
    id: "mivo-013",
    slug: "mivo-usbc-hub",
    name: "Precision USB-C Multiport Hub",
    tagline: "Uncompromised connectivity for modern laptops.",
    description:
      "Cast aluminum hub extending a single USB-C port to 4K 60Hz HDMI, 100W Power Delivery, SD/MicroSD card readers, and triple High-Speed USB-A ports.",
    price: 3999,
    originalPrice: 4499,
    category: "Accessories",
    image: "/images/products/usbc-hub.jpg",
    rating: 4.8,
    reviewsCount: 59,
    features: [
      "4K @ 60Hz HDMI Video Output",
      "100W USB-C Power Delivery Pass-through",
      "UHS-I SD & MicroSD dual card slots (104MB/s)",
      "Anodized aluminum heat-dissipating shell",
    ],
    specs: {
      Ports: "7-in-1 Expansion",
      Material: "CNC Aluminum",
      CableLength: "15cm Braided",
    },
    isFeatured: false,
    inStock: true,
  },
  {
    id: "mivo-014",
    slug: "mivo-power-bank",
    name: "Compact Titanium Power Bank",
    tagline: "10,000mAh battery backup in ultra-slim profile.",
    description:
      "Aircraft-grade titanium shell encasing high-density lithium polymer cells with 30W USB-C Power Delivery charging.",
    price: 4999,
    originalPrice: 5499,
    category: "Accessories",
    image: "/images/products/power-bank.jpg",
    rating: 4.8,
    reviewsCount: 65,
    features: [
      "10,000 mAh high-density capacity",
      "30W USB-C Fast Charging input & output",
      "Discrete white LED battery status indicator",
      "Flight approved safety certification",
    ],
    specs: {
      Capacity: "10,000 mAh / 37Wh",
      Dimensions: "138mm × 68mm × 12mm",
      Weight: "195g",
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
  if (!category || category.toUpperCase() === "ALL") return PRODUCTS;
  return PRODUCTS.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );
}

export function getRelatedProducts(currentSlug: string, limit = 3): Product[] {
  return PRODUCTS.filter((product) => product.slug !== currentSlug).slice(0, limit);
}
