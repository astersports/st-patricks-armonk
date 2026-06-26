/**
 * Weather Service Helpers — WMO code map, timezone utilities, and shared cache.
 *
 * `getWeatherInfo` maps WMO weather codes to human-readable descriptions and
 * icon slugs. `parseOpenMeteoLocalTime` converts the timezone-naive time string
 * that Open-Meteo returns into an absolute epoch-ms timestamp anchored to the
 * parish's local timezone. `toParishLocalIso` is the reverse: it builds a
 * venue-local "YYYY-MM-DDTHH:mm" string from an epoch timestamp.
 */
import { TZDate } from "@date-fns/tz";

// St. Patrick in Armonk is in the Eastern time zone.
const PARISH_TZ = "America/New_York";

// ---------------------------------------------------------------------------
// Shared in-memory cache (keyed strings, TTL-based)
// ---------------------------------------------------------------------------

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const _cache = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | undefined {
  const entry = _cache.get(key) as CacheEntry<T> | undefined;
  if (entry && Date.now() < entry.expiresAt) return entry.data;
  return undefined;
}

export function setCached<T>(key: string, data: T, ttlMs: number): void {
  _cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

// ---------------------------------------------------------------------------
// WMO weather code → description + icon slug
// ---------------------------------------------------------------------------

const WMO_MAP: Record<number, { description: string; icon: string }> = {
  0: { description: "Clear sky", icon: "clear" },
  1: { description: "Mainly clear", icon: "partly-cloudy" },
  2: { description: "Partly cloudy", icon: "partly-cloudy" },
  3: { description: "Overcast", icon: "overcast" },
  45: { description: "Fog", icon: "fog" },
  48: { description: "Icy fog", icon: "fog" },
  51: { description: "Light drizzle", icon: "drizzle" },
  53: { description: "Moderate drizzle", icon: "drizzle" },
  55: { description: "Dense drizzle", icon: "drizzle" },
  56: { description: "Light freezing drizzle", icon: "drizzle" },
  57: { description: "Heavy freezing drizzle", icon: "drizzle" },
  61: { description: "Light rain", icon: "rain" },
  63: { description: "Moderate rain", icon: "rain" },
  65: { description: "Heavy rain", icon: "heavy-rain" },
  66: { description: "Light freezing rain", icon: "rain" },
  67: { description: "Heavy freezing rain", icon: "heavy-rain" },
  71: { description: "Light snow", icon: "snow" },
  73: { description: "Moderate snow", icon: "snow" },
  75: { description: "Heavy snow", icon: "snow" },
  77: { description: "Snow grains", icon: "snow" },
  80: { description: "Light rain showers", icon: "rain" },
  81: { description: "Moderate rain showers", icon: "rain" },
  82: { description: "Violent rain showers", icon: "heavy-rain" },
  85: { description: "Light snow showers", icon: "snow" },
  86: { description: "Heavy snow showers", icon: "snow" },
  95: { description: "Thunderstorm", icon: "thunderstorm" },
  96: { description: "Thunderstorm with hail", icon: "thunderstorm" },
  99: { description: "Thunderstorm with heavy hail", icon: "thunderstorm" },
};

export function getWeatherInfo(code: number): { description: string; icon: string } {
  return WMO_MAP[code] ?? { description: "Unknown", icon: "overcast" };
}

// ---------------------------------------------------------------------------
// Timezone helpers
// ---------------------------------------------------------------------------

/**
 * Parse an Open-Meteo time string ("YYYY-MM-DDTHH:mm") — which is expressed in
 * the requested timezone — to an absolute epoch-ms timestamp.
 */
export function parseOpenMeteoLocalTime(time: string): number {
  const [datePart, timePart = "00:00"] = time.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return new TZDate(year, month - 1, day, hour, minute, 0, 0, PARISH_TZ).getTime();
}

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

/**
 * Format an Open-Meteo time string ("YYYY-MM-DDTHH:mm") as a 12-hour clock
 * string (e.g. "5:21 AM"). Used for sunrise/sunset display.
 */
export function formatSunTime(timeStr: string): string {
  const timePart = timeStr.split("T")[1];
  if (!timePart) return "";
  const [hourStr, min] = timePart.split(":");
  const hour = parseInt(hourStr, 10);
  const ampm = hour < 12 ? "AM" : "PM";
  const h12 = hour % 12 || 12;
  return `${h12}:${min} ${ampm}`;
}
