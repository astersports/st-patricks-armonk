import { useMemo } from "react";
import PageLayout from "@/components/PageLayout";
import TimelineFeed, { type TimelineEvent } from "@/components/TimelineFeed";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Info } from "lucide-react";

// Static CYO practice schedule data (since there's no DB table for CYO, we use the Google Calendar embed approach)
// For now, show the embedded calendar as a fallback with a note
export default function CyoBasketball() {
  // CYO doesn't have a database-backed event list, so we'll keep the Google Calendar
  // but style the page consistently with the Timeline Feed aesthetic
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
          {/* Google Calendar in Timeline-style frame */}
          <div className="mb-8">
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-2 mb-3 border-b border-border/50">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Practice Schedule
              </h3>
            </div>
            <div className="rounded-xl overflow-hidden border border-border shadow-sm bg-white">
              <iframe
                src="https://calendar.google.com/calendar/embed?src=stpatrickinarmonk.org_5snqr5qqph11et22r6sk81k67g%40group.calendar.google.com&ctz=America%2FNew_York&showTitle=0&showNav=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0&mode=AGENDA"
                className="w-full border-0"
                style={{ height: "500px" }}
                title="CYO Practice Calendar - St. Francis Hall"
              />
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid sm:grid-cols-2 gap-3">
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
