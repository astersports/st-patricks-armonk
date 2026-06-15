import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper } from "lucide-react";
import { format } from "date-fns";
import { useReveal } from "@/hooks/useReveal";

const accentColors = [
  "border-l-[oklch(0.42_0.12_150)]",
  "border-l-[oklch(0.75_0.15_85)]",
  "border-l-[oklch(0.5_0.12_250)]",
  "border-l-[oklch(0.55_0.15_25)]",
];

export default function NewsEvents() {
  const { data: news, isLoading: newsLoading } = trpc.news.listPublished.useQuery();
  const revealRef = useReveal();

  return (
    <PageLayout>
      <section className="relative py-10 sm:py-16 md:py-20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container">
          <p className="text-gold font-medium tracking-widest uppercase text-xs sm:text-sm mb-2 sm:mb-3 animate-fade-in">Stay Informed</p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 animate-fade-in">News & Announcements</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl animate-fade-up">
            Stay informed about parish happenings, announcements, and community updates.
          </p>
        </div>
      </section>

      <div ref={revealRef}>
        <section className="container py-8 sm:py-12">
          {newsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}><CardContent className="p-6"><Skeleton className="h-6 w-3/4 mb-3" /><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-2/3" /></CardContent></Card>
              ))}
            </div>
          ) : news && news.length > 0 ? (
            <div className="space-y-4">
              {news.map((post, idx) => (
                <Card key={post.id} className={`reveal overflow-hidden hover-glow transition-all border-l-4 ${accentColors[idx % accentColors.length]}`}>
                  <CardContent className="p-6 flex gap-5">
                    {post.imageUrl && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 hidden sm:block">
                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        {idx === 0 && <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0">Latest</Badge>}
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                          {post.publishedAt ? format(new Date(post.publishedAt), "MMMM d, yyyy") : ""}
                        </p>
                      </div>
                      <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">{post.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {post.excerpt || post.content.substring(0, 200)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border-dashed border-2 bg-secondary/20">
              <Newspaper className="w-10 h-10 text-primary/30 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Parish News Coming Soon</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-3">
                Announcements, event recaps, and community updates will appear here. Stay tuned!
              </p>
              <a href="https://stpatricksarmonk.flocknote.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                Follow us on Flocknote →
              </a>
            </Card>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
