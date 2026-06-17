/**
 * News Posts Router — CRUD for parish news articles.
 * ~80 lines
 */
import { adminProcedure, publicProcedure, router, z, db, TRPCError } from "./_helpers";
import { validateBase64File } from "../middleware";
import { sendNewsNotifications } from "../notifications";

export const newsRouter = router({
  listPublished: publicProcedure.query(async () => {
    return db.getPublishedNewsPosts();
  }),
  listAll: adminProcedure.query(async () => {
    return db.getAllNewsPosts();
  }),
  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return db.getNewsPostById(input.id);
  }),
  create: adminProcedure.input(z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    excerpt: z.string().optional(),
    imageUrl: z.string().optional(),
    published: z.boolean().default(false),
  })).mutation(async ({ input, ctx }) => {
    const publishedAt = input.published ? new Date() : undefined;
    const id = await db.createNewsPost({
      ...input,
      excerpt: input.excerpt ?? null,
      imageUrl: input.imageUrl ?? null,
      publishedAt: publishedAt ?? null,
      authorId: ctx.user.id,
    });
    if (input.published) {
      sendNewsNotifications(id, input.title, input.excerpt || "");
    }
    return { id };
  }),
  update: adminProcedure.input(z.object({
    id: z.number(),
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    excerpt: z.string().optional(),
    imageUrl: z.string().optional(),
    published: z.boolean().optional(),
  })).mutation(async ({ input }) => {
    const { id, ...data } = input;
    const existing = await db.getNewsPostById(id);
    if (!existing) throw new (await import("@trpc/server")).TRPCError({ code: "NOT_FOUND" });

    const updateData: Record<string, unknown> = { ...data };
    if (data.published && !existing.published) {
      updateData.publishedAt = new Date();
      await db.updateNewsPost(id, updateData as any);
      sendNewsNotifications(id, data.title || existing.title, data.excerpt || existing.excerpt || "");
    } else {
      await db.updateNewsPost(id, updateData as any);
    }
    return { success: true };
  }),
  delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await db.deleteNewsPost(input.id);
    return { success: true };
  }),
  uploadImage: adminProcedure.input(z.object({
    fileName: z.string(),
    fileBase64: z.string(),
    contentType: z.string().default("image/jpeg"),
  })).mutation(async ({ input }) => {
    const { storagePut } = await import("../storage");
    const { nanoid } = await import("nanoid");
    const validation = validateBase64File(input.fileBase64, input.contentType);
    if (!validation.valid) {
      throw new TRPCError({ code: "BAD_REQUEST", message: validation.error || "Invalid file" });
    }
    const buffer = validation.buffer!;
    const key = `news/${nanoid()}-${input.fileName}`;
    const { url } = await storagePut(key, buffer, validation.detectedMimeType || input.contentType);
    return { url, key };
  }),
});
