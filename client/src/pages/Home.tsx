import PageLayout from "@/components/PageLayout";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Clock, BookOpen, Calendar, Heart, ArrowRight, Mail, Users, Church } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useReveal } from "@/hooks/useReveal";

const quickCards = [
  { icon: Clock, title: "Mass Times", subtitle: "Weekend & weekday schedules", href: "/mass-times", accent: "border-t-[oklch(0.42_0.12_150)]" },
  { icon: BookOpen, title: "Sacraments", subtitle: "Baptism, Marriage & more", href: "/sacraments", accent: "border-t-[oklch(0.75_0.15_85)]" },
  { icon: Heart, title: "Give Online", subtitle: "Support our parish mission", href: "/giving", accent: "border-t-[oklch(0.55_0.15_25)]" },
  { icon: Calendar, title: "Events", subtitle: "What's happening this week", href: "/news-events", accent: "border-t-[oklch(0.5_0.12_250)]" },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const { data: news } = trpc.news.listPublished.useQuery();
  const { data: upcomingEvents } = trpc.events.listUpcoming.useQuery();
  const subscribeMutation = trpc.subscriptions.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Successfully subscribed to parish updates!");
      setEmail("");
    },
    onError: (err: any) => toast.error(err.message),
  });
  const revealRef = useReveal();

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative h-[75vh] min-h-[540px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/manus-storage/church-stained-glass_4e3f2e8c.jpg"
            alt="Church stained glass"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />
        </div>
        <div className="relative z-10 text-center text-white container">
          <p className="text-gold font-medium tracking-[0.25em] uppercase text-sm mb-5 animate-fade-in">
            Welcome to
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 animate-fade-in drop-shadow-2xl">
            St. Patrick Church
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light mb-2 animate-fade-up stagger-1">
            Armonk, New York
          </p>
          <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto mt-4 mb-10 animate-fade-up stagger-2">
            A welcoming Catholic community rooted in faith, service, and love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up stagger-3">
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
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Quick Access Cards — colored top border style (Legacy Hoopers inspired) */}
      <section className="container -mt-14 relative z-20 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickCards.map((card, i) => (
            <Link key={card.href} href={card.href}>
              <Card className={`group cursor-pointer hover-lift border-0 shadow-md border-t-4 ${card.accent} animate-fade-up stagger-${i + 1}`}>
                <CardContent className="p-5 text-center">
                  <card.icon className="w-7 h-7 text-primary mx-auto mb-2 transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="font-semibold text-foreground text-sm">{card.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{card.subtitle}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div ref={revealRef}>
        {/* Parish Stats Strip */}
        <section className="reveal border-y border-border/50 bg-secondary/30 py-10 mb-16">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="font-serif text-3xl md:text-4xl font-bold text-primary">1924</p>
                <p className="text-sm text-muted-foreground mt-1">Year Founded</p>
              </div>
              <div>
                <p className="font-serif text-3xl md:text-4xl font-bold text-primary">1,500+</p>
                <p className="text-sm text-muted-foreground mt-1">Families</p>
              </div>
              <div>
                <p className="font-serif text-3xl md:text-4xl font-bold text-primary">4</p>
                <p className="text-sm text-muted-foreground mt-1">Weekend Masses</p>
              </div>
              <div>
                <p className="font-serif text-3xl md:text-4xl font-bold text-primary">100</p>
                <p className="text-sm text-muted-foreground mt-1">Years of Faith</p>
              </div>
            </div>
          </div>
        </section>

        {/* Latest News Section — with colored left-border accents and pill badges */}
        <section className="reveal container pb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground">Latest News</h2>
              <p className="text-muted-foreground mt-1">Stay connected with our parish community</p>
            </div>
            <Link href="/news-events">
              <Button variant="ghost" className="text-primary hover:text-primary/80 press-scale">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          {news && news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {news.slice(0, 3).map((post, idx) => (
                <Card key={post.id} className={`overflow-hidden hover-lift border-0 shadow-sm border-l-4 ${idx === 0 ? "border-l-[oklch(0.42_0.12_150)]" : idx === 1 ? "border-l-[oklch(0.75_0.15_85)]" : "border-l-[oklch(0.5_0.12_250)]"}`}>
                  {post.imageUrl && (
                    <div className="h-44 overflow-hidden">
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {idx === 0 && <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0">Latest</Badge>}
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        {post.publishedAt ? format(new Date(post.publishedAt), "MMM d, yyyy") : ""}
                      </p>
                    </div>
                    <h3 className="font-semibold text-base mb-1.5 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt || post.content.substring(0, 120)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-10 text-center border-dashed border-2 bg-secondary/20">
              <Church className="w-10 h-10 text-primary/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">Parish news and announcements will appear here.</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Check back soon or subscribe below for email updates.</p>
            </Card>
          )}
        </section>

        {/* Upcoming Events — with pill badges for timing */}
        <section className="reveal bg-gradient-to-b from-secondary/40 to-transparent py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground">Upcoming Events</h2>
                <p className="text-muted-foreground mt-1">Join us in faith and fellowship</p>
              </div>
              <Link href="/parish-calendar">
                <Button variant="ghost" className="text-primary hover:text-primary/80 press-scale">
                  View Calendar <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingEvents.slice(0, 4).map((event, idx) => {
                  const eventDate = new Date(event.startDate);
                  const now = new Date();
                  const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  const isThisWeek = daysUntil <= 7 && daysUntil >= 0;

                  return (
                    <Card key={event.id} className={`hover-glow transition-all border-l-4 ${idx % 2 === 0 ? "border-l-[oklch(0.42_0.12_150)]" : "border-l-[oklch(0.75_0.15_85)]"}`}>
                      <CardContent className="p-5 flex gap-4">
                        <div className="bg-primary/10 rounded-xl p-3 text-center min-w-[60px] h-fit">
                          <p className="text-[10px] text-primary font-medium uppercase">
                            {format(eventDate, "MMM")}
                          </p>
                          <p className="text-2xl font-bold text-primary">
                            {format(eventDate, "d")}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm truncate">{event.title}</h3>
                            {isThisWeek && (
                              <Badge className="bg-accent/15 text-accent-foreground border-0 text-[10px] px-1.5 py-0 shrink-0">This Week</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {event.location && `${event.location} · `}
                            {format(eventDate, "h:mm a")}
                          </p>
                          {event.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{event.description}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-10 text-center border-dashed border-2 bg-white/50">
                <Calendar className="w-10 h-10 text-primary/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">No upcoming events at this time.</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Visit our parish calendar for the full schedule.</p>
              </Card>
            )}
          </div>
        </section>

        {/* Get Involved */}
        <section className="reveal py-16">
          <div className="container">
            <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-3">Get Involved</h2>
            <p className="text-muted-foreground text-center mb-10 max-w-lg mx-auto">
              There are many ways to grow in faith and serve our community.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <Link href="/ccd-calendar">
                <Card className="p-6 hover-lift cursor-pointer h-full border-0 shadow-sm">
                  <Calendar className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">CCD Calendar</h3>
                  <p className="text-sm text-muted-foreground">Religious Education schedule and key dates.</p>
                </Card>
              </Link>
              <Link href="/cyo-basketball">
                <Card className="p-6 hover-lift cursor-pointer h-full border-0 shadow-sm">
                  <Users className="w-8 h-8 text-accent mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">CYO Basketball</h3>
                  <p className="text-sm text-muted-foreground">Schedules, teams, and game results.</p>
                </Card>
              </Link>
              <Link href="/faith-formation">
                <Card className="p-6 hover-lift cursor-pointer h-full border-0 shadow-sm">
                  <BookOpen className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Faith Formation</h3>
                  <p className="text-sm text-muted-foreground">Programs for all ages — CCD, RCIA, Bible study.</p>
                </Card>
              </Link>
              <Link href="/volunteer">
                <Card className="p-6 hover-lift cursor-pointer h-full border-0 shadow-sm">
                  <Heart className="w-8 h-8 text-accent mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Volunteer</h3>
                  <p className="text-sm text-muted-foreground">Sign up to serve our parish community.</p>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="reveal container pb-16">
          <Card className="bg-gradient-to-br from-primary via-parish-green-dark to-primary overflow-hidden border-0 shadow-xl">
            <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-5 h-5 text-gold" />
                  <span className="text-gold text-sm font-medium uppercase tracking-wider">Stay Connected</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
                  Subscribe to Parish Updates
                </h2>
                <p className="text-white/80">
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
                <p className="text-white/60 text-sm mt-3">
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
