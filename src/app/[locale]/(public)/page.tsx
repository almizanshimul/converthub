import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Gift, BookOpenCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getCategoryIcon } from "@/lib/icons";
import { localize, translationInclude } from "@/lib/i18n/translate";
import { getUnitName } from "@/lib/i18n/units";
import { localeAlternates } from "@/lib/seo/alternates";
import type { Locale } from "@/lib/i18n/config";

const whyChooseIcons = [ShieldCheck, Zap, Gift, BookOpenCheck];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  return {
    title: dict.home_.heroTitle,
    description: dict.home_.heroSubtitle,
    alternates: localeAlternates(locale, ""),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const [categories, popularConverters] = await Promise.all([
    prisma.converterCategory.findMany({
      orderBy: { order: "asc" },
      include: { translations: translationInclude(locale) },
    }),
    prisma.converter.findMany({
      where: { status: "PUBLISHED", isIndexable: true },
      include: {
        fromUnit: true,
        toUnit: true,
        category: { include: { translations: translationInclude(locale) } },
        translations: translationInclude(locale),
      },
      take: 8,
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return (
    <div>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{dict.home_.heroTitle}</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{dict.home_.heroSubtitle}</p>
          <Link
            href={`/${locale}/land`}
            className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            {dict.home_.heroCta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-xl font-semibold">{dict.section.popularConverters}</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {popularConverters.map((c) => {
            const t = localize(c, c.translations);
            return (
              <Link key={c.id} href={`/${locale}/converter/${c.category.slug}/${c.slug}`}>
                <Card className="p-4 transition-colors hover:border-primary">
                  <p className="text-sm font-medium">
                    {getUnitName(c.fromUnit.code, c.fromUnit.name, locale)} → {getUnitName(c.toUnit.code, c.toUnit.name, locale)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{localize(c.category, c.category.translations).name}</p>
                  <p className="sr-only">{t.name}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <h2 className="text-xl font-semibold">{dict.section.categories}</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((cat) => {
            const t = localize(cat, cat.translations);
            const Icon = getCategoryIcon(cat.slug);
            return (
              <Link key={cat.id} href={`/${locale}/converter/${cat.slug}`}>
                <Card className="flex items-center gap-3 p-4 transition-colors hover:border-primary">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <p className="text-sm font-medium">{t.name}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight">{dict.home_.whyChooseTitle}</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {dict.home_.whyChoose.map((item, i) => {
              const Icon = whyChooseIcons[i];
              return (
                <div key={item.title} className="text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="mt-3 font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight">{dict.home_.introTitle}</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">{dict.home_.introParagraph}</p>
      </section>
    </div>
  );
}
