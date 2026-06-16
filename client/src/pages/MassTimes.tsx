import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Church, Cross, MapPin, Phone, Sun, Calendar, ChevronRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useState, useMemo } from "react";

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
    case "mass": return { bg: "bg-primary/10", text: "text-primary", border: "border-l-primary", dot: "bg-primary" };
    case "confession": return { bg: "bg-purple-500/10", text: "text-purple-600", border: "border-l-purple-500", dot: "bg-purple-500" };
    case "prayer": return { bg: "bg-amber-500/10", text: "text-amber-600", border: "border-l-amber-500", dot: "bg-amber-500" };
    case "none": return { bg: "bg-muted/50", text: "text-muted-foreground", border: "border-l-muted", dot: "bg-muted-foreground" };
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

  const currentSchedule = useMemo(() => WEEKLY_SCHEDULE[selectedDay], [selectedDay]);

  return (
    <PageLayout>
      {/* Compact Page Header */}
      <section className="py-6 sm:py-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container">
          <p className="text-gold font-medium tracking-widest uppercase text-xs mb-1.5 animate-fade-in">Worship With Us</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2 animate-fade-in">
            Mass Times & Confession
          </h1>
          <p className="text-sm text-muted-foreground animate-fade-up">
            Join us in worship and prayer. All are welcome.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground animate-fade-up">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              29 Cox Ave, Armonk NY 10504
            </span>
            <span className="inline-flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-primary" />
              <a href="tel:9142739724" className="hover:text-primary transition-colors">(914) 273-9724</a>
            </span>
          </div>
        </div>
      </section>

      <div ref={revealRef} className="container py-4 sm:py-8">
        {/* Interactive Day Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-primary" />
            <h2 className="font-serif text-lg font-bold">Weekly Schedule</h2>
          </div>

          {/* Day Tab Bar */}
          <div className="flex gap-1 mb-4 p-1 bg-muted/30 rounded-xl overflow-x-auto">
            {WEEKLY_SCHEDULE.map((day, index) => {
              const isSelected = selectedDay === index;
              const isToday = today === index;
              return (
                <button
                  key={day.shortDay}
                  onClick={() => setSelectedDay(index)}
                  className={`
                    relative flex-1 min-w-[44px] py-2.5 px-1 rounded-lg text-center transition-all duration-200
                    ${isSelected
                      ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                      : "hover:bg-muted/60 text-muted-foreground"
                    }
                  `}
                >
                  <span className={`block text-[10px] font-medium uppercase tracking-wide ${isSelected ? "text-white/80" : ""}`}>
                    {day.shortDay}
                  </span>
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                  {isToday && isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
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
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
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
                    className={`flex items-center gap-3 p-3 rounded-lg border-l-3 ${colors.border} bg-card shadow-sm transition-all duration-200 hover:shadow-md`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">{service.name}</p>
                      {service.note && (
                        <p className="text-[10px] text-muted-foreground">{service.note}</p>
                      )}
                    </div>
                    {service.time && (
                      <span className={`text-sm font-bold ${colors.text} shrink-0`}>
                        {service.time}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {currentSchedule.services.length === 1 && currentSchedule.services[0].type === "none" && (
              <p className="text-xs text-muted-foreground mt-2 pl-1">
                The parish office is closed on Mondays. See you Tuesday!
              </p>
            )}
          </div>
        </div>

        {/* At a Glance - Quick Reference */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-primary" />
            <h2 className="font-serif text-lg font-bold">At a Glance</h2>
          </div>
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="px-3 py-2.5 font-medium text-muted-foreground text-xs uppercase w-28">Weekend</td>
                    <td className="px-3 py-2.5">
                      <span className="font-semibold">Sat 5:30 PM</span>
                      <span className="text-muted-foreground mx-1.5">·</span>
                      <span className="font-semibold">Sun 8:30, 10:30, 12:30*</span>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-3 py-2.5 font-medium text-muted-foreground text-xs uppercase">Weekday</td>
                    <td className="px-3 py-2.5">
                      <span className="font-semibold">Tue–Fri 8:30 AM</span>
                      <span className="text-muted-foreground ml-1.5 text-xs">(No Monday Mass)</span>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-3 py-2.5 font-medium text-muted-foreground text-xs uppercase">Confession</td>
                    <td className="px-3 py-2.5">
                      <span className="font-semibold">Sat 4:30–5:15 PM</span>
                      <span className="text-muted-foreground ml-1.5 text-xs">or by appt.</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-medium text-muted-foreground text-xs uppercase">Lauds</td>
                    <td className="px-3 py-2.5">
                      <span className="font-semibold">Tue–Fri 8:00 AM</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="px-3 py-2 bg-muted/30 border-t border-border/50">
                <p className="text-[10px] text-muted-foreground">*12:30 PM Mass: October – June only. Holy Days announced in bulletin.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What to Expect - Compact inline items */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Church className="w-4 h-4 text-primary" />
            <h2 className="font-serif text-lg font-bold">What to Expect</h2>
          </div>
          <div className="space-y-1.5">
            {[
              { icon: Clock, title: "Mass Lasts About an Hour", desc: "Readings, homily, prayers, and the Eucharist" },
              { icon: Church, title: "Come As You Are", desc: "No dress code — business casual is common" },
              { icon: Calendar, title: "Follow Along Easily", desc: "Missalettes in each pew with all readings and responses" },
              { icon: Cross, title: "Everyone Is Welcome", desc: "Not Catholic? Come forward for a blessing" },
            ].map((item) => (
              <Card key={item.title} className="reveal border-0 shadow-sm">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
