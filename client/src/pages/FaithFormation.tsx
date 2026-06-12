import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, Phone, Calendar, Users, Heart } from "lucide-react";
import { Link } from "wouter";
import { useReveal } from "@/hooks/useReveal";

export default function FaithFormation() {
  const revealRef = useReveal();

  return (
    <PageLayout>
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3 animate-fade-in">Grow in Faith</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in">
              Faith Formation
            </h1>
            <p className="text-lg text-muted-foreground animate-fade-up">
              Growing in faith together — Religious Education programs for children, youth, and adults.
            </p>
          </div>
        </div>
      </section>

      <div ref={revealRef}>
        <section className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* CCD Registration */}
              <Card className="reveal border-t-4 border-t-primary shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2.5 rounded-xl">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="font-serif text-2xl">Religious Education (CCD)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                    <p className="font-semibold text-accent-foreground">
                      CCD Registration for 2026–27 is Now Open!
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <Link href="/ccd-registration" className="text-primary hover:underline font-medium">Register online now →</Link> or contact the Religious Education Office.
                    </p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Our Religious Education program provides faith formation for children from 
                    first grade through Confirmation. Classes are designed to help young people 
                    grow in their understanding of the Catholic faith and develop a personal 
                    relationship with Jesus Christ.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="p-4 rounded-xl bg-secondary/50 hover-glow transition-all">
                      <h4 className="font-semibold mb-1">Grades 1–6</h4>
                      <p className="text-sm text-muted-foreground">Weekly classes covering Catholic doctrine, sacraments, and prayer.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50 hover-glow transition-all">
                      <h4 className="font-semibold mb-1">Sacramental Preparation</h4>
                      <p className="text-sm text-muted-foreground">First Reconciliation, First Communion, and Confirmation programs.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* RCIA */}
              <Card className="reveal shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-accent/10 p-2.5 rounded-xl">
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    <CardTitle className="font-serif text-2xl">RCIA</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    The Rite of Christian Initiation of Adults (RCIA) is a process for adults who wish 
                    to become Catholic or complete their sacraments of initiation. If you are interested 
                    in learning more about the Catholic faith, please contact the parish office.
                  </p>
                </CardContent>
              </Card>

              {/* Walking With Purpose */}
              <Card className="reveal shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-accent/10 p-2.5 rounded-xl">
                      <Heart className="w-5 h-5 text-accent" />
                    </div>
                    <CardTitle className="font-serif text-2xl">Walking With Purpose</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Walking With Purpose is a women's Catholic Bible study program that aims to bring women 
                    to a deeper personal relationship with Jesus Christ. Through personal study and small 
                    group discussions, participants grow in faith and fellowship.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Sessions meet weekly during the school year. New participants are always welcome. 
                    Contact the parish office at <a href="tel:9142739724" className="text-primary hover:underline font-medium">(914) 273-9724</a> for current schedule and registration information.
                  </p>
                </CardContent>
              </Card>

              {/* Adult Faith Formation */}
              <Card className="reveal shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2.5 rounded-xl">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="font-serif text-2xl">Adult Faith Formation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Deepen your faith through Bible study, book discussions, and spiritual enrichment programs. 
                    Visit <a href="https://stpatrickinarmonk.formed.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">FORMED.org</a> for 
                    free access to Catholic movies, shows, audiobooks, and more.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="reveal space-y-6">
              <Card className="bg-primary text-white shadow-lg">
                <CardContent className="p-6">
                  <Phone className="w-8 h-8 text-gold mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Religious Education Office</h3>
                  <p className="text-white/80 text-sm mb-3">For registration and program inquiries:</p>
                  <a href="tel:9145311759" className="font-bold text-lg hover:text-gold transition-colors">(914) 531-1759</a>
                </CardContent>
              </Card>

              <Card className="hover-glow transition-all">
                <CardContent className="p-6">
                  <Calendar className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-lg mb-2">CCD Calendar</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    View the full Religious Education class schedule, key dates, and special events.
                  </p>
                  <Link href="/ccd-calendar" className="text-sm text-primary hover:underline font-medium">View CCD Calendar →</Link>
                </CardContent>
              </Card>

              <Card className="bg-accent/10 border-accent/20 hover-glow transition-all">
                <CardContent className="p-6">
                  <BookOpen className="w-8 h-8 text-accent mb-3" />
                  <h3 className="font-semibold text-lg mb-2">FORMED</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    Free Catholic content — movies, shows, audiobooks, and more.
                  </p>
                  <a
                    href="https://stpatrickinarmonk.formed.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Visit FORMED →
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
