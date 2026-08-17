import { describe, expect, it } from "vitest";
import { cn, slugify } from "./utils";

describe("slugify", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(slugify("Test Post From Verification Script")).toBe("test-post-from-verification-script");
  });

  it("collapses runs of non-alphanumeric characters into one hyphen", () => {
    expect(slugify("Hello,   World!!")).toBe("hello-world");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  --Hello--  ")).toBe("hello");
  });

  it("preserves non-Latin letters instead of stripping them", () => {
    expect(slugify("বাংলা পোস্ট")).toBe("বাংলা-পোস্ট");
  });
});

describe("cn", () => {
  it("merges class lists and drops falsy values", () => {
    expect(cn("a", false, undefined, "b")).toBe("a b");
  });

  it("lets a later tailwind class win over a conflicting earlier one", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
