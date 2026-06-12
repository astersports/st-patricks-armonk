import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Cross, BookOpen, Music, Users, HandHeart } from "lucide-react";

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
  return (
    <PageLayout>
      <section className="bg-gradient-to-b from-primary/5 to-transparent py-16">
        <div className="container">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">Ministries & Devotions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Serve the Lord and grow in holiness through our parish ministries and devotional practices.
          </p>
        </div>
      </section>

      <section className="container py-12">
        {/* Devotions */}
        <div className="mb-16">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Devotions</h2>
          <p className="text-muted-foreground mb-8">Regular opportunities for prayer and spiritual growth.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devotions.map((devotion) => (
              <Card key={devotion.title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                    <devotion.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{devotion.title}</h3>
                    <p className="text-muted-foreground text-sm">{devotion.description}</p>
                    <p className="text-primary font-medium text-sm mt-1">{devotion.time}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-4 bg-secondary/50">
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                <strong>Stations of the Cross video:</strong>{" "}
                <a href="https://youtu.be/6faWBZxdE0M" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Watch here
                </a>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ministries */}
        <div>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Parish Ministries</h2>
          <p className="text-muted-foreground mb-8">Use your gifts to serve God and our community.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((ministry) => (
              <Card key={ministry.title} className="hover:shadow-md transition-shadow group">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-accent/10 p-2 rounded-lg group-hover:bg-accent/20 transition-colors">
                      <ministry.icon className="w-5 h-5 text-accent" />
                    </div>
                    <CardTitle className="text-lg">{ministry.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{ministry.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <p className="text-foreground">
                Interested in joining a ministry? Contact the parish office at{" "}
                <span className="font-semibold text-primary">(914) 273-9724</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}
