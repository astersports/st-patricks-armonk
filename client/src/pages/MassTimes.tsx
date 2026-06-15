import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Church, Cross, MapPin, Phone, Sun } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

export default function MassTimes() {
  const revealRef = useReveal();

  return (
    <PageLayout>
      {/* Page Header */}
      <section className="relative py-10 sm:py-16 md:py-20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-gold font-medium tracking-widest uppercase text-xs sm:text-sm mb-2 sm:mb-3 animate-fade-in">Worship With Us</p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 animate-fade-in">
              Mass Times & Confession
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground animate-fade-up">
              Join us in worship and prayer. All are welcome at St. Patrick in Armonk.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted-foreground animate-fade-up stagger-1">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                29 Cox Ave, Armonk NY 10504
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:9142739724" className="hover:text-primary">(914) 273-9724</a>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div ref={revealRef}>
        <section className="container py-6 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-8">
            {/* Weekend Masses */}
            <Card className="reveal border-t-4 border-t-primary shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-primary/10 p-2 sm:p-2.5 rounded-xl">
                    <Church className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <CardTitle className="font-serif text-xl sm:text-2xl">Weekend Masses</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-secondary/50">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg">Saturday Vigil</h3>
                    <p className="text-xl sm:text-2xl font-bold text-primary mt-0.5 sm:mt-1">5:30 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-secondary/50">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg">Sunday</h3>
                    <div className="flex flex-wrap gap-2 mt-1.5 sm:mt-2">
                      <span className="text-base sm:text-xl font-bold text-primary bg-primary/5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg">8:30 AM</span>
                      <span className="text-base sm:text-xl font-bold text-primary bg-primary/5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg">10:30 AM</span>
                      <span className="text-base sm:text-xl font-bold text-primary bg-primary/5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg">12:30 PM</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3">12:30 PM Mass: October – June</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekday Masses */}
            <Card className="reveal border-t-4 border-t-accent shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-accent/10 p-2 sm:p-2.5 rounded-xl">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </div>
                  <CardTitle className="font-serif text-xl sm:text-2xl">Weekday Masses</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                {["Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                  <div key={day} className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-secondary/50">
                    <span className="font-medium text-sm sm:text-base">{day}</span>
                    <span className="text-base sm:text-lg font-bold text-accent">8:30 AM</span>
                  </div>
                ))}
                <p className="text-xs sm:text-sm text-muted-foreground italic pt-1 sm:pt-2">
                  No scheduled weekday Mass on Mondays.
                </p>
              </CardContent>
            </Card>

            {/* Confession */}
            <Card className="reveal border-t-4 border-t-primary shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-primary/10 p-2 sm:p-2.5 rounded-xl">
                    <Cross className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <CardTitle className="font-serif text-xl sm:text-2xl">Confession</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-3 sm:p-4 rounded-xl bg-secondary/50">
                  <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Saturday</h3>
                  <p className="text-xl sm:text-2xl font-bold text-primary">4:30 PM – 5:15 PM</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3">
                    Also available by appointment. Contact the parish office to schedule.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Morning Prayer */}
            <Card className="reveal border-t-4 border-t-accent shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-accent/10 p-2 sm:p-2.5 rounded-xl">
                    <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </div>
                  <CardTitle className="font-serif text-xl sm:text-2xl">Morning Prayer (Lauds)</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-3 sm:p-4 rounded-xl bg-secondary/50">
                  <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Tuesday – Friday</h3>
                  <p className="text-xl sm:text-2xl font-bold text-accent">8:00 AM</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3">
                    Morning Prayer from the Liturgy of the Hours, prayed before weekday Mass.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Holy Days */}
            <Card className="reveal border-t-4 border-t-primary shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-primary/10 p-2 sm:p-2.5 rounded-xl">
                    <Church className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <CardTitle className="font-serif text-xl sm:text-2xl">Holy Days of Obligation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Mass times for Holy Days of Obligation are announced in the weekly bulletin and on the News page. 
                  Please check back for upcoming Holy Day schedules.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
