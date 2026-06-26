/**
 * Hourly Forecast & Event Weather Enrichment
 * Provides weather data for specific events and batch enrichment.
 */

import type { HourlyForecast, EventWeather } from "./types";
import { ARMONK_LAT, ARMONK_LON, MAX_FORECAST_HOUR_GAP_MS, FETCH_TIMEOUT_MS, FORECAST_DAYS } from "./types";
import { getWeatherInfo, toParishLocalIso, parseOpenMeteoLocalTime, getCached, setCached } from "./helpers";

const HOURLY_TTL_MS = 60 * 60 * 1000; // 60 minutes
const CACHE_KEY = "weather:forecast";
const STALE_KEY = "weather:forecast:stale";
const BASE_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Fetch the 7-day hourly forecast for Armonk, NY from Open-Meteo (free, no API
 * key required). Results are cached for 60 minutes with a stale-on-error fallback.
 */
export async function fetchForecast(): Promise<HourlyForecast[]> {
  const cached = getCached<HourlyForecast[]>(CACHE_KEY);
  if (cached) return cached;

  try {
    const url = new URL(BASE_URL);
    url.searchParams.set("latitude", String(ARMONK_LAT));
    url.searchParams.set("longitude", String(ARMONK_LON));
    url.searchParams.set("hourly", [
      "temperature_2m",
      "apparent_temperature",
      "precipitation_probability",
      "precipitation",
      "weather_code",
      "cloud_cover",
      "wind_speed_10m",
      "is_day",
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
      hourly: {
        time: string[];
        temperature_2m: number[];
        apparent_temperature: number[];
        precipitation_probability: (number | null)[];
        precipitation: (number | null)[];
        weather_code: number[];
        cloud_cover: (number | null)[];
        wind_speed_10m: number[];
        is_day: number[];
      };
    };

    const h = data.hourly;
    const result: HourlyForecast[] = h.time.map((t, i) => {
      const timestamp = parseOpenMeteoLocalTime(t);
      return {
        time: toParishLocalIso(timestamp),
        timestamp,
        temperature: Math.round(h.temperature_2m[i]),
        apparentTemperature: Math.round(h.apparent_temperature[i]),
        precipitationProbability: h.precipitation_probability[i] ?? 0,
        precipitation: h.precipitation[i] ?? 0,
        weatherCode: h.weather_code[i],
        cloudCover: h.cloud_cover[i] ?? 0,
        windSpeed: Math.round(h.wind_speed_10m[i]),
        isDay: h.is_day[i] === 1,
      };
    });

    setCached(CACHE_KEY, result, HOURLY_TTL_MS);
    setCached(STALE_KEY, result, 24 * 60 * 60 * 1000); // keep stale for 24 h
    return result;
  } catch {
    return getCached<HourlyForecast[]>(STALE_KEY) ?? [];
  }
}

/**
 * Get weather for a specific event time. Returns null if > 7 days away.
 */
export async function getWeatherForEvent(eventStartISO: string): Promise<EventWeather | null> {
  const eventDate = new Date(eventStartISO);
  const now = new Date();
  const daysAway = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (daysAway > 7 || daysAway < -1) return null; // Allow today's events even if start time is past

  const forecasts = await fetchForecast();
  if (forecasts.length === 0) return null;

  // Find closest forecast hour to event start using pre-computed timestamps
  const eventTime = eventDate.getTime();
  let closest = forecasts[0];
  let closestDiff = Math.abs(closest.timestamp - eventTime);

  for (const f of forecasts) {
    const diff = Math.abs(f.timestamp - eventTime);
    if (diff < closestDiff) {
      closest = f;
      closestDiff = diff;
    }
  }

  // If closest is more than 6 hours away, skip (relaxed for daily schedule views)
  if (closestDiff > MAX_FORECAST_HOUR_GAP_MS) return null;

  const weatherInfo = getWeatherInfo(closest.weatherCode);

  // Build 3-slot forecast strip around event time
  const stripForecasts = forecasts.filter(f => {
    return f.timestamp >= eventTime - 2 * 60 * 60 * 1000 &&
           f.timestamp <= eventTime + 4 * 60 * 60 * 1000;
  }).slice(0, 4);

  const forecastStrip = stripForecasts.map(f => {
    // Parse hour directly from the time string to avoid timezone issues
    const [, timePart] = f.time.split("T");
    const hour = parseInt(timePart?.split(":")[0] || "0", 10);
    let label = "Night";
    if (hour >= 5 && hour < 12) label = "Morning";
    else if (hour >= 12 && hour < 17) label = "Afternoon";
    else if (hour >= 17 && hour < 21) label = "Evening";
    return {
      time: f.time,
      label,
      temperature: f.temperature,
      precipProbability: f.precipitationProbability,
      weatherCode: f.weatherCode,
      icon: getWeatherInfo(f.weatherCode).icon,
    };
  });

  return {
    temperature: closest.temperature,
    feelsLike: closest.apparentTemperature,
    precipProbability: closest.precipitationProbability,
    precipAmount: closest.precipitation,
    weatherCode: closest.weatherCode,
    description: weatherInfo.description,
    icon: weatherInfo.icon,
    windSpeed: closest.windSpeed,
    isDay: closest.isDay,
    isRainWarning: closest.precipitationProbability > 40,
    isSevereWarning: closest.precipitationProbability > 70 ||
                     closest.temperature < 20 ||
                     closest.temperature > 100 ||
                     closest.windSpeed > 40,
    forecastStrip,
  };
}

/**
 * Detect outdoor events from title/description/location heuristics.
 * Note: broad keyword matching — intentionally permissive for a small parish site.
 */
export function isOutdoorEvent(event: { title: string; description?: string; location?: string }): boolean {
  const text = `${event.title} ${event.description || ""} ${event.location || ""}`.toLowerCase();
  const keywords = [
    "outdoor", "outside", "procession", "picnic", "bbq", "barbecue",
    "garden", "park", "field", "lawn", "parking lot", "walk", "hike",
    "blessing of", "stations of the cross", "living rosary",
    "corpus christi procession", "palm sunday procession",
    "easter egg hunt", "trunk or treat", "carnival", "fair",
    "sports", "soccer", "baseball", "softball", "track",
  ];
  return keywords.some(kw => text.includes(kw));
}

/**
 * Detect high-attendance events
 */
export function isHighAttendanceEvent(event: { title: string; description?: string }): boolean {
  const text = `${event.title} ${event.description || ""}`.toLowerCase();
  const keywords = [
    "easter", "christmas", "midnight mass", "christmas eve",
    "palm sunday", "ash wednesday", "holy thursday", "good friday",
    "easter vigil", "first communion", "confirmation mass",
    "parish picnic", "parish bbq", "parish carnival",
  ];
  return keywords.some(kw => text.includes(kw));
}

/**
 * Get parking advisory for high-attendance events
 */
export function getParkingAdvisory(event: { title: string }): string | null {
  const title = event.title.toLowerCase();
  if (title.includes("christmas eve") || title.includes("midnight mass")) {
    return "Expect full lots by 11:00 PM — carpooling recommended. Overflow at Town Hall lot on Bedford Rd.";
  }
  if (title.includes("easter") || title.includes("palm sunday")) {
    return "Expect full lots 15 min before Mass — arrive early. Overflow at Town Hall lot on Bedford Rd.";
  }
  if (title.includes("first communion") || title.includes("confirmation")) {
    return "Limited parking due to large families. Consider carpooling with other parish families.";
  }
  if (title.includes("parish picnic") || title.includes("parish bbq")) {
    return "Street parking on Cox Ave and Maple Ave. Please be mindful of neighbors.";
  }
  return null;
}

/**
 * Batch weather enrichment for events within 7 days.
 * Returns a map of event ID → enrichment data.
 * Pre-warms the forecast cache and uses Promise.all for parallel processing.
 */
export async function getWeatherForEvents(
  events: Array<{ id: string; title: string; description?: string; location?: string; startDate: string }>
): Promise<Record<string, { weather: EventWeather | null; isOutdoor: boolean; isHighAttendance: boolean; parkingAdvisory: string | null }>> {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysOut = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Filter events that are within the forecast window
  const eventsToEnrich = events.filter(event => {
    const eventDate = new Date(event.startDate);
    return eventDate <= sevenDaysOut && eventDate >= todayStart;
  });

  if (eventsToEnrich.length === 0) return {};

  // Pre-warm the forecast cache once before processing all events
  await fetchForecast();

  // Process all events in parallel (cache is warm, so these are synchronous lookups)
  const entries = await Promise.all(
    eventsToEnrich.map(async (event) => {
      const outdoor = isOutdoorEvent(event);
      const highAttendance = isHighAttendanceEvent(event);
      const weather = await getWeatherForEvent(event.startDate);
      const parkingAdvisory = highAttendance ? getParkingAdvisory(event) : null;
      return [event.id, { weather, isOutdoor: outdoor, isHighAttendance: highAttendance, parkingAdvisory }] as const;
    })
  );

  return Object.fromEntries(entries);
}
