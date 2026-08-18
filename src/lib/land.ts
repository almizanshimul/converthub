import { prisma } from "@/lib/prisma";
import type { LandUnitOption } from "@/components/land/land-calculator-widget";

// A region only has a genuinely usable calculator once at least 2 of its
// land units (country-wide defaults plus any region-specific overrides)
// carry a published conversion factor to the square-feet reference unit.
// Shared by the land pages, their generateStaticParams, and the sitemap so
// the "real vs thin" bar can never drift between them.
export async function computeLandOptions(countryId: string, regionId: string) {
  const units = await prisma.landUnit.findMany({
    where: { countryId, OR: [{ regionId }, { regionId: null }] },
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

  return { units, conversions, options };
}

// Region IDs (mapped to their country ID) that clear the "real calculator"
// bar above. Only these get a land/[country]/[region] page generated.
//
// Same rule as computeLandOptions, but computed in bulk (3 queries total)
// instead of calling computeLandOptions per region - that was 2 queries x
// ~3,300 published regions, which is fast enough once at build time but far
// too slow for a dev-mode request (no build-time caching there) to recompute
// on every hit.
export async function getRealLandRegionIds(): Promise<Map<string, string>> {
  const [regions, units, conversions] = await Promise.all([
    prisma.region.findMany({ where: { status: "PUBLISHED" }, select: { id: true, countryId: true } }),
    prisma.landUnit.findMany({ select: { id: true, countryId: true, regionId: true, code: true } }),
    prisma.landConversion.findMany({
      where: { status: "PUBLISHED" },
      select: { fromUnitId: true, toUnitId: true },
    }),
  ]);

  const countryWideUnits = new Map<string, typeof units>();
  const regionUnits = new Map<string, typeof units>();
  for (const u of units) {
    const bucket = u.regionId === null ? countryWideUnits : regionUnits;
    const key = u.regionId ?? u.countryId;
    if (!bucket.has(key)) bucket.set(key, []);
    bucket.get(key)!.push(u);
  }

  const conversionsByToUnit = new Map<string, Set<string>>();
  for (const c of conversions) {
    if (!conversionsByToUnit.has(c.toUnitId)) conversionsByToUnit.set(c.toUnitId, new Set());
    conversionsByToUnit.get(c.toUnitId)!.add(c.fromUnitId);
  }

  const real = new Map<string, string>();
  for (const r of regions) {
    const applicable = [...(countryWideUnits.get(r.countryId) ?? []), ...(regionUnits.get(r.id) ?? [])];
    const referenceUnit = applicable.find((u) => u.code === "square-feet");
    if (!referenceUnit) continue;
    const withFactor = conversionsByToUnit.get(referenceUnit.id) ?? new Set<string>();
    const optionsCount = applicable.filter((u) => u.id === referenceUnit.id || withFactor.has(u.id)).length;
    if (optionsCount >= 2) real.set(r.id, r.countryId);
  }
  return real;
}
