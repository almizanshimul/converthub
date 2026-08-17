// Urdu category-name translations. Hand-written — scripts/auto-translate.ts
// filled these in first via LibreTranslate, but review turned up broken
// output across nearly all 12 rows (e.g. "Power" -> "بند" / "closed",
// "Volume" -> "ترجمے" / "translations", "gradians" -> "گریناڈا" / "Grenada").
// Converter names/descriptions are left as LibreTranslate output per
// direction from the site owner; categories are small in number and appear
// on nearly every page (nav, sidebar, footer, homepage), so they're kept as
// reviewed seed data instead, the same way calculator-translations.ts was
// handled for the two calculators earlier.

export const urCategoryTranslations: Record<string, { name: string; description: string }> = {
  length: {
    name: "لمبائی",
    description: "میٹرک اور امپیریل لمبائی کی اکائیوں کے درمیان تبدیل کریں — میٹر، فٹ، میل، انچ اور مزید۔",
  },
  weight: {
    name: "وزن / ماس",
    description: "میٹرک اور امپیریل وزن کی اکائیوں کے درمیان تبدیل کریں — کلوگرام، پاؤنڈ، اونس اور مزید۔",
  },
  area: {
    name: "رقبہ",
    description: "میٹرک اور امپیریل رقبے کی اکائیوں کے درمیان تبدیل کریں — مربع میٹر، مربع فٹ، ایکڑ، ہیکٹر اور مزید۔",
  },
  volume: {
    name: "حجم",
    description: "میٹرک اور امریکی روایتی حجم کی اکائیوں کے درمیان تبدیل کریں — لیٹر، گیلن، کپ، فلوئیڈ اونس اور مزید۔",
  },
  temperature: {
    name: "درجہ حرارت",
    description: "سیلسیس، فارن ہائیٹ اور کیلون درجہ حرارت کے پیمانوں کے درمیان تبدیل کریں۔",
  },
  speed: {
    name: "رفتار",
    description: "عام رفتار کی اکائیوں کے درمیان تبدیل کریں — کلومیٹر/گھنٹہ، میل/گھنٹہ، میٹر/سیکنڈ اور ناٹ۔",
  },
  time: {
    name: "وقت",
    description: "عام وقت کی اکائیوں کے درمیان تبدیل کریں — سیکنڈ، منٹ، گھنٹے، دن اور مزید۔",
  },
  "digital-storage": {
    name: "ڈیجیٹل سٹوریج",
    description: "ڈیجیٹل سٹوریج کی اکائیوں کے درمیان تبدیل کریں — بٹ، بائٹ، KB، MB، GB، TB اور PB (decimal/SI)۔",
  },
  pressure: {
    name: "دباؤ",
    description: "دباؤ کی اکائیوں کے درمیان تبدیل کریں — پاسکل، بار، PSI، ایٹموسفیئر اور ٹور۔",
  },
  energy: {
    name: "توانائی",
    description: "توانائی کی اکائیوں کے درمیان تبدیل کریں — جول، کیلوری، کلوکیلوری اور واٹ گھنٹہ۔",
  },
  power: {
    name: "طاقت",
    description: "طاقت کی اکائیوں کے درمیان تبدیل کریں — واٹ، کلوواٹ اور ہارس پاور۔",
  },
  angle: {
    name: "زاویہ",
    description: "زاویے کی اکائیوں کے درمیان تبدیل کریں — ڈگری، ریڈین اور گریڈین۔",
  },
};
