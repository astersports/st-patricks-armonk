/**
 * Schedule Config — Thin adapter over shared/scheduleEngine.
 * 
 * All actual schedule data comes from the shared engine (single source of truth).
 * This file provides backward-compatible exports for ThisWeekAccordion,
 * DayContent, ServiceCard, and RainAlertBanner.
 */
import { Church, Cross, Sun } from "lucide-react";
import {
  parseTimeToMinutes,
  getWeeklySchedule,
  DEFAULT_PARISH_SCHEDULE,
  TIMEZONE as ENGINE_TZ,
  DAY_LABELS as ENGINE_DAYS,
} from "../../../../shared/scheduleEngine";

// Re-export types and constants
export const TIMEZONE = ENGINE_TZ;
export const DAY_LABELS = ENGINE_DAYS;
export const parseServiceMinutes = parseTimeToMinutes;

export interface ScheduleItem {
  time: string;
  label: string;
  type: "mass" | "confession" | "prayer";
}

export const SERVICE_DURATION: Record<string, number> = {
  mass: 60,
  confession: 45,
  prayer: 30,
};

export const typeStyles = {
  mass: { icon: Church, color: "text-primary", bg: "bg-primary/10", borderColor: "border-l-primary" },
  confession: { icon: Cross, color: "text-purple-600", bg: "bg-purple-500/10", borderColor: "border-l-purple-500" },
  prayer: { icon: Sun, color: "text-amber-600", bg: "bg-amber-500/10", borderColor: "border-l-amber-500" },
};

/**
 * DAILY_SCHEDULE — derived from the shared engine's DEFAULT_PARISH_SCHEDULE.
 * Single source of truth: edit shared/scheduleEngine.ts DEFAULT_PARISH_SCHEDULE
 * or use the admin panel to update via siteSettings.
 */
function buildDailySchedule(): Record<number, ScheduleItem[]> {
  const month = new Date().getMonth() + 1;
  const weekly = getWeeklySchedule(DEFAULT_PARISH_SCHEDULE, month);
  const result: Record<number, ScheduleItem[]> = {};
  for (let day = 0; day <= 6; day++) {
    result[day] = (weekly[day] || []).map(s => ({
      time: s.time,
      label: s.name,
      type: s.type as "mass" | "confession" | "prayer",
    }));
  }
  return result;
}

export const DAILY_SCHEDULE: Record<number, ScheduleItem[]> = buildDailySchedule();
