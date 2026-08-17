import type { Locale } from "./config";

/**
 * Every translatable model (Country, Region, ConverterCategory, Converter,
 * Calculator) follows the same shape: a base English row plus a
 * `translations` list holding per-language overrides. Fetch translations
 * pre-filtered to the active locale (`translationInclude(locale)`), then
 * overlay them onto the base row with `localize()`. Missing or blank
 * translated fields fall back to the base (English) value automatically —
 * this is intentional: a converter with no Bengali translation yet should
 * still render in English rather than show blank text.
 */
export function translationInclude(locale: Locale) {
  return { where: { language: { code: locale } }, take: 1 } as const;
}

type TranslationRow<T> = { readonly [K in keyof T]?: T[K] | null };

export function localize<T extends Record<string, unknown>>(
  base: T,
  translations: ReadonlyArray<TranslationRow<T>> | null | undefined,
): T {
  const translation = translations?.[0];
  if (!translation) return base;

  const merged = { ...base };
  for (const key of Object.keys(translation) as (keyof T)[]) {
    const value = translation[key];
    if (value !== null && value !== undefined && value !== "") {
      merged[key] = value as T[keyof T];
    }
  }
  return merged;
}
