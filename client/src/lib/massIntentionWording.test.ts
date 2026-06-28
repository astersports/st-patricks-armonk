import { describe, it, expect } from "vitest";
import {
  buildIntentionSuggestions,
  sanitizeIntentionName,
  MAX_INTENTION_SUGGESTIONS,
} from "@shared/massIntentionWording";

describe("sanitizeIntentionName", () => {
  it("collapses whitespace and trims", () => {
    expect(sanitizeIntentionName("  John   Smith  ")).toBe("John Smith");
  });

  it("strips newlines / control chars (defeats injection into wording)", () => {
    expect(sanitizeIntentionName("John\nSmith\tJr")).toBe("John Smith Jr");
    // non-whitespace ASCII control chars (NUL, DEL) are stripped too
    expect(sanitizeIntentionName("John\u0000Smith\u007fJr")).toBe("John Smith Jr");
  });

  it("bounds length to 120 chars", () => {
    expect(sanitizeIntentionName("a".repeat(300)).length).toBe(120);
  });

  it("handles empty input", () => {
    expect(sanitizeIntentionName("")).toBe("");
    expect(sanitizeIntentionName("   ")).toBe("");
  });
});

describe("buildIntentionSuggestions", () => {
  it("interpolates the name into deceased templates", () => {
    const out = buildIntentionSuggestions({ intentionType: "deceased", intentionFor: "Mary Doe" });
    expect(out.length).toBe(MAX_INTENTION_SUGGESTIONS);
    expect(out[0]).toBe("In loving memory of Mary Doe.");
    expect(out.every((s) => s.includes("Mary Doe"))).toBe(true);
  });

  it("uses distinct wording per intention type", () => {
    const living = buildIntentionSuggestions({ intentionType: "living", intentionFor: "Mary Doe" });
    const thanks = buildIntentionSuggestions({ intentionType: "thanksgiving", intentionFor: "Mary Doe" });
    expect(living[0]).toContain("health and intentions");
    expect(thanks[0]).toContain("thanksgiving");
    expect(living[0]).not.toBe(thanks[0]);
  });

  it("falls back to a generic, name-free phrasing when no name is given", () => {
    const out = buildIntentionSuggestions({ intentionType: "deceased", intentionFor: "   " });
    expect(out.length).toBe(1);
    expect(out[0]).not.toContain("{name}");
    expect(out[0]).toMatch(/faithful departed/i);
  });

  it("never leaves an unsubstituted placeholder", () => {
    for (const t of ["living", "deceased", "thanksgiving", "special"] as const) {
      for (const name of ["Mary Doe", ""]) {
        for (const s of buildIntentionSuggestions({ intentionType: t, intentionFor: name })) {
          expect(s).not.toContain("{name}");
        }
      }
    }
  });
});
