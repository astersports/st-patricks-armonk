import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplets, CheckCircle2, Phone, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function BaptismForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    childFirstName: "",
    childLastName: "",
    childDob: "",
    childGender: "",
    fatherName: "",
    motherName: "",
    parentEmail: "",
    parentPhone: "",
    address: "",
    godparentName1: "",
    godparentName2: "",
    preferredDate: "",
    notes: "",
  });

  const submitMutation = trpc.baptism.submit.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(form);
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[oklch(0.98_0.005_145)]">
        <div className="container max-w-2xl py-20">
          <Card className="text-center border-green-200">
            <CardContent className="py-16">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-700" />
              </div>
              <h2 className="font-serif text-3xl text-green-900 mb-4">Registration Received</h2>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Thank you for registering your child for Baptism at St. Patrick's. 
                The parish office will contact you within 3-5 business days to discuss 
                preparation class dates and schedule the ceremony.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 max-w-sm mx-auto">
                <p className="text-sm text-amber-800">
                  <strong>Next step:</strong> Parents must attend a Baptism preparation class before the ceremony. 
                  The office will provide available dates.
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
    <div className="min-h-screen bg-[oklch(0.98_0.005_145)]">
      {/* Header */}
      <div className="bg-green-900 text-white py-12">
        <div className="container max-w-3xl">
          <Link href="/" className="text-green-200 hover:text-white text-sm flex items-center gap-1 mb-4">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-800 rounded-full flex items-center justify-center">
              <Droplets className="w-6 h-6 text-green-200" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl">Baptism Registration</h1>
          </div>
          <p className="text-green-200 max-w-xl">
            Complete this form to register your child for Baptism at St. Patrick's Church. 
            The parish office will contact you to schedule preparation and the ceremony.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="container max-w-3xl py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Child Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-900">Child's Information</CardTitle>
              <CardDescription>Details about the child to be baptized</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="childFirstName">First Name *</Label>
                  <Input
                    id="childFirstName"
                    required
                    value={form.childFirstName}
                    onChange={(e) => updateField("childFirstName", e.target.value)}
                    placeholder="Child's first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childLastName">Last Name *</Label>
                  <Input
                    id="childLastName"
                    required
                    value={form.childLastName}
                    onChange={(e) => updateField("childLastName", e.target.value)}
                    placeholder="Child's last name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="childDob">Date of Birth *</Label>
                  <Input
                    id="childDob"
                    type="date"
                    required
                    value={form.childDob}
                    onChange={(e) => updateField("childDob", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childGender">Gender *</Label>
                  <Select onValueChange={(v) => updateField("childGender", v)} value={form.childGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parent Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-900">Parent / Guardian Information</CardTitle>
              <CardDescription>Contact information for the parents or guardians</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father's Full Name</Label>
                  <Input
                    id="fatherName"
                    value={form.fatherName}
                    onChange={(e) => updateField("fatherName", e.target.value)}
                    placeholder="Father's full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherName">Mother's Full Name</Label>
                  <Input
                    id="motherName"
                    value={form.motherName}
                    onChange={(e) => updateField("motherName", e.target.value)}
                    placeholder="Mother's full name (maiden name)"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Email Address *</Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    required
                    value={form.parentEmail}
                    onChange={(e) => updateField("parentEmail", e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Phone Number *</Label>
                  <Input
                    id="parentPhone"
                    type="tel"
                    required
                    value={form.parentPhone}
                    onChange={(e) => updateField("parentPhone", e.target.value)}
                    placeholder="(914) 555-0123"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Home Address *</Label>
                <Input
                  id="address"
                  required
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="Street address, city, state, zip"
                />
              </div>
            </CardContent>
          </Card>

          {/* Godparents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-900">Godparents</CardTitle>
              <CardDescription>
                At least one godparent must be a confirmed, practicing Catholic. 
                A sponsor certificate is required from their home parish.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="godparentName1">Godparent 1</Label>
                  <Input
                    id="godparentName1"
                    value={form.godparentName1}
                    onChange={(e) => updateField("godparentName1", e.target.value)}
                    placeholder="Full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="godparentName2">Godparent 2</Label>
                  <Input
                    id="godparentName2"
                    value={form.godparentName2}
                    onChange={(e) => updateField("godparentName2", e.target.value)}
                    placeholder="Full name"
                  />
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  Each godparent will need to submit a <Link href="/sponsor-form" className="underline font-medium">Sponsor Certificate</Link> from their home parish.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-900">Scheduling Preferences</CardTitle>
              <CardDescription>Baptisms are typically celebrated on select Sundays after the 12:30 PM Mass</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preferredDate">Preferred Date (if any)</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={form.preferredDate}
                  onChange={(e) => updateField("preferredDate", e.target.value)}
                />
                <p className="text-xs text-gray-500">The office will confirm available dates with you.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Any special requests or questions..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="font-semibold text-green-900 mb-2">Requirements Reminder</h3>
            <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
              <li>Parents must be registered parishioners of St. Patrick's Church</li>
              <li>Parents must attend a Baptism preparation class (held monthly)</li>
              <li>At least one godparent must be a confirmed, practicing Catholic</li>
              <li>A copy of the child's birth certificate will be required</li>
            </ul>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Phone className="w-4 h-4" />
              <span>Questions? Call (914) 273-9724</span>
            </div>
            <Button
              type="submit"
              size="lg"
              className="bg-green-800 hover:bg-green-900 text-white px-8"
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? "Submitting..." : "Submit Registration"}
            </Button>
          </div>

          {submitMutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                There was an error submitting your registration. Please try again or call the parish office.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
