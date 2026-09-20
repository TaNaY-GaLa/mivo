/**
 * lib/auth.ts — Better Auth server configuration
 * This file is server-only. Never import in Client Components.
 */

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Email + password sign-in
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // simplified for assignment demo
    minPasswordLength: 8,
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,      // refresh session cookie daily
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,             // cache session for 5 minutes
    },
  },

  // User model additional fields
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "MEMBER",
        input: false, // not settable by the user themselves
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },

  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  basePath: "/api/auth",
});

export type Session = typeof auth.$Infer.Session;
