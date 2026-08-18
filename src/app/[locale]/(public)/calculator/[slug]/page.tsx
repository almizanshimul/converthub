import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { FaqSection } from "@/components/converter/faq-section";
import { ShareButton } from "@/components/share/share-button";
import { NumberToWordsWidget } from "@/components/calculator/number-to-words-widget";
import { BmiCalculatorWidget } from "@/components/calculator/bmi-calculator-widget";
import { BasicCalculatorWidget } from "@/components/calculator/basic-calculator-widget";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { logEvent } from "@/lib/analytics";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localize, translationInclude } from "@/lib/i18n/translate";
import { localeAlternates } from "@/lib/seo/alternates";
import type { Locale } from "@/lib/i18n/config";
import type { NumberWordsLocale } from "@/lib/numbers/number-to-words";

const NUMBER_WORDS_LOGIC_KEYS: Record<string, NumberWordsLocale> = {
  "bn-number-to-words": "bn",
  "hi-number-to-words": "hi",
  "ur-number-to-words": "ur",
  "en-number-to-words": "en",
  "ar-number-to-words": "ar",
  "es-number-to-words": "es",
  "fr-number-to-words": "fr",
};

async function getCalculator(slug: string, locale: Locale) {
  return prisma.calculator.findUnique({
    where: { slug },
    include: { translations: translationInclude(locale) },
  });
}

export async function generateStaticParams() {
  const rows = await prisma.calculator.findMany({ where: { status: "PUBLISHED", isIndexable: true }, select: { slug: true } });
  return rows.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const calculator = await getCalculator(slug, locale);
  if (!calculator) return {};
  const t = localize(calculator, calculator.translations);
  return {
    title: t.seoTitle ?? t.name,
    description: t.seoDescription ?? t.description ?? undefined,
    robots: calculator.isIndexable ? undefined : { index: false, follow: true },
    alternates: localeAlternates(locale, `/calculator/${slug}`),
  };
}

export default async function CalculatorPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const calculator = await getCalculator(slug, locale);
  if (!calculator || calculator.status !== "PUBLISHED") notFound();
  if (calculator.isIndexable) {
    await logEvent("calculator_use", { entityType: "calculator", entityId: calculator.id, metadata: { slug: calculator.slug, locale } });
  }

  const t = localize(calculator, calculator.translations);
  const faq = Array.isArray(t.faq) ? (t.faq as { question: string; answer: string }[]) : [];
  const numberWordsLocale = NUMBER_WORDS_LOGIC_KEYS[calculator.logicKey];
  const isBmi = calculator.logicKey === "bmi";
  const isBasic = calculator.logicKey === "basic";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <JsonLd
        data={breadcrumbSchema([{ label: dict.home, href: `/${locale}` }, { label: dict.nav.calculators, href: `/${locale}/calculator` }, { label: t.name }])}
      />
      {faq.length > 0 && <JsonLd data={faqSchema(faq)} />}

      <Breadcrumb
        locale={locale}
        items={[
          { label: dict.home, href: `/${locale}` },
          { label: dict.nav.calculators, href: `/${locale}/calculator` },
          { label: t.name },
        ]}
      />
      <div className="mt-4 flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{t.name}</h1>
        <ShareButton title={t.name} url={`/${locale}/calculator/${calculator.slug}`} text={t.description ?? t.name} labels={dict.share} />
      </div>
      {t.description && <p className="mt-2 text-muted-foreground">{t.description}</p>}

      <div className="mt-6">
        {numberWordsLocale ? (
          <NumberToWordsWidget locale={numberWordsLocale} labels={dict.widget} />
        ) : isBmi ? (
          <BmiCalculatorWidget labels={dict.calculator.bmi} />
        ) : isBasic ? (
          <BasicCalculatorWidget labels={dict.calculator.basic} />
        ) : (
          <p className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            {dict.content.calculatorNotAvailable}
          </p>
        )}
      </div>

      <div className="mt-6">
        <AdSlot slot={`calculator-${calculator.slug}-below-widget`} />
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
    </div>
  );
}
