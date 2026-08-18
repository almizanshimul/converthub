import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { locales, defaultLocale } from "@/lib/i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
  { path: "/blog", priority: 0.6 },
  { path: "/about", priority: 0.3 },
  { path: "/contact", priority: 0.3 },
  { path: "/privacy", priority: 0.2 },
  { path: "/terms", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, converters, calculators, countries, regions, blogPosts, blogCategories] = await Promise.all([
    prisma.converterCategory.findMany({ where: { isIndexable: true }, select: { slug: true } }),
    prisma.converter.findMany({
      where: { status: "PUBLISHED", isIndexable: true },
      select: { slug: true, updatedAt: true, category: { select: { slug: true } } },
    }),
    prisma.calculator.findMany({ where: { status: "PUBLISHED", isIndexable: true }, select: { slug: true, updatedAt: true } }),
    prisma.country.findMany({
      where: { status: "PUBLISHED", isIndexable: true, regions: { some: {} } },
      select: { slug: true, updatedAt: true },
    }),
    prisma.region.findMany({
      where: { status: "PUBLISHED", isIndexable: true },
      select: { slug: true, updatedAt: true, country: { select: { slug: true } }, _count: { select: { landConversions: true } } },
    }),
    prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.blogCategory.findMany({ select: { slug: true } }),
  ]);

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
    entries.push(...localizedEntries(`/land/${c.slug}`, { lastModified: c.updatedAt, changeFrequency: "monthly", priority: 0.5 }));
  }
  for (const r of regions) {
    entries.push(...localizedEntries(`/country/${r.country.slug}/${r.slug}`, { lastModified: r.updatedAt, changeFrequency: "monthly", priority: 0.5 }));
    // The land-specific region page is only worth indexing once it actually has
    // sourced conversions — otherwise it's the same thin "not published yet"
    // fallback for every region, which is exactly what noDataMessage exists for.
    if (r._count.landConversions > 0) {
      entries.push(...localizedEntries(`/land/${r.country.slug}/${r.slug}`, { lastModified: r.updatedAt, changeFrequency: "monthly", priority: 0.5 }));
    }
  }
  for (const b of blogPosts) {
    entries.push(...localizedEntries(`/blog/${b.slug}`, { lastModified: b.updatedAt, changeFrequency: "monthly", priority: 0.6 }));
  }
  for (const bc of blogCategories) {
    entries.push(...localizedEntries(`/blog/category/${bc.slug}`, { changeFrequency: "weekly", priority: 0.4 }));
  }

  return entries;
}
