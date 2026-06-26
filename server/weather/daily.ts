/**
 * Daily Forecast — 7-day high/low, precipitation, sunrise/sunset for Armonk, NY.
 *
 * Fetches from Open-Meteo (free, no API key required) with a 30-minute
 * server-side cache and stale-on-error fallback.
 */

import type { DailyForecast } from "./types";
import { ARMONK_LAT, ARMONK_LON, FETCH_TIMEOUT_MS, FORECAST_DAYS } from "./types";
import { getWeatherInfo, formatSunTime, getCached, setCached } from "./helpers";

const DAILY_TTL_MS = 30 * 60 * 1000; // 30 minutes
const CACHE_KEY = "weather:daily";
const STALE_KEY = "weather:daily:stale";
const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function getDailyForecast(): Promise<DailyForecast[]> {
  const cached = getCached<DailyForecast[]>(CACHE_KEY);
  if (cached) return cached;

  try {
    const url = new URL(BASE_URL);
    url.searchParams.set("latitude", String(ARMONK_LAT));
    url.searchParams.set("longitude", String(ARMONK_LON));
    url.searchParams.set("daily", [
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "weather_code",
      "sunrise",
      "sunset",
    ].join(","));
    url.searchParams.set("temperature_unit", "fahrenheit");
    url.searchParams.set("wind_speed_unit", "mph");
    url.searchParams.set("precipitation_unit", "inch");
    url.searchParams.set("timezone", "America/New_York");
    url.searchParams.set("forecast_days", String(FORECAST_DAYS));

    const res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
    const data = await res.json() as {
      daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_probability_max: (number | null)[];
        weather_code: number[];
        sunrise: string[];
        sunset: string[];
      };
    };

    const d = data.daily;
    const result: DailyForecast[] = d.time.map((date, i) => {
      const info = getWeatherInfo(d.weather_code[i]);
      return {
        date,
        high: Math.round(d.temperature_2m_max[i]),
        low: Math.round(d.temperature_2m_min[i]),
        precipProbabilityMax: d.precipitation_probability_max[i] ?? 0,
        weatherCode: d.weather_code[i],
        icon: info.icon,
        description: info.description,
        sunrise: formatSunTime(d.sunrise[i]),
        sunset: formatSunTime(d.sunset[i]),
      };
    });

    setCached(CACHE_KEY, result, DAILY_TTL_MS);
    setCached(STALE_KEY, result, 24 * 60 * 60 * 1000); // keep stale for 24 h
    return result;
  } catch {
    return getCached<DailyForecast[]>(STALE_KEY) ?? [];
  }
}
