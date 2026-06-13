import PageLayout from "@/components/PageLayout";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Clock, ArrowRight, Mail, Heart, GraduationCap, Users, Cross, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useReveal } from "@/hooks/useReveal";

// The 4 journey cards — the main paths a visitor might take
const journeyCards = [
  {
    icon: Users,
    title: "New Here?",
    description: "Plan your first visit and learn what to expect at St. Patrick's.",
    href: "/new-here",
    cta: "Plan Your Visit",
    accent: "from-primary/10 to-primary/5",
    iconColor: "text-primary",
    borderColor: "border-l-primary",
  },
  {
    icon: Cross,
    title: "Sacraments",
    description: "Baptism, First Communion, Confirmation, Marriage, and more.",
    href: "/sacraments",
    cta: "Learn More",
    accent: "from-gold/10 to-gold/5",
    iconColor: "text-gold",
    borderColor: "border-l-gold",
  },
  {
    icon: GraduationCap,
    title: "Faith Formation",
    description: "Religious education for children, teens, and adults at every stage.",
    href: "/faith-formation",
    cta: "Explore Programs",
    accent: "from-primary/10 to-primary/5",
    iconColor: "text-primary",
    borderColor: "border-l-primary",
  },
  {
    icon: Heart,
    title: "Get Involved",
    description: "Ministries, volunteering, and ways to serve our community.",
    href: "/ministries",
    cta: "Find Your Place",
    accent: "from-accent/10 to-accent/5",
    iconColor: "text-accent",
    borderColor: "border-l-accent",
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const { data: upcomingEvents, isLoading: eventsLoading } = trpc.events.listUpcoming.useQuery();
  const subscribeMutation = trpc.subscriptions.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Successfully subscribed to parish updates!");
      setEmail("");
    },
    onError: (err: any) => toast.error(err.message),
  });
  const revealRef = useReveal();

  // Get next upcoming event for "This Week" section
  const nextEvent = upcomingEvents?.[0];

  return (
    <PageLayout>
      {/* Hero Section — tighter, more focused */}
      <section className="relative h-[65vh] min-h-[480px] max-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/manus-storage/church-stained-glass_4e3f2e8c.jpg"
            alt="Church stained glass"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        </div>
        <div className="relative z-10 text-center text-white container px-6">
          <p className="text-gold font-medium tracking-[0.25em] uppercase text-xs sm:text-sm mb-4 animate-fade-in">
            Welcome to
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 animate-fade-in drop-shadow-2xl">
            St. Patrick Church
          </h1>
          <p className="text-lg sm:text-xl text-white/90 font-light animate-fade-up stagger-1">
            Armonk, New York
          </p>
          <p className="text-white/70 text-sm sm:text-base max-w-md mx-auto mt-3 mb-8 animate-fade-up stagger-2">
            A welcoming Catholic community rooted in faith, service, and love.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up stagger-3">
            <Link href="/mass-times">
              <Button size="lg" className="bg-gold text-black hover:bg-gold/90 font-semibold px-8 press-scale shadow-lg">
                View Mass Times
              </Button>
            </Link>
            <Link href="/giving">
              <Button size="lg" variant="outline" className="border-white/80 text-white hover:bg-white/10 font-semibold px-8 press-scale">
                Support Our Parish
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </section>

      <div ref={revealRef}>
        {/* This Week at St. Patrick's — compact, dynamic */}
        <section className="reveal container -mt-8 relative z-20 mb-10 sm:mb-14">
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
                {/* Next Mass */}
                <Link href="/mass-times" className="group">
                  <div className="p-4 sm:p-5 flex items-center gap-4 hover:bg-primary/[0.02] transition-colors">
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Mass Schedule</p>
                      <p className="font-semibold text-foreground text-sm sm:text-base">Weekend: Sat 5:30 PM · Sun 8:30, 10:30, 12:30</p>
                      <p className="text-xs text-muted-foreground">Weekdays: Tue–Fri 8:30 AM</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </Link>
                {/* Upcoming Event */}
                <Link href="/parish-calendar" className="group">
                  <div className="p-4 sm:p-5 flex items-center gap-4 hover:bg-primary/[0.02] transition-colors">
                    <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Coming Up</p>
                      {nextEvent ? (
                        <>
                          <p className="font-semibold text-foreground text-sm sm:text-base truncate">{nextEvent.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(nextEvent.startDate), "EEE, MMM d")} · {format(new Date(nextEvent.startDate), "h:mm a")}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-foreground text-sm sm:text-base">Parish Calendar</p>
                          <p className="text-xs text-muted-foreground">View all upcoming events and activities</p>
                        </>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Pastor's Welcome */}
        <section className="reveal container py-8 sm:py-12 mb-2 sm:mb-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-10 h-0.5 bg-gold mx-auto mb-5" />
            <blockquote className="font-serif text-lg sm:text-xl md:text-2xl text-foreground/90 italic leading-relaxed">
              "Whether you are a lifelong parishioner or visiting for the first time, you are welcome here. St. Patrick's is a place where faith grows, friendships form, and everyone belongs."
            </blockquote>
            <p className="mt-4 text-muted-foreground font-medium text-sm">— Fr. Thadeus Aravindathu, Pastor</p>
          </div>
        </section>

        {/* 4 Journey Cards */}
        <section className="reveal container pb-10 sm:pb-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {journeyCards.map((card) => (
              <Link key={card.href} href={card.href}>
                <Card className={`group cursor-pointer h-full border-0 shadow-sm border-l-4 ${card.borderColor} hover:shadow-md transition-all duration-200`}>
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${card.accent} flex items-center justify-center shrink-0`}>
                        <card.icon className={`w-4.5 h-4.5 ${card.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base mb-0.5">{card.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-2 group-hover:gap-1.5 transition-all">
                          {card.cta} <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="reveal container pb-10 sm:pb-16">
          <Card className="bg-gradient-to-br from-primary via-parish-green-dark to-primary overflow-hidden border-0 shadow-xl">
            <CardContent className="p-5 sm:p-8 md:p-10 flex flex-col md:flex-row items-center gap-5 sm:gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-gold" />
                  <span className="text-gold text-xs font-medium uppercase tracking-wider">Stay Connected</span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5">
                  Subscribe to Parish Updates
                </h2>
                <p className="text-white/80 text-sm sm:text-base">
                  Receive weekly bulletins and news directly in your inbox.
                </p>
              </div>
              <div className="w-full md:w-auto">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email) subscribeMutation.mutate({ email });
                  }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 min-w-[250px] focus:border-gold"
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-gold text-black hover:bg-gold/90 font-semibold whitespace-nowrap press-scale"
                    disabled={subscribeMutation.isPending}
                  >
                    {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
                <p className="text-white/60 text-xs sm:text-sm mt-3">
                  Or join us on{" "}
                  <a href="https://stpatarmonk.flocknote.com/home" target="_blank" rel="noopener noreferrer" className="text-gold underline hover:text-gold/80">
                    Flocknote
                  </a>{" "}
                  for text and email updates.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageLayout>
  );
}
