// Bengali/Hindi/Urdu translations for calculators. Written by hand — the
// auto-translate script (scripts/auto-translate.ts) produced garbled output
// for these two specifically, because the English source descriptions embed
// a worked example in the *other* script (e.g. the English field for the
// Bengali tool contains actual Bengali text as an example), which confuses
// machine translation. Kept as reviewed seed data rather than re-running MT.
// The Urdu output was considerably worse than bn/hi's — exponents like
// "10^5" came back as random Urdu letters ("10 ^ ا ب پ") and "crore" was
// dropped entirely — so ur is hand-written here from the start rather than
// patched after the fact.

interface CalculatorTranslationSeed {
  name: string;
  description: string;
  faq: { question: string; answer: string }[];
}

export const bnCalculatorTranslations: Record<string, CalculatorTranslationSeed> = {
  "bengali-number-to-words": {
    name: "বাংলা সংখ্যা থেকে শব্দ",
    description: "যেকোনো সংখ্যাকে লেখা বাংলা শব্দে রূপান্তর করুন — যেমন ১২৫০০০ হয়ে যায় \"এক লাখ পঁচিশ হাজার\"।",
    faq: [
      {
        question: "এটা কি ভারতীয় সংখ্যা পদ্ধতি ব্যবহার করে?",
        answer:
          "হ্যাঁ — বাংলায় বড় সংখ্যাকে হাজার, লাখ (১০^৫) এবং কোটি (১০^৭) হিসেবে ভাগ করা হয়, আন্তর্জাতিক থাউজেন্ড/মিলিয়ন/বিলিয়ন পদ্ধতির বদলে — এই টুল সেই নিয়মই অনুসরণ করে।",
      },
      {
        question: "বাংলাদেশ ও পশ্চিমবঙ্গের সংখ্যা লেখার নিয়ম কি একই?",
        answer: "হ্যাঁ — মূল সংখ্যাবাচক শব্দ এবং হাজার/লাখ/কোটির ভাগ করার নিয়ম বাংলাদেশ ও পশ্চিমবঙ্গ দুই জায়গাতেই একই।",
      },
    ],
  },
  "hindi-number-to-words": {
    name: "হিন্দি সংখ্যা থেকে শব্দ",
    description: "যেকোনো সংখ্যাকে লেখা হিন্দি শব্দে রূপান্তর করুন — যেমন ১২৫০০০ হয়ে যায় \"एक लाख पच्चीस हज़ार\"।",
    faq: [
      {
        question: "এটা কি ভারতীয় সংখ্যা পদ্ধতি ব্যবহার করে?",
        answer:
          "হ্যাঁ — হিন্দিতে বড় সংখ্যাকে হাজার, লাখ (১০^৫) এবং কোটি (১০^৭) হিসেবে ভাগ করা হয়, আন্তর্জাতিক থাউজেন্ড/মিলিয়ন/বিলিয়ন পদ্ধতির বদলে — এই টুল সেই নিয়মই অনুসরণ করে।",
      },
    ],
  },
  "bmi-calculator": {
    name: "BMI ক্যালকুলেটর",
    description: "উচ্চতা ও ওজন থেকে আপনার বডি মাস ইনডেক্স (BMI) হিসাব করুন, মেট্রিক বা ইম্পেরিয়াল এককে, WHO-র প্রমিত ওজন শ্রেণি অনুযায়ী।",
    faq: [
      {
        question: "BMI শ্রেণিগুলোর মানে কী?",
        answer:
          "১৮.৫-এর নিচে কম ওজন, ১৮.৫–২৪.৯ স্বাভাবিক ওজন, ২৫–২৯.৯ অতিরিক্ত ওজন, এবং ৩০ বা তার বেশি হলে স্থূলতা হিসেবে ধরা হয়। এগুলো বিশ্ব স্বাস্থ্য সংস্থার (WHO) প্রমিত প্রাপ্তবয়স্ক মানদণ্ড।",
      },
      {
        question: "BMI কি সবার জন্য একই অর্থ বহন করে?",
        answer:
          "ঠিক তা নয়। BMI পেশি ও চর্বির মধ্যে পার্থক্য করে না, তাই খুব পেশিবহুল মানুষের ক্ষেত্রে এটি শরীরের চর্বি বেশি দেখাতে পারে, আবার পেশি হারানো বয়স্কদের ক্ষেত্রে কম দেখাতে পারে। WHO এশীয় জনগোষ্ঠীর জন্য কিছুটা কম মানদণ্ডও প্রকাশ করেছে (২৩ থেকে অতিরিক্ত ওজন, ২৭.৫ থেকে স্থূলতা), কারণ দক্ষিণ ও পূর্ব এশিয়ার অনেক জনগোষ্ঠীর ক্ষেত্রে কম BMI-তেই স্বাস্থ্যঝুঁকি বাড়ে — এই ক্যালকুলেটর আন্তর্জাতিক প্রমিত মানদণ্ড ব্যবহার করে, এশিয়া-নির্দিষ্ট মানদণ্ড নয়।",
      },
    ],
  },
  "urdu-number-to-words": {
    name: "উর্দু সংখ্যা থেকে শব্দ",
    description: "যেকোনো সংখ্যাকে লেখা উর্দু শব্দে রূপান্তর করুন — যেমন ১২৫০০০ হয়ে যায় \"ایک لاکھ پچیس ہزار\"।",
    faq: [
      {
        question: "এটা কি ভারতীয় সংখ্যা পদ্ধতি ব্যবহার করে?",
        answer: "হ্যাঁ — উর্দুতেও হিন্দি ও বাংলার মতো হাজার, লাখ (১০^৫), এবং কোটি (১০^৭) হিসেবে ভাগ করা হয়, আন্তর্জাতিক পদ্ধতির বদলে।",
      },
    ],
  },
  "arabic-number-to-words": {
    name: "আরবি সংখ্যা থেকে শব্দ",
    description: "যেকোনো সংখ্যাকে লেখা আরবি শব্দে রূপান্তর করুন — যেমন ১২৫০০০ হয়ে যায় \"مئة خمسة وعشرون ألف\"।",
    faq: [
      {
        question: "এটা কি আন্তর্জাতিক সংখ্যা পদ্ধতি ব্যবহার করে?",
        answer: "হ্যাঁ — আরবি হাজার, মিলিয়ন, বিলিয়ন হিসেবে ভাগ করে, বাংলা/হিন্দির লাখ-কোটি পদ্ধতির বদলে। ব্যাকরণগত লিঙ্গ-সামঞ্জস্য এখানে সরলীকৃত করা হয়েছে।",
      },
    ],
  },
  "spanish-number-to-words": {
    name: "স্প্যানিশ সংখ্যা থেকে শব্দ",
    description: "যেকোনো সংখ্যাকে লেখা স্প্যানিশ শব্দে রূপান্তর করুন — যেমন ১২৫০০০ হয়ে যায় \"ciento veinticinco mil\"।",
    faq: [
      {
        question: "১ বিলিয়নের জন্য \"billón\" শব্দটি কি ব্যবহার করা হয়েছে?",
        answer: "না — ঐতিহ্যগত স্প্যানিশে billón মানে ১০^১২ (ইংরেজির ট্রিলিয়ন), তাই বিভ্রান্তি এড়াতে ১০^৯-এর জন্য \"mil millones\" ব্যবহার করা হয়েছে।",
      },
    ],
  },
  "french-number-to-words": {
    name: "ফরাসি সংখ্যা থেকে শব্দ",
    description: "যেকোনো সংখ্যাকে লেখা ফরাসি শব্দে রূপান্তর করুন — যেমন ১২৫০০০ হয়ে যায় \"cent vingt-cinq mille\"।",
    faq: [
      {
        question: "৮০-কে কেন \"quatre-vingts\" (চার-বিশ) লেখা হয়েছে?",
        answer: "স্ট্যান্ডার্ড ফরাসিতে সত্তর, আশি এবং নব্বইয়ের জন্য আলাদা কোনো শব্দ নেই — এগুলো ভিজেসিমাল (বেস-২০) পদ্ধতি থেকে তৈরি, যেমন quatre-vingts আক্ষরিক অর্থে \"চার-বিশ\"।",
      },
    ],
  },
  "english-number-to-words": {
    name: "ইংরেজি সংখ্যা থেকে শব্দ",
    description: "যেকোনো সংখ্যাকে লেখা ইংরেজি শব্দে রূপান্তর করুন — যেমন ১২৫০০০ হয়ে যায় \"one hundred twenty-five thousand\"।",
    faq: [
      {
        question: "এটা কি \"and\" ব্যবহার করে (যেমন \"one hundred and one\")?",
        answer: "না — এই টুল আমেরিকান রীতি অনুসরণ করে \"and\" বাদ দেয় (\"one hundred one\"), যা US-এর আইনি ও আর্থিক নথিতে প্রচলিত।",
      },
    ],
  },
  "basic-calculator": {
    name: "ক্যালকুলেটর",
    description: "রোজকার হিসাবের জন্য সাধারণ অন-স্ক্রিন ক্যালকুলেটর — যোগ, বিয়োগ, গুণ ও ভাগ।",
    faq: [],
  },
};

