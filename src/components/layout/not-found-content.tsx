"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, defaultLocale } from "@/lib/i18n/config";

// not-found.tsx receives no props (no params) in the App Router, so the
// locale has to come from the URL client-side rather than a route param.
export function NotFoundContent() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1];
  const locale = isLocale(segment) ? segment : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">{dict.pages.notFound.title}</h1>
      <p className="mt-3 text-muted-foreground">{dict.pages.notFound.message}</p>
      <Link
        href={`/${locale}`}
        className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        {dict.error.goHome}
      </Link>
    </div>
  );
}
