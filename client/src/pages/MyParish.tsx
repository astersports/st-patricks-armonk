/**
 * MyParish — Personalized dashboard for authenticated parishioners.
 * Shows their prayer intentions, volunteer signups, upcoming events, and quick actions.
 */
import { SEO } from "@/components/SEO";
import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  Calendar,
  Flame,
  HandHeart,
  Heart,
  BookOpen,
  Church,
  ArrowRight,
  User,
} from "lucide-react";
import { getLoginUrl } from "@/const";

export default function MyParish() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <PageLayout>
        <div className="container max-w-4xl py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <SEO title="My Parish" path="/my-parish" description="Your personalized parish dashboard" />
        <div className="container max-w-lg py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-serif font-bold mb-3">Welcome to My Parish</h1>
          <p className="text-muted-foreground mb-6">
            Sign in to access your personalized parish dashboard — see your prayer intentions,
            volunteer signups, and upcoming events all in one place.
          </p>
          <Button asChild size="lg">
            <a href={getLoginUrl()}>Sign In to Continue</a>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO title="My Parish" path="/my-parish" description="Your personalized parish dashboard" />
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-serif font-bold">
            Welcome back, {user.name?.split(" ")[0] || "Parishioner"}
          </h1>
          <p className="text-muted-foreground mt-1">Your parish at a glance</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Church className="w-4 h-4 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <QuickAction href="/prayers" icon={Flame} label="Light a Candle" />
              <QuickAction href="/volunteer-needs" icon={HandHeart} label="Help Out" />
              <QuickAction href="/calendar" icon={Calendar} label="Calendar" />
              <QuickAction href="/bulletins" icon={BookOpen} label="Bulletin" />
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <UpcomingEventsCard />

          {/* My Prayers */}
          <MyPrayersCard />

          {/* Volunteer Activity */}
          <VolunteerActivityCard />
        </div>
      </div>
    </PageLayout>
  );
}

function QuickAction({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </Link>
  );
}

function UpcomingEventsCard() {
  const { data: events } = trpc.events.listUpcoming.useQuery();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Coming Up
          </CardTitle>
          <Link href="/calendar" className="text-xs text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {!events || events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming events.</p>
        ) : (
          <div className="space-y-2">
            {events.map((event: any) => (
              <div key={event.id} className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] text-primary font-semibold uppercase">
                    {new Date(event.date || event.startDate).toLocaleDateString("en-US", { month: "short" })}
                  </span>
                  <span className="text-sm font-bold text-primary leading-none">
                    {new Date(event.date || event.startDate).getDate()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{event.title}</p>
                  {event.time && <p className="text-xs text-muted-foreground">{event.time}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MyPrayersCard() {
  const { data } = trpc.prayerWall.getIntentions.useQuery();
  const intentions = data?.intentions?.slice(0, 3) || [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            Prayer Wall
          </CardTitle>
          <Link href="/prayers" className="text-xs text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {intentions.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">No prayer intentions yet.</p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/prayers">Light a Candle</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {intentions.map((item: any) => (
              <div key={item.id} className="flex items-start gap-2 text-sm">
                <Heart className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="line-clamp-1">{item.intention}</p>
                  {item.name && (
                    <p className="text-xs text-muted-foreground">— {item.name}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function VolunteerActivityCard() {
  const { data: needs } = trpc.volunteerNeeds.list.useQuery();
  const activeNeeds = needs?.filter((n: any) => n.spotsNeeded - n.spotsFilled > 0) || [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <HandHeart className="w-4 h-4 text-primary" />
            Help Needed
          </CardTitle>
          <Link href="/volunteer-needs" className="text-xs text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {activeNeeds.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">No urgent needs right now.</p>
            <Link href="/volunteer" className="text-xs text-primary hover:underline mt-1 inline-block">
              See ongoing opportunities →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {activeNeeds.slice(0, 3).map((need: any) => (
              <div key={need.id} className="flex items-center justify-between text-sm">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{need.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {need.spotsNeeded - need.spotsFilled} spot{need.spotsNeeded - need.spotsFilled !== 1 ? "s" : ""} left
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    need.urgency === "high"
                      ? "bg-red-100 text-red-800"
                      : need.urgency === "medium"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }
                >
                  {need.urgency}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
