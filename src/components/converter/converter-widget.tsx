"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { convert, formatResult } from "@/lib/converters/engine";
import type { Locale } from "@/lib/i18n/config";

export interface WidgetUnit {
  code: string;
  name: string;
  symbol: string | null;
  toBaseFactor: number | null;
}

interface WidgetLabels {
  from: string;
  to: string;
  copyResult: string;
  copied: string;
  reset: string;
  swap: string;
}

interface ConverterWidgetProps {
  locale: Locale;
  categorySlug: string;
  units: WidgetUnit[];
  initialFromCode: string;
  initialToCode: string;
  precision?: number;
  labels: WidgetLabels;
}

export function ConverterWidget({ locale, categorySlug, units, initialFromCode, initialToCode, precision = 4, labels }: ConverterWidgetProps) {
  const router = useRouter();
  const [fromCode, setFromCode] = useState(initialFromCode);
  const [toCode, setToCode] = useState(initialToCode);
  const [inputValue, setInputValue] = useState("1");
  const [copied, setCopied] = useState(false);

  // Every unit pair gets its own real, shareable URL — swap the address bar
  // to match whenever the selection changes instead of only updating in place.
  function navigateTo(nextFromCode: string, nextToCode: string) {
    if (nextFromCode === nextToCode) return;
    router.replace(`/${locale}/converter/${categorySlug}/${nextFromCode}-to-${nextToCode}`);
  }

  const fromUnit = units.find((u) => u.code === fromCode);
  const toUnit = units.find((u) => u.code === toCode);

  const result = useMemo(() => {
    const value = Number(inputValue);
    if (inputValue.trim() === "" || Number.isNaN(value) || !fromUnit || !toUnit) return "";
    try {
      const raw = convert({
        value,
        fromCode,
        toCode,
        fromFactor: fromUnit.toBaseFactor,
        toFactor: toUnit.toBaseFactor,
        categorySlug,
      });
      return formatResult(raw, precision);
    } catch {
      return "";
    }
  }, [inputValue, fromCode, toCode, fromUnit, toUnit, categorySlug, precision]);

  function handleFromChange(code: string) {
    setFromCode(code);
    navigateTo(code, toCode);
  }

  function handleToChange(code: string) {
    setToCode(code);
    navigateTo(fromCode, code);
  }

  function handleSwap() {
    setFromCode(toCode);
    setToCode(fromCode);
    navigateTo(toCode, fromCode);
  }

  function handleReset() {
    setInputValue("1");
    setFromCode(initialFromCode);
    setToCode(initialToCode);
    if (fromCode !== initialFromCode || toCode !== initialToCode) navigateTo(initialFromCode, initialToCode);
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <div>
          <label className="mb-1 block text-sm font-medium text-muted-foreground">{labels.from}</label>
          <Input
            inputMode="decimal"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="mb-2 text-lg font-semibold"
            aria-label={labels.from}
          />
          <Select value={fromCode} onChange={(e) => handleFromChange(e.target.value)} aria-label={labels.from}>
            {units.map((u) => (
              <option key={u.code} value={u.code}>
                {u.name} {u.symbol ? `(${u.symbol})` : ""}
              </option>
            ))}
          </Select>
        </div>

        <Button variant="secondary" onClick={handleSwap} aria-label={labels.swap} className="mb-[2px] justify-self-center">
          <ArrowLeftRight className="h-4 w-4" />
        </Button>

        <div>
          <label className="mb-1 block text-sm font-medium text-muted-foreground">{labels.to}</label>
          <div className="mb-2 flex h-[42px] items-center rounded-md border border-input bg-muted px-3 text-lg font-semibold">
            {result || "—"}
          </div>
          <Select value={toCode} onChange={(e) => handleToChange(e.target.value)} aria-label={labels.to}>
            {units.map((u) => (
              <option key={u.code} value={u.code}>
                {u.name} {u.symbol ? `(${u.symbol})` : ""}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="secondary" onClick={handleCopy} disabled={!result}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? labels.copied : labels.copyResult}
        </Button>
        <Button variant="ghost" onClick={handleReset}>
          {labels.reset}
        </Button>
      </div>
    </div>
  );
}
