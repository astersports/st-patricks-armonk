import { Route, Switch } from "wouter";
import { lazy, Suspense } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy-load admin pages for better code splitting
const DashboardHome = lazy(() => import("./admin/DashboardHome"));
const GalleryManager = lazy(() => import("./admin/GalleryManager"));
const UserManager = lazy(() => import("./admin/UserManager"));
const SettingsManager = lazy(() => import("./admin/SettingsManager"));

const FormExport = lazy(() => import("./admin/FormExport").then(m => ({ default: m.FormExport })));
const FaqManager = lazy(() => import("./admin/FaqManager"));
const VolunteerNeedsManager = lazy(() => import("./admin/VolunteerNeedsManager"));
const NeedsAttention = lazy(() => import("./admin/NeedsAttention"));
const ClosureManager = lazy(() => import("./admin/ClosureManager").then(m => ({ default: m.ClosureManager })));
const ScheduleManager = lazy(() => import("./admin/ScheduleManager"));
const MassIntentionsManager = lazy(() => import("./admin/MassIntentionsManager").then(m => ({ default: m.MassIntentionsManager })));

// Legacy managers — lazy-loaded from individual files for proper code splitting
const NewsManager = lazy(() => import("./admin/NewsManager").then(m => ({ default: m.NewsManager })));
const BulletinManager = lazy(() => import("./admin/BulletinManager").then(m => ({ default: m.BulletinManager })));
const EventManager = lazy(() => import("./admin/EventManager").then(m => ({ default: m.EventManager })));
const SubscriberList = lazy(() => import("./admin/SubscriberList").then(m => ({ default: m.SubscriberList })));
const CcdManager = lazy(() => import("./admin/CcdManager").then(m => ({ default: m.CcdManager })));
const CyoManager = lazy(() => import("./admin/CyoManager").then(m => ({ default: m.CyoManager })));
const VolunteerManager = lazy(() => import("./admin/VolunteerManager").then(m => ({ default: m.VolunteerManager })));
const DocumentsManager = lazy(() => import("./admin/DocumentsManager").then(m => ({ default: m.DocumentsManager })));
const SacramentsManager = lazy(() => import("./admin/SacramentsManager").then(m => ({ default: m.SacramentsManager })));
const ParishRegistrationsManager = lazy(() => import("./admin/ParishRegistrationsManager").then(m => ({ default: m.ParishRegistrationsManager })));
const CcdPermissionsManager = lazy(() => import("./admin/CcdPermissionsManager").then(m => ({ default: m.CcdPermissionsManager })));
const KeyDatesManager = lazy(() => import("./admin/KeyDatesManager").then(m => ({ default: m.KeyDatesManager })));

function AdminFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function AdminRouter() {
  return (
    <AdminLayout>
      <Suspense fallback={<AdminFallback />}>
        <Switch>
          <Route path="/" component={() => <DashboardHome />} />
          <Route path="/news" component={() => <NewsManager />} />
          <Route path="/bulletins" component={() => <BulletinManager />} />
          <Route path="/gallery" component={() => <GalleryManager />} />
          <Route path="/subscribers" component={() => <SubscriberList />} />
          <Route path="/events" component={() => <EventManager />} />
          <Route path="/key-dates" component={() => <KeyDatesManager />} />
          <Route path="/volunteers" component={() => <VolunteerManager />} />
          <Route path="/volunteer-needs" component={() => <VolunteerNeedsManager />} />
          <Route path="/needs-attention" component={() => <NeedsAttention />} />
          <Route path="/registrations" component={() => <ParishRegistrationsManager />} />
          <Route path="/ccd" component={() => <CcdManager />} />
          <Route path="/ccd-calendar" component={() => <CcdManager />} />
          <Route path="/ccd-permissions" component={() => <CcdPermissionsManager />} />
          <Route path="/documents" component={() => <DocumentsManager />} />
          <Route path="/cyo" component={() => <CyoManager />} />
          <Route path="/teen-life" component={() => <CyoManager />} />
          <Route path="/sacraments" component={() => <SacramentsManager />} />
          <Route path="/users" component={() => <UserManager />} />
          <Route path="/settings" component={() => <SettingsManager />} />
          <Route path="/form-export" component={() => <FormExport />} />
          <Route path="/faq" component={() => <FaqManager />} />
          <Route path="/closure" component={() => <ClosureManager />} />
          <Route path="/schedule" component={() => <ScheduleManager />} />
          <Route path="/mass-intentions" component={() => <MassIntentionsManager />} />
          {/* Fallback to dashboard */}
          <Route component={() => <DashboardHome />} />
        </Switch>
      </Suspense>
    </AdminLayout>
  );
}
