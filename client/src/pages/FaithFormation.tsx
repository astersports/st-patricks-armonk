import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, GraduationCap, Phone, Calendar, Users, Heart, Mail } from "lucide-react";
import { Link } from "wouter";
import { useReveal } from "@/hooks/useReveal";
import PageHeader from "@/components/PageHeader";

export default function FaithFormation() {
  const revealRef = useReveal();

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Growing in Faith"
        title="Faith Formation"
        description="Programs for all ages to deepen your relationship with Christ."
      />

      <div ref={revealRef}>
        <section className="container py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
            {/* Main Content — Accordion */}
            <div className="lg:col-span-2">
              {/* Status Banner */}
              <div className="reveal bg-accent/8 border border-accent/15 rounded-xl p-4 mb-6 flex items-center gap-3">
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

              <Accordion type="single" collapsible className="space-y-2.5">
                {/* CCD */}
                <AccordionItem
                  value="ccd"
                  className="reveal border border-border/50 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] border-l-3 border-l-[oklch(0.44_0.12_160)]"
                >
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-5 hover:no-underline">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-primary/10 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0">
                        <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <span className="font-serif text-base sm:text-lg font-semibold text-foreground">Religious Education (CCD)</span>
                          <Badge className="bg-primary/10 text-primary border-0 text-xs px-1.5 py-0 shrink-0">Grades 1–8</Badge>
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
                        <h4 className="font-semibold text-base mb-1">Grades 1–4</h4>
                        <p className="text-sm text-muted-foreground">Weekly classes covering Catholic doctrine, sacraments, and prayer. Mon/Wed afternoons.</p>
                      </div>
                      <div className="p-3.5 rounded-lg bg-secondary/50">
                        <h4 className="font-semibold text-base mb-1">Grades 5–8</h4>
                        <p className="text-sm text-muted-foreground">Continued formation plus Confirmation preparation. Mon/Wed evenings.</p>
                      </div>
                    </div>
                    <Link href="/ccd-registration" className="text-sm text-primary hover:underline font-medium">Register for CCD →</Link>
                  </AccordionContent>
                </AccordionItem>

                {/* RCIA */}
                <AccordionItem
                  value="rcia"
                  className="reveal border border-border/50 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] border-l-3 border-l-[oklch(0.75_0.15_85)]"
                >
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-5 hover:no-underline">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-accent/10 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <span className="font-serif text-base sm:text-lg font-semibold text-foreground">RCIA</span>
                          <Badge className="bg-accent/15 text-accent-foreground border-0 text-xs px-1.5 py-0 shrink-0">Adults</Badge>
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
                      Contact: <a href="mailto:parishoffice@stpatricksarmonk.org" className="text-primary hover:underline font-medium inline-flex items-center gap-1"><Mail className="w-3 h-3" />Parish Office</a> or call <a href="tel:9142739724" className="text-primary hover:underline font-medium">(914) 273-9724</a>.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* Walking With Purpose */}
                <AccordionItem
                  value="wwp"
                  className="reveal border border-border/50 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] border-l-3 border-l-[oklch(0.55_0.15_25)]"
                >
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-5 hover:no-underline">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-accent/10 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <span className="font-serif text-base sm:text-lg font-semibold text-foreground">Walking With Purpose</span>
                          <Badge className="bg-accent/15 text-accent-foreground border-0 text-xs px-1.5 py-0 shrink-0">Women</Badge>
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
                      Sessions meet weekly during the school year. Contact: <a href="mailto:parishoffice@stpatricksarmonk.org" className="text-primary hover:underline font-medium inline-flex items-center gap-1"><Mail className="w-3 h-3" />Parish Office</a> or call <a href="tel:9142739724" className="text-primary hover:underline font-medium">(914) 273-9724</a>.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* Adult Faith Formation */}
                <AccordionItem
                  value="adult"
                  className="reveal border border-border/50 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] border-l-3 border-l-[oklch(0.5_0.12_250)]"
                >
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-5 hover:no-underline">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-primary/10 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0">
                        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
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
                  className="reveal border border-border/50 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] border-l-3 border-l-[oklch(0.65_0.2_25)]"
                >
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-5 hover:no-underline">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-primary/10 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <span className="font-serif text-base sm:text-lg font-semibold text-foreground">Blaze</span>
                          <Badge variant="outline" className="text-xs px-1.5 py-0 border-primary/30 text-primary shrink-0">7th & 8th Grade Girls</Badge>
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
                      Contact: <a href="mailto:parishoffice@stpatricksarmonk.org" className="text-primary hover:underline font-medium inline-flex items-center gap-1"><Mail className="w-3 h-3" />Religious Ed Office</a> or call <a href="tel:9145311759" className="text-primary hover:underline">(914) 531-1759</a>.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Sidebar */}
            <div className="reveal space-y-3">
              <Card className="bg-primary text-white shadow-lg border-0">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gold shrink-0" />
                    <div>
                      <h3 className="font-semibold text-sm">Religious Education Office</h3>
                      <p className="text-white/80 text-xs">For registration and program inquiries:</p>
                    </div>
                  </div>
                  <a href="tel:9145311759" className="font-bold text-sm mt-1.5 block hover:text-gold transition-colors">(914) 531-1759</a>
                  <a href="mailto:parishoffice@stpatricksarmonk.org" className="text-xs text-white/80 hover:text-gold mt-0.5 block transition-colors">parishoffice@stpatricksarmonk.org</a>
                </CardContent>
              </Card>

              <Card className="hover-glow transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <h3 className="font-semibold text-sm">CCD Calendar</h3>
                      <p className="text-muted-foreground text-xs">Class schedule, key dates, and special events.</p>
                    </div>
                  </div>
                  <Link href="/calendar?filter=ccd" className="text-xs text-primary hover:underline font-medium mt-2 block">View CCD Calendar →</Link>
                </CardContent>
              </Card>

              <Card className="bg-accent/10 border-accent/20 hover-glow transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-accent shrink-0" />
                    <div>
                      <h3 className="font-semibold text-sm">FORMED</h3>
                      <p className="text-muted-foreground text-xs">Free Catholic content — movies, shows, audiobooks, and more.</p>
                    </div>
                  </div>
                  <a
                    href="https://stpatrickinarmonk.formed.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-primary hover:underline mt-2 block"
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
