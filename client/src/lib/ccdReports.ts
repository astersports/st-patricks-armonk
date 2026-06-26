/**
 * CCD permission report definitions — pure, testable.
 *
 * Turns the already-loaded CCD permission rows into the staff rosters the
 * office used to transcribe by hand (Phase 2, audit A-3): bus roster, medical/
 * allergy alert, photo-release list, and early-dismissal list. No server call —
 * the admin already holds the rows (RLS-protected); these just shape + filter
 * them for a CSV download via `exportCsv`.
 */
import type { CsvColumn } from "./exportCsv";

export interface CcdReport {
  key: string;
  label: string;
  filename: string;
  rows: Record<string, unknown>[];
  columns: CsvColumn<Record<string, unknown>>[];
}

const str = (v: unknown) => (v == null ? "" : String(v));
const fullName = (p: Record<string, unknown>) => `${str(p.childFirstName)} ${str(p.childLastName)}`.trim();
const yesNo = (v: unknown) => (v ? "Yes" : "No");

/** A free-text field counts as "present" unless it's blank / none / n/a. */
function isMeaningful(v: unknown): boolean {
  const s = str(v).trim().toLowerCase();
  return s !== "" && s !== "none" && s !== "n/a" && s !== "na";
}

/** True when the child has any allergy, medication, or medical condition on file. */
export function hasMedicalInfo(p: Record<string, unknown>): boolean {
  return isMeaningful(p.allergies) || isMeaningful(p.medications) || isMeaningful(p.medicalConditions);
}

export function buildCcdReports(permissions: Record<string, unknown>[] | null | undefined): CcdReport[] {
  const rows = permissions ?? [];
  return [
    {
      key: "bus",
      label: "Bus Roster",
      filename: "ccd-bus-roster.csv",
      rows: rows.filter((p) => Boolean(p.needsBusTransport)),
      columns: [
        { header: "Child", accessor: fullName },
        { header: "Grade", accessor: (p) => str(p.childGrade) },
        { header: "Pickup", accessor: (p) => str(p.busPickupLocation) },
        { header: "Dropoff", accessor: (p) => str(p.busDropoffLocation) },
        { header: "Notes", accessor: (p) => str(p.busNotes) },
        { header: "Parent", accessor: (p) => str(p.parentName) },
        { header: "Parent Phone", accessor: (p) => str(p.parentPhone) },
        { header: "School Year", accessor: (p) => str(p.schoolYear) },
      ],
    },
    {
      key: "medical",
      label: "Allergy / Medical Alert",
      filename: "ccd-medical-alert.csv",
      rows: rows.filter(hasMedicalInfo),
      columns: [
        { header: "Child", accessor: fullName },
        { header: "Grade", accessor: (p) => str(p.childGrade) },
        { header: "Allergies", accessor: (p) => str(p.allergies) },
        { header: "Medications", accessor: (p) => str(p.medications) },
        { header: "Conditions", accessor: (p) => str(p.medicalConditions) },
        { header: "Doctor", accessor: (p) => str(p.doctorName) },
        { header: "Doctor Phone", accessor: (p) => str(p.doctorPhone) },
        { header: "Emergency Contact", accessor: (p) => str(p.emergencyContactName) },
        { header: "Emergency Phone", accessor: (p) => str(p.emergencyContactPhone) },
      ],
    },
    {
      key: "photo",
      label: "Photo Release",
      filename: "ccd-photo-release.csv",
      rows,
      columns: [
        { header: "Child", accessor: fullName },
        { header: "Grade", accessor: (p) => str(p.childGrade) },
        { header: "Photo Release", accessor: (p) => yesNo(p.photoReleaseConsent) },
        { header: "Parent", accessor: (p) => str(p.parentName) },
      ],
    },
    {
      key: "earlyDismissal",
      label: "Early Dismissal",
      filename: "ccd-early-dismissal.csv",
      rows: rows.filter((p) => Boolean(p.earlyDismissalAuthorized)),
      columns: [
        { header: "Child", accessor: fullName },
        { header: "Grade", accessor: (p) => str(p.childGrade) },
        { header: "Reason", accessor: (p) => str(p.earlyDismissalReason) },
        { header: "Dates", accessor: (p) => str(p.earlyDismissalDates) },
        {
          header: "Authorized Pickup",
          accessor: (p) =>
            [p.authorizedPickup1Name, p.authorizedPickup2Name, p.authorizedPickup3Name].map(str).filter(Boolean).join("; "),
        },
        { header: "Parent Phone", accessor: (p) => str(p.parentPhone) },
      ],
    },
  ];
}
