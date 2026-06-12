import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Heart, Calendar, Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";

function SignupDialog({ opportunity, onSuccess }: { opportunity: any; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const signupMutation = trpc.volunteer.signup.useMutation({
    onSuccess: () => {
      toast.success("You're signed up! Thank you for volunteering.");
      setOpen(false);
      setName("");
      setEmail("");
      setPhone("");
      setNotes("");
      onSuccess();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to sign up");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please provide your name and email");
      return;
    }
    signupMutation.mutate({
      opportunityId: opportunity.id,
      name,
      email,
      phone: phone || undefined,
      notes: notes || undefined,
    });
  };

  const spotsLeft = opportunity.spotsAvailable - opportunity.spotsFilled;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={spotsLeft <= 0}>
          {spotsLeft <= 0 ? "Full" : "Sign Up"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Volunteer for: {opportunity.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="vol-name">Your Name *</Label>
            <Input id="vol-name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="vol-email">Email *</Label>
            <Input id="vol-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="vol-phone">Phone (optional)</Label>
            <Input id="vol-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="vol-notes">Notes (optional)</Label>
            <Textarea id="vol-notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any relevant experience or availability notes..." rows={3} />
          </div>
          <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
            {signupMutation.isPending ? "Signing up..." : "Confirm Sign-Up"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Volunteer() {
  const { data: opportunities, isLoading, refetch } = trpc.volunteer.listOpportunities.useQuery();

  return (
    <PageLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-green-50 to-white py-12 border-b-4 border-primary">
        <div className="container">
          <div className="flex items-center gap-3 mb-3">
            <Heart className="w-8 h-8 text-accent" />
            <h1 className="font-serif text-4xl md:text-5xl text-foreground">Volunteer</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Share your time and talents with our parish community. Sign up for volunteer opportunities below.
          </p>
        </div>
      </section>

      {/* Opportunities */}
      <section className="py-10">
        <div className="container">
          <h2 className="font-serif text-2xl text-foreground mb-6">Current Opportunities</h2>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : !opportunities || opportunities.length === 0 ? (
            <Card className="p-12 text-center">
              <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-serif text-xl text-foreground mb-2">No Opportunities Listed</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                There are no volunteer opportunities posted at this time. Check back soon, or contact the parish office to learn about ways to serve.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {opportunities.map(opp => {
                const spotsLeft = opp.spotsAvailable - opp.spotsFilled;
                return (
                  <Card key={opp.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-foreground text-lg">{opp.title}</h3>
                        {opp.ministry && (
                          <Badge variant="secondary" className="shrink-0 ml-2">{opp.ministry}</Badge>
                        )}
                      </div>
                      {opp.description && (
                        <p className="text-sm text-muted-foreground mb-3">{opp.description}</p>
                      )}
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                        {opp.eventDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(opp.eventDate), "MMM d, yyyy")}
                          </span>
                        )}
                        {opp.startTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {opp.startTime}{opp.endTime ? ` – ${opp.endTime}` : ""}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <span className="text-xs text-muted-foreground">
                        {opp.spotsFilled}/{opp.spotsAvailable} volunteers signed up
                      </span>
                      <SignupDialog opportunity={opp} onSuccess={() => refetch()} />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* General Volunteer Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-green-50/50">
              <h3 className="font-serif text-lg text-foreground mb-3">Ways to Serve</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Liturgical Ministries (Lectors, Eucharistic Ministers, Altar Servers)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>CCD Catechist or Classroom Aide</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Parish Events (Fundraisers, Dinners, Festivals)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Outreach and Community Service</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>CYO Coaching and Team Support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Music Ministry and Choir</span>
                </li>
              </ul>
            </Card>
            <Card className="p-6 bg-green-50/50">
              <h3 className="font-serif text-lg text-foreground mb-3">Contact Us</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Interested in volunteering but don't see the right opportunity? Contact the parish office and we'll help you find the perfect way to serve.
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Phone:</strong> <a href="tel:9142731414" className="text-primary hover:underline">(914) 273-1414</a></p>
                <p><strong>Email:</strong> <a href="mailto:office@stpatrickinarmonk.org" className="text-primary hover:underline">office@stpatrickinarmonk.org</a></p>
              </div>
              <div className="mt-4">
                <a href="https://stpatarmonk.flocknote.com/home" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">Join Flocknote for Updates</Button>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
