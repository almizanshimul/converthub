/**
 * Bengali and Hindi number names for 0-99 are almost entirely irregular
 * (not composed from "twenty" + "one" the way English is past twelve), so
 * both languages need a full lookup table rather than a compositional rule.
 * Above 99, both use the Indian numbering system: hundred, thousand, lakh
 * (10^5), crore (10^7), arab (10^9), kharab (10^11), nil (10^13),
 * padma (10^15), shankha (10^17) — grouped 2-2-3 from the right (e.g.
 * 12,34,56,789), not the international 3-3-3 grouping. Urdu shares this
 * same South Asian numbering convention and largely the same spoken number
 * words as Hindi (Hindi/Urdu are the same spoken language historically),
 * just written in the Perso-Arabic script — so it reuses the Indian scale
 * structure below with its own word list.
 *
 * English/Spanish/French/Arabic use the international system (thousand,
 * million, billion, trillion — grouped 3-3-3) instead. All five new
 * languages also get a full 0-99 lookup table for the same reason bn/hi
 * do — it sidesteps a whole category of compositional bugs (French's
 * "quatre-vingts", Spanish's "dieciséis" vs "diez y seis", etc. are all
 * just correct table entries instead of special-cased logic).
 *
 * A couple of deliberate simplifications past 99, noted where they apply:
 * Spanish's irregular hundred-stems (doscientos, quinientos...) and cien/
 * ciento are handled exactly; French's "cent"/"mille" not taking a "un"
 * prefix and "cents" pluralizing only when nothing follows are handled
 * exactly. Arabic's grammatically-correct dual/plural agreement for
 * hundreds and thousands (e.g. مئتان for 200, ثلاثة آلاف for 3,000) is NOT
 * implemented — this tool uses the simpler invariant compositional form
 * (count word + scale word) throughout, which is fully intelligible but
 * not full Modern Standard Arabic grammar. That's a scope choice, not an
 * oversight.
 */

const BN_ONES = [
  "শূন্য", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়",
  "দশ", "এগারো", "বারো", "তেরো", "চৌদ্দ", "পনেরো", "ষোলো", "সতেরো", "আঠারো", "ঊনিশ",
  "বিশ", "একুশ", "বাইশ", "তেইশ", "চব্বিশ", "পঁচিশ", "ছাব্বিশ", "সাতাশ", "আটাশ", "ঊনত্রিশ",
  "ত্রিশ", "একত্রিশ", "বত্রিশ", "তেত্রিশ", "চৌত্রিশ", "পঁয়ত্রিশ", "ছত্রিশ", "সাঁইত্রিশ", "আটত্রিশ", "ঊনচল্লিশ",
  "চল্লিশ", "একচল্লিশ", "বিয়াল্লিশ", "তেতাল্লিশ", "চুয়াল্লিশ", "পঁয়তাল্লিশ", "ছেচল্লিশ", "সাতচল্লিশ", "আটচল্লিশ", "ঊনপঞ্চাশ",
  "পঞ্চাশ", "একান্ন", "বাহান্ন", "তেপ্পান্ন", "চুয়ান্ন", "পঞ্চান্ন", "ছাপ্পান্ন", "সাতান্ন", "আটান্ন", "ঊনষাট",
  "ষাট", "একষট্টি", "বাষট্টি", "তেষট্টি", "চৌষট্টি", "পঁয়ষট্টি", "ছেষট্টি", "সাতষট্টি", "আটষট্টি", "ঊনসত্তর",
  "সত্তর", "একাত্তর", "বাহাত্তর", "তিয়াত্তর", "চুয়াত্তর", "পঁচাত্তর", "ছিয়াত্তর", "সাতাত্তর", "আটাত্তর", "ঊনআশি",
  "আশি", "একাশি", "বিরাশি", "তিরাশি", "চুরাশি", "পঁচাশি", "ছিয়াশি", "সাতাশি", "আটাশি", "ঊননব্বই",
  "নব্বই", "একানব্বই", "বিরানব্বই", "তিরানব্বই", "চুরানব্বই", "পঁচানব্বই", "ছিয়ানব্বই", "সাতানব্বই", "আটানব্বই", "নিরানব্বই",
];

