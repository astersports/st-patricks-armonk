/**
 * Current Weather — real-time conditions for Armonk, NY.
 *
 * Fetches from Open-Meteo (free, no API key required) with a 15-minute
 * server-side cache and stale-on-error fallback.
 */

import type { CurrentWeather } from "./types";
import { ARMONK_LAT, ARMONK_LON, FETCH_TIMEOUT_MS } from "./types";
import { getWeatherInfo, formatSunTime, getCached, setCached } from "./helpers";

const CURRENT_TTL_MS = 15 * 60 * 1000; // 15 minutes
const CACHE_KEY = "weather:current";
const STALE_KEY = "weather:current:stale";
const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function getCurrentWeather(): Promise<CurrentWeather | null> {
  const cached = getCached<CurrentWeather>(CACHE_KEY);
  if (cached) return cached;

  try {
    const url = new URL(BASE_URL);
    url.searchParams.set("latitude", String(ARMONK_LAT));
    url.searchParams.set("longitude", String(ARMONK_LON));
    url.searchParams.set("current", [
      "temperature_2m",
      "apparent_temperature",
      "weather_code",
      "wind_speed_10m",
      "relative_humidity_2m",
      "is_day",
    ].join(","));
    url.searchParams.set("daily", "sunrise,sunset");
    url.searchParams.set("temperature_unit", "fahrenheit");
    url.searchParams.set("wind_speed_unit", "mph");
    url.searchParams.set("precipitation_unit", "inch");
    url.searchParams.set("timezone", "America/New_York");
    url.searchParams.set("forecast_days", "1");

    const res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
    const data = await res.json() as {
      current: {
        temperature_2m: number;
        apparent_temperature: number;
        weather_code: number;
        wind_speed_10m: number;
        relative_humidity_2m: number;
        is_day: number;
      };
      daily?: { sunrise?: string[]; sunset?: string[] };
    };

    const c = data.current;
    const info = getWeatherInfo(c.weather_code);
    const result: CurrentWeather = {
      temperature: Math.round(c.temperature_2m),
      feelsLike: Math.round(c.apparent_temperature),
      weatherCode: c.weather_code,
      description: info.description,
      icon: info.icon,
      windSpeed: Math.round(c.wind_speed_10m),
      isDay: c.is_day === 1,
      humidity: c.relative_humidity_2m,
      sunrise: formatSunTime(data.daily?.sunrise?.[0] ?? ""),
      sunset: formatSunTime(data.daily?.sunset?.[0] ?? ""),
    };

    setCached(CACHE_KEY, result, CURRENT_TTL_MS);
    setCached(STALE_KEY, result, 24 * 60 * 60 * 1000); // keep stale for 24 h
    return result;
  } catch {
    return getCached<CurrentWeather>(STALE_KEY) ?? null;
  }
}
