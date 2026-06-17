import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Trash2, FileText, PenLine, Eye, ChevronDown, ChevronRight } from "lucide-react";
import { BulletinEditor } from "./BulletinEditor";

export function BulletinManager() {
  const utils = trpc.useUtils();
  const { data: bulletins, isLoading } = trpc.bulletins.listAll.useQuery();
  const deleteMutation = trpc.bulletins.delete.useMutation({ onSuccess: () => { utils.bulletins.listAll.invalidate(); toast.success("Bulletin deleted"); } });
  const updateMutation = trpc.bulletins.update.useMutation({ onSuccess: () => { utils.bulletins.listAll.invalidate(); toast.success("Bulletin updated"); } });
  const uploadMutation = trpc.bulletins.uploadPdf.useMutation();

  const [mode, setMode] = useState<"list" | "compose" | "upload">("list");
  const [editingId, setEditingId] = useState<number | undefined>();

  // Group bulletins by year
  const groupedByYear = useMemo(() => {
    if (!bulletins) return [];
    const groups: Record<number, typeof bulletins> = {};
    for (const b of bulletins) {
      const year = new Date(b.weekDate).getFullYear();
      if (!groups[year]) groups[year] = [];
      groups[year].push(b);
    }
    // Sort years descending
    return Object.entries(groups)
      .map(([year, items]) => ({ year: Number(year), items }))
      .sort((a, b) => b.year - a.year);
  }, [bulletins]);

  // Current year is expanded by default, older years collapsed
  const currentYear = new Date().getFullYear();
  const [collapsedYears, setCollapsedYears] = useState<Set<number>>(new Set());

  const toggleYear = (year: number) => {
    setCollapsedYears(prev => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  };

  if (mode === "compose") {
    return <BulletinEditor bulletinId={editingId} onBack={() => { setMode("list"); setEditingId(undefined); }} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Weekly Bulletins</h2>
        <div className="flex gap-2">
          <Button onClick={() => { setEditingId(undefined); setMode("compose"); }} className="gap-2">
            <PenLine className="w-4 h-4" /> Compose Bulletin
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : groupedByYear.length > 0 ? (
        <div className="space-y-4">
          {groupedByYear.map(({ year, items }) => {
            const isCollapsed = year !== currentYear && !collapsedYears.has(year)
              ? true
              : collapsedYears.has(year);
            // Current year: expanded by default (collapsed only if user toggled)
            // Older years: collapsed by default (expanded only if user toggled)
            const isExpanded = year === currentYear ? !collapsedYears.has(year) : collapsedYears.has(year);

            return (
              <div key={year}>
                <button
                  onClick={() => toggleYear(year)}
                  className="flex items-center gap-2 w-full text-left py-2 px-1 rounded-md hover:bg-muted/50 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="font-semibold text-base">{year}</span>
                  <Badge variant="secondary" className="text-xs ml-1">
                    {items.length} {items.length === 1 ? "bulletin" : "bulletins"}
                  </Badge>
                  {year === currentYear && (
                    <Badge variant="outline" className="text-xs text-primary border-primary/30">Current</Badge>
                  )}
                </button>

                {isExpanded && (
                  <div className="space-y-3 mt-2 ml-1">
                    {items.map((bulletin) => (
                      <Card key={bulletin.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-4 flex items-center gap-4">
                          <FileText className="w-8 h-8 text-primary shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold truncate">{bulletin.title}</h3>
                              <Badge variant={bulletin.published ? "default" : "secondary"}>
                                {bulletin.published ? "Published" : "Draft"}
                              </Badge>
                              {bulletin.sourceHtml && <Badge variant="outline" className="text-xs">Composed</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Week of {format(new Date(bulletin.weekDate), "MMM d, yyyy")}
                            </p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            {bulletin.sourceHtml && (
                              <Button size="sm" variant="outline" onClick={() => { setEditingId(bulletin.id); setMode("compose"); }}>
                                <PenLine className="w-4 h-4" />
                              </Button>
                            )}
                            {!bulletin.published && (
                              <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ id: bulletin.id, published: true })}>
                                Publish
                              </Button>
                            )}
                            {bulletin.pdfUrl && bulletin.pdfUrl !== "placeholder" && (
                              <a href={bulletin.pdfUrl} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                              </a>
                            )}
                            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate({ id: bulletin.id })}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No bulletins yet. Compose your first one or upload a PDF.</p>
          <Button onClick={() => setMode("compose")} className="gap-2">
            <PenLine className="w-4 h-4" /> Compose Your First Bulletin
          </Button>
        </Card>
      )}
    </div>
  );
}
