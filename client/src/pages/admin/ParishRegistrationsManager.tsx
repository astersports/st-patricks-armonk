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

export function ParishRegistrationsManager() {
  const { data: registrations, isLoading } = trpc.parishRegistration.list.useQuery();
  const updateStatus = trpc.parishRegistration.updateStatus.useMutation({
    onSuccess: () => { toast.success("Status updated"); },
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Parish Registrations</h3>
        <Badge variant="outline">{registrations?.length || 0} total</Badge>
      </div>
      {(!registrations || registrations.length === 0) ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No parish registrations yet.</CardContent></Card>
      ) : (
        registrations.map((reg: any) => (
          <Card key={reg.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{reg.headOfHousehold}</h4>
                    <Badge variant={reg.status === "approved" ? "default" : reg.status === "pending" ? "secondary" : "outline"} className="text-xs">{reg.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{reg.email} &middot; {reg.phone}</p>
                  <p className="text-sm text-muted-foreground">{reg.address}, {reg.city}, {reg.state} {reg.zip}</p>
                  {reg.spouseName && <p className="text-sm text-muted-foreground mt-1">Spouse: {reg.spouseName}</p>}
                  {reg.numberOfChildren && <p className="text-sm text-muted-foreground">Children: {reg.numberOfChildren}</p>}
                  {reg.previousParish && <p className="text-sm text-muted-foreground">Previous Parish: {reg.previousParish}</p>}
                  <p className="text-xs text-muted-foreground mt-2">Submitted: {reg.createdAt ? format(new Date(reg.createdAt), "MMM d, yyyy") : "N/A"}</p>
                </div>
                <div className="flex gap-1">
                  {reg.status !== "approved" && (
                    <Button size="sm" onClick={() => updateStatus.mutate({ id: reg.id, status: "approved" })}>Approve</Button>
                  )}
                  {reg.status !== "contacted" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: reg.id, status: "contacted" })}>Contacted</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

