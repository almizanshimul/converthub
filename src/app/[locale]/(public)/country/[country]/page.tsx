import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card } from "@/components/ui/card";
import { ShareButton } from "@/components/share/share-button";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localize, translationInclude } from "@/lib/i18n/translate";
import { getFlagSrc } from "@/lib/flags";
import { localeAlternates } from "@/lib/seo/alternates";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { truncate } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

const DATE_LOCALE: Record<Locale, string> = { en: "en-US", bn: "bn-BD" };

async function getCountry(slug: string, locale: Locale) {
  return prisma.country.findUnique({
    where: { slug },
    include: {
      regions: { orderBy: { name: "asc" }, include: { translations: translationInclude(locale) } },
      translations: translationInclude(locale),
    },
  });
}

export async function generateStaticParams() {
  const rows = await prisma.country.findMany({ select: { slug: true } });
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
    title: t.seoTitle ?? dict.content.countryMetaTitle.replace("{name}", t.name),
    description:
      t.seoDescription ??
      (t.introContent ? truncate(t.introContent, 155) : dict.content.countryMetaDescription.replace("{name}", t.name)),
    alternates: localeAlternates(locale, `/country/${slug}`),
  };
}

export default async function CountryPage({ params }: { params: Promise<{ locale: string; country: string }> }) {
  const { locale: rawLocale, country: slug } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const country = await getCountry(slug, locale);
  if (!country || country.status !== "PUBLISHED") notFound();

  const t = localize(country, country.translations);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd
        data={breadcrumbSchema([
          { label: dict.home, href: `/${locale}` },
          { label: dict.nav.countries, href: `/${locale}/country` },
          { label: t.name },
        ])}
      />
      <Breadcrumb
        locale={locale}
        items={[
          { label: dict.home, href: `/${locale}` },
          { label: dict.nav.countries, href: `/${locale}/country` },
          { label: t.name },
        ]}
      />
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={getFlagSrc(country.code)} alt={t.name} title={t.name} className="h-9 w-12 rounded shadow-sm" />
          <h1 className="text-3xl font-bold tracking-tight">{t.name}</h1>
        </div>
        <ShareButton
          title={t.name}
          url={`/${locale}/country/${country.slug}`}
          text={`${t.name} — ${dict.country.capital}: ${country.capital}, ${dict.country.currency}: ${country.currencyCode}`}
          labels={dict.share}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">{dict.country.capital}</p>
          <p className="mt-1 font-medium">{country.capital}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">{dict.country.currency}</p>
          <p className="mt-1 font-medium">{country.currencyCode}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">{dict.country.area}</p>
          <p className="mt-1 font-medium">{country.area?.toLocaleString("en-US")} km²</p>
        </Card>
        {country.population != null && (
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">{dict.country.population}</p>
            <p className="mt-1 font-medium">{country.population.toLocaleString("en-US")}</p>
          </Card>
        )}
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">{dict.country.languages}</p>
          <p className="mt-1 font-medium">{country.languagesText}</p>
        </Card>
      </div>

      <div className="mt-6">
        <AdSlot slot={`country-${country.slug}-below-stats`} />
      </div>

      {country.regions.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">{dict.country.statesRegions}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {country.regions.map((region) => {
              const rt = localize(region, region.translations);
              return (
                <Card key={region.id} className="p-4">
                  <p className="text-sm font-medium">{rt.name}</p>
                  {region.capital && <p className="mt-1 text-xs text-muted-foreground">{region.capital}</p>}
                </Card>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-10">
           <h2 className="text-xl font-semibold">Country Information</h2>

          {t.introContent && <p className="mt-2 text-muted-foreground">{t.introContent}</p>}
      </section>
     

      {country.sourceUrl && country.sourceDate && (
        <div className="mt-10 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          <p>{dict.country.sourceAsOf.replace("{date}", country.sourceDate.toLocaleDateString(DATE_LOCALE[locale], { year: "numeric", month: "long", day: "numeric" }))}</p>
          <p className="mt-1">
            {dict.country.sourceLabel}:{" "}
            <a href={country.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="text-primary hover:underline">
              {country.sourceName ?? country.sourceUrl}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
