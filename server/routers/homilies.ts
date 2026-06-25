/**
 * Homilies Router — public list + admin CRUD for homily archive.
 */
import { z } from "zod";
import { publicProcedure, staffProcedure, TRPCError } from "./_helpers";
import { router } from "../_core/trpc";
import * as db from "../db";
import { storagePut } from "../storage";
import { validateBase64File } from "../middleware";

export const homiliesRouter = router({
  list: publicProcedure.query(async () => {
    return db.getPublishedHomilies();
  }),

  listAll: staffProcedure.query(async () => {
    return db.getAllHomilies();
  }),

  create: staffProcedure
    .input(z.object({
      title: z.string().min(1),
      date: z.string(), // ISO date string
      celebrant: z.string().optional(),
      topic: z.string().optional(),
      audioBase64: z.string().optional(),
      audioFilename: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      let audioUrl: string | undefined;
      let audioKey: string | undefined;

      if (input.audioBase64 && input.audioFilename) {
        const validation = validateBase64File(input.audioBase64, "audio/mpeg");
        if (!validation.valid) {
          throw new TRPCError({ code: "BAD_REQUEST", message: validation.error || "Invalid audio file" });
        }
        const buffer = validation.buffer!;
        const sanitizedName = input.audioFilename.replace(/[^a-zA-Z0-9._-]/g, "_");
        const key = `homilies/${Date.now()}-${sanitizedName}`;
        const result = await storagePut(key, buffer, validation.detectedMimeType || "audio/mpeg");
        audioUrl = result.url;
        audioKey = result.key;
      }

      const id = await db.createHomily({
        title: input.title,
        date: new Date(input.date),
        celebrant: input.celebrant,
        topic: input.topic,
        audioUrl,
        audioKey,
        notes: input.notes,
      });
      return { id };
    }),

  update: staffProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      date: z.string().optional(),
      celebrant: z.string().nullable().optional(),
      topic: z.string().nullable().optional(),
      notes: z.string().nullable().optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, date, ...rest } = input;
      await db.updateHomily(id, {
        ...rest,
        ...(date ? { date: new Date(date) } : {}),
      });
      return { success: true };
    }),

  delete: staffProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteHomily(input.id);
      return { success: true };
    }),
});
