/**
 * Weather Service — Open-Meteo API (free, no key required)
 * Provides weather forecasts for Armonk, NY (St. Patrick Church)
 * Used for contextual weather badges on upcoming events.
 */

// St. Patrick in Armonk coordinates
const ARMONK_LAT = 41.1334;
const ARMONK_LON = -73.7254;

export interface HourlyForecast {
  time: string;
  temperature: number; // Fahrenheit
  apparentTemperature: number; // Fahrenheit (feels like)
  precipitationProbability: number; // 0-100
  precipitation: number; // inches
  weatherCode: number; // WMO code
  cloudCover: number; // 0-100
  windSpeed: number; // mph
  isDay: boolean;
}

export interface EventWeather {
  temperature: number;
  feelsLike: number;
  precipProbability: number;
  precipAmount: number;
  weatherCode: number;
  description: string;
  icon: string;
  windSpeed: number;
  isDay: boolean;
  isRainWarning: boolean;
  isSevereWarning: boolean;
  forecastStrip: Array<{
    time: string;
    label: string;
    temperature: number;
    precipProbability: number;
    weatherCode: number;
    icon: string;
  }>;
}

// WMO Weather Code mapping
const WMO_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: "Clear sky", icon: "clear" },
  1: { description: "Mainly clear", icon: "mostly-clear" },
  2: { description: "Partly cloudy", icon: "partly-cloudy" },
  3: { description: "Overcast", icon: "overcast" },
  45: { description: "Foggy", icon: "fog" },
  48: { description: "Rime fog", icon: "fog" },
  51: { description: "Light drizzle", icon: "drizzle" },
  53: { description: "Moderate drizzle", icon: "drizzle" },
  55: { description: "Dense drizzle", icon: "rain" },
  56: { description: "Freezing drizzle", icon: "rain" },
  57: { description: "Dense freezing drizzle", icon: "rain" },
  61: { description: "Slight rain", icon: "light-rain" },
  63: { description: "Moderate rain", icon: "rain" },
  65: { description: "Heavy rain", icon: "heavy-rain" },
  66: { description: "Freezing rain", icon: "rain" },
  67: { description: "Heavy freezing rain", icon: "heavy-rain" },
  71: { description: "Slight snow", icon: "light-snow" },
  73: { description: "Moderate snow", icon: "snow" },
  75: { description: "Heavy snow", icon: "heavy-snow" },
  77: { description: "Snow grains", icon: "snow" },
  80: { description: "Light showers", icon: "light-rain" },
  81: { description: "Moderate showers", icon: "rain" },
  82: { description: "Violent showers", icon: "heavy-rain" },
  85: { description: "Light snow showers", icon: "light-snow" },
  86: { description: "Heavy snow showers", icon: "heavy-snow" },
  95: { description: "Thunderstorm", icon: "thunderstorm" },
  96: { description: "Thunderstorm with hail", icon: "thunderstorm" },
  99: { description: "Severe thunderstorm", icon: "thunderstorm" },
};

function getWeatherInfo(code: number): { description: string; icon: string } {
  return WMO_CODES[code] || { description: "Unknown", icon: "clear" };
}

// In-memory cache (60 min TTL)
let weatherCache: { hourly: HourlyForecast[]; fetchedAt: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000;

/**
 * Fetch 7-day hourly forecast from Open-Meteo for Armonk, NY
 */
async function fetchForecast(): Promise<HourlyForecast[]> {
  if (weatherCache && Date.now() - weatherCache.fetchedAt < CACHE_TTL) {
    return weatherCache.hourly;
  }

  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", ARMONK_LAT.toString());
    url.searchParams.set("longitude", ARMONK_LON.toString());
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
    url.searchParams.set("forecast_days", "7");

    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error(`Open-Meteo API error: ${response.status}`);
      return weatherCache?.hourly || [];
    }

    const data = await response.json();
    const hourly = data.hourly;

    const forecasts: HourlyForecast[] = hourly.time.map((time: string, i: number) => ({
      time,
      temperature: Math.round(hourly.temperature_2m[i]),
      apparentTemperature: Math.round(hourly.apparent_temperature[i]),
      precipitationProbability: hourly.precipitation_probability[i] || 0,
      precipitation: hourly.precipitation[i] || 0,
      weatherCode: hourly.weather_code[i] || 0,
      cloudCover: hourly.cloud_cover[i] || 0,
      windSpeed: Math.round(hourly.wind_speed_10m[i] || 0),
      isDay: hourly.is_day[i] === 1,
    }));

    weatherCache = { hourly: forecasts, fetchedAt: Date.now() };
    return forecasts;
  } catch (error) {
    console.error("Weather fetch error:", error);
    return weatherCache?.hourly || [];
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

  // Find closest forecast hour to event start
  const eventTime = eventDate.getTime();
  let closest = forecasts[0];
  let closestDiff = Math.abs(new Date(closest.time).getTime() - eventTime);

  for (const f of forecasts) {
    const diff = Math.abs(new Date(f.time).getTime() - eventTime);
    if (diff < closestDiff) {
      closest = f;
      closestDiff = diff;
    }
  }

  // If closest is more than 6 hours away, skip (relaxed for daily schedule views)
  if (closestDiff > 6 * 60 * 60 * 1000) return null;

  const weatherInfo = getWeatherInfo(closest.weatherCode);

  // Build 3-slot forecast strip around event time
  const stripForecasts = forecasts.filter(f => {
    const fTime = new Date(f.time).getTime();
    return fTime >= eventTime - 2 * 60 * 60 * 1000 &&
           fTime <= eventTime + 4 * 60 * 60 * 1000;
  }).slice(0, 4);

  const forecastStrip = stripForecasts.map(f => {
    const fDate = new Date(f.time);
    const hour = fDate.getHours();
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
 * Detect outdoor events from title/description/location heuristics
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
 */
export async function getWeatherForEvents(
  events: Array<{ id: string; title: string; description?: string; location?: string; startDate: string }>
): Promise<Record<string, { weather: EventWeather | null; isOutdoor: boolean; isHighAttendance: boolean; parkingAdvisory: string | null }>> {
  const result: Record<string, { weather: EventWeather | null; isOutdoor: boolean; isHighAttendance: boolean; parkingAdvisory: string | null }> = {};

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today
  const sevenDaysOut = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  for (const event of events) {
    const eventDate = new Date(event.startDate);
    if (eventDate > sevenDaysOut || eventDate < todayStart) continue;

    const outdoor = isOutdoorEvent(event);
    const highAttendance = isHighAttendanceEvent(event);

    // Show weather for ALL events within 7 days
    const weather = await getWeatherForEvent(event.startDate);
    const parkingAdvisory = highAttendance ? getParkingAdvisory(event) : null;

    result[event.id] = { weather, isOutdoor: outdoor, isHighAttendance: highAttendance, parkingAdvisory };
  }

  return result;
}
