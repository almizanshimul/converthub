import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { locales, defaultLocale } from "@/lib/i18n/config";
import { getRealLandRegionIds } from "@/lib/land";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Required for output: "export".
export const dynamic = "force-static";

type Entry = MetadataRoute.Sitemap[number];

// Every path gets one sitemap entry per locale, and every one of those entries
// carries the full set of locale variants in `alternates.languages` (including
// itself) — this is the documented shape for a localized sitemap and is what
// tells Google these are translations of the same page rather than duplicate
// content across languages. x-default matches the per-page <link rel="alternate">
// hreflang tags (src/lib/seo/alternates.ts) so both hreflang sources agree.
function localizedEntries(path: string, opts?: Partial<Pick<Entry, "lastModified" | "changeFrequency" | "priority">>): Entry[] {
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`]));
  languages["x-default"] = `${SITE_URL}/${defaultLocale}${path}`;
  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}${path}`,
    alternates: { languages },
    ...opts,
  }));
}

const STATIC_PATHS: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/converter", priority: 0.8 },
  { path: "/calculator", priority: 0.8 },
  { path: "/country", priority: 0.7 },
  { path: "/currency", priority: 0.7 },
  { path: "/land", priority: 0.7 },
  { path: "/about", priority: 0.3 },
  { path: "/contact", priority: 0.3 },
  { path: "/privacy", priority: 0.2 },
  { path: "/terms", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, converters, calculators, countries, regions] = await Promise.all([
    prisma.converterCategory.findMany({ where: { isIndexable: true }, select: { slug: true } }),
    prisma.converter.findMany({
      where: { status: "PUBLISHED", isIndexable: true },
      select: { slug: true, updatedAt: true, category: { select: { slug: true } } },
    }),
    prisma.calculator.findMany({ where: { status: "PUBLISHED", isIndexable: true }, select: { slug: true, updatedAt: true } }),
    prisma.country.findMany({
      where: { status: "PUBLISHED", isIndexable: true, regions: { some: {} } },
      select: { id: true, slug: true, updatedAt: true },
    }),
    prisma.region.findMany({
      where: { status: "PUBLISHED", isIndexable: true },
      select: { id: true, slug: true, updatedAt: true, country: { select: { slug: true } } },
    }),
  ]);

  // Land calculators only exist for regions that clear the "real data" bar
  // (see src/lib/land.ts) - land/[country] and land/[country]/[region] are
  // only generated for those, so the sitemap must match or it'd list URLs
  // that 404.
  const realLandRegionIds = await getRealLandRegionIds();
  const realLandCountryIds = new Set(realLandRegionIds.values());

  const entries: MetadataRoute.Sitemap = [];

  for (const { path, priority } of STATIC_PATHS) {
    entries.push(...localizedEntries(path, { changeFrequency: "weekly", priority }));
  }

  for (const cat of categories) {
    entries.push(...localizedEntries(`/converter/${cat.slug}`, { changeFrequency: "monthly", priority: 0.6 }));
  }
  for (const c of converters) {
    entries.push(...localizedEntries(`/converter/${c.category.slug}/${c.slug}`, { lastModified: c.updatedAt, changeFrequency: "monthly", priority: 0.8 }));
  }
  for (const c of calculators) {
    entries.push(...localizedEntries(`/calculator/${c.slug}`, { lastModified: c.updatedAt, changeFrequency: "monthly", priority: 0.8 }));
  }
  for (const c of countries) {
    entries.push(...localizedEntries(`/country/${c.slug}`, { lastModified: c.updatedAt, changeFrequency: "monthly", priority: 0.6 }));
    // land/[country] only exists for countries with at least one region that
    // clears the "real data" bar (see src/lib/land.ts) - everything else has
    // no land/[country] page to link to.
    if (realLandCountryIds.has(c.id)) {
      entries.push(...localizedEntries(`/land/${c.slug}`, { lastModified: c.updatedAt, changeFrequency: "monthly", priority: 0.5 }));
    }
  }
  // country/[country]/[region] pages don't exist (removed - state data still
  // shows on the country page, just without its own sub-page), so no entries
  // for those. land/[country]/[region] only for regions with a real calculator.
  for (const r of regions) {
    if (realLandRegionIds.has(r.id)) {
      entries.push(...localizedEntries(`/land/${r.country.slug}/${r.slug}`, { lastModified: r.updatedAt, changeFrequency: "monthly", priority: 0.5 }));
    }
  }

  return entries;
}
