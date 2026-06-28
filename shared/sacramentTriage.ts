/**
 * Sacrament submission triage — pure + testable.
 *
 * Turns a sacrament submission row into an at-a-glance "what needs attention"
 * read for the office: a one-line summary plus prioritized flags (stale/
 * awaiting reply, requested date approaching or passed, missing contact info,
 * immediate need). Deterministic and rules-based — no AI key required — so it
 * runs client-side over the already-loaded admin list with zero new endpoints.
 * (AI-ready: a future endpoint could layer an LLM-written digest on top of the
 * same flags, same pattern as the other slices.)
 */

export type TriageSeverity = "alert" | "warn" | "info";

export interface TriageFlag {
  label: string;
  severity: TriageSeverity;
}

export interface SubmissionTriage {
  /** One short, action-oriented line (the top flag, or an all-clear). */
  summary: string;
  /** Prioritized flags (alert → warn → info), capped for display. */
  flags: TriageFlag[];
}

/** The subset of a sacrament row the triage rules read. */
export interface TriageInput {
  type: "baptism" | "sponsor" | "marriage" | "funeral";
  email: string | null;
  phone: string | null;
  submittedAt: string;
  preferredDate: string | null;
  stage: "new" | "contacted" | "scheduled" | "completed" | "declined";
  urgent: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const SEVERITY_RANK: Record<TriageSeverity, number> = { alert: 0, warn: 1, info: 2 };
const MAX_FLAGS = 4;

/** Whole days between two instants (a - b), floored. */
function daysBetween(a: number, b: number): number {
  return Math.floor((a - b) / DAY_MS);
}

/** Local midnight of the day containing `d`. */
function startOfLocalDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/**
 * Parse a preferred-date string to a start-of-local-day timestamp, or null if
 * free-form/blank. Date-only strings ("YYYY-MM-DD" from <input type="date">)
 * are parsed as LOCAL dates — `new Date("YYYY-MM-DD")` would parse as UTC and
 * shift the calendar day in negative-offset zones (e.g. mark "today" as passed).
 */
function parsePreferred(s: string | null): number | null {
  if (!s) return null;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])).getTime();
  const d = new Date(s);
  return Number.isFinite(d.getTime()) ? startOfLocalDay(d) : null;
}

/**
 * Build the triage read for a submission. `now` is injected for testability.
 * Never throws; unparseable dates simply skip the date-based rules.
 */
export function triageSacrament(row: TriageInput, now: Date): SubmissionTriage {
  const nowMs = now.getTime();
  const todayStart = startOfLocalDay(now);
  const isOpen = row.stage !== "completed" && row.stage !== "declined";
  const flags: TriageFlag[] = [];

  // Closed submissions (completed/declined) need no follow-up — keep them quiet.
  // Immediate need (funeral, not pre-planning) — highest priority.
  if (isOpen && row.urgent) flags.push({ label: "Immediate need", severity: "alert" });

  // Awaiting first reply — only meaningful while still "new".
  if (isOpen && row.stage === "new") {
    const days = Math.max(0, daysBetween(nowMs, new Date(row.submittedAt).getTime()));
    if (Number.isFinite(days)) {
      if (days >= 7) flags.push({ label: `No reply in ${days}d`, severity: "alert" });
      else if (days >= 3) flags.push({ label: `Awaiting reply ${days}d`, severity: "warn" });
      else flags.push({ label: days === 0 ? "New today" : `New ${days}d ago`, severity: "info" });
    }
  }

  // Requested date approaching / passed (while unscheduled).
  const pref = parsePreferred(row.preferredDate);
  if (isOpen && pref !== null && row.stage !== "scheduled") {
    const daysUntil = daysBetween(pref, todayStart); // calendar days, not affected by time of day
    if (daysUntil < 0) flags.push({ label: "Requested date passed", severity: "alert" });
    else if (daysUntil <= 14) flags.push({ label: `Date in ${daysUntil}d — not scheduled`, severity: "warn" });
  }

  // Missing contact info (only actionable while the submission is still open).
  if (isOpen && !row.email) flags.push({ label: "No email on file", severity: "warn" });
  if (isOpen && !row.phone) flags.push({ label: "No phone on file", severity: "info" });

  flags.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);
  const capped = flags.slice(0, MAX_FLAGS);

  const summary = capped.length > 0
    ? capped[0].label
    : (isOpen ? "No action needed right now" : "Closed");

  return { summary, flags: capped };
}
