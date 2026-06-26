import { describe, it, expect } from "vitest";
import { formatSubmissionReference, buildFormConfirmationEmail } from "./email";

describe("submission reference numbers", () => {
  it("zero-pads the id behind a prefix", () => {
    expect(formatSubmissionReference("CCD", 42)).toBe("CCD-00042");
    expect(formatSubmissionReference("REG", 7)).toBe("REG-00007");
  });

  it("does not truncate ids longer than the pad width", () => {
    expect(formatSubmissionReference("VOL", 123456)).toBe("VOL-123456");
  });
});

describe("form confirmation email", () => {
  it("includes the reference number when one is provided", () => {
    const html = buildFormConfirmationEmail("Parish Registration", "Jane Doe", "REG-00007");
    expect(html).toContain("REG-00007");
    expect(html).toContain("reference number");
    expect(html).toContain("Jane Doe");
    expect(html).toContain("Parish Registration");
  });

  it("omits the reference line when no reference is provided (back-compat)", () => {
    const html = buildFormConfirmationEmail("Mass Intention", "John Doe");
    expect(html).not.toContain("reference number");
    expect(html).toContain("John Doe");
  });
});
