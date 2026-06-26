/**
 * WeatherIcons — SVG weather icon components.
 *
 * Individual icons accept a `className` prop for sizing (Tailwind `w-*`/`h-*`).
 * `ColorfulWeatherIcon` is the primary dispatcher: it maps an icon-slug string
 * (as returned by `getWeatherInfo`) to the correct coloured component, with an
 * optional `isDay` flag to switch clear-sky icons between sun and moon variants.
 */
import React from "react";

interface IconProps {
  className?: string;
}

// ---------------------------------------------------------------------------
// Individual icons
// ---------------------------------------------------------------------------

export function SunnyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" fill="#FBC02D" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1={12 + 6.5 * Math.cos((deg * Math.PI) / 180)}
          y1={12 + 6.5 * Math.sin((deg * Math.PI) / 180)}
          x2={12 + 8.5 * Math.cos((deg * Math.PI) / 180)}
          y2={12 + 8.5 * Math.sin((deg * Math.PI) / 180)}
          stroke="#FBC02D"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function ClearNightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
        fill="#7986CB"
        stroke="#7986CB"
        strokeWidth="0.5"
      />
    </svg>
  );
}

export function PartlyCloudyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      {/* Sun */}
      <circle cx="8" cy="8" r="3" fill="#FBC02D" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <line
          key={deg}
          x1={8 + 4 * Math.cos((deg * Math.PI) / 180)}
          y1={8 + 4 * Math.sin((deg * Math.PI) / 180)}
          x2={8 + 5.2 * Math.cos((deg * Math.PI) / 180)}
          y2={8 + 5.2 * Math.sin((deg * Math.PI) / 180)}
          stroke="#FBC02D"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      ))}
      {/* Cloud */}
      <path
        d="M19 17H8a4 4 0 1 1 .86-7.9A4.5 4.5 0 1 1 19 17z"
        fill="#CFD8DC"
        stroke="#B0BEC5"
        strokeWidth="0.5"
      />
    </svg>
  );
}

export function PartlyCloudyNightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      {/* Moon */}
      <path
        d="M12 3a6 6 0 0 0 9 9 6 6 0 1 1-9-9z"
        fill="#7986CB"
        stroke="#7986CB"
        strokeWidth="0.5"
      />
      {/* Cloud */}
      <path
        d="M19 19H9a3.5 3.5 0 1 1 .78-6.9A4 4 0 1 1 19 19z"
        fill="#CFD8DC"
        stroke="#B0BEC5"
        strokeWidth="0.5"
      />
    </svg>
  );
}

export function OvercastIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 17H7a5 5 0 1 1 1.1-9.88A5.5 5.5 0 1 1 20 17z"
        fill="#90A4AE"
        stroke="#78909C"
        strokeWidth="0.5"
      />
    </svg>
  );
}

export function FogIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 9h14" stroke="#90A4AE" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 12h18" stroke="#90A4AE" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 15h14" stroke="#90A4AE" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 18h10" stroke="#90A4AE" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function DrizzleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M18 14H7a4 4 0 1 1 .86-7.9A4.5 4.5 0 1 1 18 14z"
        fill="#90A4AE"
        stroke="#78909C"
        strokeWidth="0.5"
      />
      <circle cx="9" cy="18" r="1" fill="#64B5F6" />
      <circle cx="13" cy="17" r="1" fill="#64B5F6" />
      <circle cx="17" cy="18" r="1" fill="#64B5F6" />
    </svg>
  );
}

export function RainIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M19 13H8a4 4 0 1 1 .86-7.9A4.5 4.5 0 1 1 19 13z"
        fill="#78909C"
        stroke="#607D8B"
        strokeWidth="0.5"
      />
      <line x1="8" y1="17" x2="7" y2="20" stroke="#42A5F5" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="12" y1="17" x2="11" y2="20" stroke="#42A5F5" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16" y1="17" x2="15" y2="20" stroke="#42A5F5" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function HeavyRainIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M19 12H8a4 4 0 1 1 .86-7.9A4.5 4.5 0 1 1 19 12z"
        fill="#546E7A"
        stroke="#455A64"
        strokeWidth="0.5"
      />
      <line x1="7" y1="16" x2="5.5" y2="21" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round" />
      <line x1="11" y1="16" x2="9.5" y2="21" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round" />
      <line x1="15" y1="16" x2="13.5" y2="21" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round" />
      <line x1="19" y1="16" x2="17.5" y2="21" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SnowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M19 13H8a4 4 0 1 1 .86-7.9A4.5 4.5 0 1 1 19 13z"
        fill="#90A4AE"
        stroke="#78909C"
        strokeWidth="0.5"
      />
      {/* Snowflake dots */}
      <circle cx="9" cy="18" r="1.2" fill="#90CAF9" />
      <circle cx="13" cy="17" r="1.2" fill="#90CAF9" />
      <circle cx="17" cy="18" r="1.2" fill="#90CAF9" />
      <circle cx="11" cy="20.5" r="1.2" fill="#90CAF9" />
      <circle cx="15" cy="20.5" r="1.2" fill="#90CAF9" />
    </svg>
  );
}

export function ThunderstormIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M19 12H8a4 4 0 1 1 .86-7.9A4.5 4.5 0 1 1 19 12z"
        fill="#546E7A"
        stroke="#455A64"
        strokeWidth="0.5"
      />
      {/* Lightning bolt */}
      <path
        d="M13 14l-3 5h4l-2 3 5-6h-4z"
        fill="#FFD54F"
        stroke="#FFB300"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WindIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 6a3 3 0 0 1 3-3 3 3 0 0 1 0 6H3"
        stroke="#90A4AE"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M3 12h15" stroke="#90A4AE" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M9 18a3 3 0 0 0 3 3 3 3 0 0 0 0-6H3"
        stroke="#90A4AE"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DropletIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3C12 3 5 10.5 5 15a7 7 0 0 0 14 0C19 10.5 12 3 12 3z"
        fill="#42A5F5"
        stroke="#1E88E5"
        strokeWidth="0.5"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

interface ColorfulWeatherIconProps extends IconProps {
  icon: string;
  isDay?: boolean;
}

/**
 * Maps an icon-slug from `getWeatherInfo` to the correct coloured SVG component.
 * Pass `isDay={false}` to switch clear/partly-cloudy to night variants.
 */
export function ColorfulWeatherIcon({ icon, className, isDay = true }: ColorfulWeatherIconProps) {
  switch (icon) {
    case "clear":
      return isDay ? <SunnyIcon className={className} /> : <ClearNightIcon className={className} />;
    case "partly-cloudy":
      return isDay ? <PartlyCloudyIcon className={className} /> : <PartlyCloudyNightIcon className={className} />;
    case "overcast":
      return <OvercastIcon className={className} />;
    case "fog":
      return <FogIcon className={className} />;
    case "drizzle":
      return <DrizzleIcon className={className} />;
    case "rain":
      return <RainIcon className={className} />;
    case "heavy-rain":
      return <HeavyRainIcon className={className} />;
    case "snow":
      return <SnowIcon className={className} />;
    case "thunderstorm":
      return <ThunderstormIcon className={className} />;
    case "wind":
      return <WindIcon className={className} />;
    default:
      return <OvercastIcon className={className} />;
  }
}
