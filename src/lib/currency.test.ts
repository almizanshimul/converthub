import { describe, expect, it } from "vitest";
import { convertCurrency, sortCurrencyOptions, type CurrencyOption } from "./currency";

const USD: CurrencyOption = { code: "USD", name: "US Dollar", symbol: "$", rate: 1 };
const EUR: CurrencyOption = { code: "EUR", name: "Euro", symbol: "€", rate: 0.92 };
const BDT: CurrencyOption = { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", rate: 110 };
const ZWL: CurrencyOption = { code: "ZWL", name: "Zimbabwean Dollar", symbol: "Z$", rate: 322 };
const AAA: CurrencyOption = { code: "AAA", name: "Made-up", symbol: "A", rate: 5 };

describe("convertCurrency", () => {
  it("converts through the shared USD base rate", () => {
    // 100 EUR -> USD -> BDT
    expect(convertCurrency(100, EUR, BDT)).toBeCloseTo((100 / 0.92) * 110, 5);
  });

  it("is the identity when converting a currency to itself", () => {
    expect(convertCurrency(50, EUR, EUR)).toBeCloseTo(50, 10);
  });

  it("propagates non-finite input as NaN", () => {
    expect(convertCurrency(NaN, USD, EUR)).toBeNaN();
  });
});

describe("sortCurrencyOptions", () => {
  it("puts featured currencies first, in FEATURED_CURRENCY_CODES order", () => {
    const sorted = sortCurrencyOptions([ZWL, BDT, EUR, USD]);
    expect(sorted.map((c) => c.code)).toEqual(["USD", "EUR", "BDT", "ZWL"]);
  });

  it("alphabetizes non-featured currencies after all featured ones", () => {
    const sorted = sortCurrencyOptions([ZWL, AAA, USD]);
    expect(sorted.map((c) => c.code)).toEqual(["USD", "AAA", "ZWL"]);
  });

  it("does not mutate the input array", () => {
    const input = [ZWL, USD];
    sortCurrencyOptions(input);
    expect(input).toEqual([ZWL, USD]);
  });
});
