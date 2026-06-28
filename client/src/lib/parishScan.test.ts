import { describe, it, expect } from "vitest";
import { pageScan } from "@shared/parishScan";

describe("pageScan", () => {
  it("returns the home pulse for / and empty", () => {
    expect(pageScan("/")?.scope).toBe("PARISH PULSE");
    expect(pageScan("")?.scope).toBe("PARISH PULSE");
  });

  it("maps section routes to their scan scope", () => {
    expect(pageScan("/mass-times")?.scope).toBe("MASS & CONFESSION");
    expect(pageScan("/worship/today")?.scope).toBe("TODAY'S WORD");
    expect(pageScan("/bulletins")?.scope).toBe("BULLETIN");
    expect(pageScan("/giving")?.scope).toBe("GIVING");
  });

  it("prefers the specific sacrament form rules over the generic sacraments rule", () => {
    expect(pageScan("/baptism-form")?.scope).toBe("BAPTISM");
    expect(pageScan("/sacraments")?.scope).toBe("SACRAMENTS");
  });

  it("strips query and hash before matching", () => {
    expect(pageScan("/calendar?filter=ccd")?.scope).toBe("CALENDAR");
    expect(pageScan("/mass-times#confession")?.scope).toBe("MASS & CONFESSION");
  });

  it("hides the console on legal / utility routes", () => {
    expect(pageScan("/privacy")).toBeNull();
    expect(pageScan("/unsubscribe?token=abc")).toBeNull();
    expect(pageScan("/ccd-unsubscribe")).toBeNull();
    expect(pageScan("/404")).toBeNull();
  });

  it("falls back to the default scan for unmapped routes", () => {
    const s = pageScan("/something-new");
    expect(s?.scope).toBe("PARISH SCAN");
    expect(s?.steps.length).toBeGreaterThan(0);
  });

  it("always provides at least one step and one chip", () => {
    for (const p of ["/", "/mass-times", "/serve", "/prayers", "/contact", "/zzz"]) {
      const s = pageScan(p)!;
      expect(s.steps.length).toBeGreaterThan(0);
      expect(s.chips.length).toBeGreaterThan(0);
    }
  });
});
