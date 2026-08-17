import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import type { ConversionType } from "../src/generated/prisma/enums";
import { converterCategories } from "./data/converter-categories";
import { countries } from "./data/countries";
import { landData } from "./data/land-conversions";
import { calculators } from "./data/calculators";
import { converterContentEn } from "./data/i18n/converter-content-en";
import { bnCountryTranslations, bnRegionTranslations } from "./data/i18n/bn-geo-translations";
import { hiCountryTranslations, hiRegionTranslations } from "./data/i18n/hi-geo-translations";
import { bnCategoryTranslations, bnConverterTranslations } from "./data/i18n/bn-translations";
import { hiCategoryTranslations, hiConverterTranslations } from "./data/i18n/hi-translations";
import { hiContent } from "./data/i18n/hi-content";
import { bnContent } from "./data/i18n/bn-content";
import {
  bnCalculatorTranslations,
  hiCalculatorTranslations,
  urCalculatorTranslations,
  arCalculatorTranslations,
  esCalculatorTranslations,
  frCalculatorTranslations,
} from "./data/i18n/calculator-translations";
import { urCategoryTranslations } from "./data/i18n/ur-translations";
import { arCategoryTranslations } from "./data/i18n/ar-translations";
import { esCategoryTranslations } from "./data/i18n/es-translations";
import { frCategoryTranslations } from "./data/i18n/fr-translations";

async function seedLanguages() {
  const languages = [
    { code: "en", name: "English", nativeName: "English", direction: "ltr", isDefault: true, order: 1 },
    { code: "bn", name: "Bengali", nativeName: "বাংলা", direction: "ltr", isDefault: false, order: 2 },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी", direction: "ltr", isDefault: false, order: 3 },
    { code: "ur", name: "Urdu", nativeName: "اردو", direction: "rtl", isDefault: false, order: 4 },
    { code: "ar", name: "Arabic", nativeName: "العربية", direction: "rtl", isDefault: false, order: 5 },
    { code: "es", name: "Spanish", nativeName: "Español", direction: "ltr", isDefault: false, order: 6 },
    { code: "fr", name: "French", nativeName: "Français", direction: "ltr", isDefault: false, order: 7 },
  ];

  for (const lang of languages) {
    await prisma.language.upsert({
      where: { code: lang.code },
      update: lang,
      create: lang,
    });
  }
  console.log(`Seeded ${languages.length} languages`);
}

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("Skipping admin user: set ADMIN_EMAIL / ADMIN_PASSWORD in .env first");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN" },
    create: { email, passwordHash, name: "Admin", role: "ADMIN" },
  });
  console.log(`Seeded admin user: ${email}`);
}

async function seedConverterCategories() {
  for (const cat of converterCategories) {
    const category = await prisma.converterCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, icon: cat.icon },
      create: { slug: cat.slug, name: cat.name, description: cat.description, icon: cat.icon },
    });

    const unitIdByCode = new Map<string, string>();
    for (const unit of cat.units) {
      const created = await prisma.unit.upsert({
        where: { categoryId_code: { categoryId: category.id, code: unit.code } },
        update: {
          name: unit.name,
          symbol: unit.symbol,
          toBaseFactor: unit.toBaseFactor,
          isBaseUnit: unit.isBaseUnit ?? false,
        },
        create: {
          categoryId: category.id,
          code: unit.code,
          name: unit.name,
          symbol: unit.symbol,
          toBaseFactor: unit.toBaseFactor,
          isBaseUnit: unit.isBaseUnit ?? false,
        },
      });
      unitIdByCode.set(unit.code, created.id);
    }

    for (const conv of cat.popularConverters) {
      const fromUnitId = unitIdByCode.get(conv.fromCode);
      const toUnitId = unitIdByCode.get(conv.toCode);
      const fromUnit = cat.units.find((u) => u.code === conv.fromCode);
      const toUnit = cat.units.find((u) => u.code === conv.toCode);
      if (!fromUnitId || !toUnitId || !fromUnit || !toUnit) {
        throw new Error(`Unknown unit code in popularConverters for ${cat.slug}: ${conv.fromCode} / ${conv.toCode}`);
      }

      const slug = `${conv.fromCode}-to-${conv.toCode}`;
      const conversionType: ConversionType = cat.slug === "temperature" ? "FORMULA" : "MULTIPLY";
      // Regional/researched converters carry their own hand-written `content`;
      // everything else falls back to the generated long-form article.
      const content = conv.content ?? converterContentEn[slug];

      await prisma.converter.upsert({
        where: { slug },
        update: {
          categoryId: category.id,
          fromUnitId,
          toUnitId,
          name: `${fromUnit.name} to ${toUnit.name}`,
          description: conv.description,
          content,
          conversionType,
          precision: 4,
          faq: conv.faq,
          isIndexable: true,
          status: "PUBLISHED",
        },
        create: {
          slug,
          categoryId: category.id,
          fromUnitId,
          toUnitId,
          name: `${fromUnit.name} to ${toUnit.name}`,
          description: conv.description,
          content,
          conversionType,
          precision: 4,
          faq: conv.faq,
          isIndexable: true,
          status: "PUBLISHED",
        },
      });
    }
  }
  console.log(`Seeded ${converterCategories.length} converter categories`);
}

