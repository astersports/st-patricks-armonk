import { useState, useEffect, useMemo } from "react";
import { Church } from "lucide-react";

const TIMEZONE = "America/New_York";

// Mass schedule (mirrors MassTimes.tsx)
const MASS_TIMES = [
  { day: 0, start: [8, 30], end: [9, 30], label: "Sunday" },
  { day: 0, start: [10, 30], end: [11, 30], label: "Sunday" },
  { day: 0, start: [12, 30], end: [13, 30], label: "Sunday" },
  { day: 2, start: [8, 30], end: [9, 0], label: "Tuesday" },
  { day: 3, start: [8, 30], end: [9, 0], label: "Wednesday" },
  { day: 4, start: [8, 30], end: [9, 0], label: "Thursday" },
  { day: 5, start: [8, 30], end: [9, 0], label: "Friday" },
  { day: 6, start: [17, 30], end: [18, 30], label: "Saturday" },
] as const;

function getMassStatus(now: Date) {
  const day = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Check if Mass is currently active
  for (const t of MASS_TIMES) {
    if (t.day === day) {
      const startMin = t.start[0] * 60 + t.start[1];
      const endMin = t.end[0] * 60 + t.end[1];
      if (currentMinutes >= startMin && currentMinutes < endMin) {
        const remaining = endMin - currentMinutes;
        return { isActive: true, text: `Mass in Progress — ${remaining}m remaining` };
      }
    }
  }

  // Find next Mass
  let minDiff = Infinity;
  let nextLabel = "";
  let nextTimeStr = "";
  for (const t of MASS_TIMES) {
    let daysAhead = t.day - day;
    if (daysAhead < 0) daysAhead += 7;
    const startMin = t.start[0] * 60 + t.start[1];
    let diffMinutes = daysAhead * 24 * 60 + (startMin - currentMinutes);
    if (diffMinutes <= 0) diffMinutes += 7 * 24 * 60;
    if (diffMinutes < minDiff) {
      minDiff = diffMinutes;
      nextLabel = t.label;
      const h = t.start[0] as number;
      const m = t.start[1] as number;
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      nextTimeStr = `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
    }
  }

  // Format countdown
  let countdown = "";
  if (minDiff < 60) {
    countdown = `${minDiff}m`;
  } else if (minDiff < 24 * 60) {
    const h = Math.floor(minDiff / 60);
    const m = minDiff % 60;
    countdown = m > 0 ? `${h}h ${m}m` : `${h}h`;
  } else {
    const d = Math.floor(minDiff / (24 * 60));
    countdown = `${d} day${d > 1 ? "s" : ""}`;
  }

  return {
    isActive: false,
    text: `Next Mass in ${countdown} — ${nextLabel} ${nextTimeStr}`,
  };
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
    <div
      className={`
        flex items-center justify-center gap-2.5 px-4 py-3 rounded-full
        ${status.isActive
          ? "bg-primary/10 border border-primary/20 shadow-md"
          : "bg-card border border-border/60 shadow-sm"
        }
        transition-all duration-200
      `}
    >
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
      <Church className={`w-4 h-4 shrink-0 ${status.isActive ? "text-primary" : "text-primary/70"}`} />

      {/* Text */}
      <span className={`text-sm font-semibold ${
        status.isActive ? "text-primary" : "text-foreground/80"
      }`}>
        {status.text}
      </span>
    </div>
  );
}
