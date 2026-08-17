const TEMPERATURE_FORMULAS: Record<string, string> = {
  "celsius-fahrenheit": "°F = (°C × 9/5) + 32",
  "fahrenheit-celsius": "°C = (°F − 32) × 5/9",
  "celsius-kelvin": "K = °C + 273.15",
  "kelvin-celsius": "°C = K − 273.15",
  "fahrenheit-kelvin": "K = (°F − 32) × 5/9 + 273.15",
  "kelvin-fahrenheit": "°F = (K − 273.15) × 9/5 + 32",
};

export function getFormulaDisplay(
  categorySlug: string,
  fromCode: string,
  fromName: string,
  toCode: string,
  toName: string,
  fromFactor: number | null,
  toFactor: number | null,
): string {
  if (categorySlug === "temperature") {
    return TEMPERATURE_FORMULAS[`${fromCode}-${toCode}`] ?? `${toName} = f(${fromName})`;
  }

  if (fromFactor == null || toFactor == null) return `${toName} = ${fromName} × factor`;

  const ratio = fromFactor / toFactor;
  // 7 fraction digits (not the naive 10) absorbs sub-billionth floating-point
  // and DECIMAL(24,12)-column rounding noise — e.g. a defined-exact 1:16
  // ratio landing at 15.999999989 instead of 16 — while still showing far
  // more precision than any converter's display `precision` field uses.
  const formatted = ratio.toLocaleString("en-US", { maximumFractionDigits: 7 });
  return `1 ${fromName} = ${formatted} ${toName}`;
}
