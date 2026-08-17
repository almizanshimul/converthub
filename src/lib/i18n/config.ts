export const locales = ["en", "bn", "hi", "ur", "ar", "es", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeMeta: Record<Locale, { label: string; nativeLabel: string; dir: "ltr" | "rtl"; flagCountry: string }> = {
  en: { label: "English", nativeLabel: "English", dir: "ltr", flagCountry: "gb" },
  bn: { label: "Bengali", nativeLabel: "বাংলা", dir: "ltr", flagCountry: "bd" },
  hi: { label: "Hindi", nativeLabel: "हिन्दी", dir: "ltr", flagCountry: "in" },
  ur: { label: "Urdu", nativeLabel: "اردو", dir: "rtl", flagCountry: "pk" },
  // Arabic is spoken across many countries this site has (UAE, Saudi
  // Arabia) — Saudi Arabia's flag is used since "ar-SA" is the most
  // common default regional tag for unqualified "Arabic" in software.
  ar: { label: "Arabic", nativeLabel: "العربية", dir: "rtl", flagCountry: "sa" },
  es: { label: "Spanish", nativeLabel: "Español", dir: "ltr", flagCountry: "es" },
  fr: { label: "French", nativeLabel: "Français", dir: "ltr", flagCountry: "fr" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
