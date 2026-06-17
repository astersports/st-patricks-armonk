/**
 * Bulletins Router — CRUD for weekly parish bulletins (PDF uploads).
 * ~75 lines
 */
import { adminProcedure, publicProcedure, router, z, db, nanoid, storagePut, TRPCError } from "./_helpers";
import { sendBulletinNotifications } from "../notifications";

export const bulletinsRouter = router({
  listPublished: publicProcedure.query(async () => {
    return db.getPublishedBulletins();
  }),
  listAll: adminProcedure.query(async () => {
    return db.getAllBulletins();
  }),
  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return db.getBulletinById(input.id);
  }),
  create: adminProcedure.input(z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    pdfUrl: z.string().min(1),
    pdfKey: z.string().min(1),
    weekDate: z.string(),
    published: z.boolean().default(false),
  })).mutation(async ({ input, ctx }) => {
    const publishedAt = input.published ? new Date() : undefined;
    const id = await db.createBulletin({
      ...input,
      description: input.description ?? null,
      weekDate: new Date(input.weekDate),
      publishedAt: publishedAt ?? null,
      authorId: ctx.user.id,
    });
    if (input.published) {
      sendBulletinNotifications(id, input.title);
    }
    return { id };
  }),
  update: adminProcedure.input(z.object({
    id: z.number(),
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    weekDate: z.string().optional(),
    published: z.boolean().optional(),
  })).mutation(async ({ input }) => {
    const { id, ...data } = input;
    const existing = await db.getBulletinById(id);
    if (!existing) throw new TRPCError({ code: "NOT_FOUND" });

    const updateData: Record<string, unknown> = { ...data };
    if (data.weekDate) updateData.weekDate = new Date(data.weekDate);

    if (data.published && !existing.published) {
      updateData.publishedAt = new Date();
      await db.updateBulletin(id, updateData as any);
      sendBulletinNotifications(id, data.title || existing.title);
    } else {
      await db.updateBulletin(id, updateData as any);
    }
    return { success: true };
  }),
  delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await db.deleteBulletin(input.id);
    return { success: true };
  }),
  uploadPdf: adminProcedure.input(z.object({
    fileName: z.string(),
    fileBase64: z.string(),
    contentType: z.string().default("application/pdf"),
  })).mutation(async ({ input }) => {
    const buffer = Buffer.from(input.fileBase64, "base64");
    const key = `bulletins/${nanoid()}-${input.fileName}`;
    const { url } = await storagePut(key, buffer, input.contentType);
    return { url, key };
  }),
});
