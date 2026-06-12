import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Cross, BookOpen, Music, Users, HandHeart } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const devotions = [
  {
    title: "First Fridays",
    description: "Exposition of the Blessed Sacrament",
    time: "9:00 AM – 7:00 PM",
    icon: Cross,
  },
  {
    title: "Thursday Rosary",
    description: "Rosary in the Chapel",
    time: "Every Thursday at 7:30 PM",
    icon: BookOpen,
  },
  {
    title: "Stations of the Cross (Lent)",
    description: "Fridays during Lent",
    time: "7:30 PM",
    icon: Cross,
  },
  {
    title: "Saturday Stations of the Cross",
    description: "Outside Stations of the Cross",
    time: "Every Saturday at 7:30 AM",
    icon: Heart,
  },
];

const ministries = [
  {
    title: "Lectors",
    description: "Proclaim the Word of God at Mass through Scripture readings.",
    icon: BookOpen,
  },
  {
    title: "Eucharistic Ministers",
    description: "Assist in the distribution of Holy Communion during Mass.",
    icon: HandHeart,
  },
  {
    title: "Music Ministry",
    description: "Enhance our liturgical celebrations through song and music.",
    icon: Music,
  },
  {
    title: "Altar Servers",
    description: "Assist the priest during Mass and other liturgical celebrations.",
    icon: Cross,
  },
  {
    title: "Ushers & Greeters",
    description: "Welcome parishioners and visitors, assist with seating and collections.",
    icon: Users,
  },
  {
    title: "Charitable Outreach",
    description: "Serve those in need through various community service programs.",
    icon: Heart,
  },
];

export default function Ministries() {
  const revealRef = useReveal();

  return (
    <PageLayout>
      <section className="relative py-10 sm:py-16 md:py-20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-gold font-medium tracking-widest uppercase text-xs sm:text-sm mb-2 sm:mb-3 animate-fade-in">Serve & Pray</p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 animate-fade-in">
              Ministries & Devotions
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground animate-fade-up">
              Serve the Lord and grow in holiness through our parish ministries and devotional practices.
            </p>
          </div>
        </div>
      </section>

      <div ref={revealRef}>
        <section className="container py-8 sm:py-12">
          {/* Devotions */}
          <div className="reveal mb-10 sm:mb-16">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-5 sm:h-6 bg-primary rounded-full" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Devotions</h2>
            </div>
            <p className="text-muted-foreground mb-5 sm:mb-8 ml-4 text-sm sm:text-base">Regular opportunities for prayer and spiritual growth.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {devotions.map((devotion) => (
                <Card key={devotion.title} className="hover-glow transition-all">
                  <CardContent className="p-4 sm:p-6 flex gap-3 sm:gap-4">
                    <div className="bg-primary/10 p-2 sm:p-3 rounded-xl shrink-0">
                      <devotion.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-lg">{devotion.title}</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm">{devotion.description}</p>
                      <p className="text-primary font-medium text-xs sm:text-sm mt-0.5 sm:mt-1">{devotion.time}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="mt-4 bg-secondary/50 border-0">
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Stations of the Cross video:</strong>{" "}
                  <a href="https://youtu.be/6faWBZxdE0M" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Watch here →
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Ministries */}
          <div className="reveal">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-5 sm:h-6 bg-accent rounded-full" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Parish Ministries</h2>
            </div>
            <p className="text-muted-foreground mb-5 sm:mb-8 ml-4 text-sm sm:text-base">Use your gifts to serve God and our community.</p>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {ministries.map((ministry) => (
                <Card key={ministry.title} className="hover-lift group shadow-sm">
                  <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-accent/10 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl group-hover:bg-accent/20 transition-colors">
                        <ministry.icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                      </div>
                      <CardTitle className="text-xs sm:text-lg">{ministry.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
                    <p className="text-muted-foreground text-[10px] sm:text-sm hidden sm:block">{ministry.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="mt-8 bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <p className="text-foreground">
                  Interested in joining a ministry? Contact the parish office at{" "}
                  <a href="tel:9142739724" className="font-semibold text-primary hover:underline">(914) 273-9724</a>
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
