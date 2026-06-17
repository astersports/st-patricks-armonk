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

export function BulletinManager() {
  const utils = trpc.useUtils();
  const { data: bulletins, isLoading } = trpc.bulletins.listAll.useQuery();
  const createMutation = trpc.bulletins.create.useMutation({ onSuccess: () => { utils.bulletins.listAll.invalidate(); toast.success("Bulletin created!"); } });
  const deleteMutation = trpc.bulletins.delete.useMutation({ onSuccess: () => { utils.bulletins.listAll.invalidate(); toast.success("Bulletin deleted"); } });
  const updateMutation = trpc.bulletins.update.useMutation({ onSuccess: () => { utils.bulletins.listAll.invalidate(); toast.success("Bulletin updated"); } });
  const uploadMutation = trpc.bulletins.uploadPdf.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [weekDate, setWeekDate] = useState("");
  const [published, setPublished] = useState(true);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfKey, setPdfKey] = useState("");
  const [uploading, setUploading] = useState(false);

  // Auto-generate title when date changes
  const handleWeekDateChange = (dateStr: string) => {
    setWeekDate(dateStr);
    if (dateStr) {
      const d = new Date(dateStr + "T12:00:00");
      const formatted = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      setTitle(`Bulletin — ${formatted}`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") { toast.error("Please upload a PDF file"); return; }
    
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        const result = await uploadMutation.mutateAsync({
          fileName: file.name,
          fileBase64: base64,
          contentType: "application/pdf",
        });
        setPdfUrl(result.url);
        setPdfKey(result.key);
        toast.success("PDF uploaded successfully!");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Upload failed");
      setUploading(false);
    }
  };

  const handleCreate = () => {
    if (!title || !pdfUrl || !weekDate) { toast.error("Title, PDF, and week date required"); return; }
    createMutation.mutate({ title, description: description || undefined, pdfUrl, pdfKey, weekDate, published });
    setTitle(""); setDescription(""); setWeekDate(""); setPdfUrl(""); setPdfKey(""); setPublished(true); setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Weekly Bulletins</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" /> Upload Bulletin
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/30">
          <CardContent className="p-6 space-y-4">
            <div>
              <Label className="mb-2 block">Week Date (Sunday)</Label>
              <Input type="date" value={weekDate} onChange={(e) => handleWeekDateChange(e.target.value)} />
            </div>
            <Input placeholder="Bulletin title (auto-generated from date, or edit)" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div>
              <Label className="mb-2 block">Upload PDF</Label>
              <div className="flex items-center gap-3">
                <Input type="file" accept=".pdf" onChange={handleFileUpload} disabled={uploading} />
                {uploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
                {pdfUrl && <Badge variant="secondary">PDF Ready</Badge>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={published} onCheckedChange={setPublished} id="publish-bulletin" />
              <Label htmlFor="publish-bulletin">Publish immediately (sends notifications to subscribers)</Label>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCreate} disabled={createMutation.isPending || !pdfUrl}>
                {createMutation.isPending ? "Creating..." : "Create Bulletin"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : bulletins && bulletins.length > 0 ? (
        <div className="space-y-3">
          {bulletins.map((bulletin) => (
            <Card key={bulletin.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <FileText className="w-8 h-8 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{bulletin.title}</h3>
                    <Badge variant={bulletin.published ? "default" : "secondary"}>
                      {bulletin.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Week of {format(new Date(bulletin.weekDate), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!bulletin.published && (
                    <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ id: bulletin.id, published: true })}>
                      Publish
                    </Button>
                  )}
                  <a href={bulletin.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="ghost"><Upload className="w-4 h-4" /></Button>
                  </a>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate({ id: bulletin.id })}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No bulletins yet. Upload your first one above.</p>
        </Card>
      )}
    </div>
  );
}

