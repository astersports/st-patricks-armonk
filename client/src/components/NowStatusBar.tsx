import { useState, useEffect, useMemo } from "react";
import { Church, Cross, Sun, Clock, ChevronRight, CloudRain, CloudSnow, CloudSun, Cloud, CloudLightning } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

const TIMEZONE = "America/New_York";

// Full schedule — single source of truth
type ServiceType = "mass" | "confession" | "prayer";

interface ScheduleItem {
  day: number; // 0=Sun, 1=Mon, ..., 6=Sat
  type: ServiceType;
  label: string;
  time: string;
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
}

const SCHEDULE: ScheduleItem[] = [
  // Sunday
  { day: 0, type: "mass", label: "Mass", time: "8:30 AM", startHour: 8, startMin: 30, endHour: 9, endMin: 30 },
  { day: 0, type: "mass", label: "Mass", time: "10:30 AM", startHour: 10, startMin: 30, endHour: 11, endMin: 30 },
  { day: 0, type: "mass", label: "Mass", time: "12:30 PM", startHour: 12, startMin: 30, endHour: 13, endMin: 30 },
  // Tuesday
  { day: 2, type: "prayer", label: "Lauds", time: "8:00 AM", startHour: 8, startMin: 0, endHour: 8, endMin: 25 },
  { day: 2, type: "mass", label: "Mass", time: "8:30 AM", startHour: 8, startMin: 30, endHour: 9, endMin: 0 },
  // Wednesday
  { day: 3, type: "prayer", label: "Lauds", time: "8:00 AM", startHour: 8, startMin: 0, endHour: 8, endMin: 25 },
  { day: 3, type: "mass", label: "Mass", time: "8:30 AM", startHour: 8, startMin: 30, endHour: 9, endMin: 0 },
  // Thursday
  { day: 4, type: "prayer", label: "Lauds", time: "8:00 AM", startHour: 8, startMin: 0, endHour: 8, endMin: 25 },
  { day: 4, type: "mass", label: "Mass", time: "8:30 AM", startHour: 8, startMin: 30, endHour: 9, endMin: 0 },
  // Friday
  { day: 5, type: "prayer", label: "Lauds", time: "8:00 AM", startHour: 8, startMin: 0, endHour: 8, endMin: 25 },
  { day: 5, type: "mass", label: "Mass", time: "8:30 AM", startHour: 8, startMin: 30, endHour: 9, endMin: 0 },
  // Saturday
  { day: 6, type: "confession", label: "Confession", time: "4:30 PM", startHour: 16, startMin: 30, endHour: 17, endMin: 15 },
  { day: 6, type: "mass", label: "Vigil Mass", time: "5:30 PM", startHour: 17, startMin: 30, endHour: 18, endMin: 30 },
];

function getServiceIcon(type: ServiceType) {
  switch (type) {
    case "mass": return Church;
    case "confession": return Cross;
    case "prayer": return Sun;
  }
}

function getServiceColor(type: ServiceType) {
  switch (type) {
    case "mass": return "text-primary";
    case "confession": return "text-purple-600";
    case "prayer": return "text-amber-600";
  }
}

interface MassStatus {
  isActive: boolean;
  activeType?: ServiceType;
  activeLabel?: string;
  remainingMin?: number;
  nextLabel: string;
  nextTime: string;
  nextDay: string;
  countdownText: string;
  todaySchedule: { type: ServiceType; label: string; time: string; isPast: boolean; isCurrent: boolean }[];
  confessionText: string;
}

function getMassStatus(now: Date): MassStatus {
  const day = now.getDay();
  const currentMin = now.getHours() * 60 + now.getMinutes();

  // Get today's schedule
  const todayItems = SCHEDULE.filter(s => s.day === day);
  const todaySchedule = todayItems.map(s => {
    const startMin = s.startHour * 60 + s.startMin;
    const endMin = s.endHour * 60 + s.endMin;
    const isPast = currentMin >= endMin;
    const isCurrent = currentMin >= startMin && currentMin < endMin;
    return { type: s.type, label: s.label, time: s.time, isPast, isCurrent };
  });

  // Check if something is active right now
  for (const s of todayItems) {
    const startMin = s.startHour * 60 + s.startMin;
    const endMin = s.endHour * 60 + s.endMin;
    if (currentMin >= startMin && currentMin < endMin) {
      const remaining = endMin - currentMin;
      // Find next mass
      const { nextLabel, nextTime, nextDay, countdownText } = findNextMass(day, currentMin);
      return {
        isActive: true,
        activeType: s.type,
        activeLabel: s.label,
        remainingMin: remaining,
        nextLabel,
        nextTime,
        nextDay,
        countdownText,
        todaySchedule,
        confessionText: "Sat 4:30–5:15 PM",
      };
    }
  }

  // Nothing active — find next mass
  const { nextLabel, nextTime, nextDay, countdownText } = findNextMass(day, currentMin);
  return {
    isActive: false,
    nextLabel,
    nextTime,
    nextDay,
    countdownText,
    todaySchedule,
    confessionText: "Sat 4:30–5:15 PM",
  };
}

