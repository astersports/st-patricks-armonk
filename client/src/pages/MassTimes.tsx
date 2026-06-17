import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Church, Cross, MapPin, Phone, Sun, Calendar, ChevronRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useState, useMemo } from "react";
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

const WEEKLY_SCHEDULE: DaySchedule[] = [
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
  const today = new Date().getDay(); // 0 = Sunday
  const [selectedDay, setSelectedDay] = useState(today);

  // Reorder days starting from today (hide past days)
  const reorderedDays = useMemo(() => {
    const days = WEEKLY_SCHEDULE.map((day, index) => ({ ...day, originalIndex: index }));
    return [...days.slice(today), ...days.slice(0, today)];
  }, [today]);

  const currentSchedule = useMemo(() => WEEKLY_SCHEDULE[selectedDay], [selectedDay]);

  return (
    <PageLayout>
      {/* Page Header — refined with better hierarchy */}
      <PageHeader
        eyebrow="Worship With Us"
        title="Mass Times & Confession"
        description="Join us in worship and prayer. All are welcome at St. Patrick's."
      />

      <div ref={revealRef} className="container py-6 sm:py-10 space-y-8">
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
                </button>
              );
            })}
          </div>

          {/* Selected Day Content */}
          <div className="animate-fade-in" key={selectedDay}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-base text-foreground">{currentSchedule.day}</h3>
              {selectedDay === today && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/8 px-2.5 py-1 rounded-full">
                  Today
                </span>
              )}
            </div>

            <div className="space-y-2">
              {currentSchedule.services.map((service, idx) => {
                const colors = getServiceColor(service.type);
                const Icon = getServiceIcon(service.type);
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-l-3 ${colors.border} bg-card shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]`}
                  >
                    <div className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4.5 h-4.5 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">{service.name}</p>
                      {service.note && (
                        <p className="text-xs text-muted-foreground mt-0.5">{service.note}</p>
                      )}
                    </div>
                    {service.time && (
                      <span className={`text-sm font-bold ${colors.text} shrink-0 tabular-nums`}>
                        {service.time}
                      </span>
                    )}
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
