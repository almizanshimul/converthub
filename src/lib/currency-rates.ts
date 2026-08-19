/**
 * Fetches live rates and upserts Currency + ExchangeRate rows. Used by
 * scripts/fetch-currency-rates.ts — with the site statically exported, this
 * is the only way rates get updated: run it locally, then rebuild and
 * upload, same as any other content change.
 */
import currencyCodes from "currency-codes";
import symbolMap from "currency-symbol-map";
import { prisma } from "./prisma";

const API_KEY = process.env.EXCHANGERATE_API_KEY;
const RATES_URL = API_KEY ? `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD` : "https://open.er-api.com/v6/latest/USD";
const SOURCE_NAME = API_KEY ? "exchangerate-api.com" : "exchangerate-api.com (open access)";
const SOURCE_URL = "https://www.exchangerate-api.com";

// The keyed v6 endpoint calls the rates object "conversion_rates"; the free
// keyless endpoint calls the same shape "rates". Normalized below.
interface RatesResponse {
  result: string;
  "error-type"?: string;
  base_code: string;
  time_last_update_utc: string;
  rates?: Record<string, number>;
  conversion_rates?: Record<string, number>;
}

export interface FetchRatesStats {
  endpoint: "keyed (v6)" | "keyless (open, no API key set)";
  created: number;
  updated: number;
  preserved: number;
  skipped: number;
  providerTimestamp: string;
}

export async function fetchAndStoreRates(): Promise<FetchRatesStats> {
  const res = await fetch(RATES_URL);
  if (!res.ok) throw new Error(`Failed to fetch rates (${res.status}): ${await res.text()}`);
  const data = (await res.json()) as RatesResponse;
  if (data.result !== "success" || data.base_code !== "USD") {
    throw new Error(`Unexpected API response (${data["error-type"] ?? "unknown error"}): ${JSON.stringify(data).slice(0, 300)}`);
  }
  const rates = data.rates ?? data.conversion_rates;
  if (!rates) throw new Error(`API response had neither "rates" nor "conversion_rates": ${JSON.stringify(data).slice(0, 300)}`);

  const countries = await prisma.country.findMany({ select: { id: true, currencyCode: true } });
  const countryIdByCurrency = new Map(countries.filter((c) => c.currencyCode).map((c) => [c.currencyCode as string, c.id]));

  const base = await prisma.currency.upsert({
    where: { code: "USD" },
    update: { name: "US Dollar", symbol: "$" },
    create: { code: "USD", name: "US Dollar", symbol: "$", countryId: countryIdByCurrency.get("USD") },
  });

  let created = 0;
  let updated = 0;
  let preserved = 0;
  let skipped = 0;

  for (const [code, rate] of Object.entries(rates)) {
    if (code === "USD") continue;
    const info = currencyCodes.code(code);
    if (!info) {
      skipped++;
      continue;
    }

    const currency = await prisma.currency.upsert({
      where: { code },
      update: { name: info.currency, symbol: symbolMap(code) ?? code },
      create: { code, name: info.currency, symbol: symbolMap(code) ?? code, countryId: countryIdByCurrency.get(code) },
    });

    const existing = await prisma.exchangeRate.findUnique({
      where: { baseCurrencyId_targetCurrencyId: { baseCurrencyId: base.id, targetCurrencyId: currency.id } },
    });

    if (existing?.isManualOverride) {
      preserved++;
      continue;
    }

    await prisma.exchangeRate.upsert({
      where: { baseCurrencyId_targetCurrencyId: { baseCurrencyId: base.id, targetCurrencyId: currency.id } },
      update: { rate, source: SOURCE_NAME, sourceUrl: SOURCE_URL, fetchedAt: new Date() },
      create: { baseCurrencyId: base.id, targetCurrencyId: currency.id, rate, source: SOURCE_NAME, sourceUrl: SOURCE_URL },
    });

    if (existing) updated++;
    else created++;
  }

  return {
    endpoint: API_KEY ? "keyed (v6)" : "keyless (open, no API key set)",
    created,
    updated,
    preserved,
    skipped,
    providerTimestamp: data.time_last_update_utc,
  };
}

