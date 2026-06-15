import { useEffect, useMemo, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, Dribbble, Clock, MapPin, ArrowLeft, ChevronDown, Star, Printer } from "lucide-react";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { format, isToday, isTomorrow, isThisWeek, startOfWeek, addWeeks, isSameWeek } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// Convert a UTC ISO string to a TZDate in Eastern Time for correct display
const TIMEZONE = "America/New_York";
function toEastern(isoString: string): Date {
  return new TZDate(isoString, TIMEZONE);
}

type SourceFilter = "key-dates" | "all" | "parish" | "ccd" | "cyo";

const sourceConfig = {
  parish: { label: "Parish", icon: Calendar, color: "bg-primary/10 text-primary", border: "border-l-primary" },
  ccd: { label: "CCD", icon: BookOpen, color: "bg-green-100 text-green-700", border: "border-l-green-600" },
  cyo: { label: "CYO", icon: Dribbble, color: "bg-orange-100 text-orange-700", border: "border-l-orange-500" },
};

// Key Dates category config
const keyDateCategories = [
  { key: "all", label: "All", dot: "bg-foreground" },
  { key: "ccd", label: "CCD", dot: "bg-green-500" },
  { key: "cyo", label: "CYO", dot: "bg-orange-500" },
  { key: "sacrament", label: "Sacrament", dot: "bg-purple-500" },
  { key: "parish", label: "Parish", dot: "bg-primary" },
  { key: "teen_life", label: "Teen Life", dot: "bg-blue-500" },
  { key: "social", label: "Social", dot: "bg-amber-500" },
] as const;

