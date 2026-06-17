/**
 * Admin Dashboard Home — Thin composition importing from dashboard/.
 */

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
  Newspaper, Users, Camera, Calendar, Heart,
  UserPlus, Cross, GraduationCap, AlertCircle,
  Megaphone, Check, Pencil,
} from "lucide-react";
import { ActivityFeed, QuickActions, StatCard } from "./dashboard/ActivityFeed";

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
    } catch { toast.error("Failed to update banner"); }
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
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-600" />Pending Actions</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.pendingCcdRegistrations > 0 && <Link href="/ccd"><Badge variant="outline" className="cursor-pointer hover:bg-amber-100 border-amber-300">{stats.pendingCcdRegistrations} CCD Registration{stats.pendingCcdRegistrations > 1 ? "s" : ""}</Badge></Link>}
              {stats.pendingParishRegistrations > 0 && <Link href="/registrations"><Badge variant="outline" className="cursor-pointer hover:bg-amber-100 border-amber-300">{stats.pendingParishRegistrations} Parish Registration{stats.pendingParishRegistrations > 1 ? "s" : ""}</Badge></Link>}
              {stats.pendingBaptisms > 0 && <Link href="/sacraments"><Badge variant="outline" className="cursor-pointer hover:bg-amber-100 border-amber-300">{stats.pendingBaptisms} Baptism Request{stats.pendingBaptisms > 1 ? "s" : ""}</Badge></Link>}
              {stats.pendingMarriages > 0 && <Link href="/sacraments"><Badge variant="outline" className="cursor-pointer hover:bg-amber-100 border-amber-300">{stats.pendingMarriages} Marriage Inquir{stats.pendingMarriages > 1 ? "ies" : "y"}</Badge></Link>}
              {stats.pendingTeenLife > 0 && <Link href="/teen-life"><Badge variant="outline" className="cursor-pointer hover:bg-amber-100 border-amber-300">{stats.pendingTeenLife} Teen Life Registration{stats.pendingTeenLife > 1 ? "s" : ""}</Badge></Link>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Announcement Banner */}
      <Card className="border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2"><Megaphone className="w-4 h-4 text-primary" /><span className="text-sm font-medium">Announcement Banner</span></div>
          {editingBanner ? (
            <div className="flex items-center gap-2">
              <Input value={bannerText} onChange={(e) => setBannerText(e.target.value)} placeholder="Enter announcement text..." className="flex-1 text-sm" onKeyDown={(e) => e.key === "Enter" && handleSaveBanner()} />
              <Button size="sm" onClick={handleSaveBanner} disabled={updateSetting.isPending}><Check className="w-3.5 h-3.5" /></Button>
              <Button size="sm" variant="outline" onClick={() => { setEditingBanner(false); setBannerText(marqueeData?.value || ""); }}>Cancel</Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground flex-1 truncate">{marqueeData?.value || "No announcement set"}</p>
              <Button size="sm" variant="outline" onClick={() => setEditingBanner(true)}><Pencil className="w-3.5 h-3.5 mr-1" />Edit</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => <Card key={i}><CardContent className="p-4"><Skeleton className="h-4 w-16 mb-2" /><Skeleton className="h-8 w-12" /></CardContent></Card>)}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard icon={Newspaper} label="News Posts" value={stats.totalNews} href="/news" color="text-blue-600" />
          <StatCard icon={Calendar} label="Events" value={stats.totalEvents} href="/events" color="text-green-600" />
          <StatCard icon={Users} label="Subscribers" value={stats.activeSubscribers} href="/subscribers" color="text-purple-600" />
          <StatCard icon={Camera} label="Gallery Photos" value={stats.totalGalleryPhotos} href="/gallery" color="text-pink-600" />
          <StatCard icon={Heart} label="Volunteer Signups" value={stats.totalVolunteerSignups} href="/volunteers" color="text-red-600" />
          <StatCard icon={GraduationCap} label="Pending CCD" value={stats.pendingCcdRegistrations} href="/ccd" color="text-amber-600" highlight={stats.pendingCcdRegistrations > 0} />
          <StatCard icon={UserPlus} label="Pending Parish Reg." value={stats.pendingParishRegistrations} href="/registrations" color="text-green-700" highlight={stats.pendingParishRegistrations > 0} />
          <StatCard icon={Cross} label="Pending Baptisms" value={stats.pendingBaptisms} href="/sacraments" color="text-indigo-600" highlight={stats.pendingBaptisms > 0} />
          <StatCard icon={Cross} label="Pending Marriages" value={stats.pendingMarriages} href="/sacraments" color="text-rose-600" highlight={stats.pendingMarriages > 0} />
          <StatCard icon={Users} label="Pending Teen Life" value={stats.pendingTeenLife} href="/teen-life" color="text-orange-600" highlight={stats.pendingTeenLife > 0} />
        </div>
      ) : null}

      <ActivityFeed activity={activity as any} isLoading={activityLoading} />
      <QuickActions />
    </div>
  );
}
