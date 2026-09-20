# Mivo — Assignment 2 Architecture & System Breakdown

**Course Outcomes**: CO3 (Authorization & Sessions), CO4 (Relational & Object Platforms)  
**Tech Stack**: Next.js 16 (App Router), TypeScript, PostgreSQL, Prisma ORM, Better Auth, React Email, Resend, Tailwind CSS

---

## 1. System Architecture Overview

```
                      ┌──────────────────────────────────────────┐
                      │              CLIENT BROWSER              │
                      │  (Next.js App Router / Client Primitives)│
                      └────────────────────┬─────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    │                                             │
                    ▼                                             ▼
       ┌───────────────────────────┐                 ┌───────────────────────────┐
       │   Public Routes (RSC)     │                 │   Protected Routes        │
       │   /  /products/*           │                 │   /account  /admin/*      │
       └────────────┬──────────────┘                 └────────────┬──────────────┘
                    │                                             │
                    │                                             ▼
                    │                                ┌───────────────────────────┐
                    │                                │   middleware.ts           │
                    │                                │   (Session Cookie Check)  │
                    │                                └────────────┬──────────────┘
                    │                                             │
                    ├─────────────────────────────────────────────┘
                    │
                    ▼
       ┌──────────────────────────────────────────────────────────┐
       │             SERVER LAYER (Server Actions & APIs)          │
       │  • processCheckoutOrder Server Action                    │
       │  • GET /api/orders, GET /api/account                     │
       │  • GET /api/admin/orders, GET /api/admin/audit-logs      │
       │  • POST /api/webhooks/resend                             │
       │  • Session & Role Validation (lib/session.ts)            │
       └────────────┬─────────────────────────────┬───────────────┘
                    │                             │
                    ▼                             ▼
       ┌───────────────────────────┐   ┌───────────────────────────┐
       │   Prisma ORM & PostgreSQL │   │   Resend Transactional    │
       │   (User, Order, AuditLog) │   │   Email (React Email)     │
       └───────────────────────────┘   └───────────────────────────┘
```

---

## 2. Normalized Relational Database Schema (Prisma ORM)

The relational schema strictly enforces foreign key integrity across entities:

```
  ┌───────────┐           ┌───────────┐           ┌───────────────┐
  │   User    │1         *│   Order   │1         *│   OrderItem   │
  │───────────│───────────│───────────│───────────│───────────────│
  │ id        │           │ id        │           │ id            │
  │ email     │           │ orderRef  │           │ orderId (FK)  │
  │ role      │           │ userId(FK)│           │ productId     │
  └─────┬─────┘           └─────┬─────┘           │ unitPrice     │
        │                       │                 │ quantity      │
        │1                      │1                └───────────────┘
        │                       │
        │*                      │*
  ┌─────┴─────┐           ┌─────┴─────┐
  │ AuditLog  │           │ EmailEvent│
  │───────────│           │───────────│
  │ id        │           │ id        │
  │ action    │           │ resendId  │
  │ userId(FK)│           │ type      │
  │ orderIdFK │           │ orderIdFK │
  └───────────┘           └───────────┘
```

---

## 3. Session Control & Role-Based Access Control (RBAC)

### Role Hierarchy
- **GUEST** (Unauthenticated): Browse storefront (`/`, `/products/*`), place simulated/guest orders via checkout.
- **MEMBER** (Authenticated Customer): Access `/account`, view personal order history (`GET /api/orders`), view personal profile (`GET /api/account`).
- **ADMIN** (Store Administrator): Access `/admin`, manage all store orders (`GET /api/admin/orders`), inspect system security logs (`GET /api/admin/audit-logs`).

### Server-Side Enforcement Strategy
1. **Edge Middleware (`middleware.ts`)**: Checks session cookie presence for route matching (`/account/*`, `/admin/*`). Unauthenticated requests are redirected to `/auth/sign-in?callbackUrl=...`.
2. **Database Role Verification (`lib/session.ts`)**: Server Actions and Route Handlers invoke `requireRole(Role.ADMIN)` or `requireSession()`. Role is verified directly against PostgreSQL — never trusting client cookies or request body headers.

---

## 4. Transactional Order Mutation & Email Pipeline

1. **Client Submission**: `CheckoutForm` submits validated data and cart payload to `processCheckoutOrder`.
2. **Server-Side Validation**: Zod schema re-evaluates inputs (`checkoutSchema`). Product prices and integer quantities are authoritatively checked against `lib/products.ts`.
3. **Atomic Prisma Transaction (`$transaction`)**:
   - Creates `Order` record (linked to `userId` if customer is authenticated).
   - Creates `OrderItem` records for each product.
   - Creates `AuditLog` record (`ORDER_CREATED`).
   If any sub-step fails, the entire transaction rolls back.
4. **Resend Email Dispatch**: `sendOrderConfirmationEmail` triggers React Email (`emails/order-confirmation.tsx`).
5. **Resend Webhook Handler (`/api/webhooks/resend`)**: Ingests Resend lifecycle notifications (`email.delivered`, `email.bounced`), verifies `svix` signature, and updates `EmailEvent` idempotently using `resendId`.

---

## 5. Mongoose & Object Database Interpretation (Phase 19 Note)

Per Phase 19 guidelines, the primary data persistence pipeline relies on PostgreSQL and Prisma ORM to ensure strict transactional consistency across users, orders, items, and audit trails. Mongoose/MongoDB was evaluated and omitted from runtime dependencies to avoid introducing redundant deadweight infrastructure while satisfying CO4 through Prisma relational modeling.
