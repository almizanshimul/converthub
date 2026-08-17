# ConvertHub

A free, multi-language unit, currency, and land-measurement converter site built for South Asia and beyond — Next.js App Router on the frontend, MariaDB/Prisma for content and rates.

## Features

- **Unit converters** — length, weight, area, volume, temperature, speed, time, digital storage, pressure, energy, power, angle. Every unit pair gets its own URL (`/converter/[category]/[from]-to-[to]`), with a formula explainer, a quick-reference table, and long-form content — hand-curated for popular pairs, deterministically generated (not AI-hallucinated) for the rest.
- **Currency converter** — live-ish exchange rates (`scripts/fetch-currency-rates.ts`, cited source and "as of" date on the page), plus a quick-reference conversion table.
- **Land measurement calculators** — region-specific traditional land units (e.g. bigha, katha, decimal, kanal, marla) for India, Bangladesh, Pakistan, and Nepal, since these vary by state/province and don't map to a single national conversion factor.
- **Calculators** — number-to-words (in every site language, each with its own number-grouping/grammar rules — see below), BMI, and a basic arithmetic calculator.
- **Country directory** — all 195 countries, with population, capital, currency, flag, land-unit links where applicable, and Wikipedia-sourced data with citations.
- **7 languages** — English, Bengali, Hindi, Urdu, Arabic, Spanish, French — including RTL layout for Arabic/Urdu.
- **Admin panel** (`/admin`) — NextAuth-gated dashboard for the content behind all of the above.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, async Server Components) + React 19 + TypeScript
- Tailwind CSS 4
- [Prisma 7](https://www.prisma.io) with `@prisma/adapter-mariadb` — needs MariaDB/MySQL, not the default Prisma driver
- [Auth.js / NextAuth v5](https://authjs.dev) — single-admin, credentials-based login
- Self-hosted [LibreTranslate](https://libretranslate.com) (Argos Translate) for bulk-translating database content

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

## Project structure

```
src/app/[locale]/(public)/   # converter, currency, land, calculator, country, about, contact, privacy
src/app/admin/                # NextAuth-gated admin dashboard
src/components/               # widgets (converter, currency, calculator, land) + layout + ui
src/lib/                      # conversion engine, currency, number-to-words, i18n, seo
prisma/schema.prisma          # ~30 models: converters, currencies, countries/regions, land units, calculators, blog, auth
prisma/seed.ts                # seed data entry point (prisma/data/*)
scripts/                      # auto-translate, translate-ui, fetch-currency-rates
```
