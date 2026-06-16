import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Cross, BookOpen, Music, Users, HandHeart, Mail } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const devotions = [
  { title: "First Fridays", desc: "Exposition of the Blessed Sacrament", time: "9 AM – 7 PM", icon: Cross },
  { title: "Thursday Rosary", desc: "Rosary in the Chapel", time: "Thursdays 7:30 PM", icon: BookOpen },
  { title: "Stations of the Cross", desc: "Fridays during Lent", time: "7:30 PM", icon: Cross },
  { title: "Saturday Stations", desc: "Outside Stations of the Cross", time: "Saturdays 7:30 AM", icon: Heart },
];

const ministries = [
  { title: "Lectors", desc: "Proclaim the Word of God at Mass", icon: BookOpen },
  { title: "Eucharistic Ministers", desc: "Assist in distribution of Holy Communion", icon: HandHeart },
  { title: "Music Ministry", desc: "Enhance liturgical celebrations through song", icon: Music },
  { title: "Altar Servers", desc: "Assist the priest during Mass", icon: Cross },
  { title: "Ushers & Greeters", desc: "Welcome parishioners and visitors", icon: Users },
  { title: "Charitable Outreach", desc: "Serve those in need through community programs", icon: Heart },
];

const outreachPrograms = [
  { title: "Project Embrace", desc: "Collects and distributes clothing and necessities to families in need. Drop-off bins in the vestibule.", contact: "Lori Schiliro", email: "parishoffice@stpatricksarmonk.org" },
  { title: "FIAT (Faith In Action)", desc: "Hands-on service: meal prep for shelters, home repairs, community clean-ups.", contact: "Parish Office", email: "parishoffice@stpatricksarmonk.org" },
  { title: "Share & Care", desc: "Meals, transportation, and support for parishioners facing illness or loss.", contact: "Parish Office", email: "parishoffice@stpatricksarmonk.org" },
  { title: "Stay Connected to the Vine", desc: "Reaching out to homebound parishioners through visits, calls, and cards.", contact: "Parish Office", email: "parishoffice@stpatricksarmonk.org" },
];

export default function Ministries() {
  const revealRef = useReveal();

  return (
    <PageLayout>
      {/* Compact Header */}
      <section className="py-6 sm:py-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container">
          <p className="text-gold font-medium tracking-widest uppercase text-xs mb-1.5">Serve & Pray</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Ministries & Devotions
          </h1>
          <p className="text-sm text-muted-foreground">
            Serve the Lord and grow in holiness through our parish ministries.
          </p>
        </div>
      </section>

      <div ref={revealRef} className="container py-4 sm:py-8">
        {/* Devotions - Compact rows */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h2 className="font-serif text-lg font-bold">Devotions</h2>
          </div>
          <div className="space-y-1.5">
            {devotions.map((d) => (
              <Card key={d.title} className="reveal border-0 shadow-sm border-l-3 border-l-primary">
                <CardContent className="p-3 flex items-center gap-3">
                  <d.icon className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{d.title}</h3>
                    <p className="text-xs text-muted-foreground truncate">{d.desc}</p>
                  </div>
                  <span className="text-xs font-medium text-primary whitespace-nowrap">{d.time}</span>
                </CardContent>
              </Card>
            ))}
          </div>
          <a href="https://youtu.be/6faWBZxdE0M" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-2 ml-1 hover:underline">
            Watch Stations of the Cross video →
          </a>
        </div>

        {/* Parish Ministries - Compact rows */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-accent rounded-full" />
            <h2 className="font-serif text-lg font-bold">Parish Ministries</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-2 ml-4">Use your gifts to serve God and our community.</p>
          <div className="space-y-1.5">
            {ministries.map((m) => (
              <Card key={m.title} className="reveal border-0 shadow-sm">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <m.icon className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{m.title}</h3>
                    <p className="text-xs text-muted-foreground truncate">{m.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Charitable Outreach - Compact with email links */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-gold rounded-full" />
            <h2 className="font-serif text-lg font-bold">Charitable Outreach</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-2 ml-4">Putting our faith into action through service.</p>
          <div className="space-y-1.5">
            {outreachPrograms.map((p) => (
              <Card key={p.title} className="reveal border-0 shadow-sm border-l-3 border-l-gold/60">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{p.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{p.desc}</p>
                    </div>
                    <a href={`mailto:${p.email}`} className="shrink-0 inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline whitespace-nowrap">
                      <Mail className="w-3 h-3" />
                      {p.contact}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-primary/5 border-primary/20 border-0">
          <CardContent className="p-3 text-center">
            <p className="text-sm text-foreground">
              Interested in joining? Contact us at{" "}
              <a href="mailto:parishoffice@stpatricksarmonk.org" className="font-semibold text-primary hover:underline">parishoffice@stpatricksarmonk.org</a>
              {" "}or{" "}
              <a href="tel:9142739724" className="font-semibold text-primary hover:underline">(914) 273-9724</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
