import { useEffect, useMemo, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, Dribbble, Clock, MapPin, ArrowLeft, ChevronDown, Home } from "lucide-react";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { format, isToday, isTomorrow, isThisWeek, startOfWeek, addWeeks, isSameWeek } from "date-fns";

type SourceFilter = "all" | "parish" | "ccd" | "cyo";

const sourceConfig = {
  parish: { label: "Parish", icon: Calendar, color: "bg-primary/10 text-primary", border: "border-l-primary" },
  ccd: { label: "CCD", icon: BookOpen, color: "bg-green-100 text-green-700", border: "border-l-green-600" },
  cyo: { label: "CYO", icon: Dribbble, color: "bg-orange-100 text-orange-700", border: "border-l-orange-500" },
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
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const filterParam = params.get("filter") as SourceFilter | null;

  const [activeSource, setActiveSource] = useState<SourceFilter>(
    filterParam && ["parish", "ccd", "cyo"].includes(filterParam) ? filterParam : "all"
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Sync filter from URL when navigating between calendar links
  useEffect(() => {
    if (filterParam && ["parish", "ccd", "cyo"].includes(filterParam)) {
      setActiveSource(filterParam);
    } else if (!filterParam) {
      setActiveSource("all");
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

  // Filter events by source
  const filteredEvents = useMemo(() => {
    if (!allEvents) return [];
    if (activeSource === "all") return allEvents;
    return allEvents.filter((e) => e.source === activeSource);
  }, [allEvents, activeSource]);

  // Group events by time period
  const groupedEvents = useMemo(() => {
    const groups: { label: string; events: typeof filteredEvents; isCollapsible: boolean }[] = [];
    let currentGroup = "";

    for (const event of filteredEvents) {
      const date = new Date(event.startDate);
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
  const pageTitle = activeSource === "all" ? "Calendar" : `${sourceConfig[activeSource].label} Calendar`;
  const pageDescription = activeSource === "all"
    ? "All upcoming events across Parish, CCD, and CYO — in one place."
    : `Upcoming ${sourceConfig[activeSource].label} events and activities.`;

  return (
    <PageLayout>
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

            {/* Source Filter Tabs */}
            <nav className="flex items-center gap-1 ml-1 overflow-x-auto">
              <button
                onClick={() => setActiveSource("all")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0 ${
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
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0 ${
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
          <p className="text-gold font-medium tracking-widest uppercase text-xs mb-2">Stay Connected</p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-2">{pageTitle}</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            {pageDescription}
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container max-w-4xl">
          {/* Loading State */}
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
                          const eventDate = new Date(event.startDate);
                          const endDate = event.endDate ? new Date(event.endDate) : null;
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
        </div>
      </section>
    </PageLayout>
  );
}
