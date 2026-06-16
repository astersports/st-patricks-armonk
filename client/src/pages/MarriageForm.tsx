import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function MarriageForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    brideFirstName: "",
    brideLastName: "",
    brideEmail: "",
    bridePhone: "",
    brideReligion: "",
    brideParish: "",
    groomFirstName: "",
    groomLastName: "",
    groomEmail: "",
    groomPhone: "",
    groomReligion: "",
    groomParish: "",
    preferredDate: "",
    alternateDate: "",
    isParishioner: false,
    previousMarriage: false,
    previousMarriageDetails: "",
    guestCount: "",
    notes: "",
  });

  const submitMutation = trpc.marriage.submit.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(form);
  };

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[oklch(0.98_0.005_141)]">
        <div className="container max-w-2xl py-20">
          <Card className="text-center border-green-200">
            <CardContent className="py-16">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-700" />
              </div>
              <h2 className="font-serif text-3xl text-green-900 mb-4">Inquiry Received</h2>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Congratulations on your engagement! The parish office has received your marriage inquiry 
                and will contact you within one week to schedule an initial meeting with the priest.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 max-w-sm mx-auto">
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> Couples should begin the marriage preparation process 
                  at least 6 months before the desired wedding date.
                </p>
              </div>
              <Link href="/">
                <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.005_141)]">
      {/* Header */}
      <div className="bg-green-900 text-white py-8 sm:py-12">
        <div className="container max-w-3xl">
          <Link href="/" className="text-green-300/70 hover:text-white text-sm flex items-center gap-1 mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-800 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-green-200" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl">Marriage Inquiry</h1>
          </div>
          <p className="text-green-200 max-w-xl">
            Begin the process of celebrating your marriage at St. Patrick in Armonk. 
            Please submit this inquiry at least 6 months before your desired wedding date.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="container max-w-3xl py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Bride Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-900">Bride's Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brideFirstName">First Name *</Label>
                  <Input
                    id="brideFirstName"
                    required
                    value={form.brideFirstName}
                    onChange={(e) => updateField("brideFirstName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brideLastName">Last Name *</Label>
                  <Input
                    id="brideLastName"
                    required
                    value={form.brideLastName}
                    onChange={(e) => updateField("brideLastName", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brideEmail">Email *</Label>
                  <Input
                    id="brideEmail"
                    type="email"
                    required
                    value={form.brideEmail}
                    onChange={(e) => updateField("brideEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bridePhone">Phone *</Label>
                  <Input
                    id="bridePhone"
                    type="tel"
                    required
                    value={form.bridePhone}
                    onChange={(e) => updateField("bridePhone", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brideReligion">Religion</Label>
                  <Input
                    id="brideReligion"
                    value={form.brideReligion}
                    onChange={(e) => updateField("brideReligion", e.target.value)}
                    placeholder="e.g., Catholic"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brideParish">Current Parish</Label>
                  <Input
                    id="brideParish"
                    value={form.brideParish}
                    onChange={(e) => updateField("brideParish", e.target.value)}
                    placeholder="Parish name and city"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Groom Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-900">Groom's Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="groomFirstName">First Name *</Label>
                  <Input
                    id="groomFirstName"
                    required
                    value={form.groomFirstName}
                    onChange={(e) => updateField("groomFirstName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groomLastName">Last Name *</Label>
                  <Input
                    id="groomLastName"
                    required
                    value={form.groomLastName}
                    onChange={(e) => updateField("groomLastName", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="groomEmail">Email</Label>
                  <Input
                    id="groomEmail"
                    type="email"
                    value={form.groomEmail}
                    onChange={(e) => updateField("groomEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groomPhone">Phone</Label>
                  <Input
                    id="groomPhone"
                    type="tel"
                    value={form.groomPhone}
                    onChange={(e) => updateField("groomPhone", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="groomReligion">Religion</Label>
                  <Input
                    id="groomReligion"
                    value={form.groomReligion}
                    onChange={(e) => updateField("groomReligion", e.target.value)}
                    placeholder="e.g., Catholic"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groomParish">Current Parish</Label>
                  <Input
                    id="groomParish"
                    value={form.groomParish}
                    onChange={(e) => updateField("groomParish", e.target.value)}
                    placeholder="Parish name and city"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wedding Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-900">Wedding Details</CardTitle>
              <CardDescription>Scheduling and logistics information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Preferred Wedding Date</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={form.preferredDate}
                    onChange={(e) => updateField("preferredDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternateDate">Alternate Date</Label>
                  <Input
                    id="alternateDate"
                    type="date"
                    value={form.alternateDate}
                    onChange={(e) => updateField("alternateDate", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestCount">Estimated Guest Count</Label>
                <Select onValueChange={(v) => updateField("guestCount", v)} value={form.guestCount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-50">Under 50</SelectItem>
                    <SelectItem value="50-100">50 - 100</SelectItem>
                    <SelectItem value="100-150">100 - 150</SelectItem>
                    <SelectItem value="150-200">150 - 200</SelectItem>
                    <SelectItem value="200+">200+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="isParishioner"
                  checked={form.isParishioner}
                  onCheckedChange={(v) => updateField("isParishioner", !!v)}
                />
                <Label htmlFor="isParishioner" className="text-sm leading-relaxed cursor-pointer">
                  At least one of us is a registered parishioner of St. Patrick in Armonk
                </Label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="previousMarriage"
                  checked={form.previousMarriage}
                  onCheckedChange={(v) => updateField("previousMarriage", !!v)}
                />
                <Label htmlFor="previousMarriage" className="text-sm leading-relaxed cursor-pointer">
                  Either the bride or groom has been previously married
                </Label>
              </div>
              {form.previousMarriage && (
                <div className="space-y-2 pl-7">
                  <Label htmlFor="previousMarriageDetails">Please provide details</Label>
                  <Textarea
                    id="previousMarriageDetails"
                    value={form.previousMarriageDetails}
                    onChange={(e) => updateField("previousMarriageDetails", e.target.value)}
                    placeholder="Was an annulment obtained? Please provide relevant details."
                    rows={3}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes or Questions</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Any special requests, questions, or circumstances..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="font-semibold text-green-900 mb-2">Marriage Preparation Requirements</h3>
            <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
              <li>Couples must begin preparation at least 6 months before the wedding</li>
              <li>Pre-Cana or equivalent marriage preparation program is required</li>
              <li>Both parties must be free to marry in the Catholic Church</li>
              <li>Non-parishioner weddings are subject to availability and additional fees</li>
            </ul>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <Link href="/" className="text-green-700 hover:text-green-900 text-sm">
              ← Home
            </Link>
            <Button
              type="submit"
              size="lg"
              className="bg-green-800 hover:bg-green-900 text-white px-8"
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </div>

          {submitMutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                There was an error submitting your inquiry. Please try again or call the parish office.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
