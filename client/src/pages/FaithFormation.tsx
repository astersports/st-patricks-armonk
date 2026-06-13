import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, GraduationCap, Phone, Calendar, Users, Heart } from "lucide-react";
import { Link } from "wouter";
import { useReveal } from "@/hooks/useReveal";

export default function FaithFormation() {
  const revealRef = useReveal();

  return (
    <PageLayout>
      <section className="relative py-10 sm:py-16 md:py-20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-gold font-medium tracking-widest uppercase text-xs sm:text-sm mb-2 sm:mb-3 animate-fade-in">Grow in Faith</p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 animate-fade-in">
              Faith Formation
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground animate-fade-up">
              Growing in faith together — Religious Education programs for children, youth, and adults.
            </p>
          </div>
        </div>
      </section>

      <div ref={revealRef}>
        <section className="container py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
            {/* Main Content — Accordion */}
            <div className="lg:col-span-2">
              {/* Status Banner */}
              <div className="reveal bg-accent/10 border border-accent/20 rounded-xl p-4 mb-8 flex items-center gap-3">
                <Badge className="bg-accent text-white border-0 text-[10px] px-2 py-0.5 shrink-0">Open</Badge>
                <div>
                  <p className="font-semibold text-accent-foreground text-sm">
                    CCD Registration for 2026–27 is Now Open!
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <Link href="/ccd-registration" className="text-primary hover:underline font-medium">Register online now →</Link> or contact the Religious Education Office.
                  </p>
                </div>
              </div>

              <Accordion type="single" collapsible defaultValue="ccd" className="space-y-4">
                {/* CCD */}
                <AccordionItem
                  value="ccd"
                  className="reveal border border-border/60 rounded-xl overflow-hidden shadow-sm hover-glow transition-all border-l-4 border-l-[oklch(0.42_0.12_150)]"
                >
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-5 hover:no-underline">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-primary/10 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0">
                        <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base sm:text-lg font-semibold text-foreground">Religious Education (CCD)</span>
                          <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0">Grades 1–8</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">Weekly classes for children and sacramental preparation</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Our Religious Education program provides faith formation for children from 
                      first grade through Confirmation. Classes are designed to help young people 
                      grow in their understanding of the Catholic faith and develop a personal 
                      relationship with Jesus Christ.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="p-3.5 rounded-lg bg-secondary/50">
                        <h4 className="font-semibold text-sm mb-1">Grades 1–6</h4>
                        <p className="text-xs text-muted-foreground">Weekly classes covering Catholic doctrine, sacraments, and prayer.</p>
                      </div>
                      <div className="p-3.5 rounded-lg bg-secondary/50">
                        <h4 className="font-semibold text-sm mb-1">Sacramental Preparation</h4>
                        <p className="text-xs text-muted-foreground">First Reconciliation, First Communion, and Confirmation programs.</p>
                      </div>
                    </div>
                    <Link href="/ccd-registration" className="text-sm text-primary hover:underline font-medium">Register for CCD →</Link>
                  </AccordionContent>
                </AccordionItem>

                {/* RCIA */}
                <AccordionItem
                  value="rcia"
                  className="reveal border border-border/60 rounded-xl overflow-hidden shadow-sm hover-glow transition-all border-l-4 border-l-[oklch(0.75_0.15_85)]"
                >
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-5 hover:no-underline">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-accent/10 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base sm:text-lg font-semibold text-foreground">RCIA</span>
                          <Badge className="bg-accent/15 text-accent-foreground border-0 text-[10px] px-1.5 py-0">Adults</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">Rite of Christian Initiation of Adults</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      The Rite of Christian Initiation of Adults (RCIA) is a process for adults who wish 
                      to become Catholic or complete their sacraments of initiation. Whether you are exploring 
                      the Catholic faith for the first time or returning after time away, RCIA provides a 
                      welcoming community of inquiry and formation.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Contact the parish office at <a href="tel:9142739724" className="text-primary hover:underline font-medium">(914) 273-9724</a> to learn more.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* Walking With Purpose */}
                <AccordionItem
                  value="wwp"
                  className="reveal border border-border/60 rounded-xl overflow-hidden shadow-sm hover-glow transition-all border-l-4 border-l-[oklch(0.55_0.15_25)]"
                >
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-5 hover:no-underline">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-accent/10 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base sm:text-lg font-semibold text-foreground">Walking With Purpose</span>
                          <Badge className="bg-accent/15 text-accent-foreground border-0 text-[10px] px-1.5 py-0">Women</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">Catholic women's Bible study program</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Walking With Purpose is a women's Catholic Bible study program that aims to bring women 
                      to a deeper personal relationship with Jesus Christ. Through personal study and small 
                      group discussions, participants grow in faith and fellowship.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sessions meet weekly during the school year. New participants are always welcome. 
                      Contact the parish office at <a href="tel:9142739724" className="text-primary hover:underline font-medium">(914) 273-9724</a> for current schedule.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* Adult Faith Formation */}
                <AccordionItem
                  value="adult"
                  className="reveal border border-border/60 rounded-xl overflow-hidden shadow-sm hover-glow transition-all border-l-4 border-l-[oklch(0.5_0.12_250)]"
                >
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-5 hover:no-underline">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-primary/10 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0">
                        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base sm:text-lg font-semibold text-foreground">Adult Faith Formation</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">Bible study, book discussions, and spiritual enrichment</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Deepen your faith through Bible study, book discussions, and spiritual enrichment programs 
                      offered throughout the year. Our adult programs are designed for parishioners at every 
                      stage of their faith journey.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Visit <a href="https://stpatrickinarmonk.formed.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">FORMED.org</a> for 
                      free access to Catholic movies, shows, audiobooks, and more.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* Blaze */}
                <AccordionItem
                  value="blaze"
                  className="reveal border border-border/60 rounded-xl overflow-hidden shadow-sm hover-glow transition-all border-l-4 border-l-[oklch(0.65_0.2_25)]"
                >
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-5 hover:no-underline">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-primary/10 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base sm:text-lg font-semibold text-foreground">Blaze</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary">7th & 8th Grade Girls</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">Walking With Purpose youth ministry for young women</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Blaze is the youth ministry arm of Walking With Purpose, designed specifically for 7th and 8th grade girls. Through engaging Bible studies, small group discussions, and fellowship, young women grow in their Catholic faith and build lasting friendships rooted in Christ.
                    </p>
                    <h4 className="font-semibold text-foreground mb-2">What to Expect</h4>
                    <ul className="space-y-1.5 text-sm text-muted-foreground mb-4 ml-4">
                      <li className="flex gap-2"><span className="text-primary">&bull;</span>Age-appropriate Bible study curriculum</li>
                      <li className="flex gap-2"><span className="text-primary">&bull;</span>Small group discussions led by adult mentors</li>
                      <li className="flex gap-2"><span className="text-primary">&bull;</span>Fellowship activities and service projects</li>
                      <li className="flex gap-2"><span className="text-primary">&bull;</span>Meets during the school year (typically bi-weekly)</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">
                      For more information or to register your daughter, contact the Religious Education Office at <a href="tel:9142739724" className="text-primary hover:underline">(914) 273-9724</a>.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Sidebar */}
            <div className="reveal space-y-5">
              <Card className="bg-primary text-white shadow-lg border-0">
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
