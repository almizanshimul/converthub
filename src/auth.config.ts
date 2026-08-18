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
  // Auth.js defaults trustHost to false in production unless it detects
  // Vercel/Cloudflare Pages (it auto-trues on AUTH_URL/AUTH_TRUST_HOST/VERCEL/
  // CF_PAGES env vars, or NODE_ENV !== "production" - see @auth/core's
  // lib/utils/env.js). Self-hosted behind a reverse proxy (cPanel's Apache/
  // Passenger) matches none of those, so every auth request - session, CSRF,
  // login - fails with UntrustedHost until this is explicitly opted in.
  trustHost: true,
} satisfies NextAuthConfig;
