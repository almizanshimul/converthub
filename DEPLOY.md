# Deploying ConvertHub to cPanel — manual build & upload

For when the cPanel server itself isn't strong enough to run `npm run build`.
Everything that's actually expensive happens on your own machine; the server
only ever runs `node server.js` and the lightweight one-time database setup.

(The site currently generates 600 static pages — a local build finishes in
well under a minute. Still worth building locally rather than on shared
hosting: a `next build` briefly needs more CPU/RAM than typical shared-hosting
plans allot, regardless of page count.)

Verified end-to-end this session: production build, `output: "standalone"`
packaging, database connectivity through the Prisma MariaDB adapter, and the
full admin login → dashboard → sign-out flow all confirmed working against
this exact bundle.

## How the pieces fit together

- **The server** runs a small self-contained bundle (`.next/standalone`) via
  cPanel's "Setup Node.js App" (Passenger). It needs Node.js **and nothing
  else installed** to run — no `npm install` on the server for the app itself.
- **A full git clone on the server is still needed once**, but only to run
  `prisma migrate deploy` and the database seed — the Prisma CLI and seed
  script are dev tooling, not part of what actually runs the site. This step
  is light (a few minutes), not the thing you're trying to avoid.
- **The build happens on your Windows machine**, then you transfer just the
  built output.

> **Static pages bake in whatever's in the database at build time.** Every
> country/converter/land page is pre-rendered from your database
> during `npm run build`. The blog listing and currency page are the
> exception — those are server-rendered per request against the *live*
> production database, not baked in. In practice: build against a database
> that has the same reference data (countries, converters, land units) you
> want live. If you ever edit that reference data through the admin CMS
> directly in production, resync your local database before your next
> rebuild, or that edit will be reverted by the next deploy.

## One-time server setup (SSH)

**1. Cloudflare SSL mode.** Set it to **Full (strict)** under SSL/TLS — not
*Flexible*. This app forces HTTPS; Flexible causes a redirect loop. It won't
take effect until step 4 issues a real certificate, but set it now.

**2. Create the Node.js app.** cPanel → *Setup Node.js App* → *Create
Application*:
- Node.js version: **20.20.2**
- Application mode: **Production**
- Application root: a new folder, e.g. `convert-hub.xyz`
- Application URL: your addon domain
- Application startup file: leave blank for now (set in step 8, once the file exists)

Save the "Enter to the virtual environment" command cPanel shows you — looks
like:
```bash
source /home/USER/nodevenv/convert-hub.xyz/20/bin/activate && cd /home/USER/convert-hub.xyz
```

**3. Clone the repo and install once.**
```bash
# run the "enter virtual environment" command from step 2 first
rm -rf ./* ./.[!.]*
git clone https://github.com/almizanshimul/converthub.git .
npm install
npx prisma generate
```

