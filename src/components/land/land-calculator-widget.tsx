"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatResult } from "@/lib/converters/engine";

export interface LandUnitOption {
  id: string;
  name: string;
  /** Factor relative to the region's common reference unit (Square Feet). */
  sqFtFactor: number;
}

interface LandWidgetLabels {
  from: string;
  to: string;
  swap: string;
}

export function LandCalculatorWidget({ units, labels }: { units: LandUnitOption[]; labels: LandWidgetLabels }) {
  const [fromId, setFromId] = useState(units[0]?.id ?? "");
  const [toId, setToId] = useState(units[1]?.id ?? units[0]?.id ?? "");
  const [inputValue, setInputValue] = useState("1");

  const fromUnit = units.find((u) => u.id === fromId);
  const toUnit = units.find((u) => u.id === toId);

  const result = useMemo(() => {
    const value = Number(inputValue);
    if (inputValue.trim() === "" || Number.isNaN(value) || !fromUnit || !toUnit) return "";
    const sqFt = value * fromUnit.sqFtFactor;
    return formatResult(sqFt / toUnit.sqFtFactor, 4);
  }, [inputValue, fromUnit, toUnit]);

  function handleSwap() {
    setFromId(toId);
    setToId(fromId);
  }

  if (units.length < 2) return null;

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
          <Select value={fromId} onChange={(e) => setFromId(e.target.value)} aria-label={labels.from}>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
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
          <Select value={toId} onChange={(e) => setToId(e.target.value)} aria-label={labels.to}>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
