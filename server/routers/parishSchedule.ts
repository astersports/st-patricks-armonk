/**
 * Parish Schedule Router — Admin-editable single source of truth for all Mass/service times.
 * Stores schedule as JSON in site_settings table.
 */
import { z } from "zod";
import { router } from "../routers/_helpers";
import { publicProcedure, staffProcedure } from "../routers/_helpers";
import * as db from "../db";
import { DEFAULT_PARISH_SCHEDULE, DEFAULT_PARISH_INFO } from "../../shared/scheduleEngine";
import type { ParishSchedule, ParishInfo } from "../../shared/scheduleEngine";

const SCHEDULE_KEY = "parish_schedule";
const INFO_KEY = "parish_info";

async function getSchedule(): Promise<ParishSchedule> {
  const raw = await db.getSiteSetting(SCHEDULE_KEY);
  if (!raw) return DEFAULT_PARISH_SCHEDULE;
  try {
    return JSON.parse(raw) as ParishSchedule;
  } catch {
    return DEFAULT_PARISH_SCHEDULE;
  }
}

async function getInfo(): Promise<ParishInfo> {
  const raw = await db.getSiteSetting(INFO_KEY);
  if (!raw) return DEFAULT_PARISH_INFO;
  try {
    return JSON.parse(raw) as ParishInfo;
  } catch {
    return DEFAULT_PARISH_INFO;
  }
}

export const parishScheduleRouter = router({
  /** Public: get the current schedule (used by all frontend consumers) */
  getSchedule: publicProcedure.query(async () => {
    return getSchedule();
  }),

  /** Public: get parish info (name, address, phone, etc.) */
  getInfo: publicProcedure.query(async () => {
    return getInfo();
  }),

  /** Admin: update the full schedule */
  updateSchedule: staffProcedure
    .input(z.object({ schedule: z.any() }))
    .mutation(async ({ input }) => {
      await db.upsertSiteSetting(SCHEDULE_KEY, JSON.stringify(input.schedule));
      return { success: true };
    }),

  /** Admin: update parish info */
  updateInfo: staffProcedure
    .input(z.object({ info: z.any() }))
    .mutation(async ({ input }) => {
      await db.upsertSiteSetting(INFO_KEY, JSON.stringify(input.info));
      return { success: true };
    }),
});
