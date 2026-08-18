/**
 * Shared LibreTranslate client used by scripts/auto-translate.ts and
 * scripts/enrich-country-content.ts. Extracted so both scripts share the
 * same sentence-splitting/retry/bisection logic instead of drifting apart.
 *
 * Setup (one-time):
 *   pip install libretranslate
 *   libretranslate --load-only en,bn,hi,ur,ar,es,fr --port 5000
 * (leave that running in its own terminal)
 */
export const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL ?? "http://localhost:5000";
export const TARGET_LANGUAGES = ["bn", "hi", "ur", "ar", "es", "fr"] as const;
export type TargetLanguage = (typeof TARGET_LANGUAGES)[number];

async function translateRaw(text: string, target: TargetLanguage): Promise<string> {
  const res = await fetch(`${LIBRETRANSLATE_URL}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: text, source: "en", target, format: "text" }),
  });
  if (!res.ok) {
    throw new Error(`LibreTranslate request failed (${res.status}). Is it running?\n${await res.text()}`);
  }
  const data = (await res.json()) as { translatedText: string };
  return data.translatedText;
}

// Splits on sentence-ending punctuation (. ! ? ; or :) followed by
// whitespace + a capital letter — NOT on every period, so decimal points
// ("0.3048 meter") and mid-sentence abbreviations don't get cut. ; and :
// split unconditionally (no capital-letter check) since English commonly
// continues in lowercase after a colon and neither has a decimal-point-style
// false-split risk to guard against.
function splitOnPunctuation(text: string): string[] {
  return text
    .split(/(?:(?<=[.!?])\s+(?=[A-Z])|(?<=[;:])\s+)/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// A comma-only sentence with no ; or : can ALSO come back completely
// untranslated once it's long enough (confirmed directly). Greedily packs
// comma-separated clauses up to the length limit, keeping each comma
// attached to the end of the chunk before it.
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

// Non-Latin-script targets (bn/hi/ur/ar): a real translation is
// overwhelmingly non-Latin letters, so a result that's still mostly A-Za-z
// clearly wasn't translated. es/fr are ALSO Latin-script, so this ratio
// check can't apply there (a correct Spanish/French sentence scores the same
// as untranslated English) — for those the only reliable signal is an exact
// echo, checked unconditionally below.
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
  if (!looksUntranslated(text, result, target)) return result;

  if (text.length < 20) {
    const retry = await translateRaw(text, target);
    if (!looksUntranslated(text, retry, target)) return retry;
    console.warn(`  [${target}] short text still untranslated after retry, keeping as-is: "${text}"`);
    return retry;
  }

  if (depth >= 4) {
    console.warn(`  [${target}] still untranslated after ${depth} splits, keeping as-is: "${text.slice(0, 80)}"`);
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

export async function translate(text: string, target: TargetLanguage): Promise<string> {
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

export async function checkLibreTranslateHealth(): Promise<boolean> {
  const res = await fetch(`${LIBRETRANSLATE_URL}/languages`).catch(() => null);
  return !!res?.ok;
}
