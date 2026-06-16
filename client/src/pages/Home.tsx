import PageLayout from "@/components/PageLayout";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Mail, Heart, GraduationCap, Users, Cross, Newspaper, MapPin, Clock, ExternalLink, Globe, Camera, ImageIcon, BookOpen, Download, RefreshCw, ChevronDown, Rss } from "lucide-react";
import BulletinBookReader from "@/components/BulletinBookReader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { useReveal } from "@/hooks/useReveal";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";

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

// ===== HERO SECTION — Cinematic with Ken Burns + Time Greeting + Next Mass Countdown =====
function HeroSection() {
  const [timeGreeting, setTimeGreeting] = useState("");
  const [nextMassText, setNextMassText] = useState("");

  useEffect(() => {
    function getGreeting() {
      const now = new Date();
      // Convert to Eastern time
      const eastern = new Date(now.toLocaleString("en-US", { timeZone: TIMEZONE }));
      const hour = eastern.getHours();
      if (hour < 12) return "Good Morning";
      if (hour < 17) return "Good Afternoon";
      return "Good Evening";
    }

    function getNextMass() {
      const now = new Date();
      const eastern = new Date(now.toLocaleString("en-US", { timeZone: TIMEZONE }));
      const day = eastern.getDay(); // 0=Sun, 1=Mon, 2=Tue...
      const hour = eastern.getHours();
      const min = eastern.getMinutes();
      const currentMinutes = hour * 60 + min;

      // Mass schedule: Sat 17:30, Sun 8:30 & 10:30, Tue-Fri 8:30
      type MassSlot = { day: number; hour: number; min: number; label: string };
      const schedule: MassSlot[] = [
        { day: 0, hour: 8, min: 30, label: "Sunday 8:30 AM" },
        { day: 0, hour: 10, min: 30, label: "Sunday 10:30 AM" },
        { day: 2, hour: 8, min: 30, label: "Tuesday 8:30 AM" },
        { day: 3, hour: 8, min: 30, label: "Wednesday 8:30 AM" },
        { day: 4, hour: 8, min: 30, label: "Thursday 8:30 AM" },
        { day: 5, hour: 8, min: 30, label: "Friday 8:30 AM" },
        { day: 6, hour: 17, min: 30, label: "Saturday 5:30 PM" },
      ];

      // Find next mass
      let minDiff = Infinity;
      let nextLabel = "";
      for (const mass of schedule) {
        let daysAhead = mass.day - day;
        if (daysAhead < 0) daysAhead += 7;
        const massMinutes = mass.hour * 60 + mass.min;
        let diffMinutes = daysAhead * 24 * 60 + (massMinutes - currentMinutes);
        if (diffMinutes <= 0) diffMinutes += 7 * 24 * 60;
        if (diffMinutes < minDiff) {
          minDiff = diffMinutes;
          nextLabel = mass.label;
        }
      }

      if (minDiff < 60) {
        return `Next Mass in ${minDiff}m — ${nextLabel}`;
      } else if (minDiff < 24 * 60) {
        const h = Math.floor(minDiff / 60);
        const m = minDiff % 60;
        return `Next Mass in ${h}h ${m}m — ${nextLabel}`;
      } else {
        return `Next Mass: ${nextLabel}`;
      }
    }

    setTimeGreeting(getGreeting());
    setNextMassText(getNextMass());

    const interval = setInterval(() => {
      setTimeGreeting(getGreeting());
      setNextMassText(getNextMass());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[65vh] min-h-[480px] max-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Ken Burns background */}
      <div className="absolute inset-0">
        <img
          src="/manus-storage/church-stained-glass_4e3f2e8c.jpg"
          alt="Church stained glass"
          className="w-full h-full object-cover hero-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white container px-6">
        {/* Time-of-day greeting */}
        <p className="text-gold font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-3 animate-fade-in">
          {timeGreeting || "Welcome"}
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 animate-fade-in drop-shadow-2xl">
          St. Patrick in Armonk
        </h1>
        <p className="text-lg sm:text-xl text-white/90 font-light animate-fade-up stagger-1">
          29 Cox Ave, Armonk NY 10504
        </p>
        <p className="text-white/90 text-sm sm:text-base italic mt-4 mb-1 animate-fade-up stagger-2 tracking-wide">
          &ldquo;God Bless the Whole World &mdash; No Exceptions&rdquo;
        </p>
        <p className="text-white/70 text-xs sm:text-sm mb-6 animate-fade-up stagger-3 tracking-wide">
          Pax Christi - St. Patricks Church, Armonk, New York
        </p>

        {/* Next Mass Countdown */}
        {nextMassText && (
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-up stagger-3">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/90 text-xs sm:text-sm font-medium">{nextMassText}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up stagger-4">
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

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

// === LIVE ACTIVITY BAR — Auto-rotating latest news + upcoming events ===
function LiveActivityBar({ latestNews, allImportantDates }: { latestNews: any; allImportantDates: any[] | undefined }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Build activity items from news + events
  const items = useMemo(() => {
    const result: { type: "news" | "event"; title: string; subtitle: string; href: string; icon: "news" | "calendar"; dot?: string }[] = [];
    
    if (latestNews) {
      result.push({
        type: "news",
        title: latestNews.title,
        subtitle: format(new Date(latestNews.publishedAt || latestNews.createdAt), "MMM d, yyyy"),
        href: "/news",
        icon: "news",
      });
    }

    const upcomingEvents = allImportantDates
      ?.filter((e) => new Date(e.eventDate as unknown as string) >= new Date())
      ?.slice(0, 3) || [];

    const catDots: Record<string, string> = {
      ccd: "bg-green-500", cyo: "bg-orange-500", sacrament: "bg-purple-500",
      parish: "bg-primary", teen_life: "bg-blue-500", social: "bg-amber-500",
    };

    upcomingEvents.forEach((evt) => {
      const eventDate = toEastern(evt.eventDate as unknown as string);
      result.push({
        type: "event",
        title: evt.title,
        subtitle: format(eventDate, "EEE, MMM d") + (evt.location ? ` · ${evt.location}` : ""),
        href: "/calendar?filter=key-dates",
        icon: "calendar",
        dot: catDots[evt.category] || catDots.parish,
      });
    });

    return result;
  }, [latestNews, allImportantDates]);

  // Auto-rotate every 5 seconds, paused on hover
  useEffect(() => {
    if (items.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length, isPaused]);

  if (items.length === 0) return null;

  const current = items[activeIndex];

  return (
    <section className="reveal container -mt-8 relative z-20 mb-10 sm:mb-14">
      <Card
        className="border-0 shadow-lg overflow-hidden hover-glow"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <CardContent className="p-0">
          {/* Activity content with crossfade */}
          <Link href={current.href} className="group block">
            <div className="p-4 sm:p-5 flex items-center gap-4 hover:bg-primary/[0.02] transition-colors">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                current.icon === "news" ? "bg-primary/10" : "bg-gold/10"
              }`}>
                {current.icon === "news" ? (
                  <Newspaper className="w-5 h-5 text-primary" />
                ) : (
                  <Clock className="w-5 h-5 text-gold" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                    {current.type === "news" ? "Latest News" : "Coming Up"}
                  </p>
                  {current.dot && <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />}
                </div>
                <p className="font-semibold text-foreground text-sm sm:text-base truncate">{current.title}</p>
                <p className="text-xs text-muted-foreground">{current.subtitle}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
          </Link>

          {/* Progress dots + quick links */}
          <div className="px-4 sm:px-5 py-2.5 border-t border-border/30 flex items-center justify-between">
            {/* Dots indicator */}
            <div className="flex items-center gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex ? "bg-primary w-4" : "bg-border hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`View item ${i + 1}`}
                />
              ))}
            </div>
            {/* Quick links */}
            <div className="flex items-center gap-3">
              <Link href="/news" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                All News
              </Link>
              <span className="text-border">|</span>
              <Link href="/calendar?filter=key-dates" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                All Events
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function ThisWeeksBulletin() {
  const { data: bulletins, isLoading } = trpc.bulletins.listPublished.useQuery();
  const [showReader, setShowReader] = useState(false);

  const latestBulletin = bulletins?.[0];

  if (isLoading) {
    return (
      <section className="reveal container mb-10 sm:mb-14">
        <div className="animate-pulse">
          <div className="h-6 w-48 bg-muted rounded mb-4" />
          <div className="h-32 bg-muted rounded-xl" />
        </div>
      </section>
    );
  }

  if (!latestBulletin) return null;

  const weekDate = new Date(latestBulletin.weekDate);

  return (
    <section className="reveal container mb-10 sm:mb-14">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground">This Week's Bulletin</h2>
        </div>
        <Link href="/bulletins" className="text-sm text-primary hover:underline font-medium flex items-center gap-1">
          All Bulletins <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {showReader ? (
        <BulletinBookReader
          pdfUrl={latestBulletin.pdfUrl}
          title={latestBulletin.title}
          onClose={() => setShowReader(false)}
        />
      ) : (
        <Card
          className="overflow-hidden border-0 shadow-lg cursor-pointer group card-interactive bg-gradient-to-r from-primary/[0.03] via-transparent to-gold/[0.03]"
          onClick={() => setShowReader(true)}
        >
          <CardContent className="p-0">
            <div className="flex items-stretch">
              {/* Left accent strip */}
              <div className="w-1.5 sm:w-2 bg-gradient-to-b from-primary via-primary to-gold shrink-0 rounded-l-xl" />
              
              {/* Content */}
              <div className="flex-1 p-4 sm:p-5 flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary to-parish-green-dark flex items-center justify-center shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                  <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Week of {format(weekDate, "MMMM d, yyyy")}
                    </span>
                  </div>
                  <h3 className="font-serif text-sm sm:text-base font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {latestBulletin.title}
                  </h3>
                  <p className="text-xs text-primary/80 font-medium mt-1 flex items-center gap-1 group-hover:text-primary transition-colors">
                    <BookOpen className="w-3 h-3" />
                    Tap to read bulletin
                  </p>
                </div>
                <a
                  href={latestBulletin.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0"
                >
                  <Button variant="outline" size="sm" className="gap-1.5 press-scale">
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

function PhotoGallerySection() {
  const { data: photos, isLoading } = trpc.gallery.listPublished.useQuery(undefined);

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground">Photo Gallery</h2>
          </div>
        </div>
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shrink-0 w-48 h-36 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground">Photo Gallery</h2>
          </div>
          <Link href="/gallery" className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <Card className="border-dashed">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <ImageIcon className="w-10 h-10 text-muted-foreground/40 mb-2" />
            <p className="text-muted-foreground text-sm">Photos coming soon!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Camera className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground">Photo Gallery</h2>
        </div>
        <Link href="/gallery" className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:underline">
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {photos.map((photo) => (
            <Link
              key={photo.id}
              href="/gallery"
              className="shrink-0 w-48 sm:w-56 h-36 sm:h-44 rounded-lg overflow-hidden relative group snap-start"
            >
              <img
                src={photo.imageUrl}
                alt={photo.caption || photo.title || "Parish photo"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {photo.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-white text-xs truncate">{photo.caption}</p>
                </div>
              )}
            </Link>
          ))}
          {/* "View All" card at end */}
          <Link
            href="/gallery"
            className="shrink-0 w-48 sm:w-56 h-36 sm:h-44 rounded-lg border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-2 hover:border-primary/40 transition-colors snap-start"
          >
            <Camera className="w-6 h-6 text-primary/60" />
            <span className="text-sm text-primary font-medium">View All Photos</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

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
          <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-5 w-36 bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-52 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {["First Reading", "Responsorial Psalm", "Gospel"].map((label) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2.5">
            <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-36 bg-white/10 rounded animate-pulse" />
            <div className="space-y-1.5 pt-1">
              <div className="h-3 w-full bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-full bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-4/5 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-white/10 rounded animate-pulse" />
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
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
        <p className="text-sm text-white/70">Daily readings are temporarily unavailable.</p>
        <a
          href="https://bible.usccb.org/daily-bible-reading"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gold hover:text-gold/80 hover:underline mt-2 inline-block"
        >
          View on USCCB.org
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-white">Today's Readings</h2>
            <p className="text-xs text-white/60">{readings.liturgicTitle}</p>
          </div>
        </div>
        <a
          href="https://bible.usccb.org/daily-bible-reading"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-gold hover:text-gold/80 flex items-center gap-1 transition-colors"
        >
          Full Readings <ArrowRight className="w-3 h-3" />
        </a>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* First Reading */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
          <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-1">First Reading</p>
          <p className="text-xs text-white/50 mb-2 line-clamp-1">{readings.firstReading.title}</p>
          <p className="text-sm text-white/90 leading-relaxed line-clamp-6 whitespace-pre-line">{readings.firstReading.text}</p>
        </div>
        {/* Psalm */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
          <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">Responsorial Psalm</p>
          <p className="text-xs text-white/50 mb-2 line-clamp-1">{readings.psalm.title}</p>
          <p className="text-sm text-white/90 leading-relaxed line-clamp-6 italic whitespace-pre-line">{readings.psalm.text}</p>
        </div>
        {/* Gospel */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold text-red-300 uppercase tracking-wider mb-1">Gospel</p>
          <p className="text-xs text-white/50 mb-2 line-clamp-1">{readings.gospel.title}</p>
          <p className="text-sm text-white/90 leading-relaxed line-clamp-6 whitespace-pre-line">{readings.gospel.text}</p>
        </div>
      </div>
    </div>
  );
}

// === JOURNEY CARDS with stagger animation ===
function JourneyCardsSection() {
  const { ref, getItemStyle } = useStaggerReveal(journeyCards.length);

  return (
    <section className="pb-10 sm:pb-14" ref={ref}>
      <div className="container">
        {/* Mobile: horizontal scroll snap */}
        <div className="sm:hidden flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
          {journeyCards.map((card, i) => (
            <Link key={card.href} href={card.href} className="shrink-0 w-[75vw] snap-start">
              <Card
                className={`group cursor-pointer h-full border-0 shadow-sm border-l-3 ${card.borderColor} card-interactive`}
                style={getItemStyle(i)}
              >
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center mb-2.5`}>
                    <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-0.5">{card.title}</h3>
                  <p className="text-xs text-muted-foreground leading-snug mb-2">{card.description}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-1.5 transition-all">
                    {card.cta} <ArrowRight className="w-3 h-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {/* Desktop: 4-col grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
          {journeyCards.map((card, i) => (
            <Link key={card.href} href={card.href}>
              <Card
                className={`group cursor-pointer h-full border-0 shadow-sm border-l-3 ${card.borderColor} hover-lift`}
                style={getItemStyle(i)}
              >
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
  );
}

// === CATHOLIC RESOURCES — Aster Sports-inspired per-source live feed ===

const SOURCES = [
  { key: "goodnewsroom" as const, label: "Archdiocese of NY", sublabel: "The Good Newsroom", color: "bg-emerald-500", borderColor: "border-l-emerald-500", url: "https://thegoodnewsroom.org/" },
  { key: "vatican" as const, label: "Vatican News", sublabel: "Holy See Press Office", color: "bg-red-600", borderColor: "border-l-red-600", url: "https://www.vaticannews.va/en.html" },
] as const;

const RESOURCE_LINKS = [
  { name: "Archdiocese of NY", url: "https://www.archny.org/", category: "Local Church" },
  { name: "USCCB", url: "https://www.usccb.org/", category: "National" },
  { name: "Vatican", url: "https://www.vatican.va/content/vatican/en.html", category: "Universal Church" },
  { name: "Good Newsroom", url: "https://thegoodnewsroom.org/", category: "Local News" },
];

function CatholicResourcesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-5 w-40 bg-muted rounded animate-pulse" />
        <div className="h-3 w-24 bg-muted rounded animate-pulse" />
      </div>
      {[0, 1].map((i) => (
        <div key={i} className="rounded-xl border border-border/50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          </div>
          {[0, 1, 2].map((j) => (
            <div key={j} className="flex items-center gap-3 py-2 border-t border-border/30">
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 bg-muted rounded animate-pulse" style={{ width: `${85 - j * 12}%` }} />
                <div className="h-2.5 bg-muted/60 rounded animate-pulse w-20" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function CatholicResources() {
  const { data: vaticanFeed, isLoading: vLoading } = trpc.catholicResources.vatican.useQuery({ limit: 3 });
  const { data: gnFeed, isLoading: gLoading } = trpc.catholicResources.goodNewsroom.useQuery({ limit: 3 });
  const [expandedSources, setExpandedSources] = useState<string[]>(["goodnewsroom", "vatican"]);

  const isLoading = vLoading || gLoading;
  if (isLoading) return <CatholicResourcesSkeleton />;

  const feedsBySource: Record<string, typeof vaticanFeed> = {
    vatican: vaticanFeed || [],
    goodnewsroom: gnFeed || [],
  };

  const totalArticles = (vaticanFeed?.length || 0) + (gnFeed?.length || 0);
  const lastUpdated = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const toggleSource = (key: string) => {
    setExpandedSources((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div>
      {/* Header with stats bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Rss className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground">Catholic Resources</h2>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>{SOURCES.length} Sources</span>
              <span className="text-border">·</span>
              <span>{totalArticles} Articles</span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                Updated {lastUpdated}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Per-source collapsible sections */}
      <div className="space-y-3">
        {SOURCES.map((source) => {
          const articles = feedsBySource[source.key] || [];
          const isExpanded = expandedSources.includes(source.key);
          const newCount = articles.filter(
            (a) => Date.now() - new Date(a.pubDate).getTime() < 24 * 60 * 60 * 1000
          ).length;

          return (
            <div
              key={source.key}
              className={`rounded-xl border border-border/50 overflow-hidden shadow-sm border-l-4 ${source.borderColor} transition-all`}
            >
              {/* Source Header — clickable to expand/collapse */}
              <button
                onClick={() => toggleSource(source.key)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${source.color}`} />
                  <div className="text-left">
                    <span className="text-sm font-semibold text-foreground">{source.label}</span>
                    <span className="text-[10px] text-muted-foreground ml-2 hidden sm:inline">{source.sublabel}</span>
                  </div>
                  {newCount > 0 && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-gold/15 text-gold px-1.5 py-0.5 rounded">
                      {newCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{articles.length} articles</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                </div>
              </button>

              {/* Articles list */}
              {isExpanded && articles.length > 0 && (
                <div className="border-t border-border/30">
                  {articles.map((article, idx) => (
                    <a
                      key={idx}
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors border-b border-border/20 last:border-b-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(article.pubDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <ExternalLink className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0 mt-1" />
                    </a>
                  ))}
                  {/* View source link */}
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-4 py-2 text-[11px] font-medium text-primary hover:bg-primary/5 transition-colors border-t border-border/30"
                  >
                    Visit {source.label} <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Links Row */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {RESOURCE_LINKS.map((resource, idx) => (
          <a
            key={idx}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-lg border border-border/40 px-3 py-2 hover:border-primary/30 hover:bg-primary/[0.02] transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-foreground group-hover:text-primary transition-colors truncate">
                {resource.name}
              </p>
              <p className="text-[9px] text-muted-foreground">{resource.category}</p>
            </div>
          </a>
        ))}
      </div>
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
      {/* Hero Section — Cinematic with Ken Burns + Time Greeting + Next Mass */}
      <HeroSection />

      <div ref={revealRef}>
        {/* Live Activity Bar — Auto-rotating news + events */}
        <LiveActivityBar latestNews={latestNews} allImportantDates={allImportantDates} />

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
        <JourneyCardsSection />

        {/* This Week's Bulletin */}
        <ThisWeeksBulletin />

        {/* Photo Gallery */}
        <section className="reveal container mb-10 sm:mb-14">
          <PhotoGallerySection />
        </section>

        {/* Catholic Resources — Live Feeds by Source */}
        <section className="reveal section-cream py-10 sm:py-14 -mx-4 px-4 sm:-mx-0 sm:px-0">
          <div className="container">
            <CatholicResources />
          </div>
        </section>

        {/* Daily Readings — Dark Premium Section */}
        <section className="reveal section-dark-green py-10 sm:py-14 -mx-4 px-4 sm:-mx-0 sm:px-0">
          <div className="container">
            <DailyReadings />
          </div>
        </section>

        {/* Saint of the Day */}
        <section className="reveal container py-10 sm:py-14">
          <SaintOfDayCard />
        </section>

        {/* Newsletter Subscription — Full-width dark CTA */}
        <section className="reveal section-dark py-12 sm:py-16 -mx-4 px-4 sm:-mx-0 sm:px-0">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10 max-w-4xl mx-auto">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                  <Mail className="w-4 h-4 text-gold" />
                  <span className="text-gold text-xs font-medium uppercase tracking-wider">Stay Connected</span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5">
                  Subscribe to Parish Updates
                </h2>
                <p className="text-white/70 text-sm sm:text-base">
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
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-w-[250px] focus:border-gold focus:ring-gold/30"
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
                <p className="text-white/50 text-xs sm:text-sm mt-3 text-center sm:text-left">
                  Or join us on{" "}
                  <a href="https://stpatarmonk.flocknote.com/home" target="_blank" rel="noopener noreferrer" className="text-gold underline hover:text-gold/80">
                    Flocknote
                  </a>{" "}
                  for text and email updates.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
