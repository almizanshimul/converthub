/**
 * Fills in MISSING Bengali/Hindi/Urdu translations by calling a local
 * LibreTranslate server. Never touches an entity that already has a
 * translation row for that language — this only backfills gaps for
 * newly-added content, so it's safe to re-run any time (e.g. after adding a
 * new converter or country).
 *
 * Setup (one-time):
 *   pip install libretranslate
 *   libretranslate --load-only en,bn,hi,ur --port 5000
 * (leave that running in its own terminal while you run this script)
 *
 * Usage:
 *   npx tsx scripts/auto-translate.ts
 *
 * Machine translation is noticeably weaker than the hand-reviewed content
 * already in this project, especially for prose (descriptions, long-form
 * "content" paragraphs, FAQ answers). Unit names in converter titles are
 * exempt from this — they're built from the reviewed lookup table in
 * units.ts, not re-translated here. For Urdu specifically, quality testing
 * turned up real errors even outside of technical terms (mistranslated
 * common words, garbled numbers/exponents in FAQ answers) — spot-check ur
 * output more than bn/hi before treating it as final.
 */
import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { getUnitName } from "../src/lib/i18n/units";
import { LIBRETRANSLATE_URL, TARGET_LANGUAGES, translate, checkLibreTranslateHealth, type TargetLanguage } from "./lib/libretranslate";

// Converter names read as "{from} {connector} {to}". For Bengali/Hindi/Urdu
// that's their "from" postposition (idiomatic "X to Y" in those languages).
// Arabic doesn't have a single-word "from" that reads naturally alone in
// that slot — "إلى" ("to") is the word that makes "{from} إلى {to}" read as
// correct, natural Arabic, since the full idiom "من X إلى Y" needs both
// words and this template only has room for one.
// NOTE: the local LibreTranslate Urdu model tested unreliable even on plain,
// simple input (see scripts/translate-ui.ts) — DB rows translated into ur by
// this script should be spot-checked, more so than bn/hi. Same caution
// applies to ar until it's been checked the same way.
const CONNECTOR: Record<TargetLanguage, string> = { bn: "থেকে", hi: "से", ur: "سے", ar: "إلى", es: "a", fr: "en" };

interface FaqItem {
  question: string;
  answer: string;
}

async function translateFaq(faq: unknown, target: TargetLanguage): Promise<FaqItem[] | undefined> {
  if (!Array.isArray(faq)) return undefined;
  const result: FaqItem[] = [];
  for (const item of faq as FaqItem[]) {
    result.push({ question: await translate(item.question, target), answer: await translate(item.answer, target) });
  }
  return result;
}

async function translateCategories(target: TargetLanguage, languageId: string) {
  const rows = await prisma.converterCategory.findMany({ where: { translations: { none: { languageId } } } });
  for (const row of rows) {
    console.log(`[${target}] category: ${row.slug}`);
    await prisma.categoryTranslation.create({
      data: {
        categoryId: row.id,
        languageId,
        name: await translate(row.name, target),
        description: row.description ? await translate(row.description, target) : null,
      },
    });
  }
  return rows.length;
}

async function translateConverters(target: TargetLanguage, languageId: string) {
  const rows = await prisma.converter.findMany({
    where: { translations: { none: { languageId } } },
    include: { fromUnit: true, toUnit: true },
  });
  for (const row of rows) {
    console.log(`[${target}] converter: ${row.slug}`);
    // Unit names use the hand-reviewed lookup table (units.ts) instead of a
    // fresh LibreTranslate call — re-translating them independently produced
    // real errors (e.g. "Fahrenheit" -> "Pressure", "Foot" -> "Footnote").
    // getUnitName() falls back to the English name when a code isn't in the
    // table yet, same as everywhere else it's used.
    const fromName = getUnitName(row.fromUnit.code, row.fromUnit.name, target);
    const toName = getUnitName(row.toUnit.code, row.toUnit.name, target);
    await prisma.converterTranslation.create({
      data: {
        converterId: row.id,
        languageId,
        name: `${fromName} ${CONNECTOR[target]} ${toName}`,
        description: row.description ? await translate(row.description, target) : null,
        content: row.content ? await translate(row.content, target) : null,
        // Prisma's generated JSON input type doesn't structurally match a
        // concrete FaqItem[] — this is a plain JSON array at runtime either way.
        faq: (await translateFaq(row.faq, target)) as unknown as object | undefined,
      },
    });
  }
  return rows.length;
}

