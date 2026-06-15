import PageLayout from "@/components/PageLayout";
import { Link } from "wouter";
import { MapPin, Clock, Heart, Users, ArrowRight, Church, BookOpen, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NewHere() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background py-16 sm:py-24">
        <div className="container max-w-4xl text-center">
          <p className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-3">Welcome</p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            New Here?
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're glad you found us. Whether you're new to the area, returning to the faith, or just curious — you belong here.
          </p>
        </div>
      </section>

      {/* What to Expect */}
      <section className="container max-w-4xl py-12 sm:py-16">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
          What to Expect at Mass
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-start gap-3 sm:block">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-primary shrink-0 sm:mb-3" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2">Mass Lasts About an Hour</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    A typical Sunday Mass is approximately 60 minutes. It includes readings from Scripture, a homily, prayers, and the Eucharist.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-start gap-3 sm:block">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary shrink-0 sm:mb-3" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2">Come As You Are</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    There's no dress code. Most parishioners wear business casual, but you're welcome in whatever you're comfortable in.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-start gap-3 sm:block">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary shrink-0 sm:mb-3" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2">Follow Along Easily</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    Missalettes are available in each pew with all readings and responses. Just follow along — no pressure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-start gap-3 sm:block">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary shrink-0 sm:mb-3" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2">Everyone Is Welcome</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    Not Catholic? Come forward with arms crossed for a blessing. No pressure, no judgment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mass Schedule Quick Reference */}
      <section className="bg-secondary/30 py-12 sm:py-16">
        <div className="container max-w-4xl">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
            Mass Schedule
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-background rounded-xl p-6 shadow-sm">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Saturday Vigil</p>
              <p className="font-serif text-2xl font-bold text-primary">5:30 PM</p>
            </div>
            <div className="bg-background rounded-xl p-6 shadow-sm">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Sunday</p>
              <p className="font-serif text-2xl font-bold text-primary">8:30 & 10:30 AM</p>
              <p className="text-xs text-muted-foreground mt-1">12:30 PM (Oct–June)</p>
            </div>
            <div className="bg-background rounded-xl p-6 shadow-sm">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Weekday (Tue–Fri)</p>
              <p className="font-serif text-2xl font-bold text-primary">8:30 AM</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <Link href="/mass-times">
              <Button variant="ghost" className="text-primary hover:text-primary/80 press-scale">
                Full schedule & details <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Getting Here */}
      <section className="container max-w-4xl py-12 sm:py-16">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
          Getting Here
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">29 Cox Avenue</p>
                <p className="text-muted-foreground text-sm">Armonk, NY 10504</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Car className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Parking</p>
                <p className="text-muted-foreground text-sm">
                  Free parking is available in the church lot off Cox Avenue. Additional street parking is available on surrounding roads.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Church className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Accessibility</p>
                <p className="text-muted-foreground text-sm">
                  Our church is wheelchair accessible with ramp entry and accessible seating available.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3004.5!2d-73.7143!3d41.1267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2a5c4e5f6a7b8%3A0x9c8d7e6f5a4b3c2d!2s29+Cox+Ave%2C+Armonk%2C+NY+10504!5e0!3m2!1sen!2sus!4v1700000000000"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="St. Patrick in Armonk - 29 Cox Ave, Armonk, NY 10504"
            />
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="bg-primary/5 py-12 sm:py-16">
        <div className="container max-w-4xl text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Ready to Join Our Parish Family?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Registering as a parishioner helps us welcome you personally, connect you with ministries, and keep you informed about parish life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/parish-registration">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 press-scale">
                Register as a Parishioner
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="font-semibold px-8 press-scale">
                Contact the Office
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
