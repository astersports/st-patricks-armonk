import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Church, Cross, MapPin, Phone, Sun, Calendar, ChevronRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useState, useMemo, useRef, useCallback } from "react";
import PageHeader from "@/components/PageHeader";

// Day schedule data
type ServiceType = "mass" | "confession" | "prayer" | "none";

interface Service {
  type: ServiceType;
  name: string;
  time: string;
  note?: string;
}

interface DaySchedule {
  day: string;
  shortDay: string;
  services: Service[];
}

const BASE_WEEKLY_SCHEDULE: DaySchedule[] = [
  {
    day: "Sunday",
    shortDay: "Sun",
    services: [
      { type: "mass", name: "Mass", time: "8:30 AM" },
      { type: "mass", name: "Mass", time: "10:30 AM" },
      { type: "mass", name: "Mass", time: "12:30 PM", note: "Oct–Jun only" },
    ],
  },
  {
    day: "Monday",
    shortDay: "Mon",
    services: [
      { type: "none", name: "No scheduled services", time: "" },
    ],
  },
  {
    day: "Tuesday",
    shortDay: "Tue",
    services: [
      { type: "prayer", name: "Morning Prayer (Lauds)", time: "8:00 AM" },
      { type: "mass", name: "Weekday Mass", time: "8:30 AM" },
    ],
  },
  {
    day: "Wednesday",
    shortDay: "Wed",
    services: [
      { type: "prayer", name: "Morning Prayer (Lauds)", time: "8:00 AM" },
      { type: "mass", name: "Weekday Mass", time: "8:30 AM" },
    ],
  },
  {
    day: "Thursday",
    shortDay: "Thu",
    services: [
      { type: "prayer", name: "Morning Prayer (Lauds)", time: "8:00 AM" },
      { type: "mass", name: "Weekday Mass", time: "8:30 AM" },
    ],
  },
  {
    day: "Friday",
    shortDay: "Fri",
    services: [
      { type: "prayer", name: "Morning Prayer (Lauds)", time: "8:00 AM" },
      { type: "mass", name: "Weekday Mass", time: "8:30 AM" },
    ],
  },
  {
    day: "Saturday",
    shortDay: "Sat",
    services: [
      { type: "confession", name: "Confession", time: "4:30–5:15 PM" },
      { type: "mass", name: "Vigil Mass", time: "5:30 PM" },
    ],
  },
];

// Check if a given date is the first Friday of its month
function isFirstFriday(date: Date): boolean {
  return date.getDay() === 5 && date.getDate() <= 7;
}

// Get the schedule with First Friday Adoration injected when applicable
function getWeeklySchedule(today: number): DaySchedule[] {
  const schedule = BASE_WEEKLY_SCHEDULE.map(day => ({ ...day, services: [...day.services] }));
  // Check if this Friday in the current week is a First Friday
  const now = new Date();
  const todayDate = now.getDate();
  const todayDay = now.getDay();
  // Calculate the date of this week's Friday
  const daysUntilFriday = (5 - todayDay + 7) % 7;
  const fridayDate = new Date(now);
  fridayDate.setDate(todayDate + daysUntilFriday);
  if (isFirstFriday(fridayDate)) {
    schedule[5].services.push({
      type: "prayer",
      name: "First Friday Adoration",
      time: "9:00 AM",
      note: "Eucharistic Adoration following Mass",
    });
  }
  return schedule;
}

// Parse a time string like "8:30 AM" or "4:30–5:15 PM" into { hours, minutes } (24h)
function parseTimeStr(timeStr: string): { hours: number; minutes: number } | null {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (!match) return null;
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3];
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
}

// Compute countdown string from now to a target time today or on a future day
function getCountdown(targetHours: number, targetMinutes: number, currentHour: number, currentMinute: number, daysAhead: number): string {
  let totalMinutes = (targetHours * 60 + targetMinutes) - (currentHour * 60 + currentMinute) + daysAhead * 1440;
  if (totalMinutes <= 0) return "";
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `in ${m}m`;
  if (m === 0) return `in ${h}h`;
  return `in ${h}h ${m}m`;
}

