import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Calendar, ExternalLink, ChevronLeft, ChevronRight, Mail, Bell, CheckCircle2, Share2, Link2, Copy, Filter, X, Search, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import BulletinBookReader from "@/components/BulletinBookReader";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function BulletinSubscribeCTA() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const subscribeMutation = trpc.subscriptions.subscribe.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      toast.success(data.message || "You're subscribed!");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    subscribeMutation.mutate({
      email,
      name: name || undefined,
      subscribedToBulletins: true,
      subscribedToNews: true,
    });
  };

  if (submitted) {
    return (
      <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 sm:p-6 text-center">
        <CheckCircle2 className="w-6 h-6 text-primary mx-auto mb-2" />
        <h3 className="font-serif text-base font-bold mb-1">You're Subscribed!</h3>
        <p className="text-muted-foreground text-xs">
          You'll receive the weekly bulletin in your inbox every Sunday.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Never Miss a Bulletin</span>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9 h-9 text-sm"
            required
          />
        </div>
        <Input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-9 text-sm sm:w-40"
        />
        <Button type="submit" size="sm" className="h-9 gap-1.5 text-sm px-4" disabled={subscribeMutation.isPending}>
          {subscribeMutation.isPending ? "..." : "Subscribe"}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground/60 mt-2">Unsubscribe anytime.</p>
    </div>
  );
}

const ITEMS_PER_PAGE = 20;