export const hiCalculatorTranslations: Record<string, CalculatorTranslationSeed> = {
  "bengali-number-to-words": {
    name: "बंगाली अंक से शब्द",
    description: "किसी भी संख्या को लिखित बंगाली शब्दों में बदलें — जैसे 125000 बन जाता है \"এক লাখ পঁচিশ হাজার\"।",
    faq: [
      {
        question: "क्या यह भारतीय संख्या पद्धति का उपयोग करता है?",
        answer:
          "हां — बंगाली में बड़ी संख्याओं को हज़ार, लाख (10^5) और करोड़ (10^7) में बांटा जाता है, अंतरराष्ट्रीय थाउज़ेंड/मिलियन/बिलियन पद्धति के बजाय — यह टूल उसी परंपरा का पालन करता है।",
      },
      {
        question: "क्या बांग्लादेश और पश्चिम बंगाल की बंगाली संख्याएं एक जैसी हैं?",
        answer: "हां — मूल अंकवाचक शब्द और हज़ार/लाख/करोड़ का बंटवारा बांग्लादेश और पश्चिम बंगाल, भारत दोनों जगह एक जैसा है।",
      },
    ],
  },
  "hindi-number-to-words": {
    name: "हिंदी अंक से शब्द",
    description: "किसी भी संख्या को लिखित हिंदी शब्दों में बदलें — जैसे 125000 बन जाता है \"एक लाख पच्चीस हज़ार\"।",
    faq: [
      {
        question: "क्या यह भारतीय संख्या पद्धति का उपयोग करता है?",
        answer:
          "हां — हिंदी में बड़ी संख्याओं को हज़ार, लाख (10^5) और करोड़ (10^7) में बांटा जाता है, अंतरराष्ट्रीय थाउज़ेंड/मिलियन/बिलियन पद्धति के बजाय — यह टूल उसी परंपरा का पालन करता है।",
      },
    ],
  },
  "bmi-calculator": {
    name: "BMI कैलकुलेटर",
    description: "ऊंचाई और वज़न से अपना बॉडी मास इंडेक्स (BMI) निकालें, मीट्रिक या इंपीरियल इकाइयों में, मानक WHO वज़न श्रेणी के साथ।",
    faq: [
      {
        question: "BMI श्रेणियों का क्या मतलब है?",
        answer:
          "18.5 से कम को कम वज़न, 18.5–24.9 को सामान्य वज़न, 25–29.9 को अधिक वज़न, और 30 या उससे ज़्यादा को मोटापा माना जाता है। ये विश्व स्वास्थ्य संगठन (WHO) के मानक वयस्क मानदंड हैं।",
      },
      {
        question: "क्या BMI का मतलब सबके लिए एक जैसा होता है?",
        answer:
          "बिल्कुल नहीं। BMI मांसपेशी और चर्बी में फ़र्क़ नहीं करता, इसलिए बहुत मांसल लोगों में यह शरीर की चर्बी को ज़्यादा दिखा सकता है, और मांसपेशी खो चुके बुज़ुर्गों में कम। WHO ने एशियाई आबादी के लिए थोड़े कम मानदंड भी प्रकाशित किए हैं (23 से अधिक वज़न, 27.5 से मोटापा), क्योंकि दक्षिण और पूर्वी एशिया की कई आबादियों में कम BMI पर ही स्वास्थ्य जोखिम बढ़ने लगता है — यह कैलकुलेटर अंतरराष्ट्रीय मानक मानदंड इस्तेमाल करता है, एशिया-विशिष्ट नहीं।",
      },
    ],
  },
  "urdu-number-to-words": {
    name: "उर्दू अंक से शब्द",
    description: "किसी भी संख्या को लिखित उर्दू शब्दों में बदलें — जैसे 125000 बन जाता है \"ایک لاکھ پچیس ہزار\"।",
    faq: [
      {
        question: "क्या यह भारतीय संख्या पद्धति का उपयोग करता है?",
        answer: "हां — उर्दू में भी हिंदी और बंगाली की तरह हज़ार, लाख (10^5), और करोड़ (10^7) में बांटा जाता है, अंतरराष्ट्रीय पद्धति के बजाय।",
      },
    ],
  },
  "arabic-number-to-words": {
    name: "अरबी अंक से शब्द",
    description: "किसी भी संख्या को लिखित अरबी शब्दों में बदलें — जैसे 125000 बन जाता है \"مئة خمسة وعشرون ألف\"।",
    faq: [
      {
        question: "क्या यह अंतरराष्ट्रीय संख्या पद्धति का उपयोग करता है?",
        answer: "हां — अरबी हज़ार, मिलियन, बिलियन में बांटती है, हिंदी/बंगाली की लाख-करोड़ पद्धति के बजाय। व्याकरणिक लिंग-सामंजस्य यहां सरल किया गया है।",
      },
    ],
  },
  "spanish-number-to-words": {
    name: "स्पेनिश अंक से शब्द",
    description: "किसी भी संख्या को लिखित स्पेनिश शब्दों में बदलें — जैसे 125000 बन जाता है \"ciento veinticinco mil\"।",
    faq: [
      {
        question: "क्या 1 बिलियन के लिए \"billón\" शब्द इस्तेमाल हुआ है?",
        answer: "नहीं — पारंपरिक स्पेनिश में billón का मतलब 10^12 होता है (अंग्रेज़ी का ट्रिलियन), इसलिए भ्रम से बचने के लिए 10^9 के लिए \"mil millones\" इस्तेमाल किया गया है।",
      },
    ],
  },
  "french-number-to-words": {
    name: "फ़्रेंच अंक से शब्द",
    description: "किसी भी संख्या को लिखित फ़्रेंच शब्दों में बदलें — जैसे 125000 बन जाता है \"cent vingt-cinq mille\"।",
    faq: [
      {
        question: "80 को \"quatre-vingts\" (चार-बीस) क्यों लिखा गया है?",
        answer: "मानक फ़्रेंच में सत्तर, अस्सी और नब्बे के लिए अलग शब्द नहीं हैं — ये बेस-20 पद्धति से बने हैं, जैसे quatre-vingts का शाब्दिक अर्थ \"चार-बीस\" है।",
      },
    ],
  },
  "english-number-to-words": {
    name: "अंग्रेज़ी अंक से शब्द",
    description: "किसी भी संख्या को लिखित अंग्रेज़ी शब्दों में बदलें — जैसे 125000 बन जाता है \"one hundred twenty-five thousand\"।",
    faq: [
      {
        question: "क्या यह \"and\" इस्तेमाल करता है (जैसे \"one hundred and one\")?",
        answer: "नहीं — यह टूल अमेरिकी परंपरा अपनाता है और \"and\" छोड़ देता है (\"one hundred one\"), जो US के कानूनी और वित्तीय दस्तावेज़ों में आम है।",
      },
    ],
  },
  "basic-calculator": {
    name: "कैलकुलेटर",
    description: "रोज़मर्रा के हिसाब-किताब के लिए सरल ऑन-स्क्रीन कैलकुलेटर — जोड़, घटाव, गुणा और भाग।",
    faq: [],
  },
};

