# Viva Voce Examination Guide: MIVO Architecture & Full-Stack Next.js

---

## 1. Next.js App Router Architecture

### Q1: Why use Next.js App Router over the older Pages Router?
**Answer**: Next.js App Router introduces React Server Components (RSC) by default, streaming layouts (`layout.tsx`), error boundaries (`error.tsx`), suspense loading fallbacks (`loading.tsx`), and Server Actions for backend data mutations without needing custom `/api/` routing boilerplate.

### Q2: What is the fundamental difference between Server Components and Client Components?
**Answer**: Server Components render exclusively on the Node.js server environment; their code and dependencies are omitted from the client JavaScript bundle sent to the browser. Client Components (marked with `"use client"`) are pre-rendered to HTML on the server and hydrated on the browser to handle interactivity, state hooks (`useState`, `useEffect`), and event handlers (`onClick`).

### Q3: When should you use the `"use client"` directive?
**Answer**: `"use client"` should be placed at the lowest possible leaf components in the render tree that require client interactivity, browser hooks (`localStorage`), or event listeners (e.g., `CartButton`, `CartDrawer`, `ProductCard` buttons, `CheckoutForm`).

### Q4: What is `generateStaticParams()` and how is it used in dynamic routes?
**Answer**: `generateStaticParams()` runs at build time in dynamic routes like `app/products/[slug]/page.tsx` to pre-generate static HTML pages for every product slug, optimizing performance and SEO.

---

## 2. Hydration & State Management

### Q5: What is hydration in Next.js?
**Answer**: Hydration is the client-side process where React attaches event listeners and client state to the server-rendered HTML markup returned by Next.js.

### Q6: What causes a hydration mismatch error and how is it prevented in MIVO?
**Answer**: Hydration mismatch occurs when server-rendered HTML differs from initial client render (e.g. reading `localStorage` state during server rendering). In MIVO, components like `CartButton`, `CartDrawer`, and `OrderSummary` use a `mounted` guard (`useEffect`) to defer reading browser storage until after initial client mount. Theme switching uses `suppressHydrationWarning` on `<html>`.

### Q7: Why choose Zustand for state management over React Context?
**Answer**: Zustand provides lightweight state management outside the React component tree. Unlike React Context, which can trigger re-renders across all consumers when any state property updates, Zustand supports selective primitive selector subscriptions (e.g., `useCartStore(state => state.items)`), preventing unnecessary component re-renders.

### Q8: How does Zustand `persist` middleware work in MIVO?
**Answer**: `persist` middleware automatically serializes store state into JSON and stores it in `localStorage` under the key `mivo-bag-storage`. In MIVO, it uses `partialize` to persist only the shopping bag items while leaving drawer open state and volatile Buy Now selections strictly in-memory.

### Q9: How is Server State distinguished from Client State in MIVO?
**Answer**: Server state consists of product catalogue data (`lib/products.ts`) and Server Action order handlers (`app/actions/checkout.ts`). Client state consists of volatile UI state like drawer toggles, shopping bag contents, and checkout form inputs.

---

## 3. Form Handling, Validation & Server Actions

### Q10: Why use React Hook Form for form management?
**Answer**: React Hook Form minimizes unnecessary component re-renders by using uncontrolled inputs under the hood while maintaining input validation, error tracking, and form submission states.

### Q11: What is Zod and why is shared validation beneficial?
**Answer**: Zod is a TypeScript-first schema validation library. In MIVO, `lib/schemas/checkout.ts` exports a shared `checkoutSchema`. This schema validates inputs on the client via React Hook Form and re-validates payloads on the server inside Server Actions, providing consistent type-safe validation with server-side protection against tampered client input.

### Q12: Why is server-side re-validation required if client validation passes?
**Answer**: Client-side validation can be bypassed by disabling browser JavaScript or making direct HTTP requests. Re-validating payloads on the server ensures corrupted, invalid, or tampered data never enters backend databases or order streams.

### Q13: What is a Next.js Server Action?
**Answer**: A Server Action is an asynchronous function marked with `"use server"` that executes strictly on the server. In MIVO, `processCheckoutOrder` acts as the order mutation handler, calculating authoritative product prices and returning structured order confirmation data (`#MIVO-XXXXX`).

### Q14: How does MIVO harden server-side pricing and cart payload security?
**Answer**: The client sends only `{ id, quantity }` payload. The Server Action verifies product existence in `lib/products.ts`, enforces integer quantities >= 1, calculates prices and subtotals on the server, rejects unknown product IDs with human-readable errors, and never trusts client-submitted prices or totals.

---

## 4. UI Engineering, Accessibility & Component Architecture

