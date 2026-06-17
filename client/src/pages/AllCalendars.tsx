import { useMemo, useState } from "react";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, Dribbble, Clock, MapPin, ArrowLeft, ChevronDown, Star } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { format, isToday, isTomorrow, isThisWeek, startOfWeek, addWeeks, isSameWeek } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { WeatherBadge, ParkingAdvisory } from "@/components/WeatherBadge";

// Convert a UTC ISO string to a TZDate in Eastern Time for correct display
const TIMEZONE = "America/New_York";
function toEastern(isoString: string): Date {
  return new TZDate(isoString, TIMEZONE);
}

type SourceFilter = "all" | "key-dates" | "parish" | "ccd" | "cyo" | "sacrament";

const sourceConfig = {
  parish: { label: "Parish", icon: Calendar, color: "bg-primary/10 text-primary", border: "border-l-primary" },
  ccd: { label: "CCD", icon: BookOpen, color: "bg-green-100 text-green-700", border: "border-l-green-600" },
  cyo: { label: "CYO", icon: Dribbble, color: "bg-orange-100 text-orange-700", border: "border-l-orange-500" },
  sacrament: { label: "Sacrament", icon: Clock, color: "bg-purple-100 text-purple-700", border: "border-l-purple-500" },
};

// Key dates category colors for the border
const keyDateCategoryBorder: Record<string, string> = {
  ccd: "border-l-green-600",
  cyo: "border-l-orange-500",
  sacrament: "border-l-purple-500",
  parish: "border-l-primary",
  teen_life: "border-l-blue-500",
  social: "border-l-amber-500",
};

const keyDateCategoryColor: Record<string, string> = {
  ccd: "bg-green-100 text-green-700",
  cyo: "bg-orange-100 text-orange-700",
  sacrament: "bg-purple-100 text-purple-700",
  parish: "bg-primary/10 text-primary",
  teen_life: "bg-blue-100 text-blue-700",
  social: "bg-amber-100 text-amber-700",
};

const keyDateCategoryLabel: Record<string, string> = {
  ccd: "CCD",
  cyo: "CYO",
  sacrament: "Sacrament",
  parish: "Parish",
  teen_life: "Teen Life",
  social: "Social",
};

// Groups that should always be expanded (near-term)
const ALWAYS_EXPANDED = new Set(["Today", "Tomorrow", "This Week", "Next Week"]);

function getWeekGroup(date: Date): string {
  const now = new Date();
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isThisWeek(date, { weekStartsOn: 0 })) return "This Week";
  const nextWeekStart = startOfWeek(addWeeks(now, 1), { weekStartsOn: 0 });
  if (isSameWeek(date, nextWeekStart, { weekStartsOn: 0 })) return "Next Week";
  return format(date, "MMMM yyyy");
}

