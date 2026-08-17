import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe config: no Prisma/bcrypt here, since this is imported by proxy.ts
 * which runs in the Edge runtime. The full config (with the Credentials
 * provider) lives in auth.ts and only runs in the Node.js runtime.
 *
 * The admin route gate itself lives directly in proxy.ts (not in an
 * `authorized` callback here) because proxy.ts also needs to run
 * non-admin locale-routing logic on every request, and mixing the two
 * concerns through the declarative `authorized` callback got confusing
 * fast — see proxy.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
} satisfies NextAuthConfig;
