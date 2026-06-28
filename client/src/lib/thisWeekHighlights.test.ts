import { describe, it, expect } from "vitest";
import {
  buildThisWeekHighlights,
  formatHighlightDate,
  defaultHighlightsIntro,
  type RawHighlight,
} from "@shared/thisWeekHighlights";

const NOW = new Date("2026-06-28T12:00:00Z"); // Sunday

function ev(over: Partial<RawHighlight> & { date: Date }): RawHighlight {
  return { kind: "event", title: "Item", ...over };
}

describe("buildThisWeekHighlights", () => {
  it("includes only items within the window (default 7 days)", () => {
    const items = [
      ev({ title: "Tomorrow", date: new Date("2026-06-29T18:00:00Z") }),
      ev({ title: "In 6 days", date: new Date("2026-07-04T18:00:00Z") }),
      ev({ title: "In 20 days", date: new Date("2026-07-18T18:00:00Z") }),
      ev({ title: "Yesterday", date: new Date("2026-06-27T18:00:00Z") }),
    ];
    const out = buildThisWeekHighlights(items, NOW);
    const titles = out.map((h) => h.title);
    expect(titles).toContain("Tomorrow");
    expect(titles).toContain("In 6 days");
    expect(titles).not.toContain("In 20 days");
    expect(titles).not.toContain("Yesterday");
  });

  it("includes items earlier today (lower bound is start of day)", () => {
    const out = buildThisWeekHighlights(
      [ev({ title: "Earlier today", date: new Date("2026-06-28T09:00:00Z") })],
      NOW,
    );
    expect(out.map((h) => h.title)).toContain("Earlier today");
  });

  it("sorts ascending by date", () => {
    const out = buildThisWeekHighlights([
      ev({ title: "Later", date: new Date("2026-07-02T18:00:00Z") }),
      ev({ title: "Sooner", date: new Date("2026-06-29T18:00:00Z") }),
    ], NOW);
    expect(out.map((h) => h.title)).toEqual(["Sooner", "Later"]);
  });

  it("de-duplicates identical kind+title+timestamp", () => {
    const d = new Date("2026-06-29T18:00:00Z");
    const out = buildThisWeekHighlights([ev({ date: d }), ev({ date: d })], NOW);
    expect(out.length).toBe(1);
  });

  it("caps to the max option", () => {
    const items = Array.from({ length: 12 }, (_, i) =>
      ev({ title: `E${i}`, date: new Date(`2026-06-29T${String(6 + i).padStart(2, "0")}:00:00Z`) }),
    );
    expect(buildThisWeekHighlights(items, NOW, { max: 5 }).length).toBe(5);
  });

  it("drops invalid dates and blank titles", () => {
    const out = buildThisWeekHighlights([
      ev({ title: "", date: new Date("2026-06-29T18:00:00Z") }),
      ev({ title: "Bad date", date: new Date("not-a-date") }),
      ev({ title: "Good", date: new Date("2026-06-29T18:00:00Z") }),
    ], NOW);
    expect(out.map((h) => h.title)).toEqual(["Good"]);
  });

  it("carries location, note, and urgent through", () => {
    const [h] = buildThisWeekHighlights([
      ev({ title: "Food drive", date: new Date("2026-06-29T18:00:00Z"), location: "Hall", note: "Bring cans", urgent: true }),
    ], NOW);
    expect(h.location).toBe("Hall");
    expect(h.note).toBe("Bring cans");
    expect(h.urgent).toBe(true);
  });
});

describe("formatHighlightDate", () => {
  it("omits the time for all-day items", () => {
    const label = formatHighlightDate(new Date("2026-06-29T18:00:00Z"), true, "America/New_York");
    expect(label).toMatch(/Mon, Jun 29/);
    expect(label).not.toMatch(/·/);
  });

  it("includes the time for timed items", () => {
    const label = formatHighlightDate(new Date("2026-06-29T23:00:00Z"), false, "America/New_York");
    expect(label).toMatch(/·/);
    expect(label).toMatch(/PM/);
  });
});

describe("defaultHighlightsIntro", () => {
  it("varies by count", () => {
    expect(defaultHighlightsIntro(0)).toMatch(/check back/i);
    expect(defaultHighlightsIntro(1)).toMatch(/one thing/i);
    expect(defaultHighlightsIntro(3)).toMatch(/3 things/);
  });
});
