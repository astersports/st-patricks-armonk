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

/**
 * The calendar day of `date` in `timeZone`, expressed as an integer day index
 * (days since the epoch). Comparing these indices windows by *parish-local*
 * calendar day regardless of the host's timezone (servers run in UTC), so items
 * near midnight ET aren't mis-included/excluded.
 */
function localDayNumber(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const y = Number(parts.find((p) => p.type === "year")?.value);
  const m = Number(parts.find((p) => p.type === "month")?.value);
  const d = Number(parts.find((p) => p.type === "day")?.value);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
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

  // Window by parish-local calendar day: today (inclusive) through today+windowDays.
  const lowerDay = localDayNumber(now, timeZone);
  const upperDay = lowerDay + windowDays;

  const seen = new Set<string>();
  const out: Highlight[] = [];

  for (const item of items) {
    const t = item.date instanceof Date ? item.date.getTime() : NaN;
    if (!Number.isFinite(t)) continue;
    const day = localDayNumber(item.date, timeZone);
    if (day < lowerDay || day > upperDay) continue;

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