### Q15: How does MIVO implement the Bag Drawer using Radix UI primitives?
**Answer**: `components/ui/sheet.tsx` is built directly on `@radix-ui/react-dialog` primitives (`DialogPrimitive.Root`, `Portal`, `Overlay`, `Content`, `Title`, `Description`, `Close`). This provides accessible dialog semantics (`role="dialog"`), automatic focus trapping, `Escape` key close listeners, backdrop overlay, and DOM root portal rendering.

### Q16: How is the isolated "Buy Now" flow architected differently from "Add to Bag"?
**Answer**:
- **Add to Bag**: Populates the persistent Zustand bag (`items`), updates navbar `Bag (X)`, and displays a toast notification while keeping the user on the page.
- **Buy Now**: Sets an isolated, ephemeral state `buyNowItems` in `useCartStore` without touching the persistent bag (`items`). Routes to `/checkout?flow=buynow`. `CheckoutForm` and `OrderSummary` read `buyNowItems` for direct purchase, leaving the user's saved bag items intact upon checkout completion.

### Q17: How does `app/loading.tsx` work with React Suspense?
**Answer**: `loading.tsx` uses React Suspense under the hood to automatically display instant fallback loading skeletons while route content is fetched over the network. `app/checkout/page.tsx` also wraps `CheckoutForm` and `OrderSummary` in `<Suspense>` boundaries for `useSearchParams` compliance.

### Q18: How does `next/image` optimize performance in MIVO?
**Answer**: `next/image` provides image optimization, responsive sizing, and layout stability, and can serve modern formats when supported by the configured image optimization pipeline, while enforcing aspect ratios to prevent Cumulative Layout Shift (CLS).

### Q19: How is accessibility implemented across MIVO?
**Answer**: Accessible semantic HTML elements (`<header>`, `<nav>`, `<main>`, `<footer>`), explicit form label bindings via `htmlFor`, keyboard focus rings (`focus-visible`), modal focus traps in `CartDrawer` via Radix primitives, and `Escape` key dismiss listeners.

### Q20: What metrics are targeted for Core Web Vitals?
**Answer**: Fast Largest Contentful Paint (LCP < 1.1s) via prioritized image loading, zero Cumulative Layout Shift (CLS = 0.00) through fixed container aspect ratios, and minimal Interaction to Next Paint (INP < 45ms) via leaf-node client components.

---

## 5. E-Commerce Flow: Bag, Checkout & Payments

### Q21: What is the Bag Drawer structure in MIVO?
**Answer**: The slide-over `CartDrawer` displays product images, item titles, prices in `₹`, quantity modifiers (`+` / `-`), remove triggers, subtotal, free shipping indicator, total, and a `Proceed to Checkout` CTA. When empty, it displays *"Your bag is empty. Find something you'll want to keep around."*

### Q22: What fields are included in the Checkout flow?
**Answer**: Contact Information (Full Name, Email, Mobile Phone `+91`), Delivery Address (Street address, City, State, 6-digit PIN code), and Payment Method selection (UPI, Credit/Debit Card, Cash on Delivery).

### Q23: What order ID format is generated upon order creation?
**Answer**: The Server Action generates a formatted order reference prefix `#MIVO-XXXXX` (e.g. `MIVO-48219`).

### Q24: How is Payment Selection architected?
**Answer**: Payment options (UPI, Credit/Debit Card, Cash on Delivery) are presented as interactive card options. The selected option is submitted to `processCheckoutOrder`, decoupling frontend payment selection from backend gateway integration (e.g. Razorpay/Cashfree).

---

## 6. Architecture, Database & Deployment

### Q25: How are product images stored and referenced?
**Answer**: Product images are static local assets stored inside `public/images/products/` (`studio-headphones.jpg`, `mechanical-keyboard.jpg`, `crafted-desk-mat.jpg`, `wireless-charger.jpg`, `leather-daypack.jpg`, `wireless-earbuds.jpg`). They are rendered using clean local paths (`/images/products/...`).

### Q26: How does MIVO handle invalid product route slugs?
**Answer**: If a user navigates to an invalid route slug, `getProductBySlug(slug)` returns `undefined`. `app/products/[slug]/page.tsx` calls `notFound()`, rendering the custom `not-found.tsx` screen.

### Q27: How would a database (e.g., Prisma / PostgreSQL / MongoDB) be attached?
**Answer**: Database models would be queried inside Server Components (`app/products/[slug]/page.tsx`) or Server Actions (`app/actions/checkout.ts`), keeping backend database code completely isolated from client UI logic.

### Q28: How would authentication be integrated?
**Answer**: NextAuth / Auth.js or Supabase Auth could wrap the root layout to provide session tokens, protecting order history routes like `/account/orders` while preserving guest checkout.

### Q29: How is MIVO deployed to production?
**Answer**: Running `npm run build` compiles static pages (SSG) for static routes and bundles Server Components / Server Actions for Node.js edge/serverless execution on Vercel or Docker environments.