// Holy Days of Obligation (US) - fixed dates
// These are the standard US Holy Days. Dates that can be moved to Sunday are noted.
interface HolyDay {
  month: number; // 1-indexed
  day: number;
  name: string;
  massTime?: string;
}

const HOLY_DAYS: HolyDay[] = [
  { month: 1, day: 1, name: "Solemnity of Mary, Mother of God", massTime: "10:00 AM" },
  { month: 8, day: 15, name: "Assumption of the Blessed Virgin Mary", massTime: "8:30 AM" },
  { month: 11, day: 1, name: "All Saints' Day", massTime: "8:30 AM" },
  { month: 12, day: 8, name: "Immaculate Conception", massTime: "8:30 AM" },
  { month: 12, day: 25, name: "Christmas", massTime: "10:00 AM" },
];
// Ascension Thursday is 39 days after Easter - computed dynamically

// Get Easter date for a given year (Anonymous Gregorian algorithm)
function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

// Check for upcoming Holy Days within the next 7 days
function getUpcomingHolyDays(): { name: string; date: Date; massTime: string; daysUntil: number }[] {
  const now = new Date();
  const year = now.getFullYear();
  const upcoming: { name: string; date: Date; massTime: string; daysUntil: number }[] = [];

  // Check fixed Holy Days
  for (const hd of HOLY_DAYS) {
    const hdDate = new Date(year, hd.month - 1, hd.day);
    const diffMs = hdDate.getTime() - new Date(year, now.getMonth(), now.getDate()).getTime();
    const daysUntil = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (daysUntil >= 0 && daysUntil <= 7) {
      upcoming.push({ name: hd.name, date: hdDate, massTime: hd.massTime || "8:30 AM", daysUntil });
    }
  }

  // Check Ascension Thursday (39 days after Easter)
  const easter = getEasterDate(year);
  const ascension = new Date(easter);
  ascension.setDate(easter.getDate() + 39);
  const ascDiffMs = ascension.getTime() - new Date(year, now.getMonth(), now.getDate()).getTime();
  const ascDaysUntil = Math.round(ascDiffMs / (1000 * 60 * 60 * 24));
  if (ascDaysUntil >= 0 && ascDaysUntil <= 7) {
    upcoming.push({ name: "Ascension of the Lord", date: ascension, massTime: "8:30 AM", daysUntil: ascDaysUntil });
  }

  return upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
}

// Check if a service is currently in progress (within its time window)
// Mass ~1hr, Confession ~45min, Prayer ~30min
function getServiceDuration(type: ServiceType): number {
  switch (type) {
    case "mass": return 60;
    case "confession": return 45;
    case "prayer": return 30;
    default: return 30;
  }
}

function isServiceInProgress(timeStr: string, type: ServiceType, currentHour: number, currentMinute: number, isToday: boolean): boolean {
  if (!isToday || !timeStr) return false;
  // For range times like "4:30–5:15 PM", parse the start time
  const startMatch = timeStr.match(/^(\d{1,2}):(\d{2})/);
  const periodMatch = timeStr.match(/(AM|PM)/);
  if (!startMatch || !periodMatch) return false;
  let startHours = parseInt(startMatch[1]);
  const startMinutes = parseInt(startMatch[2]);
  const period = periodMatch[1];
  if (period === "PM" && startHours !== 12) startHours += 12;
  if (period === "AM" && startHours === 12) startHours = 0;

  const startTotal = startHours * 60 + startMinutes;
  const nowTotal = currentHour * 60 + currentMinute;
  const duration = getServiceDuration(type);

  return nowTotal >= startTotal && nowTotal < startTotal + duration;
}

function getServiceColor(type: ServiceType) {
  switch (type) {
    case "mass": return { bg: "bg-primary/8", text: "text-primary", border: "border-l-primary", dot: "bg-primary" };
    case "confession": return { bg: "bg-purple-500/8", text: "text-purple-600", border: "border-l-purple-500", dot: "bg-purple-500" };
    case "prayer": return { bg: "bg-amber-500/8", text: "text-amber-600", border: "border-l-amber-500", dot: "bg-amber-500" };
    case "none": return { bg: "bg-muted/30", text: "text-muted-foreground", border: "border-l-muted", dot: "bg-muted-foreground" };
  }
}

