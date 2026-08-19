import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CurrencyWidget } from "@/components/currency/currency-widget";
import { ShareButton } from "@/components/share/share-button";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionary";
import { sortCurrencyOptions, convertCurrency, type CurrencyOption } from "@/lib/currency";
import { localeAlternates } from "@/lib/seo/alternates";
import { breadcrumbSchema } from "@/lib/seo/schema";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  return { title: dict.currency.pageTitle, description: dict.currency.pageSubtitle, alternates: localeAlternates(locale, "/currency") };
}

const DATE_LOCALE: Record<Locale, string> = { en: "en-US", bn: "bn-BD" };

export default async function CurrencyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

  // Static export has no server to refresh rates on request — this page is a
  // snapshot of whatever's in the database at build time. Run
  // `npm run currency:fetch` before each build to keep it current.
  const [usd, targets] = await Promise.all([
    prisma.currency.findUnique({ where: { code: "USD" } }),
    prisma.currency.findMany({
      where: { isActive: true },
      include: { ratesAsTarget: { where: { baseCurrency: { code: "USD" } }, take: 1 } },
    }),
  ]);

  const currencies: CurrencyOption[] = usd
    ? [
        { code: usd.code, name: usd.name, symbol: usd.symbol, rate: 1 },
        ...targets
          .filter((c) => c.code !== "USD" && c.ratesAsTarget[0])
          .map((c) => ({ code: c.code, name: c.name, symbol: c.symbol, rate: Number(c.ratesAsTarget[0].rate) })),
      ]
    : [];
  const sorted = sortCurrencyOptions(currencies);

  const latestRate = targets.find((c) => c.ratesAsTarget[0])?.ratesAsTarget[0];
  const asOfDate = latestRate?.fetchedAt.toLocaleDateString(DATE_LOCALE[locale], { year: "numeric", month: "long", day: "numeric" });

  // No searchParams here — static export prerenders this page once, so a
  // `?from=EUR&to=USD` deep link is read client-side instead (see
  // CurrencyWidget's useSearchParams call) rather than server-side.
  const initialFromCode = "USD";
  const fallbackTo = sorted.find((c) => c.code === "EUR") ?? sorted[1] ?? sorted[0];
  const initialToCode = fallbackTo?.code ?? initialFromCode;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={breadcrumbSchema([{ label: dict.home, href: `/${locale}` }, { label: dict.currency.navLabel }])} />
      <Breadcrumb locale={locale} items={[{ label: dict.home, href: `/${locale}` }, { label: dict.currency.navLabel }]} />
      <div className="mt-4 flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{dict.currency.pageTitle}</h1>
        {(() => {
          const from = sorted.find((c) => c.code === initialFromCode);
          const to = sorted.find((c) => c.code === initialToCode);
          const shareText = from && to ? `1 ${from.code} = ${convertCurrency(1, from, to).toFixed(4)} ${to.code}` : undefined;
          return <ShareButton title={dict.currency.pageTitle} url={`/${locale}/currency`} text={shareText} labels={dict.share} />;
        })()}
      </div>
      <p className="mt-2 max-w-2xl text-muted-foreground">{dict.currency.pageSubtitle}</p>

      {sorted.length >= 2 ? (
        <>
          <div className="mt-6">
            <Suspense fallback={null}>
              <CurrencyWidget
                currencies={sorted}
                initialFromCode={initialFromCode}
                initialToCode={initialToCode}
                labels={{ from: dict.widget.from, to: dict.widget.to, swap: dict.widget.swap, amount: dict.currency.amount }}
                tableTitle={dict.section.conversionTable}
              />
            </Suspense>
          </div>

          <div className="mt-6">
            <AdSlot slot="currency-below-widget" />
          </div>

          {asOfDate && latestRate && (
            <div className="mt-6 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
              <p>{dict.currency.asOf.replace("{date}", asOfDate)}</p>
              <p className="mt-1">
                {dict.currency.sourceLabel}:{" "}
                {latestRate.sourceUrl ? (
                  <a
                    href={latestRate.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-primary hover:underline"
                  >
                    {latestRate.source}
                  </a>
                ) : (
                  latestRate.source
                )}
              </p>
              <p className="mt-2">{dict.currency.disclaimer}</p>
            </div>
          )}
        </>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
          {dict.content.currencyNoRatesYet}
        </p>
      )}
    </div>
  );
}