export const urCalculatorTranslations: Record<string, CalculatorTranslationSeed> = {
  "bengali-number-to-words": {
    name: "بنگالی ہندسوں کو الفاظ میں",
    description: "کسی بھی عدد کو تحریری بنگالی الفاظ میں تبدیل کریں — مثلاً 125000 بن جاتا ہے \"এক লাখ পঁচিশ হাজার\"۔",
    faq: [
      {
        question: "کیا یہ بھارتی نمبر سسٹم استعمال کرتا ہے؟",
        answer:
          "جی ہاں — بنگالی میں بڑے اعداد کو ہزار، لاکھ (10^5) اور کروڑ (10^7) میں تقسیم کیا جاتا ہے، بین الاقوامی تھاؤزنڈ/ملین/بلین نظام کی بجائے — یہ ٹول اسی روایت کی پیروی کرتا ہے۔",
      },
      {
        question: "کیا بنگلہ دیش اور مغربی بنگال میں اعداد لکھنے کا طریقہ ایک جیسا ہے؟",
        answer: "جی ہاں — بنیادی عددی الفاظ اور ہزار/لاکھ/کروڑ کی تقسیم کا طریقہ بنگلہ دیش اور مغربی بنگال دونوں جگہ ایک جیسا ہے۔",
      },
    ],
  },
  "hindi-number-to-words": {
    name: "ہندی ہندسوں کو الفاظ میں",
    description: "کسی بھی عدد کو تحریری ہندی الفاظ میں تبدیل کریں — مثلاً 125000 بن جاتا ہے \"एक लाख पच्चीस हज़ार\"۔",
    faq: [
      {
        question: "کیا یہ بھارتی نمبر سسٹم استعمال کرتا ہے؟",
        answer:
          "جی ہاں — ہندی میں بڑے اعداد کو ہزار، لاکھ (10^5) اور کروڑ (10^7) میں تقسیم کیا جاتا ہے، بین الاقوامی تھاؤزنڈ/ملین/بلین نظام کی بجائے — یہ ٹول اسی روایت کی پیروی کرتا ہے۔",
      },
    ],
  },
  "bmi-calculator": {
    name: "بی ایم آئی کیلکولیٹر",
    description: "قد اور وزن سے اپنا باڈی ماس انڈیکس (BMI) نکالیں، میٹرک یا امپیریل اکائیوں میں، معیاری WHO وزن کیٹیگری کے ساتھ۔",
    faq: [
      {
        question: "BMI کیٹیگریز کا کیا مطلب ہے؟",
        answer:
          "18.5 سے کم کو کم وزن، 18.5–24.9 کو معمول کا وزن، 25–29.9 کو زیادہ وزن، اور 30 یا اس سے زیادہ کو موٹاپا شمار کیا جاتا ہے۔ یہ عالمی ادارہ صحت (WHO) کے معیاری بالغ افراد کے لیے حدود ہیں۔",
      },
      {
        question: "کیا BMI کا مطلب سب کے لیے ایک جیسا ہے؟",
        answer:
          "بالکل نہیں۔ BMI پٹھوں اور چربی میں فرق نہیں کرتا، اس لیے بہت زیادہ پٹھیلے افراد میں یہ جسمانی چربی کو زیادہ ظاہر کر سکتا ہے، اور پٹھے کھو چکے بزرگ افراد میں کم۔ WHO نے ایشیائی آبادی کے لیے قدرے کم حدود بھی شائع کی ہیں (23 سے زیادہ وزن، 27.5 سے موٹاپا)، کیونکہ جنوبی اور مشرقی ایشیا کی کئی آبادیوں میں کم BMI پر ہی صحت کا خطرہ بڑھ جاتا ہے — یہ کیلکولیٹر بین الاقوامی معیاری حدود استعمال کرتا ہے، ایشیا کے لیے مخصوص حدود نہیں۔",
      },
    ],
  },
  "urdu-number-to-words": {
    name: "اردو ہندسوں کو الفاظ میں",
    description: "کسی بھی عدد کو تحریری اردو الفاظ میں تبدیل کریں — مثلاً 125000 بن جاتا ہے \"ایک لاکھ پچیس ہزار\"۔",
    faq: [
      {
        question: "کیا یہ بھارتی نمبر سسٹم استعمال کرتا ہے؟",
        answer: "جی ہاں — اردو میں بھی ہندی اور بنگالی کی طرح ہزار، لاکھ (10^5)، اور کروڑ (10^7) میں تقسیم کیا جاتا ہے، بین الاقوامی نظام کی بجائے۔",
      },
    ],
  },
  "arabic-number-to-words": {
    name: "عربی ہندسوں کو الفاظ میں",
    description: "کسی بھی عدد کو تحریری عربی الفاظ میں تبدیل کریں — مثلاً 125000 بن جاتا ہے \"مئة خمسة وعشرون ألف\"۔",
    faq: [
      {
        question: "کیا یہ بین الاقوامی نمبر سسٹم استعمال کرتا ہے؟",
        answer: "جی ہاں — عربی ہزار، ملین، بلین میں تقسیم کرتی ہے، ہندی/بنگالی کے لاکھ کروڑ نظام کی بجائے۔ گرامر کی صنفی مطابقت کو یہاں سادہ رکھا گیا ہے۔",
      },
    ],
  },
  "spanish-number-to-words": {
    name: "ہسپانوی ہندسوں کو الفاظ میں",
    description: "کسی بھی عدد کو تحریری ہسپانوی الفاظ میں تبدیل کریں — مثلاً 125000 بن جاتا ہے \"ciento veinticinco mil\"۔",
    faq: [
      {
        question: "کیا 1 بلین کے لیے \"billón\" لفظ استعمال ہوا ہے؟",
        answer: "نہیں — روایتی ہسپانوی میں billón کا مطلب 10^12 ہے (انگریزی کا ٹریلین)، اس لیے مغالطے سے بچنے کے لیے 10^9 کے لیے \"mil millones\" استعمال کیا گیا ہے۔",
      },
    ],
  },
  "french-number-to-words": {
    name: "فرانسیسی ہندسوں کو الفاظ میں",
    description: "کسی بھی عدد کو تحریری فرانسیسی الفاظ میں تبدیل کریں — مثلاً 125000 بن جاتا ہے \"cent vingt-cinq mille\"۔",
    faq: [
      {
        question: "80 کو \"quatre-vingts\" (چار-بیس) کیوں لکھا گیا ہے؟",
        answer: "معیاری فرانسیسی میں ستر، اسی اور نوے کے لیے الگ الفاظ نہیں ہیں — یہ بیس-20 نظام سے بنے ہیں، جیسے quatre-vingts کا لفظی مطلب \"چار-بیس\" ہے۔",
      },
    ],
  },
  "english-number-to-words": {
    name: "انگریزی ہندسوں کو الفاظ میں",
    description: "کسی بھی عدد کو تحریری انگریزی الفاظ میں تبدیل کریں — مثلاً 125000 بن جاتا ہے \"one hundred twenty-five thousand\"۔",
    faq: [
      {
        question: "کیا یہ \"and\" استعمال کرتا ہے (مثلاً \"one hundred and one\")؟",
        answer: "نہیں — یہ ٹول امریکی روایت اپناتا ہے اور \"and\" چھوڑ دیتا ہے (\"one hundred one\")، جو US کے قانونی اور مالیاتی دستاویزات میں عام ہے۔",
      },
    ],
  },
  "basic-calculator": {
    name: "کیلکولیٹر",
    description: "روزمرہ حساب کتاب کے لیے سادہ آن اسکرین کیلکولیٹر — جمع، تفریق، ضرب اور تقسیم۔",
    faq: [],
  },
};

