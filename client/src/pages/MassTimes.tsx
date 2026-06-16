import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Church, Cross, MapPin, Phone, Sun, Calendar } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

export default function MassTimes() {
  const revealRef = useReveal();

  return (
    <PageLayout>
      {/* Compact Page Header */}
      <section className="py-6 sm:py-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container">
          <p className="text-gold font-medium tracking-widest uppercase text-xs mb-1.5 animate-fade-in">Worship With Us</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2 animate-fade-in">
            Mass Times & Confession
          </h1>
          <p className="text-sm text-muted-foreground animate-fade-up">
            Join us in worship and prayer. All are welcome.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground animate-fade-up">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              29 Cox Ave, Armonk NY 10504
            </span>
            <span className="inline-flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-primary" />
              <a href="tel:9142739724" className="hover:text-primary transition-colors">(914) 273-9724</a>
            </span>
          </div>
        </div>
      </section>

      <div ref={revealRef} className="container py-4 sm:py-8">
        {/* Mass Schedule - Compact Table Style */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Church className="w-4 h-4 text-primary" />
            <h2 className="font-serif text-lg font-bold">Mass Schedule</h2>
          </div>
          <div className="space-y-1.5">
            {/* Saturday Vigil */}
            <Card className="reveal border-0 shadow-sm border-l-3 border-l-primary">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-medium text-muted-foreground uppercase w-16 shrink-0">SAT</span>
                  <span className="font-semibold text-sm">Saturday Vigil</span>
                </div>
                <span className="text-sm font-bold text-primary">5:30 PM</span>
              </CardContent>
            </Card>

            {/* Sunday */}
            <Card className="reveal border-0 shadow-sm border-l-3 border-l-primary">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-medium text-muted-foreground uppercase w-16 shrink-0">SUN</span>
                  <span className="font-semibold text-sm">Sunday Masses</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">8:30</span>
                  <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">10:30</span>
                  <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">12:30*</span>
                </div>
              </CardContent>
            </Card>

            {/* Weekday */}
            <Card className="reveal border-0 shadow-sm border-l-3 border-l-accent">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-medium text-muted-foreground uppercase w-16 shrink-0">TUE-FRI</span>
                  <span className="font-semibold text-sm">Weekday Mass</span>
                </div>
                <span className="text-sm font-bold text-accent">8:30 AM</span>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground pl-1 pt-1">*12:30 PM: October – June only. No Monday Mass.</p>
          </div>
        </div>

        {/* Confession & Prayer - Compact */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Cross className="w-4 h-4 text-primary" />
            <h2 className="font-serif text-lg font-bold">Confession & Prayer</h2>
          </div>
          <div className="space-y-1.5">
            <Card className="reveal border-0 shadow-sm border-l-3 border-l-primary">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Cross className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <span className="font-semibold text-sm">Confession</span>
                    <span className="text-xs text-muted-foreground ml-2">Saturday</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-primary">4:30–5:15 PM</span>
              </CardContent>
            </Card>

            <Card className="reveal border-0 shadow-sm border-l-3 border-l-accent">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sun className="w-4 h-4 text-accent shrink-0" />
                  <div>
                    <span className="font-semibold text-sm">Morning Prayer (Lauds)</span>
                    <span className="text-xs text-muted-foreground ml-2">Tue–Fri</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-accent">8:00 AM</span>
              </CardContent>
            </Card>

            <Card className="reveal border-0 shadow-sm border-l-3 border-l-muted">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <span className="font-semibold text-sm">Holy Days of Obligation</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">See bulletin</span>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground pl-1 pt-1">Confession also available by appointment — call the parish office.</p>
          </div>
        </div>

        {/* What to Expect - Compact inline items */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Church className="w-4 h-4 text-primary" />
            <h2 className="font-serif text-lg font-bold">What to Expect</h2>
          </div>
          <div className="space-y-1.5">
            {[
              { icon: Clock, title: "Mass Lasts About an Hour", desc: "Readings, homily, prayers, and the Eucharist" },
              { icon: Church, title: "Come As You Are", desc: "No dress code — business casual is common" },
              { icon: Calendar, title: "Follow Along Easily", desc: "Missalettes in each pew with all readings and responses" },
              { icon: Cross, title: "Everyone Is Welcome", desc: "Not Catholic? Come forward for a blessing" },
            ].map((item) => (
              <Card key={item.title} className="reveal border-0 shadow-sm">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
