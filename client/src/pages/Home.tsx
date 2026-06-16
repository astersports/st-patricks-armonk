import PageLayout from "@/components/PageLayout";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Mail, Heart, GraduationCap, Users, Cross, Newspaper, MapPin, Clock, ExternalLink, Globe, Camera, ImageIcon, BookOpen, Download, RefreshCw, ChevronDown, ChevronLeft, ChevronRight, Rss, CalendarPlus } from "lucide-react";
import { downloadICS } from "@/lib/icsGenerator";
import BulletinBookReader from "@/components/BulletinBookReader";
import { PrayerWall } from "@/components/PrayerWall";
import { NowStatusBar } from "@/components/NowStatusBar";
import { LiturgicalSeasonBadge } from "@/components/LiturgicalSeasonBadge";
import { ThisWeekAccordion } from "@/components/ThisWeekAccordion";
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

// ===== HERO SECTION — L99 Cinematic with left-aligned content, green gradient, gold accent =====
function HeroSection() {
  const [timeGreeting, setTimeGreeting] = useState("");

  useEffect(() => {
    function getGreeting() {
      const now = new Date();
      const eastern = new Date(now.toLocaleString("en-US", { timeZone: TIMEZONE }));
      const hour = eastern.getHours();
      if (hour < 12) return "Good Morning";
      if (hour < 17) return "Good Afternoon";
      return "Good Evening";
    }
    setTimeGreeting(getGreeting());
    const interval = setInterval(() => setTimeGreeting(getGreeting()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[520px] sm:min-h-[560px] md:min-h-[600px] flex flex-col overflow-hidden" aria-label="Parish welcome">
      {/* Ken Burns background */}
      <div className="absolute inset-0 will-change-transform">
        <img
          src="/manus-storage/church-stained-glass_4e3f2e8c.jpg"
          alt="St. Patrick's Church stained glass window"
          className="w-full h-[115%] object-cover object-center -translate-y-[7%] hero-ken-burns"
        />
      </div>

      {/* Green-tinted gradient overlay — NOT pure black */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            165deg,
            oklch(0.12 0.06 141 / 0.82) 0%,
            oklch(0.18 0.08 141 / 0.72) 40%,
            oklch(0.08 0.03 141 / 0.88) 100%
          )`,
        }}
      />

      {/* Liturgical season badge — top-left floating pill */}
      <div className="absolute top-5 left-5 sm:top-6 sm:left-8 md:top-8 md:left-12 z-20">
        <LiturgicalSeasonBadge variant="dark" className="backdrop-blur-md bg-white/10 border-white/20 px-3 py-1.5" />
      </div>

      {/* Content — left-aligned, bottom-anchored */}
      <div className="relative z-10 flex flex-col flex-1 justify-end pb-14 sm:pb-16 md:pb-20 px-5 sm:px-8 md:px-12 lg:px-20 max-w-[1400px] mx-auto w-full">
        <div className="max-w-3xl">
          {/* Eyebrow — time greeting */}
          <p
            className="text-gold text-xs sm:text-sm font-medium tracking-[0.2em] uppercase mb-4 opacity-0"
            style={{ animation: 'fadeSlideUp 0.6s ease 0.1s forwards' }}
          >
            {timeGreeting || "Welcome"} · Armonk, New York
          </p>

          {/* Primary heading — Fraunces with gold accent */}
          <h1
            className="text-white mb-4 opacity-0"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(2.5rem, 5vw + 1rem, 5.5rem)',
              fontOpticalSizing: 'auto',
              lineHeight: 1.08,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              animation: 'fadeSlideUp 0.7s ease 0.2s forwards',
            }}
          >
            Welcome Home to<br />
            <span className="text-gold">St. Patrick</span>
          </h1>

          {/* Motto */}
          <p
            className="text-white/80 text-base sm:text-lg italic mb-2 opacity-0 max-w-xl"
            style={{
              lineHeight: 1.6,
              animation: 'fadeSlideUp 0.7s ease 0.3s forwards',
            }}
          >
            God Bless the Whole World, No Exceptions
          </p>

          {/* Address */}
          <p
            className="text-white/50 text-xs sm:text-sm font-medium tracking-wide mb-8 opacity-0"
            style={{ animation: 'fadeSlideUp 0.7s ease 0.35s forwards' }}
          >
            29 Cox Avenue, Armonk, NY 10504
          </p>

          {/* CTA Group */}
          <div
            className="flex flex-col sm:flex-row flex-wrap gap-3 opacity-0"
            style={{ animation: 'fadeSlideUp 0.7s ease 0.4s forwards' }}
          >
            <Link href="/new-here">
              <Button
                size="lg"
                className="bg-gold text-parish-green hover:bg-gold/90 font-semibold px-7 py-3 rounded-full press-scale tracking-wide"
              >
                I'm New Here
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/mass-times">
              <Button
                size="lg"
                variant="outline"
                className="border border-white/30 text-white hover:border-white/60 hover:bg-white/10 font-semibold px-7 py-3 rounded-full press-scale backdrop-blur-sm bg-white/5"
              >
                Mass Times
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator — desktop only */}
      <div className="absolute bottom-6 right-6 md:right-12 lg:right-20 hidden md:flex flex-col items-center gap-2 opacity-50" aria-hidden="true">
        <span className="text-white text-[10px] tracking-[0.2em] uppercase" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent" style={{ animation: 'scrollLine 2s ease infinite' }} />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/60 to-transparent" />
    </section>
  );
}

// === NOW AT ST. PATRICK — Unified live status + news + events ===
function NowAtStPatrick({ latestNews, newsItems, allImportantDates }: { latestNews: any; newsItems: any[] | undefined; allImportantDates: any[] | undefined }) {
  const upcomingEvents = useMemo(() => {
    return allImportantDates
      ?.filter((e) => new Date(e.eventDate as unknown as string) >= new Date())
      ?.slice(0, 12) || [];
  }, [allImportantDates]);

  const catColors: Record<string, { dot: string; bg: string }> = {
    ccd: { dot: "bg-green-500", bg: "bg-green-500/10" },
    cyo: { dot: "bg-orange-500", bg: "bg-orange-500/10" },
    sacrament: { dot: "bg-purple-500", bg: "bg-purple-500/10" },
    parish: { dot: "bg-primary", bg: "bg-primary/10" },
    teen_life: { dot: "bg-emerald-700", bg: "bg-emerald-700/10" },
    social: { dot: "bg-amber-500", bg: "bg-amber-500/10" },
  };

  return (
    <section className="reveal container -mt-10 relative z-20 mb-6 sm:mb-8">
      {/* Live Status Strip */}
      <div className="mb-6">
        <NowStatusBar />
      </div>

      {/* Latest News — Editorial hierarchy: 1 featured + 2 secondary */}
      <LatestNewsEditorial newsItems={newsItems} />

      {/* Coming Up Events — refined card */}
      {upcomingEvents.length > 0 && (
        <Card className="rounded-xl border border-border/60 shadow-sm overflow-hidden mt-4">
          <CardContent className="p-0">
            <ComingUpFiltered events={upcomingEvents} catColors={catColors} />
          </CardContent>
        </Card>
      )}
    </section>
  );
}

// === LATEST NEWS — Editorial layout with hierarchy ===
function LatestNewsEditorial({ newsItems }: { newsItems: any[] | undefined }) {
  if (!newsItems || newsItems.length === 0) {
    return (
      <Card className="rounded-xl border border-border/60 shadow-sm overflow-hidden card-interactive">
        <CardContent className="p-0">
          <Link href="/news" className="group block">
            <div className="px-4 py-3 flex items-center gap-3 hover:bg-primary/[0.03] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Newspaper className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Latest News</p>
                <p className="font-semibold text-foreground text-base">News & Announcements</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const featured = newsItems[0];
  const secondary = newsItems.slice(1, 3);

  // Estimate reading time from content length
  const readTime = (content: string) => {
    const words = content?.split(/\s+/).length || 0;
    return Math.max(1, Math.round(words / 200));
  };

  return (
    <div>
      {/* Section header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-gold text-xs font-semibold tracking-[0.15em] uppercase mb-1">Parish Life</p>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground" style={{ letterSpacing: '-0.02em' }}>Latest News</h2>
        </div>
        <Link href="/news" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 pb-1 border-b border-primary/30 hover:border-primary transition-colors">
          All News <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* News grid: featured + secondary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Featured article — spans 2 cols on large */}
        <Link href="/news" className="lg:col-span-2 group">
          <article className="rounded-xl border border-border/50 overflow-hidden hover:border-primary/20 transition-all duration-200 hover:-translate-y-0.5 h-full">
            {featured.imageUrl && (
              <div className="relative overflow-hidden aspect-[16/9] bg-muted">
                <img
                  src={featured.imageUrl}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary text-white text-xs font-semibold tracking-wide">
                    Featured
                  </span>
                </div>
              </div>
            )}
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {featured.publishedAt && (
                  <time>{format(new Date(featured.publishedAt), "MMM d, yyyy")}</time>
                )}
                <span>·</span>
                <span>{readTime(featured.content || featured.excerpt || '')} min read</span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                {featured.title}
              </h3>
              {(featured.excerpt || featured.content) && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {featured.excerpt || featured.content?.substring(0, 160)}
                </p>
              )}
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all duration-200 pt-1">
                Read article <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        </Link>

        {/* Secondary articles column */}
        <div className="flex flex-col gap-4">
          {secondary.map((post, i) => (
            <Link key={post.id || i} href="/news" className="group">
              <article className="flex gap-3 rounded-xl border border-border/50 p-3 hover:border-primary/20 transition-all duration-200 hover:-translate-y-0.5">
                {post.imageUrl && (
                  <div className="relative overflow-hidden rounded-lg flex-shrink-0 w-20 h-20 bg-muted">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center gap-1.5 min-w-0 flex-1">
                  <h3 className="font-serif text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {post.publishedAt && (
                      <time>{format(new Date(post.publishedAt), "MMM d")}</time>
                    )}
                    <span>·</span>
                    <span>{readTime(post.content || post.excerpt || '')} min</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
          {/* If fewer than 2 secondary posts, show a CTA card */}
          {secondary.length < 2 && (
            <Link href="/news" className="group">
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-primary/20 p-4 hover:border-primary/40 hover:bg-primary/[0.02] transition-all">
                <Newspaper className="w-5 h-5 text-primary/50" />
                <span className="text-sm font-medium text-primary">View All News</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// === COMING UP — Category Filtered Key Dates ===
const CATEGORIES = [
  { key: "all", label: "All", color: "bg-muted text-foreground" },
  { key: "parish", label: "Parish", color: "bg-primary/15 text-primary" },
  { key: "ccd", label: "CCD", color: "bg-green-500/15 text-green-700" },
  { key: "cyo", label: "CYO", color: "bg-orange-500/15 text-orange-700" },
  { key: "sacrament", label: "Sacrament", color: "bg-purple-500/15 text-purple-700" },
  { key: "teen_life", label: "Teen Life", color: "bg-emerald-700/15 text-emerald-800" },
  { key: "social", label: "Social", color: "bg-amber-500/15 text-amber-700" },
];

function ComingUpFiltered({ events, catColors }: { events: any[]; catColors: Record<string, { dot: string; bg: string }> }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") return events;
    return events.filter((e) => e.category === activeFilter);
  }, [events, activeFilter]);

  // Count per category
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: events.length };
    events.forEach((e) => { c[e.category] = (c[e.category] || 0) + 1; });
    return c;
  }, [events]);

  return (
    <div className="px-4 py-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-serif text-lg font-bold text-foreground">Coming Up</span>
        </div>
        <Link href="/calendar?filter=key-dates" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1">
          All Events <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Category filter chips — refined */}
      <div className="flex flex-wrap gap-1.5 pb-3 mb-3 border-b border-border/30">
        {CATEGORIES.filter(c => c.key === "all" || (counts[c.key] || 0) > 0).map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveFilter(cat.key)}
            className={`text-sm font-medium px-3 py-1 rounded-full transition-all duration-150 ${
              activeFilter === cat.key
                ? "bg-primary text-white shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            {cat.label}
            {counts[cat.key] ? ` ${counts[cat.key]}` : ""}
          </button>
        ))}
      </div>

      {/* Event list */}
      <div className="space-y-1">
        {filteredEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground italic py-3 text-center">No upcoming events in this category</p>
        ) : (
          filteredEvents.slice(0, 5).map((evt, i) => {
            const eventDate = toEastern(evt.eventDate as unknown as string);
            const colors = catColors[evt.category] || catColors.parish;
            const countdown = getCountdown(eventDate);
            return (
              <div key={evt.id || i} className="group flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg hover:bg-muted/40 transition-colors">
                <Link href="/calendar?filter=key-dates" className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Date badge */}
                  <div className={`w-10 h-10 rounded-lg ${colors.bg} flex flex-col items-center justify-center shrink-0`}>
                    <span className="text-[10px] font-bold uppercase leading-none text-primary/70">
                      {format(eventDate, "MMM")}
                    </span>
                    <span className="text-lg font-bold leading-tight text-primary">
                      {format(eventDate, "d")}
                    </span>
                  </div>
                  {/* Event info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-base leading-snug group-hover:text-primary transition-colors">
                      {evt.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {evt.location || format(eventDate, "EEEE \u00b7 h:mm a")}
                    </p>
                  </div>
                </Link>
                {/* Add to Calendar */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadICS({
                      title: evt.title,
                      startDate: eventDate,
                      location: evt.location || "St. Patrick Church, 29 Cox Ave, Armonk NY 10504",
                    });
                    toast.success("Calendar event downloaded");
                  }}
                  className="shrink-0 p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  title="Add to Calendar"
                >
                  <CalendarPlus className="w-4 h-4" />
                </button>
                {/* Countdown */}
                <span className="text-xs font-medium text-gold bg-gold/15 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                  {countdown}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
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
                <p className="text-sm text-foreground/70 uppercase tracking-wider font-medium">Latest News</p>
                {latestNews ? (
                  <p className="font-semibold text-foreground text-base leading-snug">{latestNews.title}</p>
                ) : (
                  <p className="font-semibold text-foreground text-base">News & Announcements</p>
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
    parish: "bg-primary", teen_life: "bg-emerald-700", social: "bg-amber-500",
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
            <Link href="/calendar?filter=key-dates" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              View Calendar <ArrowRight className="w-3.5 h-3.5" />
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
                      <span className="text-xs font-semibold text-gold uppercase leading-none">
                        {format(eventDate, "MMM")}
                      </span>
                      <span className="text-lg font-bold text-gold leading-tight">
                        {format(eventDate, "d")}
                      </span>
                    </div>
                    {/* Event details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
                        <p className="font-semibold text-foreground text-base leading-snug group-hover:text-primary transition-colors">
                          {evt.title}
                        </p>
                      </div>
                      <p className="text-sm text-foreground/70">
                        {evt.location || format(eventDate, "EEEE")}
                      </p>
                    </div>
                    {/* Countdown pill */}
                    <span className="text-sm font-medium text-gold bg-gold/10 px-2 py-0.5 rounded-full shrink-0">
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
              <div className="w-1 bg-gradient-to-b from-primary to-gold shrink-0 rounded-l-xl" />
              
              {/* Content */}
              <div className="flex-1 p-3 sm:p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-parish-green-dark flex items-center justify-center shrink-0 shadow-sm">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground/70 uppercase tracking-wider">
                    Week of {format(weekDate, "MMM d, yyyy")}
                  </span>
                  <h3 className="font-semibold text-foreground text-base leading-snug group-hover:text-primary transition-colors">
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
          <Link href="/gallery" className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <Card className="border-dashed">
          <CardContent className="p-5 flex flex-col items-center text-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground/40 mb-1.5" />
            <p className="text-foreground/60 text-sm">Photos coming soon!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Camera className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-serif text-lg font-bold text-foreground">Photo Gallery</h2>
        </div>
        <Link href="/gallery" className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:underline">
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
          {photos.map((photo) => (
            <Link
              key={photo.id}
              href="/gallery"
              className="shrink-0 w-52 sm:w-64 h-40 sm:h-48 rounded-xl overflow-hidden relative group snap-start shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <img
                src={photo.imageUrl}
                alt={photo.caption || photo.title || "Parish photo"}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              {photo.caption && (
                <div className="absolute bottom-0 inset-x-0 p-3">
                  <p className="text-white text-sm font-medium drop-shadow-sm">{photo.caption}</p>
                </div>
              )}
            </Link>
          ))}
          {/* "View All" card at end */}
          <Link
            href="/gallery"
            className="shrink-0 w-52 sm:w-64 h-40 sm:h-48 rounded-xl border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/[0.03] transition-all snap-start group"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <Camera className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
            </div>
            <span className="text-base text-primary font-semibold">View All Photos</span>
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
          className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
        >
          Evangelizo.org <ArrowRight className="w-3.5 h-3.5" />
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
                <p className="text-sm text-foreground/70 mt-0.5">
                  Also: {saints.filter(s => s !== featuredSaint.name && !featuredSaint.name.includes(s)).slice(0, 2).join(", ")}
                </p>
              )}
              {featuredSaint.biography && (
                <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3 mt-1">
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
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          </div>
          <div className="min-w-0">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-white">Today's Readings</h2>
            <p className="text-sm text-white/70 leading-snug">{readings.liturgicTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap mt-2">
          <LiturgicalSeasonBadge variant="dark" />
          <a
            href="https://bible.usccb.org/daily-bible-reading"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gold hover:text-gold/80 flex items-center gap-1 transition-colors ml-auto"
          >
            Full Readings <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
      {/* Compact reading rows — tap to expand */}
      <div className="space-y-2">
        {readingItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setExpandedReading(expandedReading === item.key ? null : item.key)}
            className="w-full text-left rounded-xl border border-white/12 bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-200 overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-bold uppercase tracking-wider ${item.color} block mb-1`}>{item.label}</span>
                <span className="text-sm sm:text-base text-white/85 leading-snug">{item.title}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-200 shrink-0 ${expandedReading === item.key ? "rotate-180" : ""}`} />
            </div>
            {expandedReading === item.key && (
              <div className="px-4 pb-4 pt-2 border-t border-white/12">
                <p className="text-sm sm:text-base text-white/85 leading-relaxed whitespace-pre-line">{item.text}</p>
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
                    <h3 className="font-semibold text-foreground text-base">{card.title}</h3>
                    <span className="text-sm text-foreground/70">{card.description}</span>
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
                    <h3 className="font-semibold text-foreground text-base">{card.title}</h3>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-1.5 transition-all">
                      {card.cta} <ArrowRight className="w-3.5 h-3.5" />
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
  { key: "usccb" as const, label: "Aleteia", sublabel: "Catholic Life", color: "bg-emerald-700", borderColor: "border-l-emerald-700", url: "https://aleteia.org/" },
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
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Rss className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground">Catholic Resources</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{SOURCES.length} Sources</span>
              <span>·</span>
              <span>{totalArticles} Articles</span>
              <span>·</span>
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
      <div className="space-y-2.5">
        {SOURCES.map((source) => {
          const articles = feedsBySource[source.key] || [];
          const isExpanded = expandedSources.includes(source.key);
          const newCount = articles.filter(
            (a) => Date.now() - new Date(a.pubDate).getTime() < 24 * 60 * 60 * 1000
          ).length;

          return (
            <div
              key={source.key}
              className={`rounded-xl border border-border/40 overflow-hidden shadow-sm border-l-4 ${source.borderColor} transition-all`}
            >
              {/* Source Header — clickable to expand/collapse */}
              <button
                onClick={() => toggleSource(source.key)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${source.color}`} />
                  <div className="text-left">
                    <span className="text-sm font-bold text-foreground">{source.label}</span>
                    <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">{source.sublabel}</span>
                  </div>
                  {newCount > 0 && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-gold px-1.5 py-0.5 rounded-full">
                      {newCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{articles.length}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                </div>
              </button>

              {/* Articles list */}
              {isExpanded && articles.length > 0 && (
                <div className="border-t border-border/20">
                  {articles.map((article, idx) => (
                    <a
                      key={idx}
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors border-b border-border/10 last:border-b-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
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
                    className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-primary hover:bg-primary/5 transition-colors border-t border-border/20"
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
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {RESOURCE_LINKS.map((resource, idx) => (
          <a
            key={idx}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 rounded-xl border border-border/40 px-3.5 py-3 hover:border-primary/30 hover:bg-primary/[0.03] hover:shadow-sm transition-all"
          >
            <Globe className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {resource.name}
              </p>
              <p className="text-xs text-muted-foreground">{resource.category}</p>
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
        <NowAtStPatrick latestNews={latestNews} newsItems={newsItems} allImportantDates={allImportantDates} />

        {/* This Week — Day-by-day schedule accordion */}
        <section className="reveal container mb-4 sm:mb-6">
          <ThisWeekAccordion events={allImportantDates?.map(e => ({ ...e, eventDate: e.eventDate as unknown as string })) || []} />
        </section>

        {/* Pastor's Welcome */}
        <section className="reveal container py-5 sm:py-8 mb-1 sm:mb-3">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-10 h-0.5 bg-gold mx-auto mb-5" />
            <blockquote className="font-serif text-lg sm:text-xl md:text-2xl text-foreground/90 italic leading-relaxed">
              "Whether you are a lifelong parishioner or visiting for the first time, you are welcome here. St. Patrick in Armonk is a place where faith grows, friendships form, and everyone belongs."
            </blockquote>
            <p className="mt-4 text-foreground/70 font-medium text-sm">— Fr. Thadeus Aravindathu, Pastor</p>
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
        <section className="reveal section-dark py-10 sm:py-14 -mx-4 px-4 sm:-mx-0 sm:px-0">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-14 max-w-4xl mx-auto">
              <div className="flex-1 text-center md:text-left">
                <span className="inline-flex items-center gap-2 text-gold text-sm font-medium uppercase tracking-wider mb-3">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Stay Connected
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFeatureSettings: '"ss01"' }}>
                  Subscribe to Parish Updates
                </h2>
                <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                  Weekly bulletins and parish news, delivered to your inbox.
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
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-w-[260px] focus:border-gold/60 focus:ring-gold/30 rounded-full px-5 py-2.5 text-base"
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-gold text-parish-green-dark hover:bg-gold/90 font-bold whitespace-nowrap rounded-full px-7 py-2.5 shadow-lg shadow-gold/20 active:scale-[0.97] transition-all"
                    disabled={subscribeMutation.isPending}
                  >
                    {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
                <p className="text-white/50 text-sm mt-4 text-center sm:text-left">
                  Or join us on{" "}
                  <a href="https://stpatarmonk.flocknote.com/home" target="_blank" rel="noopener noreferrer" className="text-gold/90 underline underline-offset-2 hover:text-gold transition-colors">
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