function getServiceIcon(type: ServiceType) {
  switch (type) {
    case "mass": return Church;
    case "confession": return Cross;
    case "prayer": return Sun;
    case "none": return Clock;
  }
}

export default function MassTimes() {
  const revealRef = useReveal();
  const now = new Date();
  const today = now.getDay(); // 0 = Sunday
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const tomorrow = (today + 1) % 7;

  // Get schedule with First Friday injected
  const WEEKLY_SCHEDULE = useMemo(() => getWeeklySchedule(today), [today]);

  // Auto-advance to tomorrow if all of today's services have completed
  const allTodayServicesPast = useMemo(() => {
    const todaySchedule = WEEKLY_SCHEDULE[today];
    if (todaySchedule.services.length === 1 && todaySchedule.services[0].type === "none") return true;
    return todaySchedule.services.every(service => {
      if (!service.time) return true;
      const parsed = parseTimeStr(service.time);
      if (!parsed) return true;
      return currentHour > parsed.hours || (currentHour === parsed.hours && currentMinute > parsed.minutes);
    });
  }, [today, currentHour, currentMinute, WEEKLY_SCHEDULE]);

  const [selectedDay, setSelectedDay] = useState(() => allTodayServicesPast ? tomorrow : today);

  // Reorder days starting from today (hide past days)
  const reorderedDays = useMemo(() => {
    const days = WEEKLY_SCHEDULE.map((day, index) => ({ ...day, originalIndex: index }));
    return [...days.slice(today), ...days.slice(0, today)];
  }, [today, WEEKLY_SCHEDULE]);

  const currentSchedule = useMemo(() => WEEKLY_SCHEDULE[selectedDay], [selectedDay, WEEKLY_SCHEDULE]);

  // Parse time string to check if a service has passed
  const isServicePast = useCallback((timeStr: string) => {
    if (!timeStr || selectedDay !== today) return false;
    const parsed = parseTimeStr(timeStr);
    if (!parsed) return false;
    return currentHour > parsed.hours || (currentHour === parsed.hours && currentMinute > parsed.minutes);
  }, [selectedDay, today, currentHour, currentMinute]);

  // Check for upcoming Holy Days
  const upcomingHolyDays = useMemo(() => getUpcomingHolyDays(), []);

  // Find the index of the next upcoming service (first one not past)
  const nextServiceIndex = useMemo(() => {
    if (selectedDay !== today) return 0; // On non-today days, highlight first service
    const services = WEEKLY_SCHEDULE[selectedDay].services;
    for (let i = 0; i < services.length; i++) {
      if (services[i].type === "none") continue;
      if (!services[i].time) continue;
      const parsed = parseTimeStr(services[i].time);
      if (!parsed) continue;
      const isPast = currentHour > parsed.hours || (currentHour === parsed.hours && currentMinute > parsed.minutes);
      if (!isPast) return i;
    }
    return -1; // all past
  }, [selectedDay, today, currentHour, currentMinute, WEEKLY_SCHEDULE]);

  // Compute countdown for the next service
  const nextServiceCountdown = useMemo(() => {
    if (nextServiceIndex < 0) return "";
    const services = WEEKLY_SCHEDULE[selectedDay].services;
    const service = services[nextServiceIndex];
    if (!service?.time) return "";
    const parsed = parseTimeStr(service.time);
    if (!parsed) return "";
    const daysAhead = selectedDay === today ? 0 : ((selectedDay - today + 7) % 7);
    return getCountdown(parsed.hours, parsed.minutes, currentHour, currentMinute, daysAhead);
  }, [nextServiceIndex, selectedDay, today, currentHour, currentMinute, WEEKLY_SCHEDULE]);

  // Swipe gesture for mobile
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      const currentIdx = reorderedDays.findIndex(d => d.originalIndex === selectedDay);
      if (diff > 0 && currentIdx < reorderedDays.length - 1) {
        // Swipe left = next day
        setSelectedDay(reorderedDays[currentIdx + 1].originalIndex);
      } else if (diff < 0 && currentIdx > 0) {
        // Swipe right = previous day
        setSelectedDay(reorderedDays[currentIdx - 1].originalIndex);
      }
    }
  };

  return (
    <PageLayout>
      {/* Page Header — refined with better hierarchy */}
      <PageHeader
        eyebrow="Worship With Us"
        title="Mass Times & Confession"
        description="Join us in worship and prayer. All are welcome at St. Patrick's."
      />

      <div ref={revealRef} className="container py-6 sm:py-10 space-y-8">
        {/* Holy Day of Obligation Alert */}
        {upcomingHolyDays.length > 0 && (
          <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/12 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1">Holy Day of Obligation</p>
                {upcomingHolyDays.map((hd, i) => (
                  <div key={i} className={i > 0 ? "mt-2 pt-2 border-t border-amber-200/50" : ""}>
                    <p className="font-semibold text-sm text-amber-900">{hd.name}</p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      {hd.daysUntil === 0 ? "Today" : hd.daysUntil === 1 ? "Tomorrow" : `${hd.date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}`}
                      {" "}&middot; Mass at <span className="font-semibold">{hd.massTime}</span>
                    </p>
                  </div>
                ))}
                <p className="text-[10px] text-amber-600 mt-2 italic">Catholics are obligated to attend Mass on this day.</p>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Day Tabs */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 text-primary" />
            </div>
            <h2 className="font-serif text-xl font-bold">Weekly Schedule</h2>
          </div>

          {/* Day Tab Bar — starts from today, no past days */}
          <div className="flex gap-0.5 mb-5 p-1 bg-muted/40 rounded-xl overflow-x-auto">
            {reorderedDays.map((day) => {
              const isSelected = selectedDay === day.originalIndex;
              const isToday = today === day.originalIndex;
              const isTomorrow = tomorrow === day.originalIndex;
              return (
                <button
                  key={day.shortDay}
                  onClick={() => setSelectedDay(day.originalIndex)}
                  className={`
                    relative flex-1 min-w-[44px] py-2.5 px-1.5 rounded-lg text-center transition-all duration-200
                    ${isSelected
                      ? "bg-white text-foreground shadow-sm ring-1 ring-border/50"
                      : "hover:bg-white/50 text-muted-foreground"
                    }
                  `}
                >
                  <span className={`block text-[11px] font-semibold uppercase tracking-wide ${isSelected ? "text-primary" : ""}`}>
                    {day.shortDay}
                  </span>
                  {isToday && (
                    <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isSelected ? "bg-primary" : "bg-primary/60"}`} />
                  )}
                  {isTomorrow && !isToday && (
                    <span className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] font-medium ${isSelected ? "text-muted-foreground" : "text-muted-foreground/60"}`}>tmrw</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Day Content — swipeable */}
          <div
            className="animate-fade-in"
            key={selectedDay}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-base text-foreground">{currentSchedule.day}</h3>
              {selectedDay === today && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/8 px-2.5 py-1 rounded-full">
                  Today
                </span>
              )}
              {selectedDay === tomorrow && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-500/8 px-2.5 py-1 rounded-full">
                  Tomorrow
                </span>
              )}
            </div>

            <div className="space-y-2">
              {currentSchedule.services.map((service, idx) => {
                const colors = getServiceColor(service.type);
                const Icon = getServiceIcon(service.type);
                const past = isServicePast(service.time);
                const isNext = idx === nextServiceIndex;
                const inProgress = isServiceInProgress(service.time, service.type, currentHour, currentMinute, selectedDay === today);
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-l-3 ${inProgress ? "border-l-emerald-500 ring-1 ring-emerald-500/20 bg-emerald-50/50 shadow-[0_2px_8px_rgba(0,0,0,0.06)]" : isNext ? "border-l-primary ring-1 ring-primary/20 bg-primary/4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]" : `${colors.border} bg-card shadow-[0_1px_3px_rgba(0,0,0,0.04)]`} transition-all duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${past && !inProgress ? "opacity-50" : ""}`}
                  >
                    <div className={`relative w-9 h-9 rounded-lg ${inProgress ? "bg-emerald-500/12" : isNext ? "bg-primary/12" : colors.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4.5 h-4.5 ${inProgress ? "text-emerald-600" : isNext ? "text-primary" : colors.text}`} />
                      {inProgress && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-2 ring-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold text-sm ${past && !inProgress ? "text-muted-foreground line-through" : inProgress ? "text-emerald-700" : isNext ? "text-primary" : "text-foreground"}`}>{service.name}</p>
                        {inProgress && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-white bg-emerald-500 px-1.5 py-0.5 rounded-full animate-pulse">Live</span>
                        )}
                        {isNext && !inProgress && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-white bg-primary px-1.5 py-0.5 rounded-full">Next</span>
                        )}
                      </div>
                      {service.note && (
                        <p className="text-xs text-muted-foreground mt-0.5">{service.note}</p>
                      )}
                      {inProgress && (
                        <p className="text-[10px] font-medium text-emerald-600 mt-0.5">In progress now</p>
                      )}
                      {past && !inProgress && (
                        <p className="text-[10px] font-medium text-muted-foreground mt-0.5">Completed</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      {service.time && (
                        <span className={`text-sm font-bold ${past && !inProgress ? "text-muted-foreground" : inProgress ? "text-emerald-600" : isNext ? "text-primary" : colors.text} tabular-nums`}>
                          {service.time}
                        </span>
                      )}
                      {isNext && !inProgress && nextServiceCountdown && (
                        <p className="text-[10px] font-medium text-primary/70 mt-0.5">{nextServiceCountdown}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {currentSchedule.services.length === 1 && currentSchedule.services[0].type === "none" && (
              <p className="text-xs text-muted-foreground mt-3 pl-1 italic">
                The parish office is closed on Mondays. See you Tuesday!
              </p>
            )}
          </div>
        </div>

        {/* At a Glance - Quick Reference */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-primary" />
            </div>
            <h2 className="font-serif text-xl font-bold">At a Glance</h2>
          </div>
          <Card className="border border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden rounded-xl">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border/40">
                    <td className="px-4 py-3 font-semibold text-muted-foreground text-[11px] uppercase tracking-wider w-28">Weekend</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">Sat 5:30 PM</span>
                      <span className="text-muted-foreground/50 mx-2">·</span>
                      <span className="font-semibold">Sun 8:30, 10:30, 12:30*</span>
                    </td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="px-4 py-3 font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">Weekday</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">Tue–Fri 8:30 AM</span>
                      <span className="text-muted-foreground ml-2 text-xs">(No Monday Mass)</span>
                    </td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="px-4 py-3 font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">Confession</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">Sat 4:30–5:15 PM</span>
                      <span className="text-muted-foreground ml-2 text-xs">or by appt.</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">Lauds</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">Tue–Fri 8:00 AM</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="px-4 py-2.5 bg-muted/20 border-t border-border/40">
                <p className="text-xs text-muted-foreground">*12:30 PM Mass: October – June only. Holy Days announced in bulletin.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What to Expect - Compact inline items */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center">
              <Church className="w-3.5 h-3.5 text-primary" />
            </div>
            <h2 className="font-serif text-xl font-bold">What to Expect</h2>
          </div>
          <div className="space-y-2">
            {[
              { icon: Clock, title: "Mass Lasts About an Hour", desc: "Readings, homily, prayers, and the Eucharist" },
              { icon: Church, title: "Come As You Are", desc: "No dress code — business casual is common" },
              { icon: Calendar, title: "Follow Along Easily", desc: "Missalettes in each pew with all readings and responses" },
              { icon: Cross, title: "Everyone Is Welcome", desc: "Not Catholic? Come forward for a blessing" },
            ].map((item) => (
              <div key={item.title} className="reveal flex items-center gap-3.5 p-3.5 rounded-xl bg-card border border-border/40 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                <div className="w-9 h-9 rounded-lg bg-primary/6 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-primary/80" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
