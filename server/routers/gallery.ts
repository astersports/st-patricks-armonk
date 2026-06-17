/**
 * Gallery Router — photo albums and image management.
 * ~70 lines
 */
import { publicProcedure, router, z, db, nanoid, storagePut, sectionProcedure } from "./_helpers";

export const galleryRouter = router({
  listPublished: publicProcedure
    .input(z.object({ album: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return db.getPublishedGalleryPhotos(input?.album);
    }),
  listAll: sectionProcedure("gallery").query(async () => {
    return db.getAllGalleryPhotos();
  }),
  albums: publicProcedure.query(async () => {
    return db.getGalleryAlbums();
  }),
  uploadImage: sectionProcedure("gallery")
    .input(z.object({
      fileName: z.string(),
      fileData: z.string(),
      contentType: z.string(),
    }))
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.fileData, "base64");
      const key = `gallery/${nanoid()}-${input.fileName}`;
      const { url } = await storagePut(key, buffer, input.contentType);
      return { url, key };
    }),
  upload: sectionProcedure("gallery")
    .input(z.object({
      title: z.string().optional(),
      caption: z.string().optional(),
      album: z.string().optional(),
      imageUrl: z.string(),
      imageKey: z.string(),
    }))
    .mutation(async ({ input }) => {
      await db.createGalleryPhoto({
        title: input.title || null,
        caption: input.caption || null,
        album: input.album || null,
        imageUrl: input.imageUrl,
        imageKey: input.imageKey,
      });
      return { success: true };
    }),
  update: sectionProcedure("gallery")
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      caption: z.string().optional(),
      album: z.string().optional(),
      sortOrder: z.number().optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateGalleryPhoto(id, data);
      return { success: true };
    }),
  delete: sectionProcedure("gallery")
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteGalleryPhoto(input.id);
      return { success: true };
    }),
});
