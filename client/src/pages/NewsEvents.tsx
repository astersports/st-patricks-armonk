import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Newspaper, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";

export default function NewsEvents() {
  const { data: news, isLoading: newsLoading } = trpc.news.listPublished.useQuery();
  const { data: events, isLoading: eventsLoading } = trpc.events.listUpcoming.useQuery();

  return (
    <PageLayout>
      <section className="bg-gradient-to-b from-primary/5 to-transparent py-16">
        <div className="container">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">News & Events</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Stay informed about parish happenings, announcements, and upcoming events.
          </p>
        </div>
      </section>

      <section className="container py-12">
        <Tabs defaultValue="news" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="news" className="gap-2">
              <Newspaper className="w-4 h-4" /> News & Announcements
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="w-4 h-4" /> Upcoming Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news">
            {newsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}><CardContent className="p-6"><Skeleton className="h-6 w-3/4 mb-3" /><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-2/3" /></CardContent></Card>
                ))}
              </div>
            ) : news && news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {news.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    {post.imageUrl && (
                      <div className="h-48 overflow-hidden">
                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                        {post.publishedAt ? format(new Date(post.publishedAt), "MMMM d, yyyy") : ""}
                      </p>
                      <h3 className="font-serif text-xl font-semibold mb-3">{post.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {post.excerpt || post.content.substring(0, 200)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Newspaper className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No News Yet</h3>
                <p className="text-muted-foreground">Check back soon for parish announcements and news.</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="events">
            {eventsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}><CardContent className="p-6"><Skeleton className="h-6 w-1/2 mb-3" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
                ))}
              </div>
            ) : events && events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex gap-6">
                      <div className="bg-primary/10 rounded-xl p-4 text-center min-w-[80px] flex flex-col justify-center">
                        <p className="text-xs text-primary font-medium uppercase">
                          {format(new Date(event.startDate), "MMM")}
                        </p>
                        <p className="text-3xl font-bold text-primary">
                          {format(new Date(event.startDate), "d")}
                        </p>
                        <p className="text-xs text-primary/70">
                          {format(new Date(event.startDate), "yyyy")}
                        </p>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-xl font-semibold mb-2">{event.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {format(new Date(event.startDate), "h:mm a")}
                            {event.endDate && ` – ${format(new Date(event.endDate), "h:mm a")}`}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {event.location}
                            </span>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-muted-foreground">{event.description}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Upcoming Events</h3>
                <p className="text-muted-foreground">Check back soon for parish events and activities.</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </PageLayout>
  );
}