export const arCalculatorTranslations: Record<string, CalculatorTranslationSeed> = {
  "bengali-number-to-words": {
    name: "الأرقام البنغالية إلى كلمات",
    description: "حوّل أي رقم إلى كلمات بنغالية مكتوبة — على سبيل المثال يصبح 125000 \"এক লাখ পঁচিশ হাজার\".",
    faq: [
      {
        question: "هل يستخدم هذا نظام الأرقام الهندي؟",
        answer:
          "نعم — تُقسَّم الأعداد الكبيرة بالبنغالية إلى ألف ولاخ (10^5) وكرور (10^7) بدلا من نظام الألف/المليون/المليار الدولي، وتتبع هذه الأداة نفس التقليد.",
      },
      {
        question: "هل طريقة كتابة الأرقام في بنغلاديش والبنغال الغربية متماثلة؟",
        answer: "نعم — كلمات الأعداد الأساسية وتقسيم ألف/لاخ/كرور متطابقان في كل من بنغلاديش والبنغال الغربية.",
      },
    ],
  },
  "hindi-number-to-words": {
    name: "الأرقام الهندية إلى كلمات",
    description: "حوّل أي رقم إلى كلمات هندية مكتوبة — على سبيل المثال يصبح 125000 \"एक लाख पच्चीस हज़ार\".",
    faq: [
      {
        question: "هل يستخدم هذا نظام الأرقام الهندي؟",
        answer:
          "نعم — تُقسَّم الأعداد الكبيرة بالهندية إلى ألف ولاخ (10^5) وكرور (10^7) بدلا من نظام الألف/المليون/المليار الدولي، وتتبع هذه الأداة نفس التقليد.",
      },
    ],
  },
  "bmi-calculator": {
    name: "حاسبة مؤشر كتلة الجسم",
    description: "احسب مؤشر كتلة جسمك (BMI) من الطول والوزن، بالوحدات المترية أو الإمبريالية، وفق فئة الوزن المعيارية لمنظمة الصحة العالمية.",
    faq: [
      {
        question: "ماذا تعني فئات مؤشر كتلة الجسم؟",
        answer:
          "أقل من 18.5 يُصنَّف نقص وزن، 18.5–24.9 وزن طبيعي، 25–29.9 زيادة وزن، و30 فأكثر سمنة. هذه هي العتبات المعيارية للبالغين وفق منظمة الصحة العالمية.",
      },
      {
        question: "هل يعني مؤشر كتلة الجسم نفس الشيء للجميع؟",
        answer:
          "ليس تماما. لا يُميّز المؤشر بين العضلات والدهون، فقد يبالغ في تقدير دهون الجسم لدى الأشخاص شديدي العضلات، ويقلل من تقديرها لدى كبار السن الذين فقدوا كتلة عضلية. كما نشرت منظمة الصحة العالمية عتبات أقل لسكان آسيا (زيادة الوزن من 23، والسمنة من 27.5)، لأن خطر المشاكل الصحية يرتفع عند مؤشر أقل لدى كثير من سكان جنوب وشرق آسيا — تستخدم هذه الحاسبة العتبات الدولية المعيارية، وليست الخاصة بآسيا.",
      },
    ],
  },
  "urdu-number-to-words": {
    name: "الأرقام الأردية إلى كلمات",
    description: "حوّل أي رقم إلى كلمات أردية مكتوبة — على سبيل المثال يصبح 125000 \"ایک لاکھ پچیس ہزار\".",
    faq: [
      {
        question: "هل يستخدم هذا نظام الأرقام الهندي؟",
        answer: "نعم — تُقسَّم الأعداد بالأردية أيضا إلى ألف ولاخ (10^5) وكرور (10^7)، مثل الهندية والبنغالية، بدلا من النظام الدولي.",
      },
    ],
  },
  "arabic-number-to-words": {
    name: "الأرقام العربية إلى كلمات",
    description: "حوّل أي رقم إلى كلمات عربية مكتوبة — على سبيل المثال يصبح 125000 \"مئة خمسة وعشرون ألف\".",
    faq: [
      {
        question: "هل يستخدم هذا نظام الأرقام الدولي؟",
        answer: "نعم — تُقسَّم الأعداد بالعربية إلى ألف ومليون ومليار، بدلا من نظام اللاخ والكرور المستخدم في الهندية والبنغالية. تم تبسيط التوافق النحوي للجنس هنا.",
      },
    ],
  },
  "spanish-number-to-words": {
    name: "الأرقام الإسبانية إلى كلمات",
    description: "حوّل أي رقم إلى كلمات إسبانية مكتوبة — على سبيل المثال يصبح 125000 \"ciento veinticinco mil\".",
    faq: [
      {
        question: "هل تُستخدم كلمة \"billón\" للدلالة على المليار؟",
        answer: "لا — في الإسبانية التقليدية تعني billón تريليون (10^12)، لذا لتجنب اللبس استُخدمت \"mil millones\" للدلالة على المليار (10^9).",
      },
    ],
  },
  "french-number-to-words": {
    name: "الأرقام الفرنسية إلى كلمات",
    description: "حوّل أي رقم إلى كلمات فرنسية مكتوبة — على سبيل المثال يصبح 125000 \"cent vingt-cinq mille\".",
    faq: [
      {
        question: "لماذا يُكتب 80 كـ \"quatre-vingts\" (أربعة-عشرون)؟",
        answer: "لا تملك الفرنسية المعيارية كلمة مفردة للسبعين والثمانين والتسعين — بل تُبنى من نظام العد الأساس-20، فـ quatre-vingts تعني حرفيا \"أربعة-عشرون\".",
      },
    ],
  },
  "english-number-to-words": {
    name: "الأرقام الإنجليزية إلى كلمات",
    description: "حوّل أي رقم إلى كلمات إنجليزية مكتوبة — على سبيل المثال يصبح 125000 \"one hundred twenty-five thousand\".",
    faq: [
      {
        question: "هل تُستخدم \"and\" (مثل \"one hundred and one\")؟",
        answer: "لا — تتبع هذه الأداة العرف الأمريكي بحذف \"and\" (\"one hundred one\")، الشائع في المستندات القانونية والمالية الأمريكية.",
      },
    ],
  },
  "basic-calculator": {
    name: "آلة حاسبة",
    description: "آلة حاسبة بسيطة على الشاشة للحساب اليومي — الجمع والطرح والضرب والقسمة.",
    faq: [],
  },
};

