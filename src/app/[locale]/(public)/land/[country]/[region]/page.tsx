import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { LandCalculatorWidget, type LandUnitOption } from "@/components/land/land-calculator-widget";
import { ShareButton } from "@/components/share/share-button";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

async function getRegionLandData(countrySlug: string, regionSlug: string) {
  const country = await prisma.country.findUnique({ where: { slug: countrySlug } });
  if (!country) return null;
  const region = await prisma.region.findUnique({
    where: { countryId_slug: { countryId: country.id, slug: regionSlug } },
  });
  if (!region) return null;

  const units = await prisma.landUnit.findMany({
    where: { countryId: country.id, OR: [{ regionId: region.id }, { regionId: null }] },
  });
  const unitIds = units.map((u) => u.id);

  const conversions = await prisma.landConversion.findMany({
    where: { status: "PUBLISHED", fromUnitId: { in: unitIds }, toUnitId: { in: unitIds } },
    include: { fromUnit: true, toUnit: true },
  });

  const referenceUnit = units.find((u) => u.code === "square-feet");
  const sqFtFactorByUnitId = new Map<string, number>();
  if (referenceUnit) sqFtFactorByUnitId.set(referenceUnit.id, 1);
  for (const c of conversions) {
    if (c.toUnitId === referenceUnit?.id) sqFtFactorByUnitId.set(c.fromUnitId, Number(c.factor));
  }

  const options: LandUnitOption[] = units
    .filter((u) => sqFtFactorByUnitId.has(u.id))
    .map((u) => ({ id: u.id, name: u.name, sqFtFactor: sqFtFactorByUnitId.get(u.id)! }));

  return { country, region, options, conversions, units };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; region: string }>;
}): Promise<Metadata> {
  const { country: countrySlug, region: regionSlug } = await params;
  const data = await getRegionLandData(countrySlug, regionSlug);
  if (!data) return {};
  return {
    title: `${data.region.name} Land Unit Converter — Bigha, Katha & More`,
    description: `Convert local land units in ${data.region.name}, ${data.country.name}.`,
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
  const data = await getRegionLandData(countrySlug, regionSlug);
  if (!data) notFound();

  const { country, region, options, conversions } = data;
  const sourcedConversions = conversions.filter((c) => c.source || c.sourceUrl);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb
        items={[
          { label: dict.home, href: `/${locale}` },
          { label: dict.nav.land, href: `/${locale}/land` },
          { label: country.name, href: `/${locale}/land/${country.slug}` },
          { label: region.name },
        ]}
      />
      <div className="mt-4 flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{region.name} Land Unit Calculator</h1>
        <ShareButton
          title={`${region.name} Land Unit Calculator`}
          url={`/${locale}/land/${country.slug}/${region.slug}`}
          text={
            sourcedConversions[0]
              ? `1 ${sourcedConversions[0].fromUnit.name} = ${Number(sourcedConversions[0].factor).toLocaleString("en-US", { maximumFractionDigits: 4 })} ${sourcedConversions[0].toUnit.name} (${region.name}, ${country.name})`
              : `${region.name}, ${country.name} — local land unit converter`
          }
          labels={dict.share}
        />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Land-unit definitions can vary by region. These values apply specifically to {region.name}, {country.name}.
      </p>

      <div className="mt-6">
        {options.length >= 2 ? (
          <LandCalculatorWidget units={options} labels={dict.widget} />
        ) : (
          <p className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            Verified local land-unit conversions for {region.name} have not been published yet. Local units such as Bigha or
            Katha are only added once a source can be cited, since the same unit name can mean a different area in a
            neighboring state.
          </p>
        )}
      </div>

      {sourcedConversions.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Sources</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {sourcedConversions.map((c) => (
              <li key={c.id} className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  1 {c.fromUnit.name} = {Number(c.factor).toLocaleString("en-US", { maximumFractionDigits: 4 })} {c.toUnit.name}
                </span>
                {" — "}
                {c.sourceUrl ? (
                  <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="text-primary hover:underline">
                    {c.source ?? "source"}
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
