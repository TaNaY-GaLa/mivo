/**
 * lib/auth-client.ts - Better Auth client-side instance
 * Safe to import in Client Components.
 */

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
