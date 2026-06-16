/**
 * WeatherBadge — Contextual weather display for upcoming events.
 * Shows temperature, condition, and precipitation probability.
 * Glows amber when rain probability > 40%.
 */
import { Cloud, CloudRain, CloudSnow, CloudSun, CloudLightning, Wind, Droplets } from "lucide-react";

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

/** Custom filled sun icon - large center, short thick rays, unmistakably sunny */
function SunIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={`${className} text-amber-500`} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <circle cx="12" cy="12" r="6" />
      <rect x="11" y="1" width="2" height="4" rx="1" />
      <rect x="11" y="19" width="2" height="4" rx="1" />
      <rect x="19" y="11" width="4" height="2" rx="1" />
      <rect x="1" y="11" width="4" height="2" rx="1" />
      <rect x="17.4" y="3.8" width="2" height="4" rx="1" transform="rotate(45 18.4 5.8)" />
      <rect x="4.6" y="16.2" width="2" height="4" rx="1" transform="rotate(45 5.6 18.2)" />
      <rect x="17.4" y="16.2" width="2" height="4" rx="1" transform="rotate(-45 18.4 18.2)" />
      <rect x="4.6" y="3.8" width="2" height="4" rx="1" transform="rotate(-45 5.6 5.8)" />
    </svg>
  );
}

/** Partly cloudy: sun peeking behind cloud */
function PartlySunIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <circle cx="10" cy="8" r="3.5" fill="currentColor" opacity="0.7" />
      <path d="M10 3v1.5M10 12.5V14M5.05 5.05l1.06 1.06M13.89 13.89l1.06 1.06M3 8h1.5M16 8h.5M5.05 10.95l1.06-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M7 17h10a4 4 0 0 0 0-8h-.5A5.5 5.5 0 0 0 6 11.5 4 4 0 0 0 7 17z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function WeatherIcon({ icon, className = "w-4 h-4" }: { icon: string; className?: string }) {
  switch (icon) {
    case "clear":
    case "mostly-clear":
      return <SunIcon className={className} />;
    case "partly-cloudy":
      return <PartlySunIcon className={className} />;
    case "overcast":
    case "fog":
      return <Cloud className={className} />;
    case "drizzle":
    case "light-rain":
    case "rain":
    case "heavy-rain":
      return <CloudRain className={className} />;
    case "light-snow":
    case "snow":
    case "heavy-snow":
      return <CloudSnow className={className} />;
    case "thunderstorm":
      return <CloudLightning className={className} />;
    default:
      return <SunIcon className={className} />;
  }
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
        <WeatherIcon icon={icon} className="w-3 h-3" />
        <span>{temperature}°F</span>
        {precipProbability > 20 && (
          <span className="flex items-center gap-0.5">
            <Droplets className="w-2.5 h-2.5" />
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
      <WeatherIcon icon={icon} className="w-4 h-4 shrink-0" />
      <span className="font-semibold">{temperature}°F</span>
      <span className="text-xs opacity-75">·</span>
      <span className="text-xs">{description}</span>
      {precipProbability > 20 && (
        <>
          <span className="text-xs opacity-75">·</span>
          <span className="flex items-center gap-0.5 text-xs">
            <Droplets className="w-3 h-3" />
            {precipProbability}% rain
          </span>
        </>
      )}
      {weather.windSpeed > 15 && (
        <>
          <span className="text-xs opacity-75">·</span>
          <span className="flex items-center gap-0.5 text-xs">
            <Wind className="w-3 h-3" />
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
          <WeatherIcon icon={slot.icon} className="w-3.5 h-3.5" />
          <span className="font-semibold">{slot.temperature}°</span>
          {slot.precipProbability > 20 && (
            <span className="text-[10px] text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
              <Droplets className="w-2 h-2" />
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
