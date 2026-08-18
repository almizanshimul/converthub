import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CategorySidebar } from "@/components/layout/category-sidebar";
import { Card } from "@/components/ui/card";
import { ConverterWidget, type WidgetUnit } from "@/components/converter/converter-widget";
import { AdSlot } from "@/components/ads/ad-slot";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localize, translationInclude } from "@/lib/i18n/translate";
import { getUnitName } from "@/lib/i18n/units";
import { localeAlternates } from "@/lib/seo/alternates";
import type { Locale } from "@/lib/i18n/config";

async function getCategory(slug: string, locale: Locale) {
  return prisma.converterCategory.findUnique({
    where: { slug },
    include: {
      units: { orderBy: { name: "asc" } },
      translations: translationInclude(locale),
      converters: {
        where: { status: "PUBLISHED", isIndexable: true },
        include: { fromUnit: true, toUnit: true, translations: translationInclude(locale) },
        orderBy: { name: "asc" },
      },
    },
  });
}

export async function generateStaticParams() {
  const categories = await prisma.converterCategory.findMany({ select: { slug: true } });
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, category: slug } = await params;
  const locale = rawLocale as Locale;
  const category = await getCategory(slug, locale);
  if (!category) return {};
  const t = localize(category, category.translations);
  return {
    title: category.seoTitle ?? `${t.name} Converter`,
    description: category.seoDescription ?? t.description ?? undefined,
    alternates: localeAlternates(locale, `/converter/${slug}`),
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale: rawLocale, category: slug } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const category = await getCategory(slug, locale);
  if (!category) notFound();

  const t = localize(category, category.translations);

  const widgetUnits: WidgetUnit[] = category.units.map((u) => ({
    code: u.code,
    name: getUnitName(u.code, u.name, locale),
    symbol: u.symbol,
    toBaseFactor: u.toBaseFactor ? Number(u.toBaseFactor) : null,
  }));

  const [defaultFrom, defaultTo] = category.units;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Breadcrumb
        items={[
          { label: dict.home, href: `/${locale}` },
          { label: dict.nav.converters, href: `/${locale}/converter` },
          { label: t.name },
        ]}
      />

      <div className="mt-6 flex flex-col gap-8 md:flex-row">
        <CategorySidebar locale={locale} activeCategorySlug={category.slug} />

        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{t.name} Converter</h1>
          <p className="mt-2 text-muted-foreground">{t.description}</p>

          {defaultFrom && defaultTo && (
            <div className="mt-6">
              <ConverterWidget
                locale={locale}
                categorySlug={category.slug}
                units={widgetUnits}
                initialFromCode={defaultFrom.code}
                initialToCode={defaultTo.code}
                labels={dict.widget}
              />
            </div>
          )}

          <div className="mt-6">
            <AdSlot slot={`category-${category.slug}-below-converter`} />
          </div>

          {category.converters.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold">{dict.section.popularConverters}</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {category.converters.map((c) => (
                  <Link key={c.id} href={`/${locale}/converter/${category.slug}/${c.slug}`}>
                    <Card className="p-4 transition-colors hover:border-primary">
                      <p className="text-sm font-medium">
                        {getUnitName(c.fromUnit.code, c.fromUnit.name, locale)} →{" "}
                        {getUnitName(c.toUnit.code, c.toUnit.name, locale)}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mt-10">
            <h2 className="text-xl font-semibold">All {t.name} Units</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {category.units.map((u) => (
                <li key={u.id} className="rounded-full border border-border bg-card px-3 py-1 text-sm">
                  {getUnitName(u.code, u.name, locale)} {u.symbol ? `(${u.symbol})` : ""}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
