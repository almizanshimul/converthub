// Arabic category-name translations. Hand-written — scripts/auto-translate.ts
// filled these in first via LibreTranslate, but review turned up real
// problems across most of the 12 rows: "Length" and "Volume" came back
// completely untranslated, "Area" became "المنطقة" (region/zone, not
// surface area), "Angle" became a bad transliteration instead of "زاوية",
// and several descriptions substituted hallucinated words for technical
// terms ("ounces" -> "ovens", "watts" -> "peaches", "watt-hours" -> "flight
// hours", "gradians" -> "graduates"). Categories are small in number and
// appear on nearly every page (nav, sidebar, footer, homepage), so they're
// kept as reviewed seed data instead — same treatment ur-translations.ts
// got, and calculator-translations.ts before that.

export const arCategoryTranslations: Record<string, { name: string; description: string }> = {
  length: {
    name: "الطول",
    description: "حوّل بين وحدات الطول المترية والإمبريالية — الأمتار، الأقدام، الأميال، البوصات، والمزيد.",
  },
  weight: {
    name: "الوزن / الكتلة",
    description: "حوّل بين وحدات الوزن المترية والإمبريالية — الكيلوغرامات، الأرطال، الأونصات، والمزيد.",
  },
  area: {
    name: "المساحة",
    description: "حوّل بين وحدات المساحة المترية والإمبريالية — المتر المربع، القدم المربع، الفدان، الهكتار، والمزيد.",
  },
  volume: {
    name: "الحجم",
    description: "حوّل بين وحدات الحجم المترية والأمريكية الاعتيادية — اللترات، الغالونات، الأكواب، الأونصات السائلة، والمزيد.",
  },
  temperature: {
    name: "درجة الحرارة",
    description: "حوّل بين مقاييس درجة الحرارة: سلسيوس وفهرنهايت وكلفن.",
  },
  speed: {
    name: "السرعة",
    description: "حوّل بين وحدات السرعة الشائعة — كم/س، ميل/س، م/ث، والعقدة البحرية.",
  },
  time: {
    name: "الوقت",
    description: "حوّل بين وحدات الوقت الشائعة — الثواني، الدقائق، الساعات، الأيام، والمزيد.",
  },
  "digital-storage": {
    name: "التخزين الرقمي",
    description: "حوّل بين وحدات التخزين الرقمي — بت، بايت، كيلوبايت، ميغابايت، غيغابايت، تيرابايت، وبيتابايت (النظام العشري/SI).",
  },
  pressure: {
    name: "الضغط",
    description: "حوّل بين وحدات الضغط — باسكال، بار، PSI، الضغط الجوي، وتور.",
  },
  energy: {
    name: "الطاقة",
    description: "حوّل بين وحدات الطاقة — جول، سعرة حرارية، كيلو سعرة حرارية، وواط ساعة.",
  },
  power: {
    name: "القوة",
    description: "حوّل بين وحدات القوة — واط، كيلوواط، وحصان.",
  },
  angle: {
    name: "الزاوية",
    description: "حوّل بين وحدات الزاوية — الدرجة، الراديان، والغراد.",
  },
};
