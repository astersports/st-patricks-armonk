import PageLayout from "@/components/PageLayout";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Mail, Heart, GraduationCap, Users, Cross, Newspaper, MapPin, Clock, ExternalLink, Globe, Camera, ImageIcon, BookOpen, Download, RefreshCw, ChevronDown, ChevronLeft, ChevronRight, Rss } from "lucide-react";
import BulletinBookReader from "@/components/BulletinBookReader";
import { PrayerWall } from "@/components/PrayerWall";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { format, differenceInDays, differenceInHours } from "date-fns";
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

// === NOW AT ST. PATRICK — Unified live status + news + events ===
function NowAtStPatrick({ latestNews, allImportantDates }: { latestNews: any; allImportantDates: any[] | undefined }) {
  const upcomingEvents = useMemo(() => {
    return allImportantDates
      ?.filter((e) => new Date(e.eventDate as unknown as string) >= new Date())
      ?.slice(0, 3) || [];
  }, [allImportantDates]);

  const catColors: Record<string, { dot: string; bg: string }> = {
    ccd: { dot: "bg-green-500", bg: "bg-green-500/10" },
    cyo: { dot: "bg-orange-500", bg: "bg-orange-500/10" },
    sacrament: { dot: "bg-purple-500", bg: "bg-purple-500/10" },
    parish: { dot: "bg-primary", bg: "bg-primary/10" },
    teen_life: { dot: "bg-blue-500", bg: "bg-blue-500/10" },
    social: { dot: "bg-amber-500", bg: "bg-amber-500/10" },
  };

  return (
    <section className="reveal container -mt-8 relative z-20 mb-4 sm:mb-6">
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          {/* Latest News — top strip */}
          <Link href="/news" className="group block border-b border-border/30">
            <div className="px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3 hover:bg-primary/[0.02] transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Newspaper className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Latest News</p>
                {latestNews ? (
                  <p className="font-semibold text-foreground text-sm truncate">{latestNews.title}</p>
                ) : (
                  <p className="font-semibold text-foreground text-sm">News & Announcements</p>
                )}
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
          </Link>

          {/* Coming Up Events */}
          {upcomingEvents.length > 0 && (
            <div className="px-3 py-2.5 sm:px-4 sm:py-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  <span className="text-xs font-bold text-foreground">Coming Up</span>
                </div>
                <Link href="/calendar?filter=key-dates" className="text-[10px] font-medium text-primary hover:text-primary/80 flex items-center gap-0.5">
                  All Events <ArrowRight className="w-2.5 h-2.5" />
                </Link>
              </div>
              <div className="space-y-1.5">
                {upcomingEvents.map((evt, i) => {
                  const eventDate = toEastern(evt.eventDate as unknown as string);
                  const colors = catColors[evt.category] || catColors.parish;
                  const countdown = getCountdown(eventDate);
                  return (
                    <Link key={evt.id || i} href="/calendar?filter=key-dates" className="group flex items-center gap-2.5 py-1.5 px-2 -mx-1 rounded-lg hover:bg-muted/40 transition-colors">
                      {/* Date badge */}
                      <div className={`w-9 h-9 rounded-lg ${colors.bg} flex flex-col items-center justify-center shrink-0`}>
                        <span className="text-[8px] font-bold uppercase leading-none text-muted-foreground">
                          {format(eventDate, "MMM")}
                        </span>
                        <span className="text-sm font-bold leading-tight text-foreground">
                          {format(eventDate, "d")}
                        </span>
                      </div>
                      {/* Event info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-xs sm:text-sm truncate group-hover:text-primary transition-colors">
                          {evt.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {evt.location || format(eventDate, "EEEE · h:mm a")}
                        </p>
                      </div>
                      {/* Countdown */}
                      <span className="text-[9px] font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                        {countdown}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

// === LATEST NEWS CARD (kept for backward compat but no longer rendered) ===
function LatestNewsCard({ latestNews }: { latestNews: any }) {
  return (
    <section className="reveal container -mt-8 relative z-20 mb-3 sm:mb-4">
      <Card className="border-0 shadow-lg overflow-hidden hover-glow">
        <CardContent className="p-0">
          <Link href="/news" className="group block">
            <div className="p-3 sm:p-4 flex items-center gap-3 hover:bg-primary/[0.02] transition-colors">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Newspaper className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Latest News</p>
                {latestNews ? (
                  <p className="font-semibold text-foreground text-sm truncate">{latestNews.title}</p>
                ) : (
                  <p className="font-semibold text-foreground text-sm">News & Announcements</p>
                )}
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}

// === COMING UP EVENTS — Compact timeline with countdown ===
function getCountdown(eventDate: Date): string {
  const now = new Date();
  const days = differenceInDays(eventDate, now);
  if (days === 0) {
    const hours = differenceInHours(eventDate, now);
    if (hours <= 0) return "Now";
    return `in ${hours}h`;
  }
  if (days === 1) return "Tomorrow";
  if (days < 7) return `in ${days} days`;
  if (days < 14) return "Next week";
  return `in ${Math.ceil(days / 7)} weeks`;
}

function ComingUpEvents({ allImportantDates }: { allImportantDates: any[] | undefined }) {
  const upcomingEvents = useMemo(() => {
    return allImportantDates
      ?.filter((e) => new Date(e.eventDate as unknown as string) >= new Date())
      ?.slice(0, 3) || [];
  }, [allImportantDates]);

  const catDots: Record<string, string> = {
    ccd: "bg-green-500", cyo: "bg-orange-500", sacrament: "bg-purple-500",
    parish: "bg-primary", teen_life: "bg-blue-500", social: "bg-amber-500",
  };

  if (upcomingEvents.length === 0) return null;

  return (
    <section className="reveal container mb-6 sm:mb-8">
      <Card className="border-0 shadow-md overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="px-4 pt-3 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-gold" />
              </div>
              <h2 className="font-serif text-sm sm:text-base font-bold text-foreground">Coming Up</h2>
            </div>
            <Link href="/calendar?filter=key-dates" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              View Calendar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Event rows — compact */}
          <div className="px-4 pb-3">
            {upcomingEvents.map((evt, i) => {
              const eventDate = toEastern(evt.eventDate as unknown as string);
              const dot = catDots[evt.category] || catDots.parish;
              const countdown = getCountdown(eventDate);
              return (
                <div key={evt.id || i}>
                  {i > 0 && <div className="border-t border-dashed border-border/40 my-2" />}
                  <Link href="/calendar?filter=key-dates" className="group flex items-center gap-3 py-1 hover:bg-primary/[0.02] -mx-2 px-2 rounded-lg transition-colors">
                    {/* Date badge — compact */}
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[9px] font-semibold text-gold uppercase leading-none">
                        {format(eventDate, "MMM")}
                      </span>
                      <span className="text-base font-bold text-gold leading-tight">
                        {format(eventDate, "d")}
                      </span>
                    </div>
                    {/* Event details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
                        <p className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
                          {evt.title}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {evt.location || format(eventDate, "EEEE")}
                      </p>
                    </div>
                    {/* Countdown pill */}
                    <span className="text-[10px] font-medium text-gold bg-gold/10 px-2 py-0.5 rounded-full shrink-0">
                      {countdown}
                    </span>
                  </Link>
                </div>
              );
            })}
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
      <section className="reveal container mb-6 sm:mb-8">
        <div className="animate-pulse">
          <div className="h-5 w-40 bg-muted rounded mb-3" />
          <div className="h-16 bg-muted rounded-xl" />
        </div>
      </section>
    );
  }

  if (!latestBulletin) return null;

  const weekDate = new Date(latestBulletin.weekDate);

  return (
    <section className="reveal container mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
          </div>
          <h2 className="font-serif text-sm sm:text-base font-bold text-foreground">This Week's Bulletin</h2>
        </div>
        <Link href="/bulletins" className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
          All Bulletins <ArrowRight className="w-3 h-3" />
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
              <div className="w-1 bg-gradient-to-b from-primary to-gold shrink-0 rounded-l-xl" />
              
              {/* Content */}
              <div className="flex-1 p-3 sm:p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-parish-green-dark flex items-center justify-center shrink-0 shadow-sm">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Week of {format(weekDate, "MMM d, yyyy")}
                  </span>
                  <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                    {latestBulletin.title}
                  </h3>
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
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 text-primary" />
            </div>
            <h2 className="font-serif text-sm sm:text-base font-bold text-foreground">Photo Gallery</h2>
          </div>
        </div>
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shrink-0 w-40 h-28 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 text-primary" />
            </div>
            <h2 className="font-serif text-sm sm:text-base font-bold text-foreground">Photo Gallery</h2>
          </div>
          <Link href="/gallery" className="text-xs text-primary font-medium inline-flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <Card className="border-dashed">
          <CardContent className="p-5 flex flex-col items-center text-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground/40 mb-1.5" />
            <p className="text-muted-foreground text-xs">Photos coming soon!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <Camera className="w-3.5 h-3.5 text-primary" />
          </div>
          <h2 className="font-serif text-sm sm:text-base font-bold text-foreground">Photo Gallery</h2>
        </div>
        <Link href="/gallery" className="text-xs text-primary font-medium inline-flex items-center gap-1 hover:underline">
          View All <ArrowRight className="w-3 h-3" />
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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="5" />
              <path d="M12 13v8" />
              <path d="M9 18h6" />
            </svg>
          </div>
          <h2 className="font-serif text-base sm:text-lg font-bold text-foreground">Saint of the Day</h2>
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
        <CardContent className="p-3 sm:p-4">
          <div className="flex gap-3">
            {featuredSaint.imageUrl && (
              <div className="hidden sm:block flex-shrink-0">
                <img
                  src={featuredSaint.imageUrl}
                  alt={featuredSaint.name}
                  className="w-16 h-20 object-cover rounded-lg shadow-sm"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-sm sm:text-base font-bold text-foreground">
                {featuredSaint.name}
              </h3>
              {saints.length > 1 && (
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Also: {saints.filter(s => s !== featuredSaint.name && !featuredSaint.name.includes(s)).slice(0, 2).join(", ")}
                </p>
              )}
              {featuredSaint.biography && (
                <p className="text-xs text-foreground/80 leading-relaxed line-clamp-3 mt-1">
                  {featuredSaint.biography}
                </p>
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
  const [expandedReading, setExpandedReading] = useState<string | null>(null);

  if (isLoading) {
    return <DailyReadingsSkeleton />;
  }

  if (!readings) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
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

  const readingItems = [
    { key: "first", label: "First Reading", title: readings.firstReading.title, text: readings.firstReading.text, color: "text-gold" },
    { key: "psalm", label: "Responsorial Psalm", title: readings.psalm.title, text: readings.psalm.text, color: "text-amber-300" },
    { key: "gospel", label: "Gospel", title: readings.gospel.title, text: readings.gospel.text, color: "text-red-300" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          </div>
          <div>
            <h2 className="font-serif text-base sm:text-lg font-bold text-white">Today's Readings</h2>
            <p className="text-[10px] text-white/60">{readings.liturgicTitle}</p>
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
      {/* Compact reading rows — tap to expand */}
      <div className="space-y-1.5">
        {readingItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setExpandedReading(expandedReading === item.key ? null : item.key)}
            className="w-full text-left rounded-lg border border-white/10 bg-white/5 hover:bg-white/8 transition-colors overflow-hidden"
          >
            <div className="flex items-center gap-3 px-3 py-2.5">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${item.color} w-20 shrink-0`}>{item.label}</span>
              <span className="text-sm text-white/80 truncate flex-1">{item.title}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 shrink-0 ${expandedReading === item.key ? "rotate-180" : ""}`} />
            </div>
            {expandedReading === item.key && (
              <div className="px-3 pb-3 pt-1 border-t border-white/10">
                <p className="text-sm text-white/85 leading-relaxed whitespace-pre-line">{item.text}</p>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// === JOURNEY CARDS with stagger animation ===
function JourneyCardsSection() {
  const { ref, getItemStyle } = useStaggerReveal(journeyCards.length);

  return (
    <section className="pb-6 sm:pb-8" ref={ref}>
      <div className="container">
        {/* Mobile: vertical stack like Sacraments page */}
        <div className="sm:hidden flex flex-col gap-2">
          {journeyCards.map((card, i) => (
            <Link key={card.href} href={card.href}>
              <Card
                className={`group cursor-pointer border-0 shadow-sm border-l-3 ${card.borderColor} card-interactive`}
                style={getItemStyle(i)}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center shrink-0`}>
                    <card.icon className={`w-4 h-4 ${card.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm">{card.title}</h3>
                    <span className="text-xs text-muted-foreground">{card.description}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {/* Desktop: 4-col grid — compact single-row cards */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-3">
          {journeyCards.map((card, i) => (
            <Link key={card.href} href={card.href}>
              <Card
                className={`group cursor-pointer h-full border-0 shadow-sm border-l-3 ${card.borderColor} hover-lift`}
                style={getItemStyle(i)}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center shrink-0`}>
                    <card.icon className={`w-4 h-4 ${card.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground text-sm">{card.title}</h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary group-hover:gap-1.5 transition-all">
                      {card.cta} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
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
  { key: "goodnewsroom" as const, label: "Good Newsroom", sublabel: "Archdiocese of NY", color: "bg-emerald-500", borderColor: "border-l-emerald-500", url: "https://thegoodnewsroom.org/" },
  { key: "archny" as const, label: "The Pillar", sublabel: "Catholic Journalism", color: "bg-amber-700", borderColor: "border-l-amber-700", url: "https://www.pillarcatholic.com/" },
  { key: "usccb" as const, label: "Aleteia", sublabel: "Catholic Life", color: "bg-blue-600", borderColor: "border-l-blue-600", url: "https://aleteia.org/" },
  { key: "vatican" as const, label: "Vatican News", sublabel: "Holy See Press Office", color: "bg-red-600", borderColor: "border-l-red-600", url: "https://www.vaticannews.va/en.html" },
] as const;

const RESOURCE_LINKS = [
  { name: "Archdiocese of NY", url: "https://www.archny.org/", category: "Local Church" },
  { name: "Aleteia", url: "https://aleteia.org/", category: "Catholic Life" },
  { name: "Vatican", url: "https://www.vatican.va/content/vatican/en.html", category: "Universal Church" },
  { name: "Good Newsroom", url: "https://thegoodnewsroom.org/", category: "Local News" },
  { name: "The Pillar", url: "https://www.pillarcatholic.com/", category: "Catholic News" },
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
  const { data: usccbFeed, isLoading: uLoading } = trpc.catholicResources.usccb.useQuery({ limit: 3 });
  const { data: archnyFeed, isLoading: aLoading } = trpc.catholicResources.archny.useQuery({ limit: 3 });
  const [expandedSources, setExpandedSources] = useState<string[]>([]);

  const isLoading = vLoading || gLoading || uLoading || aLoading;
  if (isLoading) return <CatholicResourcesSkeleton />;

  const feedsBySource: Record<string, typeof vaticanFeed> = {
    vatican: vaticanFeed || [],
    goodnewsroom: gnFeed || [],
    usccb: usccbFeed || [],
    archny: archnyFeed || [],
  };

  const totalArticles = (vaticanFeed?.length || 0) + (gnFeed?.length || 0) + (usccbFeed?.length || 0) + (archnyFeed?.length || 0);
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
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <Rss className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <h2 className="font-serif text-sm sm:text-base font-bold text-foreground">Catholic Resources</h2>
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
        {/* Now at St. Patrick — Live status + upcoming events + latest news */}
        <NowAtStPatrick latestNews={latestNews} allImportantDates={allImportantDates} />

        {/* Pastor's Welcome */}
        <section className="reveal container py-5 sm:py-8 mb-1 sm:mb-3">
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
        <section className="reveal container mb-6 sm:mb-8">
          <PhotoGallerySection />
        </section>

        {/* Catholic Resources — Live Feeds by Source */}
        <section className="reveal section-cream py-4 sm:py-6 -mx-4 px-4 sm:-mx-0 sm:px-0">
          <div className="container">
            <CatholicResources />
          </div>
        </section>

        {/* Daily Readings — Dark Premium Section */}
        <section className="reveal section-dark-green py-4 sm:py-6 -mx-4 px-4 sm:-mx-0 sm:px-0">
          <div className="container">
            <DailyReadings />
          </div>
        </section>

        {/* Saint of the Day */}
        <section className="reveal container py-4 sm:py-6">
          <SaintOfDayCard />
        </section>

        {/* Prayer Wall — Light a Candle */}
        <section className="reveal section-cream py-4 sm:py-6 -mx-4 px-4 sm:-mx-0 sm:px-0">
          <PrayerWall />
        </section>

        {/* Newsletter Subscription — Full-width dark CTA */}
        <section className="reveal section-dark py-6 sm:py-8 -mx-4 px-4 sm:-mx-0 sm:px-0">
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