async function seedCountries() {
  for (const c of countries) {
    const country = await prisma.country.upsert({
      where: { code: c.code },
      update: {
        slug: c.slug,
        name: c.name,
        capital: c.capital,
        currencyCode: c.currencyCode,
        area: c.area,
        population: c.population,
        languagesText: c.languagesText,
        introContent: c.introContent,
        sourceName: c.sourceName,
        sourceUrl: c.sourceUrl,
        sourceDate: c.sourceDate ? new Date(c.sourceDate) : undefined,
        status: "PUBLISHED",
        isIndexable: true,
      },
      create: {
        code: c.code,
        slug: c.slug,
        name: c.name,
        capital: c.capital,
        currencyCode: c.currencyCode,
        area: c.area,
        population: c.population,
        languagesText: c.languagesText,
        introContent: c.introContent,
        sourceName: c.sourceName,
        sourceUrl: c.sourceUrl,
        sourceDate: c.sourceDate ? new Date(c.sourceDate) : undefined,
        status: "PUBLISHED",
        isIndexable: true,
      },
    });

    for (const r of c.regions) {
      await prisma.region.upsert({
        where: { countryId_slug: { countryId: country.id, slug: r.slug } },
        update: {
          name: r.name,
          type: r.type,
          capital: r.capital,
          languagesText: r.languagesText,
          area: r.area,
          status: "PUBLISHED",
          isIndexable: true,
        },
        create: {
          countryId: country.id,
          slug: r.slug,
          name: r.name,
          type: r.type,
          capital: r.capital,
          languagesText: r.languagesText,
          area: r.area,
          status: "PUBLISHED",
          isIndexable: true,
        },
      });
    }
  }
  console.log(`Seeded ${countries.length} countries`);
}

