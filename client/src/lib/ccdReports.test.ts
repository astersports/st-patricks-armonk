import { describe, it, expect } from "vitest";
import { buildCcdReports, hasMedicalInfo } from "./ccdReports";

const rows = [
  {
    childFirstName: "Amy", childLastName: "Adams", childGrade: "3",
    parentName: "Pat Adams", parentPhone: "111",
    needsBusTransport: 1, busPickupLocation: "Maple & Cox", busDropoffLocation: "School",
    earlyDismissalAuthorized: 0,
    allergies: "Peanuts", medications: "", medicalConditions: "",
    photoReleaseConsent: 1, authorizedPickup1Name: "Gran",
  },
  {
    childFirstName: "Ben", childLastName: "Brown", childGrade: "5",
    parentName: "Sam Brown", parentPhone: "222",
    needsBusTransport: 0,
    earlyDismissalAuthorized: 1, earlyDismissalReason: "Sports", earlyDismissalDates: "Tuesdays",
    allergies: "None", medications: "none", medicalConditions: "",
    photoReleaseConsent: 0, authorizedPickup1Name: "Sam", authorizedPickup2Name: "Jo",
  },
];

const byKey = (k: string) => buildCcdReports(rows).find((r) => r.key === k)!;

describe("hasMedicalInfo", () => {
  it("ignores blank / none / n/a values", () => {
    expect(hasMedicalInfo({ allergies: "None", medications: "", medicalConditions: "n/a" })).toBe(false);
    expect(hasMedicalInfo({ allergies: "Peanuts" })).toBe(true);
    expect(hasMedicalInfo({ medications: "Inhaler" })).toBe(true);
  });
});

describe("buildCcdReports", () => {
  it("bus roster includes only children needing transport", () => {
    const bus = byKey("bus");
    expect(bus.rows).toHaveLength(1);
    expect(bus.columns[0].accessor(bus.rows[0])).toBe("Amy Adams");
  });

  it("medical alert includes only children with allergy/med/condition on file", () => {
    const medical = byKey("medical");
    expect(medical.rows).toHaveLength(1);
    expect(medical.columns.find((c) => c.header === "Allergies")!.accessor(medical.rows[0])).toBe("Peanuts");
  });

  it("early dismissal includes only authorized children and joins pickup names", () => {
    const ed = byKey("earlyDismissal");
    expect(ed.rows).toHaveLength(1);
    const pickup = ed.columns.find((c) => c.header === "Authorized Pickup")!.accessor(ed.rows[0]);
    expect(pickup).toBe("Sam; Jo");
  });

  it("photo release lists everyone with a Yes/No flag", () => {
    const photo = byKey("photo");
    expect(photo.rows).toHaveLength(2);
    const flag = photo.columns.find((c) => c.header === "Photo Release")!;
    expect(flag.accessor(rows[0])).toBe("Yes");
    expect(flag.accessor(rows[1])).toBe("No");
  });

  it("returns empty report rows (not a crash) for no permissions", () => {
    expect(buildCcdReports([]).every((r) => r.rows.length === 0)).toBe(true);
    expect(buildCcdReports(null).length).toBe(4);
  });
});
