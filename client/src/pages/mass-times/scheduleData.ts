/**
 * Mass Times Schedule Data & Utility Functions
 * Types, weekly schedule, holy days, and time parsing helpers.
 */

import { Church, Cross, Sun, Clock } from "lucide-react";

export type ServiceType = "mass" | "confession" | "prayer" | "none";

export interface Service {
  type: ServiceType;
  name: string;
  time: string;
  note?: string;
}

export interface DaySchedule {
  day: string;
  shortDay: string;
  services: Service[];
}

export const BASE_WEEKLY_SCHEDULE: DaySchedule[] = [
  {
    day: "Sunday",
    shortDay: "Sun",
    services: [
      { type: "mass", name: "Mass", time: "8:30 AM" },
      { type: "mass", name: "Mass", time: "10:30 AM" },
      { type: "mass", name: "Mass", time: "12:30 PM", note: "Oct–Jun only" },
    ],
  },
  {
    day: "Monday",
    shortDay: "Mon",
    services: [
      { type: "none", name: "No scheduled services", time: "" },
    ],
  },
  {
    day: "Tuesday",
    shortDay: "Tue",
    services: [
      { type: "prayer", name: "Morning Prayer (Lauds)", time: "8:00 AM" },
      { type: "mass", name: "Weekday Mass", time: "8:30 AM" },
    ],
  },
  {
    day: "Wednesday",
    shortDay: "Wed",
    services: [
      { type: "prayer", name: "Morning Prayer (Lauds)", time: "8:00 AM" },
      { type: "mass", name: "Weekday Mass", time: "8:30 AM" },
    ],
  },
  {
    day: "Thursday",
    shortDay: "Thu",
    services: [
      { type: "prayer", name: "Morning Prayer (Lauds)", time: "8:00 AM" },
      { type: "mass", name: "Weekday Mass", time: "8:30 AM" },
    ],
  },
  {
    day: "Friday",
    shortDay: "Fri",
    services: [
      { type: "prayer", name: "Morning Prayer (Lauds)", time: "8:00 AM" },
      { type: "mass", name: "Weekday Mass", time: "8:30 AM" },
    ],
  },
  {
    day: "Saturday",
    shortDay: "Sat",
    services: [
      { type: "confession", name: "Confession", time: "4:30–5:15 PM" },
      { type: "mass", name: "Vigil Mass", time: "5:30 PM" },
    ],
  },
];

// Check if a given date is the first Friday of its month
function isFirstFriday(date: Date): boolean {
  return date.getDay() === 5 && date.getDate() <= 7;
}

// Get the schedule with First Friday Adoration injected when applicable
export function getWeeklySchedule(today: number): DaySchedule[] {
  const schedule = BASE_WEEKLY_SCHEDULE.map(day => ({ ...day, services: [...day.services] }));
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
  const todayDate = now.getDate();
  const todayDay = now.getDay();
  const daysUntilFriday = (5 - todayDay + 7) % 7;
  const fridayDate = new Date(now);
  fridayDate.setDate(todayDate + daysUntilFriday);
  if (isFirstFriday(fridayDate)) {
    schedule[5].services.push({
      type: "prayer",
      name: "First Friday Adoration",
      time: "9:00 AM",
      note: "Eucharistic Adoration following Mass",
    });
  }
  return schedule;
}

// Parse a time string like "8:30 AM" or "4:30–5:15 PM" into { hours, minutes } (24h)
export function parseTimeStr(timeStr: string): { hours: number; minutes: number } | null {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (!match) return null;
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3];
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
}

// Compute countdown string from now to a target time today or on a future day
export function getCountdown(targetHours: number, targetMinutes: number, currentHour: number, currentMinute: number, daysAhead: number): string {
  let totalMinutes = (targetHours * 60 + targetMinutes) - (currentHour * 60 + currentMinute) + daysAhead * 1440;
  if (totalMinutes <= 0) return "";
  if (totalMinutes > 1440) return "";
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `in ${m}m`;
  if (m === 0) return `in ${h}h`;
  return `in ${h}h ${m}m`;
}

