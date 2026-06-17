/**
 * This Week Accordion — 7-day schedule widget with live countdowns and weather.
 */

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Calendar, Clock } from "lucide-react";
import { format, addDays } from "date-fns";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { WeatherBadge } from "@/components/WeatherBadge";
import { ServiceCard } from "./this-week/ServiceCard";
import {
  DAILY_SCHEDULE, SERVICE_DURATION, parseServiceMinutes,
  DAY_LABELS, TIMEZONE,
} from "./this-week/scheduleConfig";

export function ThisWeekAccordion() {
  const now = useMemo(() => new Date(new Date().toLocaleString("en-US", { timeZone: TIMEZONE })), []);

  // Build 7 days starting from today
  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(now, i);
      const dayOfWeek = date.getDay();
      const services = DAILY_SCHEDULE[dayOfWeek] || [];
      result.push({ index: i, dayOfWeek, date, services, isToday: i === 0, label: DAY_LABELS[dayOfWeek], dateNum: date.getDate() });
    }
    return result;
  }, [now]);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Compute countdown, in-progress, and past state for each service
  const [countdowns, setCountdowns] = useState<Record<number, string>>({});
  const [inProgress, setInProgress] = useState<Record<number, string>>({});
  const [pastServices, setPastServices] = useState<Record<number, boolean>>({});

  useEffect(() => {
    function computeCountdowns() {
      const et = new Date(new Date().toLocaleString("en-US", { timeZone: TIMEZONE }));
      const currentMin = et.getHours() * 60 + et.getMinutes();
      const todayDayOfWeek = et.getDay();
      const selected = days[selectedIndex];
      if (!selected) { setCountdowns({}); setInProgress({}); setPastServices({}); return; }
      const svcs = selected.services;
      const newCountdowns: Record<number, string> = {};
      const newInProgress: Record<number, string> = {};
      const newPast: Record<number, boolean> = {};

      const selectedDayOfWeek = selected.dayOfWeek;
      const daysAhead = (selectedDayOfWeek - todayDayOfWeek + 7) % 7;

      for (let i = 0; i < svcs.length; i++) {
        const svc = svcs[i];
        const svcMin = parseServiceMinutes(svc.time);
        const duration = SERVICE_DURATION[svc.type] || 30;

        if (selected.isToday) {
          if (currentMin >= svcMin + duration) { newPast[i] = true; continue; }
          if (currentMin >= svcMin && currentMin < svcMin + duration) {
            const remaining = (svcMin + duration) - currentMin;
            newInProgress[i] = `${remaining}m remaining`;
            continue;
          }
          const diff = svcMin - currentMin;
          if (diff > 0) {
            const hrs = Math.floor(diff / 60);
            const mins = diff % 60;
            newCountdowns[i] = hrs > 0 ? `in ${hrs}h ${mins}m` : `in ${mins}m`;
          }
        } else {
          const totalMinAhead = (daysAhead * 1440) + svcMin - currentMin;
          if (totalMinAhead > 0 && totalMinAhead <= 1440) {
            const hrs = Math.floor(totalMinAhead / 60);
            const mins = totalMinAhead % 60;
            newCountdowns[i] = hrs > 0 ? `in ${hrs}h ${mins}m` : `in ${mins}m`;
          }
        }
      }
      setCountdowns(newCountdowns);
      setInProgress(newInProgress);
      setPastServices(newPast);
    }
    computeCountdowns();
    const interval = setInterval(computeCountdowns, 30000);
    return () => clearInterval(interval);
  }, [selectedIndex, days]);

  const nextServiceIdx = useMemo(() => {
    const indices = Object.keys(countdowns).map(Number).sort((a, b) => a - b);
    return indices.length > 0 ? indices[0] : -1;
  }, [countdowns]);

  // Swipe gesture for mobile
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; touchEndX.current = e.touches[0].clientX; }, []);
  const handleTouchMove = useCallback((e: React.TouchEvent) => { touchEndX.current = e.touches[0].clientX; }, []);
  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && selectedIndex < 6) setSelectedIndex(selectedIndex + 1);
      else if (diff < 0 && selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
    }
  }, [selectedIndex]);

  // Fetch weather data
  const weatherInput = useMemo(() => days.map((day) => ({
    id: `day-${day.index}`,
    title: day.isToday ? "Today" : format(day.date, "EEEE"),
    startDate: day.date.toISOString(),
  })), [days]);

  const { data: weatherData } = trpc.weather.forEvents.useQuery({ events: weatherInput }, { staleTime: 60 * 60 * 1000 });
  const { data: dailyForecast } = trpc.weather.daily.useQuery(undefined, { staleTime: 60 * 60 * 1000 });

  const selectedDayData = days[selectedIndex];
  const services = selectedDayData?.services || [];
  const weekStart = days[0]?.date || now;
  const weekEnd = days[6]?.date || now;
  const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][selectedDayData?.dayOfWeek || 0];

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-card shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between bg-muted/10">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="font-serif text-lg font-bold text-foreground">This Week</span>
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d")}
        </span>
      </div>

      {/* Day tabs */}
      <div className="flex gap-0.5 p-1 border-b border-border/30 bg-muted/20">
        {days.map((day) => {
          const isSelected = selectedIndex === day.index;
          return (
            <button
              key={day.index}
              onClick={() => setSelectedIndex(day.index)}
              className={`flex-1 min-w-[44px] py-2 px-0.5 rounded-lg text-center transition-all duration-200 relative flex flex-col items-center gap-0.5 ${
                isSelected ? "bg-primary text-white shadow-md shadow-primary/20" : "hover:bg-muted/60 text-muted-foreground"
              }`}
            >
              <span className={`text-[10px] sm:text-xs font-medium uppercase ${isSelected ? "text-white/80" : ""}`}>{day.label}</span>
              <span className={`text-sm sm:text-base font-bold ${isSelected ? "text-white" : "text-foreground/70"}`}>{day.dateNum}</span>
              {day.isToday && !isSelected && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>

      {/* Selected day content */}
      <div className="p-4" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-foreground">
            {selectedDayData?.isToday ? "Today" : format(selectedDayData?.date || now, "EEEE")}
          </h3>
          <div className="flex items-center gap-2">
            {dailyForecast?.[selectedIndex] && (
              <span className="text-[11px] text-muted-foreground font-medium">
                <span className="text-foreground font-semibold">{dailyForecast[selectedIndex].high}°</span>
                <span className="mx-0.5">/</span>
                <span>{dailyForecast[selectedIndex].low}°</span>
              </span>
            )}
            {weatherData?.[`day-${selectedIndex}`]?.weather && (
              <WeatherBadge weather={weatherData[`day-${selectedIndex}`].weather!} compact />
            )}
            {services.length === 0 && !dailyForecast?.[selectedIndex] && (
              <span className="text-xs text-muted-foreground italic">No services</span>
            )}
          </div>
        </div>

        {services.length > 0 ? (
          <div className="space-y-2 mb-3">
            {services.map((svc, idx) => (
              <ServiceCard
                key={`svc-${idx}`}
                svc={svc}
                idx={idx}
                isPast={!!pastServices[idx]}
                isLive={!!inProgress[idx]}
                isNext={idx === nextServiceIdx && !inProgress[idx] && !pastServices[idx]}
                countdown={countdowns[idx]}
                progress={inProgress[idx]}
                dayName={dayName}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4 italic">No scheduled services on this day</p>
        )}
      </div>

      {/* At a Glance footer */}
      <div className="border-t border-border/30 px-4 py-3 bg-muted/10">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">At a Glance</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-card p-2.5 text-center shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Sat Vigil</p>
            <p className="text-sm font-bold text-primary mt-0.5">5:30 PM</p>
          </div>
          <div className="rounded-lg bg-card p-2.5 text-center shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Sunday</p>
            <p className="text-sm font-bold text-primary mt-0.5">8:30 & 10:30</p>
          </div>
          <div className="rounded-lg bg-card p-2.5 text-center shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Tue–Fri</p>
            <p className="text-sm font-bold text-primary mt-0.5">8:30 AM</p>
          </div>
        </div>
        <Link href="/mass-times" className="flex items-center justify-center gap-1 mt-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          Full schedule & details <span className="text-sm">→</span>
        </Link>
      </div>
    </div>
  );
}
