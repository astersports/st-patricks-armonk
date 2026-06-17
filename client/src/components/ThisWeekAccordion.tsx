import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Church, Cross, Sun, Calendar, CalendarPlus, Clock, Check } from "lucide-react";
import { downloadMassICS } from "@/lib/icsGenerator";
import { format, addDays } from "date-fns";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { WeatherBadge } from "@/components/WeatherBadge";

const TIMEZONE = "America/New_York";

// Service schedule data
interface ScheduleItem {
  time: string;
  label: string;
  type: "mass" | "confession" | "prayer";
}

const DAILY_SCHEDULE: Record<number, ScheduleItem[]> = {
  0: [ // Sunday
    { time: "8:30 AM", label: "Mass", type: "mass" },
    { time: "10:30 AM", label: "Mass", type: "mass" },
    { time: "12:30 PM", label: "Mass (Oct–Jun)", type: "mass" },
  ],
  1: [], // Monday — no services
  2: [ // Tuesday
    { time: "8:00 AM", label: "Morning Prayer", type: "prayer" },
    { time: "8:30 AM", label: "Mass", type: "mass" },
  ],
  3: [ // Wednesday
    { time: "8:00 AM", label: "Morning Prayer", type: "prayer" },
    { time: "8:30 AM", label: "Mass", type: "mass" },
  ],
  4: [ // Thursday
    { time: "8:00 AM", label: "Morning Prayer", type: "prayer" },
    { time: "8:30 AM", label: "Mass", type: "mass" },
  ],
  5: [ // Friday
    { time: "8:00 AM", label: "Morning Prayer", type: "prayer" },
    { time: "8:30 AM", label: "Mass", type: "mass" },
  ],
  6: [ // Saturday
    { time: "4:30 PM", label: "Confession", type: "confession" },
    { time: "5:30 PM", label: "Vigil Mass", type: "mass" },
  ],
};

// Service durations in minutes
const SERVICE_DURATION: Record<string, number> = {
  mass: 60,
  confession: 45,
  prayer: 30,
};

function parseServiceMinutes(time: string): number {
  const [timePart, ampm] = time.split(" ");
  const [h, m] = timePart.split(":").map(Number);
  return (ampm === "PM" && h !== 12 ? h + 12 : h === 12 && ampm === "AM" ? 0 : h) * 60 + m;
}

const typeStyles = {
  mass: { icon: Church, color: "text-primary", bg: "bg-primary/10", borderColor: "border-l-primary" },
  confession: { icon: Cross, color: "text-purple-600", bg: "bg-purple-500/10", borderColor: "border-l-purple-500" },
  prayer: { icon: Sun, color: "text-amber-600", bg: "bg-amber-500/10", borderColor: "border-l-amber-500" },
};

