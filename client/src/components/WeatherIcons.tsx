/**
 * Colorful Weather Icons — Fancy multi-color SVG icons for weather display.
 * Each icon uses gradients and multiple colors for a polished, modern look.
 */

interface IconProps {
  className?: string;
}

/** Bright golden sun with orange/yellow gradient and warm rays */
export function SunnyIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FF8C00" />
        </radialGradient>
        <linearGradient id="rayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="5" fill="url(#sunGrad)" />
      <g fill="url(#rayGrad)">
        <rect x="11" y="1.5" width="2" height="3.5" rx="1" />
        <rect x="11" y="19" width="2" height="3.5" rx="1" />
        <rect x="19" y="11" width="3.5" height="2" rx="1" />
        <rect x="1.5" y="11" width="3.5" height="2" rx="1" />
        <rect x="17.5" y="4" width="2" height="3.5" rx="1" transform="rotate(45 18.5 5.75)" />
        <rect x="4.5" y="16.5" width="2" height="3.5" rx="1" transform="rotate(45 5.5 18.25)" />
        <rect x="17.5" y="16.5" width="2" height="3.5" rx="1" transform="rotate(-45 18.5 18.25)" />
        <rect x="4.5" y="4" width="2" height="3.5" rx="1" transform="rotate(-45 5.5 5.75)" />
      </g>
    </svg>
  );
}

/** Partly cloudy: golden sun peeking behind a soft gray-blue cloud */
export function PartlyCloudyIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pcSunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FF8C00" />
        </radialGradient>
        <linearGradient id="pcCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8EDF2" />
          <stop offset="100%" stopColor="#B0BEC5" />
        </linearGradient>
      </defs>
      {/* Sun behind */}
      <circle cx="9" cy="8" r="3.5" fill="url(#pcSunGrad)" />
      <g fill="#FFA500" opacity="0.8">
        <rect x="8.2" y="2.5" width="1.6" height="2.5" rx="0.8" />
        <rect x="13" y="7.2" width="2.5" height="1.6" rx="0.8" />
        <rect x="12" y="3.5" width="1.6" height="2.5" rx="0.8" transform="rotate(45 12.8 4.75)" />
        <rect x="3.5" y="4" width="1.6" height="2.5" rx="0.8" transform="rotate(-45 4.3 5.25)" />
      </g>
      {/* Cloud in front */}
      <path d="M8 19h10a4 4 0 0 0 0-8h-.2A5.5 5.5 0 0 0 7.5 12.5 4 4 0 0 0 8 19z" fill="url(#pcCloudGrad)" />
    </svg>
  );
}

/** Overcast: layered gray clouds */
export function OvercastIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ovCloudGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CFD8DC" />
          <stop offset="100%" stopColor="#90A4AE" />
        </linearGradient>
        <linearGradient id="ovCloudGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B0BEC5" />
          <stop offset="100%" stopColor="#78909C" />
        </linearGradient>
      </defs>
      <path d="M6 15h10a3.5 3.5 0 0 0 0-7h-.3A4.5 4.5 0 0 0 6.5 9.5 3.5 3.5 0 0 0 6 15z" fill="url(#ovCloudGrad1)" />
      <path d="M9 20h9a3 3 0 0 0 0-6h-.2A4 4 0 0 0 9.5 15 3 3 0 0 0 9 20z" fill="url(#ovCloudGrad2)" />
    </svg>
  );
}

/** Fog: layered horizontal bars with gradient */
export function FogIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fogGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B0BEC5" />
          <stop offset="100%" stopColor="#CFD8DC" />
        </linearGradient>
      </defs>
      <path d="M5 12h10a3 3 0 0 0 0-6h-.2A4 4 0 0 0 5.5 7.5 3 3 0 0 0 5 12z" fill="url(#fogGrad)" />
      <rect x="4" y="14" width="16" height="1.5" rx="0.75" fill="#B0BEC5" opacity="0.8" />
      <rect x="6" y="17" width="12" height="1.5" rx="0.75" fill="#CFD8DC" opacity="0.6" />
      <rect x="5" y="20" width="14" height="1.5" rx="0.75" fill="#B0BEC5" opacity="0.4" />
    </svg>
  );
}

/** Drizzle/Light rain: cloud with small blue droplets */
export function DrizzleIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="drCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B0BEC5" />
          <stop offset="100%" stopColor="#78909C" />
        </linearGradient>
        <linearGradient id="drDropGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#64B5F6" />
          <stop offset="100%" stopColor="#1E88E5" />
        </linearGradient>
      </defs>
      <path d="M6 13h10a3.5 3.5 0 0 0 0-7h-.3A4.5 4.5 0 0 0 6.5 7.5 3.5 3.5 0 0 0 6 13z" fill="url(#drCloudGrad)" />
      <circle cx="8" cy="16" r="0.8" fill="url(#drDropGrad)" />
      <circle cx="12" cy="17" r="0.8" fill="url(#drDropGrad)" />
      <circle cx="10" cy="19" r="0.8" fill="url(#drDropGrad)" />
      <circle cx="14" cy="15.5" r="0.8" fill="url(#drDropGrad)" />
    </svg>
  );
}

