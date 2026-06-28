/**
 * ParishScanConsole — the on-brand "alive" agent console shown at the top of
 * each page. A friendly parish scout appears to scan the page's domain (this
 * week's Masses, today's readings, ways to serve…) with a monospace eyebrow, a
 * green "live" pulse, an animated gold scan bar, and category chips that light
 * up in turn.
 *
 * Palette is intentionally LIGHT-TO-MEDIUM (it's a church): a soft, near-white
 * card on the parish green + liturgical gold tokens — the energy comes from the
 * pulse + scan motion, not a dark surface. Honors prefers-reduced-motion and
 * exposes a concise screen-reader summary instead of the animation.
 *
 * Content comes from the pure shared/parishScan config; this owns only motion.
 */
import { useEffect, useState } from "react";
import type { ParishScan } from "@shared/parishScan";

/** Track the user's reduced-motion preference (re-evaluates on change). */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

const TICK_MS = 60;
const STEP_MS = 2400;

export function ParishScanConsole({ scan }: { scan: ParishScan }) {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduced) {
      setStep(0);
      setProgress(100);
      return;
    }
    const inc = 100 / (STEP_MS / TICK_MS);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p + inc >= 100) {
          setStep((s) => (s + 1) % scan.steps.length);
          return 0;
        }
        return p + inc;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [reduced, scan.steps.length]);

  const activeChip = scan.chips.length ? step % scan.chips.length : -1;
  const currentStep = scan.steps[step] ?? scan.steps[0];

  return (
    <section
      aria-label={`Parish scan — ${scan.scope.toLowerCase()}`}
      className="border-b border-border/50 bg-secondary/30"
    >
      {/* Concise, non-animated summary for assistive tech. */}
      <span className="sr-only">
        {scan.scope}. Topics: {scan.chips.join(", ")}.
      </span>

      <div className="container py-3 sm:py-4">
        <div
          aria-hidden="true"
          className="rounded-xl border border-gold/30 bg-gradient-to-br from-card to-secondary/60 shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50">
            <span className="relative flex h-2 w-2">
              {!reduced && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-parish-green opacity-60" />
              )}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-parish-green" />
            </span>
            <span className="font-mono text-[11px] sm:text-xs tracking-[0.12em] text-muted-foreground">
              ST·PATRICK <span className="text-gold">· {scan.scope}</span>
            </span>
            <span className="ml-auto font-mono text-[11px] sm:text-xs text-parish-green">live</span>
          </div>

          {/* Scan line + progress */}
          <div className="px-4 py-3">
            <div className="font-mono text-[13px] sm:text-sm text-foreground/90 leading-relaxed">
              <span className="text-gold">▸</span> {currentStep}{" "}
              <span className="text-muted-foreground/70">
                {Math.min(step + 1, scan.steps.length)}<span className="opacity-50"> / {scan.steps.length}</span>
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold/70 to-gold transition-[width] duration-100 ease-linear"
                style={{ width: `${reduced ? 100 : Math.round(progress)}%` }}
              />
            </div>
          </div>

          {/* Chips */}
          <div className="px-4 pb-3 flex flex-wrap gap-1.5">
            {scan.chips.map((chip, i) => {
              const active = i === activeChip;
              return (
                <span
                  key={chip}
                  className={
                    "font-mono text-[10px] tracking-wider rounded-full px-2.5 py-1 border transition-colors " +
                    (active
                      ? "bg-gold text-accent-foreground border-gold font-semibold shadow-sm"
                      : "border-border text-muted-foreground/80")
                  }
                >
                  {chip}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
