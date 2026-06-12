import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users, ExternalLink, Info } from "lucide-react";

export default function CyoBasketball() {
  return (
    <PageLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-green-50 to-white py-8 md:py-12 border-b-4 border-primary">
        <div className="container">
          <Badge variant="secondary" className="mb-3 text-xs">ST. FRANCIS HALL</Badge>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground mb-2">CYO Practice Schedule</h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
            Practice times and gym availability for St. Patrick's CYO Basketball at St. Francis Hall.
          </p>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="py-4 bg-primary/5 border-b border-border">
        <div className="container">
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              St. Francis Hall, Armonk
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="w-4 h-4 text-primary" />
              Grades 3–8
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              Season: Nov – Mar
            </span>
          </div>
        </div>
      </section>

      {/* Calendar Embed */}
      <section className="py-8 md:py-12">
        <div className="container max-w-5xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl md:text-2xl text-foreground">Practice Calendar</h2>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://calendar.google.com/calendar/embed?src=stpatrickinarmonk.org_5snqr5qqph11et22r6sk81k67g%40group.calendar.google.com&ctz=America%2FNew_York"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5"
              >
                Open in Google <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          </div>

          <Card className="p-1 md:p-3 mb-8">
            <div className="aspect-[4/3] md:aspect-[16/9] w-full">
              <iframe
                src="https://calendar.google.com/calendar/embed?src=stpatrickinarmonk.org_5snqr5qqph11et22r6sk81k67g%40group.calendar.google.com&ctz=America%2FNew_York&showTitle=0&showNav=1&showPrint=0&showTabs=0&showCalendars=0"
                className="w-full h-full rounded-lg border-0"
                title="CYO Practice Calendar - St. Francis Hall"
              />
            </div>
          </Card>

          {/* Practice Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="p-4 md:p-5 border-l-4 border-l-primary">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Practice Times</h3>
                  <p className="text-sm text-muted-foreground">
                    Practice times vary by team and grade level. Check the calendar above for your team's scheduled gym time at St. Francis Hall.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 md:p-5 border-l-4 border-l-accent">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Gym Rules</h3>
                  <p className="text-sm text-muted-foreground">
                    Non-marking sneakers required. No food or drinks on the court. Players must be picked up promptly after practice ends.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* About Section */}
          <Card className="p-5 md:p-6 bg-green-50/50">
            <h3 className="font-serif text-lg text-foreground mb-3">About CYO Basketball</h3>
            <p className="text-sm text-muted-foreground mb-3">
              The CYO (Catholic Youth Organization) Basketball program at St. Patrick's provides boys and girls in grades 3–8 with the opportunity to develop basketball skills, teamwork, and sportsmanship in a faith-based environment. Practices are held at St. Francis Hall.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Season typically runs from November through March. Registration opens in September.
            </p>
            <div className="border-t border-border pt-4">
              <h4 className="font-semibold text-sm text-foreground mb-2">Contact CYO</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><strong>Email:</strong> <a href="mailto:cyo@stpatrickinarmonk.org" className="text-primary hover:underline">cyo@stpatrickinarmonk.org</a></p>
                <p><strong>Location:</strong> St. Francis Hall, Armonk NY</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}
