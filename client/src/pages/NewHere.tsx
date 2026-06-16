import PageLayout from "@/components/PageLayout";
import { Link } from "wouter";
import { MapPin, Clock, Heart, Users, ArrowRight, Church, BookOpen, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NewHere() {
  return (
    <PageLayout>
      {/* Page Header — refined */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-primary/[0.04] to-transparent">
        <div className="container max-w-3xl text-center">
          <p className="text-gold font-bold tracking-[0.2em] uppercase text-[11px] mb-2 animate-fade-in">Welcome</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2.5 animate-fade-in leading-tight">
            New Here?
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto animate-fade-up">
            Whether you're new to the area, returning to the faith, or just curious — you belong here.
          </p>
        </div>
      </section>

      {/* What to Expect */}
      <section className="container max-w-3xl py-6 sm:py-10">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-4 text-center">
          What to Expect at Mass
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <Card className="border border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-xl">
            <CardContent className="p-3.5">
              <div className="flex items-start gap-2.5">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-base mb-0.5">About an Hour</h3>
                  <p className="text-muted-foreground text-sm leading-snug">
                    Readings, homily, prayers, and the Eucharist.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-xl">
            <CardContent className="p-3.5">
              <div className="flex items-start gap-2.5">
                <Users className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-base mb-0.5">Come As You Are</h3>
                  <p className="text-muted-foreground text-sm leading-snug">
                    No dress code. Wear whatever you're comfortable in.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-xl">
            <CardContent className="p-3.5">
              <div className="flex items-start gap-2.5">
                <BookOpen className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-base mb-0.5">Follow Along</h3>
                  <p className="text-muted-foreground text-sm leading-snug">
                    Missalettes in each pew. Just follow along — no pressure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-xl">
            <CardContent className="p-3.5">
              <div className="flex items-start gap-2.5">
                <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-base mb-0.5">All Welcome</h3>
                  <p className="text-muted-foreground text-sm leading-snug">
                    Not Catholic? Come forward for a blessing. No judgment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mass Schedule */}
      <section className="bg-muted/30 py-6 sm:py-10">
        <div className="container max-w-3xl">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-4 text-center">
            Mass Schedule
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <div className="bg-background rounded-lg p-3 sm:p-4 shadow-sm">
              <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-1">Sat Vigil</p>
              <p className="font-serif text-base sm:text-xl font-bold text-primary">5:30 PM</p>
            </div>
            <div className="bg-background rounded-lg p-3 sm:p-4 shadow-sm">
              <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-1">Sunday</p>
              <p className="font-serif text-base sm:text-xl font-bold text-primary">8:30 & 10:30</p>
              <p className="text-xs text-muted-foreground">12:30 (Oct–Jun)</p>
            </div>
            <div className="bg-background rounded-lg p-3 sm:p-4 shadow-sm">
              <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-1">Tue–Fri</p>
              <p className="font-serif text-base sm:text-xl font-bold text-primary">8:30 AM</p>
            </div>
          </div>
          <div className="text-center mt-3">
            <Link href="/mass-times">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 press-scale text-sm">
                Full schedule & details <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Getting Here — compact */}
      <section className="container max-w-3xl py-6 sm:py-8">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-4 text-center">
          Getting Here
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">29 Cox Avenue</p>
                <p className="text-muted-foreground text-sm">Armonk, NY 10504</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Car className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Parking</p>
                <p className="text-muted-foreground text-sm">
                  Free parking in the church lot off Cox Avenue. Street parking also available.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Church className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Accessibility</p>
                <p className="text-muted-foreground text-sm">
                  Wheelchair accessible with ramp entry and accessible seating.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3004.5!2d-73.7143!3d41.1267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2a5c4e5f6a7b8%3A0x9c8d7e6f5a4b3c2d!2s29+Cox+Ave%2C+Armonk%2C+NY+10504!5e0!3m2!1sen!2sus!4v1700000000000"
              width="100%"
              height="200"
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
      <section className="bg-primary/[0.04] py-6 sm:py-10">
        <div className="container max-w-3xl text-center">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-2">
            Ready to Join Our Parish Family?
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
            Register to connect with ministries and stay informed about parish life.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/parish-registration">
              <Button size="default" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 press-scale">
                Register as a Parishioner
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="default" variant="outline" className="font-semibold px-6 press-scale">
                Contact the Office
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