export const esCalculatorTranslations: Record<string, CalculatorTranslationSeed> = {
  "bengali-number-to-words": {
    name: "Números a Palabras (Bengalí)",
    description: "Convierte cualquier número en palabras bengalíes escritas — por ejemplo, 125000 se convierte en \"এক লাখ পঁচিশ হাজার\".",
    faq: [
      {
        question: "¿Usa el sistema numérico indio?",
        answer:
          "Sí — en bengalí, los números grandes se dividen en millar, lakh (10^5) y crore (10^7), en lugar del sistema internacional de mil/millón/billón — esta herramienta sigue esa misma convención.",
      },
      {
        question: "¿La forma de escribir los números es igual en Bangladés y Bengala Occidental?",
        answer: "Sí — las palabras numéricas básicas y la división en millar/lakh/crore son las mismas tanto en Bangladés como en Bengala Occidental.",
      },
    ],
  },
  "hindi-number-to-words": {
    name: "Números a Palabras (Hindi)",
    description: "Convierte cualquier número en palabras hindi escritas — por ejemplo, 125000 se convierte en \"एक लाख पच्चीस हज़ार\".",
    faq: [
      {
        question: "¿Usa el sistema numérico indio?",
        answer:
          "Sí — en hindi, los números grandes se dividen en millar, lakh (10^5) y crore (10^7), en lugar del sistema internacional de mil/millón/billón — esta herramienta sigue esa misma convención.",
      },
    ],
  },
  "bmi-calculator": {
    name: "Calculadora de IMC",
    description: "Calcula tu índice de masa corporal (IMC) a partir de tu altura y peso, en unidades métricas o imperiales, según las categorías de peso estándar de la OMS.",
    faq: [
      {
        question: "¿Qué significan las categorías de IMC?",
        answer:
          "Por debajo de 18.5 se considera bajo peso, 18.5–24.9 peso normal, 25–29.9 sobrepeso, y 30 o más obesidad. Estos son los umbrales estándar para adultos según la Organización Mundial de la Salud (OMS).",
      },
      {
        question: "¿El IMC significa lo mismo para todos?",
        answer:
          "No exactamente. El IMC no distingue entre músculo y grasa, por lo que puede sobreestimar la grasa corporal en personas muy musculosas y subestimarla en personas mayores que han perdido masa muscular. La OMS también ha publicado umbrales más bajos para poblaciones asiáticas (sobrepeso desde 23, obesidad desde 27.5), ya que en muchas poblaciones del sur y este de Asia los riesgos para la salud aumentan con un IMC más bajo — esta calculadora usa los umbrales internacionales estándar, no los específicos para Asia.",
      },
    ],
  },
  "urdu-number-to-words": {
    name: "Números a Palabras (Urdu)",
    description: "Convierte cualquier número en palabras urdu escritas — por ejemplo, 125000 se convierte en \"ایک لاکھ پچیس ہزار\".",
    faq: [
      {
        question: "¿Usa el sistema numérico indio?",
        answer: "Sí — el urdu también divide los números grandes en millar, lakh (10^5) y crore (10^7), igual que el hindi y el bengalí, en lugar del sistema internacional.",
      },
    ],
  },
  "arabic-number-to-words": {
    name: "Números a Palabras (Árabe)",
    description: "Convierte cualquier número en palabras árabes escritas — por ejemplo, 125000 se convierte en \"مئة خمسة وعشرون ألف\".",
    faq: [
      {
        question: "¿Usa el sistema numérico internacional?",
        answer: "Sí — el árabe divide los números grandes en millar, millón y millardo, no en el sistema lakh/crore del hindi y el bengalí. La concordancia gramatical de género se simplifica aquí.",
      },
    ],
  },
  "spanish-number-to-words": {
    name: "Números a Palabras (Español)",
    description: "Convierte cualquier número en palabras españolas escritas — por ejemplo, 125000 se convierte en \"ciento veinticinco mil\".",
    faq: [
      {
        question: "¿Por qué no usa \"billón\" para mil millones?",
        answer: "Porque en español tradicional, billón significa 10^12 (lo que en inglés es \"trillion\"), así que para evitar la ambigüedad se usa \"mil millones\" para 10^9.",
      },
    ],
  },
  "french-number-to-words": {
    name: "Números a Palabras (Francés)",
    description: "Convierte cualquier número en palabras francesas escritas — por ejemplo, 125000 se convierte en \"cent vingt-cinq mille\".",
    faq: [
      {
        question: "¿Por qué se escribe 80 como \"quatre-vingts\" (cuatro-veintes)?",
        answer: "El francés estándar no tiene una palabra única para setenta, ochenta o noventa — se construyen con un sistema de base 20, así que quatre-vingts significa literalmente \"cuatro veintes\".",
      },
    ],
  },
  "english-number-to-words": {
    name: "Números a Palabras (Inglés)",
    description: "Convierte cualquier número en palabras inglesas escritas — por ejemplo, 125000 se convierte en \"one hundred twenty-five thousand\".",
    faq: [
      {
        question: "¿Incluye \"and\" (p. ej. \"one hundred and one\")?",
        answer: "No — esta herramienta sigue la convención estadounidense de omitir \"and\" (\"one hundred one\"), estándar en documentos legales y financieros de EE. UU.",
      },
    ],
  },
  "basic-calculator": {
    name: "Calculadora",
    description: "Una calculadora sencilla en pantalla para cálculos cotidianos — suma, resta, multiplicación y división.",
    faq: [],
  },
};

