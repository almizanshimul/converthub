export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  /** Units of this currency per 1 USD (USD itself is always 1). */
  rate: number;
}

/** Currencies shown first in the picker, ahead of the alphabetical rest. */
export const FEATURED_CURRENCY_CODES = ["USD", "EUR", "GBP", "INR", "BDT", "PKR", "NPR", "SAR", "AED", "CAD", "AUD"];

export function sortCurrencyOptions(options: CurrencyOption[]): CurrencyOption[] {
  const featuredIndex = new Map(FEATURED_CURRENCY_CODES.map((code, i) => [code, i]));
  return [...options].sort((a, b) => {
    const fa = featuredIndex.get(a.code);
    const fb = featuredIndex.get(b.code);
    if (fa !== undefined && fb !== undefined) return fa - fb;
    if (fa !== undefined) return -1;
    if (fb !== undefined) return 1;
    return a.code.localeCompare(b.code);
  });
}

/** Converts via the shared USD base rate: amount -> USD -> target. */
export function convertCurrency(amount: number, from: CurrencyOption, to: CurrencyOption): number {
  if (!Number.isFinite(amount)) return NaN;
  const usd = amount / from.rate;
  return usd * to.rate;
}
