import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Cross, CheckCircle2, ArrowLeft, Phone } from "lucide-react";
import { Link } from "wouter";

export default function FuneralForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    plannerName: "",
    plannerEmail: "",
    plannerPhone: "",
    plannerRelation: "",
    deceasedName: "",
    isPrePlanning: false,
    preferredDate: "",
    massType: "funeral_mass" as "funeral_mass" | "memorial_mass" | "vigil_service" | "graveside",
    firstReading: "",
    secondReading: "",
    gospel: "",
    hymns: "",
    eulogist: "",
    pallbearers: "",
    specialRequests: "",
  });

  const submitMutation = trpc.funeral.submit.useMutation({
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
              <h2 className="font-serif text-3xl text-green-900 mb-4">Form Received</h2>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {form.isPrePlanning
                  ? "Your pre-planning form has been received. This information will be kept on file and can be updated at any time by contacting the parish office."
                  : "We are sorry for your loss. The parish office has received your form and will contact you shortly to finalize arrangements."}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-sm mx-auto">
                <p className="text-sm text-blue-800">
                  <strong>Parish Office:</strong> (914) 273-9724<br />
                  Monday – Thursday, 10:00 AM – 5:00 PM
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
              <Cross className="w-6 h-6 text-green-200" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl">Funeral Planning</h1>
          </div>
          <p className="text-green-200 max-w-xl">
            Use this form to plan a funeral liturgy or to pre-plan your own funeral arrangements. 
            The parish office will work with you to create a meaningful celebration of life.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="container max-w-3xl py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-900">Contact Information</CardTitle>
              <CardDescription>Person completing this form</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plannerName">Your Full Name *</Label>
                  <Input
                    id="plannerName"
                    required
                    value={form.plannerName}
                    onChange={(e) => updateField("plannerName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plannerRelation">Relationship to Deceased</Label>
                  <Input
                    id="plannerRelation"
                    value={form.plannerRelation}
                    onChange={(e) => updateField("plannerRelation", e.target.value)}
                    placeholder="e.g., Spouse, Child, Self (pre-planning)"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plannerEmail">Email *</Label>
                  <Input
                    id="plannerEmail"
                    type="email"
                    required
                    value={form.plannerEmail}
                    onChange={(e) => updateField("plannerEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plannerPhone">Phone *</Label>
                  <Input
                    id="plannerPhone"
                    type="tel"
                    required
                    value={form.plannerPhone}
                    onChange={(e) => updateField("plannerPhone", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deceasedName">Name of Deceased (or Self if pre-planning) *</Label>
                <Input
                  id="deceasedName"
                  required
                  value={form.deceasedName}
                  onChange={(e) => updateField("deceasedName", e.target.value)}
                />
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="isPrePlanning"
                  checked={form.isPrePlanning}
                  onCheckedChange={(v) => updateField("isPrePlanning", !!v)}
                />
                <Label htmlFor="isPrePlanning" className="text-sm leading-relaxed cursor-pointer">
                  This is a <strong>pre-planning</strong> form (no immediate need — planning ahead)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Service Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-900">Service Details</CardTitle>
              <CardDescription>Type of service and scheduling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="massType">Type of Service *</Label>
                  <Select onValueChange={(v: any) => updateField("massType", v)} value={form.massType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="funeral_mass">Funeral Mass</SelectItem>
                      <SelectItem value="memorial_mass">Memorial Mass</SelectItem>
                      <SelectItem value="vigil_service">Vigil Service</SelectItem>
                      <SelectItem value="graveside">Graveside Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Preferred Date</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={form.preferredDate}
                    onChange={(e) => updateField("preferredDate", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liturgy Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-900">Liturgy Preferences</CardTitle>
              <CardDescription>
                These are optional. The parish can provide suggested readings and hymns if you prefer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstReading">First Reading Preference</Label>
                <Input
                  id="firstReading"
                  value={form.firstReading}
                  onChange={(e) => updateField("firstReading", e.target.value)}
                  placeholder="e.g., Wisdom 3:1-9 or 'The souls of the just are in the hand of God'"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondReading">Second Reading Preference</Label>
                <Input
                  id="secondReading"
                  value={form.secondReading}
                  onChange={(e) => updateField("secondReading", e.target.value)}
                  placeholder="e.g., Romans 8:31-39"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gospel">Gospel Preference</Label>
                <Input
                  id="gospel"
                  value={form.gospel}
                  onChange={(e) => updateField("gospel", e.target.value)}
                  placeholder="e.g., John 14:1-6 'In my Father's house there are many rooms'"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hymns">Hymn Preferences</Label>
                <Textarea
                  id="hymns"
                  value={form.hymns}
                  onChange={(e) => updateField("hymns", e.target.value)}
                  placeholder="List any preferred hymns (e.g., Amazing Grace, Be Not Afraid, On Eagle's Wings)"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-900">Participants</CardTitle>
              <CardDescription>People involved in the service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eulogist">Eulogist (person giving eulogy)</Label>
                <Input
                  id="eulogist"
                  value={form.eulogist}
                  onChange={(e) => updateField("eulogist", e.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pallbearers">Pallbearers</Label>
                <Textarea
                  id="pallbearers"
                  value={form.pallbearers}
                  onChange={(e) => updateField("pallbearers", e.target.value)}
                  placeholder="List pallbearer names (typically 6), one per line"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialRequests">Special Requests or Notes</Label>
                <Textarea
                  id="specialRequests"
                  value={form.specialRequests}
                  onChange={(e) => updateField("specialRequests", e.target.value)}
                  placeholder="Any special requests, cultural traditions, or additional information..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Phone className="w-4 h-4" />
              <span>Immediate need? Call (914) 273-9724</span>
            </div>
            <Button
              type="submit"
              size="lg"
              className="bg-green-800 hover:bg-green-900 text-white px-8"
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? "Submitting..." : "Submit Form"}
            </Button>
          </div>

          {submitMutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                There was an error submitting your form. Please try again or call the parish office directly.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
