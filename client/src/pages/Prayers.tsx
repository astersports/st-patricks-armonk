import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Clock, Flame } from "lucide-react";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return `${Math.floor(diffDay / 7)}w ago`;
}

export default function Prayers() {
  const { data, isLoading } = trpc.prayerWall.getIntentions.useQuery();
  const intentions = data?.intentions?.filter((i) => i.isPublic) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1208] via-[#2a1f0e] to-[#1a1208]">
      {/* Header */}
      <div className="container py-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-amber-300/70 hover:text-amber-200 text-sm mb-4 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-amber-100">Community Prayers</h1>
            <p className="text-sm text-amber-300/60">{intentions.length} prayer intentions shared</p>
          </div>
        </div>
      </div>

      {/* Prayer list */}
      <div className="container pb-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-amber-900/20 animate-pulse" />
            ))}
          </div>
        ) : intentions.length === 0 ? (
          <p className="text-center text-amber-300/50 py-12">No prayer intentions shared yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {intentions.map((item: any) => (
              <div
                key={item.id}
                className="py-2.5 px-3.5 rounded-lg bg-amber-900/15 border border-amber-800/25 hover:border-amber-700/40 transition-colors"
              >
                <p className="text-sm text-amber-100/90 leading-snug">{item.intention}</p>
                <div className="flex items-center gap-2 mt-2">
                  {item.name && (
                    <span className="text-sm text-amber-300/60 font-medium">— {item.name}</span>
                  )}
                  <span className="text-sm text-amber-400/40 flex items-center gap-0.5 ml-auto">
                    <Clock className="w-2.5 h-2.5" />
                    {timeAgo(typeof item.createdAt === "string" ? item.createdAt : new Date(item.createdAt).toISOString())}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
