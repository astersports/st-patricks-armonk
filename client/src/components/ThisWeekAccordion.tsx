import { useState, useMemo } from "react";
import { ChevronDown, Church, Cross, Sun, Calendar, CalendarPlus } from "lucide-react";
import { downloadMassICS, downloadICS } from "@/lib/icsGenerator";
import { format, addDays, isToday, isTomorrow } from "date-fns";
import { TZDate } from "@date-fns/tz";

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
  mass: { icon: Church, color: "text-primary", bg: "bg-primary/10", chip: "bg-primary/15 text-primary" },
  confession: { icon: Cross, color: "text-purple-600", bg: "bg-purple-500/10", chip: "bg-purple-500/15 text-purple-600" },
  prayer: { icon: Sun, color: "text-amber-600", bg: "bg-amber-500/10", chip: "bg-amber-500/15 text-amber-600" },
};

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
  const [expandedDay, setExpandedDay] = useState<string | null>(() => {
    // Auto-expand today
    return "today";
  });

  const days = useMemo(() => {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: TIMEZONE }));
    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(now, i);
      const dayOfWeek = date.getDay();
      const services = DAILY_SCHEDULE[dayOfWeek] || [];
      const dayKey = i === 0 ? "today" : format(date, "yyyy-MM-dd");

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
        key: dayKey,
        date,
        dayOfWeek,
        services,
        events: dayEvents,
        isToday: i === 0,
        isTomorrow: i === 1,
        label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : format(date, "EEEE"),
        shortLabel: i === 0 ? "Today" : i === 1 ? "Tmrw" : format(date, "EEE"),
        dateLabel: format(date, "MMM d"),
      });
    }
    return result;
  }, [events]);

  const toggleDay = (key: string) => {
    setExpandedDay((prev) => (prev === key ? null : key));
  };

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-card shadow-sm">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-bold text-foreground">This Week</span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {format(days[0]?.date || new Date(), "MMM d")} – {format(days[6]?.date || new Date(), "MMM d")}
        </span>
      </div>

      {/* Day rows */}
      <div className="divide-y divide-border/30">
        {days.map((day) => {
          const isExpanded = expandedDay === day.key;
          const totalItems = day.services.length + day.events.length;
          const isEmpty = totalItems === 0;

          return (
            <div key={day.key}>
              {/* Day header — clickable */}
              <button
                onClick={() => !isEmpty && toggleDay(day.key)}
                className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors ${
                  isEmpty ? "opacity-50 cursor-default" : "hover:bg-muted/30 cursor-pointer"
                } ${day.isToday ? "bg-primary/[0.03]" : ""}`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex flex-col items-center justify-center ${
                    day.isToday ? "bg-primary text-white" : "bg-muted/50"
                  }`}>
                    <span className={`text-[9px] font-bold uppercase leading-none ${day.isToday ? "text-white/80" : "text-muted-foreground"}`}>
                      {format(day.date, "EEE")}
                    </span>
                    <span className={`text-sm font-bold leading-tight ${day.isToday ? "text-white" : "text-foreground"}`}>
                      {format(day.date, "d")}
                    </span>
                  </div>
                  <div className="text-left">
                    <span className={`text-xs font-semibold ${day.isToday ? "text-primary" : "text-foreground"}`}>
                      {day.label}
                    </span>
                    {day.isToday && (
                      <span className="ml-1.5 text-[9px] font-bold uppercase bg-primary/15 text-primary px-1.5 py-0.5 rounded">
                        TODAY
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isEmpty ? (
                    <span className="text-[10px] text-muted-foreground italic">No services</span>
                  ) : (
                    <>
                      <span className="text-[10px] text-muted-foreground">
                        {day.services.length > 0 && `${day.services.length} service${day.services.length > 1 ? "s" : ""}`}
                        {day.services.length > 0 && day.events.length > 0 && " · "}
                        {day.events.length > 0 && `${day.events.length} event${day.events.length > 1 ? "s" : ""}`}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                    </>
                  )}
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && !isEmpty && (
                <div className="px-4 pb-3 pt-1 space-y-1.5">
                  {/* Services */}
                  {day.services.map((svc, idx) => {
                    const style = typeStyles[svc.type];
                    const Icon = style.icon;
                    return (
                      <div key={`svc-${idx}`} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg bg-muted/20">
                        <div className={`w-6 h-6 rounded-md ${style.bg} flex items-center justify-center`}>
                          <Icon className={`w-3 h-3 ${style.color}`} />
                        </div>
                        <span className="text-xs font-medium text-foreground flex-1">{svc.label}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadMassICS({
                              title: `${svc.label} - St. Patrick in Armonk`,
                              day: format(day.date, "EEEE"),
                              time: svc.time,
                            });
                          }}
                          className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                          title="Add to Calendar"
                        >
                          <CalendarPlus className="w-3 h-3" />
                        </button>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.chip}`}>
                          {svc.time}
                        </span>
                      </div>
                    );
                  })}
                  {/* Events */}
                  {day.events.map((evt, idx) => (
                    <div key={`evt-${idx}`} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg bg-gold/5 border border-gold/10">
                      <div className="w-6 h-6 rounded-md bg-gold/10 flex items-center justify-center">
                        <Calendar className="w-3 h-3 text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-foreground truncate block">{evt.title}</span>
                        {evt.location && (
                          <span className="text-[10px] text-muted-foreground">{evt.location}</span>
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
                      {evt.note && (
                        <span className="text-[10px] font-medium text-gold bg-gold/10 px-2 py-0.5 rounded-full shrink-0">
                          {evt.note}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
