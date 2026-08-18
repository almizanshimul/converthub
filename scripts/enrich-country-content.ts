/**
 * Adds long-tail (~500 word) English intro content to Country rows, sourced
 * from the Wikipedia intro section (Action API, exintro+explaintext), then
 * translates the new content into Bengali via the local LibreTranslate
 * instance (see scripts/lib/libretranslate.ts).
 *
 * Never touches a country whose introContent is already long-form (>=400
 * words) — safe to re-run. If Wikipedia has nothing usable for a country,
 * that country's existing content is left untouched (not overwritten with
 * something worse, not blanked).
 *
 * Only English (Country.introContent) and Bengali (CountryTranslation for
 * bn) are written — those are the only two locales this site currently
 * serves. Existing hi/ur/ar/es/fr translation rows are never modified or
 * removed.
 *
 * Usage:
 *   npx tsx scripts/enrich-country-content.ts            # all countries
 *   npx tsx scripts/enrich-country-content.ts india nepal # just these slugs (testing)
 */
import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { translate, checkLibreTranslateHealth } from "./lib/libretranslate";

const TARGET_WORDS = 500;
const MIN_USABLE_WORDS = 100;
const ALREADY_LONG_FORM_WORDS = 400;
const WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php";

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Trims to roughly TARGET_WORDS by accumulating whole sentences, so the
// result never ends mid-sentence. Stops as soon as the target is reached
// rather than overshooting, since Wikipedia intros for major countries run
// well past 2000 words.
function trimToTargetWords(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z0-9])/);
  let result = "";
  let words = 0;
  for (const sentence of sentences) {
    result += (result ? " " : "") + sentence;
    words += wordCount(sentence);
    if (words >= TARGET_WORDS) break;
  }
  return result.trim();
}

interface WikipediaResult {
  extract: string;
  url: string;
}

async function fetchWikipediaIntro(title: string): Promise<WikipediaResult | null> {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    formatversion: "2",
    titles: title,
    prop: "extracts|info",
    inprop: "url",
    exintro: "true",
    explaintext: "true",
    redirects: "1",
  });
  const res = await fetch(`${WIKIPEDIA_API}?${params}`, {
    headers: { "User-Agent": "ConvertHub-content-enrichment/1.0 (mkokernak@consumerexp.com)" },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    query?: { pages?: Array<{ missing?: boolean; extract?: string; fullurl?: string }> };
  };
  const page = data.query?.pages?.[0];
  if (!page || page.missing || !page.extract) return null;
  const extract = page.extract.trim();
  if (!extract) return null;
  return { extract, url: page.fullurl ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}` };
}

async function main() {
  const healthy = await checkLibreTranslateHealth();
  if (!healthy) {
    console.error("Cannot reach LibreTranslate. Start it first:\n  libretranslate --load-only en,bn --port 5000");
    process.exit(1);
  }

  const bnLanguage = await prisma.language.findUnique({ where: { code: "bn" } });
  if (!bnLanguage) {
    console.error("No 'bn' Language row found.");
    process.exit(1);
  }

  const onlySlugs = process.argv.slice(2);
  const countries = await prisma.country.findMany({
    where: onlySlugs.length ? { slug: { in: onlySlugs } } : undefined,
    orderBy: { name: "asc" },
  });

  let updated = 0;
  let skippedAlreadyLong = 0;
  let skippedNoWikipedia = 0;
  let skippedTooShort = 0;
  let skippedError = 0;

  for (const country of countries) {
    const existingWords = country.introContent ? wordCount(country.introContent) : 0;
    if (existingWords >= ALREADY_LONG_FORM_WORDS) {
      skippedAlreadyLong++;
      continue;
    }

    // A transient network blip (DNS hiccup, dropped connection) on one
    // country must not kill the whole batch — this was observed in practice
    // (a fetch to Wikipedia failed partway through a 195-country run and the
    // unhandled rejection crashed the process). Every failure here is
    // recoverable by re-running the script, since already-updated countries
    // are skipped via the long-form check above.
    try {
      const wiki = await fetchWikipediaIntro(country.name);
      if (!wiki) {
        console.warn(`[skip] ${country.slug}: no Wikipedia page found for "${country.name}"`);
        skippedNoWikipedia++;
        continue;
      }
      if (wordCount(wiki.extract) < MIN_USABLE_WORDS) {
        console.warn(`[skip] ${country.slug}: Wikipedia extract too short (${wordCount(wiki.extract)} words)`);
        skippedTooShort++;
        continue;
      }

      const englishContent = trimToTargetWords(wiki.extract);
      console.log(`[en] ${country.slug}: ${wordCount(englishContent)} words`);

      await prisma.country.update({
        where: { id: country.id },
        data: {
          introContent: englishContent,
          sourceName: "Wikipedia",
          sourceUrl: wiki.url,
          sourceDate: new Date(),
        },
      });

      console.log(`[bn] ${country.slug}: translating...`);
      const bengaliContent = await translate(englishContent, "bn");
      const existingBnTranslation = await prisma.countryTranslation.findUnique({
        where: { countryId_languageId: { countryId: country.id, languageId: bnLanguage.id } },
      });
      if (existingBnTranslation) {
        await prisma.countryTranslation.update({
          where: { id: existingBnTranslation.id },
          data: { introContent: bengaliContent },
        });
      } else {
        await prisma.countryTranslation.create({
          data: {
            countryId: country.id,
            languageId: bnLanguage.id,
            name: await translate(country.name, "bn"),
            introContent: bengaliContent,
          },
        });
      }

      updated++;
    } catch (err) {
      console.warn(`[skip] ${country.slug}: error during fetch/translate, will retry on next run — ${err instanceof Error ? err.message : err}`);
      skippedError++;
    }
  }

  console.log(
    `\nDone. Updated ${updated}, already long-form ${skippedAlreadyLong}, no Wikipedia match ${skippedNoWikipedia}, extract too short ${skippedTooShort}, errored (retry next run) ${skippedError}.`,
  );
  await prisma.$disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
