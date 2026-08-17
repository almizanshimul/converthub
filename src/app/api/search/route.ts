import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { localize, translationInclude } from "@/lib/i18n/translate";
import { logEvent } from "@/lib/analytics";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().slice(0, 100);
  const rawLocale = searchParams.get("locale") ?? defaultLocale;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  if (q.length < 2) return NextResponse.json({ results: [] });

  const [converters, calculators, categories, countries, regions, landUnits, currencies] = await Promise.all([
    prisma.converter.findMany({
      where: { status: "PUBLISHED", isIndexable: true, name: { contains: q } },
      include: { category: true, translations: translationInclude(locale) },
      take: 6,
    }),
    prisma.calculator.findMany({
      where: { status: "PUBLISHED", isIndexable: true, name: { contains: q } },
      include: { translations: translationInclude(locale) },
      take: 4,
    }),
    prisma.converterCategory.findMany({
      where: { name: { contains: q } },
      include: { translations: translationInclude(locale) },
      take: 4,
    }),
    prisma.country.findMany({
      where: { status: "PUBLISHED", name: { contains: q } },
      include: { translations: translationInclude(locale) },
      take: 4,
    }),
    prisma.region.findMany({
      where: { status: "PUBLISHED", name: { contains: q } },
      include: { translations: translationInclude(locale), country: true },
      take: 4,
    }),
    prisma.landUnit.findMany({
      where: { name: { contains: q } },
      include: { country: true, region: true },
      take: 6,
    }),
    prisma.currency.findMany({
      where: { isActive: true, OR: [{ code: { contains: q } }, { name: { contains: q } }] },
      take: 6,
    }),
  ]);

  const results = [
    ...converters.map((c) => {
      const t = localize(c, c.translations);
      return { type: "converter", label: t.name, sublabel: c.category.name, href: `/${locale}/converter/${c.category.slug}/${c.slug}` };
    }),
    ...calculators.map((c) => {
      const t = localize(c, c.translations);
      return { type: "calculator", label: t.name, sublabel: undefined, href: `/${locale}/calculator/${c.slug}` };
    }),
    ...categories.map((c) => {
      const t = localize(c, c.translations);
      return { type: "category", label: t.name, sublabel: undefined, href: `/${locale}/converter/${c.slug}` };
    }),
    ...countries.map((c) => {
      const t = localize(c, c.translations);
      return { type: "country", label: t.name, sublabel: undefined, href: `/${locale}/country/${c.slug}` };
    }),
    ...regions.map((r) => {
      const t = localize(r, r.translations);
      return { type: "region", label: t.name, sublabel: r.country.name, href: `/${locale}/country/${r.country.slug}/${r.slug}` };
    }),
    ...landUnits.map((u) => ({
      type: "land-unit",
      label: u.name,
      sublabel: u.region ? `${u.region.name}, ${u.country.name}` : u.country.name,
      href: u.region ? `/${locale}/land/${u.country.slug}/${u.region.slug}` : `/${locale}/land/${u.country.slug}`,
    })),
    ...currencies.map((c) => ({
      type: "currency",
      label: `${c.code} — ${c.name}`,
      sublabel: c.symbol,
      href: `/${locale}/currency?from=${c.code}`,
    })),
  ];

  await logEvent("search", { metadata: { q, locale, resultCount: results.length } });

  return NextResponse.json({ results });
}
