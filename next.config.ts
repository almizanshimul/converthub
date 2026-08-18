import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Drops the `X-Powered-By: Next.js` response header (minor info exposure,
  // zero cost to remove).
  poweredByHeader: false,
  // Traces the minimal file set actually needed at runtime into
  // .next/standalone (own server.js + only the node_modules that are really
  // used) instead of requiring the full node_modules tree on the host. Matters
  // a lot on shared hosting (cPanel) where inode/disk quotas make uploading a
  // full node_modules impractical.
  output: "standalone",
};

export default nextConfig;
