import { describe, expect, it } from "vitest";
import { numberToWords, type NumberWordsLocale } from "./number-to-words";

// Pins current, spot-checked-correct output as a regression baseline across
// all seven supported locales, rather than one locale in depth. If one of
// these changes, it means the underlying grammar rules moved — worth a
// deliberate look, not a silent behavior change.
const CASES: Record<NumberWordsLocale, Record<string, string>> = {
  en: { "0": "zero", "7": "seven", "21": "twenty-one", "100": "one hundred", "123": "one hundred twenty-three", "1000": "one thousand", "-42": "negative forty-two", "3.25": "three point two five" },
  es: { "0": "cero", "7": "siete", "21": "veintiuno", "100": "cien", "123": "ciento veintitrés", "1000": "mil", "-42": "menos cuarenta y dos", "3.25": "tres coma dos cinco" },
  fr: { "0": "zéro", "7": "sept", "21": "vingt et un", "100": "cent", "123": "cent vingt-trois", "1000": "mille", "-42": "moins quarante-deux", "3.25": "trois virgule deux cinq" },
  bn: { "0": "শূন্য", "7": "সাত", "21": "একুশ", "100": "এক শত", "123": "এক শত তেইশ", "1000": "এক হাজার", "-42": "ঋণাত্মক বিয়াল্লিশ", "3.25": "তিন দশমিক দুই পাঁচ" },
  hi: { "0": "शून्य", "7": "सात", "21": "इक्कीस", "100": "एक सौ", "123": "एक सौ तेईस", "1000": "एक हज़ार", "-42": "ऋणात्मक बयालीस", "3.25": "तीन दशमलव दो पांच" },
  ur: { "0": "صفر", "7": "سات", "21": "اکیس", "100": "ایک سو", "123": "ایک سو تیئس", "1000": "ایک ہزار", "-42": "منفی بیالیس", "3.25": "تین اعشاریہ دو پانچ" },
  ar: { "0": "صفر", "7": "سبعة", "21": "واحد وعشرون", "100": "مئة", "123": "مئة ثلاثة وعشرون", "1000": "ألف", "-42": "سالب اثنان وأربعون", "3.25": "ثلاثة فاصلة اثنان خمسة" },
};

describe("numberToWords", () => {
  for (const [locale, cases] of Object.entries(CASES) as [NumberWordsLocale, Record<string, string>][]) {
    describe(locale, () => {
      for (const [input, expected] of Object.entries(cases)) {
        it(`renders ${input}`, () => {
          expect(numberToWords(Number(input), locale)).toBe(expected);
        });
      }
    });
  }

  it("is deterministic for the same input", () => {
    expect(numberToWords(1234567, "en")).toBe(numberToWords(1234567, "en"));
  });

  it("returns an empty string for non-finite input", () => {
    expect(numberToWords(NaN, "en")).toBe("");
    expect(numberToWords(Infinity, "en")).toBe("");
  });
});
