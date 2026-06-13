import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Download, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function Bulletins() {
  const { data: bulletins, isLoading } = trpc.bulletins.listPublished.useQuery();

  return (
    <PageLayout>
      <section className="bg-gradient-to-b from-primary/5 to-transparent py-16">
        <div className="container">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">Weekly Bulletin</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Download the latest parish bulletin for Mass readings, announcements, and community news.
          </p>
        </div>
      </section>

      <section className="container py-12">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}><CardContent className="p-6"><Skeleton className="h-6 w-1/2 mb-3" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
            ))}
          </div>
        ) : bulletins && bulletins.length > 0 ? (
          <div className="space-y-4">
            {bulletins.map((bulletin, index) => (
              <Card key={bulletin.id} className={`hover:shadow-md transition-shadow ${index === 0 ? "border-l-4 border-l-primary" : ""}`}>
                <CardContent className="p-6 flex items-center gap-6">
                  <div className={`${index === 0 ? "bg-primary" : "bg-primary/10"} rounded-xl p-4 shrink-0`}>
                    <FileText className={`w-8 h-8 ${index === 0 ? "text-white" : "text-primary"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {index === 0 && (
                        <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-medium">Latest</span>
                      )}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Week of {format(new Date(bulletin.weekDate), "MMMM d, yyyy")}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">{bulletin.title}</h3>
                    {bulletin.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{bulletin.description}</p>
                    )}
                  </div>
                  <a href={bulletin.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant={index === 0 ? "default" : "outline"} className="shrink-0 gap-2">
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download PDF</span>
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Bulletins Available</h3>
            <p className="text-muted-foreground">The weekly bulletin will be posted here each week.</p>
          </Card>
        )}
      </section>
    </PageLayout>
  );
}
