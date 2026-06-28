/**
 * Renders sacrament-submission triage flags as compact badges. Pure
 * presentational — the flags are computed by shared/sacramentTriage.
 */
import type { TriageFlag, TriageSeverity } from "@shared/sacramentTriage";

const SEVERITY_CLASS: Record<TriageSeverity, string> = {
  alert: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  warn: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  info: "bg-muted text-muted-foreground",
};

export function SubmissionTriageFlags({ flags, className = "" }: { flags: TriageFlag[]; className?: string }) {
  if (flags.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-1 ${className}`} aria-label="Needs attention">
      {flags.map((f, i) => (
        <span
          key={`${f.severity}-${f.label}-${i}`}
          className={`text-[10px] font-medium rounded px-1.5 py-0.5 ${SEVERITY_CLASS[f.severity]}`}
        >
          {f.label}
        </span>
      ))}
    </div>
  );
}
