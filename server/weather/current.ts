/**
 * Current Weather — real-time conditions for Armonk, NY.
 *
 * Thin adapter over the shared @aster/weather engine, which owns the
 * Open-Meteo fetch, the 15-minute per-coordinate cache, in-flight dedup, and
 * stale-on-error fallback. Coordinates are the only parish-specific input.
 */

import type { CurrentWeather } from "./types";
import { ARMONK_LAT, ARMONK_LON } from "./types";
import { getCurrentWeather as fetchCurrentWeather } from "@aster/weather";

export async function getCurrentWeather(): Promise<CurrentWeather | null> {
  return fetchCurrentWeather({ lat: ARMONK_LAT, lon: ARMONK_LON });
}
