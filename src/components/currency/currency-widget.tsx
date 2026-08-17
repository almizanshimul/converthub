"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { convertCurrency, type CurrencyOption } from "@/lib/currency";
import { CurrencyConversionTable } from "@/components/currency/currency-conversion-table";

interface CurrencyWidgetLabels {
  from: string;
  to: string;
  swap: string;
  amount: string;
}

export function CurrencyWidget({
  currencies,
  initialFromCode,
  initialToCode,
  labels,
  tableTitle,
}: {
  currencies: CurrencyOption[];
  initialFromCode: string;
  initialToCode: string;
  labels: CurrencyWidgetLabels;
  tableTitle: string;
}) {
  const [fromCode, setFromCode] = useState(initialFromCode);
  const [toCode, setToCode] = useState(initialToCode);
  const [amount, setAmount] = useState("1");

  const fromCurrency = currencies.find((c) => c.code === fromCode);
  const toCurrency = currencies.find((c) => c.code === toCode);

  const result = useMemo(() => {
    const value = Number(amount);
    if (amount.trim() === "" || Number.isNaN(value) || !fromCurrency || !toCurrency) return "";
    return convertCurrency(value, fromCurrency, toCurrency).toLocaleString("en-US", { maximumFractionDigits: 4 });
  }, [amount, fromCurrency, toCurrency]);

  const rateLine = useMemo(() => {
    if (!fromCurrency || !toCurrency) return "";
    const oneUnit = convertCurrency(1, fromCurrency, toCurrency);
    return `1 ${fromCurrency.code} = ${oneUnit.toLocaleString("en-US", { maximumFractionDigits: 4 })} ${toCurrency.code}`;
  }, [fromCurrency, toCurrency]);

  function handleSwap() {
    setFromCode(toCode);
    setToCode(fromCode);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <div>
          <label className="mb-1 block text-sm font-medium text-muted-foreground">{labels.amount}</label>
          <Input
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mb-2 text-lg font-semibold"
            aria-label={labels.amount}
          />
          <Select value={fromCode} onChange={(e) => setFromCode(e.target.value)} aria-label={labels.from}>
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name} ({c.symbol})
              </option>
            ))}
          </Select>
        </div>

        <Button variant="secondary" onClick={handleSwap} aria-label={labels.swap} className="mb-0.5 justify-self-center">
          <ArrowLeftRight className="h-4 w-4" />
        </Button>

        <div>
          <label className="mb-1 block text-sm font-medium text-muted-foreground">{labels.to}</label>
          <div className="mb-2 flex h-[42px] items-center rounded-md border border-input bg-muted px-3 text-lg font-semibold">
            {result || "—"}
          </div>
          <Select value={toCode} onChange={(e) => setToCode(e.target.value)} aria-label={labels.to}>
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name} ({c.symbol})
              </option>
            ))}
          </Select>
        </div>
      </div>

      {rateLine && (
        <p dir="ltr" className="mt-4 text-start text-sm text-muted-foreground">
          {rateLine}
        </p>
      )}

      {fromCurrency && toCurrency && fromCode !== toCode && (
        <div className="mt-6">
          <CurrencyConversionTable from={fromCurrency} to={toCurrency} title={tableTitle} />
        </div>
      )}
    </div>
  );
}
