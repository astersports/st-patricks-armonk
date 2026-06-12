import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export default function ParishCalendar() {
  return (
    <PageLayout>
      {/* Page Header */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12 border-b border-primary/10">
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-8 h-8 text-primary" />
            <h1 className="font-serif text-4xl md:text-5xl text-foreground">Parish Calendar</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Stay up to date with all parish events, meetings, and activities.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-6xl">
          {/* Google Calendar Embed */}
          <Card className="p-2 md:p-4 mb-8">
            <div className="aspect-[4/3] md:aspect-[16/9] w-full">
              <iframe
                src="https://calendar.google.com/calendar/embed?src=auhh52vq6k97cih05uovakdvlcobb3qj%40import.calendar.google.com&ctz=America%2FNew_York&showTitle=0&showNav=1&showPrint=0&showTabs=1&showCalendars=0"
                className="w-full h-full rounded-lg border-0"
                title="St. Patrick's Parish Events Calendar"
              />
            </div>
          </Card>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-5">
              <h3 className="font-serif text-lg text-foreground mb-2">CCD Calendar</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Religious Education class schedule and important dates.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/ccd-calendar">View CCD Calendar</a>
              </Button>
            </Card>
            <Card className="p-5">
              <h3 className="font-serif text-lg text-foreground mb-2">CYO Practice Schedule</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Practice times at St. Francis Hall.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/cyo-basketball">View CYO Schedule</a>
              </Button>
            </Card>

          </div>
        </div>
      </section>
    </PageLayout>
  );
}
