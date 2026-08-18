import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localize, translationInclude } from "@/lib/i18n/translate";
import { getFlagSrc } from "@/lib/flags";
import { localeAlternates } from "@/lib/seo/alternates";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  return {
    title: dict.nav.countries,
    alternates: localeAlternates(locale, "/country"),
  };
}

export default async function CountryLandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const countries = await prisma.country.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { name: "asc" },
    include: { translations: translationInclude(locale), _count: { select: { regions: true } } },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: dict.home, href: `/${locale}` }, { label: dict.nav.countries }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{dict.nav.countries}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{dict.country.listingDescription}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {countries.map((country) => {
          const t = localize(country, country.translations);
          return (
            <Link key={country.id} href={`/${locale}/country/${country.slug}`}>
              <Card className="flex items-start gap-4 p-5 transition-colors hover:border-primary">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10">
                  <img src={getFlagSrc(country.code)} alt="" className="h-full w-full object-cover" />
                </span>
                <span>
                  <p className="font-medium">{t.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{dict.country.capitalPrefix.replace("{capital}", country.capital ?? "")}</p>
                  {country._count.regions > 0 && (
                    <p className="mt-2 text-xs text-muted-foreground">{dict.country.regionsCount.replace("{count}", String(country._count.regions))}</p>
                  )}
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
