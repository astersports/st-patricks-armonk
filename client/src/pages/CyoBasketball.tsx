import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Trophy, MapPin, Calendar, Users, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default function CyoBasketball() {
  const { data: teams, isLoading: teamsLoading } = trpc.cyo.listTeams.useQuery();
  const { data: games, isLoading: gamesLoading } = trpc.cyo.listGames.useQuery();

  const upcomingGames = games?.filter(g => g.status === "scheduled") ?? [];
  const completedGames = games?.filter(g => g.status === "completed") ?? [];

  return (
    <PageLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-green-50 to-white py-12 border-b-4 border-primary">
        <div className="container">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="w-8 h-8 text-accent" />
            <h1 className="font-serif text-4xl md:text-5xl text-foreground">CYO Basketball</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            St. Patrick's CYO Basketball program — schedules, standings, and game results for all our teams.
          </p>
        </div>
      </section>

      {/* Google Calendar Link */}
      <section className="py-4 bg-green-50/50 border-b border-border">
        <div className="container">
          <a
            href="https://calendar.google.com/calendar/embed"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Calendar className="w-4 h-4" />
            View Full CYO Calendar in Google Calendar
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10">
        <div className="container">
          <Tabs defaultValue="schedule" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            {/* Schedule Tab */}
            <TabsContent value="schedule">
              <h2 className="font-serif text-2xl text-foreground mb-4">Upcoming Games</h2>
              {gamesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : upcomingGames.length === 0 ? (
                <Card className="p-8 text-center">
                  <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No upcoming games scheduled.</p>
                  <p className="text-sm text-muted-foreground mt-1">Check back when the season begins!</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {upcomingGames.map(game => {
                    const team = teams?.find(t => t.id === game.teamId);
                    return (
                      <Card key={game.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 rounded-lg p-2 shrink-0">
                              <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                {team?.name ?? "TBD"} vs {game.opponent}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(game.gameDate), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-10 md:ml-0">
                            <Badge variant={game.homeAway === "home" ? "default" : "secondary"}>
                              {game.homeAway === "home" ? "Home" : "Away"}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {game.location}
                            </span>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Teams Tab */}
            <TabsContent value="teams">
              <h2 className="font-serif text-2xl text-foreground mb-4">Our Teams</h2>
              {teamsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : !teams || teams.length === 0 ? (
                <Card className="p-8 text-center">
                  <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No teams registered yet for this season.</p>
                  <p className="text-sm text-muted-foreground mt-1">Teams will be posted when the season begins.</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teams.map(team => (
                    <Card key={team.id} className="p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">{team.name}</h3>
                          <p className="text-sm text-muted-foreground">{team.division} • {team.ageGroup}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0">{team.season}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-600 font-medium">{team.wins}W</span>
                        <span className="text-red-500 font-medium">{team.losses}L</span>
                        {team.coachName && (
                          <span className="text-muted-foreground">Coach: {team.coachName}</span>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results">
              <h2 className="font-serif text-2xl text-foreground mb-4">Game Results</h2>
              {gamesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : completedGames.length === 0 ? (
                <Card className="p-8 text-center">
                  <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No completed games yet.</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {completedGames.map(game => {
                    const team = teams?.find(t => t.id === game.teamId);
                    const won = (game.ourScore ?? 0) > (game.theirScore ?? 0);
                    return (
                      <Card key={game.id} className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-foreground">
                              {team?.name ?? "TBD"} vs {game.opponent}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(game.gameDate), "MMM d, yyyy")} • {game.location}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-2xl font-bold ${won ? "text-green-600" : "text-red-500"}`}>
                              {game.ourScore} – {game.theirScore}
                            </span>
                            <Badge variant={won ? "default" : "destructive"}>
                              {won ? "WIN" : "LOSS"}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Info Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-green-50/50">
              <h3 className="font-serif text-lg text-foreground mb-3">About CYO Basketball</h3>
              <p className="text-sm text-muted-foreground mb-3">
                The CYO (Catholic Youth Organization) Basketball program at St. Patrick's provides boys and girls in grades 3–8 with the opportunity to develop basketball skills, teamwork, and sportsmanship in a faith-based environment.
              </p>
              <p className="text-sm text-muted-foreground">
                Season typically runs from November through March. Registration opens in September.
              </p>
            </Card>
            <Card className="p-6 bg-green-50/50">
              <h3 className="font-serif text-lg text-foreground mb-3">Contact CYO</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>For questions about CYO Basketball, including registration, schedules, and volunteer coaching opportunities:</p>
                <p><strong>Email:</strong> <a href="mailto:cyo@stpatrickinarmonk.org" className="text-primary hover:underline">cyo@stpatrickinarmonk.org</a></p>
                <p><strong>Location:</strong> St. Patrick's Parish Center Gym</p>
                <p><strong>Address:</strong> 29 Cox Ave, Armonk NY 10504</p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
