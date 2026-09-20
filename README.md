# Mivo

Mivo is a modern ecommerce web application for discovering products, managing a bag, placing orders, and managing user accounts.

## Features

- Product catalogue with category filtering
- Product detail pages
- Add to Bag and Buy Now
- Persistent shopping bag
- Checkout and order placement
- User registration and sign in
- Account and order history
- Admin order and audit-log management
- PostgreSQL database with Prisma
- Seeded development data
- Transactional order confirmation emails
- Responsive interface
- Light and dark theme support
- Local product images

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Better Auth
- Resend
- React Email
- React Hook Form
- Zod
- Zustand

## Requirements

Before running Mivo, make sure the following are installed:

- Node.js 20 or later
- PostgreSQL

Check your installation:

```bash
node -v
npm -v
Getting Started
1. Download the project

Download the repository as a ZIP from GitHub and extract it.

Open PowerShell in the extracted mivo folder.

2. Install dependencies
npm install
3. Create the PostgreSQL database

Create a PostgreSQL database named mivo.

You can create it using pgAdmin or the PostgreSQL command line.

Example:

CREATE DATABASE mivo;
4. Configure environment variables

Create .env.local from .env.example.

In PowerShell:

Copy-Item .env.example .env.local

Open .env.local and enter the required values for your local PostgreSQL database and configured external services.

Never commit .env.local or secret credentials to GitHub.

5. Set up the database

Apply the Prisma migrations:

npx prisma migrate deploy

Seed the database with development data:

npx prisma db seed
6. Start the application
npm run dev

Open:

http://localhost:3000

Test Accounts

The database seed creates development accounts for testing authentication and role-based access.

Check prisma/seed.ts for the current local development credentials.

Do not use development credentials in production.

Production Build

Create a production build:

npm run build

Start the production server:

npm run start
Project Structure
app/                     Application pages, layouts and API routes
components/              Reusable interface components
emails/                  Transactional email templates
lib/                     Authentication, database and application utilities
prisma/                  Database schema, migrations and seed
public/images/products/  Local product images
store/                   Persistent client-side bag state
proxy.ts                 Request authentication and access protection
Environment Variables

Environment configuration is provided through .env.local.

The available variables are documented in .env.example.

Keep .env.local private and never commit it to GitHub.

Notes

Mivo is configured for local development with PostgreSQL.

External services such as transactional email require their corresponding environment configuration. If they are not configured, the application can still be used locally for development and testing, but the related external functionality will not be available.