async function translateCountries(target: TargetLanguage, languageId: string) {
  const rows = await prisma.country.findMany({ where: { translations: { none: { languageId } } } });
  for (const row of rows) {
    console.log(`[${target}] country: ${row.slug}`);
    await prisma.countryTranslation.create({
      data: {
        countryId: row.id,
        languageId,
        name: await translate(row.name, target),
        introContent: row.introContent ? await translate(row.introContent, target) : null,
      },
    });
  }
  return rows.length;
}

async function translateRegions(target: TargetLanguage, languageId: string) {
  const rows = await prisma.region.findMany({ where: { translations: { none: { languageId } } } });
  for (const row of rows) {
    console.log(`[${target}] region: ${row.slug}`);
    await prisma.regionTranslation.create({
      data: {
        regionId: row.id,
        languageId,
        name: await translate(row.name, target),
        introContent: row.introContent ? await translate(row.introContent, target) : null,
      },
    });
  }
  return rows.length;
}

async function translateCalculators(target: TargetLanguage, languageId: string) {
  // Unlike the other entities, several calculators already have a hand-
  // written translation row (name/description/faq — see calculator-
  // translations.ts) with no `content`, since long-form content was added
  // later. A plain "translations: none" filter would skip those forever, so
  // this fetches every calculator's translation for this language (if any)
  // and separately backfills just the missing `content` on existing rows.
  const rows = await prisma.calculator.findMany({ include: { translations: { where: { languageId } } } });
  let count = 0;
  for (const row of rows) {
    const existing = row.translations[0];
    if (existing && (existing.content || !row.content)) continue;

    if (existing) {
      console.log(`[${target}] calculator content: ${row.slug}`);
      await prisma.calculatorTranslation.update({
        where: { id: existing.id },
        data: { content: await translate(row.content!, target) },
      });
    } else {
      console.log(`[${target}] calculator: ${row.slug}`);
      await prisma.calculatorTranslation.create({
        data: {
          calculatorId: row.id,
          languageId,
          name: await translate(row.name, target),
          description: row.description ? await translate(row.description, target) : null,
          content: row.content ? await translate(row.content, target) : null,
          // Prisma's generated JSON input type doesn't structurally match a
          // concrete FaqItem[] — this is a plain JSON array at runtime either way.
          faq: (await translateFaq(row.faq, target)) as unknown as object | undefined,
        },
      });
    }
    count++;
  }
  return count;
}

async function translateBlogPosts(target: TargetLanguage, languageId: string) {
  const rows = await prisma.blogPost.findMany({ where: { translations: { none: { languageId } } } });
  for (const row of rows) {
    console.log(`[${target}] blog post: ${row.slug}`);
    await prisma.blogPostTranslation.create({
      data: {
        blogPostId: row.id,
        languageId,
        title: await translate(row.title, target),
        excerpt: row.excerpt ? await translate(row.excerpt, target) : null,
        content: await translate(row.content, target),
        seoTitle: row.seoTitle ? await translate(row.seoTitle, target) : null,
        seoDescription: row.seoDescription ? await translate(row.seoDescription, target) : null,
      },
    });
  }
  return rows.length;
}

async function main() {
  const healthy = await checkLibreTranslateHealth();
  if (!healthy) {
    console.error(`Cannot reach LibreTranslate at ${LIBRETRANSLATE_URL}. Start it first:\n  libretranslate --load-only en,bn,hi --port 5000`);
    process.exit(1);
  }

  const languages = await prisma.language.findMany();
  const languageIdByCode = new Map(languages.map((l) => [l.code, l.id]));

  let total = 0;
  for (const target of TARGET_LANGUAGES) {
    const languageId = languageIdByCode.get(target);
    if (!languageId) continue;
    total += await translateCategories(target, languageId);
    total += await translateConverters(target, languageId);
    total += await translateCountries(target, languageId);
    total += await translateRegions(target, languageId);
    total += await translateCalculators(target, languageId);
    total += await translateBlogPosts(target, languageId);
  }

  console.log(total === 0 ? "Nothing to translate — every entity already has bn/hi translations." : `Translated ${total} entries. Spot-check technical terms before treating as final.`);
  await prisma.$disconnect();
  // Without this, the process can hang indefinitely after finishing all real
  // work — observed in practice with this script (likely a lingering
  // keep-alive handle from either the MariaDB adapter or the LibreTranslate
  // fetch() calls). All meaningful work is done by this point, so a forced
  // exit here is safe.
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
