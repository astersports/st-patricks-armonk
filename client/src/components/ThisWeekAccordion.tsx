import { useState, useMemo } from "react";
import { Church, Cross, Sun, Calendar, CalendarPlus, Clock } from "lucide-react";
import { downloadMassICS, downloadICS } from "@/lib/icsGenerator";
import { format, addDays } from "date-fns";
import { Link } from "wouter";

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

interface EventItem {
  id?: number;
  title: string;
  eventDate: string;
  category: string;
  location?: string | null;
  note?: string | null;
}

interface ThisWeekAccordionProps {
  events?: EventItem[];
}

export function ThisWeekAccordion({ events = [] }: ThisWeekAccordionProps) {
  const now = useMemo(() => new Date(new Date().toLocaleString("en-US", { timeZone: TIMEZONE })), []);

  // Build 7 days starting from today
  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(now, i);
      const dayOfWeek = date.getDay();
      const services = DAILY_SCHEDULE[dayOfWeek] || [];

      // Find events on this day
      const dayEvents = events.filter((e) => {
        const eventDate = new Date(e.eventDate);
        return (
          eventDate.getFullYear() === date.getFullYear() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getDate() === date.getDate()
        );
      });

      result.push({
        index: i,
        dayOfWeek,
        date,
        services,
        events: dayEvents,
        isToday: i === 0,
        label: DAY_LABELS[dayOfWeek],
        dateNum: date.getDate(),
      });
    }
    return result;
  }, [events, now]);

  const [selectedIndex, setSelectedIndex] = useState<number>(0); // Start on today

  // Get the selected day's data
  const selectedDayData = days[selectedIndex];
  const services = selectedDayData?.services || [];
  const dayEvents = selectedDayData?.events || [];

  // Week range for header
  const weekStart = days[0]?.date || now;
  const weekEnd = days[6]?.date || now;

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-card shadow-sm">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span className="text-sm font-bold text-foreground">This Week</span>
        </div>
        <span className="text-sm text-foreground/70">
          {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d")}
        </span>
      </div>

      {/* Horizontal day tabs — starting from today */}
      <div className="flex border-b border-border/30">
        {days.map((day) => {
          const isSelected = selectedIndex === day.index;
          return (
            <button
              key={day.index}
              onClick={() => setSelectedIndex(day.index)}
              className={`flex-1 py-2 text-center transition-all duration-150 relative flex flex-col items-center gap-0.5 ${
                isSelected
                  ? "bg-primary text-white font-bold"
                  : "hover:bg-muted/40 text-muted-foreground"
              }`}
            >
              <span className={`text-xs sm:text-sm font-semibold ${isSelected ? "text-white/80" : ""}`}>
                {day.label}
              </span>
              <span className={`text-sm sm:text-base font-bold ${isSelected ? "text-white" : "text-foreground/70"}`}>
                {day.dateNum}
              </span>
              {/* Today indicator */}
              {day.isToday && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day content */}
      <div className="p-3 sm:p-4">
        {/* Day label */}
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm font-bold text-foreground">
            {selectedDayData?.isToday ? "Today" : format(selectedDayData?.date || now, "EEEE")}
          </h3>
          {services.length === 0 && dayEvents.length === 0 && (
            <span className="text-xs text-foreground/50 italic">No services</span>
          )}
        </div>

        {/* Services list */}
        {services.length > 0 && (
          <div className="space-y-1.5 mb-3">
            {services.map((svc, idx) => {
              const style = typeStyles[svc.type];
              const Icon = style.icon;
              return (
                <div
                  key={`svc-${idx}`}
                  className={`flex items-center gap-2.5 py-2 px-3 rounded-lg border-l-3 ${style.borderColor} bg-muted/20`}
                >
                  <div className={`w-7 h-7 rounded-md ${style.bg} flex items-center justify-center`}>
                    <Icon className={`w-3.5 h-3.5 ${style.color}`} />
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
                    className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                    title="Add to Calendar"
                  >
                    <CalendarPlus className="w-3 h-3" />
                  </button>
                  <span className={`text-sm font-bold ${style.color}`}>
                    {svc.time}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Events for this day */}
        {dayEvents.length > 0 && (
          <div className="space-y-1.5 mb-3">
            {dayEvents.map((evt, idx) => (
              <div key={`evt-${idx}`} className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-gold/5 border border-gold/10">
                <div className="w-7 h-7 rounded-md bg-gold/10 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground truncate block">{evt.title}</span>
                  {evt.location && (
                    <span className="text-sm text-foreground/70">{evt.location}</span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadICS({
                      title: evt.title,
                      startDate: new Date(evt.eventDate),
                      location: evt.location || "St. Patrick Church, 29 Cox Ave, Armonk NY 10504",
                    });
                  }}
                  className="p-1 rounded hover:bg-gold/20 text-muted-foreground hover:text-gold transition-colors shrink-0"
                  title="Add to Calendar"
                >
                  <CalendarPlus className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* No services message */}
        {services.length === 0 && dayEvents.length === 0 && (
          <p className="text-sm text-foreground/50 text-center py-3 italic">
            No scheduled services on this day
          </p>
        )}
      </div>

      {/* At a Glance — compact summary */}
      <div className="border-t border-border/30 px-4 py-3 bg-muted/20">
        <div className="flex items-center gap-1.5 mb-2">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm font-bold uppercase tracking-wider text-foreground/70">At a Glance</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="rounded-lg bg-card border border-border/40 p-2.5 text-center">
            <p className="text-sm uppercase tracking-wider text-foreground/70 font-medium">Saturday Vigil</p>
            <p className="text-base font-bold text-primary mt-0.5">5:30 PM</p>
          </div>
          <div className="rounded-lg bg-card border border-border/40 p-2.5 text-center">
            <p className="text-sm uppercase tracking-wider text-foreground/70 font-medium">Sunday</p>
            <p className="text-base font-bold text-primary mt-0.5">8:30 & 10:30 AM</p>
            <p className="text-sm text-foreground/70">12:30 PM (Oct–Jun)</p>
          </div>
          <div className="rounded-lg bg-card border border-border/40 p-2.5 text-center">
            <p className="text-sm uppercase tracking-wider text-foreground/70 font-medium">Weekday (Tue–Fri)</p>
            <p className="text-base font-bold text-primary mt-0.5">8:30 AM</p>
          </div>
        </div>
        <Link href="/mass-times" className="flex items-center justify-center gap-1 mt-2.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          Full schedule & details <span className="text-sm">→</span>
        </Link>
      </div>
    </div>
  );
}
