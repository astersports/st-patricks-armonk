import { useAuth } from "@/_core/hooks/useAuth";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper, FileText, Calendar, Users, Shield } from "lucide-react";
import { getLoginUrl } from "@/const";
import {
  NewsManager,
  BulletinManager,
  EventManager,
  SubscriberList,
  CcdManager,
  CyoManager,
  VolunteerManager,
  DocumentsManager,
  SacramentsManager,
  ParishRegistrationsManager,
  CcdPermissionsManager,
  KeyDatesManager,
} from "./admin";

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
            <TabsTrigger value="sacraments" className="gap-2"><FileText className="w-4 h-4" /> Sacraments</TabsTrigger>
            <TabsTrigger value="registrations" className="gap-2"><Users className="w-4 h-4" /> Registrations</TabsTrigger>
            <TabsTrigger value="permissions" className="gap-2"><Shield className="w-4 h-4" /> CCD Permissions</TabsTrigger>
            <TabsTrigger value="keydates" className="gap-2"><Calendar className="w-4 h-4" /> Key Dates</TabsTrigger>
          </TabsList>

          <TabsContent value="news"><NewsManager /></TabsContent>
          <TabsContent value="bulletins"><BulletinManager /></TabsContent>
          <TabsContent value="events"><EventManager /></TabsContent>
          <TabsContent value="ccd"><CcdManager /></TabsContent>
          <TabsContent value="cyo"><CyoManager /></TabsContent>
          <TabsContent value="volunteers"><VolunteerManager /></TabsContent>
          <TabsContent value="documents"><DocumentsManager /></TabsContent>
          <TabsContent value="subscribers"><SubscriberList /></TabsContent>
          <TabsContent value="sacraments"><SacramentsManager /></TabsContent>
          <TabsContent value="registrations"><ParishRegistrationsManager /></TabsContent>
          <TabsContent value="permissions"><CcdPermissionsManager /></TabsContent>
          <TabsContent value="keydates"><KeyDatesManager /></TabsContent>
        </Tabs>
      </section>
    </PageLayout>
  );
}
