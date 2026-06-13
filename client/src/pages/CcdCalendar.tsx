import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, Clock, Bell } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

const eventTypeColors: Record<string, string> = {
  class: "bg-green-100 text-green-800",
  holiday: "bg-amber-100 text-amber-800",
  special: "bg-blue-100 text-blue-800",
  sacrament: "bg-purple-100 text-purple-800",
};

export default function CcdCalendar() {
  const { data: ccdEvents, isLoading } = trpc.ccd.listEvents.useQuery({ schoolYear: "2026-2027" });

  return (
    <PageLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-green-50 to-white py-12 border-b-4 border-primary">
        <div className="container">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3">CCD Calendar</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Religious Education class schedule for the current school year. Stay informed about upcoming classes, holy days, and special events.
          </p>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="py-10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="p-6 border-l-4 border-l-primary">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Class Times</h3>
                  <p className="text-sm text-muted-foreground">Mon/Wed: 3:45–4:45 PM (Gr. 1–2)</p>
                  <p className="text-sm text-muted-foreground">Mon/Wed: 3:30–4:45 PM (Gr. 3–4)</p>
                  <p className="text-sm text-muted-foreground">Mon 5–6 PM / Wed 6–7 PM (Gr. 5–8)</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-l-4 border-l-accent">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-accent mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Grades</h3>
                  <p className="text-sm text-muted-foreground">1st through 8th Grade</p>
                  <p className="text-sm text-muted-foreground">Sacramental Prep: 2nd & 8th</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-l-4 border-l-primary">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Registration</h3>
                  <p className="text-sm text-muted-foreground">2026–27 Registration Open</p>
                  <Link href="/ccd-registration">
                    <span className="text-sm text-primary font-medium hover:underline cursor-pointer">Register Now →</span>
                  </Link>
                </div>
              </div>
            </Card>
          </div>

          {/* Google Calendar Embed */}
          <div className="mb-10">
            <h2 className="font-serif text-2xl text-foreground flex items-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-primary" />
              Religious Education Schedule
            </h2>
            <div className="rounded-xl overflow-hidden border border-border shadow-sm bg-white">
              <iframe
                src="https://calendar.google.com/calendar/embed?src=reled%40stpatrickinarmonk.org&ctz=America%2FNew_York&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0&mode=AGENDA"
                style={{ border: 0 }}
                width="100%"
                height="600"
                frameBorder="0"
                scrolling="no"
                title="CCD Calendar"
              />
            </div>
          </div>

          {/* Dynamic Key Dates from Database */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="font-serif text-xl text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Key Dates 2026–2027
              </h3>
              <div className="space-y-3">
                {isLoading ? (
                  <div className="space-y-3">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-8 bg-muted/50 rounded animate-pulse" />
                    ))}
                  </div>
                ) : ccdEvents && ccdEvents.length > 0 ? (
                  ccdEvents.map((event: any) => (
                    <div key={event.id} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                      <span className="text-xs font-mono text-primary bg-green-50 px-2 py-1 rounded whitespace-nowrap">
                        {new Date(event.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <div className="flex-1">
                        <span className="text-sm text-foreground">{event.title}</span>
                        {event.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                        )}
                      </div>
                      <Badge variant="secondary" className={`text-xs ${eventTypeColors[event.eventType] || ""}`}>
                        {event.eventType}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground py-4 text-center">
                    Key dates will be posted soon. Check the Google Calendar above for the latest schedule.
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-serif text-xl text-foreground mb-4">Contact Religious Education</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  For questions about the CCD calendar, class schedules, or registration, please contact the Religious Education Office.
                </p>
                <div className="bg-green-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm"><strong>Phone:</strong> <a href="tel:9145311759" className="text-primary hover:underline">(914) 531-1759</a></p>
                  <p className="text-sm"><strong>Email:</strong> <a href="mailto:reled@stpatrickinarmonk.org" className="text-primary hover:underline">reled@stpatrickinarmonk.org</a></p>
                  <p className="text-sm"><strong>Office Hours:</strong> Monday–Thursday, 10 AM – 5 PM</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link href="/ccd-registration">
                    <Button className="w-full sm:w-auto">Register for CCD</Button>
                  </Link>
                  <Link href="/faith-formation">
                    <Button variant="outline" className="w-full sm:w-auto">Faith Formation Info</Button>
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
