import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Camera, Upload, Trash2, Edit, Eye, EyeOff, Plus, Image as ImageIcon } from "lucide-react";

export default function GalleryManager() {
  const utils = trpc.useUtils();
  const { data: photos, isLoading } = trpc.gallery.listAll.useQuery();
  const { data: albums } = trpc.gallery.albums.useQuery();
  const uploadImageMutation = trpc.gallery.uploadImage.useMutation();
  const uploadMutation = trpc.gallery.upload.useMutation({
    onSuccess: () => {
      utils.gallery.listAll.invalidate();
      utils.gallery.albums.invalidate();
      toast.success("Photo added to gallery!");
    },
  });
  const updateMutation = trpc.gallery.update.useMutation({
    onSuccess: () => {
      utils.gallery.listAll.invalidate();
      toast.success("Photo updated");
    },
  });
  const deleteMutation = trpc.gallery.delete.useMutation({
    onSuccess: () => {
      utils.gallery.listAll.invalidate();
      utils.gallery.albums.invalidate();
      toast.success("Photo deleted");
    },
  });

  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [album, setAlbum] = useState("");
  const [newAlbum, setNewAlbum] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [filterAlbum, setFilterAlbum] = useState<string | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editAlbum, setEditAlbum] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<{ name: string; data: string; type: string } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreviewUrl(dataUrl);
      const base64 = dataUrl.split(",")[1];
      setPendingFile({ name: file.name, data: base64, type: file.type });
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!pendingFile) {
      toast.error("Please select an image");
      return;
    }
    setUploading(true);
    try {
      // Upload image to S3
      const { url, key } = await uploadImageMutation.mutateAsync({
        fileName: pendingFile.name,
        fileData: pendingFile.data,
        contentType: pendingFile.type,
      });
      // Create gallery record
      const selectedAlbum = newAlbum || album || undefined;
      await uploadMutation.mutateAsync({
        title: title || undefined,
        caption: caption || undefined,
        album: selectedAlbum,
        imageUrl: url,
        imageKey: key,
      });
      // Reset form
      setTitle("");
      setCaption("");
      setAlbum("");
      setNewAlbum("");
      setPreviewUrl("");
      setPendingFile(null);
      setShowUpload(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async () => {
    if (!editingPhoto) return;
    await updateMutation.mutateAsync({
      id: editingPhoto.id,
      title: editTitle || undefined,
      caption: editCaption || undefined,
      album: editAlbum || undefined,
    });
    setEditingPhoto(null);
  };

  const startEdit = (photo: any) => {
    setEditingPhoto(photo);
    setEditTitle(photo.title || "");
    setEditCaption(photo.caption || "");
    setEditAlbum(photo.album || "");
  };

  const filteredPhotos = filterAlbum
    ? photos?.filter((p) => p.album === filterAlbum)
    : photos;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold">Photo Gallery</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage parish photos and albums. {photos?.length || 0} photos total.
          </p>
        </div>
        <Button onClick={() => setShowUpload(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Upload Photo
        </Button>
      </div>

      {/* Album Filter */}
      {albums && albums.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={filterAlbum === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilterAlbum(null)}
          >
            All ({photos?.length || 0})
          </Badge>
          {albums.map((a) => (
            <Badge
              key={a.album}
              variant={filterAlbum === a.album ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterAlbum(a.album)}
            >
              {a.album} ({a.count})
            </Badge>
          ))}
        </div>
      )}

      {/* Upload Form */}
      {showUpload && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload New Photo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Input */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                previewUrl ? "border-primary/30 bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className="space-y-3">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg object-contain"
                  />
                  <p className="text-sm text-muted-foreground">Click to change image</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Camera className="w-10 h-10 text-muted-foreground mx-auto" />
                  <p className="text-sm font-medium">Click to select an image</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, WebP up to 10MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* Metadata */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Title (optional)</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Photo title"
                />
              </div>
              <div>
                <Label>Album</Label>
                <div className="flex gap-2">
                  {albums && albums.length > 0 ? (
                    <select
                      className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm"
                      value={album}
                      onChange={(e) => setAlbum(e.target.value)}
                    >
                      <option value="">Select album...</option>
                      {albums.map((a) => (
                        <option key={a.album} value={a.album}>{a.album}</option>
                      ))}
                    </select>
                  ) : null}
                  <Input
                    value={newAlbum}
                    onChange={(e) => setNewAlbum(e.target.value)}
                    placeholder="Or new album name"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <div>
              <Label>Caption (optional)</Label>
              <Input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Brief description of the photo"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handleUpload} disabled={uploading || !pendingFile}>
                {uploading ? "Uploading..." : "Upload & Save"}
              </Button>
              <Button variant="outline" onClick={() => {
                setShowUpload(false);
                setPreviewUrl("");
                setPendingFile(null);
                setTitle("");
                setCaption("");
                setAlbum("");
                setNewAlbum("");
              }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photo Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      ) : filteredPhotos && filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <Card key={photo.id} className="group overflow-hidden">
              <div className="relative aspect-square">
                <img
                  src={photo.imageUrl}
                  alt={photo.title || "Gallery photo"}
                  className="w-full h-full object-cover"
                />
                {!photo.published && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-[10px]">
                      <EyeOff className="w-3 h-3 mr-1" /> Hidden
                    </Badge>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={() => startEdit(photo)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={() => updateMutation.mutate({ id: photo.id, published: !photo.published })}
                  >
                    {photo.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      if (confirm("Delete this photo?")) {
                        deleteMutation.mutate({ id: photo.id });
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{photo.title || "Untitled"}</p>
                <div className="flex items-center gap-2 mt-1">
                  {photo.album && (
                    <Badge variant="outline" className="text-[10px]">{photo.album}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No photos yet</p>
          <p className="text-sm text-muted-foreground mt-1">Upload your first photo to get started.</p>
          <Button className="mt-4" onClick={() => setShowUpload(true)}>
            <Upload className="w-4 h-4 mr-2" /> Upload Photo
          </Button>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingPhoto} onOpenChange={(open) => { if (!open) setEditingPhoto(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editingPhoto && (
              <img
                src={editingPhoto.imageUrl}
                alt={editingPhoto.title || "Photo"}
                className="w-full max-h-48 object-contain rounded-lg bg-muted"
              />
            )}
            <div>
              <Label>Title</Label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Photo title" />
            </div>
            <div>
              <Label>Caption</Label>
              <Input value={editCaption} onChange={(e) => setEditCaption(e.target.value)} placeholder="Caption" />
            </div>
            <div>
              <Label>Album</Label>
              <Input value={editAlbum} onChange={(e) => setEditAlbum(e.target.value)} placeholder="Album name" />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={editingPhoto?.published ?? true}
                onCheckedChange={(checked) => setEditingPhoto({ ...editingPhoto, published: checked })}
              />
              <Label>Published (visible on gallery page)</Label>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleEdit} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={() => setEditingPhoto(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
