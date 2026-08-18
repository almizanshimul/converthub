import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localize, translationInclude } from "@/lib/i18n/translate";
import { localeAlternates } from "@/lib/seo/alternates";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { computeLandOptions, getRealLandRegionIds } from "@/lib/land";
import type { Locale } from "@/lib/i18n/config";

async function getCountry(slug: string, locale: Locale) {
  return prisma.country.findUnique({
    where: { slug },
    include: {
      translations: translationInclude(locale),
      regions: { orderBy: { name: "asc" }, include: { translations: translationInclude(locale) } },
    },
  });
}

export async function generateStaticParams() {
  const realRegionIds = await getRealLandRegionIds();
  const realCountryIds = [...new Set(realRegionIds.values())];
  const rows = await prisma.country.findMany({ where: { id: { in: realCountryIds } }, select: { slug: true } });
  return rows.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, country: slug } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const country = await getCountry(slug, locale);
  if (!country) return {};
  const t = localize(country, country.translations);
  return {
    title: dict.land.countryTitle.replace("{country}", t.name),
    description: dict.land.metaCountryDescription.replace("{country}", t.name),
    alternates: localeAlternates(locale, `/land/${slug}`),
  };
}

export default async function LandCountryPage({ params }: { params: Promise<{ locale: string; country: string }> }) {
  const { locale: rawLocale, country: slug } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const country = await getCountry(slug, locale);
  if (!country) notFound();
  const t = localize(country, country.translations);

  // country.regions includes every region of this country, but not all of
  // them clear the "real calculator" bar - filter to the ones that actually
  // get a land/[country]/[region] page (see generateStaticParams above).
  const regionsWithRealData = (
    await Promise.all(
      country.regions.map(async (region) => {
        const { options } = await computeLandOptions(country.id, region.id);
        return options.length >= 2 ? region : null;
      }),
    )
  ).filter((r) => r !== null);

  // dynamicParams defaults to true, so without this check a country outside
  // generateStaticParams' real-data set would still render on demand instead
  // of 404ing - exactly the thin/empty page this route was trimmed to avoid.
  if (regionsWithRealData.length === 0) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd
        data={breadcrumbSchema([
          { label: dict.home, href: `/${locale}` },
          { label: dict.nav.land, href: `/${locale}/land` },
          { label: t.name },
        ])}
      />
      <Breadcrumb
        locale={locale}
        items={[
          { label: dict.home, href: `/${locale}` },
          { label: dict.nav.land, href: `/${locale}/land` },
          { label: t.name },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{dict.land.countryTitle.replace("{country}", t.name)}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{dict.land.countryPageSubtitle.replace("{country}", t.name)}</p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {regionsWithRealData.map((region) => {
          const rt = localize(region, region.translations);
          return (
            <Link key={region.id} href={`/${locale}/land/${country.slug}/${region.slug}`}>
              <Card className="p-4 transition-colors hover:border-primary">
                <p className="text-sm font-medium">{rt.name}</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
