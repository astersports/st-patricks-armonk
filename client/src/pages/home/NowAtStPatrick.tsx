import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Newspaper, Clock, CalendarPlus, Cross } from "lucide-react";
import { WeatherBadge, ParkingAdvisory } from "@/components/WeatherBadge";
import { SectionHeader } from "@/components/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { downloadICS } from "@/lib/icsGenerator";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { format, differenceInDays, differenceInHours } from "date-fns";
import { TZDate } from "@date-fns/tz";

const TIMEZONE = "America/New_York";
function toEastern(isoString: string): Date {
  return new TZDate(isoString, TIMEZONE);
}

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

const CATEGORIES = [
  { key: "all", label: "All", color: "bg-muted text-foreground" },
  { key: "parish", label: "Parish", color: "bg-primary/15 text-primary" },
  { key: "ccd", label: "CCD", color: "bg-green-500/15 text-green-700" },
  { key: "cyo", label: "CYO", color: "bg-orange-500/15 text-orange-700" },
  { key: "sacrament", label: "Sacrament", color: "bg-purple-500/15 text-purple-700" },
];

// === THIS SUNDAY PREVIEW ===
function ThisSundayPreview() {
  const { data: sundayData, isLoading } = trpc.dailyReadings.nextSunday.useQuery(undefined, {
    staleTime: 60 * 60 * 1000,
  });

  if (isLoading || !sundayData) return null;
  if (sundayData.daysUntil > 6) return null;

  const isToday = sundayData.daysUntil === 0;
  const dayLabel = isToday ? "Today" : sundayData.daysUntil === 1 ? "Tomorrow" : `in ${sundayData.daysUntil} days`;

  return (
    <Card className="rounded-xl border border-border/60 shadow-sm overflow-hidden mt-4 bg-gradient-to-r from-purple-50/50 via-white to-gold/5 dark:from-purple-950/20 dark:via-background dark:to-gold/5">
      <CardContent className="p-0">
        <Link href="/mass-times" className="block group">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                  <Cross className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <span className="font-serif text-base font-bold text-foreground">
                    {isToday ? "Sunday Mass" : "This Sunday"}
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">
                {dayLabel}
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground/90 mb-2">{sundayData.liturgicTitle}</p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="text-xs bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full">
                {sundayData.firstReading.title.split(" ").slice(0, 3).join(" ")}
              </span>
              <span className="text-xs bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full">
                {sundayData.psalm.title.split(" ").slice(0, 2).join(" ")}
              </span>
              {sundayData.secondReading && (
                <span className="text-xs bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full">
                  {sundayData.secondReading.title.split(" ").slice(0, 3).join(" ")}
                </span>
              )}
              <span className="text-xs bg-gold/15 text-gold font-medium px-2 py-0.5 rounded-full">
                {sundayData.gospel.title.replace("Holy Gospel of Jesus Christ according to ", "Gospel: ")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>Masses at 8:30 AM, 10:30 AM & 12:30 PM</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

// === COMING UP FILTERED ===
function ComingUpFiltered({ events, catColors }: { events: any[]; catColors: Record<string, { dot: string; bg: string }> }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") return events;
    if (activeFilter === "parish") return events.filter((e) => e.category === "parish" || e.category === "teen_life" || e.category === "social");
    return events.filter((e) => e.category === activeFilter);
  }, [events, activeFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: events.length };
    events.forEach((e) => {
      if (e.category === "teen_life" || e.category === "social") {
        c["parish"] = (c["parish"] || 0) + 1;
      } else {
        c[e.category] = (c[e.category] || 0) + 1;
      }
    });
    return c;
  }, [events]);

  const weatherInput = useMemo(() => {
    const now = new Date();
    const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return events
      .filter(e => {
        const d = new Date(e.eventDate as unknown as string);
        return d >= now && d <= sevenDays;
      })
      .map(e => ({
        id: e.id?.toString() || e.title,
        title: e.title,
        description: e.note || undefined,
        location: e.location || undefined,
        startDate: new Date(e.eventDate as unknown as string).toISOString(),
      }));
  }, [events]);

  const { data: weatherData } = trpc.weather.forEvents.useQuery(
    { events: weatherInput },
    { enabled: weatherInput.length > 0, staleTime: 60 * 60 * 1000 }
  );

  return (
    <div className="px-4 py-3">
      <SectionHeader
        icon={Clock}
        title="Coming Up"
        size="sm"
        action={
          <Link href="/calendar" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 pb-1 border-b border-primary/30 hover:border-primary transition-colors">
            View Full Calendar <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      />

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

      <div className="space-y-1">
        {filteredEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground italic py-3 text-center">No upcoming events in this category</p>
        ) : (
          filteredEvents.slice(0, 5).map((evt, i) => {
            const eventDate = toEastern(evt.eventDate as unknown as string);
            const colors = catColors[evt.category] || catColors.parish;
            const countdown = getCountdown(eventDate);
            const evtKey = evt.id?.toString() || evt.title;
            const evtWeather = weatherData?.[evtKey];
            return (
              <div key={evt.id || i} className="group py-2 px-2 -mx-2 rounded-lg hover:bg-muted/40 transition-colors">
                <div className="flex items-start sm:items-center gap-3">
                  <Link href="/calendar" className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-lg ${colors.bg} flex flex-col items-center justify-center shrink-0`}>
                      <span className="text-[10px] font-bold uppercase leading-none text-primary/70">
                        {format(eventDate, "MMM")}
                      </span>
                      <span className="text-lg font-bold leading-tight text-primary">
                        {format(eventDate, "d")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm sm:text-base leading-snug group-hover:text-primary transition-colors">
                        {evt.title}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {evt.location || format(eventDate, "EEEE \u00b7 h:mm a")}
                      </p>
                      <span className="inline-flex sm:hidden text-[11px] font-medium text-gold bg-gold/15 px-2 py-0.5 rounded-full mt-1">
                        {countdown}
                      </span>
                    </div>
                  </Link>
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
                  <span className="hidden sm:inline-flex text-xs font-medium text-gold bg-gold/15 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                    {countdown}
                  </span>
                </div>
                {evtWeather?.weather && (
                  <div className="ml-[52px] mt-1">
                    <WeatherBadge weather={evtWeather.weather} compact />
                    {evtWeather.parkingAdvisory && (
                      <div className="mt-1">
                        <ParkingAdvisory advisory={evtWeather.parkingAdvisory} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// === LATEST NEWS EDITORIAL ===
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

  const readTime = (content: string) => {
    const words = content?.split(/\s+/).length || 0;
    return Math.max(1, Math.round(words / 200));
  };

  return (
    <div>
      <SectionHeader
        icon={Newspaper}
        title="Latest News"
        label="Parish Life"
        size="lg"
        action={
          <Link href="/news" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 pb-1 border-b border-primary/30 hover:border-primary transition-colors">
            All News <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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

// === MAIN EXPORT: NowAtStPatrick ===
export function NowAtStPatrick({ latestNews, newsItems, allImportantDates }: { latestNews: any; newsItems: any[] | undefined; allImportantDates: any[] | undefined }) {
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
    <section className="reveal container mt-0 pt-4 sm:pt-6 relative z-20 mb-6 sm:mb-8">
      <LatestNewsEditorial newsItems={newsItems} />
      <ThisSundayPreview />
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
