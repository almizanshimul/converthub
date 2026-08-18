import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { getDictionary } from "@/lib/i18n/dictionary";
import { defaultLocale } from "@/lib/i18n/config";

// Root-level fallback — catches URLs that don't even match a valid [locale]
// segment (e.g. /xyz/...), so there's no real locale to render in. Defaults
// to English rather than leaving the visitor with zero navigation.
export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function RootNotFound() {
  const dict = getDictionary(defaultLocale);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader locale={defaultLocale} dict={dict} />
      <main className="flex-1">
        <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center sm:px-6">
          <h1 className="text-2xl font-bold tracking-tight">{dict.pages.notFound.title}</h1>
          <p className="mt-3 text-muted-foreground">{dict.pages.notFound.message}</p>
          <Link
            href={`/${defaultLocale}`}
            className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            {dict.error.goHome}
          </Link>
        </div>
      </main>
      <SiteFooter locale={defaultLocale} />
    </div>
  );
}
