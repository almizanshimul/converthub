import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localize, translationInclude } from "@/lib/i18n/translate";
import { localeAlternates } from "@/lib/seo/alternates";
import { getRealLandRegionIds } from "@/lib/land";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  return { title: dict.land.pageTitle, description: dict.land.pageSubtitle, alternates: localeAlternates(locale, "/land") };
}

export default async function LandLandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const realRegionIds = await getRealLandRegionIds();
  const realCountryIds = [...new Set(realRegionIds.values())];
  const realRegionCountByCountry = new Map<string, number>();
  for (const countryId of realRegionIds.values()) {
    realRegionCountByCountry.set(countryId, (realRegionCountByCountry.get(countryId) ?? 0) + 1);
  }

  const countries = await prisma.country.findMany({
    where: { status: "PUBLISHED", id: { in: realCountryIds } },
    orderBy: { name: "asc" },
    include: { translations: translationInclude(locale) },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb locale={locale} items={[{ label: dict.home, href: `/${locale}` }, { label: dict.nav.land }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{dict.land.pageTitle}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{dict.land.pageSubtitle}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {countries.map((country) => {
          const t = localize(country, country.translations);
          return (
            <Link key={country.id} href={`/${locale}/land/${country.slug}`}>
              <Card className="p-5 transition-colors hover:border-primary">
                <p className="font-medium">{t.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {dict.country.regionsCount.replace("{count}", String(realRegionCountByCountry.get(country.id) ?? 0))}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