const HI_ONES = [
  "शून्य", "एक", "दो", "तीन", "चार", "पांच", "छह", "सात", "आठ", "नौ",
  "दस", "ग्यारह", "बारह", "तेरह", "चौदह", "पंद्रह", "सोलह", "सत्रह", "अठारह", "उन्नीस",
  "बीस", "इक्कीस", "बाईस", "तेईस", "चौबीस", "पच्चीस", "छब्बीस", "सत्ताईस", "अट्ठाईस", "उनतीस",
  "तीस", "इकतीस", "बत्तीस", "तैंतीस", "चौंतीस", "पैंतीस", "छत्तीस", "सैंतीस", "अड़तीस", "उनतालीस",
  "चालीस", "इकतालीस", "बयालीस", "तैंतालीस", "चवालीस", "पैंतालीस", "छियालीस", "सैंतालीस", "अड़तालीस", "उनचास",
  "पचास", "इक्यावन", "बावन", "तिरपन", "चौवन", "पचपन", "छप्पन", "सत्तावन", "अट्ठावन", "उनसठ",
  "साठ", "इकसठ", "बासठ", "तिरसठ", "चौंसठ", "पैंसठ", "छियासठ", "सड़सठ", "अड़सठ", "उनहत्तर",
  "सत्तर", "इकहत्तर", "बहत्तर", "तिहत्तर", "चौहत्तर", "पचहत्तर", "छिहत्तर", "सतहत्तर", "अठहत्तर", "उन्यासी",
  "अस्सी", "इक्यासी", "बयासी", "तिरासी", "चौरासी", "पचासी", "छियासी", "सत्तासी", "अट्ठासी", "नवासी",
  "नब्बे", "इक्यानबे", "बानबे", "तिरानबे", "चौरानबे", "पंचानबे", "छियानबे", "सत्तानबे", "अट्ठानबे", "निन्यानबे",
];

const UR_ONES = [
  "صفر", "ایک", "دو", "تین", "چار", "پانچ", "چھ", "سات", "آٹھ", "نو",
  "دس", "گیارہ", "بارہ", "تیرہ", "چودہ", "پندرہ", "سولہ", "سترہ", "اٹھارہ", "انیس",
  "بیس", "اکیس", "بائیس", "تیئس", "چوبیس", "پچیس", "چھبیس", "ستائیس", "اٹھائیس", "انتیس",
  "تیس", "اکتیس", "بتیس", "تینتیس", "چونتیس", "پینتیس", "چھتیس", "سینتیس", "اڑتیس", "انتالیس",
  "چالیس", "اکتالیس", "بیالیس", "تینتالیس", "چوالیس", "پینتالیس", "چھیالیس", "سینتالیس", "اڑتالیس", "انچاس",
  "پچاس", "اکاون", "باون", "ترپن", "چون", "پچپن", "چھپن", "ستاون", "اٹھاون", "انسٹھ",
  "ساٹھ", "اکسٹھ", "باسٹھ", "تریسٹھ", "چوسٹھ", "پینسٹھ", "چھیاسٹھ", "سڑسٹھ", "اڑسٹھ", "انہتر",
  "ستر", "اکہتر", "بہتر", "تہتر", "چوہتر", "پچہتر", "چھہتر", "ستتر", "اٹھہتر", "انیاسی",
  "اسی", "اکیاسی", "بیاسی", "تراسی", "چوراسی", "پچاسی", "چھیاسی", "ستاسی", "اٹھاسی", "نواسی",
  "نوے", "اکانوے", "بانوے", "ترانوے", "چورانوے", "پچانوے", "چھیانوے", "ستانوے", "اٹھانوے", "ننانوے",
];

const EN_ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
];
const EN_TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
function buildCompositional(ones19: string[], tens: string[], joiner: string, teenBase = 20): string[] {
  const table: string[] = [];
  for (let n = 0; n < 100; n++) {
    if (n < teenBase) {
      table.push(ones19[n]);
    } else {
      const t = Math.floor(n / 10);
      const o = n % 10;
      table.push(o === 0 ? tens[t] : `${tens[t]}${joiner}${ones19[o]}`);
    }
  }
  return table;
}

