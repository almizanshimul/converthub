export interface CalculatorSeed {
  slug: string;
  name: string;
  category: string;
  description: string;
  content?: string;
  logicKey: string;
  faq: { question: string; answer: string }[];
}

export const calculators: CalculatorSeed[] = [
  {
    slug: "bengali-number-to-words",
    name: "Bengali Number to Words",
    category: "numbers",
    description: "Convert any number into written Bengali words — e.g. 125000 becomes \"এক লাখ পঁচিশ হাজার\".",
    content:
      "Bengali (বাংলা) is spoken natively by more than 230 million people, making it one of the most widely spoken languages in the world, and it counts large numbers in a way that surprises anyone used to the international thousand/million/billion system. Rather than grouping digits in threes from the right, Bengali — like the rest of the Indian subcontinent — groups them 2-2-3: the first comma falls after three digits (the hundreds), and every comma after that falls every two digits. So 12,345,678 in the international system is written 1,23,45,678 in Bengali, and read not as \"twelve million\" but as \"এক কোটি তেইশ লাখ পঁয়তাল্লিশ হাজার ছয়শত আটাত্তর\" — one crore, twenty-three lakh, forty-five thousand, six hundred seventy-eight.\n\nThe two pivot units that make this system distinctive are লাখ (lakh, 10^5 = 100,000) and কোটি (crore, 10^7 = 10,000,000). A lakh sits between ten thousand and a hundred thousand in the international system, which is exactly why a plain international-style number reads so awkwardly once it crosses 99,999 — 125,000 isn't \"one hundred twenty-five thousand\" in Bengali, it's \"এক লাখ পঁচিশ হাজার\" (one lakh twenty-five thousand). These aren't obscure or old-fashioned terms either — lakh and crore are the units used every day in Bangladeshi and Indian news reporting, government budgets, real estate listings, and company financial statements. A property listed for \"৫০ লাখ টাকা\" is 5,000,000 taka, and a company reporting profits of \"২ কোটি টাকা\" earned 20,000,000 taka — figures that would otherwise need to be mentally regrouped from a comma-separated international number.\n\nBeyond crore, the scale continues upward with আরব (arab, 10^9), খরব (kharab, 10^11), নীল (nil, 10^13), পদ্ম (padma, 10^15), and শঙ্খ (shankha, 10^17) — this calculator supports the full chain, though in practice arab and above are rare outside of national-budget-scale figures. Below a hundred, Bengali number words are almost entirely irregular rather than built compositionally the way English builds \"twenty-one\" from \"twenty\" plus \"one\": পঁচিশ (25), সাতান্ন (57), and ঊনসত্তর (69, literally close to \"one less than seventy\" in its historical root, though it functions as a single irregular word today) each have to be memorized individually rather than derived from a rule. That irregularity is exactly why a lookup-table-based converter like this one is genuinely useful rather than a novelty — getting all hundred of those base words right by rule alone is much harder than it looks.\n\nOne detail worth knowing: the Bengali spoken and written in Bangladesh and the Bengali spoken and written in West Bengal, India, use the same core number words and the same lakh/crore grouping — a rarity, since so many other measurement conventions (Bengali's own traditional land units among them) genuinely differ between the two regions. For numbers, at least, there's no need to specify which side of the border you're on.\n\nBengali also has its own native digit forms — ০ ১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯ — used throughout Bangladesh on currency, official documents, and price tags alongside or instead of the Western 0-9 digits most software defaults to. This calculator accepts standard Western digits as input and produces the full spelled-out word form as output, which is the version needed for cheques, contracts, and exam answers written in running Bengali text — situations where digits alone, in either numeral system, aren't considered a complete written answer.",
    logicKey: "bn-number-to-words",
    faq: [
      {
        question: "Does this use the Indian numbering system?",
        answer:
          "Yes — Bengali groups large numbers as thousand, lakh (10^5), and crore (10^7) rather than the international thousand/million/billion grouping, and this tool follows that convention.",
      },
      {
        question: "Is Bangladesh's Bengali the same as West Bengal's for numbers?",
        answer: "Yes — the core number words and the thousand/lakh/crore grouping are the same in both Bangladesh and West Bengal, India.",
      },
    ],
  },
  {
    slug: "hindi-number-to-words",
    name: "Hindi Number to Words",
    category: "numbers",
    description: "Convert any number into written Hindi words — e.g. 125000 becomes \"एक लाख पच्चीस हज़ार\".",
    content:
      "Hindi is written in the Devanagari script and spoken as a first or second language by hundreds of millions of people across India, and — like Bengali, Urdu, and the other major languages of the subcontinent — it counts large numbers using the Indian numbering system rather than the international thousand/million/billion grouping most of the rest of the world learns. Digits are grouped 2-2-3 from the right instead of 3-3-3: 12345678 is written 1,23,45,678, not 123,456,78, and read as \"एक करोड़ तेईस लाख पैंतालीस हज़ार छह सौ अठहत्तर\" (one crore, twenty-three lakh, forty-five thousand, six hundred seventy-eight) rather than \"twelve million, three hundred forty-five thousand, six hundred seventy-eight.\"\n\nThe two units that define the system are लाख (lakh, 100,000) and करोड़ (crore, 10,000,000), and they aren't a historical curiosity — they're the everyday vocabulary of Indian finance, government, and media. A crore shows up constantly in news coverage of government budgets, company valuations, and box-office earnings (a film that \"crossed 100 crore\" made over a billion rupees), and lakh is the standard way Indians talk about salaries, property prices, and vehicle costs — a car priced at \"8 lakh rupees\" is 800,000 rupees. Because lakh sits at 100,000, any number from 100,000 up to just under 10,000,000 gets restructured in Hindi in a way that has no direct one-word equivalent in English: 350,000 isn't \"three hundred fifty thousand,\" it's साढ़े तीन लाख — three and a half lakh.\n\nAbove crore, the scale keeps going with अरब (arab, 10^9), खरब (kharab, 10^11), नील (nil, 10^13), पद्म (padma, 10^15), and शंख (shankh, 10^17), all of which this calculator handles, though outside of national economic statistics you'll rarely need anything past arab. Below one hundred, Hindi number words are largely irregular rather than assembled from parts — पचास (50), सत्तर (70), and इक्यानबे (91) each have their own distinct form, unlike English's fairly regular \"fifty,\" \"seventy,\" \"ninety-one\" pattern built from a small set of building blocks. A few of Hindi's teens and twenties even carry a subtractive echo from Sanskrit (numbers like उनतीस, 29, historically relate to \"one less than thirty\"), though they function as ordinary standalone words in modern Hindi rather than as live subtraction.\n\nThat irregularity is precisely why a dedicated converter is more useful here than it might seem for a \"simple\" task — reliably generating all hundred base number words by rule is much harder than generating them for a language where -teen and -ty suffixes do most of the work. It's also worth knowing that the core number vocabulary and the lakh/crore grouping are shared with Bengali and Urdu, reflecting the numbering system's roots across the wider Hindustani-speaking region rather than any one language alone.\n\nHindi also has its own native digit forms — ० १ २ ३ ४ ५ ६ ७ ८ ९ — still seen on some official signage, older currency, and traditional documents, though standard Western digits (0-9) are now far more common in day-to-day printed and digital Hindi. This calculator takes standard Western digits as input and produces the fully spelled-out Devanagari word form as output, which is the form required wherever a document calls for an amount written out in words rather than figures — a cheque, a legal affidavit, or a formal receipt — since digits alone, in either numeral system, aren't accepted as a complete written amount in those contexts.",
    logicKey: "hi-number-to-words",
    faq: [
      {
        question: "Does this use the Indian numbering system?",
        answer:
          "Yes — Hindi groups large numbers as thousand, lakh (10^5), and crore (10^7) rather than the international thousand/million/billion grouping, and this tool follows that convention.",
      },
    ],
  },
  {
    slug: "urdu-number-to-words",
    name: "Urdu Number to Words",
    category: "numbers",
    description: "Convert any number into written Urdu words — e.g. 125000 becomes \"ایک لاکھ پچیس ہزار\".",
    content:
      "Urdu is written right-to-left in the Perso-Arabic script, but its number words are, almost without exception, the same spoken vocabulary as Hindi — the two are widely considered the same underlying spoken language (sometimes called Hindustani) that diverged mainly in script and in higher, more literary vocabulary, while everyday words like numbers stayed shared. ایک (ek, one), دس (das, ten), and پچاس (pachaas, fifty) sound identical whether spoken in Lahore, Karachi, Delhi, or Lucknow — only the script on the page differs. That shared root is also why this tool groups numbers the same way the Hindi and Bengali tools do: 2-2-3 from the right, using لاکھ (lakh, 10^5) and کروڑ (crore, 10^7) instead of the international thousand/million/billion grouping.\n\nThat South Asian grouping isn't a niche feature of Urdu specifically — it's the everyday convention across Pakistan and Urdu-speaking communities in India alike. Property prices, salaries, and government budget figures are all quoted in lakh and crore rather than in millions: a house listed at \"ایک کروڑ روپے\" is one crore rupees (10,000,000), and a monthly salary of \"دو لاکھ روپے\" is 200,000 rupees. A number like 1,250,000 in the international system becomes 12,50,000 when grouped the South Asian way, read as \"بارہ لاکھ پچاس ہزار\" (twelve lakh fifty thousand) rather than \"one million two hundred fifty thousand.\" The scale continues past crore with ارب (arab, 10^9), کھرب (kharab, 10^11), نیل (nil, 10^13), پدم (padma, 10^15), and شنکھ (shankh, 10^17), all supported here, though arab and beyond mostly only appear in national-level economic figures.\n\nBelow one hundred, Urdu number words — like their Hindi counterparts — are largely irregular rather than built from a small set of parts the way English constructs \"sixty-three\" from \"sixty\" and \"three.\" اکہتر (71), چھیانوے (96), and اڑتالیس (48) each have to be learned individually, which is exactly the kind of task a lookup-table-based converter handles more reliably than an ad hoc rule ever could. One quirk of converting numbers into Urdu specifically: because the script reads right-to-left while the digits of a typed number still read left-to-right, a number and its Urdu word-for-word reading can look visually reversed on the page even though both are being read correctly in their own direction — worth knowing if the layout looks unfamiliar at first glance.\n\nBecause Urdu shares its number vocabulary so closely with Hindi, this tool's biggest value isn't in the numbers 1 through 99 — a fluent Urdu speaker would recognize those instantly regardless of script — but in reliably applying the lakh/crore grouping correctly for large figures, and in producing the correct Perso-Arabic spelling without needing a transliteration step from Devanagari.\n\nUrdu also has its own set of Perso-Arabic digit forms — ۰ ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹ — visually similar to but distinct from the Eastern Arabic-Indic numerals used in Arabic script, and still common on Pakistani currency, official stamps, and some signage, alongside the Western 0-9 digits used in most digital contexts including this calculator's input field. The spelled-out word output this tool produces is the form needed wherever a document calls for an amount written in full rather than in figures — a cheque, a rent agreement, or a court affidavit — regardless of which digit style was used to write the number itself.",
    logicKey: "ur-number-to-words",
    faq: [
      {
        question: "Does this use the Indian numbering system?",
        answer:
          "Yes — Urdu groups large numbers as thousand, lakh (10^5), and crore (10^7), the same South Asian convention used by Hindi and Bengali, rather than the international thousand/million/billion grouping — and this tool follows it.",
      },
      {
        question: "Are Urdu and Hindi numbers really the same?",
        answer:
          "The spoken number words are essentially identical between Hindi and Urdu — both descend from the same Hindustani vocabulary. Only the script differs: this tool renders the words in the Perso-Arabic script Urdu is written in, rather than Devanagari.",
      },
    ],
  },
  {
    slug: "arabic-number-to-words",
    name: "Arabic Number to Words",
    category: "numbers",
    description: "Convert any number into written Arabic words — e.g. 125000 becomes \"مئة خمسة وعشرون ألف\".",
    content:
      "Arabic numeral grammar is genuinely one of the more intricate systems in any widely spoken language, and it's worth explaining upfront exactly what this calculator does and doesn't attempt, so the output isn't mistaken for more than it is. In full Modern Standard Arabic, numbers agree in gender with whatever noun they're counting (فتاة واحدة، \"one girl,\" versus كتاب واحد، \"one book\"), the numbers three through ten follow a \"polarity\" rule where they take the opposite gender of the noun they modify, two of anything uses a special dual form rather than the plain number word, and even the scale words themselves change shape depending on the count — 200 is مئتان (a dual form of مئة), not \"two hundred\" built compositionally, and 3 to 10 thousand uses the plural آلاف rather than the singular ألف used for exactly one thousand. Getting every one of those rules right requires knowing what the number is actually counting, which a generic \"type in any number\" calculator has no way to know.\n\nSo this tool deliberately uses a simplified, invariant reading: each digit position is rendered with its base cardinal word, joined the way Arabic naturally joins compound numbers — units before tens, connected with و (\"and\"), so 25 is خمسة وعشرون (\"five and-twenty\"), the reverse order from English's \"twenty-five.\" Scale words like مئة (hundred), ألف (thousand), مليون (million), and مليار (billion) are used in their singular form regardless of count, and a count of exactly one drops the word for \"one\" entirely before the scale word — مليون rather than واحد مليون, matching how a million is actually said aloud, even though the same simplification skips the dual/plural agreement a fully grammatical rendering would apply for two or for three-through-ten. The result reads clearly and is entirely understandable to any Arabic speaker; it just isn't a substitute for a native speaker's judgment on a legal document or a formal invitation where full grammatical agreement genuinely matters.\n\nOn the numbering system itself: Arabic uses the same international thousand/million/billion/trillion grouping (3-3-3 from the right) that English, French, and Spanish use, unlike the South Asian lakh/crore system this site's Bengali, Hindi, and Urdu tools use. مليار (billion, 10^9) and تريليون (trillion, 10^12) are both modern loanwords that have become completely standard in Arabic-language financial and news media — reports of a country's GDP or a company's market value in مليار دولار (billion dollars) are as routine in Arabic business coverage as \"billion dollars\" is in English.\n\nA practical note on layout: Arabic is written right-to-left, but the Eastern Arabic-Indic numerals used for digits (١٢٣...) — and the Western digits (123...) used in most digital contexts, including this calculator's input field — are both read left-to-right even inside right-to-left text, which is standard practice and not a bug in how the number is displayed.\n\nOne more piece of context worth knowing, if only because it surprises people: the digit system used almost everywhere in the world today — 0 through 9, positional place value, the whole apparatus — is called \"Arabic numerals\" in English for a real historical reason. The system originated in India, was transmitted to the Islamic world and refined there (Al-Khwarizmi's 9th-century work on it is where the word \"algorithm\" comes from), and reached Europe through Arabic mathematical texts, hence the name that stuck in Western languages ever since — even though the WORDS this calculator produces are a separate thing entirely from that shared digit system.",
    logicKey: "ar-number-to-words",
    faq: [
      {
        question: "Does this handle Arabic grammatical gender agreement?",
        answer:
          "No — this tool uses a simplified, invariant form of each number rather than full agreement with a specific counted noun, dual forms, or the three-through-ten polarity rule. It's fully readable and understandable, but not a substitute for a native speaker's review on a formal or legal document.",
      },
      {
        question: "Does Arabic use lakh/crore like Hindi or Bengali?",
        answer: "No — Arabic groups large numbers using the international system (thousand, million, billion, trillion), the same 3-3-3 grouping used in English, French, and Spanish, not the South Asian lakh/crore system.",
      },
    ],
  },
  {
    slug: "spanish-number-to-words",
    name: "Spanish Number to Words",
    category: "numbers",
    description: "Convert any number into written Spanish words — e.g. 125000 becomes \"ciento veinticinco mil\".",
    content:
      "Spanish is the native language of roughly 500 million people across Spain and the Americas, and its number words hold a genuinely useful trap worth knowing about before you trust any number-to-words tool, including this one: the word billón does not mean the same thing in Spanish that \"billion\" means in English. Traditionally, Spanish (like French and German) uses the long-scale system, where billón means a million million — 10^12, what English calls a trillion — while the English short-scale \"billion\" is 10^9. American media influence has made the short-scale meaning increasingly common in casual usage, but that inconsistency is exactly the kind of ambiguity a calculator shouldn't quietly paper over. This tool sidesteps it by using mil millones (\"a thousand millions\") for 10^9 and reserving billón for its traditional, unambiguous 10^12 meaning — the same convention recommended by most Spanish-language style guides for exactly this reason.\n\nBelow one hundred, Spanish numbers are mostly compositional but with real irregularities worth getting right: 16 through 29 contract into single words (dieciséis, not diez y seis; veintidós, not veinte y dos) following a 1994 spelling reform by the Real Academia Española that formalized what was already common usage, while 31 and up stay as separate words joined by y — treinta y uno, cuarenta y dos. The number 21 and its compounds (31, 41...) also apocopate before a following noun: uno becomes un and veintiuno becomes veintiún right before a scale word, so 21,000 is veintiún mil, not veintiuno mil — a small but very noticeable grammatical detail this tool applies automatically.\n\nThe hundreds are their own irregular set rather than a simple \"digit + cientos\" pattern: 100 alone is cien, but 101 is ciento uno (cien becomes ciento specifically when something follows it), and the multiples of a hundred from 200 to 900 have their own distinct stems — doscientos, trescientos, cuatrocientos, quinientos (not \"cincocientos\"), seiscientos, setecientos (not \"sietecientos\"), ochocientos, and novecientos (not \"nuevecientos\") — each memorized individually rather than derived by rule. Above a thousand, mil never takes a uno prefix (mil, not un mil) and never pluralizes to miles in this counting context, while millón and billón do pluralize normally for count two and above — un millón, but dos millones.\n\nPut together, correctly spelling out a six- or seven-figure Spanish number by hand means getting the 16-29 contractions, the uno/veintiún apocope, the irregular hundred-stems, and the millón/millones pluralization all right at once — which is exactly the kind of compounding-detail task a purpose-built converter is good for.\n\nRegional variation is also worth a mention: this calculator follows the standard, RAE-endorsed forms used across both Spain and Latin America (dieciséis, veintiuno, mil millones), but older texts — and some regional or informal usage — still spell the 16-29 range as three separate words (diez y seis, veinte y uno) predating the 1994 reform. Both forms are understood everywhere; this tool sticks to the modern single-word standard since that's what's taught in schools and used in edited writing today, which also happens to be the form expected on formal paperwork like a cheque or a notarized contract, where consistency with the standard spelling matters more than it does in casual writing.",
    logicKey: "es-number-to-words",
    faq: [
      {
        question: "Why doesn't this use \"billón\" for a billion?",
        answer:
          "Because in traditional Spanish, billón means 10^12 (what English calls a trillion), not 10^9 — a genuine, well-documented ambiguity with the English \"billion.\" This tool uses mil millones for 10^9 and keeps billón for its traditional 10^12 meaning, following the convention most Spanish style guides recommend to avoid the confusion.",
      },
      {
        question: "Does this get \"veintiún\" and the irregular hundreds right?",
        answer:
          "Yes — the uno-to-ún apocope before a following word (veintiún mil, not veintiuno mil) and the irregular hundred-stems (quinientos, setecientos, novecientos) are both handled explicitly rather than guessed from a general rule.",
      },
    ],
  },
  {
    slug: "french-number-to-words",
    name: "French Number to Words",
    category: "numbers",
    description: "Convert any number into written French words — e.g. 125000 becomes \"cent vingt-cinq mille\".",
    content:
      "Standard French — the variety taught in France and used in most French-as-a-foreign-language instruction — has one of the more famous numbering quirks of any major world language: it doesn't have single words for seventy, eighty, or ninety. Instead, 70 is soixante-dix (\"sixty-ten\"), 80 is quatre-vingts (\"four-twenties\"), and 90 is quatre-vingt-dix (\"four-twenty-ten\") — remnants of a vigesimal (base-20) counting system that was once far more widespread across French and predates the modern decimal-based numbering that eventually won out almost everywhere else. The numbers in between keep building on that logic: 72 is soixante-douze (\"sixty-twelve\"), 95 is quatre-vingt-quinze (\"four-twenty-fifteen\"), and 99 — the longest of the bunch — is quatre-vingt-dix-neuf (\"four-twenty-ten-nine\"). It's worth knowing that Belgian and Swiss French largely abandoned this system for septante (70), octante or huitante (80), and nonante (90) — simpler, decimal-based coinages — but this calculator follows the standard France French convention, since that's the form most widely taught and recognized internationally.\n\nA second, smaller quirk sits at 80 specifically: quatre-vingts takes a plural -s when it stands alone as a round number, but drops it the moment another digit follows — quatre-vingts (80) but quatre-vingt-un (81), quatre-vingt-deux (82), and so on. The same pattern applies to cent (hundred): deux cents (200) keeps its -s only when nothing follows, while deux cent trois (203) doesn't. Neither cent nor mille (thousand) ever takes an un prefix the way million and milliard do — it's cent and mille on their own, not un cent or un mille, but specifically un million and un milliard for exactly one of each. This calculator applies both of those rules automatically rather than defaulting to the simpler (but incorrect) always-plural or always-prefixed forms.\n\nOn scale words above a thousand: standard French keeps mille invariant (never pluralizing, unlike the English \"thousands\"), while million, milliard, billion, and billiard all pluralize normally for a count of two or more — deux millions, trois milliards. Note that milliard (10^9) and billion (10^12) are genuinely distinct words in French, unlike the ambiguity Spanish has around billón — so there's no equivalent trap to watch out for here, just the vigesimal irregularities above 60.\n\nBecause so much of French's number system depends on memorized irregular forms rather than a small set of composable rules — sixty-plus in particular has no shortcuts — a lookup-table-based converter like this one is a meaningfully more reliable way to get a large number's spelled-out form correct than reconstructing it from first principles by hand.\n\nThe vigesimal remnant in soixante-dix and quatre-vingts isn't just a French oddity, either — it's a trace of a counting system that Celtic languages across pre-Roman Gaul are believed to have used far more extensively, with base-20 counting surviving today in Welsh and Breton numerals too. Standard French kept it only for 70-99, while fully decimalizing everything below 70 — which is exactly why the irregularity feels like it appears out of nowhere once a number crosses 69, rather than running through the whole system. It's also, in practice, the single biggest source of errors when non-native speakers try to write out large French numbers by hand, since every other part of the system behaves the way a decimal-counting intuition would expect.",
    logicKey: "fr-number-to-words",
    faq: [
      {
        question: "Why does this spell out 80 as \"quatre-vingts\" instead of a normal word?",
        answer:
          "Standard French genuinely has no single word for seventy, eighty, or ninety — they're built from a vigesimal (base-20) counting pattern instead: soixante-dix (60+10), quatre-vingts (4×20), and quatre-vingt-dix (4×20+10). This tool follows the standard France French convention rather than the simpler septante/octante/nonante forms used in Belgium and Switzerland.",
      },
      {
        question: "Does \"cent\" ever get a plural -s?",
        answer:
          "Yes, but only when it's the last part of the number — deux cents (200) on its own, but deux cent trois (203) without the -s once another digit follows. This tool applies that rule automatically.",
      },
    ],
  },
  {
    slug: "english-number-to-words",
    name: "English Number to Words",
    category: "numbers",
    description: "Convert any number into written English words — e.g. 125000 becomes \"one hundred twenty-five thousand\".",
    content:
      "Spelling a number out in words rather than digits shows up in a specific, recurring set of situations — the amount line on a check, the total on a legal contract or promissory note, a dollar figure in a will — precisely because words are far harder to alter undetected than digits are. A \"1\" quietly turned into a \"7\" is a one-stroke forgery; \"one thousand\" turned into \"seven thousand\" is not. That's the practical reason this kind of converter exists in English at all, on top of it simply being useful for anyone drafting that kind of document without wanting to spell out a seven-figure number by hand.\n\nEnglish counts using the short-scale international system — thousand (10^3), million (10^6), billion (10^9), trillion (10^12) — grouped in threes from the right, which is the system most of the world's number formatting now follows even in languages that spell the number words differently. It wasn't always the only English convention, though: the United Kingdom officially used the long scale (where a British \"billion\" meant a million million, 10^12, matching the traditional French and Spanish billón/billion) until the government formally adopted the short scale in 1974, aligning UK usage with the American convention that had already become the global standard for financial and scientific reporting. Any pre-1974 British text using \"billion\" is worth reading with that older meaning in mind.\n\nBelow a hundred, English is unusually regular compared to many languages this site covers: everything from twenty to ninety-nine is built compositionally from ten base words (twenty, thirty... ninety) plus the digits one through nine, joined with a hyphen — twenty-one, forty-seven, ninety-nine. The only real irregularities sit in eleven through nineteen, where the pattern breaks from a clean \"ten-one, ten-two\" structure into eleven, twelve, and the \"-teen\" suffix forms. Above a hundred, there's one small but genuine style difference between American and British English: British usage traditionally inserts \"and\" before the last part of a number (\"one hundred and twenty-five\"), while American usage generally omits it (\"one hundred twenty-five\"). This tool follows the American convention, matching the style most standardized tests, US financial documents, and American style guides use — though both forms are correct English and equally understandable.\n\nOne more practical note: numbers are always rendered as cardinal words here (\"one,\" \"two,\" \"three\") rather than ordinal words (\"first,\" \"second,\" \"third\") — a cardinal reading is what a check amount, a contract total, or a spelled-out quantity calls for, and it's the standard, unambiguous choice for a general-purpose number-to-words tool.\n\nHyphenation is another small detail that trips up manual spelling-out more often than expected: style guides including Chicago and AP agree that compound numbers from twenty-one to ninety-nine take a hyphen whether they stand alone or appear inside a larger number — \"one hundred forty-two,\" not \"one hundred forty two\" — and this tool applies that consistently, including deep inside very large numbers where it's easy to lose track by hand. Getting that right matters more than it might seem: on a legal document, an inconsistently hyphenated number can read as a transcription error even when the value itself is completely correct.",
    logicKey: "en-number-to-words",
    faq: [
      {
        question: "Does this include \"and\" (e.g. \"one hundred and one\")?",
        answer:
          "No — this tool follows the American convention of omitting \"and\" (\"one hundred one\"), which is standard on US legal and financial documents. British usage traditionally includes it (\"one hundred and one\"); both are correct English.",
      },
      {
        question: "What's the difference between the short scale and long scale?",
        answer:
          "The short scale (used by the US and, since 1974, the UK) makes a billion 10^9. The long scale, still used in traditional French and Spanish, makes it 10^12 instead — the same value English calls a trillion. This tool uses the modern short scale, standard in English today.",
      },
    ],
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "health",
    description: "Calculate your Body Mass Index from height and weight, in metric or imperial units, with the standard WHO weight category.",
    logicKey: "bmi",
    faq: [
      {
        question: "What do the BMI categories mean?",
        answer:
          "Under 18.5 is classed as underweight, 18.5–24.9 as normal weight, 25–29.9 as overweight, and 30 or above as obese. These are the World Health Organization's standard adult thresholds.",
      },
      {
        question: "Does BMI mean the same thing for everyone?",
        answer:
          "Not exactly. BMI doesn't distinguish muscle from fat, so it can overestimate body fat in very muscular people and underestimate it in older adults who've lost muscle mass. The WHO has also published lower Asian-population cutoffs (overweight from 23, obese from 27.5) because health risk rises at a lower BMI for many South and East Asian populations — this calculator uses the standard international thresholds, not the Asian-specific ones.",
      },
    ],
  },
  {
    slug: "basic-calculator",
    name: "Calculator",
    category: "math",
    description: "A simple on-screen calculator for everyday arithmetic — addition, subtraction, multiplication, and division.",
    logicKey: "basic",
    faq: [],
  },
];
