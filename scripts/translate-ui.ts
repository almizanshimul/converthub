/**
 * Reports any dictionary.ts / units.ts entries that exist for `en` (or in
 * the live Unit table) but are missing from the hand-maintained bn/hi/ur
 * blocks, translating just those gaps via LibreTranslate so new UI copy
 * doesn't have to be translated by hand from scratch.
 *
 * This is the static-UI counterpart to auto-translate.ts (which fills DB
 * content — converters, countries, calculators). dictionary.ts and
 * units.ts are hand-maintained files for all four locales, including ur:
 * a full-regenerate-from-LibreTranslate version of this script was tried
 * first and abandoned — the local Urdu model hallucinated badly even on
 * single plain words ("Calculators" translated to a Quran citation,
 * "ConvertHub" to "closed"), so ur's dictionary/unit entries are written
 * by hand like bn/hi, and this script only ever prints a translated
 * suggestion for a *missing* key — it never overwrites existing text, and
 * the suggestion should be read as a rough first draft, not final copy.
 *
 * Setup: same local LibreTranslate server as scripts/auto-translate.ts.
 * Usage: npx tsx scripts/translate-ui.ts
 */
import "dotenv/config";
import { dictionary } from "../src/lib/i18n/dictionary";
import { prisma } from "../src/lib/prisma";

const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL ?? "http://localhost:5000";
const TARGET_LANGUAGES = ["bn", "hi", "ur", "ar", "es", "fr"] as const;
type TargetLanguage = (typeof TARGET_LANGUAGES)[number];

async function translateRaw(text: string, target: TargetLanguage): Promise<string> {
  const res = await fetch(`${LIBRETRANSLATE_URL}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: text, source: "en", target, format: "text" }),
  });
  if (!res.ok) {
    throw new Error(`LibreTranslate request failed (${res.status}). Is it running with "${target}" loaded?\n${await res.text()}`);
  }
  const data = (await res.json()) as { translatedText: string };
  return data.translatedText;
}

/**
 * Splits on "{placeholder}" tokens and translates only the surrounding
 * natural-language segments, then rejoins with the placeholders untouched.
 * Sending a fake stand-in word for the model to translate around confused
 * it badly (it would garble the fake word AND corrupt the rest of the
 * sentence), so placeholders are kept out of every request entirely.
 */
async function translate(text: string, target: TargetLanguage): Promise<string> {
  if (!text.trim()) return text;
  const parts = text.split(/(\{[a-zA-Z]+\})/g);
  const translatedParts = await Promise.all(
    parts.map(async (part) => {
      if (!part.trim() || /^\{[a-zA-Z]+\}$/.test(part)) return part;
      const leading = part.match(/^\s*/)?.[0] ?? "";
      const trailing = part.match(/\s*$/)?.[0] ?? "";
      return leading + (await translateRaw(part, target)).trim() + trailing;
    }),
  );
  return translatedParts.join("");
}

async function deepTranslate(value: unknown, target: TargetLanguage): Promise<unknown> {
  if (typeof value === "string") return translate(value, target);
  if (Array.isArray(value)) {
    const out: unknown[] = [];
    for (const item of value) out.push(await deepTranslate(item, target));
    return out;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = await deepTranslate(v, target);
    return out;
  }
  return value;
}

/** Leaf paths present in `en` but absent from `existing` (hand-maintained bn/hi/ur). */
function findMissingPaths(en: unknown, existing: unknown, prefix: string[] = []): string[][] {
  if (en && typeof en === "object" && !Array.isArray(en)) {
    const missing: string[][] = [];
    for (const [k, v] of Object.entries(en)) {
      const child = existing && typeof existing === "object" ? (existing as Record<string, unknown>)[k] : undefined;
      missing.push(...findMissingPaths(v, child, [...prefix, k]));
    }
    return missing;
  }
  return existing === undefined ? [prefix] : [];
}

function getPath(obj: unknown, path: string[]): unknown {
  return path.reduce<unknown>((acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined), obj);
}

async function reportMissingDictionaryKeys(target: TargetLanguage) {
  const missing = findMissingPaths(dictionary.en, dictionary[target]);
  for (const path of missing) {
    const enValue = getPath(dictionary.en, path);
    const translated = typeof enValue === "string" ? await translate(enValue, target) : await deepTranslate(enValue, target);
    console.log(`[${target}] MISSING dictionary.${path.join(".")} — suggested (review before adding to dictionary.ts):`);
    console.log(`  ${JSON.stringify(translated)}`);
  }
  return missing.length;
}

async function reportMissingUnitNames(target: TargetLanguage, existingNames: Record<string, string> | undefined) {
  const units = await prisma.unit.findMany({ select: { code: true, name: true } });
  const seen = new Set<string>();
  let count = 0;
  for (const u of units) {
    if (seen.has(u.code) || existingNames?.[u.code] !== undefined) continue;
    seen.add(u.code);
    count++;
    const translated = await translate(u.name, target);
    console.log(`[${target}] MISSING units.ts unitNames.${target}["${u.code}"] — suggested (review before adding):`);
    console.log(`  ${JSON.stringify(translated)}`);
  }
  return count;
}

async function main() {
  const health = await fetch(`${LIBRETRANSLATE_URL}/languages`).catch(() => null);
  if (!health?.ok) {
    console.error(`Cannot reach LibreTranslate at ${LIBRETRANSLATE_URL}. Start it first:\n  libretranslate --load-only en,bn,hi,ur --port 5000`);
    process.exit(1);
  }

  const { unitNames } = await import("../src/lib/i18n/units");

  let total = 0;
  for (const target of TARGET_LANGUAGES) {
    total += await reportMissingDictionaryKeys(target);
    total += await reportMissingUnitNames(target, unitNames[target]);
  }
  console.log(total === 0 ? "\nNothing missing — bn/hi/ur dictionary and unit names are complete." : `\n${total} suggestion(s) printed above. Review before hand-adding to dictionary.ts / units.ts.`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
