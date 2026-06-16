/**
 * WeatherBadge — Contextual weather display for upcoming events.
 * Shows temperature, condition, and precipitation probability.
 * Uses colorful multi-color SVG icons for a polished look.
 */
import { ColorfulWeatherIcon, DropletIcon, WindIcon } from "@/components/WeatherIcons";

interface WeatherData {
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

export function WeatherBadge({
  weather,
  compact = false,
}: {
  weather: WeatherData;
  compact?: boolean;
}) {
  const { temperature, description, icon, precipProbability, isRainWarning, isSevereWarning } = weather;

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
          isSevereWarning
            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
            : isRainWarning
            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 animate-pulse-subtle"
            : "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300"
        }`}
      >
        <ColorfulWeatherIcon icon={icon} className="w-3.5 h-3.5" />
        <span>{temperature}°F</span>
        {precipProbability > 20 && (
          <span className="flex items-center gap-0.5">
            <DropletIcon className="w-2.5 h-2.5" />
            {precipProbability}%
          </span>
        )}
      </span>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-all ${
        isSevereWarning
          ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-800 dark:text-red-200"
          : isRainWarning
          ? "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.15)]"
          : "bg-sky-50 border-sky-200 text-sky-800 dark:bg-sky-950/30 dark:border-sky-800 dark:text-sky-200"
      }`}
    >
      <ColorfulWeatherIcon icon={icon} className="w-5 h-5 shrink-0" />
      <span className="font-semibold">{temperature}°F</span>
      <span className="text-xs opacity-75">·</span>
      <span className="text-xs">{description}</span>
      {precipProbability > 20 && (
        <>
          <span className="text-xs opacity-75">·</span>
          <span className="flex items-center gap-0.5 text-xs">
            <DropletIcon className="w-3 h-3" />
            {precipProbability}% rain
          </span>
        </>
      )}
      {weather.windSpeed > 15 && (
        <>
          <span className="text-xs opacity-75">·</span>
          <span className="flex items-center gap-0.5 text-xs">
            <WindIcon className="w-3.5 h-3.5" />
            {weather.windSpeed} mph
          </span>
        </>
      )}
    </div>
  );
}

export function WeatherForecastStrip({ weather }: { weather: WeatherData }) {
  if (!weather.forecastStrip || weather.forecastStrip.length === 0) return null;

  return (
    <div className="flex gap-1 mt-2">
      {weather.forecastStrip.map((slot, i) => (
        <div
          key={i}
          className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-md text-xs ${
            slot.precipProbability > 40
              ? "bg-amber-50 dark:bg-amber-950/20"
              : "bg-muted/50"
          }`}
        >
          <span className="text-[10px] text-muted-foreground font-medium">{slot.label}</span>
          <ColorfulWeatherIcon icon={slot.icon} className="w-4 h-4" />
          <span className="font-semibold">{slot.temperature}°</span>
          {slot.precipProbability > 20 && (
            <span className="text-[10px] text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
              <DropletIcon className="w-2 h-2" />
              {slot.precipProbability}%
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function ParkingAdvisory({ advisory }: { advisory: string }) {
  return (
    <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-orange-50 border border-orange-200 text-orange-800 dark:bg-orange-950/30 dark:border-orange-800 dark:text-orange-200 text-xs">
      <span className="text-base shrink-0 mt-[-1px]">🚗</span>
      <span>{advisory}</span>
    </div>
  );
}
