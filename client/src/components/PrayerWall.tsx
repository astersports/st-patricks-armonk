import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Flame, Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

export function PrayerWall() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [intention, setIntention] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const { data, refetch } = trpc.prayerWall.getIntentions.useQuery();
  const lightCandle = trpc.prayerWall.lightCandle.useMutation({
    onSuccess: () => {
      toast.success("Your candle has been lit. We are praying with you.");
      setShowForm(false);
      setName("");
      setIntention("");
      refetch();
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intention.trim()) return;
    lightCandle.mutate({ name: name.trim() || undefined, intention: intention.trim(), isPublic });
  };

  const candleCount = data?.candlesThisWeek ?? 0;
  const intentions = data?.intentions ?? [];

  return (
    <div className="py-6 px-4">
      <div className="max-w-lg mx-auto">
        {/* Single Candle + Count — centered hero element */}
        <div className="text-center mb-4">
          <div className="relative inline-flex flex-col items-center">
            {/* Large single candle */}
            <div className="candle-glow relative">
              <Flame className="w-12 h-12 text-amber-400 animate-flicker drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
            </div>
            {/* Count badge */}
            <div className="mt-1.5 bg-amber-900/20 border border-amber-500/30 rounded-full px-3 py-0.5">
              <span className="text-amber-600 dark:text-amber-400 text-xs font-bold">{candleCount}</span>
              <span className="text-amber-700/70 dark:text-amber-400/70 text-[10px] ml-1">this week</span>
            </div>
          </div>
          <h2 className="text-base font-bold mt-3 tracking-tight">Light a Candle</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Share a prayer intention with our community</p>
        </div>

        {/* Light a Candle Button / Form */}
        {!showForm ? (
          <div className="text-center">
            <Button
              onClick={() => setShowForm(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white active:scale-97 transition-transform rounded-full px-5"
              size="sm"
            >
              <Flame className="w-3.5 h-3.5 mr-1.5" />
              Light a Candle
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2.5 border border-amber-200/50 dark:border-amber-800/30 rounded-lg p-3 bg-amber-50/30 dark:bg-amber-950/10">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              maxLength={100}
            />
            <textarea
              placeholder="Your prayer intention..."
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none"
              rows={2}
              maxLength={300}
              required
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded w-3.5 h-3.5"
                />
                Share publicly
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                  className="text-xs h-7"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!intention.trim() || lightCandle.isPending}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-7 rounded-full px-4"
                >
                  <Send className="w-3 h-3 mr-1" />
                  {lightCandle.isPending ? "..." : "Submit"}
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Prayer Intentions List — separate section */}
        {intentions.length > 0 && (
          <div className="mt-5 border-t pt-4">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-semibold text-foreground">Prayer Intentions</p>
              <p className="text-[10px] text-muted-foreground">{intentions.length} shared</p>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {intentions.slice(0, 10).map((item) => (
                <div key={item.id} className="group flex items-start gap-2.5 py-2 px-2.5 rounded-md hover:bg-muted/40 transition-colors">
                  <div className="shrink-0 mt-0.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-foreground leading-snug">{item.intention}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {item.name && (
                        <span className="text-[10px] text-muted-foreground font-medium">{item.name}</span>
                      )}
                      <span className="text-[10px] text-muted-foreground/60 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {timeAgo(typeof item.createdAt === 'string' ? item.createdAt : new Date(item.createdAt).toISOString())}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