const ES_ONES_0_15 = [
  "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve",
  "diez", "once", "doce", "trece", "catorce", "quince",
];
const ES_16_29 = ["dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];
const ES_TENS = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
function buildEsOnes(): string[] {
  const table: string[] = [...ES_ONES_0_15, ...ES_16_29];
  for (let n = 30; n < 100; n++) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    table.push(o === 0 ? ES_TENS[t] : `${ES_TENS[t]} y ${ES_ONES_0_15[o]}`);
  }
  return table;
}

const FR_ONES_0_16 = [
  "zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
  "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize",
];
function buildFrOnes(): string[] {
  const table: string[] = [...FR_ONES_0_16];
  // 17-19: dix-sept, dix-huit, dix-neuf
  for (let o = 7; o <= 9; o++) table.push(`dix-${FR_ONES_0_16[o]}`);
  // 20-59: regular tens (vingt, trente, quarante, cinquante), "et un" for the
  // -1 forms, hyphenated otherwise.
  const regularTens: [number, string][] = [[20, "vingt"], [30, "trente"], [40, "quarante"], [50, "cinquante"]];
  for (const [base, word] of regularTens) {
    table[base] = word;
    for (let o = 1; o <= 9; o++) {
      table[base + o] = o === 1 ? `${word} et un` : `${word}-${FR_ONES_0_16[o]}`;
    }
  }
  // 60-79: soixante, then soixante-dix onward reuses the 10-19 forms already
  // built above as the "ones" part (soixante-douze = 72, soixante-quinze =
  // 75...) — read from `table`, not FR_ONES_0_16, since indices 17-19
  // ("dix-sept"/"dix-huit"/"dix-neuf") only exist on the table so far.
  table[60] = "soixante";
  for (let o = 1; o <= 9; o++) table[60 + o] = o === 1 ? "soixante et un" : `soixante-${FR_ONES_0_16[o]}`;
  table[70] = "soixante-dix";
  table[71] = "soixante et onze";
  for (let o = 2; o <= 9; o++) table[70 + o] = `soixante-${table[10 + o]}`;
  // 80-99: quatre-vingts (only plural when bare), quatre-vingt-dix onward.
  table[80] = "quatre-vingts";
  for (let o = 1; o <= 9; o++) table[80 + o] = `quatre-vingt-${FR_ONES_0_16[o]}`;
  table[90] = "quatre-vingt-dix";
  for (let o = 1; o <= 9; o++) table[90 + o] = `quatre-vingt-${table[10 + o]}`;
  return table;
}

const AR_ONES_0_19 = [
  "صفر", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة",
  "عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر",
];
const AR_TENS = ["", "", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
function buildArOnes(): string[] {
  const table: string[] = [...AR_ONES_0_19];
  for (let n = 20; n < 100; n++) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    // Arabic reads compound numbers "ones and-tens" (e.g. 25 = "خمسة وعشرون",
    // literally "five and-twenty") — the reverse order from English.
    table.push(o === 0 ? AR_TENS[t] : `${AR_ONES_0_19[o]} و${AR_TENS[t]}`);
  }
  return table;
}

const EN_ONES_100 = buildCompositional(EN_ONES, EN_TENS, "-");
const ES_ONES_100 = buildEsOnes();
const FR_ONES_100 = buildFrOnes();
const AR_ONES_100 = buildArOnes();

export type NumberWordsLocale = "bn" | "hi" | "ur" | "en" | "ar" | "es" | "fr";

const ONES: Record<NumberWordsLocale, string[]> = {
  bn: BN_ONES,
  hi: HI_ONES,
  ur: UR_ONES,
  en: EN_ONES_100,
  es: ES_ONES_100,
  fr: FR_ONES_100,
  ar: AR_ONES_100,
};

