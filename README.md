# MIVO — Things You'll Want to Keep Around

**MIVO** is a modern consumer shopping application designed for everyday lifestyle products, workplace ergonomics, and technology accessories in India.

Built with Next.js 16 (App Router), React Server Components (RSC), persistent Zustand state, Zod validation, Server Actions, **Prisma ORM with PostgreSQL**, **Better Auth session control**, **Next.js middleware route protection**, **React Email**, and **Resend transactional email notifications**, MIVO delivers a seamless, secure, and retail-grade shopping experience.

---

## 🚀 Key Features

* **Storefront UX**: Editorial homepage with hero section, category navigation (Audio, Desk, Carry, Accessories), product cards with INR (`₹`) pricing, and brand philosophy.
* **Local Asset Infrastructure**: 100% of product images are local static assets (`public/images/products/`) rendered via `next/image` with zero broken links or external dependencies.
* **Buy Now vs. Add to Bag**:
  * **Add to Bag**: Adds items to the persistent Zustand bag store, updates dynamic navbar counter `Bag (X)`, and displays feedback.
  * **Buy Now**: Immediately opens direct checkout with the selected item.
* **Persistent Bag Drawer**: Persistent `localStorage` bag store with itemized totals, quantity controls, and slide-over drawer UI.
* **Type-Safe Checkout**: Built with React Hook Form, shared Zod schema validation (Indian phone `+91`, 6-digit PIN code, state selection), and multi-option payment selection (UPI, Credit/Debit Card, Cash on Delivery).
* **Prisma Relational Database & Transactions**: PostgreSQL database storing Users, Orders, OrderItems, AuditLogs, and EmailEvents. Checkout mutations use atomic Prisma `$transaction`.
* **Better Auth Session & RBAC**: Modern session management supporting Guest, Member, and Admin roles. Route protection enforced via Edge Middleware (`middleware.ts`) and database-backed server-side role validation (`lib/session.ts`).
* **Automated Seeding (Faker.js)**: Deterministic database seeder (`prisma/seed.ts`) populating users, admin accounts, orders, order items, audit logs, and email events with foreign-key integrity.
* **Transactional Lifecycle Email (Resend + React Email)**: Dispatches branded HTML emails (`emails/order-confirmation.tsx`) upon order confirmation. Ingests Resend webhook notifications (`/api/webhooks/resend`) with `svix` signature verification.
* **Protected API Endpoints**:
  * `GET /api/orders` — Authenticated user's order history
  * `GET /api/account` — Authenticated user's profile
  * `GET /api/admin/orders` — Admin-only list of all store orders
  * `GET /api/admin/audit-logs` — Admin-only security audit log stream
* **Dark / Light Mode**: Seamless theme toggle powered by `next-themes` with hydration safety.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 16 (App Router)
* **Language**: TypeScript
* **Database & ORM**: PostgreSQL & Prisma ORM
* **Authentication**: Better Auth with Prisma Adapter
* **Email & Webhooks**: Resend, React Email, Svix
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
* PostgreSQL instance running locally or hosted

### Installation & Database Setup

1. **Clone repository & install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Set your PostgreSQL connection string in `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mivo"
   BETTER_AUTH_SECRET="your-32-character-secret"
   BETTER_AUTH_URL="http://localhost:3000"
   RESEND_API_KEY="re_..."
   RESEND_WEBHOOK_SECRET="whsec_..."
   ```

3. **Initialize database schema & run automated Faker seed**:
   ```bash
   npm run db:setup
   ```
   *Or execute individually:*
   ```bash
   npm run db:generate   # Generate Prisma client
   npm run db:migrate    # Apply PostgreSQL migrations
   npm run db:seed       # Run Faker.js seeder
   ```

4. **Run local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🔑 Test Credentials (Created by Seeder)

* **Admin Account**: `admin@mivo.example.com` / `Admin@mivo123` (Access `/admin`)
* **Member Account**: `arjun.sharma.1@example.com` / `Member@mivo123` (Access `/account`)

---

## 📂 Project Architecture

```text
mivo/
├── app/
│   ├── actions/
│   │   └── checkout.ts          # Server Action with Prisma transaction + email
│   ├── account/                 # Member account area
│   ├── admin/                   # Admin dashboard & audit log viewer
│   ├── api/
│   │   ├── account/             # GET user profile API
│   │   ├── admin/               # Admin endpoints (orders, audit-logs)
│   │   ├── auth/[...all]/       # Better Auth handler
│   │   ├── orders/              # Orders API
│   │   └── webhooks/resend/     # Resend webhook ingestion handler
│   ├── auth/                    # Sign-in & Sign-up pages
│   ├── checkout/                # Checkout page layout
│   ├── products/[slug]/         # Dynamic product detail page (RSC)
│   ├── success/                 # Order confirmation page
│   ├── layout.tsx               # Root layout with metadata & theme provider
│   ├── loading.tsx              # Fallback loading skeleton
│   ├── not-found.tsx            # 404 page
│   └── page.tsx                 # Homepage with hero & category grids
├── components/                  # UI components (Radix / shadcn)
├── docs/
│   ├── architecture.md          # Assignment 2 Architecture & System Breakdown
│   ├── technical-report.md      # Full technical report
│   └── viva.md                  # Viva Voce preparation Q&A guide
├── emails/
│   └── order-confirmation.tsx   # React Email order confirmation template
├── lib/
│   ├── auth.ts                  # Better Auth server configuration
│   ├── auth-client.ts           # Better Auth client instance
│   ├── email.ts                 # Resend integration with dev fallback
│   ├── prisma.ts                # Prisma singleton client
│   ├── session.ts               # Server-side session & role helpers
│   ├── products.ts              # Product model & local catalogue
│   └── utils.ts                 # Helper functions & INR formatting
├── middleware.ts                # Edge route protection middleware
├── prisma/
│   ├── schema.prisma            # Normalized relational database schema
│   └── seed.ts                  # Faker.js automated database seeder
├── public/images/products/      # Local product image assets (.jpg)
└── store/
    └── cart-store.ts            # Zustand persistent client store
```

---

## 📄 Documentation Links

* [Assignment 2 Architecture Document](docs/architecture.md)
* [Technical Report](docs/technical-report.md)
* [Viva Voce Q&A Guide](docs/viva.md)
