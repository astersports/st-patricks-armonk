import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CheckCircle, Bus, Clock, Users, Heart, Shield, FileCheck } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import PageLayout from "@/components/PageLayout";

export default function CcdPermissions() {
  useReveal();
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    childFirstName: "",
    childLastName: "",
    childGrade: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    needsBusTransport: false,
    busPickupLocation: "",
    busDropoffLocation: "",
    busNotes: "",
    earlyDismissalAuthorized: false,
    earlyDismissalReason: "",
    earlyDismissalDates: "",
    authorizedPickup1Name: "",
    authorizedPickup1Phone: "",
    authorizedPickup1Relation: "",
    authorizedPickup2Name: "",
    authorizedPickup2Phone: "",
    authorizedPickup2Relation: "",
    authorizedPickup3Name: "",
    authorizedPickup3Phone: "",
    authorizedPickup3Relation: "",
    allergies: "",
    medications: "",
    medicalConditions: "",
    doctorName: "",
    doctorPhone: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    photoReleaseConsent: false,
    medicalReleaseConsent: false,
    parentSignature: "",
    signatureDate: new Date().toISOString().split("T")[0],
    schoolYear: "2026-2027",
  });

  const submitMutation = trpc.ccdPermissions.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Permission form submitted successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to submit form");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.childFirstName || !form.childLastName || !form.childGrade || !form.parentName || !form.parentPhone || !form.parentEmail || !form.authorizedPickup1Name || !form.authorizedPickup1Phone || !form.authorizedPickup1Relation || !form.emergencyContactName || !form.emergencyContactPhone || !form.emergencyContactRelation || !form.parentSignature) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!form.medicalReleaseConsent) {
      toast.error("Medical release consent is required");
      return;
    }
    submitMutation.mutate(form);
  };

  if (submitted) {
    return (
      <PageLayout>
        <div className="container py-12 sm:py-16 max-w-2xl mx-auto text-center">
          <div className="bg-primary/5 rounded-2xl p-8 sm:p-12">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">Form Submitted Successfully</h2>
            <p className="text-muted-foreground mb-6">
              Thank you! Your CCD Permission & Release form has been received. The Religious Education office will review it and contact you if any additional information is needed.
            </p>
            <Button onClick={() => { setSubmitted(false); setForm({ ...form, childFirstName: "", childLastName: "", childGrade: "" }); }}>
              Submit Another Form
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Header */}
      <section className="relative py-8 sm:py-12 md:py-16 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container">
          <Badge variant="outline" className="mb-3 text-xs">2026–2027 School Year</Badge>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2 sm:mb-3">
            CCD Permission & Release Form
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            Complete this digital form for each child enrolled in Religious Education. Covers transportation, dismissal, medical, and photo release authorizations.
          </p>
        </div>
      </section>

      <section className="container py-6 sm:py-10 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

          {/* Child Information */}
          <Card className="reveal border-l-4 border-l-primary">
            <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Users className="w-5 h-5 text-primary" />
                Child Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="childFirstName">First Name *</Label>
                  <Input id="childFirstName" value={form.childFirstName} onChange={(e) => setForm({ ...form, childFirstName: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="childLastName">Last Name *</Label>
                  <Input id="childLastName" value={form.childLastName} onChange={(e) => setForm({ ...form, childLastName: e.target.value })} required />
                </div>
              </div>
              <div>
                <Label htmlFor="childGrade">Grade (Fall 2026) *</Label>
                <Select value={form.childGrade} onValueChange={(v) => setForm({ ...form, childGrade: v })}>
                  <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                  <SelectContent>
                    {["1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade"].map(g => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                  <Input id="parentName" value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="parentEmail">Email *</Label>
                  <Input id="parentEmail" type="email" value={form.parentEmail} onChange={(e) => setForm({ ...form, parentEmail: e.target.value })} required />
                </div>
              </div>
              <div>
                <Label htmlFor="parentPhone">Phone *</Label>
                <Input id="parentPhone" type="tel" value={form.parentPhone} onChange={(e) => setForm({ ...form, parentPhone: e.target.value })} required />
              </div>
            </CardContent>
          </Card>

          {/* Bus Transportation */}
          <Card className="reveal border-l-4 border-l-blue-500">
            <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Bus className="w-5 h-5 text-blue-500" />
                Bus Transportation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <Label htmlFor="needsBus" className="cursor-pointer font-medium">My child needs bus transportation to/from CCD</Label>
                <Switch id="needsBus" checked={form.needsBusTransport} onCheckedChange={(v) => setForm({ ...form, needsBusTransport: v })} />
              </div>
              {form.needsBusTransport && (
                <div className="space-y-3 pt-2">
                  <div>
                    <Label htmlFor="busPickup">Pickup Location</Label>
                    <Input id="busPickup" value={form.busPickupLocation} onChange={(e) => setForm({ ...form, busPickupLocation: e.target.value })} placeholder="School name or address" />
                  </div>
                  <div>
                    <Label htmlFor="busDropoff">Dropoff Location</Label>
                    <Input id="busDropoff" value={form.busDropoffLocation} onChange={(e) => setForm({ ...form, busDropoffLocation: e.target.value })} placeholder="Home address or other location" />
                  </div>
                  <div>
                    <Label htmlFor="busNotes">Bus Notes (optional)</Label>
                    <Textarea id="busNotes" value={form.busNotes} onChange={(e) => setForm({ ...form, busNotes: e.target.value })} placeholder="Any special instructions for bus transportation" rows={2} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Early Dismissal */}
          <Card className="reveal border-l-4 border-l-amber-500">
            <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Clock className="w-5 h-5 text-amber-500" />
                Early Dismissal Authorization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <Label htmlFor="earlyDismissal" className="cursor-pointer font-medium">My child may need early dismissal from CCD</Label>
                <Switch id="earlyDismissal" checked={form.earlyDismissalAuthorized} onCheckedChange={(v) => setForm({ ...form, earlyDismissalAuthorized: v })} />
              </div>
              {form.earlyDismissalAuthorized && (
                <div className="space-y-3 pt-2">
                  <div>
                    <Label htmlFor="dismissalReason">Reason</Label>
                    <Input id="dismissalReason" value={form.earlyDismissalReason} onChange={(e) => setForm({ ...form, earlyDismissalReason: e.target.value })} placeholder="e.g., Sports practice, medical appointment" />
                  </div>
                  <div>
                    <Label htmlFor="dismissalDates">Specific Dates (if known)</Label>
                    <Textarea id="dismissalDates" value={form.earlyDismissalDates} onChange={(e) => setForm({ ...form, earlyDismissalDates: e.target.value })} placeholder="List dates or recurring schedule (e.g., every other Wednesday)" rows={2} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Authorized Pickup */}
          <Card className="reveal border-l-4 border-l-green-600">
            <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Shield className="w-5 h-5 text-green-600" />
                Authorized Pickup Persons
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Only listed persons may pick up your child. At least one is required.</p>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
              {/* Person 1 - Required */}
              <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                <p className="text-sm font-medium text-foreground">Person 1 (Required)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input placeholder="Full Name *" value={form.authorizedPickup1Name} onChange={(e) => setForm({ ...form, authorizedPickup1Name: e.target.value })} required />
                  <Input placeholder="Phone *" type="tel" value={form.authorizedPickup1Phone} onChange={(e) => setForm({ ...form, authorizedPickup1Phone: e.target.value })} required />
                  <Input placeholder="Relationship *" value={form.authorizedPickup1Relation} onChange={(e) => setForm({ ...form, authorizedPickup1Relation: e.target.value })} required />
                </div>
              </div>
              {/* Person 2 */}
              <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Person 2 (Optional)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input placeholder="Full Name" value={form.authorizedPickup2Name} onChange={(e) => setForm({ ...form, authorizedPickup2Name: e.target.value })} />
                  <Input placeholder="Phone" type="tel" value={form.authorizedPickup2Phone} onChange={(e) => setForm({ ...form, authorizedPickup2Phone: e.target.value })} />
                  <Input placeholder="Relationship" value={form.authorizedPickup2Relation} onChange={(e) => setForm({ ...form, authorizedPickup2Relation: e.target.value })} />
                </div>
              </div>
              {/* Person 3 */}
              <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Person 3 (Optional)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input placeholder="Full Name" value={form.authorizedPickup3Name} onChange={(e) => setForm({ ...form, authorizedPickup3Name: e.target.value })} />
                  <Input placeholder="Phone" type="tel" value={form.authorizedPickup3Phone} onChange={(e) => setForm({ ...form, authorizedPickup3Phone: e.target.value })} />
                  <Input placeholder="Relationship" value={form.authorizedPickup3Relation} onChange={(e) => setForm({ ...form, authorizedPickup3Relation: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card className="reveal border-l-4 border-l-red-500">
            <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Heart className="w-5 h-5 text-red-500" />
                Medical & Allergy Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 sm:px-6 pb-4 sm:pb-6">
              <div>
                <Label htmlFor="allergies">Allergies (food, medication, environmental)</Label>
                <Textarea id="allergies" value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} placeholder="List all known allergies or type 'None'" rows={2} />
              </div>
              <div>
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea id="medications" value={form.medications} onChange={(e) => setForm({ ...form, medications: e.target.value })} placeholder="List medications or type 'None'" rows={2} />
              </div>
              <div>
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <Textarea id="medicalConditions" value={form.medicalConditions} onChange={(e) => setForm({ ...form, medicalConditions: e.target.value })} placeholder="Asthma, diabetes, seizures, etc. or 'None'" rows={2} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="doctorName">Doctor's Name</Label>
                  <Input id="doctorName" value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="doctorPhone">Doctor's Phone</Label>
                  <Input id="doctorPhone" type="tel" value={form.doctorPhone} onChange={(e) => setForm({ ...form, doctorPhone: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input id="insuranceProvider" value={form.insuranceProvider} onChange={(e) => setForm({ ...form, insuranceProvider: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
                  <Input id="insurancePolicyNumber" value={form.insurancePolicyNumber} onChange={(e) => setForm({ ...form, insurancePolicyNumber: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="reveal border-l-4 border-l-orange-500">
            <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Shield className="w-5 h-5 text-orange-500" />
                Emergency Contact (other than parent)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="emergencyName">Name *</Label>
                  <Input id="emergencyName" value={form.emergencyContactName} onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Phone *</Label>
                  <Input id="emergencyPhone" type="tel" value={form.emergencyContactPhone} onChange={(e) => setForm({ ...form, emergencyContactPhone: e.target.value })} required />
                </div>
              </div>
              <div>
                <Label htmlFor="emergencyRelation">Relationship to Child *</Label>
                <Input id="emergencyRelation" value={form.emergencyContactRelation} onChange={(e) => setForm({ ...form, emergencyContactRelation: e.target.value })} placeholder="e.g., Grandparent, Aunt, Family Friend" required />
              </div>
            </CardContent>
          </Card>

          {/* Consents & Signature */}
          <Card className="reveal border-l-4 border-l-purple-500">
            <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <FileCheck className="w-5 h-5 text-purple-500" />
                Consents & Digital Signature
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
              {/* Photo Release */}
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <Checkbox id="photoRelease" checked={form.photoReleaseConsent} onCheckedChange={(v) => setForm({ ...form, photoReleaseConsent: v === true })} className="mt-0.5" />
                <Label htmlFor="photoRelease" className="cursor-pointer text-sm leading-relaxed">
                  <span className="font-medium">Photo/Video Release:</span> I grant permission for St. Patrick Church to photograph or video my child during CCD activities for use in parish communications, website, and social media.
                </Label>
              </div>

              {/* Medical Release */}
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <Checkbox id="medicalRelease" checked={form.medicalReleaseConsent} onCheckedChange={(v) => setForm({ ...form, medicalReleaseConsent: v === true })} className="mt-0.5" />
                <Label htmlFor="medicalRelease" className="cursor-pointer text-sm leading-relaxed">
                  <span className="font-medium">Medical Release (Required):</span> In the event of an emergency, I authorize the CCD staff to seek medical attention for my child. I understand that every effort will be made to contact me first. *
                </Label>
              </div>

              {/* Digital Signature */}
              <div className="pt-2 space-y-3">
                <div>
                  <Label htmlFor="parentSignature">Parent/Guardian Digital Signature (type full name) *</Label>
                  <Input id="parentSignature" value={form.parentSignature} onChange={(e) => setForm({ ...form, parentSignature: e.target.value })} placeholder="Type your full legal name" className="font-serif italic text-lg" required />
                </div>
                <div>
                  <Label htmlFor="signatureDate">Date *</Label>
                  <Input id="signatureDate" type="date" value={form.signatureDate} onChange={(e) => setForm({ ...form, signatureDate: e.target.value })} required />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="reveal pt-2">
            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitMutation.isPending}>
              {submitMutation.isPending ? "Submitting..." : "Submit Permission Form"}
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              By submitting this form, you confirm that all information provided is accurate. The parish office will be notified of your submission.
            </p>
          </div>
        </form>
      </section>
    </PageLayout>
  );
}
