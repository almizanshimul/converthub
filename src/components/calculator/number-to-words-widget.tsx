"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { numberToWords, type NumberWordsLocale } from "@/lib/numbers/number-to-words";

const MAX_SAFE_DIGITS = 15;

interface NumberWidgetLabels {
  number: string;
  copyResult: string;
  copied: string;
  digitsOnlyError: string;
  tooManyDigitsError: string;
}

export function NumberToWordsWidget({ locale, labels }: { locale: NumberWordsLocale; labels: NumberWidgetLabels }) {
  const [value, setValue] = useState("125000");
  const [copied, setCopied] = useState(false);

  const { words, error } = useMemo(() => {
    const trimmed = value.trim();
    if (trimmed === "") return { words: "", error: null };
    if (!/^-?\d+(\.\d+)?$/.test(trimmed)) return { words: "", error: labels.digitsOnlyError };
    const digitCount = trimmed.replace(/[^0-9]/g, "").length;
    if (digitCount > MAX_SAFE_DIGITS) return { words: "", error: labels.tooManyDigitsError.replace("{max}", String(MAX_SAFE_DIGITS)) };
    return { words: numberToWords(Number(trimmed), locale), error: null };
  }, [value, locale, labels]);

  async function handleCopy() {
    if (!words) return;
    await navigator.clipboard.writeText(words);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <label className="mb-1 block text-sm font-medium text-muted-foreground">{labels.number}</label>
      <Input
        inputMode="decimal"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="text-lg font-semibold"
        aria-label={labels.number}
      />

      <div className="mt-4 min-h-[3rem] rounded-md border border-input bg-muted px-4 py-3 text-lg font-semibold leading-relaxed">
        {error ? <span className="text-sm font-normal text-destructive">{error}</span> : words || "—"}
      </div>

      <div className="mt-4">
        <Button variant="secondary" onClick={handleCopy} disabled={!words}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? labels.copied : labels.copyResult}
        </Button>
      </div>
    </div>
  );
}
