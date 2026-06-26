/**
 * Weather Service Helpers — sourced from the shared @aster/weather engine.
 *
 * The WMO code map (getWeatherInfo) and the sunrise/sunset clock formatter
 * (parseOpenMeteoLocalTime) are re-exported from the canonical package so this
 * repo no longer carries a duplicate map. `toParishLocalIso` derives a
 * venue-local clock string from the package's absolute epoch-ms timestamps —
 * the shared engine intentionally drops the timezone-naive `time` string
 * (it matches hours on absolute epoch arithmetic; see @aster/weather DL-13).
 */
import { TZDate } from "@date-fns/tz";

export { getWeatherInfo, parseOpenMeteoLocalTime } from "@aster/weather";

// St. Patrick in Armonk is in the Eastern time zone.
const PARISH_TZ = "America/New_York";

/**
 * Build a venue-local "YYYY-MM-DDTHH:mm" string from an absolute epoch-ms
 * timestamp. Used to re-attach the `time` field that the forecast strip labels
 * read for the Morning/Afternoon/Evening bucket.
 */
export function toParishLocalIso(timestamp: number): string {
  const d = new TZDate(timestamp, PARISH_TZ);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
