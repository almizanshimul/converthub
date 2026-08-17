import { describe, expect, it } from "vitest";
import { convert, formatResult, roundToPrecision } from "./engine";

describe("convert", () => {
  it("converts linearly via the base-unit factors", () => {
    // meter -> foot: 1 base unit (meter) = 3.2808398... feet, expressed here
    // via the same fromFactor/toFactor-to-base-unit convention the DB uses.
    const result = convert({ value: 1, fromCode: "meter", toCode: "foot", fromFactor: 1, toFactor: 0.3048, categorySlug: "length" });
    expect(result).toBeCloseTo(3.28084, 4);
  });

  it("returns the same value when from and to units match", () => {
    const result = convert({ value: 42, fromCode: "meter", toCode: "meter", fromFactor: 1, toFactor: 1, categorySlug: "length" });
    expect(result).toBe(42);
  });

  it("routes temperature through the affine converter instead of factor multiplication", () => {
    const result = convert({ value: 100, fromCode: "celsius", toCode: "fahrenheit", fromFactor: null, toFactor: null, categorySlug: "temperature" });
    expect(result).toBe(212);
  });

  it("throws when a non-temperature category is missing a factor", () => {
    expect(() => convert({ value: 1, fromCode: "meter", toCode: "foot", fromFactor: null, toFactor: 1, categorySlug: "length" })).toThrow();
  });

  it("propagates non-finite input as NaN instead of throwing", () => {
    expect(convert({ value: NaN, fromCode: "meter", toCode: "foot", fromFactor: 1, toFactor: 0.3048, categorySlug: "length" })).toBeNaN();
  });
});

describe("roundToPrecision", () => {
  it("rounds to the given number of decimal places", () => {
    expect(roundToPrecision(1.23456, 2)).toBe(1.23);
    expect(roundToPrecision(1.2345, 3)).toBeCloseTo(1.235, 3);
  });

  it("passes non-finite values through unchanged", () => {
    expect(roundToPrecision(Infinity, 2)).toBe(Infinity);
  });
});

describe("formatResult", () => {
  it("formats with thousands separators and capped decimals", () => {
    expect(formatResult(1234.5, 2)).toBe("1,234.5");
    expect(formatResult(3.14159, 4)).toBe("3.1416");
  });

  it("returns an empty string for NaN", () => {
    expect(formatResult(NaN, 2)).toBe("");
  });

  it("renders infinities as the math symbol rather than the JS string", () => {
    expect(formatResult(Infinity, 2)).toBe("∞");
    expect(formatResult(-Infinity, 2)).toBe("-∞");
  });
});