export default function Bulletins() {
  const { data: bulletins, isLoading } = trpc.bulletins.listPublished.useQuery();
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingBulletin, setViewingBulletin] = useState<typeof bulletins extends (infer T)[] | undefined ? T | null : null>(null);

  const latestBulletin = bulletins?.[0];
  const archiveBulletins = bulletins?.slice(1) || [];

  // Get available years from archive
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    archiveBulletins.forEach((b) => {
      years.add(new Date(b.weekDate).getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [archiveBulletins]);

  // Get available months for the selected year
  const availableMonths = useMemo(() => {
    if (selectedYear === "all") {
      return Array.from({ length: 12 }, (_, i) => i);
    }
    const months = new Set<number>();
    archiveBulletins.forEach((b) => {
      const d = new Date(b.weekDate);
      if (d.getFullYear() === Number(selectedYear)) {
        months.add(d.getMonth());
      }
    });
    return Array.from(months).sort((a, b) => b - a);
  }, [archiveBulletins, selectedYear]);

  // Filter archive bulletins
  const filteredBulletins = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return archiveBulletins.filter((b) => {
      const d = new Date(b.weekDate);
      if (selectedYear !== "all" && d.getFullYear() !== Number(selectedYear)) return false;
      if (selectedMonth !== "all" && d.getMonth() !== Number(selectedMonth)) return false;
      if (query) {
        const titleMatch = b.title?.toLowerCase().includes(query);
        const descMatch = b.description?.toLowerCase().includes(query);
        const dateStr = format(d, "MMMM d, yyyy").toLowerCase();
        const dateMatch = dateStr.includes(query);
        if (!titleMatch && !descMatch && !dateMatch) return false;
      }
      return true;
    });
  }, [archiveBulletins, selectedYear, selectedMonth, searchQuery]);

  const hasActiveFilter = selectedYear !== "all" || selectedMonth !== "all" || searchQuery.trim() !== "";

  // Pagination
  const totalItems = filteredBulletins.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedBulletins = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBulletins.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBulletins, currentPage]);

  const clearFilters = () => {
    setSelectedYear("all");
    setSelectedMonth("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  // The bulletin currently being read (either latest or one from archive)
  const activeBulletin = viewingBulletin || latestBulletin;

  return (
    <PageLayout>
      {/* Compact header */}
      <section className="bg-gradient-to-b from-primary/5 to-transparent py-6 sm:py-8">
        <div className="container">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-1">Weekly Bulletin</h1>
          <p className="text-sm text-muted-foreground">
            Parish announcements, Mass readings, and community news.
          </p>
        </div>
      </section>

      <section className="container py-4 sm:py-6">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : latestBulletin ? (
          <div className="space-y-6">
            {/* Active Bulletin — Inline Reader */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {!viewingBulletin && <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-medium">This Week</span>}
                  {viewingBulletin && (
                    <button onClick={() => setViewingBulletin(null)} className="text-xs bg-muted text-foreground px-2 py-0.5 rounded-full font-medium flex items-center gap-1 hover:bg-muted/80">
                      <ChevronLeft className="w-2.5 h-2.5" /> Back to Latest
                    </button>
                  )}
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(activeBulletin!.weekDate), "MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <a href={activeBulletin!.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="h-7 gap-1 text-xs px-2">
                      <Download className="w-3 h-3" /> PDF
                    </Button>
                  </a>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline" className="h-7 gap-1 text-xs px-2">
                        <Share2 className="w-3 h-3" /> Share
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => {
                          navigator.clipboard.writeText(activeBulletin!.pdfUrl.startsWith("http") ? activeBulletin!.pdfUrl : window.location.origin + activeBulletin!.pdfUrl);
                          toast.success("Link copied");
                        }}
                      >
                        <Link2 className="w-3.5 h-3.5 mr-2" /> Copy PDF Link
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          const pdfLink = activeBulletin!.pdfUrl.startsWith("http") ? activeBulletin!.pdfUrl : window.location.origin + activeBulletin!.pdfUrl;
                          const subject = encodeURIComponent(`${activeBulletin!.title} — St. Patrick in Armonk`);
                          const body = encodeURIComponent(`Parish bulletin:\n${pdfLink}`);
                          window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
                        }}
                      >
                        <Mail className="w-3.5 h-3.5 mr-2" /> Email
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.origin + "/bulletins");
                          toast.success("Page link copied");
                        }}
                      >
                        <Copy className="w-3.5 h-3.5 mr-2" /> Copy Page Link
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Inline Book Reader */}
              <Card className="overflow-hidden border-0 shadow-lg">
                <BulletinBookReader pdfUrl={activeBulletin!.pdfUrl} title={activeBulletin!.title} />
              </Card>
            </div>

            {/* Subscribe CTA — compact */}
            <BulletinSubscribeCTA />

            {/* Archive — Vertical List */}
            {archiveBulletins.length > 0 && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <h3 className="font-serif text-lg font-bold text-foreground">Past Bulletins</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Select value={selectedYear} onValueChange={(v) => { setSelectedYear(v); setSelectedMonth("all"); setCurrentPage(1); }}>
                      <SelectTrigger className="w-[100px] h-8 text-xs">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {availableYears.map((year) => (
                          <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedMonth} onValueChange={(v) => { setSelectedMonth(v); setCurrentPage(1); }}>
                      <SelectTrigger className="w-[110px] h-8 text-xs">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Months</SelectItem>
                        {availableMonths.map((month) => (
                          <SelectItem key={month} value={String(month)}>{MONTH_NAMES[month]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {hasActiveFilter && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs text-muted-foreground">
                        <X className="w-3 h-3 mr-1" /> Clear
                      </Button>
                    )}
                  </div>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
                  <Input
                    type="text"
                    placeholder="Search bulletins..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="pl-9 h-8 text-sm"
                  />
                  {searchQuery && (
                    <button onClick={() => { setSearchQuery(""); setCurrentPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {hasActiveFilter && (
                  <p className="text-xs text-muted-foreground mb-3">
                    {filteredBulletins.length} bulletin{filteredBulletins.length !== 1 ? "s" : ""} found
                  </p>
                )}

                {filteredBulletins.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <FileText className="w-6 h-6 mx-auto mb-2 opacity-40" />
                    <p className="text-xs">No bulletins found.</p>
                    <Button variant="link" size="sm" onClick={clearFilters} className="mt-1 text-xs">Clear filters</Button>
                  </div>
                ) : (
                  <div>
                    {/* Vertical list of bulletin rows */}
                    <div className="divide-y divide-border/50 border rounded-lg overflow-hidden">
                      {paginatedBulletins.map((bulletin) => {
                        const weekDate = new Date(bulletin.weekDate);
                        return (
                          <div
                            key={bulletin.id}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/30 transition-colors group"
                          >
                            {/* Date */}
                            <div className="w-12 text-center shrink-0">
                              <p className="text-xs font-bold uppercase text-muted-foreground leading-none">
                                {format(weekDate, "MMM")}
                              </p>
                              <p className="text-lg font-bold text-foreground leading-tight">
                                {format(weekDate, "d")}
                              </p>
                              <p className="text-xs text-muted-foreground leading-none">
                                {format(weekDate, "yyyy")}
                              </p>
                            </div>

                            {/* Title */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {bulletin.title || `Bulletin — ${format(weekDate, "MMMM d, yyyy")}`}
                              </p>
                              {bulletin.description && (
                                <p className="text-sm text-muted-foreground truncate">{bulletin.description}</p>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                                onClick={() => setViewingBulletin(bulletin)}
                                title="Read inline"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Button>
                              <a href={bulletin.pdfUrl} target="_blank" rel="noopener noreferrer">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                                  title="Download PDF"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </Button>
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-3 pt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="h-7 px-2 text-xs"
                        >
                          <ChevronLeft className="w-3 h-3 mr-1" /> Newer
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          {currentPage} / {totalPages}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="h-7 px-2 text-xs"
                        >
                          Older <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <Card className="p-8 text-center border-dashed border-2">
            <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="font-semibold text-base mb-1">Bulletin Coming Soon</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-3">
              The weekly parish bulletin will be posted here each Sunday.
            </p>
            <a href="https://stpatarmonk.flocknote.com/home" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
              Visit Flocknote for Updates →
            </a>
          </Card>
        )}
      </section>
    </PageLayout>
  );
}