/** Rain: cloud with heavier blue rain streaks */
export function RainIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rnCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#90A4AE" />
          <stop offset="100%" stopColor="#546E7A" />
        </linearGradient>
        <linearGradient id="rnDropGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#42A5F5" />
          <stop offset="100%" stopColor="#1565C0" />
        </linearGradient>
      </defs>
      <path d="M6 12h10a3.5 3.5 0 0 0 0-7h-.3A4.5 4.5 0 0 0 6.5 6.5 3.5 3.5 0 0 0 6 12z" fill="url(#rnCloudGrad)" />
      <path d="M8 14.5l-1 3.5" stroke="url(#rnDropGrad)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 14.5l-1 3.5" stroke="url(#rnDropGrad)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 14.5l-1 3.5" stroke="url(#rnDropGrad)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 17.5l-1 3" stroke="url(#rnDropGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <path d="M14 17.5l-1 3" stroke="url(#rnDropGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

/** Heavy rain: dark cloud with thick rain streaks */
export function HeavyRainIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hrCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#607D8B" />
          <stop offset="100%" stopColor="#37474F" />
        </linearGradient>
        <linearGradient id="hrDropGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2196F3" />
          <stop offset="100%" stopColor="#0D47A1" />
        </linearGradient>
      </defs>
      <path d="M5 11h11a3.5 3.5 0 0 0 0-7h-.3A5 5 0 0 0 5.5 5.5 3.5 3.5 0 0 0 5 11z" fill="url(#hrCloudGrad)" />
      <path d="M7 13l-1.5 4.5" stroke="url(#hrDropGrad)" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 13l-1.5 4.5" stroke="url(#hrDropGrad)" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 13l-1.5 4.5" stroke="url(#hrDropGrad)" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 17l-1.5 4" stroke="url(#hrDropGrad)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13 17l-1.5 4" stroke="url(#hrDropGrad)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Snow: cloud with light blue/white snowflakes */
export function SnowIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="snCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CFD8DC" />
          <stop offset="100%" stopColor="#90A4AE" />
        </linearGradient>
      </defs>
      <path d="M6 12h10a3.5 3.5 0 0 0 0-7h-.3A4.5 4.5 0 0 0 6.5 6.5 3.5 3.5 0 0 0 6 12z" fill="url(#snCloudGrad)" />
      {/* Snowflakes */}
      <g fill="#90CAF9" stroke="#64B5F6" strokeWidth="0.3">
        <circle cx="8" cy="15" r="1.2" />
        <circle cx="12" cy="16.5" r="1" />
        <circle cx="15" cy="14.5" r="1.1" />
        <circle cx="10" cy="19" r="0.9" />
        <circle cx="14" cy="19.5" r="1" />
      </g>
    </svg>
  );
}

/** Thunderstorm: dark cloud with yellow lightning bolt */
export function ThunderstormIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tsCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#546E7A" />
          <stop offset="100%" stopColor="#263238" />
        </linearGradient>
        <linearGradient id="tsBoltGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFD600" />
          <stop offset="100%" stopColor="#FF8F00" />
        </linearGradient>
      </defs>
      <path d="M5 11h11a3.5 3.5 0 0 0 0-7h-.3A5 5 0 0 0 5.5 5.5 3.5 3.5 0 0 0 5 11z" fill="url(#tsCloudGrad)" />
      {/* Lightning bolt */}
      <path d="M11 12l-2 4h3l-1.5 5 4-5.5h-3l2-3.5h-2.5z" fill="url(#tsBoltGrad)" />
      {/* Rain drops */}
      <path d="M7 14l-0.5 2" stroke="#42A5F5" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <path d="M16 13l-0.5 2" stroke="#42A5F5" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

/** Wind indicator icon */
export function WindIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8h10a2 2 0 1 0-2-2" stroke="#78909C" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 12h14a2.5 2.5 0 1 1-2.5 2.5" stroke="#546E7A" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 16h7a2 2 0 1 1-2 2" stroke="#90A4AE" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Droplet icon for precipitation probability */
export function DropletIcon({ className = "w-3 h-3" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dropGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#64B5F6" />
          <stop offset="100%" stopColor="#1565C0" />
        </linearGradient>
      </defs>
      <path d="M12 2.5c0 0-6 7.5-6 12a6 6 0 0 0 12 0c0-4.5-6-12-6-12z" fill="url(#dropGrad)" />
    </svg>
  );
}

/**
 * Main weather icon dispatcher — maps icon string to colorful component.
 */
export function ColorfulWeatherIcon({ icon, className = "w-4 h-4" }: { icon: string; className?: string }) {
  switch (icon) {
    case "clear":
    case "mostly-clear":
      return <SunnyIcon className={className} />;
    case "partly-cloudy":
      return <PartlyCloudyIcon className={className} />;
    case "overcast":
      return <OvercastIcon className={className} />;
    case "fog":
      return <FogIcon className={className} />;
    case "drizzle":
    case "light-rain":
      return <DrizzleIcon className={className} />;
    case "rain":
      return <RainIcon className={className} />;
    case "heavy-rain":
      return <HeavyRainIcon className={className} />;
    case "light-snow":
    case "snow":
    case "heavy-snow":
      return <SnowIcon className={className} />;
    case "thunderstorm":
      return <ThunderstormIcon className={className} />;
    default:
      return <SunnyIcon className={className} />;
  }
}
