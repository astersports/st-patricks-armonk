import PageLayout from "@/components/PageLayout";
import TimelineFeed, { type TimelineEvent } from "@/components/TimelineFeed";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, BookOpen, Clock, Bell } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function CcdCalendar() {
  const { data: ccdEvents, isLoading } = trpc.ccd.listEvents.useQuery({ schoolYear: "2026-2027" });

  const timelineEvents: TimelineEvent[] = (ccdEvents || []).map((e: any) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    location: e.location,
    startDate: e.eventDate,
    endDate: e.endDate,
    category: e.eventType,
    grade: e.grade,
  }));

  return (
    <PageLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-green-50 to-background py-10 sm:py-12 border-b border-primary/10">
        <div className="container max-w-4xl">
          <Badge variant="secondary" className="mb-2 text-xs">2026–2027 SCHOOL YEAR</Badge>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-2">CCD Calendar</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            Religious Education class schedule, holy days, and special events.
          </p>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="py-4 bg-primary/5 border-b border-border/50">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 text-sm">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <div>
                <span className="font-medium text-foreground">Gr. 1–2:</span>{" "}
                <span className="text-muted-foreground">Mon/Wed 3:45–4:45</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <div>
                <span className="font-medium text-foreground">Gr. 3–4:</span>{" "}
                <span className="text-muted-foreground">Mon/Wed 3:30–4:45</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <div>
                <span className="font-medium text-foreground">Gr. 5–8:</span>{" "}
                <span className="text-muted-foreground">Mon 5–6 / Wed 6–7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container max-w-4xl">
          {/* Timeline Feed */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 p-4 rounded-lg border">
                  <Skeleton className="w-12 h-14 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <TimelineFeed
              events={timelineEvents}
              categories={["class", "holiday", "special", "sacrament"]}
              showFilters={true}
              emptyMessage="CCD calendar events will be posted soon. Check back for the 2026–2027 schedule."
              emptyIcon={<BookOpen className="w-10 h-10 text-primary/30 mx-auto" />}
            />
          )}

          {/* Bottom Actions */}
          <div className="mt-10 pt-8 border-t border-border/50">
            <Card className="p-4 sm:p-5 bg-green-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Religious Education Office</h3>
                  <p className="text-sm text-muted-foreground">
                    <a href="tel:9145311759" className="text-primary hover:underline">(914) 531-1759</a>
                    {" · "}
                    <a href="mailto:reled@stpatrickinarmonk.org" className="text-primary hover:underline">reled@stpatrickinarmonk.org</a>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href="/ccd-registration">
                    <Button size="sm">Register for CCD</Button>
                  </Link>
                  <Link href="/faith-formation">
                    <Button variant="outline" size="sm">Faith Formation</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
