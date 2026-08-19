import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Drops the `X-Powered-By: Next.js` response header (minor info exposure,
  // zero cost to remove).
  poweredByHeader: false,
  // Fully static HTML/CSS/JS in the `out/` folder — no Node.js process runs
  // on the server at all. Chosen over "standalone" because the shared-hosting
  // account's process limit (NPROC) can't sustain a persistent Node app; see
  // DEPLOY.md. This means no admin CMS, no live currency refresh, and no
  // search API — those need a server and are disabled (not deleted) for now,
  // see src/app/_admin, src/app/_api, src/app/[locale]/(public)/_blog.
  output: "export",
  // Emits `/route/index.html` instead of `/route.html`, so any static file
  // server (Apache included, via its default DirectoryIndex behavior) serves
  // clean URLs without needing custom rewrite rules.
  trailingSlash: true,
};

export default nextConfig;