export default function AllCalendars() {
  const { data: allEvents, isLoading } = trpc.googleCalendar.allEvents.useQuery();
  const { data: keyDatesRaw, isLoading: keyDatesLoading } = trpc.importantDates.allPublished.useQuery();

  const [activeSource, setActiveSource] = useState<SourceFilter>("all");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  // Normalize key dates into the same shape as calendar events for unified rendering
  const keyDatesNormalized = useMemo(() => {
    if (!keyDatesRaw) return [];
    const now = new Date();
    return keyDatesRaw
      .filter(d => new Date(d.eventDate as unknown as string) >= now)
      .map(d => ({
        id: `kd-${d.id}`,
        title: d.title,
        startDate: d.eventDate as unknown as string,
        endDate: null as string | null,
        location: d.location || null,
        description: d.note || null,
        allDay: true,
        source: "key-dates" as const,
        category: d.category,
      }));
  }, [keyDatesRaw]);

  // Unified event type for rendering
  type UnifiedEvent = {
    id: string;
    title: string;
    startDate: string;
    endDate: string | null;
    location: string | null;
    description: string | null;
    allDay: boolean;
    source: string;
    category?: string;
  };

  // Sacrament-related title patterns (Daily Mass, Adoration, etc.)
  const sacramentPatterns = /^(daily mass|weekday mass|mass|first friday|adoration|eucharistic|confession|reconciliation|communion|confirmation|baptism|anointing|penance)/i;

  // Filter events by source
  const filteredEvents: UnifiedEvent[] = useMemo(() => {
    if (activeSource === "key-dates") return keyDatesNormalized;
    if (!allEvents) return [];
    let events: typeof allEvents;
    if (activeSource === "sacrament") {
      // Sacrament filter: Mass, Adoration, Confession from any source + sacrament key dates
      events = allEvents.filter((e) => sacramentPatterns.test(e.title.trim()));
    } else if (activeSource === "parish") {
      // Parish filter: parish source events that are NOT sacrament-type
      events = allEvents.filter((e) => e.source === "parish" && !sacramentPatterns.test(e.title.trim()));
    } else {
      events = activeSource === "all" ? allEvents : allEvents.filter((e) => e.source === activeSource);
    }
    const mapped = events.map(e => ({
      id: e.id,
      title: e.title,
      startDate: e.startDate,
      endDate: e.endDate || null,
      location: e.location || null,
      description: e.description || null,
      allDay: e.allDay,
      source: e.source,
    }));
    // In "All" view, merge Key Dates into the timeline so milestones appear with star badges
    if (activeSource === "all" && keyDatesNormalized.length > 0) {
      // Build a set of existing event keys to avoid duplicates
      const existingKeys = new Set(mapped.map(e => `${e.title.toLowerCase().trim()}|${new Date(e.startDate).toISOString().slice(0, 10)}`));
      const uniqueKeyDates = keyDatesNormalized.filter(kd => {
        const key = `${kd.title.toLowerCase().trim()}|${new Date(kd.startDate).toISOString().slice(0, 10)}`;
        return !existingKeys.has(key);
      });
      const combined = [...mapped, ...uniqueKeyDates];
      combined.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      return combined;
    }
    return mapped;
  }, [allEvents, keyDatesNormalized, activeSource]);

  // Group events by time period
  const groupedEvents = useMemo(() => {
    const groups: { label: string; events: UnifiedEvent[]; isCollapsible: boolean }[] = [];
    let currentGroup = "";

    for (const event of filteredEvents) {
      const date = toEastern(event.startDate);
      const group = getWeekGroup(date);
      if (group !== currentGroup) {
        currentGroup = group;
        groups.push({ label: group, events: [], isCollapsible: !ALWAYS_EXPANDED.has(group) });
      }
      groups[groups.length - 1].events.push(event);
    }

    return groups;
  }, [filteredEvents]);

  // Count events per source for badges
  const counts = useMemo(() => {
    if (!allEvents) return { all: 0, parish: 0, ccd: 0, cyo: 0, sacrament: 0 };
    // All count includes merged key dates
    const calCount = allEvents.length;
    const sacramentCount = allEvents.filter((e) => sacramentPatterns.test(e.title.trim())).length;
    return {
      all: calCount + keyDatesNormalized.length,
      parish: allEvents.filter((e) => e.source === "parish" && !sacramentPatterns.test(e.title.trim())).length,
      ccd: allEvents.filter((e) => e.source === "ccd").length,
      cyo: allEvents.filter((e) => e.source === "cyo").length,
      sacrament: sacramentCount,
    };
  }, [allEvents, keyDatesNormalized]);

  const keyDatesCount = keyDatesNormalized.length;

  // Build a set of key date titles+dates for cross-referencing in All view
  const keyDateMatchSet = useMemo(() => {
    if (!keyDatesRaw) return new Set<string>();
    return new Set(
      keyDatesRaw.map(d => {
        const dateStr = new Date(d.eventDate as unknown as string).toISOString().slice(0, 10);
        return `${d.title.toLowerCase().trim()}|${dateStr}`;
      })
    );
  }, [keyDatesRaw]);

  // Weather enrichment for events within 7 days (not for key-dates view)
  const weatherInput = useMemo(() => {
    if (activeSource === "key-dates") return [];
    if (!filteredEvents || filteredEvents.length === 0) return [];
    const now = new Date();
    const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return filteredEvents
      .filter(e => {
        const d = new Date(e.startDate);
        return d >= now && d <= sevenDays;
      })
      .map(e => ({
        id: String(e.id),
        title: e.title,
        description: e.description || undefined,
        location: e.location || undefined,
        startDate: e.startDate,
      }));
  }, [filteredEvents, activeSource]);

  const { data: weatherData } = trpc.weather.forEvents.useQuery(
    { events: weatherInput },
    { enabled: weatherInput.length > 0 && activeSource !== "key-dates", staleTime: 60 * 60 * 1000 }
  );

  // Page metadata
  const pageTitle = activeSource === "all"
    ? "Parish Calendar"
    : activeSource === "key-dates"
      ? "Key Dates"
      : `${sourceConfig[activeSource].label} Calendar`;
  const pageDescription = activeSource === "all"
    ? "All upcoming events across Parish, CCD, and CYO."
    : activeSource === "key-dates"
      ? "Important parish events and milestones."
      : `Upcoming ${sourceConfig[activeSource].label} events and activities.`;

  const isLoadingContent = activeSource === "key-dates" ? keyDatesLoading : isLoading;

  return (
    <PageLayout hideBackButton>
      {/* Sticky Nav Bar — pinned below the global nav on scroll */}
      <div className="bg-background/95 backdrop-blur-md border-b border-border/60 sticky top-[var(--nav-height,5.5rem)] z-30">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-2 py-2.5">
            {/* Back to Home button */}
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors pr-3 border-r border-border/50 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            {/* Source Filter Tabs */}
            <nav className="flex flex-wrap items-center gap-1 ml-1">
              {/* All events tab */}
              <button
                onClick={() => setActiveSource("all")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeSource === "all"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                All
                {counts.all > 0 && (
                  <span className="text-xs opacity-70">{counts.all}</span>
                )}
              </button>

              {/* Key Dates tab */}
              <button
                onClick={() => setActiveSource("key-dates")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeSource === "key-dates"
                    ? "bg-gold/15 text-gold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                Key Dates
                {keyDatesCount > 0 && (
                  <span className="text-xs opacity-70">{keyDatesCount}</span>
                )}
              </button>

              {/* Source-specific tabs */}
              {(Object.entries(sourceConfig) as [keyof typeof sourceConfig, typeof sourceConfig.parish][]).map(
                ([key, config]) => {
                  const count = counts[key];
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveSource(key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                        activeSource === key
                          ? config.color
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <config.icon className="w-3.5 h-3.5" />
                      {config.label}
                      {count > 0 && (
                        <span className="text-xs opacity-70">{count}</span>
                      )}
                    </button>
                  );
                }
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <PageHeader
        eyebrow={activeSource === "key-dates" ? "Important Dates" : "Stay Connected"}
        title={pageTitle}
        description={pageDescription}
      />

      <section className="py-8 sm:py-12">
        <div className="container max-w-4xl">
          {isLoadingContent ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 p-4 rounded-lg border">
                  <Skeleton className="w-12 h-14 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Calendar className="w-10 h-10 text-primary/30 mx-auto mb-3" />
              <p className="text-muted-foreground">
                {activeSource === "all"
                  ? "No upcoming events found."
                  : activeSource === "key-dates"
                    ? "No upcoming key dates."
                    : `No upcoming ${sourceConfig[activeSource]?.label} events.`}
              </p>
              {activeSource !== "all" && (
                <button
                  onClick={() => setActiveSource("all")}
                  className="text-primary text-sm font-medium mt-2 hover:underline"
                >
                  Show all events
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {groupedEvents.map((group) => {
                const isExpanded = !group.isCollapsible || expandedGroups.has(group.label);

                return (
                  <div key={group.label}>
                    {/* Group Header — clickable accordion for month groups */}
                    {group.isCollapsible ? (
                      <button
                        onClick={() => toggleGroup(group.label)}
                        className="w-full sticky top-[52px] z-10 bg-background/95 backdrop-blur-sm py-2.5 mb-3 border-b border-border/50 flex items-center justify-between group cursor-pointer"
                      >
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                          {group.label}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground/70">
                            {group.events.length} event{group.events.length !== 1 ? "s" : ""}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>
                    ) : (
                      <div className="sticky top-[52px] z-10 bg-background/95 backdrop-blur-sm py-2 mb-3 border-b border-border/50">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {group.label}
                        </h3>
                      </div>
                    )}

                    {/* Events — animated expand/collapse for month groups */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-out ${
                        isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="space-y-2">
                        {group.events.map((event) => {
                          const eventDate = toEastern(event.startDate);
                          const endDate = event.endDate ? toEastern(event.endDate) : null;
                          const isKeyDate = event.source === "key-dates";
                          // Show star badge on Key Date events when displayed in the All view
                          const isKeyDateMatch = isKeyDate && activeSource === "all";
                          const eventCategory = (event as any).category as string | undefined;

                          // Determine border and badge colors
                          const borderClass = isKeyDate
                            ? (keyDateCategoryBorder[eventCategory || "parish"] || "border-l-gold")
                            : sourceConfig[event.source as keyof typeof sourceConfig]?.border || "border-l-primary";
                          const badgeClass = isKeyDate
                            ? (keyDateCategoryColor[eventCategory || "parish"] || "bg-gold/10 text-gold")
                            : sourceConfig[event.source as keyof typeof sourceConfig]?.color || "bg-primary/10 text-primary";
                          const badgeLabel = isKeyDate
                            ? (keyDateCategoryLabel[eventCategory || "parish"] || "Key Date")
                            : sourceConfig[event.source as keyof typeof sourceConfig]?.label || "Parish";

                          return (
                            <div
                              key={event.id}
                              className={`flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border-l-[3px] ${borderClass} bg-card hover:shadow-sm transition-shadow`}
                            >
                              {/* Date Badge */}
                              <div className="flex flex-col items-center justify-center min-w-[44px] sm:min-w-[52px]">
                                <span className="text-xs sm:text-xs font-medium uppercase text-muted-foreground leading-none">
                                  {format(eventDate, "EEE")}
                                </span>
                                <span className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                                  {format(eventDate, "d")}
                                </span>
                                <span className="text-xs sm:text-xs text-muted-foreground leading-none">
                                  {format(eventDate, "MMM")}
                                </span>
                              </div>

                              {/* Event Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-0.5">
                                  <h4 className="font-semibold text-sm sm:text-base text-foreground leading-tight flex items-center gap-1.5">
                                    {isKeyDateMatch && (
                                      <Star className="w-3.5 h-3.5 text-gold fill-gold shrink-0" />
                                    )}
                                    {event.title}
                                  </h4>
                                  <div className="flex items-center gap-1 shrink-0">
                                    {isKeyDateMatch && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs px-1.5 py-0 bg-gold/10 text-gold"
                                      >
                                        Key Date
                                      </Badge>
                                    )}
                                    <Badge
                                      variant="secondary"
                                      className={`text-xs px-1.5 py-0 ${badgeClass}`}
                                    >
                                      {badgeLabel}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs sm:text-sm text-muted-foreground">
                                  {!event.allDay && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                      {format(eventDate, "h:mm a")}
                                      {endDate && ` – ${format(endDate, "h:mm a")}`}
                                    </span>
                                  )}
                                  {event.allDay && !isKeyDate && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                      All Day
                                    </span>
                                  )}
                                  {event.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                      {event.location}
                                    </span>
                                  )}
                                </div>

                                {event.description && (
                                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {event.description}
                                  </p>
                                )}

                                {/* Weather badge for outdoor/high-attendance events (not for key dates) */}
                                {!isKeyDate && weatherData?.[event.id as unknown as number]?.weather && (
                                  <div className="mt-2 space-y-1.5">
                                    <WeatherBadge weather={weatherData[event.id as unknown as number].weather!} />
                                    {weatherData[event.id as unknown as number].parkingAdvisory && (
                                      <ParkingAdvisory advisory={weatherData[event.id as unknown as number].parkingAdvisory!} />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
