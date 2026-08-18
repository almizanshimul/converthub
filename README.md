# ConvertHub

A free, multi-language unit, currency, and land-measurement converter site built for South Asia and beyond — Next.js App Router on the frontend, MariaDB/Prisma for content and rates.

## Features

- **Unit converters** — length, weight, area, volume, temperature, speed, time, digital storage, pressure, energy, power, angle. Every unit pair gets its own URL (`/converter/[category]/[from]-to-[to]`), with a formula explainer, a quick-reference table, and long-form content — hand-curated for popular pairs, deterministically generated (not AI-hallucinated) for the rest.
- **Currency converter** — live-ish exchange rates (`scripts/fetch-currency-rates.ts`, cited source and "as of" date on the page), plus a quick-reference conversion table.
- **Land measurement calculators** — region-specific traditional land units (e.g. bigha, katha, decimal, kanal, marla) for India, Bangladesh, Pakistan, and Nepal, since these vary by state/province and don't map to a single national conversion factor.
- **Calculators** — number-to-words (in every site language, each with its own number-grouping/grammar rules — see below), BMI, and a basic arithmetic calculator.
- **Country directory** — all 195 countries, with population, capital, currency, flag, land-unit links where applicable, and Wikipedia-sourced data with citations.
- **Blog** (`/blog`) — categories, tags, a curated "related content" engine that links blog posts to converters/calculators/countries/regions, full admin CMS. Unlinked from navigation until there's real published content (see SEO section) — reachable directly and via the sitemap in the meantime.
- **7 languages** — English, Bengali, Hindi, Urdu, Arabic, Spanish, French — including RTL layout for Arabic/Urdu.
- **SEO** — a sitemap covering every locale × content-type combination (~49k URLs) with hreflang alternates, `robots.txt`, and JSON-LD (`Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`, `Article`, `WebApplication`) throughout.
- **First-party analytics** — converter/calculator usage, searches, and language switches logged to the database (no cookies, no third-party script); visible at `/admin/analytics`.
- **Cookie consent + optional third-party tracking** — a banner (`src/components/consent/`) gates Google Analytics (GA4), Google Tag Manager, Microsoft Clarity, and Google AdSense behind visitor consent (Google Consent Mode v2 for the Google properties, Clarity's own consent API). Every one of these stays fully inactive until its real ID/publisher ID is set via env var — see `.env.example`.
- **Ad slots** — `src/components/ads/ad-slot.tsx`, off by default until `NEXT_PUBLIC_ADS_ENABLED=true`. Renders a real AdSense unit once `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is set (gated on advertising consent), otherwise a dashed placeholder.
- **Legal pages** — Privacy Policy and Terms of Service (`/privacy`, `/terms`), written comprehensively in English with a translated notice on other locales explaining that the authoritative text is English (see Localization). **The Terms' "Governing Law" clause is deliberately jurisdiction-neutral — it names no country, since none was ever confirmed. Have this reviewed by an actual lawyer before treating it as binding.**
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

**Exception — Privacy Policy and Terms of Service** (`/privacy`, `/terms`): the substantive legal text is intentionally English-only in every locale. Machine-translating precise legal language carries real risk of misrepresenting an actual right or obligation, which is a different order of problem than a UI string reading awkwardly — so instead, non-English locales show a short hand-written notice (`dict.pages.legalEnglishNotice`) stating that the English version governs. Titles and nav labels for these two pages are still fully translated.

## SEO

- `src/app/sitemap.ts` — generated at request time from the database (converters, calculators, countries, regions, blog posts, categories, tags), one entry per locale per page with `alternates.languages` pointing at every other locale's version of the same page.
- `src/app/robots.ts` — allows everything except `/admin` and `/api/`, points crawlers at the sitemap.
- `src/lib/seo/alternates.ts` — `localeAlternates(locale, path)`, used in every page's `generateMetadata`. Each locale self-canonicalizes to its own URL (not one shared canonical) and declares the full `hreflang` set, including `x-default`; this matches the sitemap's own `alternates.languages` so both hreflang sources agree. Pages with an explicit custom canonical (e.g. a syndicated blog post's `canonicalUrl`) respect that override instead.
- `src/app/[locale]/opengraph-image.png` + `twitter-image.png` (with matching `.alt.txt` files) — the file-based Metadata API convention; Next.js generates the `og:image`/`twitter:image` tags automatically for every page under `[locale]`, no per-page wiring needed. `metadata.twitter.card = "summary_large_image"` in the root layout makes it render as the large-image card. Source image lives at `public/social preview image.png`.
- `src/lib/seo/schema.ts` + `src/components/seo/json-ld.tsx` — JSON-LD helpers used across page types; `Organization`/`WebSite` are sitewide (root layout), the rest are per-page.
- Thin/no-data pages (e.g. a land region with fewer than 2 usable unit conversions) are marked `robots: noindex` and excluded from the sitemap — the site would rather show one generic fallback in the index than thousands of near-duplicate "no data yet" pages.
- **`NEXT_PUBLIC_SITE_URL` must be set to the real production domain** — sitemap URLs, canonical/hreflang URLs (via `metadataBase` in the root layout), JSON-LD `url`/`@id` fields, and `robots.txt`'s sitemap reference all fall back to `http://localhost:3000` otherwise.
- Nearly every content page uses `generateStaticParams`, so the vast majority of the site (~49k pages across all locales) is static HTML at build time, not rendered per-request.

## Cookie consent & tracking

- `src/lib/consent.ts` — consent state lives in `localStorage`, read via `useSyncExternalStore` (not `useState`+`useEffect`) so server and client can safely disagree during hydration without a mismatch: the server always sees "no decision yet," and the client re-syncs to the real value immediately after.
- `src/components/consent/cookie-consent-banner.tsx` — shown until a choice is recorded; two toggleable categories (Analytics, Advertising) plus an always-on Necessary category that isn't asked about since it sets no cookies of its own. Reachable again anytime via "Cookie Settings" in the footer.
- `src/components/consent/tracking-scripts.tsx` — injects GA4/GTM/Clarity/AdSense only when the matching env var (`NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_CLARITY_ID`, `NEXT_PUBLIC_ADSENSE_CLIENT_ID`) is actually set. Google Consent Mode v2 defaults to fully denied before any choice is made, then updates in place — GTM/GA4 never fire non-essential pings before consent regardless of visit order. Clarity uses its own separate `clarity('consent', …)` call.
- None of these third-party services are wired to a real account today — every one of the four env vars above is unset, so the banner currently has no practical effect beyond recording a preference. Set the relevant env var(s) once you actually have those accounts.

## Testing

`npm run test` runs Vitest against pure-logic modules only — the conversion engine, currency math, number-to-words (one regression case per supported language), `slugify`, and the i18n `localize()` merge logic. There's no component-rendering or end-to-end test harness yet: Server Components / server actions in this app were instead verified manually against a running dev server (real login, real form submissions, checking the resulting HTML/DB state) rather than through an automated harness — a `/run`-style driver script would be a reasonable next step if this becomes a recurring need.

## Project structure

```
src/app/[locale]/(public)/   # converter, currency, land, calculator, country, blog, about, contact, privacy, terms
src/app/admin/                # NextAuth-gated admin: dashboard, blog CMS, analytics
src/app/sitemap.ts            # sitemap.xml (generated from the DB)
src/app/robots.ts             # robots.txt
src/components/               # widgets (converter, currency, calculator, land) + layout + ui + ads + consent
src/lib/                      # conversion engine, currency, number-to-words, i18n, seo, analytics, blog, related-content, consent
prisma/schema.prisma          # ~30 models: converters, currencies, countries/regions, land units, calculators, blog, auth
prisma/seed.ts                # seed data entry point (prisma/data/*)
scripts/                      # auto-translate, translate-ui, fetch-currency-rates
*.test.ts                     # colocated next to the module they test (Vitest)
```
