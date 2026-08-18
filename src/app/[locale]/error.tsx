"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, defaultLocale } from "@/lib/i18n/config";

export default function LocaleError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const pathname = usePathname();
  const segment = pathname.split("/")[1];
  const locale = isLocale(segment) ? segment : defaultLocale;
  const dict = getDictionary(locale);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">{dict.error.title}</h1>
      <p className="mt-3 text-muted-foreground">{dict.error.message}</p>
      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          {dict.error.retry}
        </button>
        <Link href={`/${locale}`} className="text-sm font-medium text-muted-foreground hover:text-foreground">
          {dict.error.goHome}
        </Link>
      </div>
    </div>
  );
}
