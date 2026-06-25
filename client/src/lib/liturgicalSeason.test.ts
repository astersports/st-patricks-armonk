import { describe, it, expect } from "vitest";
import { getLiturgicalSeason, getSeasonTheme, getSeasonDescription } from "./liturgicalSeason";

describe("liturgicalSeason", () => {
  describe("getLiturgicalSeason", () => {
    it("returns 'christmas' for Dec 25", () => {
      const dec25 = new Date(2026, 11, 25);
      expect(getLiturgicalSeason(dec25)).toBe("christmas");
    });

    it("returns 'christmas' for Dec 31", () => {
      const dec31 = new Date(2026, 11, 31);
      expect(getLiturgicalSeason(dec31)).toBe("christmas");
    });

    it("returns 'christmas' for Jan 1 (before Baptism of Lord)", () => {
      const jan1 = new Date(2026, 0, 1);
      expect(getLiturgicalSeason(jan1)).toBe("christmas");
    });

    it("returns 'ordinary' for a typical summer date", () => {
      const june15 = new Date(2026, 5, 15);
      expect(getLiturgicalSeason(june15)).toBe("ordinary");
    });

    it("returns 'lent' for mid-March 2026 (Ash Wed is Feb 18, 2026)", () => {
      const march10 = new Date(2026, 2, 10);
      expect(getLiturgicalSeason(march10)).toBe("lent");
    });

    it("returns 'easter' for Easter Sunday 2026 (April 5)", () => {
      const easter2026 = new Date(2026, 3, 5);
      expect(getLiturgicalSeason(easter2026)).toBe("easter");
    });

    it("returns 'advent' for first Sunday of December 2026 before Christmas", () => {
      // Advent 2026 starts Nov 29
      const dec6 = new Date(2026, 11, 6);
      expect(getLiturgicalSeason(dec6)).toBe("advent");
    });

    // ── Boundary assertions (both failed before the season-bound fix) ──

    it("returns 'advent' for Nov 29, 2026 (late-November first Sunday of Advent)", () => {
      // First Sunday of Advent 2026 is Nov 29 — month===10, so the old
      // month===11 guard mis-classified it as Ordinary Time.
      const nov29 = new Date(2026, 10, 29);
      expect(getLiturgicalSeason(nov29)).toBe("advent");
    });

    it("returns 'lent' for Good Friday 2026 (April 3)", () => {
      // Good Friday + Holy Saturday are part of the Triduum (still Lent),
      // not Ordinary Time. Easter 2026 is April 5, so Good Friday is April 3.
      const goodFriday = new Date(2026, 3, 3);
      expect(getLiturgicalSeason(goodFriday)).toBe("lent");
    });

    it("returns 'lent' for Holy Saturday 2026 (April 4)", () => {
      const holySaturday = new Date(2026, 3, 4);
      expect(getLiturgicalSeason(holySaturday)).toBe("lent");
    });
  });

  describe("getSeasonTheme", () => {
    it("returns green accent for ordinary time", () => {
      const theme = getSeasonTheme("ordinary");
      expect(theme.accentColor).toBe("emerald");
      expect(theme.season).toBe("ordinary");
    });

    it("returns purple accent for advent", () => {
      const theme = getSeasonTheme("advent");
      expect(theme.accentColor).toBe("purple");
    });

    it("returns purple accent for lent", () => {
      const theme = getSeasonTheme("lent");
      expect(theme.accentColor).toBe("purple");
    });

    it("returns amber accent for christmas", () => {
      const theme = getSeasonTheme("christmas");
      expect(theme.accentColor).toBe("amber");
    });

    it("returns amber accent for easter", () => {
      const theme = getSeasonTheme("easter");
      expect(theme.accentColor).toBe("amber");
    });
  });

  describe("getSeasonDescription", () => {
    it("returns a description for ordinary time", () => {
      const desc = getSeasonDescription("ordinary");
      expect(desc).toContain("Ordinary Time");
    });

    it("returns a description for advent", () => {
      const desc = getSeasonDescription("advent");
      expect(desc).toContain("coming of Christ");
    });

    it("returns a description for lent", () => {
      const desc = getSeasonDescription("lent");
      expect(desc).toContain("prayer");
    });

    it("returns a description for christmas", () => {
      const desc = getSeasonDescription("christmas");
      expect(desc).toContain("birth");
    });

    it("returns a description for easter", () => {
      const desc = getSeasonDescription("easter");
      expect(desc).toContain("Resurrection");
    });
  });
});
