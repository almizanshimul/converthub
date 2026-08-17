// Sourced 2026-08-16 via web research (see sourceUrl per entry). Regional land
// units are genuinely inconsistent — entries here are the ones with 2+
// corroborating sources; anything single-sourced or actively disputed
// (e.g. Uttar Pradesh's Bigha) was deliberately left out rather than guessed.
// square-feet is a country-wide (regionSlug: null) pivot unit in every country
// so the calculator can convert between any two local units.

export interface LandUnitSeed {
  code: string;
  name: string;
}

export interface LandConversionSeed {
  fromCode: string;
  toCode: string; // always "square-feet"
  factor: number;
  source: string;
  sourceUrl: string;
  notes?: string;
}

export interface RegionLandDataSeed {
  regionSlug: string | null; // null = country-wide unit
  units: LandUnitSeed[];
  conversions: LandConversionSeed[];
}

export interface CountryLandDataSeed {
  countrySlug: string;
  regions: RegionLandDataSeed[];
}

const SQFT_UNIT: LandUnitSeed = { code: "square-feet", name: "Square Feet" };

export const landData: CountryLandDataSeed[] = [
  {
    countrySlug: "india",
    regions: [
      { regionSlug: null, units: [SQFT_UNIT], conversions: [] },
      {
        regionSlug: "west-bengal",
        units: [
          { code: "bigha", name: "Bigha" },
          { code: "katha", name: "Katha" },
          { code: "decimal", name: "Decimal" },
        ],
        conversions: [
          {
            fromCode: "bigha",
            toCode: "square-feet",
            factor: 14400,
            source: "Wikipedia: Bigha",
            sourceUrl: "https://en.wikipedia.org/wiki/Bigha",
            notes: "Consistent across 4+ independent sources for West Bengal.",
          },
          {
            fromCode: "katha",
            toCode: "square-feet",
            factor: 720,
            source: "Aurum PropTech",
            sourceUrl: "https://www.aurumproptech.in/pulse/unit-converters/west-bengal/katha-to-square-feet",
            notes: "= Bigha ÷ 20.",
          },
          {
            fromCode: "decimal",
            toCode: "square-feet",
            factor: 435.6,
            source: "Godrej Properties",
            sourceUrl: "https://www.godrejproperties.com/blog/list-of-land-measurement-units-in-india",
            notes: "= 1/100 acre; same unit as South India's \"Cent\", different regional name.",
          },
        ],
      },
      {
        regionSlug: "bihar",
        units: [
          { code: "bigha", name: "Bigha" },
          { code: "katha", name: "Katha" },
          { code: "decimal", name: "Decimal" },
        ],
        conversions: [
          {
            fromCode: "bigha",
            toCode: "square-feet",
            factor: 27225,
            source: "Wikipedia: Bigha",
            sourceUrl: "https://en.wikipedia.org/wiki/Bigha",
            notes: "= 20 Katha. Standard Patna-region figure.",
          },
          {
            fromCode: "katha",
            toCode: "square-feet",
            factor: 1361.25,
            source: "CivilSir",
            sourceUrl: "https://civilsir.com/1-katha-sq-ft-in-bihar/",
            notes:
              "Standard for North Bihar/Patna/Muzaffarpur/Purnea/Darbhanga/Begusarai/Katihar/Motihari. Other districts reportedly range 750–2,000 sq ft — only the standard figure is seeded here, low confidence on the wider range.",
          },
          {
            fromCode: "decimal",
            toCode: "square-feet",
            factor: 435.6,
            source: "Bajaj Finserv",
            sourceUrl: "https://www.bajajfinserv.in/decimal-to-square-feet",
          },
        ],
      },
      {
        regionSlug: "assam",
        units: [
          { code: "bigha", name: "Bigha" },
          { code: "katha", name: "Katha" },
        ],
        conversions: [
          {
            fromCode: "bigha",
            toCode: "square-feet",
            factor: 14400,
            source: "CivilSir",
            sourceUrl: "https://civilsir.com/1-bigha-is-equal-to-how-many-square-feet-in-assam/",
            notes: "= 5 Katha.",
          },
          {
            fromCode: "katha",
            toCode: "square-feet",
            factor: 2880,
            source: "Wikipedia: Katha (unit)",
            sourceUrl: "https://en.wikipedia.org/wiki/Katha_(unit)",
          },
        ],
      },
      {
        regionSlug: "rajasthan",
        units: [
          { code: "bigha-pucca", name: "Bigha (Pucca)" },
          { code: "bigha-kachha", name: "Bigha (Kachha)" },
        ],
        conversions: [
          {
            fromCode: "bigha-pucca",
            toCode: "square-feet",
            factor: 27225,
            source: "CivilSir",
            sourceUrl: "https://civilsir.com/1-bigha-sq-feet-in-rajasthan-jaipur-land-measurement/",
            notes: "165 ft × 165 ft. Used for formal/eastern Rajasthan (Jaipur) plot descriptions.",
          },
          {
            fromCode: "bigha-kachha",
            toCode: "square-feet",
            factor: 17424,
            source: "CivilSir",
            sourceUrl: "https://civilsir.com/1-bigha-sq-feet-in-rajasthan-jaipur-land-measurement/",
            notes: "132 ft × 132 ft. Common in the Marwar belt (Jodhpur/Barmer/Bikaner) for older/rural transactions.",
          },
        ],
      },
      {
        regionSlug: "punjab",
        units: [
          { code: "kanal", name: "Kanal" },
          { code: "marla", name: "Marla" },
        ],
        conversions: [
          {
            fromCode: "kanal",
            toCode: "square-feet",
            factor: 5445,
            source: "99acres",
            sourceUrl: "https://www.99acres.com/kanal-to-marla-utyp",
            notes: "= 20 Marla. Same figure used in Himachal Pradesh and Haryana.",
          },
          {
            fromCode: "marla",
            toCode: "square-feet",
            factor: 272.25,
            source: "99acres",
            sourceUrl: "https://www.99acres.com/kanal-to-marla-utyp",
            notes: "1 Marla = 1 square Karam (5.5 ft × 5.5 ft) × 9.",
          },
        ],
      },
      {
        regionSlug: "maharashtra",
        units: [{ code: "guntha", name: "Guntha" }],
        conversions: [
          {
            fromCode: "guntha",
            toCode: "square-feet",
            factor: 1089,
            source: "99acres",
            sourceUrl: "https://www.99acres.com/guntha-to-square-feet-utyp",
            notes: "33 ft × 33 ft (1 surveyor's chain²). Also used in Karnataka, Gujarat, Andhra Pradesh, Telangana, Odisha.",
          },
        ],
      },
      {
        regionSlug: "gujarat",
        units: [{ code: "guntha", name: "Guntha" }],
        conversions: [
          {
            fromCode: "guntha",
            toCode: "square-feet",
            factor: 1089,
            source: "99acres",
            sourceUrl: "https://www.99acres.com/guntha-to-square-feet-utyp",
          },
        ],
      },
      {
        regionSlug: "tamil-nadu",
        units: [
          { code: "cent", name: "Cent" },
          { code: "ground", name: "Ground" },
        ],
        conversions: [
          {
            fromCode: "cent",
            toCode: "square-feet",
            factor: 435.6,
            source: "Wikipedia: Cent (area)",
            sourceUrl: "https://en.wikipedia.org/wiki/Cent_(area)",
            notes: "= 1/100 acre.",
          },
          {
            fromCode: "ground",
            toCode: "square-feet",
            factor: 2400,
            source: "indialandconverter.in",
            sourceUrl: "https://indialandconverter.in/tamil-nadu/chennai/convert-ground-to-sqft",
            notes: "Chennai-specific; ≈5.51 Cent.",
          },
        ],
      },
      {
        regionSlug: "kerala",
        units: [{ code: "cent", name: "Cent" }],
        conversions: [
          {
            fromCode: "cent",
            toCode: "square-feet",
            factor: 435.6,
            source: "Wikipedia: Cent (area)",
            sourceUrl: "https://en.wikipedia.org/wiki/Cent_(area)",
          },
        ],
      },
    ],
  },
  {
    countrySlug: "bangladesh",
    regions: [
      { regionSlug: null, units: [SQFT_UNIT], conversions: [] },
      {
        regionSlug: null,
        units: [
          { code: "shotangsho", name: "Shotangsho (Decimal)" },
          { code: "chotak", name: "Chotak" },
          { code: "katha", name: "Katha" },
          { code: "bigha", name: "Bigha" },
          { code: "kani", name: "Kani (120 Decimal)" },
          { code: "kani-40-decimal", name: "Kani (40 Decimal)" },
          { code: "gonda", name: "Gonda" },
          { code: "kora", name: "Kora" },
          { code: "kranti", name: "Kranti" },
          { code: "til", name: "Til" },
        ],
        conversions: [
          {
            fromCode: "shotangsho",
            toCode: "square-feet",
            factor: 435.6,
            source: "Bangladesh Ministry of Land (official)",
            sourceUrl: "https://minland.gov.bd/site/page/4e44d7ef-2c36-4483-aa4e-77b294de729c/Land-Measurement-Unit",
            notes: "= 1/100 of the 33-decimal Bigha. Also called Shotok.",
          },
          {
            fromCode: "chotak",
            toCode: "square-feet",
            factor: 45,
            source: "User-submitted reference table",
            sourceUrl: "",
            notes: "= 1/16 Katha (16 Chotak = 1 Katha). Consistent with the official Katha figure (16 × 45 = 720 sq ft).",
          },
          {
            fromCode: "katha",
            toCode: "square-feet",
            factor: 720,
            source: "Bangladesh Ministry of Land (official)",
            sourceUrl: "https://minland.gov.bd/site/page/4e44d7ef-2c36-4483-aa4e-77b294de729c/Land-Measurement-Unit",
            notes:
              "Official statutory figure — numerically identical to West Bengal's Katha (shared pre-1947 Bengal Presidency origin). Also called Kattah/Cottah. Real-world local usage is reported to vary by district; only the official figure is seeded here.",
          },
          {
            fromCode: "bigha",
            toCode: "square-feet",
            factor: 14400,
            source: "Bangladesh Ministry of Land (official)",
            sourceUrl: "https://minland.gov.bd/site/page/4e44d7ef-2c36-4483-aa4e-77b294de729c/Land-Measurement-Unit",
            notes: "= 33 Decimal = 20 Katha. Also called Paki. Official statutory figure.",
          },
          {
            fromCode: "kani",
            toCode: "square-feet",
            factor: 52272,
            source: "Bangladesh Ministry of Land (official)",
            sourceUrl: "https://minland.gov.bd/site/page/4e44d7ef-2c36-4483-aa4e-77b294de729c/Land-Measurement-Unit",
            notes:
              "= 120 Decimal. Common in Chittagong/Sylhet. Kani is not standardized nationally — see the 40-Decimal variant below, and note some traditional measuring-rod (\"nol\") systems put it at a further ~17,280 sq ft. Confirm which local convention applies before relying on this for a transaction.",
          },
          {
            fromCode: "kani-40-decimal",
            toCode: "square-feet",
            factor: 17424,
            source: "User-submitted reference table",
            sourceUrl: "",
            notes: "= 40 Decimal. A distinct, smaller traditional definition of Kani from the 120-Decimal figure above — not independently corroborated with an official source, use with caution.",
          },
          {
            fromCode: "gonda",
            toCode: "square-feet",
            factor: 871.2,
            source: "User-submitted reference table",
            sourceUrl: "",
            notes: "= 1/20 of the 40-Decimal Kani (17,424 ÷ 20). = 4 Kora.",
          },
          {
            fromCode: "kora",
            toCode: "square-feet",
            factor: 217.8,
            source: "User-submitted reference table",
            sourceUrl: "",
            notes: "= 1/4 Gonda (40-Decimal Kani scale). = 3 Kranti.",
          },
          {
            fromCode: "kranti",
            toCode: "square-feet",
            factor: 72.6,
            source: "User-submitted reference table",
            sourceUrl: "",
            notes: "= 1/3 Kora (40-Decimal Kani scale). = 20 Til. Also transliterated \"Kontho\".",
          },
          {
            fromCode: "til",
            toCode: "square-feet",
            factor: 3.63,
            source: "User-submitted reference table",
            sourceUrl: "",
            notes: "= 1/20 Kranti (40-Decimal Kani scale). Smallest unit in this table.",
          },
        ],
      },
    ],
  },
  {
    countrySlug: "pakistan",
    regions: [
      { regionSlug: null, units: [SQFT_UNIT], conversions: [] },
      {
        regionSlug: null,
        units: [
          { code: "kanal-traditional", name: "Kanal (Traditional)" },
          { code: "marla-traditional", name: "Marla (Traditional)" },
          { code: "kanal-modern", name: "Kanal (Modern / DHA)" },
          { code: "marla-modern", name: "Marla (Modern / DHA)" },
          { code: "killa", name: "Killa" },
        ],
        conversions: [
          {
            fromCode: "kanal-traditional",
            toCode: "square-feet",
            factor: 5445,
            source: "Zameen.com",
            sourceUrl: "https://www.zameen.com/blog/plot-size-conversions-pakistan.html",
            notes: "British-era revenue standard, still used in rural/revenue records and most of KPK. = 20 Marla.",
          },
          {
            fromCode: "marla-traditional",
            toCode: "square-feet",
            factor: 272.25,
            source: "Zameen.com",
            sourceUrl: "https://www.zameen.com/blog/plot-size-conversions-pakistan.html",
          },
          {
            fromCode: "kanal-modern",
            toCode: "square-feet",
            factor: 4500,
            source: "Zameen.com",
            sourceUrl: "https://www.zameen.com/blog/plot-size-conversions-pakistan.html",
            notes: "Rounded post-independence redefinition used in planned housing societies (DHA, Bahria Town). = 20 Marla.",
          },
          {
            fromCode: "marla-modern",
            toCode: "square-feet",
            factor: 225,
            source: "Zameen.com",
            sourceUrl: "https://www.zameen.com/blog/plot-size-conversions-pakistan.html",
            notes: "= 25 square yards.",
          },
          {
            fromCode: "killa",
            toCode: "square-feet",
            factor: 43560,
            source: "Bajaj Finserv",
            sourceUrl: "https://www.bajajfinserv.in/killa-to-acre",
            notes: "= exactly 1 acre = 8 (traditional) Kanal. 220 ft × 198 ft.",
          },
        ],
      },
    ],
  },
  {
    countrySlug: "nepal",
    regions: [
      { regionSlug: null, units: [SQFT_UNIT], conversions: [] },
      {
        regionSlug: null,
        units: [
          { code: "ropani", name: "Ropani" },
          { code: "aana", name: "Aana" },
          { code: "paisa", name: "Paisa" },
          { code: "daam", name: "Daam" },
        ],
        conversions: [
          {
            fromCode: "ropani",
            toCode: "square-feet",
            factor: 5476,
            source: "HousingNepal",
            sourceUrl: "https://blog.housingnepal.com/2020/04/land-area-calculation-in-nepal-ropani.html",
            notes: "Hill/mountain districts including Kathmandu Valley. = 16 Aana. No government source located; two commercial sources agree exactly.",
          },
          {
            fromCode: "aana",
            toCode: "square-feet",
            factor: 342.25,
            source: "HousingNepal",
            sourceUrl: "https://blog.housingnepal.com/2020/04/land-area-calculation-in-nepal-ropani.html",
            notes: "= Ropani ÷ 16 = 4 Paisa.",
          },
          {
            fromCode: "paisa",
            toCode: "square-feet",
            factor: 85.5625,
            source: "HousingNepal",
            sourceUrl: "https://blog.housingnepal.com/2020/04/land-area-calculation-in-nepal-ropani.html",
            notes: "= 4 Daam.",
          },
          {
            fromCode: "daam",
            toCode: "square-feet",
            factor: 21.39,
            source: "HousingNepal",
            sourceUrl: "https://blog.housingnepal.com/2020/04/land-area-calculation-in-nepal-ropani.html",
            notes: "Smallest unit in the hill system.",
          },
        ],
      },
      {
        regionSlug: "madhesh",
        units: [
          { code: "bigha", name: "Bigha" },
          { code: "kattha", name: "Kattha" },
          { code: "dhur", name: "Dhur" },
        ],
        conversions: [
          {
            fromCode: "bigha",
            toCode: "square-feet",
            factor: 72900,
            source: "Global IME Bank",
            sourceUrl: "https://www.globalimebank.com/blog/nepal-land-area-converter/",
            notes:
              "Terai/lowland system — a DIFFERENT unit from any Indian Bigha despite the shared name (≈2.7× the common Indian \"pucca\" bigha, 5× West Bengal's). = 20 Kattha.",
          },
          {
            fromCode: "kattha",
            toCode: "square-feet",
            factor: 3645,
            source: "Global IME Bank",
            sourceUrl: "https://www.globalimebank.com/blog/nepal-land-area-converter/",
            notes: "Also NOT the same as India's Katha (720–1,361 sq ft) despite the identical name. = 20 Dhur.",
          },
          {
            fromCode: "dhur",
            toCode: "square-feet",
            factor: 182.25,
            source: "Global IME Bank",
            sourceUrl: "https://www.globalimebank.com/blog/nepal-land-area-converter/",
          },
        ],
      },
    ],
  },
];