export const frCalculatorTranslations: Record<string, CalculatorTranslationSeed> = {
  "bengali-number-to-words": {
    name: "Nombres en Lettres (Bengali)",
    description: "Convertissez n'importe quel nombre en mots bengalis écrits — par exemple, 125000 devient \"এক লাখ পঁচিশ হাজার\".",
    faq: [
      {
        question: "Utilise-t-il le système numérique indien ?",
        answer:
          "Oui — en bengali, les grands nombres sont divisés en millier, lakh (10^5) et crore (10^7), plutôt que le système international mille/million/milliard — cet outil suit cette même convention.",
      },
      {
        question: "La façon d'écrire les nombres est-elle la même au Bangladesh et au Bengale-Occidental ?",
        answer: "Oui — les mots numériques de base et la division en millier/lakh/crore sont identiques au Bangladesh comme au Bengale-Occidental.",
      },
    ],
  },
  "hindi-number-to-words": {
    name: "Nombres en Lettres (Hindi)",
    description: "Convertissez n'importe quel nombre en mots hindis écrits — par exemple, 125000 devient \"एक लाख पच्चीस हज़ार\".",
    faq: [
      {
        question: "Utilise-t-il le système numérique indien ?",
        answer:
          "Oui — en hindi, les grands nombres sont divisés en millier, lakh (10^5) et crore (10^7), plutôt que le système international mille/million/milliard — cet outil suit cette même convention.",
      },
    ],
  },
  "bmi-calculator": {
    name: "Calculateur d'IMC",
    description: "Calculez votre indice de masse corporelle (IMC) à partir de votre taille et de votre poids, en unités métriques ou impériales, selon les catégories de poids standard de l'OMS.",
    faq: [
      {
        question: "Que signifient les catégories d'IMC ?",
        answer:
          "En dessous de 18,5, on parle d'insuffisance pondérale ; 18,5–24,9 poids normal ; 25–29,9 surpoids ; et 30 ou plus, obésité. Ce sont les seuils standard pour adultes selon l'Organisation mondiale de la santé (OMS).",
      },
      {
        question: "L'IMC signifie-t-il la même chose pour tout le monde ?",
        answer:
          "Pas tout à fait. L'IMC ne distingue pas le muscle de la graisse : il peut donc surestimer la masse grasse chez les personnes très musclées, et la sous-estimer chez les personnes âgées ayant perdu de la masse musculaire. L'OMS a également publié des seuils plus bas pour les populations asiatiques (surpoids dès 23, obésité dès 27,5), car dans de nombreuses populations d'Asie du Sud et de l'Est, les risques pour la santé augmentent dès un IMC plus faible — ce calculateur utilise les seuils internationaux standard, et non ceux spécifiques à l'Asie.",
      },
    ],
  },
  "urdu-number-to-words": {
    name: "Nombres en Lettres (Ourdou)",
    description: "Convertissez n'importe quel nombre en mots ourdous écrits — par exemple, 125000 devient \"ایک لاکھ پچیس ہزار\".",
    faq: [
      {
        question: "Utilise-t-il le système numérique indien ?",
        answer: "Oui — l'ourdou divise aussi les grands nombres en millier, lakh (10^5) et crore (10^7), comme le hindi et le bengali, plutôt que le système international.",
      },
    ],
  },
  "arabic-number-to-words": {
    name: "Nombres en Lettres (Arabe)",
    description: "Convertissez n'importe quel nombre en mots arabes écrits — par exemple, 125000 devient \"مئة خمسة وعشرون ألف\".",
    faq: [
      {
        question: "Utilise-t-il le système numérique international ?",
        answer: "Oui — l'arabe divise les grands nombres en millier, million et milliard, et non le système lakh/crore du hindi et du bengali. L'accord grammatical de genre est simplifié ici.",
      },
    ],
  },
  "spanish-number-to-words": {
    name: "Nombres en Lettres (Espagnol)",
    description: "Convertissez n'importe quel nombre en mots espagnols écrits — par exemple, 125000 devient \"ciento veinticinco mil\".",
    faq: [
      {
        question: "Pourquoi \"billón\" n'est-il pas utilisé pour un milliard ?",
        answer: "Parce qu'en espagnol traditionnel, billón signifie 10^12 (ce que l'anglais appelle \"trillion\") — pour éviter cette ambiguïté, \"mil millones\" est utilisé pour 10^9.",
      },
    ],
  },
  "french-number-to-words": {
    name: "Nombres en Lettres (Français)",
    description: "Convertissez n'importe quel nombre en mots français écrits — par exemple, 125000 devient \"cent vingt-cinq mille\".",
    faq: [
      {
        question: "Pourquoi 80 s'écrit-il \"quatre-vingts\" ?",
        answer: "Le français standard n'a pas de mot unique pour soixante-dix, quatre-vingts ou quatre-vingt-dix — ils viennent d'un système de base 20 hérité du gaulois, encore visible dans ces formes composées.",
      },
    ],
  },
  "english-number-to-words": {
    name: "Nombres en Lettres (Anglais)",
    description: "Convertissez n'importe quel nombre en mots anglais écrits — par exemple, 125000 devient \"one hundred twenty-five thousand\".",
    faq: [
      {
        question: "Inclut-il \"and\" (ex. \"one hundred and one\") ?",
        answer: "Non — cet outil suit la convention américaine qui omet \"and\" (\"one hundred one\"), standard sur les documents juridiques et financiers américains.",
      },
    ],
  },
  "basic-calculator": {
    name: "Calculatrice",
    description: "Une calculatrice simple à l'écran pour les calculs du quotidien — addition, soustraction, multiplication et division.",
    faq: [],
  },
};
