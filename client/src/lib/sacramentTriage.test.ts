import { describe, it, expect } from "vitest";
import { triageSacrament, type TriageInput } from "@shared/sacramentTriage";

const NOW = new Date("2026-06-28T12:00:00Z");

function row(over: Partial<TriageInput>): TriageInput {
  return {
    type: "baptism",
    email: "a@b.com",
    phone: "555-1234",
    submittedAt: "2026-06-28T10:00:00Z",
    preferredDate: null,
    stage: "new",
    urgent: false,
    ...over,
  };
}

describe("triageSacrament", () => {
  it("flags an immediate-need funeral as an alert, first", () => {
    const t = triageSacrament(row({ type: "funeral", urgent: true }), NOW);
    expect(t.flags[0]).toEqual({ label: "Immediate need", severity: "alert" });
    expect(t.summary).toBe("Immediate need");
  });

  it("escalates awaiting-reply by age while still new", () => {
    expect(triageSacrament(row({ submittedAt: "2026-06-28T08:00:00Z" }), NOW).flags.some(f => f.label === "New today")).toBe(true);
    expect(triageSacrament(row({ submittedAt: "2026-06-24T08:00:00Z" }), NOW).flags.some(f => /Awaiting reply 4d/.test(f.label) && f.severity === "warn")).toBe(true);
    expect(triageSacrament(row({ submittedAt: "2026-06-20T08:00:00Z" }), NOW).flags.some(f => /No reply in 8d/.test(f.label) && f.severity === "alert")).toBe(true);
  });

  it("does not show awaiting-reply once past 'new'", () => {
    const t = triageSacrament(row({ stage: "contacted", submittedAt: "2026-06-10T08:00:00Z" }), NOW);
    expect(t.flags.some(f => /reply/i.test(f.label))).toBe(false);
  });

  it("flags a passed requested date while unscheduled", () => {
    const t = triageSacrament(row({ preferredDate: "2026-06-20", stage: "contacted" }), NOW);
    expect(t.flags.some(f => f.label === "Requested date passed" && f.severity === "alert")).toBe(true);
  });

  it("flags a date within two weeks that isn't scheduled yet", () => {
    const t = triageSacrament(row({ preferredDate: "2026-07-05", stage: "contacted" }), NOW);
    expect(t.flags.some(f => /Date in \d+d — not scheduled/.test(f.label))).toBe(true);
  });

  it("suppresses date flags once scheduled", () => {
    const t = triageSacrament(row({ preferredDate: "2026-07-05", stage: "scheduled" }), NOW);
    expect(t.flags.some(f => /Date in/.test(f.label))).toBe(false);
  });

  it("ignores free-form / unparseable preferred dates", () => {
    const t = triageSacrament(row({ preferredDate: "sometime this summer", stage: "contacted" }), NOW);
    expect(t.flags.some(f => /Date|passed/i.test(f.label))).toBe(false);
  });

  it("flags missing contact info", () => {
    const t = triageSacrament(row({ email: null, phone: null }), NOW);
    expect(t.flags.some(f => f.label === "No email on file" && f.severity === "warn")).toBe(true);
    expect(t.flags.some(f => f.label === "No phone on file" && f.severity === "info")).toBe(true);
  });

  it("orders flags alert → warn → info and caps the count", () => {
    const t = triageSacrament(row({
      type: "funeral", urgent: true, email: null, phone: null,
      preferredDate: "2026-06-01", stage: "new", submittedAt: "2026-06-15T08:00:00Z",
    }), NOW);
    const ranks = t.flags.map(f => f.severity);
    const idx = { alert: 0, warn: 1, info: 2 };
    for (let i = 1; i < ranks.length; i++) {
      expect(idx[ranks[i]]).toBeGreaterThanOrEqual(idx[ranks[i - 1]]);
    }
    expect(t.flags.length).toBeLessThanOrEqual(4);
    expect(t.flags[0].severity).toBe("alert");
  });

  it("says all-clear for a clean open submission", () => {
    const t = triageSacrament(row({ submittedAt: "2026-06-28T11:00:00Z", stage: "new" }), NOW);
    // 'New today' is informational; summary should still surface it, not an empty string.
    expect(t.summary.length).toBeGreaterThan(0);
  });

  it("reports Closed for completed/declined with no open-state flags", () => {
    const t = triageSacrament(row({ stage: "completed", email: "a@b.com", phone: "555" }), NOW);
    expect(t.summary).toBe("Closed");
    expect(t.flags.length).toBe(0);
  });
});
