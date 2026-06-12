import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { MapView } from "@/components/Map";
import { useCallback } from "react";
import { useReveal } from "@/hooks/useReveal";

export default function Contact() {
  const revealRef = useReveal();

  const handleMapReady = useCallback((map: google.maps.Map) => {
    const position = { lat: 41.1268, lng: -73.7140 };
    map.setCenter(position);
    map.setZoom(15);
    new google.maps.Marker({
      position,
      map,
      title: "St. Patrick Church, Armonk",
    });
  }, []);

  return (
    <PageLayout>
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3 animate-fade-in">Get in Touch</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in">
              Contact Us
            </h1>
            <p className="text-lg text-muted-foreground animate-fade-up">
              We would love to hear from you. Reach out to our parish office for any inquiries.
            </p>
          </div>
        </div>
      </section>

      <div ref={revealRef}>
        <section className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="reveal space-y-6">
              <Card className="border-t-4 border-t-primary shadow-sm">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Parish Office</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2.5 rounded-xl shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <p className="text-muted-foreground">
                        Church of St. Patrick<br />
                        29 Cox Ave, Armonk NY 10504<br />
                        P.O. Box 6
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2.5 rounded-xl shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-muted-foreground">
                        Parish Office: <a href="tel:9142739724" className="text-primary hover:underline">(914) 273-9724</a><br />
                        Cell: <a href="tel:9145311760" className="text-primary hover:underline">(914) 531-1760</a><br />
                        Religious Ed: <a href="tel:9145311759" className="text-primary hover:underline">(914) 531-1759</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2.5 rounded-xl shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Office Hours</h3>
                      <p className="text-muted-foreground">
                        Monday – Thursday: 10:00 AM – 5:00 PM<br />
                        Friday: Closed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2.5 rounded-xl shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Stay Connected</h3>
                      <p className="text-muted-foreground">
                        <a href="https://new.flocknote.com/stpatarmonk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          Join us on Flocknote
                        </a>{" "}
                        for parish communications.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Directions */}
              <Card className="hover-glow transition-all">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Directions</h3>
                  <p className="text-muted-foreground text-sm">
                    St. Patrick Church is located on Cox Avenue in Armonk, NY. 
                    The church is easily accessible from Route 22 and I-684.
                  </p>
                  <a
                    href="https://www.google.com/maps/dir//29+Cox+Ave,+Armonk,+NY+10504"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-sm font-medium text-primary hover:underline"
                  >
                    Get Directions →
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Map */}
            <div className="reveal h-[500px] lg:h-auto min-h-[400px] rounded-xl overflow-hidden shadow-lg border">
              <MapView onMapReady={handleMapReady} className="w-full h-full" />
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
