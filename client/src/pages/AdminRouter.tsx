import { Route, Switch } from "wouter";
import { lazy, Suspense } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy-load admin pages for better code splitting
const DashboardHome = lazy(() => import("./admin/DashboardHome"));
const GalleryManager = lazy(() => import("./admin/GalleryManager"));
const UserManager = lazy(() => import("./admin/UserManager"));
const SettingsManager = lazy(() => import("./admin/SettingsManager"));

import { FormExport } from "./admin/FormExport";
const FaqManager = lazy(() => import("./admin/FaqManager"));
const VolunteerNeedsManager = lazy(() => import("./admin/VolunteerNeedsManager"));
const NeedsAttention = lazy(() => import("./admin/NeedsAttention"));
const ClosureManager = lazy(() => import("./admin/ClosureManager").then(m => ({ default: m.ClosureManager })));

// Legacy managers from Admin.tsx (imported eagerly since they're in a single file)
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
          {/* Fallback to dashboard */}
          <Route component={() => <DashboardHome />} />
        </Switch>
      </Suspense>
    </AdminLayout>
  );
}
