import { describe, expect, it } from "vitest";
import { localize } from "./translate";

describe("localize", () => {
  const base = { name: "Meter", description: "A unit of length.", untranslatedField: "kept" };

  it("returns the base row unchanged when there is no translation", () => {
    expect(localize(base, [])).toEqual(base);
    expect(localize(base, null)).toEqual(base);
    expect(localize(base, undefined)).toEqual(base);
  });

  it("overlays non-blank translated fields onto the base row", () => {
    const result = localize(base, [{ name: "Metro", description: "Una unidad de longitud." }]);
    expect(result.name).toBe("Metro");
    expect(result.description).toBe("Una unidad de longitud.");
  });

  it("falls back to the base value when a translated field is null, undefined, or empty", () => {
    const result = localize(base, [{ name: null, description: undefined }]);
    expect(result.name).toBe("Meter");
    expect(result.description).toBe("A unit of length.");
  });

  it("falls back to the base value when the translated field is an empty string", () => {
    const result = localize(base, [{ name: "" }]);
    expect(result.name).toBe("Meter");
  });

  it("leaves fields the translation doesn't mention untouched", () => {
    const result = localize(base, [{ name: "Metro" }]);
    expect(result.untranslatedField).toBe("kept");
  });

  it("only reads the first translation row (translationInclude already filters to one locale)", () => {
    const result = localize(base, [{ name: "Metro" }, { name: "Mètre" }]);
    expect(result.name).toBe("Metro");
  });

  it("does not mutate the base object", () => {
    localize(base, [{ name: "Metro" }]);
    expect(base.name).toBe("Meter");
  });
});
