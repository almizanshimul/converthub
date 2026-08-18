import { prisma } from "@/lib/prisma";
import { localize, translationInclude } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";

export type RelatedItem = { type: string; title: string; url: string };

type Resolver = (locale: Locale, ids: string[]) => Promise<Map<string, RelatedItem>>;

const RESOLVERS: Record<string, Resolver> = {
  converter: async (locale, ids) => {
    const rows = await prisma.converter.findMany({
      where: { id: { in: ids }, status: "PUBLISHED" },
      include: { category: true, translations: translationInclude(locale) },
    });
    const map = new Map<string, RelatedItem>();
    for (const row of rows) {
      const t = localize(row, row.translations);
      map.set(row.id, { type: "converter", title: t.name, url: `/${locale}/converter/${row.category.slug}/${row.slug}` });
    }
    return map;
  },
  calculator: async (locale, ids) => {
    const rows = await prisma.calculator.findMany({
      where: { id: { in: ids }, status: "PUBLISHED" },
      include: { translations: translationInclude(locale) },
    });
    const map = new Map<string, RelatedItem>();
    for (const row of rows) {
      const t = localize(row, row.translations);
      map.set(row.id, { type: "calculator", title: t.name, url: `/${locale}/calculator/${row.slug}` });
    }
    return map;
  },
  blog_post: async (locale, ids) => {
    const rows = await prisma.blogPost.findMany({
      where: { id: { in: ids }, status: "PUBLISHED" },
      include: { translations: translationInclude(locale) },
    });
    const map = new Map<string, RelatedItem>();
    for (const row of rows) {
      const t = localize(row, row.translations);
      map.set(row.id, { type: "blog_post", title: t.title, url: `/${locale}/blog/${row.slug}` });
    }
    return map;
  },
  country: async (locale, ids) => {
    const rows = await prisma.country.findMany({
      where: { id: { in: ids }, status: "PUBLISHED" },
      include: { translations: translationInclude(locale) },
    });
    const map = new Map<string, RelatedItem>();
    for (const row of rows) {
      const t = localize(row, row.translations);
      map.set(row.id, { type: "country", title: t.name, url: `/${locale}/country/${row.slug}` });
    }
    return map;
  },
};

// Curated-only: returns [] when nobody has manually linked this source item yet
// rather than guessing. Callers that want a heuristic fallback (e.g. "same
// category") do that themselves and treat this as an optional override layer.
export async function getRelatedContent(locale: Locale, sourceType: string, sourceId: string, limit = 4): Promise<RelatedItem[]> {
  if (sourceId.startsWith("synthetic:")) return [];

  const curated = await prisma.relatedContent.findMany({
    where: { sourceType, sourceId },
    orderBy: { order: "asc" },
    take: limit,
  });
  if (curated.length === 0) return [];

  const idsByType = new Map<string, string[]>();
  for (const row of curated) {
    const list = idsByType.get(row.targetType) ?? [];
    list.push(row.targetId);
    idsByType.set(row.targetType, list);
  }

  const resolvedByType = new Map<string, Map<string, RelatedItem>>();
  await Promise.all(
    Array.from(idsByType.entries()).map(async ([type, ids]) => {
      const resolver = RESOLVERS[type];
      if (!resolver) return;
      resolvedByType.set(type, await resolver(locale, ids));
    }),
  );

  const items: RelatedItem[] = [];
  for (const row of curated) {
    const item = resolvedByType.get(row.targetType)?.get(row.targetId);
    if (item) items.push(item);
  }
  return items;
}

export const RELATED_CONTENT_TYPES = ["converter", "calculator", "blog_post", "country"] as const;

// Used by the admin picker: resolve a human-typed slug to the real DB id
// so the RelatedContent row can store ids (the schema's contract) without
// forcing an admin to type raw cuids.
export async function findContentIdBySlug(type: string, slug: string): Promise<{ id: string; title: string } | null> {
  switch (type) {
    case "converter": {
      const row = await prisma.converter.findUnique({ where: { slug } });
      return row ? { id: row.id, title: row.name } : null;
    }
    case "calculator": {
      const row = await prisma.calculator.findUnique({ where: { slug } });
      return row ? { id: row.id, title: row.name } : null;
    }
    case "blog_post": {
      const row = await prisma.blogPost.findUnique({ where: { slug } });
      return row ? { id: row.id, title: row.title } : null;
    }
    case "country": {
      const row = await prisma.country.findUnique({ where: { slug } });
      return row ? { id: row.id, title: row.name } : null;
    }
    case "region": {
      // Region slugs aren't globally unique (e.g. "punjab" exists under two
      // countries), so this returns the first match — good enough for the
      // admin picker, which also shows the resolved title before saving.
      const row = await prisma.region.findFirst({ where: { slug } });
      return row ? { id: row.id, title: row.name } : null;
    }
    default:
      return null;
  }
}
