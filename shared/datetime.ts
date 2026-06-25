/**
 * Timezone helpers — the parish lives in America/New_York. Server hosts run in
 * UTC and admins may travel, so any "what time is it for the parish" question
 * must be answered in Eastern time, not the runtime-local zone.
 *
 * `nowInET()` returns a Date whose *local* accessors (getHours, getDate,
 * getDay, getMonth, getFullYear, getMinutes) read out the Eastern wall-clock.
 * It is built from Intl.DateTimeFormat parts, NOT from the lossy
 * `new Date(d.toLocaleString("en-US", { timeZone }))` re-parse idiom (which
 * round-trips through a zoneless string and mis-offsets in positive-UTC
 * browsers). Use this anywhere you need ET-local date/time fields.
 */

const ET_ZONE = "America/New_York";

/** Build a Date carrying the Eastern wall-clock of `instant` in its local fields. */
export function toEasternWallClock(instant: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ET_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(instant);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  let hour = Number(get("hour"));
  if (hour === 24) hour = 0; // Intl can emit "24" for midnight in hour12:false

  return new Date(
    Number(get("year")),
    Number(get("month")) - 1,
    Number(get("day")),
    hour,
    Number(get("minute")),
    Number(get("second")),
  );
}

/** "Now" in the parish's Eastern timezone, as ET-local wall-clock fields. */
export function nowInET(): Date {
  return toEasternWallClock(new Date());
}
