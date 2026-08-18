import type { Metadata } from "next";
import { locales, defaultLocale, type Locale } from "@/lib/i18n/config";

// Every locale variant of a page self-canonicalizes to its own URL (not a single
// shared canonical) — that's what lets `languages` below actually take effect.
// Pointing every variant at one canonical tells Google to fold them into a
// single indexed page and ignore the hreflang alternates entirely.
export function localeAlternates(locale: Locale, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [l, `/${l}${path}`]));
  languages["x-default"] = `/${defaultLocale}${path}`;
  return {
    canonical: `/${locale}${path}`,
    languages,
  };
}
