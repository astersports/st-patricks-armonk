import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { FileText, Download, Calendar, ExternalLink, ChevronDown, ChevronUp, Mail, Bell, CheckCircle2, Share2, Link2, Copy } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useState, useMemo } from "react";
import { toast } from "sonner";

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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border border-primary/10 p-8 sm:p-10">
        <div className="text-center max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
            <CheckCircle2 className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-serif text-xl font-bold mb-2">You're Subscribed!</h3>
          <p className="text-muted-foreground text-sm">
            You'll receive the weekly bulletin and parish news in your inbox every Sunday.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border border-primary/10 p-8 sm:p-10">
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
        {/* Left: Copy */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
              <Bell className="w-4.5 h-4.5 text-primary" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Never Miss a Bulletin</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold mb-2">Get the Bulletin in Your Inbox</h3>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Subscribe to receive the weekly parish bulletin and news updates every Sunday morning — no account needed.
          </p>
        </div>

        {/* Right: Form */}
        <div className="w-full lg:w-auto lg:min-w-[340px]">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11"
                required
              />
            </div>
            <Input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
            />
            <Button
              type="submit"
              className="w-full h-11 gap-2 font-medium"
              disabled={subscribeMutation.isPending}
            >
              {subscribeMutation.isPending ? (
                "Subscribing..."
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Subscribe to Weekly Bulletin
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground/70 text-center">
              Unsubscribe anytime. We respect your privacy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Bulletins() {
  const { data: bulletins, isLoading } = trpc.bulletins.listPublished.useQuery();
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());

  const latestBulletin = bulletins?.[0];
  const archiveBulletins = bulletins?.slice(1) || [];

  // Group archive by year
  const archiveByYear = useMemo(() => {
    const groups: Record<number, typeof archiveBulletins> = {};
    archiveBulletins.forEach((b) => {
      const year = new Date(b.weekDate).getFullYear();
      if (!groups[year]) groups[year] = [];
      groups[year].push(b);
    });
    return Object.entries(groups)
      .map(([year, items]) => ({ year: Number(year), items }))
      .sort((a, b) => b.year - a.year);
  }, [archiveBulletins]);

  const toggleYear = (year: number) => {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  };

  // For the latest bulletin, determine if it's a local /manus-storage URL or external
  const isLocalPdf = latestBulletin?.pdfUrl?.startsWith("/manus-storage/");
  // Use Google Docs viewer for external PDFs (eCatholic), direct iframe for local
  const viewerUrl = latestBulletin
    ? isLocalPdf
      ? `${latestBulletin.pdfUrl}#toolbar=1&navpanes=0`
      : `https://docs.google.com/gview?url=${encodeURIComponent(latestBulletin.pdfUrl)}&embedded=true`
    : "";

  return (
    <PageLayout>
      <section className="bg-gradient-to-b from-primary/5 to-transparent py-12 sm:py-16">
        <div className="container">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3">Weekly Bulletin</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            Read the latest parish bulletin for Mass readings, announcements, and community news.
          </p>
        </div>
      </section>

      <section className="container py-8 sm:py-12">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[500px] w-full rounded-xl" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : latestBulletin ? (
          <div className="space-y-10">
            {/* Latest Bulletin — Featured with PDF Viewer */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-medium">This Week</span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Week of {format(new Date(latestBulletin.weekDate), "MMMM d, yyyy")}
                    </span>
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold">{latestBulletin.title}</h2>
                  {latestBulletin.description && (
                    <p className="text-sm text-muted-foreground mt-1">{latestBulletin.description}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <a href={latestBulletin.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2">
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download PDF</span>
                      <span className="sm:hidden">PDF</span>
                    </Button>
                  </a>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Share2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Share</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem
                        onClick={() => {
                          navigator.clipboard.writeText(latestBulletin.pdfUrl.startsWith("http") ? latestBulletin.pdfUrl : window.location.origin + latestBulletin.pdfUrl);
                          toast.success("Link copied to clipboard");
                        }}
                      >
                        <Link2 className="w-4 h-4 mr-2" />
                        Copy PDF Link
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          const pdfLink = latestBulletin.pdfUrl.startsWith("http") ? latestBulletin.pdfUrl : window.location.origin + latestBulletin.pdfUrl;
                          const subject = encodeURIComponent(`${latestBulletin.title} — St. Patrick Church, Armonk`);
                          const body = encodeURIComponent(`Here is this week's parish bulletin from St. Patrick Church in Armonk:\n\n${pdfLink}\n\nVisit our website: ${window.location.origin}/bulletins`);
                          window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
                        }}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Share via Email
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          const pageUrl = window.location.origin + "/bulletins";
                          navigator.clipboard.writeText(pageUrl);
                          toast.success("Page link copied to clipboard");
                        }}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Page Link
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Embedded PDF Viewer */}
              <Card className="overflow-hidden border-0 shadow-lg">
                <div className="relative w-full bg-muted/30" style={{ height: "min(75vh, 800px)" }}>
                  <iframe
                    src={viewerUrl}
                    className="w-full h-full absolute inset-0 border-0"
                    title={`${latestBulletin.title} - PDF Viewer`}
                    allow="autoplay"
                  />
                </div>
              </Card>

              {/* Mobile fallback */}
              <div className="mt-3 sm:hidden text-center">
                <a href={latestBulletin.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2 w-full">
                    <ExternalLink className="w-4 h-4" />
                    Open Bulletin in New Tab
                  </Button>
                </a>
              </div>
            </div>

            {/* Subscribe CTA */}
            <BulletinSubscribeCTA />

            {/* Archive Section — Grouped by Year */}
            {archiveByYear.length > 0 && (
              <div>
                <h3 className="font-serif text-xl font-semibold mb-4 text-muted-foreground">Past Bulletins</h3>
                <div className="space-y-3">
                  {archiveByYear.map(({ year, items }) => {
                    const isExpanded = expandedYears.has(year);
                    const displayItems = isExpanded ? items : items.slice(0, 4);
                    return (
                      <div key={year}>
                        <button
                          onClick={() => toggleYear(year)}
                          className="flex items-center gap-2 w-full text-left py-2 px-1 hover:bg-muted/30 rounded-lg transition-colors"
                        >
                          <span className="font-semibold text-lg">{year}</span>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {items.length} bulletins
                          </span>
                          <span className="ml-auto">
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                          </span>
                        </button>
                        <div className="space-y-1.5 mt-1">
                          {displayItems.map((bulletin) => (
                            <a
                              key={bulletin.id}
                              href={bulletin.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group block"
                            >
                              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                                <FileText className="w-4 h-4 text-primary/70 shrink-0" />
                                <span className="flex-1 text-sm font-medium group-hover:text-primary transition-colors truncate">
                                  {format(new Date(bulletin.weekDate), "MMMM d, yyyy")}
                                </span>
                                <Download className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                              </div>
                            </a>
                          ))}
                          {!isExpanded && items.length > 4 && (
                            <button
                              onClick={() => toggleYear(year)}
                              className="text-xs text-primary font-medium px-3 py-1.5 hover:underline"
                            >
                              Show all {items.length} bulletins from {year}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card className="p-12 text-center border-dashed border-2">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Weekly Bulletin Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              The weekly parish bulletin will be posted here each Sunday. In the meantime, you can stay connected through Flocknote.
            </p>
            <a href="https://stpatarmonk.flocknote.com/home" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              Visit Flocknote for Updates →
            </a>
          </Card>
        )}
      </section>
    </PageLayout>
  );
}
