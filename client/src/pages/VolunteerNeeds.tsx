/**
 * VolunteerNeeds — Public "Needs Board" page.
 * Shows urgent volunteer needs with one-click signup.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { SEO } from "@/components/SEO";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { HandHeart, Clock, Users, AlertTriangle } from "lucide-react";

const urgencyColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-red-100 text-red-800",
};

const urgencyLabels = {
  low: "Flexible",
  medium: "Needed Soon",
  high: "Urgent",
};

export default function VolunteerNeeds() {
  const { data: needs, isLoading } = trpc.volunteerNeeds.list.useQuery();

  return (
    <PageLayout>
      <SEO
        title="Volunteer Needs Board"
        description="See current volunteer needs at St. Patrick in Armonk. Sign up to help with one click."
      />
      <div className="container max-w-4xl py-10">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Help Your Parish
          </p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">
            Volunteer Needs Board
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Your parish needs you! Browse current needs and sign up to help with a single click.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-40" />
              </Card>
            ))}
          </div>
        ) : !needs || needs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <HandHeart className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-medium mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">
                No urgent volunteer needs right now. Check back soon or visit our{" "}
                <a href="/volunteer" className="text-primary hover:underline">
                  volunteer page
                </a>{" "}
                for ongoing opportunities.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {needs.map((need) => (
              <NeedCard key={need.id} need={need} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function NeedCard({ need }: { need: any }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const utils = trpc.useUtils();
  const respond = trpc.volunteerNeeds.respond.useMutation({
    onSuccess: () => {
      toast.success("Thank you! Your response has been recorded.");
      setOpen(false);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      utils.volunteerNeeds.list.invalidate();
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const spotsRemaining = need.spotsNeeded - need.spotsFilled;
  const isFull = spotsRemaining <= 0;

  return (
    <Card className="relative overflow-hidden">
      {need.urgency === "high" && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{need.title}</CardTitle>
          <Badge className={urgencyColors[need.urgency as keyof typeof urgencyColors]} variant="secondary">
            {need.urgency === "high" && <AlertTriangle className="w-3 h-3 mr-1" />}
            {urgencyLabels[need.urgency as keyof typeof urgencyLabels]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {need.description && (
          <p className="text-sm text-muted-foreground">{need.description}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {need.neededBy && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              By {new Date(need.neededBy).toLocaleDateString()}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {isFull ? "Full" : `${spotsRemaining} spot${spotsRemaining !== 1 ? "s" : ""} left`}
          </span>
        </div>
        {need.category && (
          <Badge variant="outline" className="text-xs">{need.category}</Badge>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full mt-2"
              disabled={isFull}
              size="sm"
            >
              <HandHeart className="w-4 h-4 mr-2" />
              {isFull ? "All Spots Filled" : "I Can Help"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sign Up to Help: {need.title}</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                respond.mutate({
                  needId: need.id,
                  name,
                  email,
                  phone: phone || undefined,
                  message: message || undefined,
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium">Name *</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Message (optional)</label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} />
              </div>
              <Button type="submit" className="w-full" disabled={respond.isPending}>
                {respond.isPending ? "Submitting..." : "Confirm Sign Up"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
