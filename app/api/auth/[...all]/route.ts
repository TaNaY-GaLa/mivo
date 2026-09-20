/**
 * app/api/auth/[...all]/route.ts
 * Better Auth catch-all route handler.
 * Handles: sign-in, sign-up, sign-out, session, etc.
 */

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
