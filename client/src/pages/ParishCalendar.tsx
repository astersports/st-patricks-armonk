import PageLayout from "@/components/PageLayout";
import TimelineFeed, { type TimelineEvent } from "@/components/TimelineFeed";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, BookOpen, Dumbbell } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function ParishCalendar() {
  const { data: events, isLoading } = trpc.events.listUpcoming.useQuery();

  const timelineEvents: TimelineEvent[] = (events || []).map((e) => ({
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
      {/* Page Header */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-10 sm:py-12 border-b border-primary/10">
        <div className="container max-w-4xl">
          <p className="text-gold font-medium tracking-widest uppercase text-xs mb-2">Stay Connected</p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-2">Parish Calendar</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            All upcoming events, meetings, and activities at St. Patrick's.
          </p>
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
              showFilters={true}
              emptyMessage="No featured events right now. See the full schedule below."
              emptyIcon={<Calendar className="w-10 h-10 text-primary/30 mx-auto" />}
            />
          )}

          {/* Google Calendar Embed */}
          <div className="mt-10 pt-8 border-t border-border/50">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Full Schedule</h2>
            <div className="rounded-xl overflow-hidden border border-border shadow-sm bg-white">
              <iframe
                src="https://calendar.google.com/calendar/embed?src=stpatrickinarmonk.org_r7off5khpqo4fhbq9r4mf3k1ek%40group.calendar.google.com&ctz=America%2FNew_York&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0&mode=AGENDA"
                style={{ border: 0 }}
                width="100%"
                height="500"
                className="w-full"
                title="Parish Calendar"
              />
            </div>
          </div>

          {/* Other Calendars */}
          <div className="grid sm:grid-cols-2 gap-3 mt-10 pt-8 border-t border-border/50">
            <Link href="/ccd-calendar">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4.5 h-4.5 text-green-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">CCD Calendar</h3>
                    <p className="text-xs text-muted-foreground">Religious Education schedule</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/cyo-basketball">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                    <Dumbbell className="w-4.5 h-4.5 text-orange-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">CYO Practice</h3>
                    <p className="text-xs text-muted-foreground">Basketball at St. Francis Hall</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
