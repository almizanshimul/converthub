import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CategorySidebar } from "@/components/layout/category-sidebar";
import { Card } from "@/components/ui/card";
import { ConverterWidget, type WidgetUnit } from "@/components/converter/converter-widget";
import { ConversionTable } from "@/components/converter/conversion-table";
import { FaqSection } from "@/components/converter/faq-section";
import { AdSlot } from "@/components/ads/ad-slot";
import { ShareButton } from "@/components/share/share-button";
import { JsonLd } from "@/components/seo/json-ld";
import { getFormulaDisplay } from "@/lib/converters/formula-display";
import { convert, formatResult } from "@/lib/converters/engine";
import { generateConverterContent } from "@/lib/converters/generated-content";
import { logEvent, incrementConverterView } from "@/lib/analytics";
import { breadcrumbSchema, converterWebApplicationSchema, faqSchema } from "@/lib/seo/schema";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localize, translationInclude } from "@/lib/i18n/translate";
import { getUnitName } from "@/lib/i18n/units";
import { localeAlternates } from "@/lib/seo/alternates";
import type { Locale } from "@/lib/i18n/config";

type ConverterPageUnit = {
  code: string;
  name: string;
  symbol: string | null;
  toBaseFactor: number | null;
};

type ConverterPageData = {
  id: string;
  slug: string;
  categoryId: string;
  precision: number;
  isIndexable: boolean;
  translations: ReadonlyArray<{
    name?: string | null;
    description?: string | null;
    content?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    faq?: unknown;
  }>;
  name: string;
  description: string | null;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  faq: unknown;
  fromUnit: ConverterPageUnit;
  toUnit: ConverterPageUnit;
  category: {
    id: string;
    slug: string;
    name: string;
    translations: ReadonlyArray<{ name?: string | null; description?: string | null }>;
    units: ConverterPageUnit[];
  };
};

function toWidgetUnit(u: { code: string; name: string; symbol: string | null; toBaseFactor: unknown }): ConverterPageUnit {
  return { code: u.code, name: u.name, symbol: u.symbol, toBaseFactor: u.toBaseFactor ? Number(u.toBaseFactor) : null };
}

// Every unit pair in a category gets a real, navigable URL — but only pairs an
// admin has curated (see the `isIndexable` comment on the Converter model) get
// a DB row with a hand-written article/FAQ. Anything else falls back to a
// generic page built on the fly from the category's units, marked noindex so
// it doesn't flood search results with thin auto-generated combinations.
async function getConverter(categorySlug: string, slug: string, locale: Locale): Promise<ConverterPageData | null> {
  const row = await prisma.converter.findUnique({
    where: { slug },
    include: {
      category: { include: { units: { orderBy: { name: "asc" } }, translations: translationInclude(locale) } },
      fromUnit: true,
      toUnit: true,
      translations: translationInclude(locale),
    },
  });

  if (row && row.category.slug === categorySlug && row.status === "PUBLISHED") {
    return {
      id: row.id,
      slug: row.slug,
      categoryId: row.categoryId,
      precision: row.precision,
      isIndexable: row.isIndexable,
      translations: row.translations,
      name: row.name,
      description: row.description,
      content: row.content,
      seoTitle: row.seoTitle,
      seoDescription: row.seoDescription,
      faq: row.faq,
      fromUnit: toWidgetUnit(row.fromUnit),
      toUnit: toWidgetUnit(row.toUnit),
      category: {
        id: row.category.id,
        slug: row.category.slug,
        name: row.category.name,
        translations: row.category.translations,
        units: row.category.units.map(toWidgetUnit),
      },
    };
  }

  const category = await prisma.converterCategory.findUnique({
    where: { slug: categorySlug },
    include: { units: { orderBy: { name: "asc" } }, translations: translationInclude(locale) },
  });
  if (!category) return null;

  let fromUnit: (typeof category.units)[number] | undefined;
  let toUnit: (typeof category.units)[number] | undefined;
  for (const a of category.units) {
    for (const b of category.units) {
      if (a.id !== b.id && `${a.code}-to-${b.code}` === slug) {
        fromUnit = a;
        toUnit = b;
      }
    }
  }
  if (!fromUnit || !toUnit) return null;

  const generated = generateConverterContent({
    categorySlug: category.slug,
    categoryName: category.name,
    fromCode: fromUnit.code,
    fromName: fromUnit.name,
    toCode: toUnit.code,
    toName: toUnit.name,
    fromFactor: fromUnit.toBaseFactor ? Number(fromUnit.toBaseFactor) : null,
    toFactor: toUnit.toBaseFactor ? Number(toUnit.toBaseFactor) : null,
    precision: 4,
  });

  return {
    id: `synthetic:${slug}`,
    slug,
    categoryId: category.id,
    precision: 4,
    isIndexable: false,
    translations: [],
    name: `${fromUnit.name} to ${toUnit.name}`,
    description: null,
    content: generated.content,
    seoTitle: null,
    seoDescription: null,
    faq: generated.faq,
    fromUnit: toWidgetUnit(fromUnit),
    toUnit: toWidgetUnit(toUnit),
    category: {
      id: category.id,
      slug: category.slug,
      name: category.name,
      translations: category.translations,
      units: category.units.map(toWidgetUnit),
    },
  };
}

