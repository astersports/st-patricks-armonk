import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ExternalLink, QrCode, CreditCard } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import PageHeader from "@/components/PageHeader";

export default function Giving() {
  const revealRef = useReveal();

  return (
    <PageLayout>
      {/* Page Header — refined */}
      <PageHeader
        eyebrow="Stewardship"
        title="Online Giving"
        description="Your generous support sustains our parish community and its mission."
      />

      <div ref={revealRef}>
        <section className="container py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* WeShare — compact */}
            <Card className="reveal border border-border/50 border-t-3 border-t-primary shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-xl">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <CreditCard className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold">WeShare Online Giving</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Set up recurring or one-time contributions through our secure platform. Manage donations, view history, and adjust contributions anytime.
                </p>
                <div className="bg-secondary/50 rounded-lg p-3 mb-4">
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2"><span className="text-primary text-xs">●</span> Recurring weekly or monthly donations</li>
                    <li className="flex items-center gap-2"><span className="text-primary text-xs">●</span> One-time special contributions</li>
                    <li className="flex items-center gap-2"><span className="text-primary text-xs">●</span> Donate to specific funds (offertory, maintenance)</li>
                    <li className="flex items-center gap-2"><span className="text-primary text-xs">●</span> View and download giving history</li>
                  </ul>
                </div>
                <a
                  href="http://stpatrickinarmonk.churchgiving.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full gap-2 press-scale" size="default">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Give via WeShare
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Venmo — compact */}
            <Card className="reveal border border-border/50 border-t-3 border-t-accent shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-xl">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="bg-accent/10 p-2 rounded-lg">
                    <QrCode className="w-4 h-4 text-accent" />
                  </div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold">Venmo</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Scan the QR code below with your phone camera or Venmo app to send your donation directly.
                </p>
                <div className="bg-secondary/50 rounded-lg p-4 flex flex-col items-center">
                  <div className="bg-white p-3 rounded-lg shadow-sm border">
                    <img
                      src="/manus-storage/venmo-qr_0815b899.png"
                      alt="Venmo QR Code for St. Patrick in Armonk"
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2.5 text-center">
                    Scan with your phone camera or Venmo app
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Other Ways to Give — compact */}
          <Card className="reveal mt-5 sm:mt-8 bg-primary/[0.04] border border-primary/15 rounded-xl">
            <CardContent className="p-4 sm:p-5 text-center">
              <Heart className="w-6 h-6 text-primary mx-auto mb-2" />
              <h3 className="font-serif text-base sm:text-lg font-semibold mb-1.5">Other Ways to Give</h3>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                Prefer contribution envelopes? Contact the parish office at{" "}
                <a href="tel:9142739724" className="font-semibold text-primary hover:underline">(914) 273-9724</a>.
              </p>
            </CardContent>
          </Card>

          {/* Cardinals Appeal — compact */}
          <Card className="reveal mt-5 sm:mt-8 border border-border/50 border-t-3 border-t-[#c41e3a] shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-xl">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex flex-col items-center sm:items-start flex-1">
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#c41e3a] mb-2">2026 Cardinals Appeal</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-center sm:text-left">
                    The Cardinals Appeal funds the educational, charitable, and pastoral outreach of our diocese, making Christ known to the world.
                  </p>
                </div>
                <div className="flex flex-col items-center shrink-0">
                  <div className="bg-white p-2.5 rounded-lg shadow-sm border">
                    <img
                      src="/manus-storage/cardinals_appeal_qr_1b687357.png"
                      alt="2026 Cardinals Appeal QR Code"
                      className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">Scan to donate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageLayout>
  );
}