// Holy Days of Obligation (US) - fixed dates
interface HolyDay {
  month: number; // 1-indexed
  day: number;
  name: string;
  massTime?: string;
}

const HOLY_DAYS: HolyDay[] = [
  { month: 1, day: 1, name: "Solemnity of Mary, Mother of God", massTime: "10:00 AM" },
  { month: 8, day: 15, name: "Assumption of the Blessed Virgin Mary", massTime: "8:30 AM" },
  { month: 11, day: 1, name: "All Saints' Day", massTime: "8:30 AM" },
  { month: 12, day: 8, name: "Immaculate Conception", massTime: "8:30 AM" },
  { month: 12, day: 25, name: "Christmas", massTime: "10:00 AM" },
];

// Get Easter date for a given year (Anonymous Gregorian algorithm)
function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

// Check for upcoming Holy Days within the next 7 days
export function getUpcomingHolyDays(): { name: string; date: Date; massTime: string; daysUntil: number }[] {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
  const year = now.getFullYear();
  const upcoming: { name: string; date: Date; massTime: string; daysUntil: number }[] = [];

  for (const hd of HOLY_DAYS) {
    const hdDate = new Date(year, hd.month - 1, hd.day);
    const diffMs = hdDate.getTime() - new Date(year, now.getMonth(), now.getDate()).getTime();
    const daysUntil = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (daysUntil >= 0 && daysUntil <= 7) {
      upcoming.push({ name: hd.name, date: hdDate, massTime: hd.massTime || "8:30 AM", daysUntil });
    }
  }

  const easter = getEasterDate(year);
  const ascension = new Date(easter);
  ascension.setDate(easter.getDate() + 39);
  const ascDiffMs = ascension.getTime() - new Date(year, now.getMonth(), now.getDate()).getTime();
  const ascDaysUntil = Math.round(ascDiffMs / (1000 * 60 * 60 * 24));
  if (ascDaysUntil >= 0 && ascDaysUntil <= 7) {
    upcoming.push({ name: "Ascension of the Lord", date: ascension, massTime: "8:30 AM", daysUntil: ascDaysUntil });
  }

  return upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
}

// Check if a service is currently in progress
function getServiceDuration(type: ServiceType): number {
  switch (type) {
    case "mass": return 60;
    case "confession": return 45;
    case "prayer": return 30;
    default: return 30;
  }
}

export function isServiceInProgress(timeStr: string, type: ServiceType, currentHour: number, currentMinute: number, isToday: boolean): boolean {
  if (!isToday || !timeStr) return false;
  const startMatch = timeStr.match(/^(\d{1,2}):(\d{2})/);
  const periodMatch = timeStr.match(/(AM|PM)/);
  if (!startMatch || !periodMatch) return false;
  let startHours = parseInt(startMatch[1]);
  const startMinutes = parseInt(startMatch[2]);
  const period = periodMatch[1];
  if (period === "PM" && startHours !== 12) startHours += 12;
  if (period === "AM" && startHours === 12) startHours = 0;

  const startTotal = startHours * 60 + startMinutes;
  const nowTotal = currentHour * 60 + currentMinute;
  const duration = getServiceDuration(type);

  return nowTotal >= startTotal && nowTotal < startTotal + duration;
}

export function getServiceColor(type: ServiceType) {
  switch (type) {
    case "mass": return { bg: "bg-primary/8", text: "text-primary", border: "border-l-primary", dot: "bg-primary" };
    case "confession": return { bg: "bg-purple-500/8", text: "text-purple-600", border: "border-l-purple-500", dot: "bg-purple-500" };
    case "prayer": return { bg: "bg-amber-500/8", text: "text-amber-600", border: "border-l-amber-500", dot: "bg-amber-500" };
    case "none": return { bg: "bg-muted/30", text: "text-muted-foreground", border: "border-l-muted", dot: "bg-muted-foreground" };
  }
}

export function getServiceIcon(type: ServiceType) {
  switch (type) {
    case "mass": return Church;
    case "confession": return Cross;
    case "prayer": return Sun;
    case "none": return Clock;
  }
}