async function seedLandData() {
  let unitCount = 0;
  let conversionCount = 0;

  for (const countryData of landData) {
    const country = await prisma.country.findUnique({ where: { slug: countryData.countrySlug } });
    if (!country) {
      console.warn(`Skipping land data for unknown country: ${countryData.countrySlug}`);
      continue;
    }

    // Pass 1: create every unit so cross-region references (e.g. the shared
    // country-wide "square-feet" pivot) can always be resolved in pass 2.
    const unitIdByRegionAndCode = new Map<string, string>();
    let countryWideSqFtId: string | undefined;

    for (const regionGroup of countryData.regions) {
      const region = regionGroup.regionSlug
        ? await prisma.region.findUnique({
            where: { countryId_slug: { countryId: country.id, slug: regionGroup.regionSlug } },
          })
        : null;

      for (const unit of regionGroup.units) {
        // MySQL can't upsert on a compound unique key that includes a nullable
        // column (NULL never equals NULL in a unique index lookup), so
        // country-wide units (regionId: null) need manual find-then-write.
        const existing = await prisma.landUnit.findFirst({
          where: { countryId: country.id, regionId: region?.id ?? null, code: unit.code },
        });
        const created = existing
          ? await prisma.landUnit.update({ where: { id: existing.id }, data: { name: unit.name } })
          : await prisma.landUnit.create({
              data: { countryId: country.id, regionId: region?.id ?? null, code: unit.code, name: unit.name },
            });
        unitCount++;
        unitIdByRegionAndCode.set(`${region?.id ?? "country"}:${unit.code}`, created.id);
        if (!region && unit.code === "square-feet") countryWideSqFtId = created.id;
      }
    }

    // Pass 2: conversions. toCode is always the country-wide reference unit.
    for (const regionGroup of countryData.regions) {
      const region = regionGroup.regionSlug
        ? await prisma.region.findUnique({
            where: { countryId_slug: { countryId: country.id, slug: regionGroup.regionSlug } },
          })
        : null;

      for (const conv of regionGroup.conversions) {
        const fromUnitId = unitIdByRegionAndCode.get(`${region?.id ?? "country"}:${conv.fromCode}`);
        const toUnitId = conv.toCode === "square-feet" ? countryWideSqFtId : undefined;
        if (!fromUnitId || !toUnitId) {
          throw new Error(`Could not resolve units for land conversion ${countryData.countrySlug}/${regionGroup.regionSlug ?? "country-wide"}: ${conv.fromCode} -> ${conv.toCode}`);
        }

        await prisma.landConversion.upsert({
          where: { fromUnitId_toUnitId: { fromUnitId, toUnitId } },
          update: {
            countryId: country.id,
            regionId: region?.id ?? null,
            factor: conv.factor,
            source: conv.source,
            sourceUrl: conv.sourceUrl,
            notes: conv.notes,
            status: "PUBLISHED",
            isIndexable: true,
          },
          create: {
            countryId: country.id,
            regionId: region?.id ?? null,
            fromUnitId,
            toUnitId,
            factor: conv.factor,
            source: conv.source,
            sourceUrl: conv.sourceUrl,
            notes: conv.notes,
            status: "PUBLISHED",
            isIndexable: true,
          },
        });
        conversionCount++;
      }
    }
  }

  console.log(`Seeded ${unitCount} land units and ${conversionCount} land conversions`);
}

async function seedGeoTranslations() {
  const languages = await prisma.language.findMany();
  const languageIdByCode = new Map(languages.map((l) => [l.code, l.id]));

  const sets = [
    { code: "bn", countries: bnCountryTranslations, regions: bnRegionTranslations },
    { code: "hi", countries: hiCountryTranslations, regions: hiRegionTranslations },
  ];

  let count = 0;
  for (const set of sets) {
    const languageId = languageIdByCode.get(set.code);
    if (!languageId) continue;

    for (const [slug, t] of Object.entries(set.countries)) {
      const country = await prisma.country.findUnique({ where: { slug } });
      if (!country) {
        console.warn(`Skipping ${set.code} country translation for unknown slug: ${slug}`);
        continue;
      }
      await prisma.countryTranslation.upsert({
        where: { countryId_languageId: { countryId: country.id, languageId } },
        update: { name: t.name, introContent: t.introContent },
        create: { countryId: country.id, languageId, name: t.name, introContent: t.introContent },
      });
      count++;
    }

    for (const [slug, t] of Object.entries(set.regions)) {
      // Region slugs are unique per-country, not globally (e.g. "punjab" is
      // both an Indian state and a Pakistani province) — translate every
      // region matching this slug, not just the first match.
      const regions = await prisma.region.findMany({ where: { slug } });
      for (const region of regions) {
        await prisma.regionTranslation.upsert({
          where: { regionId_languageId: { regionId: region.id, languageId } },
          update: { name: t.name },
          create: { regionId: region.id, languageId, name: t.name },
        });
        count++;
      }
    }
  }
  console.log(`Seeded ${count} country/region translations`);
}

