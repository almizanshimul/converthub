export interface UnitSeed {
  code: string;
  name: string;
  symbol?: string;
  toBaseFactor: number | null; // null only for temperature (affine, not ratio, scale)
  isBaseUnit?: boolean;
}

export interface PopularConverterSeed {
  fromCode: string;
  toCode: string;
  description: string;
  faq: { question: string; answer: string }[];
  content?: string;
}

export interface CategorySeed {
  slug: string;
  name: string;
  description: string;
  icon: string;
  units: UnitSeed[];
  popularConverters: PopularConverterSeed[];
}

export const converterCategories: CategorySeed[] = [
  {
    slug: "length",
    name: "Length",
    description: "Convert between metric and imperial length units — meters, feet, miles, inches, and more.",
    icon: "ruler",
    units: [
      { code: "meter", name: "Meter", symbol: "m", toBaseFactor: 1, isBaseUnit: true },
      { code: "kilometer", name: "Kilometer", symbol: "km", toBaseFactor: 1000 },
      { code: "centimeter", name: "Centimeter", symbol: "cm", toBaseFactor: 0.01 },
      { code: "millimeter", name: "Millimeter", symbol: "mm", toBaseFactor: 0.001 },
      { code: "micrometer", name: "Micrometer", symbol: "µm", toBaseFactor: 0.000001 },
      { code: "nanometer", name: "Nanometer", symbol: "nm", toBaseFactor: 0.000000001 },
      { code: "mile", name: "Mile", symbol: "mi", toBaseFactor: 1609.344 },
      { code: "yard", name: "Yard", symbol: "yd", toBaseFactor: 0.9144 },
      { code: "foot", name: "Foot", symbol: "ft", toBaseFactor: 0.3048 },
      { code: "inch", name: "Inch", symbol: "in", toBaseFactor: 0.0254 },
      { code: "nautical-mile", name: "Nautical Mile", symbol: "nmi", toBaseFactor: 1852 },
      { code: "suta", name: "Suta", symbol: "suta", toBaseFactor: 0.003175 },
    ],
    popularConverters: [
      {
        fromCode: "meter",
        toCode: "foot",
        description:
          "Meters and feet are both everyday length units — meters are the metric standard, feet are common in the US and UK for height and short distances.",
        faq: [
          { question: "How many feet are in a meter?", answer: "1 meter equals approximately 3.28084 feet." },
          { question: "What is the formula to convert meters to feet?", answer: "Multiply the length in meters by 3.28084 to get feet." },
        ],
      },
      {
        fromCode: "kilometer",
        toCode: "mile",
        description:
          "Kilometers and miles are both used to measure distance between places — kilometers are the metric standard, miles are common in the US and UK.",
        faq: [
          { question: "How many miles are in a kilometer?", answer: "1 kilometer equals approximately 0.621371 miles." },
          { question: "How do I convert km to miles?", answer: "Multiply the distance in kilometers by 0.621371 to get miles." },
        ],
      },
      {
        fromCode: "inch",
        toCode: "suta",
        description:
          "Suta (also spelled sut or soot) is a traditional South Asian length unit equal to exactly 1/8 inch, used in cloth trading and construction across India and Bangladesh.",
        faq: [
          { question: "How many suta are in an inch?", answer: "1 inch = 8 suta, so 1 suta equals exactly 0.125 inch (3.175 mm)." },
          {
            question: "Where is suta used?",
            answer:
              "Suta is used mainly in the cloth trade for measuring fabric width and length, and in construction or steel measurement, across India and Bangladesh.",
          },
        ],
        content:
          "Suta is a small traditional length unit built directly on top of the inch rather than the metric system — 8 suta make exactly 1 inch, so 1 suta equals precisely 0.125 inch, or 3.175 millimeters. It shows up most often in two very different trades that both need finer-than-inch precision: cloth merchants measuring fabric width and length (a bolt of cloth might be described as so many gaz — yards — and so many suta), and construction or steel workers measuring bar or pipe dimensions.\n\nUnlike several other traditional units on this site, suta turned out to be refreshingly uncontested during research — every source checked, across both the cloth trade and construction contexts, in both India and Bangladesh, agreed on the same 1/8-inch definition. That consistency is worth calling out explicitly, since so many South Asian traditional units (bigha, kani, tola-vs-masha) do vary by region or trade.\n\nOne related unit worth knowing: a gira (or girah), used in the same cloth-trade context, equals 18 suta — about 2.25 inches. If you're reading an old cloth measurement in gira and suta together, multiply the gira count by 18 and add the suta count to get a total in suta, then divide by 8 for inches.",
      },
      {
        fromCode: "suta",
        toCode: "inch",
        description:
          "Convert suta (1/8 inch) back to inches — useful when a cloth-trade or construction measurement is given in suta and you need the equivalent in a more familiar unit.",
        faq: [
          { question: "How many inches are in a suta?", answer: "1 suta equals exactly 0.125 inch (1/8 inch, or 3.175 mm)." },
        ],
      },
    ],
  },
  {
    slug: "weight",
    name: "Weight / Mass",
    description: "Convert between metric and imperial weight units — kilograms, pounds, ounces, and more.",
    icon: "scale",
    units: [
      { code: "kilogram", name: "Kilogram", symbol: "kg", toBaseFactor: 1, isBaseUnit: true },
      { code: "gram", name: "Gram", symbol: "g", toBaseFactor: 0.001 },
      { code: "milligram", name: "Milligram", symbol: "mg", toBaseFactor: 0.000001 },
      { code: "microgram", name: "Microgram", symbol: "µg", toBaseFactor: 0.000000001 },
      { code: "metric-ton", name: "Metric Ton", symbol: "t", toBaseFactor: 1000 },
      { code: "pound", name: "Pound", symbol: "lb", toBaseFactor: 0.45359237 },
      { code: "ounce", name: "Ounce", symbol: "oz", toBaseFactor: 0.028349523125 },
      { code: "stone", name: "Stone", symbol: "st", toBaseFactor: 6.35029318 },
      // Traditional South Asian gold-trade units. Sourced from British India's
      // Regulation VII of 1833 and India's Standards of Weights and Measures
      // Act, 1956 (First Schedule) — see prisma/data/README notes in each
      // converter's `content` field below for the full source trail.
      { code: "tola", name: "Tola", symbol: "tola", toBaseFactor: 0.0116638038 },
      { code: "vori", name: "Vori", symbol: "vori", toBaseFactor: 0.0116638038 },
      { code: "ana", name: "Ana", symbol: "ana", toBaseFactor: 0.0007289877375 },
      { code: "ratti", name: "Ratti", symbol: "ratti", toBaseFactor: 0.00012149795625 },
    ],
    popularConverters: [
      {
        fromCode: "kilogram",
        toCode: "pound",
        description:
          "Kilograms are the metric standard for body and object weight; pounds are the common imperial unit used in the US.",
        faq: [
          { question: "How many pounds are in a kilogram?", answer: "1 kilogram equals approximately 2.20462 pounds." },
          { question: "What is the kg to lb formula?", answer: "Multiply the weight in kilograms by 2.20462 to get pounds." },
        ],
      },
      {
        fromCode: "gram",
        toCode: "ounce",
        description: "Grams and ounces are both used for smaller weights — cooking ingredients, jewelry, and postage are common examples.",
        faq: [
          { question: "How many ounces are in a gram?", answer: "1 gram equals approximately 0.035274 ounces." },
          { question: "How many grams are in an ounce?", answer: "1 ounce equals approximately 28.3495 grams." },
        ],
      },
      {
        fromCode: "gram",
        toCode: "tola",
        description:
          "The tola (also spelled tolah) is a traditional South Asian mass unit still used every day across India, Bangladesh, Pakistan, and Nepal — most visibly in gold and silver pricing.",
        faq: [
          {
            question: "How many grams are in a tola?",
            answer: "1 tola equals exactly 11.6638038 grams. Gold traders commonly round this to 11.664 g.",
          },
          {
            question: "Where does the tola come from?",
            answer:
              "The modern tola was fixed at 180 troy grains by British India's Regulation VII of 1833, and carried forward unchanged into India's Standards of Weights and Measures Act, 1956, which defines it as exactly 0.0116638 kg.",
          },
        ],
        content:
          "The tola is one of the oldest mass units still in daily commercial use anywhere in the world. Long before the metric system arrived in South Asia, the tola was already the standard unit for weighing gold, silver, and precious goods across the Indian subcontinent — and it never fully went away. Today, gold prices in India, Pakistan, Nepal, and Bangladesh (where it's called vori) are still quoted \"per tola\" alongside the metric \"per 10 grams,\" because that's the unit jewelers, families, and gold markets actually think in.\n\nThe modern tola isn't a rough folk measure — it has a precise legal history. British India's Regulation VII of 1833 fixed it at exactly 180 troy grains, replacing the slightly lighter Bengal Presidency \"sicca weight.\" That figure was reaffirmed by the Weights Act of 1939 and then carried into the metric era by India's Standards of Weights and Measures Act, 1956, which defines 1 tola as exactly 0.0116638 kilograms — the figure this converter uses. In everyday trade, jewelers commonly round this to 11.664 grams, which is accurate enough for retail pricing but not for legal or customs documentation.\n\nIf you're pricing gold, converting an old family jewelry receipt, or just curious how a 1-tola gold coin compares to a 10-gram one, this converter uses the exact legal figure so the result lines up with official gold-rate tables rather than a rough approximation.",
      },
      {
        fromCode: "vori",
        toCode: "tola",
        description:
          "Vori (also spelled bhori) is the name used in Bangladesh for the same traditional gold-weighing unit known as tola in India, Pakistan, and Nepal — they are the same unit, not two different ones.",
        faq: [
          {
            question: "Is 1 vori the same as 1 tola?",
            answer: "Yes — vori and tola are the same unit (11.6638038 grams) under different regional names. There is no numeric difference between them.",
          },
          {
            question: "Why does Bangladesh use a different name for the same unit?",
            answer:
              "Vori is simply the Bengali-language name for the unit; the underlying legal definition traces back to the same British India-era standardization as tola.",
          },
        ],
        content:
          "If you've seen gold prices quoted in vori in Bangladesh and in tola in India or Pakistan and wondered whether they're actually comparable — they are. Vori and tola are the same physical unit of mass, just named differently by region: vori (or bhori) in Bengali-speaking Bangladesh, tola across most of North India, Pakistan, and Nepal. Both trace back to the same British India-era legal standardization and both equal exactly 11.6638038 grams.\n\nIn Bangladesh, gold rates published by BAJUS (Bangladesh Jewellers' Association) are set per vori, using the same 11.6638038 g value used for tola elsewhere — commonly rounded to 11.664 g in day-to-day trade. This converter is provided mainly for clarity and confirmation: if you're comparing a Bangladeshi gold rate (per vori) against an Indian or Pakistani one (per tola), you can compare the numbers directly without any conversion factor at all, since 1 vori = 1 tola exactly.\n\nOne honest sourcing note: BAJUS's own website could not be directly verified while researching this page, so the vori figure here is confirmed through consistent, independent secondary sources rather than a directly-fetched primary BAJUS document. The figure is treated as high-confidence, not unsourced — but if you rely on it for a large transaction, cross-check against BAJUS's daily published rate.",
      },
      {
        fromCode: "tola",
        toCode: "ana",
        description:
          "Ana is a traditional subdivision of the tola/vori used in South Asian gold trading — 1 tola equals 16 ana, not 12 (a common point of confusion with the separate, mostly historical \"masha\" unit).",
        faq: [
          { question: "How many ana are in a tola?", answer: "1 tola = 16 ana. Each ana is therefore 1/16 of a tola, or approximately 0.729 grams." },
          {
            question: "Is ana the same as masha?",
            answer:
              "No. Ana (16 to a tola) is the unit still used in modern gold trading. Masha (12 to a tola) is an older, largely historical subdivision — the two are not interchangeable.",
          },
        ],
        content:
          "Ana is how South Asian jewelers talk about gold in fractions smaller than a full tola or vori — much like how a rupee was historically divided into 16 ana as currency, gold weight borrowed the same 16-part division. One tola equals exactly 16 ana, which puts 1 ana at 11.6638038 ÷ 16 = 0.7289877375 grams, commonly rounded to 0.729 g in jewelry shops.\n\nThis is worth stating precisely because there's a genuinely easy mix-up here: an older subdivision called masha divides the tola into 12 parts instead of 16 (1 masha ≈ 0.972 g), and the two systems are not interchangeable — a jewelry receipt written in masha will not match one written in ana. The 16-ana system is the one in active use in modern retail gold trading across India and Bangladesh; masha survives mostly in older family records. Both systems agree at their finest subdivision: 1 tola equals 96 ratti either way, since 16 ana × 6 ratti and 12 masha × 8 ratti both total 96.\n\nIf you're reading a gold quote in ana and want a gram figure — or converting a family jeweler's receipt — this converter uses the 16-ana definition, which matches how ana is quoted in gold markets today.",
      },
      {
        fromCode: "tola",
        toCode: "ratti",
        description:
          "Ratti is the finest traditional subdivision of the tola, historically based on the weight of a Gunja (Abrus precatorius) seed — still widely used for weighing gemstones in South Asia.",
        faq: [
          {
            question: "How many ratti are in a tola?",
            answer: "1 tola = 96 ratti, so 1 ratti equals approximately 0.1215 grams (0.12149795625 g precisely).",
          },
          {
            question: "Why is ratti used for gemstones specifically?",
            answer:
              "Ratti's small size (about an eighth of a gram) makes it practical for weighing individual gemstones, where gram-level precision is too coarse. Gem trading and astrology in South Asia still price stones per ratti.",
          },
        ],
        content:
          "Ratti is the smallest traditional unit in the South Asian gold-weighing family, and the one unit that both historical subdivision systems — the 16-ana system and the older 12-masha system — agree on exactly: 1 tola equals 96 ratti either way. Its origin is unusually concrete for a traditional unit: a ratti was originally the weight of a single Gunja seed (Abrus precatorius), a small, famously uniform red-and-black seed that made a surprisingly consistent natural reference weight long before standardized weights existed.\n\nAt roughly 0.1215 grams, a ratti is far too small a unit for weighing gold jewelry (that's what tola, vori, and ana are for) but it's exactly the right scale for gemstones — rubies, emeralds, and other stones are still priced per ratti in gem markets and astrological jewelry across India, Bangladesh, Pakistan, and Nepal. One note for precision-sensitive use: some sources distinguish a lighter goldsmith's (\"sunari\") ratti at 121.5 mg — the figure used here — from a heavier \"pakki ratti\" of 182.25 mg sometimes used specifically in gem trading. If a gemstone weight you're checking doesn't match, that heavier variant is the likely reason.\n\nThis converter uses the standard 121.5 mg goldsmith's ratti (0.12149795625 g precisely), consistent with the tola, vori, and ana figures elsewhere on this site.",
      },
    ],
  },
  {
    slug: "area",
    name: "Area",
    description: "Convert between metric and imperial area units — square meters, square feet, acres, hectares, and more.",
    icon: "square",
    units: [
      { code: "square-meter", name: "Square Meter", symbol: "m²", toBaseFactor: 1, isBaseUnit: true },
      { code: "square-kilometer", name: "Square Kilometer", symbol: "km²", toBaseFactor: 1000000 },
      { code: "square-centimeter", name: "Square Centimeter", symbol: "cm²", toBaseFactor: 0.0001 },
      { code: "square-mile", name: "Square Mile", symbol: "mi²", toBaseFactor: 2589988.110336 },
      { code: "square-yard", name: "Square Yard", symbol: "yd²", toBaseFactor: 0.83612736 },
      { code: "square-foot", name: "Square Foot", symbol: "ft²", toBaseFactor: 0.09290304 },
      { code: "square-inch", name: "Square Inch", symbol: "in²", toBaseFactor: 0.00064516 },
      { code: "acre", name: "Acre", symbol: "ac", toBaseFactor: 4046.8564224 },
      { code: "hectare", name: "Hectare", symbol: "ha", toBaseFactor: 10000 },
    ],
    popularConverters: [
      {
        fromCode: "square-meter",
        toCode: "square-foot",
        description: "Square meters are the metric standard for floor and land area; square feet are common in the US and UK real estate.",
        faq: [
          { question: "How many square feet are in a square meter?", answer: "1 square meter equals approximately 10.7639 square feet." },
          { question: "How do I convert m² to ft²?", answer: "Multiply the area in square meters by 10.7639 to get square feet." },
        ],
      },
      {
        fromCode: "acre",
        toCode: "hectare",
        description: "Acres and hectares are both used to measure land area, common in agriculture and real estate worldwide.",
        faq: [
          { question: "How many hectares are in an acre?", answer: "1 acre equals approximately 0.404686 hectares." },
          { question: "How many acres are in a hectare?", answer: "1 hectare equals approximately 2.47105 acres." },
        ],
      },
    ],
  },
  {
    slug: "volume",
    name: "Volume",
    description: "Convert between metric and US customary volume units — liters, gallons, cups, fluid ounces, and more.",
    icon: "flask",
    units: [
      { code: "liter", name: "Liter", symbol: "L", toBaseFactor: 1, isBaseUnit: true },
      { code: "milliliter", name: "Milliliter", symbol: "mL", toBaseFactor: 0.001 },
      { code: "cubic-meter", name: "Cubic Meter", symbol: "m³", toBaseFactor: 1000 },
      { code: "cubic-centimeter", name: "Cubic Centimeter", symbol: "cm³", toBaseFactor: 0.001 },
      { code: "gallon-us", name: "Gallon (US)", symbol: "gal", toBaseFactor: 3.785411784 },
      { code: "quart-us", name: "Quart (US)", symbol: "qt", toBaseFactor: 0.946352946 },
      { code: "pint-us", name: "Pint (US)", symbol: "pt", toBaseFactor: 0.473176473 },
      { code: "cup-us", name: "Cup (US)", symbol: "cup", toBaseFactor: 0.2365882365 },
      { code: "fluid-ounce-us", name: "Fluid Ounce (US)", symbol: "fl oz", toBaseFactor: 0.0295735295625 },
      { code: "teaspoon", name: "Teaspoon (Metric)", symbol: "tsp", toBaseFactor: 0.005 },
      { code: "teaspoon-us", name: "Teaspoon (US)", symbol: "tsp", toBaseFactor: 0.00492892159375 },
    ],
    popularConverters: [
      {
        fromCode: "liter",
        toCode: "gallon-us",
        description: "Liters are the metric standard for liquid volume; US gallons are the common unit for fuel and large liquid quantities in the US.",
        faq: [
          { question: "How many gallons are in a liter?", answer: "1 liter equals approximately 0.264172 US gallons." },
          { question: "How many liters are in a US gallon?", answer: "1 US gallon equals approximately 3.78541 liters." },
        ],
      },
      {
        fromCode: "milliliter",
        toCode: "fluid-ounce-us",
        description: "Milliliters and US fluid ounces are both used for measuring small liquid quantities, common in cooking and beverages.",
        faq: [
          { question: "How many fluid ounces are in a milliliter?", answer: "1 milliliter equals approximately 0.033814 US fluid ounces." },
          { question: "How many milliliters are in a fluid ounce?", answer: "1 US fluid ounce equals approximately 29.5735 milliliters." },
        ],
      },
      {
        fromCode: "milliliter",
        toCode: "teaspoon",
        description:
          "The teaspoon has two real-world definitions worth knowing: the metric teaspoon (exactly 5 mL, used worldwide and on US nutrition labels) and the slightly smaller US customary teaspoon (4.92892 mL, used in US recipes).",
        faq: [
          {
            question: "Is a teaspoon 5 mL?",
            answer:
              "It depends on context. The metric teaspoon — and the US teaspoon as legally defined for nutrition labeling by the FDA — is exactly 5 mL. The US customary teaspoon used in recipes is slightly smaller, at 4.92892159375 mL.",
          },
          {
            question: "Why are there two different US teaspoon values?",
            answer:
              "US recipe measurements use the customary teaspoon (1/6 US fluid ounce, ≈4.93 mL), but US nutrition labels are legally required to treat a teaspoon as exactly 5 mL under FDA regulation 21 CFR 101.9 — so the 'correct' value depends on whether you're cooking or reading a label.",
          },
        ],
        content:
          "The teaspoon looks like the simplest unit on this entire site, and mostly it is — except for one genuine wrinkle worth understanding before you rely on a conversion. The metric teaspoon is exactly 5 mL, full stop, and that's the value used in most of the world's recipes and on virtually all nutrition labels. The US customary teaspoon, the one baked into US recipe tradition, is very slightly smaller: exactly 4.92892159375 mL, derived from the legal US gallon (231 cubic inches) divided down through fluid ounces.\n\nThat small gap — about 1.4% — rarely matters for home cooking, but it does mean a US recipe's \"teaspoon\" and a European or Australian recipe's \"teaspoon\" aren't identically sized. To close the loop, the US FDA deliberately sidesteps the customary value for nutrition labeling: federal regulation 21 CFR 101.9 defines a teaspoon as exactly 5 mL for the purposes of the Nutrition Facts panel, matching the metric definition rather than the customary cooking one. So a US product's nutrition label and a US recipe can technically mean slightly different \"teaspoons.\"\n\nThis converter uses the metric 5 mL definition as the default, since that's what nutrition labels, most modern recipes, and international usage all agree on — but if you're precisely scaling a US-customary recipe, use the US Teaspoon converter instead (4.92892159375 mL per teaspoon).",
      },
      {
        fromCode: "teaspoon-us",
        toCode: "milliliter",
        description:
          "The US customary teaspoon — the one used in US recipes — equals exactly 4.92892159375 mL, about 1.4% smaller than the metric teaspoon used elsewhere and on US nutrition labels.",
        faq: [
          { question: "How many mL are in a US teaspoon?", answer: "1 US customary teaspoon equals exactly 4.92892159375 mL — slightly less than the 5 mL metric teaspoon." },
        ],
      },
    ],
  },
  {
    slug: "temperature",
    name: "Temperature",
    description: "Convert between Celsius, Fahrenheit, and Kelvin temperature scales.",
    icon: "thermometer",
    units: [
      { code: "celsius", name: "Celsius", symbol: "°C", toBaseFactor: null },
      { code: "fahrenheit", name: "Fahrenheit", symbol: "°F", toBaseFactor: null },
      { code: "kelvin", name: "Kelvin", symbol: "K", toBaseFactor: null },
    ],
    popularConverters: [
      {
        fromCode: "celsius",
        toCode: "fahrenheit",
        description: "Celsius is the metric temperature scale used worldwide; Fahrenheit is used mainly in the United States.",
        faq: [
          { question: "What is the Celsius to Fahrenheit formula?", answer: "Multiply the Celsius value by 9/5, then add 32." },
          { question: "What is 0°C in Fahrenheit?", answer: "0°C equals 32°F, the freezing point of water." },
        ],
      },
      {
        fromCode: "fahrenheit",
        toCode: "celsius",
        description: "Fahrenheit is used mainly in the United States; Celsius is the metric scale used in most of the rest of the world.",
        faq: [
          { question: "What is the Fahrenheit to Celsius formula?", answer: "Subtract 32 from the Fahrenheit value, then multiply by 5/9." },
          { question: "What is 98.6°F in Celsius?", answer: "98.6°F equals 37°C, normal human body temperature." },
        ],
      },
    ],
  },
  {
    slug: "speed",
    name: "Speed",
    description: "Convert between common speed units — km/h, mph, m/s, and knots.",
    icon: "gauge",
    units: [
      { code: "meter-per-second", name: "Meter per Second", symbol: "m/s", toBaseFactor: 1, isBaseUnit: true },
      { code: "kilometer-per-hour", name: "Kilometer per Hour", symbol: "km/h", toBaseFactor: 0.277777777778 },
      { code: "mile-per-hour", name: "Mile per Hour", symbol: "mph", toBaseFactor: 0.44704 },
      { code: "knot", name: "Knot", symbol: "kn", toBaseFactor: 0.514444444444 },
      { code: "foot-per-second", name: "Foot per Second", symbol: "ft/s", toBaseFactor: 0.3048 },
    ],
    popularConverters: [
      {
        fromCode: "kilometer-per-hour",
        toCode: "mile-per-hour",
        description: "km/h is the metric standard for vehicle speed; mph is used mainly in the US and UK.",
        faq: [
          { question: "How do I convert km/h to mph?", answer: "Multiply the speed in km/h by 0.621371 to get mph." },
          { question: "How many mph is 100 km/h?", answer: "100 km/h is approximately 62.14 mph." },
        ],
      },
      {
        fromCode: "meter-per-second",
        toCode: "kilometer-per-hour",
        description: "m/s is the SI unit for speed used in physics and science; km/h is the everyday unit for vehicle and wind speed.",
        faq: [
          { question: "How do I convert m/s to km/h?", answer: "Multiply the speed in m/s by 3.6 to get km/h." },
          { question: "Why multiply by 3.6?", answer: "There are 3,600 seconds in an hour and 1,000 meters in a kilometer, so m/s × 3.6 = km/h." },
        ],
      },
    ],
  },
  {
    slug: "time",
    name: "Time",
    description: "Convert between common time units — seconds, minutes, hours, days, and more.",
    icon: "clock",
    units: [
      { code: "second", name: "Second", symbol: "s", toBaseFactor: 1, isBaseUnit: true },
      { code: "millisecond", name: "Millisecond", symbol: "ms", toBaseFactor: 0.001 },
      { code: "minute", name: "Minute", symbol: "min", toBaseFactor: 60 },
      { code: "hour", name: "Hour", symbol: "hr", toBaseFactor: 3600 },
      { code: "day", name: "Day", symbol: "d", toBaseFactor: 86400 },
      { code: "week", name: "Week", symbol: "wk", toBaseFactor: 604800 },
      { code: "month", name: "Month", symbol: "mo", toBaseFactor: 2629746 },
      { code: "year", name: "Year", symbol: "yr", toBaseFactor: 31556952 },
    ],
    popularConverters: [
      {
        fromCode: "hour",
        toCode: "minute",
        description: "Hours and minutes are the most common units for measuring durations in daily life and scheduling.",
        faq: [
          { question: "How many minutes are in an hour?", answer: "1 hour equals 60 minutes." },
          { question: "How many hours are in 90 minutes?", answer: "90 minutes equals 1.5 hours." },
        ],
      },
      {
        fromCode: "day",
        toCode: "hour",
        description: "Days and hours are commonly used together when planning schedules, trips, and deadlines.",
        faq: [
          { question: "How many hours are in a day?", answer: "1 day equals 24 hours." },
          { question: "How many days is 48 hours?", answer: "48 hours equals 2 days." },
        ],
      },
    ],
  },
  {
    slug: "digital-storage",
    name: "Digital Storage",
    description: "Convert between digital storage units — bits, bytes, KB, MB, GB, TB, and PB (decimal/SI convention).",
    icon: "hard-drive",
    units: [
      { code: "bit", name: "Bit", symbol: "b", toBaseFactor: 0.125 },
      { code: "byte", name: "Byte", symbol: "B", toBaseFactor: 1, isBaseUnit: true },
      { code: "kilobyte", name: "Kilobyte", symbol: "KB", toBaseFactor: 1000 },
      { code: "megabyte", name: "Megabyte", symbol: "MB", toBaseFactor: 1000000 },
      { code: "gigabyte", name: "Gigabyte", symbol: "GB", toBaseFactor: 1000000000 },
      { code: "terabyte", name: "Terabyte", symbol: "TB", toBaseFactor: 1000000000000 },
      { code: "petabyte", name: "Petabyte", symbol: "PB", toBaseFactor: 1000000000000000 },
    ],
    popularConverters: [
      {
        fromCode: "megabyte",
        toCode: "gigabyte",
        description: "Megabytes and gigabytes are used to describe file sizes, storage capacity, and data transfer amounts.",
        faq: [
          { question: "How many megabytes are in a gigabyte?", answer: "1 gigabyte equals 1,000 megabytes (decimal/SI convention)." },
          { question: "Is this decimal or binary?", answer: "This converter uses the decimal (SI) convention: 1 GB = 1,000 MB. Operating systems sometimes use the binary convention instead, where 1 GiB = 1,024 MiB." },
        ],
      },
      {
        fromCode: "kilobyte",
        toCode: "megabyte",
        description: "Kilobytes and megabytes are used to describe smaller file sizes like documents and images.",
        faq: [
          { question: "How many kilobytes are in a megabyte?", answer: "1 megabyte equals 1,000 kilobytes (decimal/SI convention)." },
        ],
      },
    ],
  },
  {
    slug: "pressure",
    name: "Pressure",
    description: "Convert between pressure units — pascal, bar, PSI, atmosphere, and torr.",
    icon: "activity",
    units: [
      { code: "pascal", name: "Pascal", symbol: "Pa", toBaseFactor: 1, isBaseUnit: true },
      { code: "kilopascal", name: "Kilopascal", symbol: "kPa", toBaseFactor: 1000 },
      { code: "bar", name: "Bar", symbol: "bar", toBaseFactor: 100000 },
      { code: "psi", name: "PSI", symbol: "psi", toBaseFactor: 6894.757293168 },
      { code: "atmosphere", name: "Atmosphere", symbol: "atm", toBaseFactor: 101325 },
      { code: "torr", name: "Torr", symbol: "Torr", toBaseFactor: 133.322368421 },
    ],
    popularConverters: [
      {
        fromCode: "psi",
        toCode: "bar",
        description: "PSI is common for tire pressure in the US; bar is the common metric unit for pressure in most of the world.",
        faq: [
          { question: "How do I convert PSI to bar?", answer: "Multiply the pressure in PSI by 0.0689476 to get bar." },
          { question: "How many PSI is 1 bar?", answer: "1 bar equals approximately 14.5038 PSI." },
        ],
      },
      {
        fromCode: "bar",
        toCode: "psi",
        description: "Bar is the common metric pressure unit used for tire and hydraulic pressure outside the US; PSI is the US standard.",
        faq: [
          { question: "How do I convert bar to PSI?", answer: "Multiply the pressure in bar by 14.5038 to get PSI." },
        ],
      },
    ],
  },
  {
    slug: "energy",
    name: "Energy",
    description: "Convert between energy units — joules, calories, kilocalories, and watt-hours.",
    icon: "zap",
    units: [
      { code: "joule", name: "Joule", symbol: "J", toBaseFactor: 1, isBaseUnit: true },
      { code: "kilojoule", name: "Kilojoule", symbol: "kJ", toBaseFactor: 1000 },
      { code: "calorie", name: "Calorie", symbol: "cal", toBaseFactor: 4.184 },
      { code: "kilocalorie", name: "Kilocalorie", symbol: "kcal", toBaseFactor: 4184 },
      { code: "watt-hour", name: "Watt-hour", symbol: "Wh", toBaseFactor: 3600 },
      { code: "kilowatt-hour", name: "Kilowatt-hour", symbol: "kWh", toBaseFactor: 3600000 },
    ],
    popularConverters: [
      {
        fromCode: "kilocalorie",
        toCode: "kilojoule",
        description: "Kilocalories (food Calories) and kilojoules are both used on nutrition labels to describe food energy.",
        faq: [
          { question: "How many kilojoules are in a kilocalorie?", answer: "1 kilocalorie equals approximately 4.184 kilojoules." },
          { question: "Why do nutrition labels show both?", answer: "Different countries require different units — kilocalories (Calories) are standard in the US, kilojoules in Australia and the EU." },
        ],
      },
      {
        fromCode: "calorie",
        toCode: "joule",
        description: "Calories and joules are both scientific units of energy, common in physics and chemistry.",
        faq: [
          { question: "How many joules are in a calorie?", answer: "1 calorie equals 4.184 joules." },
        ],
      },
    ],
  },
  {
    slug: "power",
    name: "Power",
    description: "Convert between power units — watts, kilowatts, and horsepower.",
    icon: "flame",
    units: [
      { code: "watt", name: "Watt", symbol: "W", toBaseFactor: 1, isBaseUnit: true },
      { code: "kilowatt", name: "Kilowatt", symbol: "kW", toBaseFactor: 1000 },
      { code: "horsepower", name: "Horsepower", symbol: "hp", toBaseFactor: 745.699871582 },
    ],
    popularConverters: [
      {
        fromCode: "horsepower",
        toCode: "watt",
        description: "Horsepower is the traditional unit for engine power; watts are the SI unit used in electrical and mechanical engineering.",
        faq: [
          { question: "How many watts are in a horsepower?", answer: "1 mechanical horsepower equals approximately 745.7 watts." },
        ],
      },
      {
        fromCode: "kilowatt",
        toCode: "horsepower",
        description: "Kilowatts and horsepower are both used to describe engine and motor power ratings.",
        faq: [
          { question: "How many horsepower are in a kilowatt?", answer: "1 kilowatt equals approximately 1.34102 horsepower." },
        ],
      },
    ],
  },
  {
    slug: "angle",
    name: "Angle",
    description: "Convert between angle units — degrees, radians, and gradians.",
    icon: "compass",
    units: [
      { code: "degree", name: "Degree", symbol: "°", toBaseFactor: 0.017453292519943295 },
      { code: "radian", name: "Radian", symbol: "rad", toBaseFactor: 1, isBaseUnit: true },
      { code: "gradian", name: "Gradian", symbol: "grad", toBaseFactor: 0.015707963267948967 },
    ],
    popularConverters: [
      {
        fromCode: "degree",
        toCode: "radian",
        description: "Degrees are the everyday unit for angles; radians are the standard unit used in mathematics and physics.",
        faq: [
          { question: "How do I convert degrees to radians?", answer: "Multiply the angle in degrees by π/180 (approximately 0.0174533)." },
          { question: "How many radians are in 180 degrees?", answer: "180 degrees equals π radians (approximately 3.14159 radians)." },
        ],
      },
      {
        fromCode: "radian",
        toCode: "degree",
        description: "Radians are the standard unit for angles in math and science; degrees are more common in everyday use.",
        faq: [
          { question: "How do I convert radians to degrees?", answer: "Multiply the angle in radians by 180/π (approximately 57.2958)." },
        ],
      },
    ],
  },
];
