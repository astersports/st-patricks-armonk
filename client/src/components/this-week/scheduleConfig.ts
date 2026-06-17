/**
 * This Week Schedule Config — Types, schedule data, and utility functions.
 */

import { Church, Cross, Sun } from "lucide-react";

export interface ScheduleItem {
  time: string;
  label: string;
  type: "mass" | "confession" | "prayer";
}

export const DAILY_SCHEDULE: Record<number, ScheduleItem[]> = {
  0: [ // Sunday
    { time: "8:30 AM", label: "Mass", type: "mass" },
    { time: "10:30 AM", label: "Mass", type: "mass" },
    { time: "12:30 PM", label: "Mass (Oct–Jun)", type: "mass" },
  ],
  1: [], // Monday — no services
  2: [ // Tuesday
    { time: "8:00 AM", label: "Morning Prayer", type: "prayer" },
    { time: "8:30 AM", label: "Mass", type: "mass" },
  ],
  3: [ // Wednesday
    { time: "8:00 AM", label: "Morning Prayer", type: "prayer" },
    { time: "8:30 AM", label: "Mass", type: "mass" },
  ],
  4: [ // Thursday
    { time: "8:00 AM", label: "Morning Prayer", type: "prayer" },
    { time: "8:30 AM", label: "Mass", type: "mass" },
  ],
  5: [ // Friday
    { time: "8:00 AM", label: "Morning Prayer", type: "prayer" },
    { time: "8:30 AM", label: "Mass", type: "mass" },
  ],
  6: [ // Saturday
    { time: "4:30 PM", label: "Confession", type: "confession" },
    { time: "5:30 PM", label: "Vigil Mass", type: "mass" },
  ],
};

export const SERVICE_DURATION: Record<string, number> = {
  mass: 60,
  confession: 45,
  prayer: 30,
};

export function parseServiceMinutes(time: string): number {
  const [timePart, ampm] = time.split(" ");
  const [h, m] = timePart.split(":").map(Number);
  return (ampm === "PM" && h !== 12 ? h + 12 : h === 12 && ampm === "AM" ? 0 : h) * 60 + m;
}

export const typeStyles = {
  mass: { icon: Church, color: "text-primary", bg: "bg-primary/10", borderColor: "border-l-primary" },
  confession: { icon: Cross, color: "text-purple-600", bg: "bg-purple-500/10", borderColor: "border-l-purple-500" },
  prayer: { icon: Sun, color: "text-amber-600", bg: "bg-amber-500/10", borderColor: "border-l-amber-500" },
};

export const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export const TIMEZONE = "America/New_York";
