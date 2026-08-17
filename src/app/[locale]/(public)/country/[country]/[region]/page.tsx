import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card } from "@/components/ui/card";
import { AdSlot } from "@/components/ads/ad-slot";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localize, translationInclude } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";

async function getRegion(countrySlug: string, regionSlug: string, locale: Locale) {
  const country = await prisma.country.findUnique({ where: { slug: countrySlug }, include: { translations: translationInclude(locale) } });
  if (!country) return null;
  const region = await prisma.region.findUnique({
    where: { countryId_slug: { countryId: country.id, slug: regionSlug } },
    include: { translations: translationInclude(locale) },
  });
  if (!region) return null;

  const landConversions = await prisma.landConversion.findMany({
    where: { regionId: region.id, status: "PUBLISHED" },
    include: { fromUnit: true, toUnit: true },
  });

  return { country, region, landConversions };
}

export async function generateStaticParams() {
  const regions = await prisma.region.findMany({ include: { country: true } });
  return regions.map((r) => ({ country: r.country.slug, region: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string; region: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, country: countrySlug, region: regionSlug } = await params;
  const locale = rawLocale as Locale;
  const data = await getRegion(countrySlug, regionSlug, locale);
  if (!data) return {};
  const rt = localize(data.region, data.region.translations);
  const ct = localize(data.country, data.country.translations);
  return {
    title: rt.seoTitle ?? `${rt.name}, ${ct.name} — Land Units & Info`,
    description: rt.seoDescription ?? rt.introContent?.slice(0, 155) ?? undefined,
  };
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ locale: string; country: string; region: string }>;
}) {
  const { locale: rawLocale, country: countrySlug, region: regionSlug } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const data = await getRegion(countrySlug, regionSlug, locale);
  if (!data || data.region.status !== "PUBLISHED") notFound();

  const { landConversions } = data;
  const country = localize(data.country, data.country.translations);
  const region = localize(data.region, data.region.translations);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb
        items={[
          { label: dict.home, href: `/${locale}` },
          { label: dict.nav.countries, href: `/${locale}/country` },
          { label: country.name, href: `/${locale}/country/${data.country.slug}` },
          { label: region.name },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{region.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{country.name}</p>
      {region.introContent && <p className="mt-3 text-muted-foreground">{region.introContent}</p>}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {data.region.capital && (
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">{dict.country.capital}</p>
            <p className="mt-1 font-medium">{data.region.capital}</p>
          </Card>
        )}
        {data.region.languagesText && (
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">{dict.country.languages}</p>
            <p className="mt-1 font-medium">{data.region.languagesText}</p>
          </Card>
        )}
        {data.region.area && (
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">{dict.country.area}</p>
            <p className="mt-1 font-medium">{data.region.area.toLocaleString("en-US")} km²</p>
          </Card>
        )}
      </div>

      <div className="mt-6">
        <AdSlot slot={`country-region-${data.country.slug}-${data.region.slug}-below-stats`} />
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">{dict.country.localLandUnitsHeading}</h2>
        {landConversions.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">{dict.country.noLandDataMessage.replace("{region}", region.name)}</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-2 font-medium">{dict.country.unitColumnHeading}</th>
                  <th className="px-4 py-2 font-medium">{dict.country.equalsColumnHeading}</th>
                  <th className="px-4 py-2 font-medium">{dict.country.sourceLabel}</th>
                </tr>
              </thead>
              <tbody>
                {landConversions.map((lc) => (
                  <tr key={lc.id} className="border-t border-border">
                    <td className="px-4 py-2">1 {lc.fromUnit.name}</td>
                    <td className="px-4 py-2">
                      {Number(lc.factor).toLocaleString("en-US", { maximumFractionDigits: 4 })} {lc.toUnit.name}
                    </td>
                    <td className="px-4 py-2">
                      {lc.sourceUrl ? (
                        <a href={lc.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="text-primary hover:underline">
                          {lc.source ?? dict.country.sourceLabel}
                        </a>
                      ) : (
                        lc.source ?? "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="mt-10">
        <Link href={`/${locale}/land/${data.country.slug}/${data.region.slug}`} className="text-sm font-medium text-primary hover:underline">
          {dict.country.openLandCalculator.replace("{region}", region.name)}
        </Link>
      </div>
    </div>
  );
}
