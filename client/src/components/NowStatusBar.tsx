import { useState, useEffect, useMemo } from "react";
import { Church, Cross, Sun } from "lucide-react";

const TIMEZONE = "America/New_York";

// Weekly schedule (mirrors MassTimes.tsx)
const SERVICES = [
  {
    id: "mass",
    label: "Mass",
    icon: Church,
    color: "text-primary",
    dotActive: "bg-primary",
    dotInactive: "bg-muted-foreground/30",
    bgActive: "bg-primary/10",
    times: [
      { day: 0, start: [8, 30], end: [9, 30] },
      { day: 0, start: [10, 30], end: [11, 30] },
      { day: 0, start: [12, 30], end: [13, 30] },
      { day: 2, start: [8, 30], end: [9, 0] },
      { day: 3, start: [8, 30], end: [9, 0] },
      { day: 4, start: [8, 30], end: [9, 0] },
      { day: 5, start: [8, 30], end: [9, 0] },
      { day: 6, start: [17, 30], end: [18, 30] },
    ],
  },
  {
    id: "confession",
    label: "Confession",
    icon: Cross,
    color: "text-purple-600",
    dotActive: "bg-purple-500",
    dotInactive: "bg-muted-foreground/30",
    bgActive: "bg-purple-500/10",
    times: [
      { day: 6, start: [16, 30], end: [17, 15] },
    ],
  },
  {
    id: "prayer",
    label: "Prayer",
    icon: Sun,
    color: "text-amber-600",
    dotActive: "bg-amber-500",
    dotInactive: "bg-muted-foreground/30",
    bgActive: "bg-amber-500/10",
    times: [
      { day: 2, start: [8, 0], end: [8, 25] },
      { day: 3, start: [8, 0], end: [8, 25] },
      { day: 4, start: [8, 0], end: [8, 25] },
      { day: 5, start: [8, 0], end: [8, 25] },
    ],
  },
] as const;

type ServiceStatus = "active" | "next" | "closed";

interface StatusResult {
  status: ServiceStatus;
  statusText: string;
}

function getServiceStatus(
  service: typeof SERVICES[number],
  now: Date
): StatusResult {
  const day = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Check if currently active
  for (const t of service.times) {
    if (t.day === day) {
      const startMin = t.start[0] * 60 + t.start[1];
      const endMin = t.end[0] * 60 + t.end[1];
      if (currentMinutes >= startMin && currentMinutes < endMin) {
        const remaining = endMin - currentMinutes;
        return { status: "active", statusText: `Now · ${remaining}m left` };
      }
    }
  }

  // Find next occurrence
  let minDiff = Infinity;
  let nextTimeStr = "";
  for (const t of service.times) {
    let daysAhead = t.day - day;
    if (daysAhead < 0) daysAhead += 7;
    const startMin = t.start[0] * 60 + t.start[1];
    let diffMinutes = daysAhead * 24 * 60 + (startMin - currentMinutes);
    if (diffMinutes <= 0) diffMinutes += 7 * 24 * 60;
    if (diffMinutes < minDiff) {
      minDiff = diffMinutes;
      const h = t.start[0] as number;
      const m = t.start[1] as number;
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      nextTimeStr = `${days[t.day]} ${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
    }
  }

  if (minDiff < 120) {
    return { status: "next", statusText: `In ${minDiff}m` };
  }
  if (minDiff < 24 * 60) {
    const h = Math.floor(minDiff / 60);
    return { status: "next", statusText: `In ${h}h` };
  }
  return { status: "closed", statusText: nextTimeStr };
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

  const statuses = useMemo(() => {
    return SERVICES.map((service) => ({
      ...service,
      ...getServiceStatus(service, now),
    }));
  }, [now]);

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {statuses.map((s) => {
        const Icon = s.icon;
        const isActive = s.status === "active";
        const isNext = s.status === "next";
        return (
          <div
            key={s.id}
            className={`
              relative rounded-xl px-3 py-3 transition-all duration-200
              ${isActive
                ? `${s.bgActive} border border-primary/20 shadow-md`
                : "bg-card border border-border/50"
              }
            `}
          >
            {/* Active glow overlay */}
            {isActive && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            )}
            <div className="flex items-center gap-2 mb-1.5">
              <Icon className={`w-5 h-5 ${isActive ? s.color : "text-muted-foreground"}`} />
              <span className={`text-base font-bold ${isActive ? "text-foreground" : "text-foreground/80"}`}>
                {s.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Pulsing dot */}
              <span className="relative flex h-2 w-2">
                {isActive && (
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${s.dotActive} opacity-60`} />
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  isActive ? s.dotActive : isNext ? "bg-amber-400" : s.dotInactive
                }`} />
              </span>
              <span className={`text-sm font-medium ${
                isActive ? s.color : isNext ? "text-amber-600" : "text-muted-foreground"
              }`}>
                {s.statusText}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
