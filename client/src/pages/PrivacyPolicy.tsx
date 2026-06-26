import PageLayout from "@/components/PageLayout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { useReveal } from "@/hooks/useReveal";
import PageHeader from "@/components/PageHeader";

/**
 * Privacy Policy — how the parish handles information submitted through the
 * site's digital forms, with explicit care for children's data (CCD,
 * sacrament records). Aligned with the forms-rehost spec §6 (minimize,
 * staff-only access, secure storage, stated retention).
 */
export default function PrivacyPolicy() {
  const revealRef = useReveal();

  return (
    <PageLayout>
      <SEO
        title="Privacy Policy"
        path="/privacy"
        description="How St. Patrick in Armonk collects, uses, and protects information submitted through our website, including special care for children's data."
      />
      <PageHeader
        eyebrow="Your Information"
        title="Privacy Policy"
        description="How we collect, use, and protect the information you share with us through this website."
      />

      <div ref={revealRef}>
        <section className="container py-8 sm:py-12">
          <div className="reveal max-w-3xl mx-auto space-y-8 text-muted-foreground leading-relaxed">
            <p className="text-sm text-muted-foreground/80">Last updated: June 2026</p>

            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground">What We Collect</h2>
              <p>
                We collect only the information you choose to provide through our digital forms — for example,
                names and contact details for parish registration, sacrament requests, religious-education (CCD)
                enrollment, Mass intentions, and volunteer sign-ups. We ask only for what is needed to act on
                your request. We do not sell your information, and we do not share it for advertising.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground">Children's Information</h2>
              <p>
                Some forms collect information about minors (CCD registration, sacrament records, permission and
                medical/allergy details). This information is treated with special care: it is stored securely,
                accessible only to authorized parish staff who need it to administer the program, and never made
                public. Documents you upload (such as certificates) are stored in encrypted storage and shared
                with staff through secure, access-controlled links — never posted publicly or attached to
                plain-text email.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground">How We Use It</h2>
              <p>
                We use your information solely to respond to your request and administer parish life — for
                example, to process a registration, schedule a sacrament, contact you about a program your child
                is enrolled in, or follow up on a volunteer offer. Where a form indicates it, we may send you
                related parish communications; you can unsubscribe from those at any time.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground">How We Protect It</h2>
              <p>
                Form submissions are transmitted over a secure connection and stored in access-controlled
                systems. Only authorized parish staff can view submissions; the public can never read another
                person's submission. We apply the data-protection practices of the Archdiocese of New York and
                review access regularly.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground">How Long We Keep It</h2>
              <p>
                We retain information only as long as needed to serve its purpose — generally for the duration of
                the relevant program or sacramental cycle — after which it is archived or securely disposed of in
                line with parish and Archdiocesan record-keeping practice. Sacramental records are retained
                permanently as required by canon law.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground">Your Choices</h2>
              <p>
                You may ask us to review, correct, or delete information you've submitted (subject to records we
                are required to keep). To make a request, or if you have any question about this policy, please{" "}
                <Link href="/contact" className="text-primary hover:underline">contact the Parish Office</Link>.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground">Child Protection</h2>
              <p>
                Protecting children is more than a data question. See our{" "}
                <Link href="/safe-environment" className="text-primary hover:underline">Safe Environment</Link>{" "}
                page for how the parish complies with the Archdiocese of New York Safe Environment Program and how
                to report a concern.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
