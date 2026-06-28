/**
 * "This Week at the Parish" card — a public, glanceable list of the next 7 days
 * of parish events, key dates, and holy days, with a short intro. Data + intro
 * come from the highlights.thisWeek endpoint (deterministic; AI-polished intro
 * when a key is configured). Renders nothing when there's nothing coming up.
 */
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Star, Church, MapPin, Sparkles } from "lucide-react";
import type { HighlightKind } from "@shared/thisWeekHighlights";

const KIND_ICON: Record<HighlightKind, typeof Calendar> = {
  event: Calendar,
  key_date: Star,
  holy_day: Church,
  volunteer: Star,
};

export function ThisWeekHighlights() {
  const { data, isLoading } = trpc.highlights.thisWeek.useQuery({ withAiIntro: true });

  if (isLoading) {
    return (
      <Card className="p-4 space-y-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </Card>
    );
  }

  // Nothing coming up — don't clutter the page.
  if (!data || data.items.length === 0) return null;

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-4 h-4 text-primary" />
        <h2 className="font-semibold text-base">This Week at the Parish</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{data.intro}</p>

      <ul className="space-y-2.5">
        {data.items.map((h, i) => {
          const Icon = KIND_ICON[h.kind] ?? Calendar;
          return (
            <li key={`${h.kind}-${h.iso}-${i}`} className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-foreground">{h.title}</span>
                  {h.urgent && (
                    <span className="text-[10px] uppercase tracking-wide font-semibold text-white bg-primary rounded px-1.5 py-0.5">
                      Urgent
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{h.dateLabel}</div>
                {h.location && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" aria-hidden="true" /> {h.location}
                  </div>
                )}
                {h.note && <div className="text-xs text-muted-foreground">{h.note}</div>}
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
