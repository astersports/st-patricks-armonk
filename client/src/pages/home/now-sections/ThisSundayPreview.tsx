/**
 * This Sunday Preview — Shows upcoming Sunday Mass readings and times.
 */

import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Clock, Cross } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ThisSundayPreview() {
  const { data: sundayData, isLoading } = trpc.dailyReadings.nextSunday.useQuery(undefined, {
    staleTime: 60 * 60 * 1000,
  });

  if (isLoading || !sundayData) return null;
  if (sundayData.daysUntil > 6) return null;

  const isToday = sundayData.daysUntil === 0;
  const dayLabel = isToday ? "Today" : sundayData.daysUntil === 1 ? "Tomorrow" : `in ${sundayData.daysUntil} days`;

  return (
    <Card className="rounded-xl border border-border/60 shadow-sm overflow-hidden mt-4 bg-gradient-to-r from-purple-50/50 via-white to-gold/5 dark:from-purple-950/20 dark:via-background dark:to-gold/5">
      <CardContent className="p-0">
        <Link href="/mass-times" className="block group">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                  <Cross className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <span className="font-serif text-base font-bold text-foreground">
                    {isToday ? "Sunday Mass" : "This Sunday"}
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">
                {dayLabel}
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground/90 mb-2">{sundayData.liturgicTitle}</p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="text-xs bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full">
                {sundayData.firstReading.title.split(" ").slice(0, 3).join(" ")}
              </span>
              <span className="text-xs bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full">
                {sundayData.psalm.title.split(" ").slice(0, 2).join(" ")}
              </span>
              {sundayData.secondReading && (
                <span className="text-xs bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full">
                  {sundayData.secondReading.title.split(" ").slice(0, 3).join(" ")}
                </span>
              )}
              <span className="text-xs bg-gold/15 text-gold font-medium px-2 py-0.5 rounded-full">
                {sundayData.gospel.title.replace("Holy Gospel of Jesus Christ according to ", "Gospel: ")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>Masses at 8:30 AM, 10:30 AM & 12:30 PM</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
