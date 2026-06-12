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
          <p className="text-muted-foreground">Manage parish news, bulletins, events, CCD, CYO, volunteers, and subscribers.</p>
        </div>
      </section>

      <section className="container py-8">
        <Tabs defaultValue="news" className="w-full">
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="news" className="gap-2"><Newspaper className="w-4 h-4" /> News</TabsTrigger>
            <TabsTrigger value="bulletins" className="gap-2"><FileText className="w-4 h-4" /> Bulletins</TabsTrigger>
            <TabsTrigger value="events" className="gap-2"><Calendar className="w-4 h-4" /> Events</TabsTrigger>
            <TabsTrigger value="ccd" className="gap-2"><Users className="w-4 h-4" /> CCD</TabsTrigger>
            <TabsTrigger value="cyo" className="gap-2"><Calendar className="w-4 h-4" /> CYO</TabsTrigger>
            <TabsTrigger value="volunteers" className="gap-2"><Users className="w-4 h-4" /> Volunteers</TabsTrigger>
            <TabsTrigger value="documents" className="gap-2"><FileText className="w-4 h-4" /> Documents</TabsTrigger>
            <TabsTrigger value="subscribers" className="gap-2"><Users className="w-4 h-4" /> Subscribers</TabsTrigger>
          </TabsList>

          <TabsContent value="news"><NewsManager /></TabsContent>
          <TabsContent value="bulletins"><BulletinManager /></TabsContent>
          <TabsContent value="events"><EventManager /></TabsContent>
          <TabsContent value="ccd"><CcdManager /></TabsContent>
          <TabsContent value="cyo"><CyoManager /></TabsContent>
          <TabsContent value="volunteers"><VolunteerManager /></TabsContent>
          <TabsContent value="documents"><DocumentsManager /></TabsContent>
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

