import { describe, it, expect } from "vitest";
import { pageAssistantContext } from "./pageAssistant";

describe("pageAssistantContext", () => {
  it("maps the home route", () => {
    expect(pageAssistantContext("/").label).toBe("Home");
    expect(pageAssistantContext("").label).toBe("Home");
  });

  it("maps mass-times", () => {
    const ctx = pageAssistantContext("/mass-times");
    expect(ctx.label).toBe("Mass Times & Confession");
    expect(ctx.suggestions.length).toBeGreaterThan(0);
  });

  it("maps sacraments and sacrament-preparation to the Sacraments context", () => {
    expect(pageAssistantContext("/sacraments").label).toBe("Sacraments");
    expect(pageAssistantContext("/sacrament-preparation/baptism").label).toBe("Sacraments");
  });

  it("prefers the more-specific CCD registration rule over the permissions rule", () => {
    expect(pageAssistantContext("/ccd-permissions").label).toBe("CCD Permission Forms");
    expect(pageAssistantContext("/ccd-registration").label).toBe("Faith Formation (CCD)");
  });

  it("strips query strings and hashes before matching", () => {
    expect(pageAssistantContext("/mass-times?day=sunday").label).toBe("Mass Times & Confession");
    expect(pageAssistantContext("/mass-times#confession").label).toBe("Mass Times & Confession");
  });

  it("falls back to the default context for unknown routes", () => {
    const ctx = pageAssistantContext("/some-unknown-page");
    expect(ctx.label).toBe("St. Patrick in Armonk");
    expect(ctx.suggestions.length).toBeGreaterThan(0);
  });

  it("always returns at least one suggestion", () => {
    for (const path of ["/", "/giving", "/worship", "/contact", "/zzz"]) {
      expect(pageAssistantContext(path).suggestions.length).toBeGreaterThan(0);
    }
  });
});
