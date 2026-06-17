import { useState, useMemo, useEffect } from "react";
import { Church, Cross, Sun, Calendar, CalendarPlus, Clock } from "lucide-react";
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

  // Next-up countdown for today
  const [nextUpText, setNextUpText] = useState<string | null>(null);
  useEffect(() => {
    function computeNextUp() {
      const et = new Date(new Date().toLocaleString("en-US", { timeZone: TIMEZONE }));
      const todayDow = et.getDay();
      const todayServices = DAILY_SCHEDULE[todayDow] || [];
      const currentMin = et.getHours() * 60 + et.getMinutes();
      for (const svc of todayServices) {
        const [timePart, ampm] = svc.time.split(" ");
        const [h, m] = timePart.split(":").map(Number);
        let svcMin = (ampm === "PM" && h !== 12 ? h + 12 : h === 12 && ampm === "AM" ? 0 : h) * 60 + m;
        if (svcMin > currentMin) {
          const diff = svcMin - currentMin;
          const hrs = Math.floor(diff / 60);
          const mins = diff % 60;
          const countdown = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
          setNextUpText(`${svc.label} at ${svc.time} · in ${countdown}`);
          return;
        }
      }
      setNextUpText(null);
    }
    computeNextUp();
    const interval = setInterval(computeNextUp, 30000);
    return () => clearInterval(interval);
  }, []);

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
      <div className="flex gap-1 p-1.5 border-b border-border/30 bg-muted/20">
        {days.map((day) => {
          const isSelected = selectedIndex === day.index;
          return (
            <button
              key={day.index}
              onClick={() => setSelectedIndex(day.index)}
              className={`flex-1 py-2 px-1 rounded-lg text-center transition-all duration-200 relative flex flex-col items-center gap-0.5 ${
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

      {/* Selected day content */}
      <div className="p-4">
        {/* Day label with weather + next-up countdown */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground">
            {selectedDayData?.isToday ? "Today" : format(selectedDayData?.date || now, "EEEE")}
          </h3>
          <div className="flex items-center gap-2">
            {weatherData?.[`day-${selectedIndex}`]?.weather && (
              <WeatherBadge weather={weatherData[`day-${selectedIndex}`].weather!} compact />
            )}
            {services.length === 0 && (
              <span className="text-xs text-muted-foreground italic">No services</span>
            )}
          </div>
        </div>

        {/* Next-up countdown pill for today */}
        {selectedDayData?.isToday && nextUpText && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" /><span className="relative inline-flex rounded-full h-2 w-2 bg-primary" /></span>
              {nextUpText}
            </span>
          </div>
        )}

        {/* Services list */}
        {services.length > 0 && (
          <div className="space-y-2 mb-3">
            {services.map((svc, idx) => {
              const style = typeStyles[svc.type];
              const Icon = style.icon;
              return (
                <div
                  key={`svc-${idx}`}
                  className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${style.borderColor} bg-card shadow-sm hover:shadow-md transition-all duration-200`}
                >
                  <div className={`w-9 h-9 rounded-lg ${style.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${style.color}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground flex-1">{svc.label}</span>
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
                  <span className={`text-sm font-bold ${style.color}`}>
                    {svc.time}
                  </span>
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
