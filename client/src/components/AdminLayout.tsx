import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getLoginUrl } from "@/const";
import { type UserRole, type AdminSection, hasAccess, isStaffRole, ROLE_LABELS } from "@shared/roles";
import {
  Shield, Menu, X, Home, Newspaper, FileText, Calendar,
  Users, Camera, Heart, BookOpen, GraduationCap, Cross,
  UserPlus, ChevronDown, LogOut, Settings,
} from "lucide-react";

type NavGroup = {
  title: string;
  section: AdminSection;
  items: {
    label: string;
    section: AdminSection;
    icon: typeof Home;
    path: string;
  }[];
};

const navGroups: NavGroup[] = [
  {
    title: "Communications",
    section: "news",
    items: [
      { label: "News & Announcements", section: "news", icon: Newspaper, path: "/admin/news" },
      { label: "Weekly Bulletins", section: "bulletins", icon: BookOpen, path: "/admin/bulletins" },
      { label: "Photo Gallery", section: "gallery", icon: Camera, path: "/admin/gallery" },
      { label: "Subscribers", section: "subscribers", icon: Users, path: "/admin/subscribers" },
    ],
  },
  {
    title: "Parish Life",
    section: "events",
    items: [
      { label: "Events", section: "events", icon: Calendar, path: "/admin/events" },
      { label: "Key Dates", section: "key_dates", icon: Calendar, path: "/admin/key-dates" },
      { label: "Volunteers", section: "volunteers", icon: Heart, path: "/admin/volunteers" },
      { label: "Registrations", section: "registrations", icon: UserPlus, path: "/admin/registrations" },
    ],
  },
  {
    title: "Religious Education",
    section: "ccd_registrations",
    items: [
      { label: "CCD Registrations", section: "ccd_registrations", icon: GraduationCap, path: "/admin/ccd" },
      { label: "CCD Calendar", section: "ccd_calendar", icon: Calendar, path: "/admin/ccd-calendar" },
      { label: "CCD Permissions", section: "ccd_permissions", icon: FileText, path: "/admin/ccd-permissions" },
      { label: "Documents", section: "documents", icon: FileText, path: "/admin/documents" },
    ],
  },
  {
    title: "Youth Ministry",
    section: "cyo",
    items: [
      { label: "CYO Basketball", section: "cyo", icon: Calendar, path: "/admin/cyo" },
      { label: "Teen Life", section: "teen_life", icon: Users, path: "/admin/teen-life" },
    ],
  },
  {
    title: "Sacraments",
    section: "sacraments",
    items: [
      { label: "Sacrament Requests", section: "sacraments", icon: Cross, path: "/admin/sacraments" },
    ],
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="space-y-4 w-64">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border p-8 max-w-md w-full text-center">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to access the admin dashboard.</p>
          <a href={getLoginUrl()}>
            <Button size="lg">Sign In</Button>
          </a>
        </div>
      </div>
    );
  }

  const userRole = (user?.role || "user") as UserRole;

  if (!isStaffRole(userRole)) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border p-8 max-w-md w-full text-center">
          <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">Only parish staff can access this dashboard.</p>
          <Link href="/">
            <Button variant="outline">Return to Website</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Filter nav groups based on user's role
  const visibleGroups = navGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => hasAccess(userRole, item.section)),
    }))
    .filter(group => group.items.length > 0);

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto h-screen w-[280px] bg-white border-r flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-serif font-bold text-primary">Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {/* Dashboard Home */}
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              location === "/admin"
                ? "bg-primary/10 text-primary"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>

          {/* Nav Groups */}
          {visibleGroups.map((group) => (
            <NavGroupComponent
              key={group.title}
              group={group}
              location={location}
              onNavigate={() => setSidebarOpen(false)}
            />
          ))}

          {/* User Management - admin only */}
          {hasAccess(userRole, "users") && (
            <Link
              href="/admin/users"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location === "/admin/users"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Settings className="w-4 h-4" />
              User Management
            </Link>
          )}
        </nav>

        {/* Sidebar Footer - User Info */}
        <div className="border-t p-3">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">
                {user?.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "Staff"}</p>
              <p className="text-[11px] text-muted-foreground">{ROLE_LABELS[userRole]}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Link href="/" className="flex-1">
              <Button variant="ghost" size="sm" className="w-full text-xs gap-1.5">
                <LogOut className="w-3 h-3" /> View Site
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar (mobile) */}
        <header className="sticky top-0 z-30 bg-white border-b lg:hidden">
          <div className="flex items-center justify-between px-4 h-14">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-serif font-bold text-primary text-sm">Admin</span>
            </div>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

// Collapsible nav group component
function NavGroupComponent({
  group,
  location,
  onNavigate,
}: {
  group: NavGroup & { items: typeof navGroups[0]["items"] };
  location: string;
  onNavigate: () => void;
}) {
  const isActive = group.items.some(item => location === item.path);
  const [open, setOpen] = useState(isActive);

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
      >
        {group.title}
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && (
        <div className="mt-0.5 space-y-0.5">
          {group.items.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                location === item.path
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              }`}
              onClick={onNavigate}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
