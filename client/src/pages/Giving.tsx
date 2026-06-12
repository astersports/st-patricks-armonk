import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ExternalLink, QrCode, CreditCard } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

export default function Giving() {
  const revealRef = useReveal();

  return (
    <PageLayout>
      <section className="relative py-10 sm:py-16 md:py-20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-gold font-medium tracking-widest uppercase text-xs sm:text-sm mb-2 sm:mb-3 animate-fade-in">Stewardship</p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 animate-fade-in">
              Online Giving
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground animate-fade-up">
              Your generous support sustains our parish community and its mission. Thank you for your stewardship.
            </p>
          </div>
        </div>
      </section>

      <div ref={revealRef}>
        <section className="container py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
            {/* WeShare */}
            <Card className="reveal border-t-4 border-t-primary shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-xl">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="font-serif text-2xl">WeShare Online Giving</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Set up a recurring or one-time contribution through WeShare, our secure online giving platform. 
                  You can manage your donations, view your giving history, and adjust your contributions at any time.
                </p>
                <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-medium">With WeShare you can:</p>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Set up recurring weekly or monthly donations</li>
                    <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Make one-time special contributions</li>
                    <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Donate to specific funds (offertory, maintenance, etc.)</li>
                    <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> View and download your giving history</li>
                  </ul>
                </div>
                <a
                  href="http://stpatrickinarmonk.churchgiving.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full gap-2 mt-4 press-scale" size="lg">
                    <ExternalLink className="w-4 h-4" />
                    Give via WeShare
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Venmo */}
            <Card className="reveal border-t-4 border-t-accent shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-accent/10 p-2.5 rounded-xl">
                    <QrCode className="w-5 h-5 text-accent" />
                  </div>
                  <CardTitle className="font-serif text-2xl">Venmo</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  You can also make contributions via Venmo. Simply scan the QR code below with your phone's camera 
                  or the Venmo app to send your donation directly to St. Patrick Church.
                </p>
                <div className="bg-secondary/50 rounded-xl p-6 flex flex-col items-center">
                  <div className="bg-white p-4 rounded-xl shadow-sm border">
                    <img
                      src="/manus-storage/venmo-qr_0815b899.png"
                      alt="Venmo QR Code for St. Patrick Church"
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Scan with your phone camera or Venmo app
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <Card className="reveal mt-5 sm:mt-8 bg-primary/5 border-primary/20">
            <CardContent className="p-5 sm:p-8 text-center">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-primary mx-auto mb-3 sm:mb-4" />
              <h3 className="font-serif text-lg sm:text-xl font-semibold mb-2">Other Ways to Give</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                If you prefer to use contribution envelopes or have questions about giving, 
                please contact the parish office at <a href="tel:9142739724" className="font-semibold text-primary hover:underline">(914) 273-9724</a>.
              </p>
            </CardContent>
          </Card>

          {/* Cardinals Appeal */}
          <Card className="reveal mt-5 sm:mt-8 shadow-sm">
            <CardContent className="p-5 sm:p-8">
              <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-center">2026 Cardinal's Appeal</h3>
              <p className="text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
                The Cardinal's Appeal exists to fund the vast educational, charitable, and pastoral outreach 
                of our diocese, all of which serve to make Christ known to the world.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageLayout>
  );
}