function findNextMass(currentDay: number, currentMin: number) {
  let minDiff = Infinity;
  let nextLabel = "";
  let nextTime = "";
  let nextDay = "";

  const massItems = SCHEDULE.filter(s => s.type === "mass");
  for (const s of massItems) {
    let daysAhead = s.day - currentDay;
    if (daysAhead < 0) daysAhead += 7;
    const startMin = s.startHour * 60 + s.startMin;
    let diffMinutes = daysAhead * 24 * 60 + (startMin - currentMin);
    if (diffMinutes <= 0) diffMinutes += 7 * 24 * 60;
    if (diffMinutes < minDiff) {
      minDiff = diffMinutes;
      nextLabel = s.label;
      nextTime = s.time;
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      nextDay = days[s.day];
    }
  }

  let countdownText = "";
  if (minDiff < 60) {
    countdownText = `${minDiff}m`;
  } else if (minDiff < 24 * 60) {
    const h = Math.floor(minDiff / 60);
    const m = minDiff % 60;
    countdownText = m > 0 ? `${h}h ${m}m` : `${h}h`;
  } else {
    const d = Math.floor(minDiff / (24 * 60));
    countdownText = `${d}d`;
  }

  return { nextLabel, nextTime, nextDay, countdownText };
}

function WeatherIconSmall({ icon }: { icon: string }) {
  const cls = "w-3 h-3";
  switch (icon) {
    case "clear":
    case "mostly-clear":
      return <Sun className={cls} />;
    case "partly-cloudy":
      return <CloudSun className={cls} />;
    case "overcast":
    case "fog":
      return <Cloud className={cls} />;
    case "drizzle":
    case "light-rain":
    case "rain":
    case "heavy-rain":
      return <CloudRain className={cls} />;
    case "light-snow":
    case "snow":
    case "heavy-snow":
      return <CloudSnow className={cls} />;
    case "thunderstorm":
      return <CloudLightning className={cls} />;
    default:
      return <Sun className={cls} />;
  }
}

function CurrentWeatherPill() {
  const { data: weather } = trpc.weather.current.useQuery(undefined, {
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  if (!weather) return null;
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-sky-500/8 text-sky-700 dark:text-sky-300 shrink-0">
      <WeatherIconSmall icon={weather.icon} />
      <span>{weather.temperature}°F</span>
    </div>
  );
}

export function NowStatusBar() {
  const [now, setNow] = useState(() => {
    const d = new Date();
    return new Date(d.toLocaleString("en-US", { timeZone: TIMEZONE }));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      setNow(new Date(d.toLocaleString("en-US", { timeZone: TIMEZONE })));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const status = useMemo(() => getMassStatus(now), [now]);

  return (
    <div className="space-y-3">
      {/* Primary Status Bar */}
      <Link href="/mass-times">
        <div className={`
          group flex items-center gap-3 px-4 py-3 rounded-xl
          border transition-all duration-200 cursor-pointer
          ${status.isActive
            ? "bg-primary/5 border-primary/20 shadow-sm"
            : "bg-card border-border/60 shadow-sm hover:border-primary/20 hover:shadow-md"
          }
        `}>
          {/* Pulsing dot */}
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            {status.isActive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              status.isActive ? "bg-primary" : "bg-emerald-500"
            }`} />
          </span>

          {/* Icon */}
          {status.isActive && status.activeType ? (
            (() => {
              const Icon = getServiceIcon(status.activeType);
              return <Icon className={`w-4.5 h-4.5 shrink-0 ${getServiceColor(status.activeType)}`} />;
            })()
          ) : (
            <Church className="w-4.5 h-4.5 shrink-0 text-primary/70" />
          )}

          {/* Text */}
          <div className="flex-1 min-w-0">
            {status.isActive ? (
              <span className="text-sm font-semibold text-primary">
                {status.activeLabel} in Progress — {status.remainingMin}m remaining
              </span>
            ) : (
              <span className="text-sm font-semibold text-foreground/80">
                Next Mass in {status.countdownText} — {status.nextDay} {status.nextTime}
              </span>
            )}
          </div>

          {/* Current weather */}
          <CurrentWeatherPill />

          {/* CTA arrow */}
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
        </div>
      </Link>

      {/* Today's Schedule Pills */}
      {status.todaySchedule.length > 0 && (
        <div className="flex items-center gap-2 px-1 overflow-x-auto scrollbar-hide">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">Today</span>
          <div className="flex gap-1.5 flex-wrap">
            {status.todaySchedule.map((item, i) => {
              const Icon = getServiceIcon(item.type);
              return (
                <div
                  key={i}
                  className={`
                    inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                    transition-all duration-200
                    ${item.isCurrent
                      ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                      : item.isPast
                        ? "bg-muted/40 text-muted-foreground line-through opacity-60"
                        : "bg-muted/60 text-foreground/70"
                    }
                  `}
                >
                  <Icon className="w-3 h-3" />
                  <span>{item.time}</span>
                </div>
              );
            })}
          </div>
          {/* Confession indicator */}
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-500/8 text-purple-600 shrink-0 ml-auto">
            <Cross className="w-3 h-3" />
            <span>{status.confessionText}</span>
          </div>
        </div>
      )}
    </div>
  );
}
