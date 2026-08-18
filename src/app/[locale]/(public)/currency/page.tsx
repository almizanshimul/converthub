import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CurrencyWidget } from "@/components/currency/currency-widget";
import { ShareButton } from "@/components/share/share-button";
import { AdSlot } from "@/components/ads/ad-slot";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionary";
import { sortCurrencyOptions, convertCurrency, type CurrencyOption } from "@/lib/currency";
import { localeAlternates } from "@/lib/seo/alternates";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  return { title: dict.currency.pageTitle, description: dict.currency.pageSubtitle, alternates: localeAlternates(locale, "/currency") };
}

const DATE_LOCALE: Record<Locale, string> = { en: "en-US", bn: "bn-BD", hi: "hi-IN", ur: "ur-PK", ar: "ar-SA", es: "es-ES", fr: "fr-FR" };

export default async function CurrencyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const { from: fromParam, to: toParam } = await searchParams;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

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

  const codes = new Set(sorted.map((c) => c.code));
  const initialFromCode = fromParam && codes.has(fromParam.toUpperCase()) ? fromParam.toUpperCase() : "USD";
  const fallbackTo = sorted.find((c) => c.code === "EUR") ?? sorted[1] ?? sorted[0];
  const initialToCode =
    toParam && codes.has(toParam.toUpperCase()) && toParam.toUpperCase() !== initialFromCode
      ? toParam.toUpperCase()
      : (fallbackTo?.code ?? initialFromCode);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: dict.home, href: `/${locale}` }, { label: dict.currency.navLabel }]} />
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
            <CurrencyWidget
              currencies={sorted}
              initialFromCode={initialFromCode}
              initialToCode={initialToCode}
              labels={{ from: dict.widget.from, to: dict.widget.to, swap: dict.widget.swap, amount: dict.currency.amount }}
              tableTitle={dict.section.conversionTable}
            />
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
          No exchange rate data yet — run <code>npm run currency:fetch</code>.
        </p>
      )}
    </div>
  );
}