// ===== CCD MANAGER =====
function CcdManager() {
  const { data: registrations, isLoading } = trpc.ccd.list.useQuery();
  const { data: ccdEvents, isLoading: eventsLoading } = trpc.ccd.listEvents.useQuery({ schoolYear: "2026-2027" });
  const utils = trpc.useUtils();
  const updateStatusMutation = trpc.ccd.updateStatus.useMutation({
    onSuccess: () => { utils.ccd.list.invalidate(); toast.success("Status updated"); },
  });
  const createEventMutation = trpc.ccd.createEvent.useMutation({
    onSuccess: () => { utils.ccd.listEvents.invalidate(); toast.success("Event created"); setShowEventForm(false); },
  });
  const deleteEventMutation = trpc.ccd.deleteEvent.useMutation({
    onSuccess: () => { utils.ccd.listEvents.invalidate(); toast.success("Event deleted"); },
  });

  const updateEventMutation = trpc.ccd.updateEvent.useMutation({
    onSuccess: () => { utils.ccd.listEvents.invalidate(); toast.success("Event updated"); setEditingEventId(null); },
  });

  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState<"class" | "holiday" | "special" | "sacrament">("class");
  const [eventDescription, setEventDescription] = useState("");
  const [eventGrade, setEventGrade] = useState("");
  const [eventLocation, setEventLocation] = useState("");

  const startEditEvent = (event: any) => {
    setEditingEventId(event.id);
    setEventTitle(event.title);
    setEventDate(new Date(event.eventDate).toISOString().slice(0, 16));
    setEventType(event.eventType);
    setEventDescription(event.description || "");
    setEventGrade(event.grade || "");
    setEventLocation(event.location || "");
    setShowEventForm(true);
  };

  const handleSaveEvent = () => {
    if (!eventTitle || !eventDate) { toast.error("Title and date are required"); return; }
    if (editingEventId) {
      updateEventMutation.mutate({
        id: editingEventId,
        title: eventTitle,
        eventDate,
        eventType,
        description: eventDescription || undefined,
        grade: eventGrade || undefined,
        location: eventLocation || undefined,
      });
    } else {
      handleCreateEvent();
    }
  };

  const handleCreateEvent = () => {
    if (!eventTitle || !eventDate) { toast.error("Title and date are required"); return; }
    createEventMutation.mutate({
      title: eventTitle,
      eventDate,
      eventType,
      description: eventDescription || undefined,
      grade: eventGrade || undefined,
      location: eventLocation || undefined,
      schoolYear: "2026-2027",
    });
    setEventTitle(""); setEventDate(""); setEventType("class"); setEventDescription(""); setEventGrade(""); setEventLocation("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">CCD Registrations</h2>
        <Badge variant="secondary">{registrations?.length ?? 0} total</Badge>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : registrations && registrations.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-secondary/50">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Child</th>
                    <th className="text-left p-3 text-sm font-medium">Grade</th>
                    <th className="text-left p-3 text-sm font-medium">Parent</th>
                    <th className="text-left p-3 text-sm font-medium">Email</th>
                    <th className="text-center p-3 text-sm font-medium">Status</th>
                    <th className="text-left p-3 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="border-b last:border-0">
                      <td className="p-3 text-sm font-medium">{reg.childFirstName} {reg.childLastName}</td>
                      <td className="p-3 text-sm">{reg.grade}</td>
                      <td className="p-3 text-sm">{reg.parentFirstName} {reg.parentLastName}</td>
                      <td className="p-3 text-sm text-muted-foreground">{reg.parentEmail}</td>
                      <td className="p-3 text-center">
                        <Badge variant={reg.status === "approved" ? "default" : reg.status === "pending" ? "secondary" : "destructive"} className="text-xs">
                          {reg.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          {reg.status !== "approved" && (
                            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => updateStatusMutation.mutate({ id: reg.id, status: "approved" })}>
                              Approve
                            </Button>
                          )}
                          {reg.status !== "waitlisted" && (
                            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => updateStatusMutation.mutate({ id: reg.id, status: "waitlisted" })}>
                              Waitlist
                            </Button>
                          )}
                        </div>
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
          <p className="text-muted-foreground">No CCD registrations yet. Parents can register at /ccd-registration.</p>
        </Card>
      )}

      {/* CCD Calendar Events Management */}
      <div className="border-t pt-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">CCD Calendar Events</h2>
          <Button size="sm" onClick={() => setShowEventForm(!showEventForm)}>
            <Plus className="w-4 h-4 mr-1" /> Add Event
          </Button>
        </div>

        {showEventForm && (
          <Card className="p-4 mb-4 border-primary/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Event title *" value={eventTitle} onChange={e => setEventTitle(e.target.value)} />
              <Input type="datetime-local" value={eventDate} onChange={e => setEventDate(e.target.value)} />
              <select className="border rounded-md px-3 py-2 text-sm" value={eventType} onChange={e => setEventType(e.target.value as any)}>
                <option value="class">Class</option>
                <option value="holiday">Holiday / No Class</option>
                <option value="special">Special Event</option>
                <option value="sacrament">Sacrament</option>
              </select>
              <Input placeholder="Grade (optional, e.g. 2nd, All)" value={eventGrade} onChange={e => setEventGrade(e.target.value)} />
              <Input placeholder="Location (optional)" value={eventLocation} onChange={e => setEventLocation(e.target.value)} />
              <Input placeholder="Description (optional)" value={eventDescription} onChange={e => setEventDescription(e.target.value)} />
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={handleSaveEvent} disabled={createEventMutation.isPending || updateEventMutation.isPending}>
                {(createEventMutation.isPending || updateEventMutation.isPending) ? "Saving..." : editingEventId ? "Update Event" : "Save Event"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setShowEventForm(false); setEditingEventId(null); setEventTitle(""); setEventDate(""); setEventType("class"); setEventDescription(""); setEventGrade(""); setEventLocation(""); }}>Cancel</Button>
            </div>
          </Card>
        )}

        {eventsLoading ? (
          <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : ccdEvents && ccdEvents.length > 0 ? (
          <div className="space-y-2">
            {ccdEvents.map((event: any) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-primary bg-green-50 px-2 py-1 rounded">
                    {new Date(event.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <span className="text-sm font-medium">{event.title}</span>
                  <Badge variant="secondary" className="text-xs">{event.eventType}</Badge>
                  {event.grade && <span className="text-xs text-muted-foreground">Grade: {event.grade}</span>}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-7" onClick={() => startEditEvent(event)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive h-7" onClick={() => deleteEventMutation.mutate({ id: event.id })}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No CCD events added yet. Add events to display on the CCD Calendar page.</p>
        )}
      </div>
    </div>
  );
}

// ===== CYO MANAGER =====
function CyoManager() {
  const utils = trpc.useUtils();
  const { data: teams, isLoading: teamsLoading } = trpc.cyo.listTeams.useQuery();
  const { data: games, isLoading: gamesLoading } = trpc.cyo.listGames.useQuery();
  const createTeamMutation = trpc.cyo.createTeam.useMutation({ onSuccess: () => { utils.cyo.listTeams.invalidate(); toast.success("Team created!"); setShowTeamForm(false); } });
  const deleteTeamMutation = trpc.cyo.deleteTeam.useMutation({ onSuccess: () => { utils.cyo.listTeams.invalidate(); utils.cyo.listGames.invalidate(); toast.success("Team deleted"); } });
  const createGameMutation = trpc.cyo.createGame.useMutation({ onSuccess: () => { utils.cyo.listGames.invalidate(); toast.success("Game added!"); setShowGameForm(false); } });
  const updateGameMutation = trpc.cyo.updateGame.useMutation({ onSuccess: () => { utils.cyo.listGames.invalidate(); toast.success("Game updated!"); } });
  const deleteGameMutation = trpc.cyo.deleteGame.useMutation({ onSuccess: () => { utils.cyo.listGames.invalidate(); toast.success("Game deleted"); } });

  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showGameForm, setShowGameForm] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDivision, setTeamDivision] = useState("");
  const [teamAgeGroup, setTeamAgeGroup] = useState("");
  const [teamSeason, setTeamSeason] = useState("2026-2027");
  const [teamCoach, setTeamCoach] = useState("");

  const [gameTeamId, setGameTeamId] = useState<number | null>(null);
  const [gameOpponent, setGameOpponent] = useState("");
  const [gameDate, setGameDate] = useState("");
  const [gameTime, setGameTime] = useState("");
  const [gameLocation, setGameLocation] = useState("");
  const [gameHomeAway, setGameHomeAway] = useState<"home" | "away">("home");

  const handleCreateTeam = () => {
    if (!teamName || !teamDivision || !teamAgeGroup) { toast.error("Fill in team name, division, and age group"); return; }
    createTeamMutation.mutate({ name: teamName, division: teamDivision, ageGroup: teamAgeGroup, season: teamSeason, coachName: teamCoach || undefined });
    setTeamName(""); setTeamDivision(""); setTeamAgeGroup(""); setTeamCoach("");
  };

  const handleCreateGame = () => {
    if (!gameTeamId || !gameOpponent || !gameDate || !gameLocation) { toast.error("Fill in all game details"); return; }
    const dateTime = gameTime ? `${gameDate}T${gameTime}` : `${gameDate}T18:00`;
    createGameMutation.mutate({ teamId: gameTeamId, opponent: gameOpponent, gameDate: dateTime, location: gameLocation, homeAway: gameHomeAway });
    setGameOpponent(""); setGameDate(""); setGameTime(""); setGameLocation("");
  };

  const handleUpdateScore = (gameId: number, ourScore: string, theirScore: string) => {
    const our = parseInt(ourScore);
    const their = parseInt(theirScore);
    if (isNaN(our) || isNaN(their)) return;
    updateGameMutation.mutate({ id: gameId, ourScore: our, theirScore: their, status: "completed" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-semibold">CYO Basketball</h2>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setShowTeamForm(!showTeamForm)} className="gap-1">
            <Plus className="w-3 h-3" /> Add Team
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowGameForm(!showGameForm)} className="gap-1">
            <Plus className="w-3 h-3" /> Add Game
          </Button>
        </div>
      </div>

      {showTeamForm && (
        <Card className="border-primary/30">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-medium text-sm">New Team</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Team name" value={teamName} onChange={e => setTeamName(e.target.value)} />
              <Input placeholder="Division (e.g. Boys Varsity)" value={teamDivision} onChange={e => setTeamDivision(e.target.value)} />
              <Input placeholder="Age group (e.g. 5th-6th Grade)" value={teamAgeGroup} onChange={e => setTeamAgeGroup(e.target.value)} />
              <Input placeholder="Season (e.g. 2026-2027)" value={teamSeason} onChange={e => setTeamSeason(e.target.value)} />
              <Input placeholder="Coach name (optional)" value={teamCoach} onChange={e => setTeamCoach(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreateTeam} disabled={createTeamMutation.isPending}>Create Team</Button>
              <Button size="sm" variant="outline" onClick={() => setShowTeamForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showGameForm && (
        <Card className="border-primary/30">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-medium text-sm">New Game</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select className="border rounded-md px-3 py-2 text-sm" value={gameTeamId ?? ""} onChange={e => setGameTeamId(Number(e.target.value))}>
                <option value="">Select team</option>
                {teams?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <Input placeholder="Opponent" value={gameOpponent} onChange={e => setGameOpponent(e.target.value)} />
              <Input type="date" value={gameDate} onChange={e => setGameDate(e.target.value)} />
              <Input type="time" value={gameTime} onChange={e => setGameTime(e.target.value)} />
              <Input placeholder="Location" value={gameLocation} onChange={e => setGameLocation(e.target.value)} />
              <select className="border rounded-md px-3 py-2 text-sm" value={gameHomeAway} onChange={e => setGameHomeAway(e.target.value as "home" | "away")}>
                <option value="home">Home</option>
                <option value="away">Away</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreateGame} disabled={createGameMutation.isPending}>Add Game</Button>
              <Button size="sm" variant="outline" onClick={() => setShowGameForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Teams List */}
      <div>
        <h3 className="font-medium mb-3">Teams ({teams?.length ?? 0})</h3>
        {teamsLoading ? (
          <div className="space-y-2">{[1,2].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : teams && teams.length > 0 ? (
          <div className="space-y-2">
            {teams.map(team => (
              <Card key={team.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-sm">{team.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{team.division} • {team.ageGroup} • {team.wins}W-{team.losses}L</span>
                  </div>
                  <Button size="sm" variant="ghost" className="text-destructive h-7" onClick={() => deleteTeamMutation.mutate({ id: team.id })}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No teams created yet.</p>
        )}
      </div>

      {/* Games List */}
      <div>
        <h3 className="font-medium mb-3">Games ({games?.length ?? 0})</h3>
        {gamesLoading ? (
          <div className="space-y-2">{[1,2].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : games && games.length > 0 ? (
          <div className="space-y-2">
            {games.map(game => {
              const team = teams?.find(t => t.id === game.teamId);
              return (
                <Card key={game.id} className="p-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm">{team?.name ?? "?"} vs {game.opponent}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {format(new Date(game.gameDate), "MMM d, h:mm a")} • {game.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={game.status === "completed" ? "default" : "secondary"} className="text-xs">{game.status}</Badge>
                      {game.status === "scheduled" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-7 text-xs">Score</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Enter Score</DialogTitle></DialogHeader>
                            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); handleUpdateScore(game.id, fd.get("our") as string, fd.get("their") as string); }} className="space-y-4 mt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div><Label>Our Score</Label><Input name="our" type="number" min="0" required /></div>
                                <div><Label>Their Score</Label><Input name="their" type="number" min="0" required /></div>
                              </div>
                              <Button type="submit" className="w-full">Save Score</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      )}
                      {game.status === "completed" && (
                        <span className="text-sm font-bold">{game.ourScore}-{game.theirScore}</span>
                      )}
                      <Button size="sm" variant="ghost" className="text-destructive h-7" onClick={() => deleteGameMutation.mutate({ id: game.id })}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No games scheduled yet.</p>
        )}
      </div>
    </div>
  );
}

// ===== VOLUNTEER MANAGER =====
function VolunteerManager() {
  const utils = trpc.useUtils();
  const { data: opportunities, isLoading } = trpc.volunteer.listAllOpportunities.useQuery();
  const createMutation = trpc.volunteer.createOpportunity.useMutation({ onSuccess: () => { utils.volunteer.listAllOpportunities.invalidate(); toast.success("Opportunity created!"); setShowForm(false); } });
  const deleteMutation = trpc.volunteer.deleteOpportunity.useMutation({ onSuccess: () => { utils.volunteer.listAllOpportunities.invalidate(); toast.success("Deleted"); } });

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ministry, setMinistry] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [spots, setSpots] = useState("10");

  const handleCreate = () => {
    if (!title || !spots) { toast.error("Title and spots required"); return; }
    createMutation.mutate({
      title,
      description: description || undefined,
      ministry: ministry || undefined,
      eventDate: eventDate || undefined,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      spotsAvailable: parseInt(spots),
    });
    setTitle(""); setDescription(""); setMinistry(""); setEventDate(""); setStartTime(""); setEndTime(""); setSpots("10");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Volunteer Opportunities</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" /> New Opportunity
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/30">
          <CardContent className="p-4 space-y-3">
            <Input placeholder="Opportunity title" value={title} onChange={e => setTitle(e.target.value)} />
            <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows={2} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Ministry (optional)" value={ministry} onChange={e => setMinistry(e.target.value)} />
              <Input type="date" placeholder="Date" value={eventDate} onChange={e => setEventDate(e.target.value)} />
              <Input type="number" placeholder="Spots available" value={spots} onChange={e => setSpots(e.target.value)} min="1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input type="time" placeholder="Start time" value={startTime} onChange={e => setStartTime(e.target.value)} />
              <Input type="time" placeholder="End time" value={endTime} onChange={e => setEndTime(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreate} disabled={createMutation.isPending}>Create</Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : opportunities && opportunities.length > 0 ? (
        <div className="space-y-3">
          {opportunities.map(opp => (
            <Card key={opp.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-sm">{opp.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {opp.ministry && `${opp.ministry} • `}
                    {opp.eventDate && `${format(new Date(opp.eventDate), "MMM d, yyyy")} • `}
                    {opp.spotsFilled}/{opp.spotsAvailable} filled
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={opp.active ? "default" : "secondary"}>{opp.active ? "Active" : "Inactive"}</Badge>
                  <Button size="sm" variant="ghost" className="text-destructive h-7" onClick={() => deleteMutation.mutate({ id: opp.id })}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No volunteer opportunities yet. Create one above.</p>
        </Card>
      )}
    </div>
  );
}


const DOC_CATEGORIES = [
  { value: "baptism", label: "Baptism" },
  { value: "confirmation", label: "Confirmation" },
  { value: "marriage", label: "Marriage" },
  { value: "funeral", label: "Funeral" },
  { value: "ccd", label: "Religious Education (CCD)" },
  { value: "general", label: "General" },
];

function DocumentsManager() {
  const { data: docs, isLoading } = trpc.documents.all.useQuery();
  const utils = trpc.useUtils();
  const uploadMutation = trpc.documents.upload.useMutation();
  const createMutation = trpc.documents.create.useMutation({
    onSuccess: () => { utils.documents.all.invalidate(); toast.success("Document added"); },
  });
  const deleteMutation = trpc.documents.delete.useMutation({
    onSuccess: () => { utils.documents.all.invalidate(); toast.success("Document deleted"); },
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        const result = await uploadMutation.mutateAsync({
          fileName: file.name,
          fileData: base64,
          contentType: file.type,
        });
        setFileUrl(result.url);
        if (!title) setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
        toast.success("File uploaded");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Upload failed");
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileUrl) { toast.error("Title and file are required"); return; }
    await createMutation.mutateAsync({ title, description, category, fileUrl });
    setTitle(""); setDescription(""); setFileUrl(""); setCategory("general");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Upload New Document</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Document title" />
              </div>
              <div>
                <Label>Category</Label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {DOC_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description" />
            </div>
            <div>
              <Label>File</Label>
              {fileUrl ? (
                <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 truncate flex-1">File uploaded</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setFileUrl("")}>Change</Button>
                </div>
              ) : (
                <Input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={handleFileUpload} disabled={uploading} />
              )}
              {uploading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Or paste external URL:</span>
              <Input
                value={fileUrl}
                onChange={e => setFileUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1"
              />
            </div>
            <Button type="submit" disabled={createMutation.isPending || !title || !fileUrl}>
              <Plus className="w-4 h-4 mr-1" /> Add Document
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : docs && docs.length > 0 ? (
        <Card>
          <CardHeader><CardTitle>All Documents ({docs.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {docs.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <FileText className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">
                      <Badge variant="outline" className="mr-2">{doc.category}</Badge>
                      {doc.description}
                    </p>
                  </div>
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm"><Upload className="w-3 h-3" /></Button>
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate({ id: doc.id })}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No documents uploaded yet. Add your first document above.</p>
        </Card>
      )}
    </div>
  );
}
