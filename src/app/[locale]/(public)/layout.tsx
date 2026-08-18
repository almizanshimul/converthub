import { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { CookieConsentBanner } from "@/components/consent/cookie-consent-banner";
import { TrackingScripts } from "@/components/consent/tracking-scripts";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

export default async function PublicLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TrackingScripts />
      <SiteHeader locale={locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} />
      <CookieConsentBanner locale={locale} dict={dict} />
    </div>
  );
}
