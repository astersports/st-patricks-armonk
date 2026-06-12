import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Heart, ExternalLink } from "lucide-react";

export default function TeenLife() {
  return (
    <PageLayout>
      {/* Page Header */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12 border-b border-primary/10">
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="font-serif text-4xl md:text-5xl text-foreground">Teen Life</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A vibrant community for teens at St. Patrick's — faith, fellowship, and fun.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-5xl">
          {/* Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-lg text-foreground mb-2">Community</h3>
              <p className="text-sm text-muted-foreground">
                Build lasting friendships with other Catholic teens in a supportive environment.
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-lg text-foreground mb-2">Events</h3>
              <p className="text-sm text-muted-foreground">
                Regular gatherings, retreats, service projects, and social events throughout the year.
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-lg text-foreground mb-2">Service</h3>
              <p className="text-sm text-muted-foreground">
                Opportunities to give back to the community and grow in faith through service.
              </p>
            </Card>
          </div>

          {/* Sign Up Form */}
          <Card className="p-6 md:p-8 mb-8">
            <h2 className="font-serif text-2xl text-foreground mb-4">Join Teen Life</h2>
            <p className="text-muted-foreground mb-6">
              Interested in joining our Teen Life program? Fill out the registration form below to get started. Open to all high school students (grades 9–12).
            </p>
            <div className="aspect-[4/3] md:aspect-[16/9] w-full rounded-lg overflow-hidden border border-border">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLScDOJYawP1yS-Q9H4RTSEgYr1M4peL7lEQR-_E3Kxo6N57AmQ/viewform?embedded=true"
                className="w-full h-full border-0"
                title="Teen Life Registration Form"
              >
                Loading form...
              </iframe>
            </div>
          </Card>

          {/* Additional Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-serif text-lg text-foreground mb-3">Meeting Schedule</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Teen Life meets regularly throughout the school year. Check the parish calendar for upcoming events and gatherings.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/parish-calendar">View Calendar</a>
              </Button>
            </Card>
            <Card className="p-6">
              <h3 className="font-serif text-lg text-foreground mb-3">Contact</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                For questions about Teen Life, contact the parish youth ministry office.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/contact">Contact Us</a>
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