const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function ThisWeekAccordion() {
  const now = useMemo(() => new Date(new Date().toLocaleString("en-US", { timeZone: TIMEZONE })), []);

  // Build 7 days starting from today
  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(now, i);
      const dayOfWeek = date.getDay();
      const services = DAILY_SCHEDULE[dayOfWeek] || [];

      result.push({
        index: i,
        dayOfWeek,
        date,
        services,
        isToday: i === 0,
        label: DAY_LABELS[dayOfWeek],
        dateNum: date.getDate(),
      });
    }
    return result;
  }, [now]);

  const [selectedIndex, setSelectedIndex] = useState<number>(0); // Start on today

  // Compute countdown, in-progress, and past state for each service
  const [countdowns, setCountdowns] = useState<Record<number, string>>({});
  const [inProgress, setInProgress] = useState<Record<number, string>>({});
  const [pastServices, setPastServices] = useState<Record<number, boolean>>({});
  useEffect(() => {
    function computeCountdowns() {
      const et = new Date(new Date().toLocaleString("en-US", { timeZone: TIMEZONE }));
      const currentMin = et.getHours() * 60 + et.getMinutes();
      const todayDayOfWeek = et.getDay(); // 0=Sun..6=Sat
      const selected = days[selectedIndex];
      if (!selected) { setCountdowns({}); setInProgress({}); setPastServices({}); return; }
      const svcs = selected.services;
      const newCountdowns: Record<number, string> = {};
      const newInProgress: Record<number, string> = {};
      const newPast: Record<number, boolean> = {};

      // Calculate days ahead from today to the selected day
      const selectedDayOfWeek = selected.dayOfWeek; // 0=Sun..6=Sat
      const daysAhead = (selectedDayOfWeek - todayDayOfWeek + 7) % 7;

      for (let i = 0; i < svcs.length; i++) {
        const svc = svcs[i];
        const svcMin = parseServiceMinutes(svc.time);
        const duration = SERVICE_DURATION[svc.type] || 30;

        if (selected.isToday) {
          // Check if already ended
          if (currentMin >= svcMin + duration) {
            newPast[i] = true;
            continue;
          }
          // Check if currently in progress
          if (currentMin >= svcMin && currentMin < svcMin + duration) {
            const remaining = (svcMin + duration) - currentMin;
            newInProgress[i] = `${remaining}m remaining`;
            continue;
          }
          // Upcoming today — always within 24h
          const diff = svcMin - currentMin;
          if (diff > 0) {
            const hrs = Math.floor(diff / 60);
            const mins = diff % 60;
            newCountdowns[i] = hrs > 0 ? `in ${hrs}h ${mins}m` : `in ${mins}m`;
          }
        } else {
          // For future days, compute total minutes until that service
          const totalMinAhead = (daysAhead * 1440) + svcMin - currentMin;
          // Only show countdown if within 24 hours (1440 minutes)
          if (totalMinAhead > 0 && totalMinAhead <= 1440) {
            const hrs = Math.floor(totalMinAhead / 60);
            const mins = totalMinAhead % 60;
            newCountdowns[i] = hrs > 0 ? `in ${hrs}h ${mins}m` : `in ${mins}m`;
          }
        }
      }
      setCountdowns(newCountdowns);
      setInProgress(newInProgress);
      setPastServices(newPast);
    }
    computeCountdowns();
    const interval = setInterval(computeCountdowns, 30000);
    return () => clearInterval(interval);
  }, [selectedIndex, days]);

  // Determine the next upcoming service index (first with a countdown)
  const nextServiceIdx = useMemo(() => {
    const indices = Object.keys(countdowns).map(Number).sort((a, b) => a - b);
    return indices.length > 0 ? indices[0] : -1;
  }, [countdowns]);

  // Swipe gesture for mobile day navigation
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && selectedIndex < 6) {
        setSelectedIndex(selectedIndex + 1);
      } else if (diff < 0 && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      }
    }
  }, [selectedIndex]);

  // Fetch 7-day weather forecast for each day
  const weatherInput = useMemo(() => {
    return days.map((day) => ({
      id: `day-${day.index}`,
      title: day.isToday ? "Today" : format(day.date, "EEEE"),
      startDate: day.date.toISOString(),
    }));
  }, [days]);

  const { data: weatherData } = trpc.weather.forEvents.useQuery(
    { events: weatherInput },
    { staleTime: 60 * 60 * 1000 }
  );

  // Fetch 7-day daily forecast for high/low temps
  const { data: dailyForecast } = trpc.weather.daily.useQuery(undefined, {
    staleTime: 60 * 60 * 1000,
  });

  // Get the selected day's data
  const selectedDayData = days[selectedIndex];
  const services = selectedDayData?.services || [];


  // Week range for header
  const weekStart = days[0]?.date || now;
  const weekEnd = days[6]?.date || now;

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-card shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between bg-muted/10">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="font-serif text-lg font-bold text-foreground">This Week</span>
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d")}
        </span>
      </div>

      {/* Horizontal day tabs — refined with rounded selected state */}
      <div className="flex gap-0.5 p-1 border-b border-border/30 bg-muted/20">
        {days.map((day) => {
          const isSelected = selectedIndex === day.index;
          return (
            <button
              key={day.index}
              onClick={() => setSelectedIndex(day.index)}
              className={`flex-1 min-w-[44px] py-2 px-0.5 rounded-lg text-center transition-all duration-200 relative flex flex-col items-center gap-0.5 ${
                isSelected
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "hover:bg-muted/60 text-muted-foreground"
              }`}
            >
              <span className={`text-[10px] sm:text-xs font-medium uppercase ${
                isSelected ? "text-white/80" : ""
              }`}>
                {day.label}
              </span>
              <span className={`text-sm sm:text-base font-bold ${
                isSelected ? "text-white" : "text-foreground/70"
              }`}>
                {day.dateNum}
              </span>
              {/* Today indicator */}
              {day.isToday && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day content — swipeable */}
      <div
        className="p-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Day label with weather + next-up countdown */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground">
            {selectedDayData?.isToday ? "Today" : format(selectedDayData?.date || now, "EEEE")}
          </h3>
          <div className="flex items-center gap-2">
            {dailyForecast?.[selectedIndex] && (
              <span className="text-[11px] text-muted-foreground font-medium">
                <span className="text-foreground font-semibold">{dailyForecast[selectedIndex].high}°</span>
                <span className="mx-0.5">/</span>
                <span>{dailyForecast[selectedIndex].low}°</span>
              </span>
            )}
            {weatherData?.[`day-${selectedIndex}`]?.weather && (
              <WeatherBadge weather={weatherData[`day-${selectedIndex}`].weather!} compact />
            )}
            {services.length === 0 && !dailyForecast?.[selectedIndex] && (
              <span className="text-xs text-muted-foreground italic">No services</span>
            )}
          </div>
        </div>

        {/* Services list with inline countdowns */}
        {services.length > 0 && (
          <div className="space-y-2 mb-3">
            {services.map((svc, idx) => {
              const style = typeStyles[svc.type];
              const Icon = style.icon;
              const countdown = countdowns[idx];
              const progress = inProgress[idx];
              const isPast = !!pastServices[idx];
              const isNext = idx === nextServiceIdx && !progress && !isPast;
              const isLive = !!progress;
              return (
                <div
                  key={`svc-${idx}`}
                  className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${
                    isPast ? "border-muted-foreground/20" : style.borderColor
                  } ${
                    isPast
                      ? "bg-muted/30 opacity-60"
                      : isLive
                        ? "bg-emerald-50/80 ring-1 ring-emerald-200 dark:bg-emerald-950/20 dark:ring-emerald-800"
                        : isNext
                          ? "bg-primary/[0.04] ring-1 ring-primary/20"
                          : "bg-card"
                  } shadow-sm ${isPast ? "" : "hover:shadow-md"} transition-all duration-200`}
                >
                  <div className={`w-9 h-9 rounded-lg ${
                    isPast ? "bg-muted/50" : isLive ? "bg-emerald-100 dark:bg-emerald-900/30" : style.bg
                  } flex items-center justify-center`}>
                    {isPast ? (
                      <Check className="w-4 h-4 text-muted-foreground/60" />
                    ) : (
                      <Icon className={`w-4 h-4 ${isLive ? "text-emerald-600" : style.color}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-medium flex items-center gap-1.5 ${
                      isPast ? "text-muted-foreground line-through" : "text-foreground"
                    }`}>
                      {svc.label}
                      {isLive && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                          <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-50" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" /></span>
                          Live
                        </span>
                      )}
                      {isNext && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/15 text-primary">
                          <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" /></span>
                          Next
                        </span>
                      )}
                      {isPast && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-muted text-muted-foreground no-underline" style={{ textDecoration: 'none' }}>
                          Ended
                        </span>
                      )}
                    </span>
                    {isLive && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 block font-medium">{progress}</span>
                    )}
                    {countdown && !isLive && !isPast && (
                      <span className="text-xs text-muted-foreground mt-0.5 block">{countdown}</span>
                    )}
                  </div>
                  {!isPast && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][selectedDayData?.dayOfWeek || 0];
                        downloadMassICS({
                          title: `${svc.label} - St. Patrick in Armonk`,
                          day: dayName,
                          time: svc.time,
                        });
                      }}
                      className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      title="Add to Calendar"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <div className="text-right">
                    <span className={`text-sm font-bold ${
                      isPast ? "text-muted-foreground/50 line-through" : style.color
                    }`}>
                      {svc.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No services message */}
        {services.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4 italic">
            No scheduled services on this day
          </p>
        )}
      </div>

      {/* At a Glance — cleaner summary */}
      <div className="border-t border-border/30 px-4 py-3 bg-muted/10">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">At a Glance</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-card p-2.5 text-center shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Sat Vigil</p>
            <p className="text-sm font-bold text-primary mt-0.5">5:30 PM</p>
          </div>
          <div className="rounded-lg bg-card p-2.5 text-center shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Sunday</p>
            <p className="text-sm font-bold text-primary mt-0.5">8:30 & 10:30</p>
          </div>
          <div className="rounded-lg bg-card p-2.5 text-center shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Tue–Fri</p>
            <p className="text-sm font-bold text-primary mt-0.5">8:30 AM</p>
          </div>
        </div>
        <Link href="/mass-times" className="flex items-center justify-center gap-1 mt-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          Full schedule & details <span className="text-sm">→</span>
        </Link>
      </div>
    </div>
  );
}
