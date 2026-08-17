type TempUnit = "celsius" | "fahrenheit" | "kelvin";

const toCelsius: Record<TempUnit, (v: number) => number> = {
  celsius: (v) => v,
  fahrenheit: (v) => ((v - 32) * 5) / 9,
  kelvin: (v) => v - 273.15,
};

const fromCelsius: Record<TempUnit, (v: number) => number> = {
  celsius: (v) => v,
  fahrenheit: (v) => (v * 9) / 5 + 32,
  kelvin: (v) => v + 273.15,
};

export function isTemperatureUnit(code: string): code is TempUnit {
  return code === "celsius" || code === "fahrenheit" || code === "kelvin";
}

export function convertTemperature(value: number, from: string, to: string): number {
  if (!isTemperatureUnit(from) || !isTemperatureUnit(to)) {
    throw new Error(`Unknown temperature unit: ${from} or ${to}`);
  }
  return fromCelsius[to](toCelsius[from](value));
}
