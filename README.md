# ConvertHub

A free, multi-language unit, currency, and land-measurement converter site built for South Asia and beyond — Next.js App Router on the frontend, MariaDB/Prisma for content and rates.

## Features

- **Unit converters** — length, weight, area, volume, temperature, speed, time, digital storage, pressure, energy, power, angle. Every unit pair gets its own URL (`/converter/[category]/[from]-to-[to]`), with a formula explainer, a quick-reference table, and long-form content — hand-curated for popular pairs, deterministically generated (not AI-hallucinated) for the rest.
- **Currency converter** — live-ish exchange rates (`scripts/fetch-currency-rates.ts`, cited source and "as of" date on the page), plus a quick-reference conversion table.
- **Land measurement calculators** — region-specific traditional land units (e.g. bigha, katha, decimal, kanal, marla) for India, Bangladesh, Pakistan, and Nepal, since these vary by state/province and don't map to a single national conversion factor.
- **Calculators** — number-to-words (in every site language, each with its own number-grouping/grammar rules — see below), BMI, and a basic arithmetic calculator.
- **Country directory** — all 195 countries, with population, capital, currency, flag, land-unit links where applicable, and Wikipedia-sourced data with citations.
- **Blog** (`/blog`) — categories, tags, a curated "related content" engine that links blog posts to converters/calculators/countries/regions, full admin CMS.
- **7 languages** — English, Bengali, Hindi, Urdu, Arabic, Spanish, French — including RTL layout for Arabic/Urdu.
- **SEO** — a sitemap covering every locale × content-type combination (~49k URLs) with hreflang alternates, `robots.txt`, and JSON-LD (`Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`, `Article`, `WebApplication`) throughout.
- **First-party analytics** — converter/calculator usage, searches, and language switches logged to the database (no cookies, no third-party script); visible at `/admin/analytics`.
- **Ad slots** — provider-agnostic placeholders (`src/components/ads/ad-slot.tsx`) wired across content pages, off by default until `NEXT_PUBLIC_ADS_ENABLED=true` and a real network is connected.
- **Admin panel** (`/admin`) — NextAuth-gated dashboard, blog CMS, and analytics.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, async Server Components) + React 19 + TypeScript
- Tailwind CSS 4
- [Prisma 7](https://www.prisma.io) with `@prisma/adapter-mariadb` — needs MariaDB/MySQL, not the default Prisma driver
- [Auth.js / NextAuth v5](https://authjs.dev) — single-admin, credentials-based login
- Self-hosted [LibreTranslate](https://libretranslate.com) (Argos Translate) for bulk-translating database content
- [Vitest](https://vitest.dev) for unit tests (pure logic only — no component/e2e harness yet, see Testing below)

## Getting started

### Prerequisites

- Node.js 20+
- A running MariaDB or MySQL server
- Python 3 + `pip install libretranslate` (only needed for the translation scripts, not for running the site)

### Setup

```bash
npm install
cp .env.example .env   # then fill in real values
npm run db:migrate     # applies prisma/migrations/
npm run db:seed        # seeds languages, categories, converters, countries, calculators, ...
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The admin dashboard is at `/admin/login`, using the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Standard Next.js dev / production build / production serve |
| `npm run lint` | ESLint |
| `npm run test` | Runs the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed` | Runs `prisma/seed.ts` |
| `npm run db:studio` | `prisma studio` — browse the database |
| `npm run translate:missing` | Backfills missing non-English translations via LibreTranslate (safe to re-run) |
| `npm run translate:ui` | Translates hand-written UI strings the same way |
| `npm run currency:fetch` | Pulls fresh exchange rates from exchangerate-api.com |

## Localization

UI chrome (`src/lib/i18n/dictionary.ts`) and unit names (`src/lib/i18n/units.ts`) are hand-written per locale — machine translation is deliberately not used for these, since quality issues there are the most visible and the highest-traffic text. Everything else (converter/category/country/calculator content in the database) is machine-translated in bulk via a self-hosted LibreTranslate instance and is expected to be lower quality than the hand-written parts; `scripts/auto-translate.ts` only fills in *missing* translations, so it's safe to re-run after adding new content.

To run the translation scripts locally:

```bash
pip install libretranslate
libretranslate --load-only en,bn,hi,ur,ar,es,fr --port 5000
# in another terminal:
npm run translate:missing
```

Adding a new locale means: add it to `src/lib/i18n/config.ts`, hand-write its `dictionary.ts` and `units.ts` entries, install the matching Argos Translate package, restart LibreTranslate with the new code in `--load-only`, then run `translate:missing`.

## SEO

- `src/app/sitemap.ts` — generated at request time from the database (converters, calculators, countries, regions, blog posts, categories, tags), one entry per locale per page with `alternates.languages` pointing at every other locale's version of the same page.
- `src/app/robots.ts` — allows everything except `/admin` and `/api/`, points crawlers at the sitemap.
- `src/lib/seo/alternates.ts` — `localeAlternates(locale, path)`, used in every page's `generateMetadata`. Each locale self-canonicalizes to its own URL (not one shared canonical) and declares the full `hreflang` set, including `x-default`; this matches the sitemap's own `alternates.languages` so both hreflang sources agree. Pages with an explicit custom canonical (e.g. a syndicated blog post's `canonicalUrl`) respect that override instead.
- `src/app/[locale]/opengraph-image.png` + `twitter-image.png` (with matching `.alt.txt` files) — the file-based Metadata API convention; Next.js generates the `og:image`/`twitter:image` tags automatically for every page under `[locale]`, no per-page wiring needed. `metadata.twitter.card = "summary_large_image"` in the root layout makes it render as the large-image card. Source image lives at `public/social preview image.png`.
- `src/lib/seo/schema.ts` + `src/components/seo/json-ld.tsx` — JSON-LD helpers used across page types; `Organization`/`WebSite` are sitewide (root layout), the rest are per-page.
- Thin/no-data pages (e.g. a land region with fewer than 2 usable unit conversions) are marked `robots: noindex` and excluded from the sitemap — the site would rather show one generic fallback in the index than thousands of near-duplicate "no data yet" pages.
- **`NEXT_PUBLIC_SITE_URL` must be set to the real production domain** — sitemap URLs, canonical/hreflang URLs (via `metadataBase` in the root layout), JSON-LD `url`/`@id` fields, and `robots.txt`'s sitemap reference all fall back to `http://localhost:3000` otherwise.
- Nearly every content page uses `generateStaticParams`, so the vast majority of the site (~49k pages across all locales) is static HTML at build time, not rendered per-request.

## Testing

`npm run test` runs Vitest against pure-logic modules only — the conversion engine, currency math, number-to-words (one regression case per supported language), `slugify`, and the i18n `localize()` merge logic. There's no component-rendering or end-to-end test harness yet: Server Components / server actions in this app were instead verified manually against a running dev server (real login, real form submissions, checking the resulting HTML/DB state) rather than through an automated harness — a `/run`-style driver script would be a reasonable next step if this becomes a recurring need.

## Project structure

```
src/app/[locale]/(public)/   # converter, currency, land, calculator, country, blog, about, contact, privacy
src/app/admin/                # NextAuth-gated admin: dashboard, blog CMS, analytics
src/app/sitemap.ts            # sitemap.xml (generated from the DB)
src/app/robots.ts             # robots.txt
src/components/               # widgets (converter, currency, calculator, land) + layout + ui + ads
src/lib/                      # conversion engine, currency, number-to-words, i18n, seo, analytics, blog, related-content
prisma/schema.prisma          # ~30 models: converters, currencies, countries/regions, land units, calculators, blog, auth
prisma/seed.ts                # seed data entry point (prisma/data/*)
scripts/                      # auto-translate, translate-ui, fetch-currency-rates
*.test.ts                     # colocated next to the module they test (Vitest)
```