export async function generateStaticParams() {
  const converters = await prisma.converter.findMany({
    where: { status: "PUBLISHED", isIndexable: true },
    include: { category: true },
  });
  return converters.map((c) => ({ category: c.category.slug, slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, category, slug } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const converter = await getConverter(category, slug, locale);
  if (!converter) return {};
  const t = localize(converter, converter.translations);
  return {
    title: t.seoTitle ?? dict.content.converterCategoryTitle.replace("{name}", t.name),
    description: t.seoDescription ?? t.description ?? undefined,
    robots: converter.isIndexable ? undefined : { index: false, follow: true },
    alternates: localeAlternates(locale, `/converter/${category}/${slug}`),
  };
}

export default async function ConverterPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale: rawLocale, category: categorySlug, slug } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const converter = await getConverter(categorySlug, slug, locale);
  if (!converter) notFound();
  if (converter.isIndexable) {
    await incrementConverterView(converter.id);
    await logEvent("converter_use", { entityType: "converter", entityId: converter.id, metadata: { slug: converter.slug, locale } });
  }

  const t = localize(converter, converter.translations);
  const category = localize(converter.category, converter.category.translations);
  const fromUnitName = getUnitName(converter.fromUnit.code, converter.fromUnit.name, locale);
  const toUnitName = getUnitName(converter.toUnit.code, converter.toUnit.name, locale);
  const fromFactor = converter.fromUnit.toBaseFactor ? Number(converter.fromUnit.toBaseFactor) : null;
  const toFactor = converter.toUnit.toBaseFactor ? Number(converter.toUnit.toBaseFactor) : null;

  const widgetUnits: WidgetUnit[] = converter.category.units.map((u) => ({
    code: u.code,
    name: getUnitName(u.code, u.name, locale),
    symbol: u.symbol,
    toBaseFactor: u.toBaseFactor ? Number(u.toBaseFactor) : null,
  }));

  const faq = Array.isArray(t.faq) ? (t.faq as { question: string; answer: string }[]) : [];
  const pageUrl = `/${locale}/converter/${converter.category.slug}/${converter.slug}`;
  const pageTitle = dict.section.converterTitleTemplate.replace("{from}", fromUnitName).replace("{to}", toUnitName);
  // Same template, but truncated right after "{to}" — drops the trailing
  // "Converter"/"কনভার্টার"/etc. word so the breadcrumb crumb stays short,
  // without hardcoding any language's connector word here.
  const breadcrumbTemplate = dict.section.converterTitleTemplate.slice(0, dict.section.converterTitleTemplate.indexOf("{to}") + "{to}".length);
  const breadcrumbLabel = breadcrumbTemplate.replace("{from}", fromUnitName).replace("{to}", toUnitName);
  const categoryUrl = `/${locale}/converter/${converter.category.slug}`;

  // Gives the share sheet/clipboard something more useful than a bare link —
  // the actual 1-unit reference conversion, e.g. "1 Meter = 3.2808 Feet".
  const shareText = (() => {
    try {
      const raw = convert({
        value: 1,
        fromCode: converter.fromUnit.code,
        toCode: converter.toUnit.code,
        fromFactor,
        toFactor,
        categorySlug: converter.category.slug,
      });
      const formatted = formatResult(raw, converter.precision);
      return formatted ? `1 ${fromUnitName} = ${formatted} ${toUnitName}` : undefined;
    } catch {
      return undefined;
    }
  })();

  const relatedConverters = await prisma.converter.findMany({
    where: { categoryId: converter.categoryId, status: "PUBLISHED", isIndexable: true, id: { not: converter.id } },
    include: { fromUnit: true, toUnit: true, translations: translationInclude(locale) },
    take: 4,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <JsonLd
        data={breadcrumbSchema([
          { label: dict.home, href: `/${locale}` },
          { label: dict.nav.converters, href: `/${locale}/converter` },
          { label: category.name, href: categoryUrl },
          { label: pageTitle },
        ])}
      />
      <JsonLd data={converterWebApplicationSchema(pageTitle, pageUrl)} />
      {faq.length > 0 && <JsonLd data={faqSchema(faq)} />}

      <Breadcrumb
        locale={locale}
        items={[
          { label: dict.home, href: `/${locale}` },
          { label: dict.nav.converters, href: `/${locale}/converter` },
          { label: category.name, href: categoryUrl },
          { label: breadcrumbLabel },
        ]}
      />

      <div className="mt-6 flex flex-col gap-8 md:flex-row">
        <CategorySidebar locale={locale} activeCategorySlug={converter.category.slug} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
            <ShareButton title={pageTitle} url={pageUrl} text={shareText} labels={dict.share} />
          </div>
          {t.description && <p className="mt-2 text-muted-foreground">{t.description}</p>}

          <div className="mt-6">
            <ConverterWidget
              locale={locale}
              categorySlug={converter.category.slug}
              units={widgetUnits}
              initialFromCode={converter.fromUnit.code}
              initialToCode={converter.toUnit.code}
              precision={converter.precision}
              labels={dict.widget}
            />
          </div>

          <div className="mt-6">
            <AdSlot slot={`converter-${converter.slug}-below-converter`} />
          </div>

          <section className="mt-10">
            <h2 className="text-xl font-semibold">{dict.section.formula}</h2>
            <p className="mt-2 rounded-lg border border-border bg-card p-4 font-mono text-sm">
              {getFormulaDisplay(
                converter.category.slug,
                converter.fromUnit.code,
                fromUnitName,
                converter.toUnit.code,
                toUnitName,
                fromFactor,
                toFactor,
              )}
            </p>
          </section>

          <div className="mt-10">
            <ConversionTable
              categorySlug={converter.category.slug}
              fromCode={converter.fromUnit.code}
              toCode={converter.toUnit.code}
              fromFactor={fromFactor}
              toFactor={toFactor}
              fromLabel={fromUnitName}
              toLabel={toUnitName}
              precision={converter.precision}
              title={dict.section.conversionTable}
            />
          </div>

          {t.content && (
            <section className="mt-10">
              {t.content.split("\n\n").map((para, i) => (
                <p key={i} className="mt-4 leading-relaxed text-foreground first:mt-0">
                  {para}
                </p>
              ))}
            </section>
          )}

          <div className="mt-10">
            <FaqSection faq={faq} title={dict.section.faq} />
          </div>

          <div className="mt-10">
            <AdSlot slot={`converter-${converter.slug}-after-faq`} />
          </div>

          {relatedConverters.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold">{dict.section.relatedConverters}</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {relatedConverters.map((c) => {
                  const ct = localize(c, c.translations);
                  return (
                    <Link key={c.id} href={`/${locale}/converter/${converter.category.slug}/${c.slug}`}>
                      <Card className="p-4 transition-colors hover:border-primary">
                        <p className="text-sm font-medium">
                          {getUnitName(c.fromUnit.code, c.fromUnit.name, locale)} → {getUnitName(c.toUnit.code, c.toUnit.name, locale)}
                        </p>
                        <p className="sr-only">{ct.name}</p>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
