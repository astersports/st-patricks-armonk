import PageLayout from "@/components/PageLayout";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useReveal } from "@/hooks/useReveal";
import {
  ShieldCheck,
  AlertTriangle,
  GraduationCap,
  FileCheck,
  Phone,
  ExternalLink,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

/**
 * Safe Environment / Child Protection — the parish's compliance with the
 * Archdiocese of New York Safe Environment Program. Content is grounded in
 * the Archdiocese's published child-protection guidance (archny.org); no
 * parish-specific reporting contacts are invented — reporting routes to the
 * official Archdiocesan and New York State channels.
 */
export default function SafeEnvironment() {
  const revealRef = useReveal();

  return (
    <PageLayout>
      <SEO
        title="Safe Environment & Child Protection"
        path="/safe-environment"
        description="St. Patrick in Armonk follows the Archdiocese of New York Safe Environment Program — VIRTUS training, background checks, and how to report abuse."
      />
      <PageHeader
        eyebrow="Protecting God's Children"
        title="Safe Environment"
        description="St. Patrick in Armonk is committed to the safety of every child and young person in our care, in full compliance with the Archdiocese of New York Safe Environment Program."
      />

      <div ref={revealRef}>
        {/* Report abuse — highest priority, surfaced first */}
        <section className="container py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            <Card className="reveal border-2 border-destructive/30 rounded-2xl bg-destructive/5">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">How to Report Abuse</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you believe a child is in <strong className="text-foreground">imminent danger, call 911 immediately</strong>,
                  then contact the New York State Child Abuse Hotline. To report an allegation of sexual abuse of a
                  minor by clergy, staff, or a volunteer of the Archdiocese, use the Archdiocese's confidential
                  reporting channels below. You do not need to be certain — reporting is always the right thing to do.
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                    <span className="text-foreground">
                      <strong>Emergency:</strong> 911
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                    <span className="text-foreground">
                      <strong>NYS Child Abuse Hotline:</strong>{" "}
                      <a href="tel:1-800-342-3720" className="text-primary hover:underline">1-800-342-3720</a>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ExternalLink className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                    <span className="text-foreground">
                      <strong>Archdiocese of New York — Report Abuse:</strong>{" "}
                      <a href="https://www.archny.org/report-abuse" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">archny.org/report-abuse</a>
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What the program requires */}
        <section className="bg-muted/30 py-8 sm:py-12">
          <div className="container">
            <div className="reveal max-w-4xl mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-6">
                What the Safe Environment Program Requires
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Every member of the clergy, employee, and volunteer who is in regular contact with children must
                be screened and trained before serving. This applies across our parish — religious education (CCD),
                youth ministry, CYO, and any ministry that works with minors.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-border/50 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <CardContent className="p-6">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <FileCheck className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-2">Background Check</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      No one may be in regular contact with children without first completing an authorized
                      background check and the Safe Environment questionnaire.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border border-border/50 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <CardContent className="p-6">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-2">VIRTUS Training</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Clergy and staff complete the VIRTUS <em>"Protecting God's Children"</em> class; volunteers
                      complete the online <em>"Safer Spaces"</em> training.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border border-border/50 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <CardContent className="p-6">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-2">Ongoing Supervision</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Those who serve are supervised and held to the Archdiocese's code of conduct for the
                      protection of minors and vulnerable adults.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Volunteers + resources */}
        <section className="container py-8 sm:py-12">
          <div className="reveal max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-border/50 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <CardContent className="p-6">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-3">Want to Volunteer with Youth?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Thank you for offering your time. Before serving with children, you'll complete Safer Spaces
                  training and a background check. Our Parish Office will guide you through each step.
                </p>
                <Link href="/serve" className="text-primary hover:underline font-medium text-sm inline-flex items-center gap-1">
                  Serve &amp; Volunteer <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </CardContent>
            </Card>
            <Card className="border border-border/50 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <CardContent className="p-6">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-3">Archdiocese Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://www.archny.org/child-protection" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      Child Protection Overview <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.archny.org/training" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      VIRTUS &amp; Safer Spaces Training <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </li>
                  <li className="text-muted-foreground pt-1">
                    Safe Environment Office: <a href="tel:646-794-2810" className="text-primary hover:underline">646-794-2810</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <p className="reveal text-center text-xs text-muted-foreground max-w-2xl mx-auto mt-8">
            For parish-specific questions about Safe Environment compliance, please{" "}
            <Link href="/contact" className="text-primary hover:underline">contact the Parish Office</Link>.
            St. Patrick in Armonk is a parish of the Archdiocese of New York and follows its Safe Environment policies.
          </p>
        </section>
      </div>
    </PageLayout>
  );
}
