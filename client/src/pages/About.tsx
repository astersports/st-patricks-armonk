import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useReveal } from "@/hooks/useReveal";
import { Church, Users, Heart, Cross, ArrowRight } from "lucide-react";

export default function About() {
  const revealRef = useReveal();

  return (
    <PageLayout>
      {/* Hero Header */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23166534' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container relative">
          <div className="max-w-3xl">
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-4 animate-fade-in">Est. 1924</p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              Our Parish
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-up">
              For a century, St. Patrick's has been a spiritual home for the Catholic community 
              of Armonk and surrounding areas — a place of worship, fellowship, and service.
            </p>
          </div>
        </div>
      </section>

      <div ref={revealRef}>
        {/* Parish Story */}
        <section className="container py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="reveal grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 items-start">
              <div className="space-y-4">
                <div className="bg-primary/10 p-4 rounded-2xl inline-block">
                  <Church className="w-10 h-10 text-primary" />
                </div>
                <h2 className="font-serif text-3xl font-bold text-foreground">Our History</h2>
              </div>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  The Church of St. Patrick in Armonk was established in <strong className="text-foreground">1924</strong> to serve 
                  the growing Catholic community in northern Westchester County. What began as a small mission church 
                  has grown into a vibrant parish of over 1,500 families.
                </p>
                <p>
                  Our parish has been blessed with dedicated pastors, religious, and lay leaders who have guided 
                  the community through decades of growth and change. The current church building, located at 
                  <strong className="text-foreground"> 29 Cox Avenue</strong>, stands as a testament to the faith and 
                  generosity of generations of parishioners.
                </p>
                <p>
                  Today, St. Patrick's continues to be a welcoming community rooted in the traditions of the 
                  Catholic faith while embracing the needs of modern families. Our parish is part of the 
                  <a href="https://archny.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium"> Archdiocese of New York</a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Armonk Cross */}
        <section className="bg-gradient-to-b from-secondary/50 to-transparent py-16 md:py-20">
          <div className="container">
            <div className="reveal max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 items-start">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Cross className="w-6 h-6 text-primary" />
                    <h2 className="font-serif text-3xl font-bold text-foreground">The Armonk Cross</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    In the aftermath of the September 11, 2001 attacks, a steel cross beam was recovered from 
                    the wreckage of the World Trade Center. This cross — forged in the fires of that tragic day — 
                    was brought to St. Patrick's in Armonk as a memorial to the lives lost, including members 
                    of our own parish community.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    The Armonk Cross stands on our parish grounds as a powerful symbol of faith, hope, and 
                    resilience. It reminds us that even in the darkest moments, God's love endures. The cross 
                    has become a place of prayer and reflection for parishioners and visitors alike.
                  </p>
                  <blockquote className="border-l-4 border-gold pl-4 italic text-foreground/80">
                    "We will never forget. In this cross, we find hope."
                  </blockquote>
                </div>
                <div className="bg-primary/5 rounded-2xl p-8 text-center">
                  <Cross className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="font-serif text-lg font-semibold text-foreground">September 11 Memorial</p>
                  <p className="text-sm text-muted-foreground mt-2">Parish Grounds</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="container py-16">
          <h2 className="reveal font-serif text-3xl font-bold text-foreground text-center mb-10">
            Get to Know Us
          </h2>
          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link href="/staff">
              <Card className="hover-lift cursor-pointer h-full border-0 shadow-md">
                <CardContent className="p-8 text-center">
                  <Users className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Staff & Leadership</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Meet our pastor, staff, and parish council members.
                  </p>
                  <span className="text-sm text-primary font-medium inline-flex items-center gap-1">
                    View Directory <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/parish-registration">
              <Card className="hover-lift cursor-pointer h-full border-0 shadow-md">
                <CardContent className="p-8 text-center">
                  <Heart className="w-10 h-10 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">New Parishioners</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Welcome! Register to become part of our parish family.
                  </p>
                  <span className="text-sm text-primary font-medium inline-flex items-center gap-1">
                    Register Now <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/contact">
              <Card className="hover-lift cursor-pointer h-full border-0 shadow-md">
                <CardContent className="p-8 text-center">
                  <Church className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Visit Us</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    29 Cox Ave, Armonk NY 10504. All are welcome.
                  </p>
                  <span className="text-sm text-primary font-medium inline-flex items-center gap-1">
                    Get Directions <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
