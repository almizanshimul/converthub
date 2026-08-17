"use client";

import { useEffect } from "react";
import { localeMeta, type Locale } from "@/lib/i18n/config";

/** Syncs <html lang>/dir to the active locale without forcing the root layout to render dynamically. */
export function LocaleHtmlAttrs({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeMeta[locale].dir;
  }, [locale]);

  return null;
}
