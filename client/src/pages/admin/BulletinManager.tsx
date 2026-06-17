import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Plus, Trash2, FileText, Upload, PenLine, Eye } from "lucide-react";
import { BulletinEditor } from "./BulletinEditor";

export function BulletinManager() {
  const utils = trpc.useUtils();
  const { data: bulletins, isLoading } = trpc.bulletins.listAll.useQuery();
  const deleteMutation = trpc.bulletins.delete.useMutation({ onSuccess: () => { utils.bulletins.listAll.invalidate(); toast.success("Bulletin deleted"); } });
  const updateMutation = trpc.bulletins.update.useMutation({ onSuccess: () => { utils.bulletins.listAll.invalidate(); toast.success("Bulletin updated"); } });
  const uploadMutation = trpc.bulletins.uploadPdf.useMutation();

  const [mode, setMode] = useState<"list" | "compose" | "upload">("list");
  const [editingId, setEditingId] = useState<number | undefined>();
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: "", weekDate: "", pdfUrl: "", pdfKey: "" });

  // Upload mode handlers
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") { toast.error("Please upload a PDF file"); return; }
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        const result = await uploadMutation.mutateAsync({ fileName: file.name, fileBase64: base64, contentType: "application/pdf" });
        setUploadForm(f => ({ ...f, pdfUrl: result.url, pdfKey: result.key }));
        toast.success("PDF uploaded!");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch { toast.error("Upload failed"); setUploading(false); }
  };

  if (mode === "compose") {
    return <BulletinEditor bulletinId={editingId} onBack={() => { setMode("list"); setEditingId(undefined); }} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Weekly Bulletins</h2>
        <div className="flex gap-2">
          <Button onClick={() => { setEditingId(undefined); setMode("compose"); }} className="gap-2">
            <PenLine className="w-4 h-4" /> Compose Bulletin
          </Button>
        </div>
      </div>

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
                    {bulletin.sourceHtml && <Badge variant="outline" className="text-xs">Composed</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Week of {format(new Date(bulletin.weekDate), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {bulletin.sourceHtml && (
                    <Button size="sm" variant="outline" onClick={() => { setEditingId(bulletin.id); setMode("compose"); }}>
                      <PenLine className="w-4 h-4" />
                    </Button>
                  )}
                  {!bulletin.published && (
                    <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ id: bulletin.id, published: true })}>
                      Publish
                    </Button>
                  )}
                  {bulletin.pdfUrl && bulletin.pdfUrl !== "placeholder" && (
                    <a href={bulletin.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                    </a>
                  )}
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
          <p className="text-muted-foreground mb-4">No bulletins yet. Compose your first one or upload a PDF.</p>
          <Button onClick={() => setMode("compose")} className="gap-2">
            <PenLine className="w-4 h-4" /> Compose Your First Bulletin
          </Button>
        </Card>
      )}
    </div>
  );
}
