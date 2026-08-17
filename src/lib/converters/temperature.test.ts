import { describe, expect, it } from "vitest";
import { convertTemperature, isTemperatureUnit } from "./temperature";

describe("isTemperatureUnit", () => {
  it("accepts the three known units", () => {
    expect(isTemperatureUnit("celsius")).toBe(true);
    expect(isTemperatureUnit("fahrenheit")).toBe(true);
    expect(isTemperatureUnit("kelvin")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isTemperatureUnit("rankine")).toBe(false);
  });
});

describe("convertTemperature", () => {
  it("converts freezing and boiling points correctly", () => {
    expect(convertTemperature(0, "celsius", "fahrenheit")).toBe(32);
    expect(convertTemperature(100, "celsius", "fahrenheit")).toBe(212);
    expect(convertTemperature(0, "celsius", "kelvin")).toBeCloseTo(273.15, 5);
  });

  it("round-trips celsius -> fahrenheit -> celsius", () => {
    const f = convertTemperature(37, "celsius", "fahrenheit");
    expect(convertTemperature(f, "fahrenheit", "celsius")).toBeCloseTo(37, 10);
  });

  it("is the identity when from and to are the same unit", () => {
    expect(convertTemperature(-40, "fahrenheit", "fahrenheit")).toBe(-40);
  });

  it("throws for an unrecognized unit", () => {
    expect(() => convertTemperature(0, "rankine", "celsius")).toThrow();
  });
});
