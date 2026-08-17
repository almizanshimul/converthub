import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Drops the `X-Powered-By: Next.js` response header (minor info exposure,
  // zero cost to remove).
  poweredByHeader: false,
};

export default nextConfig;
