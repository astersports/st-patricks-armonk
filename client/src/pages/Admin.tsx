import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Plus, Trash2, Edit, FileText, Newspaper, Calendar, Users, Upload, Shield } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <PageLayout>
        <div className="container py-16">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <div className="container py-24 flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-serif text-2xl font-bold mb-2">Admin Access Required</h2>
              <p className="text-muted-foreground mb-6">Please sign in to access the admin dashboard.</p>
              <a href={getLoginUrl()}>
                <Button>Sign In</Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  if (user?.role !== "admin") {
    return (
      <PageLayout>
        <div className="container py-24 flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="font-serif text-2xl font-bold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">Only parish administrators can access this page.</p>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="bg-gradient-to-b from-accent/5 to-transparent py-8">
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-accent" />
            <h1 className="font-serif text-3xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Manage parish news, bulletins, events, and subscribers.</p>
        </div>
      </section>

      <section className="container py-8">
        <Tabs defaultValue="news" className="w-full">
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="news" className="gap-2"><Newspaper className="w-4 h-4" /> News</TabsTrigger>
            <TabsTrigger value="bulletins" className="gap-2"><FileText className="w-4 h-4" /> Bulletins</TabsTrigger>
            <TabsTrigger value="events" className="gap-2"><Calendar className="w-4 h-4" /> Events</TabsTrigger>
            <TabsTrigger value="subscribers" className="gap-2"><Users className="w-4 h-4" /> Subscribers</TabsTrigger>
          </TabsList>

          <TabsContent value="news"><NewsManager /></TabsContent>
          <TabsContent value="bulletins"><BulletinManager /></TabsContent>
          <TabsContent value="events"><EventManager /></TabsContent>
          <TabsContent value="subscribers"><SubscriberList /></TabsContent>
        </Tabs>
      </section>
    </PageLayout>
  );
}

