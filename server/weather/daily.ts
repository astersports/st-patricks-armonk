/**
 * Daily Forecast — 7-day high/low, precipitation, sunrise/sunset for Armonk, NY.
 *
 * Thin adapter over the shared @aster/weather engine, which owns the
 * Open-Meteo fetch, the 60-minute per-coordinate cache, in-flight dedup, and
 * stale-on-error fallback.
 */

import type { DailyForecast } from "./types";
import { ARMONK_LAT, ARMONK_LON } from "./types";
import { getDailyForecast as fetchDailyForecast } from "@aster/weather";

export async function getDailyForecast(): Promise<DailyForecast[]> {
  return fetchDailyForecast({ lat: ARMONK_LAT, lon: ARMONK_LON });
}
