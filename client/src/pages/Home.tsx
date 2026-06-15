import PageLayout from "@/components/PageLayout";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Mail, Heart, GraduationCap, Users, Cross, Newspaper, MapPin, Clock, ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { useReveal } from "@/hooks/useReveal";

const TIMEZONE = "America/New_York";
function toEastern(isoString: string): Date {
  return new TZDate(isoString, TIMEZONE);
}

// The 4 journey cards — the main paths a visitor might take
const journeyCards = [
  {
    icon: Users,
    title: "New Here?",
    description: "Plan your first visit and learn what to expect.",
    href: "/new-here",
    cta: "Plan Your Visit",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    borderColor: "border-l-primary",
  },
  {
    icon: Cross,
    title: "Sacraments",
    description: "Baptism, Communion, Confirmation, Marriage.",
    href: "/sacraments",
    cta: "Learn More",
    iconBg: "bg-gold/10",
    iconColor: "text-gold",
    borderColor: "border-l-gold",
  },
  {
    icon: GraduationCap,
    title: "Faith Formation",
    description: "Religious education for all ages.",
    href: "/faith-formation",
    cta: "Explore Programs",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    borderColor: "border-l-primary",
  },
  {
    icon: Heart,
    title: "Get Involved",
    description: "Ministries, volunteering, and community.",
    href: "/ministries",
    cta: "Find Your Place",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    borderColor: "border-l-accent",
  },
];

function SaintOfDaySkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          <div className="h-5 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-3 w-20 bg-muted rounded animate-pulse" />
      </div>
      <div className="rounded-xl border border-border/50 shadow-sm p-5 sm:p-6">
        <div className="flex gap-4 sm:gap-6">
          <div className="hidden sm:block w-24 h-32 rounded-lg bg-muted animate-pulse shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
            <div className="space-y-2 pt-1">
              <div className="h-3 w-full bg-muted rounded animate-pulse" />
              <div className="h-3 w-full bg-muted rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-muted rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
            </div>
            <div className="pt-2 pl-3 border-l-2 border-muted space-y-1.5">
              <div className="h-3 w-full bg-muted rounded animate-pulse" />
              <div className="h-3 w-4/5 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SaintOfDayCard() {
  const { data: saint, isLoading } = trpc.saintOfDay.today.useQuery();

  if (isLoading) {
    return <SaintOfDaySkeleton />;
  }

  if (!saint || !saint.featuredSaint) {
    return null;
  }

  const { featuredSaint, saints } = saint;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="5" />
              <path d="M12 13v8" />
              <path d="M9 18h6" />
            </svg>
          </div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground">Saint of the Day</h2>
        </div>
        <a
          href="https://www.evangelizo.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
        >
          Evangelizo.org <ArrowRight className="w-3 h-3" />
        </a>
      </div>
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <div className="flex gap-4 sm:gap-6">
            {featuredSaint.imageUrl && (
              <div className="hidden sm:block flex-shrink-0">
                <img
                  src={featuredSaint.imageUrl}
                  alt={featuredSaint.name}
                  className="w-24 h-32 object-cover rounded-lg shadow-sm"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-base sm:text-lg font-bold text-foreground mb-1">
                {featuredSaint.name}
              </h3>
              {saints.length > 1 && (
                <p className="text-xs text-muted-foreground mb-2">
                  Also commemorated: {saints.filter(s => s !== featuredSaint.name && !featuredSaint.name.includes(s)).slice(0, 3).join(", ")}
                </p>
              )}
              {featuredSaint.biography && (
                <p className="text-sm text-foreground/85 leading-relaxed line-clamp-4">
                  {featuredSaint.biography}
                </p>
              )}
              {featuredSaint.prayer && (
                <blockquote className="mt-3 pl-3 border-l-2 border-gold/40 italic text-sm text-muted-foreground line-clamp-3">
                  {featuredSaint.prayer}
                </blockquote>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DailyReadingsSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-5 w-36 bg-muted rounded animate-pulse" />
            <div className="h-3 w-52 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="h-3 w-20 bg-muted rounded animate-pulse" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {["First Reading", "Responsorial Psalm", "Gospel"].map((label) => (
          <div key={label} className="rounded-xl border border-border/50 shadow-sm p-4 space-y-2.5">
            <div className="h-3 w-24 bg-muted rounded animate-pulse" />
            <div className="h-3 w-36 bg-muted/70 rounded animate-pulse" />
            <div className="space-y-1.5 pt-1">
              <div className="h-3 w-full bg-muted rounded animate-pulse" />
              <div className="h-3 w-full bg-muted rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-muted rounded animate-pulse" />
              <div className="h-3 w-4/5 bg-muted rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DailyReadings() {
  const { data: readings, isLoading } = trpc.dailyReadings.today.useQuery();

  if (isLoading) {
    return <DailyReadingsSkeleton />;
  }

  if (!readings) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-5 text-center">
          <p className="text-sm text-muted-foreground">Daily readings are temporarily unavailable.</p>
          <a
            href="https://bible.usccb.org/daily-bible-reading"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline mt-2 inline-block"
          >
            View on USCCB.org
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground">Today's Readings</h2>
            <p className="text-xs text-muted-foreground">{readings.liturgicTitle}</p>
          </div>
        </div>
        <a
          href="https://bible.usccb.org/daily-bible-reading"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
        >
          Full Readings <ArrowRight className="w-3 h-3" />
        </a>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* First Reading */}
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">First Reading</p>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{readings.firstReading.title}</p>
            <p className="text-sm text-foreground/90 leading-relaxed line-clamp-6 whitespace-pre-line">{readings.firstReading.text}</p>
          </CardContent>
        </Card>
        {/* Psalm */}
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-1">Responsorial Psalm</p>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{readings.psalm.title}</p>
            <p className="text-sm text-foreground/90 leading-relaxed line-clamp-6 italic whitespace-pre-line">{readings.psalm.text}</p>
          </CardContent>
        </Card>
        {/* Gospel */}
        <Card className="border-border/50 shadow-sm sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">Gospel</p>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{readings.gospel.title}</p>
            <p className="text-sm text-foreground/90 leading-relaxed line-clamp-6 whitespace-pre-line">{readings.gospel.text}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CatholicResourcesSkeleton() {
  return (
    <div className="space-y-4">
      {/* Feed skeleton */}
      <div className="grid gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-3 p-3 rounded-lg">
            <div className="w-14 h-14 rounded bg-muted animate-pulse shrink-0" />
            <div className="flex-1 space-y-2 py-0.5">
              <div className="h-3.5 bg-muted rounded animate-pulse" style={{ width: `${80 - i * 10}%` }} />
              <div className="h-3 bg-muted/70 rounded animate-pulse" style={{ width: `${55 - i * 5}%` }} />
            </div>
          </div>
        ))}
      </div>
      {/* Resource cards skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border border-border/50 p-4 space-y-2">
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            <div className="h-3.5 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-2.5 bg-muted/60 rounded animate-pulse w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
  vatican: { label: "Vatican News", color: "bg-red-600" },
  goodnewsroom: { label: "Good Newsroom", color: "bg-primary" },
};

function CatholicResources() {
  const { data: feed, isLoading: feedLoading } = trpc.catholicResources.feed.useQuery({ limit: 4 });
  const { data: links } = trpc.catholicResources.links.useQuery();

  if (feedLoading) {
    return <CatholicResourcesSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Live Feed */}
      {feed && feed.length > 0 && (
        <div className="grid gap-1.5">
          {feed.map((article, idx) => {
            const sourceInfo = SOURCE_LABELS[article.source] || { label: article.source, color: "bg-muted" };
            return (
              <a
                key={idx}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
              >
                {article.imageUrl ? (
                  <img
                    src={article.imageUrl}
                    alt=""
                    className="w-14 h-14 rounded object-cover shrink-0 bg-muted"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-14 h-14 rounded bg-muted/50 shrink-0 flex items-center justify-center">
                    <Newspaper className="w-5 h-5 text-muted-foreground/50" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${sourceInfo.color}`} />
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      {sourceInfo.label}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                    {new Date(article.pubDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0 mt-2" />
              </a>
            );
          })}
        </div>
      )}

      {/* Resource Cards */}
      {links && links.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {links.map((resource, idx) => (
            <a
              key={idx}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-border/50 p-4 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                <Globe className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                {resource.name}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {resource.category}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [email, setEmail] = useState("");
  const { data: newsItems } = trpc.news.listPublished.useQuery();
  const { data: allImportantDates } = trpc.importantDates.allPublished.useQuery();
  const subscribeMutation = trpc.subscriptions.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Successfully subscribed to parish updates!");
      setEmail("");
    },
    onError: (err: any) => toast.error(err.message),
  });
  const revealRef = useReveal();

  // Get latest news item
  const latestNews = newsItems?.[0];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[440px] max-h-[560px] flex items-center justify-center overflow-hidden">
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
            St. Patrick in Armonk
          </h1>
          <p className="text-lg sm:text-xl text-white/90 font-light animate-fade-up stagger-1">
            29 Cox Ave, Armonk NY 10504
          </p>
          <p className="text-white/90 text-sm sm:text-base italic mt-4 mb-1 animate-fade-up stagger-2 tracking-wide">
            "God Bless the Whole World — No Exceptions"
          </p>
          <p className="text-white/70 text-xs sm:text-sm mb-8 animate-fade-up stagger-3 tracking-wide">
            Pax Christi - St. Patricks Church, Armonk, New York
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
        {/* What's Happening — Latest News + Next Event */}
        <section className="reveal container -mt-8 relative z-20 mb-10 sm:mb-14">
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              {/* Latest News */}
              <div className="border-b border-border/50">
                <Link href="/news" className="group">
                  <div className="p-4 sm:p-5 flex items-center gap-4 hover:bg-primary/[0.02] transition-colors">
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Newspaper className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Latest News</p>
                      {latestNews ? (
                        <>
                          <p className="font-semibold text-foreground text-sm sm:text-base truncate">{latestNews.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(latestNews.publishedAt || latestNews.createdAt), "MMM d, yyyy")}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-foreground text-sm sm:text-base">News & Announcements</p>
                          <p className="text-xs text-muted-foreground">Parish updates and community news</p>
                        </>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </Link>
                <Link href="/news" className="group">
                  <div className="px-4 sm:px-5 py-2 flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:bg-primary/[0.03] transition-colors border-t border-border/30">
                    View all news <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </div>

              {/* Next Event */}
              <div className="border-b border-border/50">
                {(() => {
                  const nextEvent = allImportantDates
                    ?.filter((e) => new Date(e.eventDate as unknown as string) >= new Date())
                    ?.[0];
                  if (!nextEvent) return (
                    <div className="p-4 sm:p-5 text-center text-sm text-muted-foreground">No upcoming events</div>
                  );
                  const catColors: Record<string, { dot: string }> = {
                    ccd: { dot: "bg-green-500" },
                    cyo: { dot: "bg-orange-500" },
                    sacrament: { dot: "bg-purple-500" },
                    parish: { dot: "bg-primary" },
                    teen_life: { dot: "bg-blue-500" },
                    social: { dot: "bg-amber-500" },
                  };
                  const cat = catColors[nextEvent.category] || catColors.parish;
                  const eventDate = toEastern(nextEvent.eventDate as unknown as string);
                  return (
                    <div className="p-4 sm:p-5 flex items-center gap-4">
                      <div className="w-11 h-11 rounded-lg bg-gold/10 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-medium text-gold uppercase leading-none">
                          {format(eventDate, "MMM")}
                        </span>
                        <span className="text-base font-bold text-gold leading-tight">
                          {format(eventDate, "d")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Next Event</p>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${cat.dot} shrink-0`} />
                          <p className="font-semibold text-foreground text-sm sm:text-base truncate">{nextEvent.title}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {nextEvent.location && <span>{nextEvent.location}</span>}
                          {nextEvent.location && nextEvent.note && <span> · </span>}
                          {nextEvent.note && <span>{nextEvent.note}</span>}
                        </p>
                      </div>
                    </div>
                  );
                })()}
                <Link href="/calendar?filter=key-dates" className="group">
                  <div className="px-4 sm:px-5 py-2 flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:bg-primary/[0.03] transition-colors border-t border-border/30">
                    View all events <ArrowRight className="w-3 h-3" />
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
              "Whether you are a lifelong parishioner or visiting for the first time, you are welcome here. St. Patrick in Armonk is a place where faith grows, friendships form, and everyone belongs."
            </blockquote>
            <p className="mt-4 text-muted-foreground font-medium text-sm">— Fr. Thadeus Aravindathu, Pastor</p>
          </div>
        </section>

        {/* 4 Journey Cards — stacked vertically on mobile, 4-col grid on desktop */}
        <section className="reveal pb-10 sm:pb-14">
          <div className="container">
            {/* Mobile: vertical stack (full-width cards) */}
            <div className="sm:hidden flex flex-col gap-3">
              {journeyCards.map((card) => (
                <Link key={card.href} href={card.href}>
                  <Card className={`group cursor-pointer border-0 shadow-sm border-l-3 ${card.borderColor} hover:shadow-md transition-all duration-200`}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center shrink-0`}>
                        <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm">{card.title}</h3>
                        <p className="text-xs text-muted-foreground leading-snug">{card.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            {/* Desktop: 4-col grid */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
              {journeyCards.map((card) => (
                <Link key={card.href} href={card.href}>
                  <Card className={`group cursor-pointer h-full border-0 shadow-sm border-l-3 ${card.borderColor} hover:shadow-md transition-all duration-200`}>
                    <CardContent className="p-5">
                      <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center mb-3`}>
                        <card.icon className={`w-4.5 h-4.5 ${card.iconColor}`} />
                      </div>
                      <h3 className="font-semibold text-foreground text-base mb-1">{card.title}</h3>
                      <p className="text-sm text-muted-foreground leading-snug line-clamp-2">{card.description}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-2 group-hover:gap-1.5 transition-all">
                        {card.cta} <ArrowRight className="w-3 h-3" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Catholic Resources — Live Feeds + Quick Links */}
        <section className="reveal container mb-10 sm:mb-14">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground">Catholic Resources</h2>
            </div>
          </div>
          <CatholicResources />
        </section>

        {/* Daily Readings */}
        <section className="reveal container mb-10 sm:mb-14">
          <DailyReadings />
        </section>

        {/* Saint of the Day */}
        <section className="reveal container mb-10 sm:mb-14">
          <SaintOfDayCard />
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
