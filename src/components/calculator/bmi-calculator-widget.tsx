"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type HeightUnit = "cm" | "in";
type WeightUnit = "kg" | "lb";

interface BmiLabels {
  height: string;
  weight: string;
  result: string;
  categories: { underweight: string; normal: string; overweight: string; obese: string };
}

function categorize(bmi: number, labels: BmiLabels["categories"]): { label: string; className: string } {
  if (bmi < 18.5) return { label: labels.underweight, className: "text-sky-600 dark:text-sky-400" };
  if (bmi < 25) return { label: labels.normal, className: "text-emerald-600 dark:text-emerald-400" };
  if (bmi < 30) return { label: labels.overweight, className: "text-amber-600 dark:text-amber-400" };
  return { label: labels.obese, className: "text-red-600 dark:text-red-400" };
}

export function BmiCalculatorWidget({ labels }: { labels: BmiLabels }) {
  const [height, setHeight] = useState("170");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [weight, setWeight] = useState("70");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");

  const bmi = useMemo(() => {
    const h = Number(height);
    const w = Number(weight);
    if (!Number.isFinite(h) || !Number.isFinite(w) || h <= 0 || w <= 0) return null;
    const heightMeters = heightUnit === "cm" ? h / 100 : h * 0.0254;
    const weightKg = weightUnit === "kg" ? w : w * 0.45359237;
    return weightKg / (heightMeters * heightMeters);
  }, [height, heightUnit, weight, weightUnit]);

  const category = bmi !== null && Number.isFinite(bmi) ? categorize(bmi, labels.categories) : null;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-muted-foreground">{labels.height}</label>
          <div className="flex gap-2">
            <Input
              inputMode="decimal"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="flex-1 text-lg font-semibold"
              aria-label={labels.height}
            />
            <Select
              value={heightUnit}
              onChange={(e) => setHeightUnit(e.target.value as HeightUnit)}
              className="w-20 shrink-0"
              aria-label={labels.height}
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
            </Select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-muted-foreground">{labels.weight}</label>
          <div className="flex gap-2">
            <Input
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="flex-1 text-lg font-semibold"
              aria-label={labels.weight}
            />
            <Select
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value as WeightUnit)}
              className="w-20 shrink-0"
              aria-label={labels.weight}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </Select>
          </div>
        </div>
      </div>

      {bmi !== null && category && (
        <div className="mt-6 rounded-lg border border-border bg-muted p-4 text-center">
          <p className="text-sm text-muted-foreground">{labels.result}</p>
          <p className="mt-1 text-3xl font-bold">{Number.isFinite(bmi) ? bmi.toFixed(1) : "—"}</p>
          <p className={`mt-1 text-sm font-medium ${category.className}`}>{category.label}</p>
        </div>
      )}
    </div>
  );
}
