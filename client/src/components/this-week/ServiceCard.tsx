/**
 * Service Card — Individual service row with live/next/past state and countdown.
 */

import { CalendarPlus, Check } from "lucide-react";
import { downloadMassICS } from "@/lib/icsGenerator";
import { typeStyles, type ScheduleItem } from "./scheduleConfig";

interface ServiceCardProps {
  svc: ScheduleItem;
  idx: number;
  isPast: boolean;
  isLive: boolean;
  isNext: boolean;
  countdown?: string;
  progress?: string;
  dayName: string;
}

export function ServiceCard({ svc, idx, isPast, isLive, isNext, countdown, progress, dayName }: ServiceCardProps) {
  const style = typeStyles[svc.type];
  const Icon = style.icon;

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
        {isLive && <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 block font-medium">{progress}</span>}
        {countdown && !isLive && !isPast && <span className="text-xs text-muted-foreground mt-0.5 block">{countdown}</span>}
      </div>
      {!isPast && (
        <button
          onClick={(e) => {
            e.stopPropagation();
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
}
