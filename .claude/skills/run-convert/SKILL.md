---
name: run-convert
description: Build, run, and drive the `convert` Next.js app (multilingual converter/calculator/land-info platform). Use when asked to start convert, run it, build it, screenshot its admin UI, or verify the admin login flow works.
---

Next.js 16 + Prisma 7 (MySQL/MariaDB via XAMPP) app with an Auth.js admin
panel. Drive it via `.claude/skills/run-convert/driver.mjs` — a Playwright
smoke script (no `chromium-cli` on this machine, so this driver replaces
it). All paths below are relative to the repo root (`d:\code\convert`).

## Prerequisites

- **Node.js 24.x** (`node -v` → confirmed working on v24.16.0; anything ≥18.18 should work for Next.js itself, but this project was built and tested on 24).
- **XAMPP with MySQL**, installed at `C:\xampp`. Only the MySQL component is needed (Apache is not used).

Start MySQL before anything else:

```bash
# GUI: open C:\xampp\xampp-control.exe and click Start next to MySQL
# CLI equivalent that also works:
"/c/xampp/mysql_start.bat"
```

Check it's actually up (XAMPP's mysqld runs as a plain background
process, not a registered Windows service, so `Get-Service` won't see
it — check the port instead):

```powershell
Get-NetTCPConnection -LocalPort 3306 -ErrorAction SilentlyContinue
```

## Setup

```bash
npm install
npm install-scripts approve @prisma/engines prisma unrs-resolver esbuild
```

The second line is required — npm's `allowScripts` gate blocks Prisma's
postinstall (which downloads the query engine) and `esbuild`'s (needed
by `tsx`) unless explicitly approved.

**`.env` is gitignored — recreate it on a fresh checkout.** Default XAMPP
has a `root` user with no password:

```bash
# Database must exist first:
"/c/xampp/mysql/bin/mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS converter_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

```
# .env
DATABASE_URL="mysql://root@127.0.0.1:3306/converter_platform"
AUTH_SECRET="<generate: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))">"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@convert.local"
ADMIN_PASSWORD="<generate: node -e "console.log(require('crypto').randomBytes(12).toString('base64url'))">"
```

Then apply the schema and seed languages + the admin user:

```bash
npm run db:migrate
npm run db:seed
```

## Build

```bash
npm run build
```

Expect: `Compiled successfully`, TypeScript check passes, routes listed
include `/`, `/admin`, `/admin/login`, `/api/auth/[...nextauth]`, and
`ƒ Proxy (Middleware)`.

## Run (agent path)

One-time driver setup (separate from the app's own dependencies —
this keeps Playwright out of the main `package.json`):

```bash
cd .claude/skills/run-convert && npm install
npx playwright install chromium   # one-time per machine, ~115MB, cached outside the repo
cd ../../..
```

Start the dev server in the background and wait for it to actually serve:

```bash
(npm run dev > /tmp/nextdev.log 2>&1 &)
timeout 40 bash -c 'until curl -sf http://localhost:3000 >/dev/null; do sleep 1; done'
```

Run the driver:

```bash
node .claude/skills/run-convert/driver.mjs
```

It drives the full admin auth flow — `/admin` while logged out →
redirect to `/admin/login` → log in with `ADMIN_EMAIL`/`ADMIN_PASSWORD`
from `.env` → dashboard loads with real stat cards → sign out → back to
`/admin/login` — and prints a JSON result (`"ok": true` when no console
errors were seen). Screenshots land in
`.claude/skills/run-convert/screenshots/`:

| file | shows |
|---|---|
| `1-login-page.png` | `/admin/login` (unauthenticated redirect target) |
| `2-dashboard.png` | `/admin` after login, stat cards with live DB counts |
| `3-after-signout.png` | back at `/admin/login` after sign-out |

Stop the server when done (`npm run dev &` doesn't forward Ctrl-C to the
actual `next` process, so kill the port instead):

```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

## Run (human path)

```bash
npm run dev   # → http://localhost:3000 . Ctrl+C to stop.
```

Admin panel: `http://localhost:3000/admin` (redirects to `/admin/login`
if not signed in). Credentials are whatever `ADMIN_EMAIL` /
`ADMIN_PASSWORD` were in `.env` when `npm run db:seed` last ran.

## Test

No automated test suite exists yet (no Jest/Vitest/Playwright-test
config in the repo) — `driver.mjs` above is currently the only
end-to-end verification. `npm run lint` and `npm run build` are the
fast correctness checks in the meantime.

---

## Gotchas

- **Prisma 7's client needs an explicit driver adapter — it won't run against MySQL/MariaDB out of the box.** The generator (`provider = "prisma-client"` in `schema.prisma`) produces a client whose example usage assumes `new PrismaClient({ adapter })`. For XAMPP's MariaDB the package is `@prisma/adapter-mariadb`, exported class `PrismaMariaDb` (constructor takes the `DATABASE_URL` string directly). Wired up in `src/lib/prisma.ts`.
- **The generated Prisma Client cannot load in Next.js Edge Middleware/Proxy.** `src/generated/prisma/client.ts` uses `import.meta.url` + `node:path`/`node:url` — Edge runtime rejects these. Anything that runs in `proxy.ts` must NOT transitively import `@/lib/prisma`. Fix used here: split Auth.js config into `src/auth.config.ts` (Edge-safe, no providers/DB) used by `proxy.ts`, and `src/auth.ts` (full config with the Credentials provider + Prisma) used everywhere else.
- **Next.js 16 renamed `middleware.ts` → `proxy.ts`** (same default-export signature, same `config.matcher`). The official codemod (`npx @next/codemod@canary middleware-to-proxy .`) refuses to run on a dirty git tree, and even with `--force` it reported "55 unmodified" / did nothing for this file — had to rename and re-verify manually.
- **`prisma db seed` is configured in `prisma.config.ts` now, not `package.json`.** Needs `migrations: { seed: "tsx prisma/seed.ts" } }` in `prisma.config.ts`, not the old `"prisma": {"seed": "..."}` package.json key.
- **`chromium-cli` is not on PATH on this machine.** That's why this skill has its own `driver.mjs` instead of an inline `chromium-cli` heredoc — it uses the `playwright` npm package directly (installed locally to this skill folder, not the main app).

## Troubleshooting

- **`Error: Cannot find module '../src/generated/prisma'`** (or similar, from any script importing the generated client): the client wasn't generated. Run `npx prisma generate` — it is not always run automatically after `prisma migrate dev` in this version.
- **Build warning `A Node.js module is loaded ('node:path'/'node:url') ... not supported in the Edge Runtime`, import trace pointing through `proxy.ts`**: something Edge-scoped imports `@/lib/prisma` (directly or via `@/auth`). Use `@/auth.config` (no Prisma) in `proxy.ts` instead of the full `@/auth`.
- **`npx prisma db seed` → "⚠️ No seed command configured"**: add the `migrations.seed` line to `prisma.config.ts` shown in Setup above.
- **`npm install` prints `npm warn install-scripts ... blocked`**: run the `npm install-scripts approve ...` command from Setup — Prisma and `tsx`'s `esbuild` dependency won't work otherwise.
