# Deploying ConvertHub to cPanel — static export

The site now builds to plain static HTML/CSS/JS (`output: "export"` in
`next.config.ts`) — there is **no Node.js process running on the server at
all**. Apache serves the files directly, the same way it serves any other
static website. This was the fix for the cPanel account's process limit
(NPROC) being too low to sustain a persistent Node app — a static file has
no ongoing process cost, so that ceiling stops being a factor entirely.

**What this trades away:** the admin CMS (login, dashboard, blog editor),
live currency-rate refresh, and site search all need a server and don't
exist in this build. Their code hasn't been deleted — it's parked in
`src/app/_admin`, `src/app/_api`, `src/app/[locale]/(public)/_blog`, and
`src/proxy.ts` → `src/_proxy.ts.disabled` (Next.js's leading-underscore
convention excludes a folder from routing entirely, without removing the
code). Restoring any of them means going back to a server-based deploy
(`output: "standalone"`, see git history for the previous version of this
file) — not something to do casually, since it reopens the NPROC problem
that caused this switch.

**What still needs a rebuild to update:** everything, since every page is
baked from the database at build time. There's no admin panel to edit
content live anymore — content changes happen by updating the local
database (direct SQL, Prisma Studio, or the scripts in `scripts/`) and then
rebuilding and re-uploading, same as any other content change.

## One-time server setup

**1. Cloudflare SSL mode.** Set it to **Full (strict)** under SSL/TLS — not
*Flexible*, which causes a redirect loop once real HTTPS is issued.

**2. Confirm the domain's document root.** This is a plain static site now —
no "Setup Node.js App" needed at all. Find the addon domain's document root
in cPanel (**Domains**, or **Addon Domains** on older cPanel versions) —
typically `~/convert-hub.xyz` or `~/public_html/convert-hub.xyz`.

**3. If a Node.js app from a previous setup still exists** (cPanel → *Setup
Node.js App*), **delete it**. It's not needed and was the source of the
process-limit problem.

That's it for one-time server setup — there's no database migration/seed
step here because nothing on the server touches the database anymore; the
build reads your **local** database when you run `npm run build`.

## Build locally (Windows)

```powershell
npm run build
```

Expect `Compiled successfully`, then `Generating static pages (.../1810)`,
finishing in well under a minute. Output lands in `out/` — every route as
`route/index.html` (via `trailingSlash: true` in `next.config.ts`, so a
plain static file server's default directory-index behavior serves clean
URLs with no rewrite rules needed), plus `_next/` for JS/CSS and `.htaccess`
(copied automatically from `public/.htaccess` — it handles the bare-domain
→ `/en/` redirect and old inactive-locale prefixes, replacing what
`proxy.ts` used to do).

**Before building, refresh anything time-sensitive:**
```powershell
npm run currency:fetch   # updates exchange rates in the local DB
```
Currency rates are baked in at build time — there's no more on-request
refresh, so this is the only way they update now.

Zip it up:
```powershell
Compress-Archive -Path out\* -DestinationPath site.zip -Force
```

## Transfer to the server

```bash
scp site.zip USER@convert-hub.xyz:~/convert-hub.xyz/
```

Then on the server, inside the document root:
```bash
find . -mindepth 1 -maxdepth 1 ! -name '.well-known' -exec rm -rf {} +
unzip site.zip
rm site.zip
```
(The `.well-known` exclusion is only relevant if Cloudflare/a cert tool ever
places anything there — harmless to keep even if it doesn't apply.)

If you'd rather not use the command line, zip locally the same way and
upload through cPanel's **File Manager**, extracting directly into the
document root.

No restart, no startup file, nothing else to configure — Apache picks up
the new static files immediately.

## Verify

- `https://convert-hub.xyz` loads, padlock is valid, redirects correctly
  from the bare domain to `/en/`
- A converter pair that's *not* one of the curated/featured ones still
  loads (e.g. `/en/converter/weight/ana-to-kilogram`) — confirms every unit
  pair was actually pre-built, not just the indexed ones
- `/en/currency` shows real rates
- `/admin` and `/api/search` both 404 (expected — not part of this build)

## Shipping future updates

Every update is the same three steps — build, zip, upload:
```powershell
npm run build
Compress-Archive -Path out\* -DestinationPath site.zip -Force
scp site.zip USER@convert-hub.xyz:~/convert-hub.xyz/
```
```bash
# on the server, inside the document root
find . -mindepth 1 -maxdepth 1 ! -name '.well-known' -exec rm -rf {} +
unzip site.zip
rm site.zip
```

## Troubleshooting

**Site loads but `/` doesn't redirect to `/en/`, or old `/hi/...`-style
links don't redirect.** Confirm `.htaccess` actually made it to the
document root (`ls -la ~/convert-hub.xyz/.htaccess`) and that
`mod_rewrite` is enabled for the account (it is by default on virtually
all cPanel hosts — if not, that's a question for hosting support).

**A converter pair 404s that you'd expect to work.** Static export has no
server-side fallback for a route outside `generateStaticParams` — every
unit pair in every category is supposed to be pre-built (see the comment
above `generateStaticParams` in
`src/app/[locale]/(public)/converter/[category]/[slug]/page.tsx`). If one's
missing, that's a real bug worth checking, not something a restart or
config change fixes.

**Currency page shows stale rates.** Expected — they're a build-time
snapshot now. Run `npm run currency:fetch` and rebuild.

**You want the admin CMS or live currency refresh back.** That means going
back to a server-based deploy (`output: "standalone"`), which means solving
the NPROC problem first — check with hosting about raising the process
limit, or moving to a plan/VPS that supports a persistent Node process.
