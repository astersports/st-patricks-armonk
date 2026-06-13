import PageLayout from "@/components/PageLayout";
import TimelineFeed, { type TimelineEvent } from "@/components/TimelineFeed";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Users, Info } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function CyoBasketball() {
  const { data: icsEvents, isLoading } = trpc.googleCalendar.cyoEvents.useQuery();

  // Map ICS events to Timeline Feed format
  const timelineEvents: TimelineEvent[] = (icsEvents || []).map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    location: e.location,
    startDate: e.startDate,
    endDate: e.endDate,
    allDay: e.allDay,
  }));

  return (
    <PageLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-orange-50 to-background py-10 sm:py-12 border-b border-orange-200/50">
        <div className="container max-w-4xl">
          <Badge variant="secondary" className="mb-2 text-xs bg-orange-100 text-orange-700">ST. FRANCIS HALL</Badge>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-2">CYO Practice Schedule</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            Practice times and gym availability for St. Patrick's CYO Basketball.
          </p>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="py-3 bg-orange-50/50 border-b border-border/50">
        <div className="container max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              St. Francis Hall, Armonk
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="w-3.5 h-3.5 text-orange-600" />
              Grades 3–8
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 text-orange-600" />
              Season: Nov – Mar
            </span>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container max-w-4xl">
          {/* Timeline Feed from ICS */}
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
              showFilters={timelineEvents.length > 5}
              emptyMessage="No upcoming CYO events scheduled. The season typically runs November through March."
              emptyIcon={<Calendar className="w-10 h-10 text-orange-300 mx-auto" />}
            />
          )}

          {/* Info Cards */}
          <div className="grid sm:grid-cols-2 gap-3 mt-8">
            <Card className="p-4 border-l-[3px] border-l-orange-500">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">Practice Times</h3>
                  <p className="text-xs text-muted-foreground">
                    Times vary by team and grade level. Check the schedule above for your team's gym time.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-l-[3px] border-l-orange-500">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">Gym Rules</h3>
                  <p className="text-xs text-muted-foreground">
                    Non-marking sneakers required. No food on court. Prompt pickup after practice.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact */}
          <Card className="p-4 sm:p-5 bg-orange-50/50 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-foreground text-sm mb-0.5">Contact CYO</h3>
                <p className="text-xs text-muted-foreground">
                  <a href="mailto:cyo@stpatrickinarmonk.org" className="text-primary hover:underline">cyo@stpatrickinarmonk.org</a>
                  {" · "}Registration opens September
                </p>
              </div>
              <Badge variant="secondary" className="text-xs self-start sm:self-center">Season: Nov – Mar</Badge>
            </div>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}
