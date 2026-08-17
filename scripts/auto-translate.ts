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

const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL ?? "http://localhost:5000";
const TARGET_LANGUAGES = ["bn", "hi", "ur", "ar", "es", "fr"] as const;
type TargetLanguage = (typeof TARGET_LANGUAGES)[number];

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

async function translateRaw(text: string, target: TargetLanguage): Promise<string> {
  const res = await fetch(`${LIBRETRANSLATE_URL}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: text, source: "en", target, format: "text" }),
  });
  if (!res.ok) {
    throw new Error(
      `LibreTranslate request failed (${res.status}). Is it running? See the setup comment at the top of this script.\n${await res.text()}`,
    );
  }
  const data = (await res.json()) as { translatedText: string };
  return data.translatedText;
}

// Splits on sentence-ending punctuation (. ! ? ; or :) followed by
// whitespace + a capital letter — NOT on every period, so decimal points
// ("0.3048 meter") and mid-sentence abbreviations don't get cut. ; and :
// split unconditionally (no capital-letter check) since English commonly
// continues in lowercase after a colon ("definition: it was...") and
// neither has a decimal-point-style false-split risk to guard against.
function splitOnPunctuation(text: string): string[] {
  return text
    .split(/(?:(?<=[.!?])\s+(?=[A-Z])|(?<=[;:])\s+)/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// A comma-only sentence with no ; or : can ALSO come back completely
// untranslated once it's long enough — confirmed directly: a 24-word,
// 155-character sentence returned verbatim, while the identical text split
// roughly in half at a comma translated correctly on both halves. Greedily
// packs comma-separated clauses up to the length limit, keeping each comma
// attached to the end of the chunk before it (so re-joining with " " later
// reconstructs "clause, clause" correctly, the same way it already does
// for ; and : from splitOnPunctuation above).
const MAX_CHUNK_CHARS = 100;
function splitLongSentence(sentence: string): string[] {
  if (sentence.length <= MAX_CHUNK_CHARS) return [sentence];
  const parts = sentence.split(/(?<=,)\s+/);
  const chunks: string[] = [];
  let buffer = "";
  for (const part of parts) {
    const candidate = buffer ? `${buffer} ${part}` : part;
    if (candidate.length > MAX_CHUNK_CHARS && buffer) {
      chunks.push(buffer);
      buffer = part;
    } else {
      buffer = candidate;
    }
  }
  if (buffer) chunks.push(buffer);
  return chunks;
}

function splitSentences(text: string): string[] {
  return splitOnPunctuation(text).flatMap(splitLongSentence);
}

// Splitting on punctuation/length (above) fixed the two specific triggers
// found first — a trailing colon ("The foot took the opposite path:" comes
// back as an English paraphrase, not Arabic) and long comma-only sentences
// — but chasing individual trigger conditions kept surfacing new ones on
// every re-run, on DIFFERENT sentences each time. That's a sign this isn't
// a fixed, enumerable list of triggers; it's this specific local model
// unpredictably failing on some inputs. So on top of the smart splitting
// above (which still helps — most chunks translate fine on the first try),
// every result gets checked for whether it actually looks translated, and
// anything that doesn't gets bisected and retried rather than trusted.
//
// The non-Latin-letter-ratio check below only means something for targets
// whose script differs from English's (bn/hi/ur/ar) — a real Bengali
// translation is overwhelmingly Bengali-script letters, so a result that's
// still mostly A-Za-z clearly wasn't translated. es/fr are ALSO Latin-script,
// so a correct Spanish/French sentence scores the same as untranslated
// English on this metric (both are ~100% A-Za-z) — applying it there was
// confirmed to false-positive on already-correct translations, forcing
// them through repeated bisection into fragment-sized pieces too small to
// translate coherently, which is worse than not bisecting at all. For es/fr
// the only reliable signal is an exact echo (checked above regardless of
// target).
const NON_LATIN_SCRIPT_TARGETS = new Set<TargetLanguage>(["bn", "hi", "ur", "ar"]);
function looksUntranslated(original: string, result: string, target: TargetLanguage): boolean {
  if (result.trim() === original.trim()) return true;
  if (!NON_LATIN_SCRIPT_TARGETS.has(target)) return false;
  const letters = result.replace(/[^\p{L}]/gu, "");
  if (letters.length === 0) return false;
  const nonLatinLetters = letters.replace(/[A-Za-z]/g, "");
  return nonLatinLetters.length / letters.length < 0.3;
}

async function translateWithFallback(text: string, target: TargetLanguage, depth = 0): Promise<string> {
  const result = await translateRaw(text, target);
  if (!looksUntranslated(text, result, target) || depth >= 4 || text.length < 20) {
    if (depth >= 4 && looksUntranslated(text, result, target)) {
      console.warn(`  [${target}] still untranslated after ${depth} splits, keeping as-is: "${text.slice(0, 80)}"`);
    }
    return result;
  }
  const midpoint = Math.floor(text.length / 2);
  const spaceNearMid = text.indexOf(" ", midpoint);
  const splitAt = spaceNearMid !== -1 ? spaceNearMid : midpoint;
  const left = text.slice(0, splitAt).trim();
  const right = text.slice(splitAt).trim();
  if (!left || !right) return result;
  const [leftResult, rightResult] = await Promise.all([
    translateWithFallback(left, target, depth + 1),
    translateWithFallback(right, target, depth + 1),
  ]);
  return `${leftResult} ${rightResult}`;
}

async function translate(text: string, target: TargetLanguage): Promise<string> {
  if (!text.trim()) return text;
  const sentences = splitSentences(text);
  const translated = await Promise.all(
    sentences.map(async (sentence) => {
      const trailingPunctuation = sentence.match(/[;:]$/)?.[0];
      const core = trailingPunctuation ? sentence.slice(0, -1).trim() : sentence;
      const result = await translateWithFallback(core, target);
      return trailingPunctuation ? `${result}${trailingPunctuation}` : result;
    }),
  );
  return translated.join(" ");
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

async function main() {
  const health = await fetch(`${LIBRETRANSLATE_URL}/languages`).catch(() => null);
  if (!health?.ok) {
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