async function seedCategoryConverterTranslations() {
  const languages = await prisma.language.findMany();
  const languageIdByCode = new Map(languages.map((l) => [l.code, l.id]));

  // content maps are optional and populated per-language as translations land —
  // missing entries simply leave the translated `content` field unset, and the
  // page falls back to the English article until a translation exists.
  const sets: { code: string; categories: typeof bnCategoryTranslations; converters: typeof bnConverterTranslations; content?: Record<string, string> }[] = [
    { code: "bn", categories: bnCategoryTranslations, converters: bnConverterTranslations, content: bnContent },
    { code: "hi", categories: hiCategoryTranslations, converters: hiConverterTranslations, content: hiContent },
    // Converter names for ur come from scripts/auto-translate.ts (LibreTranslate)
    // instead of curated seed data — only categories are reviewed/hand-fixed here.
    { code: "ur", categories: urCategoryTranslations, converters: {} },
    { code: "ar", categories: arCategoryTranslations, converters: {} },
    { code: "es", categories: esCategoryTranslations, converters: {} },
    { code: "fr", categories: frCategoryTranslations, converters: {} },
  ];

  let count = 0;
  for (const set of sets) {
    const languageId = languageIdByCode.get(set.code);
    if (!languageId) continue;

    for (const [slug, t] of Object.entries(set.categories)) {
      const category = await prisma.converterCategory.findUnique({ where: { slug } });
      if (!category) {
        console.warn(`Skipping ${set.code} category translation for unknown slug: ${slug}`);
        continue;
      }
      await prisma.categoryTranslation.upsert({
        where: { categoryId_languageId: { categoryId: category.id, languageId } },
        update: { name: t.name, description: t.description },
        create: { categoryId: category.id, languageId, name: t.name, description: t.description },
      });
      count++;
    }

    for (const [slug, t] of Object.entries(set.converters)) {
      const converter = await prisma.converter.findUnique({ where: { slug } });
      if (!converter) {
        console.warn(`Skipping ${set.code} converter translation for unknown slug: ${slug}`);
        continue;
      }
      const content = set.content?.[slug];
      await prisma.converterTranslation.upsert({
        where: { converterId_languageId: { converterId: converter.id, languageId } },
        update: { name: t.name, description: t.description, faq: t.faq, content },
        create: { converterId: converter.id, languageId, name: t.name, description: t.description, faq: t.faq, content },
      });
      count++;
    }
  }
  console.log(`Seeded ${count} category/converter translations`);
}

async function seedCalculators() {
  for (const calc of calculators) {
    await prisma.calculator.upsert({
      where: { slug: calc.slug },
      update: {
        name: calc.name,
        category: calc.category,
        description: calc.description,
        content: calc.content,
        logicKey: calc.logicKey,
        faq: calc.faq,
        isIndexable: true,
        status: "PUBLISHED",
      },
      create: {
        slug: calc.slug,
        name: calc.name,
        category: calc.category,
        description: calc.description,
        content: calc.content,
        logicKey: calc.logicKey,
        faq: calc.faq,
        isIndexable: true,
        status: "PUBLISHED",
      },
    });
  }
  console.log(`Seeded ${calculators.length} calculators`);
}

async function seedCalculatorTranslations() {
  const languages = await prisma.language.findMany();
  const languageIdByCode = new Map(languages.map((l) => [l.code, l.id]));

  const sets = [
    { code: "bn", translations: bnCalculatorTranslations },
    { code: "hi", translations: hiCalculatorTranslations },
    { code: "ur", translations: urCalculatorTranslations },
    { code: "ar", translations: arCalculatorTranslations },
    { code: "es", translations: esCalculatorTranslations },
    { code: "fr", translations: frCalculatorTranslations },
  ];

  let count = 0;
  for (const set of sets) {
    const languageId = languageIdByCode.get(set.code);
    if (!languageId) continue;

    for (const [slug, t] of Object.entries(set.translations)) {
      const calculator = await prisma.calculator.findUnique({ where: { slug } });
      if (!calculator) {
        console.warn(`Skipping ${set.code} calculator translation for unknown slug: ${slug}`);
        continue;
      }
      await prisma.calculatorTranslation.upsert({
        where: { calculatorId_languageId: { calculatorId: calculator.id, languageId } },
        update: { name: t.name, description: t.description, faq: t.faq },
        create: { calculatorId: calculator.id, languageId, name: t.name, description: t.description, faq: t.faq },
      });
      count++;
    }
  }
  console.log(`Seeded ${count} calculator translations`);
}

async function main() {
  await seedLanguages();
  await seedAdminUser();
  await seedConverterCategories();
  await seedCountries();
  await seedLandData();
  await seedGeoTranslations();
  await seedCategoryConverterTranslations();
  await seedCalculators();
  await seedCalculatorTranslations();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