interface Scale {
  value: number;
  word: string;
  /** Word to use when count >= 2 (French/Spanish "million"->"millions"). */
  pluralWord?: string;
  /** count === 1 renders as just `word`, with no "one"/"un"/"واحد" prefix at
   * all (French "cent"/"mille", Spanish "mil" and its compounds, Arabic
   * scales generally don't take a literal "one" before them). */
  bareAtOne?: boolean;
  /** count === 1 uses this instead of the locale's normal word for "one"
   * (Spanish "un millón", not "uno millón"). Ignored when bareAtOne. */
  oneOverride?: string;
}

// Indian numbering system (2-2-3 grouping): hundred, thousand, lakh (10^5),
// crore (10^7), arab (10^9), kharab (10^11), nil (10^13), padma (10^15),
// shankha (10^17) — descending so the largest applicable tier peels off first.
const INDIAN_SCALES: Record<"bn" | "hi" | "ur", Scale[]> = {
  bn: [
    { value: 1e17, word: "শঙ্খ" },
    { value: 1e15, word: "পদ্ম" },
    { value: 1e13, word: "নীল" },
    { value: 1e11, word: "খরব" },
    { value: 1e9, word: "আরব" },
    { value: 1e7, word: "কোটি" },
    { value: 1e5, word: "লাখ" },
    { value: 1e3, word: "হাজার" },
    { value: 1e2, word: "শত" },
  ],
  hi: [
    { value: 1e17, word: "शंख" },
    { value: 1e15, word: "पद्म" },
    { value: 1e13, word: "नील" },
    { value: 1e11, word: "खरब" },
    { value: 1e9, word: "अरब" },
    { value: 1e7, word: "करोड़" },
    { value: 1e5, word: "लाख" },
    { value: 1e3, word: "हज़ार" },
    { value: 1e2, word: "सौ" },
  ],
  ur: [
    { value: 1e17, word: "شنکھ" },
    { value: 1e15, word: "پدم" },
    { value: 1e13, word: "نیل" },
    { value: 1e11, word: "کھرب" },
    { value: 1e9, word: "ارب" },
    { value: 1e7, word: "کروڑ" },
    { value: 1e5, word: "لاکھ" },
    { value: 1e3, word: "ہزار" },
    { value: 1e2, word: "سو" },
  ],
};

// International system (3-3-3 grouping). Spanish and French use the
// traditional long scale (mil millones for 10^9, billón/milliard for 10^9's
// French counterpart is actually its own word — see below) rather than the
// English short scale, to avoid the genuine billón(10^9)-vs-(10^12)
// ambiguity in modern Spanish usage.
const INTL_SCALES: Record<"en" | "ar" | "es" | "fr", Scale[]> = {
  en: [
    { value: 1e15, word: "quadrillion" },
    { value: 1e12, word: "trillion" },
    { value: 1e9, word: "billion" },
    { value: 1e6, word: "million" },
    { value: 1e3, word: "thousand" },
    { value: 1e2, word: "hundred" },
  ],
  ar: [
    { value: 1e15, word: "كوادريليون", bareAtOne: true },
    { value: 1e12, word: "تريليون", bareAtOne: true },
    { value: 1e9, word: "مليار", bareAtOne: true },
    { value: 1e6, word: "مليون", bareAtOne: true },
    { value: 1e3, word: "ألف", bareAtOne: true },
    { value: 1e2, word: "مئة", bareAtOne: true },
  ],
  es: [
    { value: 1e15, word: "mil billones", bareAtOne: true },
    { value: 1e12, word: "billón", pluralWord: "billones", oneOverride: "un" },
    { value: 1e9, word: "mil millones", bareAtOne: true },
    { value: 1e6, word: "millón", pluralWord: "millones", oneOverride: "un" },
    { value: 1e3, word: "mil", bareAtOne: true },
    { value: 1e2, word: "cien" }, // handled entirely by the ES_HUNDREDS special-case below
  ],
  fr: [
    { value: 1e15, word: "billiard", pluralWord: "billiards" },
    { value: 1e12, word: "billion", pluralWord: "billions" },
    { value: 1e9, word: "milliard", pluralWord: "milliards" },
    { value: 1e6, word: "million", pluralWord: "millions" },
    { value: 1e3, word: "mille", bareAtOne: true },
    { value: 1e2, word: "cent", bareAtOne: true }, // pluralization ("cents") handled by the special-case below
  ],
};

