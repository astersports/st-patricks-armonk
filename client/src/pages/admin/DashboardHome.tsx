import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  Newspaper, BookOpen, Users, Camera, Calendar, Heart,
  UserPlus, Cross, GraduationCap, AlertCircle, Bell,
  Baby, HeartHandshake, Church, ShieldCheck, Megaphone, Check, Pencil,
} from "lucide-react";

const TYPE_CONFIG: Record<string, { label: string; icon: typeof Bell; color: string; bgColor: string }> = {
  baptism: { label: "Baptism", icon: Baby, color: "text-indigo-600", bgColor: "bg-indigo-50" },
  marriage: { label: "Marriage", icon: HeartHandshake, color: "text-rose-600", bgColor: "bg-rose-50" },
  ccd: { label: "CCD Registration", icon: GraduationCap, color: "text-amber-600", bgColor: "bg-amber-50" },
  parish_registration: { label: "Parish Registration", icon: Church, color: "text-teal-600", bgColor: "bg-teal-50" },
  teen_life: { label: "Teen Life", icon: Users, color: "text-orange-600", bgColor: "bg-orange-50" },
  ccd_permission: { label: "CCD Permission", icon: ShieldCheck, color: "text-purple-600", bgColor: "bg-purple-50" },
};

function timeAgo(date: Date | string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export default function DashboardHome() {
  const { data: stats, isLoading } = trpc.adminStats.overview.useQuery();
  const { data: activity, isLoading: activityLoading } = trpc.adminStats.recentActivity.useQuery();
  const { data: marqueeData } = trpc.siteSettings.get.useQuery({ key: "marquee_text" });
  const utils = trpc.useUtils();
  const updateSetting = trpc.siteSettings.update.useMutation();

  const [editingBanner, setEditingBanner] = useState(false);
  const [bannerText, setBannerText] = useState("");

  useEffect(() => {
    if (marqueeData?.value) setBannerText(marqueeData.value);
  }, [marqueeData]);

  const handleSaveBanner = async () => {
    try {
      await updateSetting.mutateAsync({ key: "marquee_text", value: bannerText });
      utils.siteSettings.get.invalidate();
      setEditingBanner(false);
      toast.success("Announcement banner updated!");
    } catch {
      toast.error("Failed to update banner");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here's an overview of your parish.</p>
      </div>

      {/* Pending Actions */}
      {stats && (stats.pendingCcdRegistrations > 0 || stats.pendingParishRegistrations > 0 || stats.pendingBaptisms > 0 || stats.pendingMarriages > 0 || stats.pendingTeenLife > 0) && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Pending Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.pendingCcdRegistrations > 0 && (
                <Link href="/ccd">
                  <Badge variant="outline" className="cursor-pointer hover:bg-amber-100 border-amber-300">
                    {stats.pendingCcdRegistrations} CCD Registration{stats.pendingCcdRegistrations > 1 ? "s" : ""}
                  </Badge>
                </Link>
              )}
              {stats.pendingParishRegistrations > 0 && (
                <Link href="/registrations">
                  <Badge variant="outline" className="cursor-pointer hover:bg-amber-100 border-amber-300">
                    {stats.pendingParishRegistrations} Parish Registration{stats.pendingParishRegistrations > 1 ? "s" : ""}
                  </Badge>
                </Link>
              )}
              {stats.pendingBaptisms > 0 && (
                <Link href="/sacraments">
                  <Badge variant="outline" className="cursor-pointer hover:bg-amber-100 border-amber-300">
                    {stats.pendingBaptisms} Baptism Request{stats.pendingBaptisms > 1 ? "s" : ""}
                  </Badge>
                </Link>
              )}
              {stats.pendingMarriages > 0 && (
                <Link href="/sacraments">
                  <Badge variant="outline" className="cursor-pointer hover:bg-amber-100 border-amber-300">
                    {stats.pendingMarriages} Marriage Inquir{stats.pendingMarriages > 1 ? "ies" : "y"}
                  </Badge>
                </Link>
              )}
              {stats.pendingTeenLife > 0 && (
                <Link href="/teen-life">
                  <Badge variant="outline" className="cursor-pointer hover:bg-amber-100 border-amber-300">
                    {stats.pendingTeenLife} Teen Life Registration{stats.pendingTeenLife > 1 ? "s" : ""}
                  </Badge>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Edit: Announcement Banner */}
      <Card className="border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Megaphone className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Announcement Banner</span>
          </div>
          {editingBanner ? (
            <div className="flex items-center gap-2">
              <Input
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="Enter announcement text..."
                className="flex-1 text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleSaveBanner()}
              />
              <Button size="sm" onClick={handleSaveBanner} disabled={updateSetting.isPending}>
                <Check className="w-3.5 h-3.5" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setEditingBanner(false); setBannerText(marqueeData?.value || ""); }}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground flex-1 truncate">
                {marqueeData?.value || "No announcement set"}
              </p>
              <Button size="sm" variant="outline" onClick={() => setEditingBanner(true)}>
                <Pencil className="w-3.5 h-3.5 mr-1" />
                Edit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard icon={Newspaper} label="News Posts" value={stats.totalNews} href="/news" color="text-blue-600" />
          <StatCard icon={Calendar} label="Events" value={stats.totalEvents} href="/events" color="text-green-600" />
          <StatCard icon={Users} label="Subscribers" value={stats.activeSubscribers} href="/subscribers" color="text-purple-600" />
          <StatCard icon={Camera} label="Gallery Photos" value={stats.totalGalleryPhotos} href="/gallery" color="text-pink-600" />
          <StatCard icon={Heart} label="Volunteer Signups" value={stats.totalVolunteerSignups} href="/volunteers" color="text-red-600" />
          <StatCard icon={GraduationCap} label="Pending CCD" value={stats.pendingCcdRegistrations} href="/ccd" color="text-amber-600" highlight={stats.pendingCcdRegistrations > 0} />
          <StatCard icon={UserPlus} label="Pending Parish Reg." value={stats.pendingParishRegistrations} href="/registrations" color="text-teal-600" highlight={stats.pendingParishRegistrations > 0} />
          <StatCard icon={Cross} label="Pending Baptisms" value={stats.pendingBaptisms} href="/sacraments" color="text-indigo-600" highlight={stats.pendingBaptisms > 0} />
          <StatCard icon={Cross} label="Pending Marriages" value={stats.pendingMarriages} href="/sacraments" color="text-rose-600" highlight={stats.pendingMarriages > 0} />
          <StatCard icon={Users} label="Pending Teen Life" value={stats.pendingTeenLife} href="/teen-life" color="text-orange-600" highlight={stats.pendingTeenLife > 0} />
        </div>
      ) : null}

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Recent Form Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activityLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : activity && activity.length > 0 ? (
            <div className="space-y-1">
              {activity.map((item, i) => {
                const config = TYPE_CONFIG[item.type] || { label: item.type, icon: Bell, color: "text-gray-600", bgColor: "bg-gray-50" };
                const Icon = config.icon;
                return (
                  <div key={`${item.type}-${item.id}-${i}`} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{config.label}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {item.status === "pending" && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-300 text-amber-700 bg-amber-50">
                          Pending
                        </Badge>
                      )}
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        {timeAgo(item.createdAt!)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              No form submissions yet. They'll appear here as parishioners submit forms.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <QuickAction href="/news" icon={Newspaper} label="Create News Post" description="Publish an announcement" />
          <QuickAction href="/gallery" icon={Camera} label="Upload Photos" description="Add to the photo gallery" />
          <QuickAction href="/events" icon={Calendar} label="Add Event" description="Schedule a parish event" />
          <QuickAction href="/bulletins" icon={BookOpen} label="Upload Bulletin" description="Post this week's bulletin" />
          <QuickAction href="/key-dates" icon={Calendar} label="Manage Key Dates" description="Update important dates" />
          <QuickAction href="/users" icon={Users} label="Manage Staff" description="Assign department roles" />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  color,
  highlight,
}: {
  icon: typeof Newspaper;
  label: string;
  value: number;
  href: string;
  color: string;
  highlight?: boolean;
}) {
  return (
    <Link href={href}>
      <Card className={`cursor-pointer hover:shadow-md transition-shadow ${highlight ? "border-amber-300 bg-amber-50/30" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide truncate">
              {label}
            </span>
          </div>
          <p className="text-2xl font-bold">{value}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
  description,
}: {
  href: string;
  icon: typeof Newspaper;
  label: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <Card className="cursor-pointer hover:shadow-md transition-all hover:border-primary/30 group">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">{label}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
