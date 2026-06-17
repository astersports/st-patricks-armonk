import { trpc } from "@/lib/trpc";
import { CloudRain } from "lucide-react";

export function RainAlertBanner() {
  const { data: dailyForecast } = trpc.weather.daily.useQuery(undefined, {
    staleTime: 30 * 60 * 1000,
  });

  const todayForecast = dailyForecast?.[0];
  if (!todayForecast || todayForecast.precipProbabilityMax <= 60) return null;

  return (
    <div className="container mt-3 mb-0">
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40">
        <CloudRain className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <span className="font-semibold">Rain likely today</span>
          <span className="text-blue-600 dark:text-blue-300"> — {todayForecast.precipProbabilityMax}% chance — bring an umbrella to Mass</span>
        </p>
      </div>
    </div>
  );
}
