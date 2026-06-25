import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date that may be null/undefined/invalid. date-fns `format()` throws
 * a RangeError on an invalid Date (e.g. new Date(null) or new Date("garbage")),
 * which crashes admin lists. Returns `fallback` instead of throwing.
 */
export function safeFormatDate(
  value: string | number | Date | null | undefined,
  fmt = "MMM d, yyyy",
  fallback = "N/A",
): string {
  if (value === null || value === undefined || value === "") return fallback;
  const d = value instanceof Date ? value : new Date(value);
  return isValid(d) ? format(d, fmt) : fallback;
}
