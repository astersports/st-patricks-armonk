import PageLayout from "@/components/PageLayout";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Clock, BookOpen, Calendar, Heart, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

const quickCards = [
  { icon: Clock, title: "Mass Times", description: "Weekend & weekday schedules", href: "/mass-times", color: "bg-primary" },
  { icon: BookOpen, title: "Bulletin", description: "This week's parish bulletin", href: "/bulletins", color: "bg-accent" },
  { icon: Calendar, title: "Events", description: "Upcoming parish events", href: "/news-events", color: "bg-primary" },
  { icon: Heart, title: "Give", description: "Support our parish", href: "/giving", color: "bg-accent" },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const { data: news } = trpc.news.listPublished.useQuery();
  const { data: upcomingEvents } = trpc.events.listUpcoming.useQuery();
  const subscribeMutation = trpc.subscriptions.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Successfully subscribed to parish updates!");
      setEmail("");
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/manus-storage/church-stained-glass_4e3f2e8c.jpg"
            alt="Church stained glass"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
        <div className="relative z-10 text-center text-white container animate-fade-in">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-4">Welcome to</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
            St. Patrick Church
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light mb-2">Armonk, New York</p>
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto mt-4 mb-8">
            A welcoming Catholic community rooted in faith, service, and love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/mass-times">
              <Button size="lg" className="bg-gold text-black hover:bg-gold/90 font-semibold px-8">
                View Mass Times
              </Button>
            </Link>
            <Link href="/giving">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8">
                Support Our Parish
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="container -mt-16 relative z-20 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickCards.map((card) => (
            <Link key={card.href} href={card.href}>
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`${card.color} p-3 rounded-xl text-white group-hover:scale-110 transition-transform`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest News Section */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground">Latest News</h2>
            <p className="text-muted-foreground mt-1">Stay connected with our parish community</p>
          </div>
          <Link href="/news-events">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        {news && news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.slice(0, 3).map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {post.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardContent className="p-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    {post.publishedAt ? format(new Date(post.publishedAt), "MMMM d, yyyy") : ""}
                  </p>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.excerpt || post.content.substring(0, 150)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Check back soon for parish news and announcements.</p>
          </Card>
        )}
      </section>

      {/* Upcoming Events */}
      <section className="bg-secondary/50 py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground">Upcoming Events</h2>
              <p className="text-muted-foreground mt-1">Join us in faith and fellowship</p>
            </div>
            <Link href="/news-events">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          {upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingEvents.slice(0, 4).map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex gap-4">
                    <div className="bg-primary/10 rounded-lg p-3 text-center min-w-[60px]">
                      <p className="text-xs text-primary font-medium uppercase">
                        {format(new Date(event.startDate), "MMM")}
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {format(new Date(event.startDate), "d")}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.location && `${event.location} • `}
                        {format(new Date(event.startDate), "h:mm a")}
                      </p>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No upcoming events at this time. Check back soon!</p>
            </Card>
          )}
        </div>
      </section>

      {/* Quick Links to New Features */}
      <section className="py-12 bg-green-50/50">
        <div className="container">
          <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-8">Get Involved</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/ccd-calendar">
              <Card className="p-5 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer h-full">
                <Calendar className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-1">CCD Calendar</h3>
                <p className="text-sm text-muted-foreground">View the Religious Education schedule and key dates.</p>
              </Card>
            </Link>
            <Link href="/cyo-basketball">
              <Card className="p-5 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer h-full">
                <Calendar className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-semibold text-foreground mb-1">CYO Basketball</h3>
                <p className="text-sm text-muted-foreground">Schedules, teams, and game results for all ages.</p>
              </Card>
            </Link>
            <Link href="/ccd-registration">
              <Card className="p-5 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer h-full">
                <BookOpen className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-1">CCD Registration</h3>
                <p className="text-sm text-muted-foreground">Register your child for Religious Education online.</p>
              </Card>
            </Link>
            <Link href="/volunteer">
              <Card className="p-5 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer h-full">
                <Heart className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-semibold text-foreground mb-1">Volunteer</h3>
                <p className="text-sm text-muted-foreground">Sign up to serve our parish community.</p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Flocknote + Newsletter Subscription */}
      <section className="container py-16">
        <Card className="bg-gradient-to-r from-primary to-parish-green-dark text-white overflow-hidden">
          <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-5 h-5 text-gold" />
                <span className="text-gold text-sm font-medium uppercase tracking-wider">Stay Connected</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">
                Subscribe to Parish Updates
              </h2>
              <p className="text-white/80">
                Receive weekly bulletins and news directly in your inbox.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) subscribeMutation.mutate({ email });
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50 min-w-[250px]"
                  required
                />
                <Button
                  type="submit"
                  className="bg-gold text-black hover:bg-gold/90 font-semibold whitespace-nowrap"
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
              <p className="text-white/70 text-sm mt-3">
                Or join us on{" "}
                <a href="https://stpatarmonk.flocknote.com/home" target="_blank" rel="noopener noreferrer" className="text-gold underline hover:text-gold/80">
                  Flocknote
                </a>{" "}
                for text and email updates.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </PageLayout>
  );
}
