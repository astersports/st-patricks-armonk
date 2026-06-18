/**
 * Holy Day Alert — Shows upcoming Holy Days of Obligation within 7 days.
 */

import { useMemo } from "react";
import { getUpcomingHolyDays } from "./scheduleData";

export function HolyDayAlert() {
  const upcomingHolyDays = useMemo(() => getUpcomingHolyDays(), []);

  if (upcomingHolyDays.length === 0) return null;

  return (
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
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">Holy Day of Obligation</p>
          {upcomingHolyDays.map((hd, i) => (
            <div key={i} className={i > 0 ? "mt-2 pt-2 border-t border-amber-200/50" : ""}>
              <p className="font-semibold text-sm text-amber-900">{hd.name}</p>
              <p className="text-xs text-amber-700 mt-0.5">
                {hd.daysUntil === 0 ? "Today" : hd.daysUntil === 1 ? "Tomorrow" : `${hd.date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}`}
                {" "}&middot; Mass at <span className="font-semibold">{hd.massTime}</span>
              </p>
            </div>
          ))}
          <p className="text-xs text-amber-600 mt-2 italic">Catholics are obligated to attend Mass on this day.</p>
        </div>
      </div>
    </div>
  );
}
