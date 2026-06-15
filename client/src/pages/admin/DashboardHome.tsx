import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  Newspaper, BookOpen, Users, Camera, Calendar, Heart,
  UserPlus, Cross, GraduationCap, AlertCircle,
} from "lucide-react";

export default function DashboardHome() {
  const { data: stats, isLoading } = trpc.adminStats.overview.useQuery();

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
                <Link href="/admin/ccd">
                  <Badge variant="outline" className="cursor-pointer hover:bg-amber-100 border-amber-300">
                    {stats.pendingCcdRegistrations} CCD Registration{stats.pendingCcdRegistrations > 1 ? "s" : ""}
                  </Badge>
                </Link>
              )}
              {stats.pendingParishRegistrations > 0 && (
                <Link href="/admin/registrations">
                  <Badge variant="outline" className="cursor-pointer hover:bg-amber-100 border-amber-300">
                    {stats.pendingParishRegistrations} Parish Registration{stats.pendingParishRegistrations > 1 ? "s" : ""}
                  </Badge>
                </Link>
              )}
              {stats.pendingBaptisms > 0 && (
                <Link href="/admin/sacraments">
                  <Badge variant="outline" className="cursor-pointer hover:bg-amber-100 border-amber-300">
                    {stats.pendingBaptisms} Baptism Request{stats.pendingBaptisms > 1 ? "s" : ""}
                  </Badge>
                </Link>
              )}
              {stats.pendingMarriages > 0 && (
                <Link href="/admin/sacraments">
                  <Badge variant="outline" className="cursor-pointer hover:bg-amber-100 border-amber-300">
                    {stats.pendingMarriages} Marriage Inquir{stats.pendingMarriages > 1 ? "ies" : "y"}
                  </Badge>
                </Link>
              )}
              {stats.pendingTeenLife > 0 && (
                <Link href="/admin/teen-life">
                  <Badge variant="outline" className="cursor-pointer hover:bg-amber-100 border-amber-300">
                    {stats.pendingTeenLife} Teen Life Registration{stats.pendingTeenLife > 1 ? "s" : ""}
                  </Badge>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
          <StatCard
            icon={Newspaper}
            label="News Posts"
            value={stats.totalNews}
            href="/admin/news"
            color="text-blue-600"
          />
          <StatCard
            icon={Calendar}
            label="Events"
            value={stats.totalEvents}
            href="/admin/events"
            color="text-green-600"
          />
          <StatCard
            icon={Users}
            label="Subscribers"
            value={stats.activeSubscribers}
            href="/admin/subscribers"
            color="text-purple-600"
          />
          <StatCard
            icon={Camera}
            label="Gallery Photos"
            value={stats.totalGalleryPhotos}
            href="/admin/gallery"
            color="text-pink-600"
          />
          <StatCard
            icon={Heart}
            label="Volunteer Signups"
            value={stats.totalVolunteerSignups}
            href="/admin/volunteers"
            color="text-red-600"
          />
          <StatCard
            icon={GraduationCap}
            label="Pending CCD"
            value={stats.pendingCcdRegistrations}
            href="/admin/ccd"
            color="text-amber-600"
            highlight={stats.pendingCcdRegistrations > 0}
          />
          <StatCard
            icon={UserPlus}
            label="Pending Parish Reg."
            value={stats.pendingParishRegistrations}
            href="/admin/registrations"
            color="text-teal-600"
            highlight={stats.pendingParishRegistrations > 0}
          />
          <StatCard
            icon={Cross}
            label="Pending Baptisms"
            value={stats.pendingBaptisms}
            href="/admin/sacraments"
            color="text-indigo-600"
            highlight={stats.pendingBaptisms > 0}
          />
          <StatCard
            icon={Cross}
            label="Pending Marriages"
            value={stats.pendingMarriages}
            href="/admin/sacraments"
            color="text-rose-600"
            highlight={stats.pendingMarriages > 0}
          />
          <StatCard
            icon={Users}
            label="Pending Teen Life"
            value={stats.pendingTeenLife}
            href="/admin/teen-life"
            color="text-orange-600"
            highlight={stats.pendingTeenLife > 0}
          />
        </div>
      ) : null}

      {/* Quick Actions */}
      <div>
        <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <QuickAction href="/admin/news" icon={Newspaper} label="Create News Post" description="Publish an announcement" />
          <QuickAction href="/admin/gallery" icon={Camera} label="Upload Photos" description="Add to the photo gallery" />
          <QuickAction href="/admin/events" icon={Calendar} label="Add Event" description="Schedule a parish event" />
          <QuickAction href="/admin/bulletins" icon={BookOpen} label="Upload Bulletin" description="Post this week's bulletin" />
          <QuickAction href="/admin/key-dates" icon={Calendar} label="Manage Key Dates" description="Update important dates" />
          <QuickAction href="/admin/users" icon={Users} label="Manage Staff" description="Assign department roles" />
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
