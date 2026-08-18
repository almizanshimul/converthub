import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { LandCalculatorWidget } from "@/components/land/land-calculator-widget";
import { ShareButton } from "@/components/share/share-button";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localize, translationInclude } from "@/lib/i18n/translate";
import { localeAlternates } from "@/lib/seo/alternates";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { computeLandOptions, getRealLandRegionIds } from "@/lib/land";
import type { Locale } from "@/lib/i18n/config";

async function getRegionLandData(countrySlug: string, regionSlug: string, locale: Locale) {
  const country = await prisma.country.findUnique({
    where: { slug: countrySlug },
    include: { translations: translationInclude(locale) },
  });
  if (!country) return null;
  const region = await prisma.region.findUnique({
    where: { countryId_slug: { countryId: country.id, slug: regionSlug } },
    include: { translations: translationInclude(locale) },
  });
  if (!region) return null;

  const { units, conversions, options } = await computeLandOptions(country.id, region.id);

  return { country, region, options, conversions, units };
}

export async function generateStaticParams() {
  const realRegionIds = await getRealLandRegionIds();
  const regions = await prisma.region.findMany({
    where: { id: { in: [...realRegionIds.keys()] } },
    include: { country: true },
  });
  return regions.map((r) => ({ country: r.country.slug, region: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string; region: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, country: countrySlug, region: regionSlug } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const data = await getRegionLandData(countrySlug, regionSlug, locale);
  if (!data) return {};
  const countryName = localize(data.country, data.country.translations).name;
  const regionName = localize(data.region, data.region.translations).name;
  return {
    title: dict.land.metaRegionTitle.replace("{region}", regionName),
    description: dict.land.metaRegionDescription.replace("{region}", regionName).replace("{country}", countryName),
    // Same "thin content" bar the sitemap already applies to this page (see
    // src/app/sitemap.ts) — a region with fewer than 2 usable land-unit
    // options renders the same generic "no data yet" fallback as every other
    // un-sourced region, so it shouldn't compete for a search index slot.
    robots: data.options.length < 2 ? { index: false, follow: true } : undefined,
    alternates: localeAlternates(locale, `/land/${countrySlug}/${regionSlug}`),
  };
}

export default async function LandRegionPage({
  params,
}: {
  params: Promise<{ locale: string; country: string; region: string }>;
}) {
  const { locale: rawLocale, country: countrySlug, region: regionSlug } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const data = await getRegionLandData(countrySlug, regionSlug, locale);
  if (!data) notFound();
  // dynamicParams defaults to true, so a thin region outside
  // generateStaticParams' real-data set would otherwise still render the
  // generic "no data yet" fallback on demand instead of 404ing.
  if (data.options.length < 2) notFound();

  const { country, region, options, conversions } = data;
  const countryT = localize(country, country.translations);
  const regionT = localize(region, region.translations);
  const sourcedConversions = conversions.filter((c) => c.source || c.sourceUrl);
  const regionTitle = dict.land.regionTitle.replace("{region}", regionT.name);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd
        data={breadcrumbSchema([
          { label: dict.home, href: `/${locale}` },
          { label: dict.nav.land, href: `/${locale}/land` },
          { label: countryT.name, href: `/${locale}/land/${country.slug}` },
          { label: regionT.name },
        ])}
      />
      <Breadcrumb
        locale={locale}
        items={[
          { label: dict.home, href: `/${locale}` },
          { label: dict.nav.land, href: `/${locale}/land` },
          { label: countryT.name, href: `/${locale}/land/${country.slug}` },
          { label: regionT.name },
        ]}
      />
      <div className="mt-4 flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{regionTitle}</h1>
        <ShareButton
          title={regionTitle}
          url={`/${locale}/land/${country.slug}/${region.slug}`}
          text={
            sourcedConversions[0]
              ? `1 ${sourcedConversions[0].fromUnit.name} = ${Number(sourcedConversions[0].factor).toLocaleString("en-US", { maximumFractionDigits: 4 })} ${sourcedConversions[0].toUnit.name} (${regionT.name}, ${countryT.name})`
              : `${regionT.name}, ${countryT.name} — local land unit converter`
          }
          labels={dict.share}
        />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {dict.land.regionPageSubtitle.replace("{region}", regionT.name).replace("{country}", countryT.name)}
      </p>

      <div className="mt-6">
        {options.length >= 2 ? (
          <LandCalculatorWidget units={options} labels={dict.widget} />
        ) : (
          <p className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            {dict.land.noDataMessage.replace("{region}", regionT.name)}
          </p>
        )}
      </div>

      <div className="mt-6">
        <AdSlot slot={`land-${country.slug}-${region.slug}-below-calculator`} />
      </div>

      {sourcedConversions.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">{dict.land.sourcesHeading}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {sourcedConversions.map((c) => (
              <li key={c.id} className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  1 {c.fromUnit.name} = {Number(c.factor).toLocaleString("en-US", { maximumFractionDigits: 4 })} {c.toUnit.name}
                </span>
                {" — "}
                {c.sourceUrl ? (
                  <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="text-primary hover:underline">
                    {c.source ?? dict.content.landSourceFallback}
                  </a>
                ) : (
                  c.source
                )}
                {c.notes && <span className="block text-xs italic">{c.notes}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