**4. Create the real `.env` directly on the server** (don't transfer this
from your machine — type production secrets where they'll actually live):
```bash
cp .env.example .env
nano .env
```

| Variable | Set to |
| --- | --- |
| `DATABASE_URL` | `mysql://cpaneluser_dbuser:PASSWORD@localhost:3306/cpaneluser_dbname` — use the full prefixed names from MySQL® Databases |
| `AUTH_SECRET` | random 32+ chars — `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://convert-hub.xyz` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | your real login — not the local dev placeholder |
| `NEXT_PUBLIC_SITE_URL` | `https://convert-hub.xyz` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | your real contact email |
| `EXCHANGERATE_API_KEY` | your exchangerate-api.com key — without it the currency page falls back to a lower-guarantee free endpoint |
| Ad/analytics IDs | leave blank until you have real accounts |

**5. Apply migrations and seed reference data.**
```bash
npx prisma migrate deploy
npm run db:seed   # first deploy only
```
(Not `npm run db:migrate` — that's `prisma migrate dev`, interactive/dev-only.
`migrate deploy` is the non-interactive production command.)

That's everything the server needs to do. From here on, all the expensive
work happens locally.

## Build locally (Windows)

Your local `.env.production` already has the real `NEXT_PUBLIC_SITE_URL` —
`NEXT_PUBLIC_*` variables get compiled permanently into the built output at
build time (unlike `DATABASE_URL`/`AUTH_SECRET`, which are read at runtime
from whatever `.env` sits next to `server.js` on the server), so this matters
more here than it would building on the server. Nothing to change — it's
already correct.

```powershell
npm run build
Copy-Item -Recurse public .next\standalone\
Copy-Item -Recurse .next\static .next\standalone\.next\
```

**Remove the unused image-optimization binary before uploading.** Next
traces `sharp` into the standalone bundle even though this app doesn't use
`next/image` anywhere (checked — zero occurrences). `sharp` ships a different
native binary per OS; the one that got installed here is Windows-only and
would silently be the wrong platform on the Linux server. Since it's never
actually called, the safest move is just to remove it rather than upload a
binary that can't run there:
```powershell
Remove-Item -Recurse -Force .next\standalone\node_modules\sharp
Remove-Item -Recurse -Force .next\standalone\node_modules\@img
```

Zip it up:
```powershell
Compress-Archive -Path .next\standalone\* -DestinationPath standalone.zip -Force
```

## Transfer to the server

With SSH access, `scp` is cleanest (run from your project folder, not the
server):
```bash
scp standalone.zip USER@convert-hub.xyz:~/convert-hub.xyz/
```

Then on the server, inside the app root:
```bash
rm -rf .next/standalone
unzip standalone.zip -d .next/standalone
rm standalone.zip
```

If you'd rather not use the command line, zip locally the same way and
upload through cPanel's **File Manager** instead, extracting it to
`.next/standalone` inside the application root — same result, just point
and click.

## Point cPanel at it and start

cPanel → *Setup Node.js App* → edit your application → set **Application
startup file** to `.next/standalone/server.js` → **Restart**.

## Verify

- `https://convert-hub.xyz` loads, padlock is valid
- `/admin` redirects to `/admin/login`
- Log in with your real admin credentials → dashboard shows stat cards
- Sign out → redirected back to login

## Shipping future updates

Only re-run what actually changed:

```bash
# On the server, only if prisma/schema.prisma changed:
git pull
npx prisma generate
npx prisma migrate deploy

# Locally, every time:
npm run build
Copy-Item -Recurse public .next\standalone\
Copy-Item -Recurse .next\static .next\standalone\.next\
Remove-Item -Recurse -Force .next\standalone\node_modules\sharp, .next\standalone\node_modules\@img
Compress-Archive -Path .next\standalone\* -DestinationPath standalone.zip -Force
scp standalone.zip USER@convert-hub.xyz:~/convert-hub.xyz/
```

Then on the server: swap in the new `.next/standalone` (same as above) and
click **Restart** in cPanel.

## Troubleshooting

**App won't start / 503 from Passenger.** Check the log path shown on the
*Setup Node.js App* page (typically `stderr.log` in the application root).
Usually either the startup file path is wrong, or the uploaded
`.next/standalone` is incomplete (missing `public/` or `.next/static`).

**Login fails with "UntrustedHost."** Already fixed in code
(`trustHost: true` in `src/auth.config.ts`) — if you still see it, confirm
`NEXTAUTH_URL` is exactly `https://convert-hub.xyz` with no trailing slash,
and `AUTH_SECRET` is actually set in the server's `.env`.

**Cloudflare redirect loop.** SSL/TLS mode is on *Flexible*. Switch to
**Full (strict)**.

**Currency page shows "rates not available yet."** Expected until
`EXCHANGERATE_API_KEY` is set in the server's `.env`. Rates refresh
automatically — the first visit to the currency page each day fetches fresh
rates and every visit after that reuses them, no scheduled task needed. To
have real rates ready before your first visitor, run `npm run currency:fetch`
once on the server (alongside the migrate/seed step).

**Pages show content that doesn't match production.** You rebuilt locally
against a database that's diverged from what's live — see the callout above.
