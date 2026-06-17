import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Plus, Trash2, Edit, FileText, Upload, Users, Shield } from "lucide-react";

export function SacramentsManager() {
  const [activeTab, setActiveTab] = useState<"baptism" | "sponsor" | "marriage" | "funeral">("baptism");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Sacrament Form Submissions</h2>
      </div>
      <div className="flex gap-2 flex-wrap">
        {(["baptism", "sponsor", "marriage", "funeral"] as const).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className="capitalize"
          >
            {tab === "sponsor" ? "Sponsor Certificates" : `${tab} Registrations`}
          </Button>
        ))}
      </div>

      {activeTab === "baptism" && <BaptismSubmissions />}
      {activeTab === "sponsor" && <SponsorSubmissions />}
      {activeTab === "marriage" && <MarriageSubmissions />}
      {activeTab === "funeral" && <FuneralSubmissions />}
    </div>
  );
}

function BaptismSubmissions() {
  const { data: submissions, isLoading } = trpc.baptism.list.useQuery();
  const utils = trpc.useUtils();
  const updateStatus = trpc.baptism.updateStatus.useMutation({
    onSuccess: () => { utils.baptism.list.invalidate(); toast.success("Status updated"); }
  });

  if (isLoading) return <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>;

  if (!submissions || submissions.length === 0) {
    return <Card className="p-8 text-center"><p className="text-muted-foreground">No baptism registrations yet.</p></Card>;
  }

  return (
    <div className="space-y-3">
      {submissions.map((sub: any) => (
        <Card key={sub.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{sub.childFirstName} {sub.childLastName}</h3>
                  <Badge variant={sub.status === "approved" ? "default" : sub.status === "pending" ? "secondary" : "outline"}>
                    {sub.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  DOB: {sub.childDob} | Parent: {sub.parentEmail} | Phone: {sub.parentPhone}
                </p>
                {sub.preferredDate && <p className="text-sm text-muted-foreground">Preferred date: {sub.preferredDate}</p>}
                {sub.godparentName1 && <p className="text-sm text-muted-foreground">Godparents: {sub.godparentName1}{sub.godparentName2 ? `, ${sub.godparentName2}` : ""}</p>}
                {sub.notes && <p className="text-sm text-muted-foreground mt-1 italic">"{sub.notes}"</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                {sub.status === "pending" && (
                  <>
                    <Button size="sm" onClick={() => updateStatus.mutate({ id: sub.id, status: "approved" })}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: sub.id, status: "contacted" })}>Contacted</Button>
                  </>
                )}
                {sub.status === "approved" && (
                  <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: sub.id, status: "completed" })}>Complete</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SponsorSubmissions() {
  const { data: submissions, isLoading } = trpc.sponsor.list.useQuery();
  const utils = trpc.useUtils();
  const updateStatus = trpc.sponsor.updateStatus.useMutation({
    onSuccess: () => { utils.sponsor.list.invalidate(); toast.success("Status updated"); }
  });

  if (isLoading) return <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>;

  if (!submissions || submissions.length === 0) {
    return <Card className="p-8 text-center"><p className="text-muted-foreground">No sponsor certificate requests yet.</p></Card>;
  }

  return (
    <div className="space-y-3">
      {submissions.map((sub: any) => (
        <Card key={sub.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{sub.sponsorFirstName} {sub.sponsorLastName}</h3>
                  <Badge variant="outline" className="capitalize">{sub.sacramentType}</Badge>
                  <Badge variant={sub.status === "approved" ? "default" : "secondary"}>
                    {sub.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  For: {sub.candidateName} | Parish: {sub.sponsorParish}, {sub.sponsorParishCity}
                </p>
                <p className="text-sm text-muted-foreground">
                  Email: {sub.sponsorEmail} | Phone: {sub.sponsorPhone}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Baptized: {sub.isBaptized ? "Yes" : "No"} | Confirmed: {sub.isConfirmed ? "Yes" : "No"} | Active Catholic: {sub.isActiveCatholic ? "Yes" : "No"}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                {sub.status === "pending" && (
                  <>
                    <Button size="sm" onClick={() => updateStatus.mutate({ id: sub.id, status: "approved" })}>Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => updateStatus.mutate({ id: sub.id, status: "denied" })}>Deny</Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MarriageSubmissions() {
  const { data: submissions, isLoading } = trpc.marriage.list.useQuery();
  const utils = trpc.useUtils();
  const updateStatus = trpc.marriage.updateStatus.useMutation({
    onSuccess: () => { utils.marriage.list.invalidate(); toast.success("Status updated"); }
  });

  if (isLoading) return <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>;

  if (!submissions || submissions.length === 0) {
    return <Card className="p-8 text-center"><p className="text-muted-foreground">No marriage inquiries yet.</p></Card>;
  }

  return (
    <div className="space-y-3">
      {submissions.map((sub: any) => (
        <Card key={sub.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{sub.brideFirstName} {sub.brideLastName} & {sub.groomFirstName} {sub.groomLastName}</h3>
                  <Badge variant={sub.status === "approved" ? "default" : "secondary"}>
                    {sub.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Bride: {sub.brideEmail} / {sub.bridePhone}
                </p>
                {sub.preferredDate && <p className="text-sm text-muted-foreground">Preferred: {sub.preferredDate}{sub.alternateDate ? ` | Alternate: ${sub.alternateDate}` : ""}</p>}
                <p className="text-xs text-muted-foreground mt-1">
                  Parishioner: {sub.isParishioner ? "Yes" : "No"} | Previous Marriage: {sub.previousMarriage ? "Yes" : "No"}
                  {sub.guestCount && ` | Guests: ${sub.guestCount}`}
                </p>
                {sub.notes && <p className="text-sm text-muted-foreground mt-1 italic">"{sub.notes}"</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                {sub.status === "pending" && (
                  <>
                    <Button size="sm" onClick={() => updateStatus.mutate({ id: sub.id, status: "meeting_scheduled" })}>Schedule Meeting</Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: sub.id, status: "contacted" })}>Contacted</Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FuneralSubmissions() {
  const { data: submissions, isLoading } = trpc.funeral.list.useQuery();
  const utils = trpc.useUtils();
  const updateStatus = trpc.funeral.updateStatus.useMutation({
    onSuccess: () => { utils.funeral.list.invalidate(); toast.success("Status updated"); }
  });

  if (isLoading) return <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>;

  if (!submissions || submissions.length === 0) {
    return <Card className="p-8 text-center"><p className="text-muted-foreground">No funeral planning forms yet.</p></Card>;
  }

  return (
    <div className="space-y-3">
      {submissions.map((sub: any) => (
        <Card key={sub.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{sub.deceasedName}</h3>
                  <Badge variant="outline">{sub.isPrePlanning ? "Pre-Planning" : "Immediate"}</Badge>
                  <Badge variant={sub.status === "scheduled" ? "default" : "secondary"}>
                    {sub.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Contact: {sub.plannerName} ({sub.plannerRelation || "N/A"}) | {sub.plannerEmail} / {sub.plannerPhone}
                </p>
                <p className="text-sm text-muted-foreground">
                  Service: {sub.massType.replace(/_/g, " ")}
                  {sub.preferredDate && ` | Date: ${sub.preferredDate}`}
                </p>
                {sub.hymns && <p className="text-xs text-muted-foreground mt-1">Hymns: {sub.hymns}</p>}
                {sub.specialRequests && <p className="text-sm text-muted-foreground mt-1 italic">"{sub.specialRequests}"</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                {sub.status === "pending" && (
                  <>
                    <Button size="sm" onClick={() => updateStatus.mutate({ id: sub.id, status: "scheduled" })}>Schedule</Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: sub.id, status: "contacted" })}>Contacted</Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

