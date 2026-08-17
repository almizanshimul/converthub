import { convertTemperature } from "./temperature";

export interface ConvertInput {
  value: number;
  fromCode: string;
  toCode: string;
  fromFactor: number | null;
  toFactor: number | null;
  categorySlug: string;
}

/**
 * Generic linear conversion via a shared per-category base unit, with
 * temperature special-cased (it's an affine, not a ratio, scale).
 */
export function convert({ value, fromCode, toCode, fromFactor, toFactor, categorySlug }: ConvertInput): number {
  if (!Number.isFinite(value)) return NaN;

  if (categorySlug === "temperature") {
    return convertTemperature(value, fromCode, toCode);
  }

  if (fromFactor == null || toFactor == null) {
    throw new Error(`Missing conversion factor for ${fromCode} -> ${toCode}`);
  }

  const baseValue = value * fromFactor;
  return baseValue / toFactor;
}

export function roundToPrecision(value: number, precision: number): number {
  if (!Number.isFinite(value)) return value;
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export function formatResult(value: number, precision: number): string {
  if (Number.isNaN(value)) return "";
  if (!Number.isFinite(value)) return value > 0 ? "∞" : "-∞";
  const rounded = roundToPrecision(value, precision);
  return rounded.toLocaleString("en-US", { maximumFractionDigits: precision });
}