// ===== NEWS MANAGER =====
function NewsManager() {
  const utils = trpc.useUtils();
  const { data: posts, isLoading } = trpc.news.listAll.useQuery();
  const createMutation = trpc.news.create.useMutation({ onSuccess: () => { utils.news.listAll.invalidate(); toast.success("News post created!"); } });
  const deleteMutation = trpc.news.delete.useMutation({ onSuccess: () => { utils.news.listAll.invalidate(); toast.success("Post deleted"); } });
  const updateMutation = trpc.news.update.useMutation({ onSuccess: () => { utils.news.listAll.invalidate(); toast.success("Post updated"); setEditingPost(null); } });

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [published, setPublished] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");

  const startEdit = (post: any) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditExcerpt(post.excerpt || "");
  };

  const handleEdit = () => {
    if (!editTitle || !editContent) { toast.error("Title and content required"); return; }
    updateMutation.mutate({ id: editingPost.id, title: editTitle, content: editContent, excerpt: editExcerpt || undefined });
  };

  const handleCreate = () => {
    if (!title || !content) { toast.error("Title and content required"); return; }
    createMutation.mutate({ title, content, excerpt: excerpt || undefined, published });
    setTitle(""); setContent(""); setExcerpt(""); setPublished(false); setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">News & Announcements</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" /> New Post
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/30">
          <CardContent className="p-6 space-y-4">
            <Input placeholder="Post title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input placeholder="Short excerpt (optional)" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
            <Textarea placeholder="Full content..." value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
            <div className="flex items-center gap-3">
              <Switch checked={published} onCheckedChange={setPublished} id="publish-news" />
              <Label htmlFor="publish-news">Publish immediately (sends notifications to subscribers)</Label>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Post"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : posts && posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{post.title}</h3>
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created {format(new Date(post.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!post.published && (
                    <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ id: post.id, published: true })}>
                      Publish
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => startEdit(post)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate({ id: post.id })}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No news posts yet. Create your first one above.</p>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingPost} onOpenChange={(open) => { if (!open) setEditingPost(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit News Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Post title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            <Input placeholder="Short excerpt (optional)" value={editExcerpt} onChange={(e) => setEditExcerpt(e.target.value)} />
            <Textarea placeholder="Full content..." value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={6} />
            <div className="flex gap-3">
              <Button onClick={handleEdit} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={() => setEditingPost(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== BULLETIN MANAGER =====
function BulletinManager() {
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
  const [published, setPublished] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfKey, setPdfKey] = useState("");
  const [uploading, setUploading] = useState(false);

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
    setTitle(""); setDescription(""); setWeekDate(""); setPdfUrl(""); setPdfKey(""); setPublished(false); setShowForm(false);
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
            <Input placeholder="Bulletin title (e.g., 'Bulletin - June 15, 2026')" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div>
              <Label className="mb-2 block">Week Date</Label>
              <Input type="date" value={weekDate} onChange={(e) => setWeekDate(e.target.value)} />
            </div>
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

// ===== EVENT MANAGER =====
function EventManager() {
  const utils = trpc.useUtils();
  const { data: events, isLoading } = trpc.events.listAll.useQuery();
  const createMutation = trpc.events.create.useMutation({ onSuccess: () => { utils.events.listAll.invalidate(); toast.success("Event created!"); } });
  const deleteMutation = trpc.events.delete.useMutation({ onSuccess: () => { utils.events.listAll.invalidate(); toast.success("Event deleted"); } });

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");

  const handleCreate = () => {
    if (!title || !startDate) { toast.error("Title and date required"); return; }
    const dateTime = startTime ? `${startDate}T${startTime}` : `${startDate}T09:00`;
    createMutation.mutate({ title, description: description || undefined, location: location || undefined, startDate: dateTime, published: true });
    setTitle(""); setDescription(""); setLocation(""); setStartDate(""); setStartTime(""); setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Parish Events</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" /> New Event
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/30">
          <CardContent className="p-6 space-y-4">
            <Input placeholder="Event title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input placeholder="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} />
            <Textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Date</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <Label className="mb-2 block">Time</Label>
                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Event"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : events && events.length > 0 ? (
        <div className="space-y-3">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-primary/10 rounded-lg p-2 text-center min-w-[50px]">
                  <p className="text-xs text-primary font-medium">{format(new Date(event.startDate), "MMM")}</p>
                  <p className="text-lg font-bold text-primary">{format(new Date(event.startDate), "d")}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.startDate), "h:mm a")}
                    {event.location && ` • ${event.location}`}
                  </p>
                </div>
                <Button size="sm" variant="ghost" className="text-destructive shrink-0" onClick={() => deleteMutation.mutate({ id: event.id })}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No events yet. Create your first one above.</p>
        </Card>
      )}
    </div>
  );
}

// ===== SUBSCRIBER LIST =====
function SubscriberList() {
  const { data: subscribers, isLoading } = trpc.subscriptions.listAll.useQuery();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Email Subscribers</h2>
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : subscribers && subscribers.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-secondary/50">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Email</th>
                    <th className="text-left p-3 text-sm font-medium">Name</th>
                    <th className="text-center p-3 text-sm font-medium">Bulletins</th>
                    <th className="text-center p-3 text-sm font-medium">News</th>
                    <th className="text-center p-3 text-sm font-medium">Status</th>
                    <th className="text-left p-3 text-sm font-medium">Subscribed</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="border-b last:border-0">
                      <td className="p-3 text-sm">{sub.email}</td>
                      <td className="p-3 text-sm text-muted-foreground">{sub.name || "—"}</td>
                      <td className="p-3 text-center">
                        <Badge variant={sub.subscribedToBulletins ? "default" : "secondary"} className="text-xs">
                          {sub.subscribedToBulletins ? "Yes" : "No"}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant={sub.subscribedToNews ? "default" : "secondary"} className="text-xs">
                          {sub.subscribedToNews ? "Yes" : "No"}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant={sub.active ? "default" : "destructive"} className="text-xs">
                          {sub.active ? "Active" : "Unsubscribed"}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {format(new Date(sub.createdAt), "MMM d, yyyy")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No subscribers yet. Parishioners can subscribe from the homepage.</p>
        </Card>
      )}
    </div>
  );
}
