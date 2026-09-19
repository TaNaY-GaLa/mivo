# MIVO — Things You'll Want to Keep Around

**MIVO** is a modern consumer shopping application designed for everyday lifestyle products, workplace ergonomics, and technology accessories in India.

Built with Next.js 16 (App Router), React Server Components (RSC), persistent Zustand state, Zod validation, and Server Actions, MIVO delivers a seamless, accessible, and retail-grade shopping experience.

---

## 🚀 Key Features

* **Storefront UX**: Editorial homepage with hero section, category navigation (Audio, Desk, Carry, Accessories), product cards with INR (`₹`) pricing, and brand philosophy.
* **Local Asset Infrastructure**: 100% of product images are local static assets (`public/images/products/`) rendered via `next/image` with zero broken links or external dependencies.
* **Buy Now vs. Add to Bag**:
  * **Add to Bag**: Adds items to the persistent Zustand bag store, updates dynamic navbar counter `Bag (X)`, and displays feedback.
  * **Buy Now**: Immediately opens direct checkout with the selected item.
* **Persistent Bag Drawer**: Persistent `localStorage` bag store with itemized totals, quantity controls, and slide-over drawer UI.
* **Type-Safe Checkout**: Built with React Hook Form, shared Zod schema validation (Indian phone `+91`, 6-digit PIN code, state selection), and multi-option payment selection (UPI, Credit/Debit Card, Cash on Delivery).
* **Server Action Mutations**: `processCheckoutOrder` validates cart items on the server, calculates authoritative pricing, and generates order IDs (`#MIVO-10482`).
* **Dynamic OpenGraph Metadata**: Auto-generated social cards using `next/og` for all routes.
* **Dark / Light Mode**: Seamless theme toggle powered by `next-themes` with hydration safety.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 16 (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS & Vanilla CSS Design Tokens
* **UI Components**: Radix UI Primitives & shadcn/ui
* **Client State**: Zustand with `persist` middleware (`localStorage`)
* **Forms & Validation**: React Hook Form & Zod
* **Icons**: Lucide React
* **Feedback**: Sonner Toast Notifications

---

## 📦 Getting Started

### Prerequisites
* Node.js 18.x or later
* npm / pnpm / yarn

### Installation

1. **Clone repository & install dependencies**:
   ```bash
   npm install
   ```

2. **Run local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📂 Project Architecture

```text
mivo/
├── app/
│   ├── actions/
│   │   └── checkout.ts          # Server Action for order mutations
│   ├── checkout/
│   │   └── page.tsx             # Checkout page layout
│   ├── products/
│   │   └── [slug]/
│   │       └── page.tsx         # Dynamic product detail page (RSC)
│   ├── success/
│   │   └── page.tsx             # Order confirmation page
│   ├── layout.tsx               # Root layout with metadata & theme provider
│   ├── loading.tsx              # Fallback loading skeleton
│   ├── not-found.tsx            # 404 page
│   ├── opengraph-image.tsx      # Dynamic OG image generator
│   └── page.tsx                 # Homepage with hero & category grids
├── components/
│   ├── ui/                      # Radix / shadcn UI components
│   ├── cart-button.tsx          # Dynamic Bag counter button
│   ├── cart-drawer.tsx          # Persistent Bag slide-over drawer
│   ├── checkout-form.tsx        # React Hook Form + Zod form component
│   ├── footer.tsx               # Mivo brand footer
│   ├── navbar.tsx               # Header with Mivo brand & theme toggle
│   ├── order-summary.tsx        # Checkout item summary
│   ├── product-card.tsx         # Product card with Add to Bag / Buy Now
│   └── product-details-actions.tsx # Dynamic quantity & buy actions
├── docs/
│   ├── technical-report.md      # Full architecture & technical breakdown
│   └── viva.md                  # Viva Voce preparation Q&A guide
├── lib/
│   ├── schemas/
│   │   └── checkout.ts          # Shared Zod validation schema
│   ├── products.ts              # Product model & local catalogue
│   └── utils.ts                 # Helper functions & INR formatting
├── public/
│   └── images/
│       └── products/            # Local product image assets (.jpg)
└── store/
    └── cart-store.ts            # Zustand persistent client store
```

---

## 📄 Documentation Links

* [Technical Report](docs/technical-report.md)
* [Viva Voce Q&A Guide](docs/viva.md)
