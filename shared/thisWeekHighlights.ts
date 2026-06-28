/**
 * "This Week at the Parish" highlights — pure + testable.
 *
 * Aggregates the parish's own structured items (events, key dates, holy days,
 * urgent volunteer needs) into a single window-filtered, sorted, de-duplicated
 * list for a parishioner-facing "what's coming up" card. Pure: no IO, no env —
 * the server feeds it live rows; the same logic could run client-side.
 *
 * Deterministic so the card works with NO AI key (the sandbox default); the
 * server layers an optional AI-written intro on top, summarizing only these
 * parish-provided facts (no theology, bounded hallucination risk).
 */

export type HighlightKind = "event" | "key_date" | "holy_day" | "volunteer";

/** Normalized input row (the server maps DB rows into this shape). */
export interface RawHighlight {
  kind: HighlightKind;
  title: string;
  /** When it happens. Holy days / key dates are all-day (see allDay). */
  date: Date;
  location?: string | null;
  note?: string | null;
  /** Suppress the time portion of the label (key dates, holy days). */
  allDay?: boolean;
  /** Flag urgent volunteer needs for emphasis. */
  urgent?: boolean;
}

/** Output row consumed by the UI card. */
export interface Highlight {
  kind: HighlightKind;
  title: string;
  /** ISO timestamp (stable, timezone-independent serialization). */
  iso: string;
  /** Human label in parish-local time, e.g. "Sun, Jun 28" or "Sun, Jun 28 · 7:00 PM". */
  dateLabel: string;
  location?: string;
  note?: string;
  urgent?: boolean;
}

export interface BuildOptions {
  /** Days ahead to include (inclusive). Default 7. */
  windowDays?: number;
  /** Max items returned. Default 8. */
  max?: number;
  /** IANA timezone for labels. Default America/New_York (the parish's zone). */
  timeZone?: string;
}

const DEFAULTS: Required<BuildOptions> = {
  windowDays: 7,
  max: 8,
  timeZone: "America/New_York",
};

/** Start of the day containing `now`, in UTC terms (lower bound is inclusive). */
function startOfDay(now: Date): Date {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Format a highlight's date for display in the parish timezone. */
export function formatHighlightDate(date: Date, allDay: boolean, timeZone = DEFAULTS.timeZone): string {
  const day = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone,
  });
  if (allDay) return day;
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  });
  return `${day} · ${time}`;
}

/**
 * Build the windowed, sorted, de-duplicated highlight list. Never throws on odd
 * input: invalid dates and blank titles are dropped.
 */
export function buildThisWeekHighlights(
  items: RawHighlight[],
  now: Date,
  options: BuildOptions = {},
): Highlight[] {
  const { windowDays, max, timeZone } = { ...DEFAULTS, ...options };

  const lower = startOfDay(now).getTime();
  const upper = lower + windowDays * 24 * 60 * 60 * 1000;

  const seen = new Set<string>();
  const out: Highlight[] = [];

  for (const item of items) {
    const t = item.date instanceof Date ? item.date.getTime() : NaN;
    if (!Number.isFinite(t)) continue;
    if (t < lower || t > upper) continue;

    const title = (item.title || "").trim();
    if (!title) continue;

    // De-dupe on kind + title + calendar timestamp.
    const key = `${item.kind}|${title}|${t}`;
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({
      kind: item.kind,
      title,
      iso: item.date.toISOString(),
      dateLabel: formatHighlightDate(item.date, !!item.allDay, timeZone),
      ...(item.location ? { location: item.location } : {}),
      ...(item.note ? { note: item.note } : {}),
      ...(item.urgent ? { urgent: true } : {}),
    });
  }

  out.sort((a, b) => a.iso.localeCompare(b.iso));
  return out.slice(0, max);
}

/** Deterministic, no-AI intro line for the card (the always-available fallback). */
export function defaultHighlightsIntro(count: number): string {
  if (count === 0) return "Nothing on the parish calendar in the week ahead — check back soon.";
  if (count === 1) return "One thing coming up at St. Patrick's this week:";
  return `Here's what's coming up at St. Patrick's this week — ${count} things on the calendar:`;
}