const SCALES: Record<NumberWordsLocale, Scale[]> = {
  bn: INDIAN_SCALES.bn,
  hi: INDIAN_SCALES.hi,
  ur: INDIAN_SCALES.ur,
  en: INTL_SCALES.en,
  ar: INTL_SCALES.ar,
  es: INTL_SCALES.es,
  fr: INTL_SCALES.fr,
};

// Spanish hundreds (200-900) have irregular stems, not a regular "[digit] +
// cientos" composition — quinientos/setecientos/novecientos don't follow the
// pattern at all, so these need their own table rather than the generic
// count-word + scale-word join used everywhere else.
const ES_HUNDREDS = ["cien", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

const POINT_WORD: Record<NumberWordsLocale, string> = { bn: "দশমিক", hi: "दशमलव", ur: "اعشاریہ", en: "point", ar: "فاصلة", es: "coma", fr: "virgule" };
const MINUS_WORD: Record<NumberWordsLocale, string> = { bn: "ঋণাত্মক", hi: "ऋणात्मक", ur: "منفی", en: "negative", ar: "سالب", es: "menos", fr: "moins" };

function integerToWords(n: number, locale: NumberWordsLocale): string {
  const ones = ONES[locale];
  if (n < 100) return ones[n];

  const parts: string[] = [];
  let remaining = n;
  for (const scale of SCALES[locale]) {
    if (remaining < scale.value) continue;
    const count = Math.floor(remaining / scale.value);
    remaining %= scale.value;

    if (locale === "es" && scale.value === 100) {
      // Irregular stems (doscientos, quinientos...) — see ES_HUNDREDS above —
      // plus "cien" -> "ciento" specifically when more digits follow.
      parts.push(count === 1 && remaining > 0 ? "ciento" : ES_HUNDREDS[count - 1]);
      continue;
    }
    if (locale === "fr" && scale.value === 100) {
      // "cent" takes no "un" prefix, and only pluralizes to "cents" when
      // it's the last part of the number (deux cents, but deux cent trois).
      const bare = count === 1 ? scale.word : `${integerToWords(count, locale)} ${scale.word}`;
      parts.push(count > 1 && remaining === 0 ? `${bare}s` : bare);
      continue;
    }

    if (scale.bareAtOne && count === 1) {
      parts.push(scale.word);
    } else {
      let countWord = count === 1 && scale.oneOverride ? scale.oneOverride : integerToWords(count, locale);
      // Spanish "uno" apocopates to "un" before any following noun — not just
      // the count 1 itself, but any compound ending in "...uno" (veintiuno,
      // treinta y uno...) immediately before a scale word.
      if (locale === "es" && countWord.endsWith("uno")) countWord = `${countWord.slice(0, -3)}ún`;
      const word = count >= 2 && scale.pluralWord ? scale.pluralWord : scale.word;
      parts.push(`${countWord} ${word}`);
    }
  }
  if (remaining > 0) parts.push(ones[remaining]);
  return parts.join(" ");
}

/** Supports 0 up to Number.MAX_SAFE_INTEGER, plus an optional decimal part read digit-by-digit after "point". */
export function numberToWords(input: number, locale: NumberWordsLocale): string {
  if (!Number.isFinite(input)) return "";

  const negative = input < 0;
  const abs = Math.abs(input);
  const integerPart = Math.floor(abs);
  // Read the fractional part digit-by-digit (e.g. .25 -> "two five") to
  // avoid picking a currency-specific subunit name (paisa/poysha differ by
  // country and aren't implied by a generic number-to-words tool).
  const fractionalDigits = abs.toString().split(".")[1] ?? "";

  const words = [integerToWords(integerPart, locale)];
  if (fractionalDigits) {
    const ones = ONES[locale];
    words.push(POINT_WORD[locale], fractionalDigits.split("").map((d) => ones[Number(d)]).join(" "));
  }

  return (negative ? `${MINUS_WORD[locale]} ` : "") + words.join(" ");
}
