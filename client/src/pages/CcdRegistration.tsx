import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, BookOpen } from "lucide-react";

export default function CcdRegistration() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    parentFirstName: "",
    parentLastName: "",
    parentEmail: "",
    parentPhone: "",
    address: "",
    childFirstName: "",
    childLastName: "",
    childDob: "",
    grade: "",
    baptized: false,
    baptismChurch: "",
    firstCommunion: false,
    schoolYear: "2026-2027",
    notes: "",
    reminderOptIn: true,
  });

  const registerMutation = trpc.ccd.register.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Registration submitted successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit registration");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.parentFirstName || !form.parentLastName || !form.parentEmail || !form.parentPhone || !form.address || !form.childFirstName || !form.childLastName || !form.childDob || !form.grade) {
      toast.error("Please fill in all required fields");
      return;
    }
    registerMutation.mutate(form);
  };

  if (submitted) {
    return (
      <PageLayout>
        <section className="py-20">
          <div className="container max-w-xl text-center">
            <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-serif text-3xl text-foreground mb-4">Registration Submitted!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for registering your child for CCD at St. Patrick in Armonk. Our Religious Education office will review your submission and contact you with confirmation and class details.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              If you have any questions, please contact us at{" "}
              <a href="mailto:reled@stpatrickinarmonk.org" className="text-primary hover:underline">
                reled@stpatrickinarmonk.org
              </a>
            </p>
            <Button onClick={() => { setSubmitted(false); setForm({ parentFirstName: "", parentLastName: "", parentEmail: "", parentPhone: "", address: "", childFirstName: "", childLastName: "", childDob: "", grade: "", baptized: false, baptismChurch: "", firstCommunion: false, schoolYear: "2026-2027", notes: "", reminderOptIn: true }); }}>
              Register Another Child
            </Button>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Page Header — refined */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-primary/[0.04] to-transparent">
        <div className="container">
          <p className="text-gold font-bold tracking-[0.2em] uppercase text-[11px] mb-2 animate-fade-in">Religious Education</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2.5 animate-fade-in leading-tight">CCD Registration</h1>
          <p className="text-sm text-muted-foreground max-w-md animate-fade-up">
            Register your child for Religious Education classes at St. Patrick in Armonk for the 2026–2027 school year.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-10">
        <div className="container max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Parent/Guardian Info */}
            <Card className="p-6">
              <h2 className="font-serif text-xl text-foreground mb-4 pb-2 border-b border-border">Parent/Guardian Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parentFirstName">First Name *</Label>
                  <Input id="parentFirstName" value={form.parentFirstName} onChange={e => setForm({ ...form, parentFirstName: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="parentLastName">Last Name *</Label>
                  <Input id="parentLastName" value={form.parentLastName} onChange={e => setForm({ ...form, parentLastName: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="parentEmail">Email *</Label>
                  <Input id="parentEmail" type="email" value={form.parentEmail} onChange={e => setForm({ ...form, parentEmail: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="parentPhone">Phone *</Label>
                  <Input id="parentPhone" type="tel" value={form.parentPhone} onChange={e => setForm({ ...form, parentPhone: e.target.value })} required />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Home Address *</Label>
                  <Input id="address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Street, City, State, ZIP" required />
                </div>
              </div>
            </Card>

            {/* Child Info */}
            <Card className="p-6">
              <h2 className="font-serif text-xl text-foreground mb-4 pb-2 border-b border-border">Child Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="childFirstName">Child's First Name *</Label>
                  <Input id="childFirstName" value={form.childFirstName} onChange={e => setForm({ ...form, childFirstName: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="childLastName">Child's Last Name *</Label>
                  <Input id="childLastName" value={form.childLastName} onChange={e => setForm({ ...form, childLastName: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="childDob">Date of Birth *</Label>
                  <Input id="childDob" type="date" value={form.childDob} onChange={e => setForm({ ...form, childDob: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="grade">Grade (Fall 2026) *</Label>
                  <Select value={form.grade} onValueChange={v => setForm({ ...form, grade: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Grade</SelectItem>
                      <SelectItem value="2">2nd Grade (First Communion Prep)</SelectItem>
                      <SelectItem value="3">3rd Grade</SelectItem>
                      <SelectItem value="4">4th Grade</SelectItem>
                      <SelectItem value="5">5th Grade</SelectItem>
                      <SelectItem value="6">6th Grade</SelectItem>
                      <SelectItem value="7">7th Grade</SelectItem>
                      <SelectItem value="8">8th Grade (Confirmation Prep)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Sacramental Info */}
            <Card className="p-6">
              <h2 className="font-serif text-xl text-foreground mb-4 pb-2 border-b border-border">Sacramental Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Checkbox id="baptized" checked={form.baptized} onCheckedChange={(v) => setForm({ ...form, baptized: !!v })} />
                  <Label htmlFor="baptized" className="cursor-pointer">Child has been baptized</Label>
                </div>
                {form.baptized && (
                  <div className="ml-7">
                    <Label htmlFor="baptismChurch">Church of Baptism</Label>
                    <Input id="baptismChurch" value={form.baptismChurch} onChange={e => setForm({ ...form, baptismChurch: e.target.value })} placeholder="Name and location of church" />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Checkbox id="firstCommunion" checked={form.firstCommunion} onCheckedChange={(v) => setForm({ ...form, firstCommunion: !!v })} />
                  <Label htmlFor="firstCommunion" className="cursor-pointer">Child has received First Communion</Label>
                </div>
              </div>
            </Card>

            {/* Additional Notes */}
            <Card className="p-6">
              <h2 className="font-serif text-xl text-foreground mb-4 pb-2 border-b border-border">Additional Information</h2>
              <div>
                <Label htmlFor="notes">Notes or Special Needs (optional)</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any allergies, learning needs, or other information we should know..."
                  rows={4}
                />
              </div>
            </Card>

            {/* Email Reminders */}
            <Card className="p-6">
              <h2 className="font-serif text-xl text-foreground mb-4 pb-2 border-b border-border">Class Reminders</h2>
              <div className="flex items-start gap-3">
                <Checkbox id="reminderOptIn" checked={form.reminderOptIn} onCheckedChange={(v) => setForm({ ...form, reminderOptIn: !!v })} />
                <div>
                  <Label htmlFor="reminderOptIn" className="cursor-pointer">Send me email reminders before CCD classes</Label>
                  <p className="text-sm text-muted-foreground mt-1">You'll receive an email reminder 1-2 days before each scheduled class or special event. You can unsubscribe at any time.</p>
                </div>
              </div>
            </Card>

            {/* Submit */}
            <div className="flex flex-col items-center gap-3">
              <Button type="submit" size="lg" className="w-full md:w-auto px-12" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? "Submitting..." : "Submit Registration"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                By submitting this form, you are registering your child for CCD classes at St. Patrick in Armonk.
                The Religious Education office will follow up with confirmation.
              </p>
            </div>
          </form>
        </div>
      </section>
    </PageLayout>
  );
}