const keyDateCatColors: Record<string, { dot: string; bg: string; label: string }> = {
  ccd: { dot: "bg-green-500", bg: "bg-green-50", label: "CCD" },
  cyo: { dot: "bg-orange-500", bg: "bg-orange-50", label: "CYO" },
  sacrament: { dot: "bg-purple-500", bg: "bg-purple-50", label: "Sacrament" },
  parish: { dot: "bg-primary", bg: "bg-primary/5", label: "Parish" },
  teen_life: { dot: "bg-blue-500", bg: "bg-blue-50", label: "Teen Life" },
  social: { dot: "bg-amber-500", bg: "bg-amber-50", label: "Social" },
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

// Key Dates Month Group sub-component
type MonthGroupData = {
  key: string;
  month: string;
  year: string;
  events: Array<{ id: number; title: string; eventDate: unknown; category: string; location: string | null; note: string | null }>;
};

function KeyDatesMonthGroup({ group }: { group: MonthGroupData }) {
  return (
    <AccordionItem value={group.key} className="border-b last:border-b-0">
      <AccordionTrigger className="px-4 sm:px-5 py-3.5 hover:bg-muted/30 transition-colors">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-primary shrink-0" />
          <span className="font-semibold text-sm sm:text-base">{group.month}</span>
          <span className="text-xs text-muted-foreground">{group.year}</span>
          <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {group.events.length} event{group.events.length !== 1 ? "s" : ""}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-0 pb-0">
        <div className="divide-y divide-border/50">
          {group.events.map((event) => {
            const cat = keyDateCatColors[event.category] || keyDateCatColors.parish;
            const eventDate = toEastern(event.eventDate as unknown as string);
            return (
              <div key={event.id} className="px-4 sm:px-5 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-medium text-gold uppercase leading-none">
                    {format(eventDate, "EEE")}
                  </span>
                  <span className="text-sm font-bold text-gold leading-tight">
                    {format(eventDate, "d")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${cat.dot} shrink-0`} />
                    <p className="font-semibold text-foreground text-sm truncate">{event.title}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    {event.location && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                    )}
                    {event.note && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {event.note}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

// Key Dates View sub-component
function KeyDatesView() {
  const { data: allImportantDates, isLoading } = trpc.importantDates.allPublished.useQuery();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");

  const filteredDates = useMemo(() => {
    if (!allImportantDates) return [];
    if (activeCategoryFilter === "all") return allImportantDates;
    return allImportantDates.filter(e => e.category === activeCategoryFilter);
  }, [allImportantDates, activeCategoryFilter]);

  const { groupedDates, currentMonthKey } = useMemo(() => {
    if (filteredDates.length === 0) return { groupedDates: [] as MonthGroupData[], currentMonthKey: "" };
    const groups: MonthGroupData[] = [];
    const now = new Date();
    const currentKey = format(now, "yyyy-MM");
    let foundCurrentMonth = "";
    for (const event of filteredDates) {
      const eventDate = toEastern(event.eventDate as unknown as string);
      const key = format(eventDate, "yyyy-MM");
      const monthLabel = format(eventDate, "MMMM");
      const yearLabel = format(eventDate, "yyyy");
      const existing = groups.find(g => g.key === key);
      if (existing) {
        existing.events.push(event);
      } else {
        groups.push({ key, month: monthLabel, year: yearLabel, events: [event] });
      }
      if (!foundCurrentMonth && key >= currentKey) {
        foundCurrentMonth = key;
      }
    }
    if (!foundCurrentMonth && groups.length > 0) {
      foundCurrentMonth = groups[groups.length - 1].key;
    }
    return { groupedDates: groups, currentMonthKey: foundCurrentMonth };
  }, [filteredDates]);

  const categoryCounts = useMemo(() => {
    if (!allImportantDates) return {};
    const counts: Record<string, number> = { all: allImportantDates.length };
    for (const event of allImportantDates) {
      counts[event.category] = (counts[event.category] || 0) + 1;
    }
    return counts;
  }, [allImportantDates]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {keyDateCategories.map((cat) => {
          const isActive = activeCategoryFilter === cat.key;
          const count = categoryCounts[cat.key] || 0;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategoryFilter(cat.key)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                transition-all duration-200 border
                ${isActive
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                }
              `}
            >
              {cat.key !== "all" && (
                <span className={`w-2 h-2 rounded-full ${isActive ? "bg-white/80" : cat.dot}`} />
              )}
              <span>{cat.label}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Accordion */}
      {groupedDates.length > 0 ? (
        activeCategoryFilter === "all" ? (
          <Accordion type="single" collapsible defaultValue={currentMonthKey} key={activeCategoryFilter} className="rounded-xl border overflow-hidden">
            {groupedDates.map((group) => (
              <KeyDatesMonthGroup key={group.key} group={group} />
            ))}
          </Accordion>
        ) : (
          <Accordion type="multiple" defaultValue={groupedDates.map(g => g.key)} key={activeCategoryFilter} className="rounded-xl border overflow-hidden">
            {groupedDates.map((group) => (
              <KeyDatesMonthGroup key={group.key} group={group} />
            ))}
          </Accordion>
        )
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
          <p className="font-medium">No events found</p>
          <p className="text-sm mt-1">
            {activeCategoryFilter !== "all"
              ? "No events in this category."
              : "Check back soon for the updated parish calendar."}
          </p>
          {activeCategoryFilter !== "all" && (
            <button
              onClick={() => setActiveCategoryFilter("all")}
              className="mt-3 text-sm text-primary hover:underline font-medium"
            >
              Show all dates
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function AllCalendars() {
  const { data: allEvents, isLoading } = trpc.googleCalendar.allEvents.useQuery();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const filterParam = params.get("filter") as SourceFilter | null;

  const [activeSource, setActiveSource] = useState<SourceFilter>(
    filterParam && ["key-dates", "parish", "ccd", "cyo"].includes(filterParam) ? filterParam : "key-dates"
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Sync filter from URL when navigating between calendar links
  useEffect(() => {
    if (filterParam && ["key-dates", "parish", "ccd", "cyo"].includes(filterParam)) {
      setActiveSource(filterParam);
    } else if (filterParam === "all") {
      setActiveSource("all");
    } else if (!filterParam) {
      setActiveSource("key-dates");
    }
  }, [filterParam]);

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

  // Filter events by source (only for Google Calendar view)
  const filteredEvents = useMemo(() => {
    if (!allEvents) return [];
    if (activeSource === "all" || activeSource === "key-dates") return allEvents;
    return allEvents.filter((e) => e.source === activeSource);
  }, [allEvents, activeSource]);

  // Group events by time period
  const groupedEvents = useMemo(() => {
    const groups: { label: string; events: typeof filteredEvents; isCollapsible: boolean }[] = [];
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
    if (!allEvents) return { parish: 0, ccd: 0, cyo: 0 };
    return {
      parish: allEvents.filter((e) => e.source === "parish").length,
      ccd: allEvents.filter((e) => e.source === "ccd").length,
      cyo: allEvents.filter((e) => e.source === "cyo").length,
    };
  }, [allEvents]);

  // Dynamic page title based on active filter
  const isKeyDates = activeSource === "key-dates";
  const pageTitle = isKeyDates
    ? "Key Dates 2026–2027"
    : activeSource === "all"
      ? "Full Calendar"
      : `${sourceConfig[activeSource as keyof typeof sourceConfig].label} Calendar`;
  const pageDescription = isKeyDates
    ? "Important parish events and milestones for the year."
    : activeSource === "all"
      ? "All upcoming events across Parish, CCD, and CYO."
      : `Upcoming ${sourceConfig[activeSource as keyof typeof sourceConfig].label} events and activities.`;

  return (
    <PageLayout hideBackButton>
      {/* Sticky Nav Bar */}
      <div className="bg-background border-b border-border/60 sticky top-0 z-30">
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

            {/* Source Filter Tabs — wraps on mobile so all tabs are visible */}
            <nav className="flex flex-wrap items-center gap-1 ml-1">
              {/* Key Dates tab — first */}
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
              </button>

              {/* Divider — hidden on mobile when wrapping */}
              <div className="w-px h-5 bg-border/60 mx-1 hidden sm:block" />

              {/* All Google Calendar events */}
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
              </button>
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
                        <span className="text-[10px] opacity-70">{count}</span>
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
      <section className="bg-gradient-to-b from-primary/5 to-background py-8 sm:py-10 border-b border-primary/10">
        <div className="container max-w-4xl">
          <p className="text-gold font-medium tracking-widest uppercase text-xs mb-2">
            {isKeyDates ? "Important Dates" : "Stay Connected"}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-2">{pageTitle}</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            {pageDescription}
          </p>
          {isKeyDates && (
            <button
              onClick={() => window.print()}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-white text-sm font-medium text-foreground hover:bg-muted/50 transition-colors print:hidden"
            >
              <Printer className="w-4 h-4" />
              Print for Bulletin Board
            </button>
          )}
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container max-w-4xl">
          {/* Key Dates View */}
          {isKeyDates ? (
            <KeyDatesView />
          ) : (
            <>
              {/* Google Calendar Events View */}
              {isLoading ? (
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
                      : `No upcoming ${sourceConfig[activeSource as keyof typeof sourceConfig]?.label} events.`}
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
                              <span className="text-[11px] text-muted-foreground/70">
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
                              const config = sourceConfig[event.source as keyof typeof sourceConfig];

                              return (
                                <div
                                  key={event.id}
                                  className={`flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border-l-[3px] ${config.border} bg-card hover:shadow-sm transition-shadow`}
                                >
                                  {/* Date Badge */}
                                  <div className="flex flex-col items-center justify-center min-w-[44px] sm:min-w-[52px]">
                                    <span className="text-[10px] sm:text-xs font-medium uppercase text-muted-foreground leading-none">
                                      {format(eventDate, "EEE")}
                                    </span>
                                    <span className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                                      {format(eventDate, "d")}
                                    </span>
                                    <span className="text-[10px] sm:text-xs text-muted-foreground leading-none">
                                      {format(eventDate, "MMM")}
                                    </span>
                                  </div>

                                  {/* Event Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-0.5">
                                      <h4 className="font-semibold text-sm sm:text-base text-foreground leading-tight">
                                        {event.title}
                                      </h4>
                                      <Badge
                                        variant="secondary"
                                        className={`text-[10px] px-1.5 py-0 shrink-0 ${config.color}`}
                                      >
                                        {config.label}
                                      </Badge>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs sm:text-sm text-muted-foreground">
                                      {!event.allDay && (
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                          {format(eventDate, "h:mm a")}
                                          {endDate && ` – ${format(endDate, "h:mm a")}`}
                                        </span>
                                      )}
                                      {event.allDay && (
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
            </>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
