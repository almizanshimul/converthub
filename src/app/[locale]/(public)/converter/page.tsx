import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getCategoryIcon } from "@/lib/icons";
import { localize, translationInclude } from "@/lib/i18n/translate";
import { localeAlternates } from "@/lib/seo/alternates";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  return {
    title: dict.nav.converters,
    alternates: localeAlternates(locale, "/converter"),
  };
}

export default async function ConverterLandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const categories = await prisma.converterCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      translations: translationInclude(locale),
      _count: { select: { converters: { where: { status: "PUBLISHED", isIndexable: true } } } },
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Breadcrumb locale={locale} items={[{ label: dict.home, href: `/${locale}` }, { label: dict.nav.converters }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{dict.nav.converters}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{dict.content.converterLandingSubtitle}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((cat) => {
          const t = localize(cat, cat.translations);
          const Icon = getCategoryIcon(cat.slug);
          return (
            <Link key={cat.id} href={`/${locale}/converter/${cat.slug}`}>
              <Card className="flex items-start gap-4 p-5 transition-colors hover:border-primary">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <p className="font-medium">{t.name}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.description}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {dict.content.popularConvertersCount.replace("{count}", String(cat._count.converters))}
                  </p>
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
