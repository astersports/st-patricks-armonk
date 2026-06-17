/**
 * Admin Router — dashboard stats, user management, site settings, important dates.
 * ~110 lines
 */
import { adminProcedure, staffProcedure, sectionProcedure, publicProcedure, router, z, db } from "./_helpers";

export const adminStatsRouter = router({
  overview: staffProcedure.query(async () => {
    return db.getAdminStats();
  }),
  recentActivity: staffProcedure.query(async () => {
    return db.getRecentFormSubmissions(12);
  }),
});

export const usersRouter = router({
  list: adminProcedure.query(async () => {
    return db.getAllUsers();
  }),
  updateRole: adminProcedure
    .input(z.object({
      userId: z.number(),
      role: z.enum(["user", "admin", "communications", "religious_ed", "youth_ministry", "sacraments", "parish_life"]),
    }))
    .mutation(async ({ input }) => {
      await db.updateUserRole(input.userId, input.role);
      return { success: true };
    }),
});

export const siteSettingsRouter = router({
  get: publicProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      return { value: await db.getSiteSetting(input.key) };
    }),
  getAll: staffProcedure.query(async () => {
    return db.getAllSiteSettings();
  }),
  update: sectionProcedure("settings")
    .input(z.object({ key: z.string(), value: z.string() }))
    .mutation(async ({ input }) => {
      await db.upsertSiteSetting(input.key, input.value);
      return { success: true };
    }),
});

export const importantDatesRouter = router({
  upcoming: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(50).optional() }).optional())
    .query(async ({ input }) => {
      const limit = input?.limit ?? 12;
      return db.getUpcomingImportantDates(limit);
    }),
  allPublished: publicProcedure.query(async () => {
    return db.getAllPublishedImportantDates();
  }),
  all: adminProcedure.query(async () => {
    return db.getAllImportantDates();
  }),
  create: adminProcedure
    .input(z.object({
      title: z.string().min(1).max(500),
      eventDate: z.string(),
      location: z.string().max(300).optional(),
      note: z.string().optional(),
      category: z.enum(["ccd", "cyo", "sacrament", "parish", "teen_life", "social"]),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = await db.createImportantDate({
        title: input.title,
        eventDate: new Date(input.eventDate),
        location: input.location || null,
        note: input.note || null,
        category: input.category,
        published: input.published ?? true,
      });
      return { id };
    }),
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).max(500).optional(),
      eventDate: z.string().optional(),
      location: z.string().max(300).optional().nullable(),
      note: z.string().optional().nullable(),
      category: z.enum(["ccd", "cyo", "sacrament", "parish", "teen_life", "social"]).optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const updateData: Record<string, unknown> = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.eventDate !== undefined) updateData.eventDate = new Date(data.eventDate);
      if (data.location !== undefined) updateData.location = data.location;
      if (data.note !== undefined) updateData.note = data.note;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.published !== undefined) updateData.published = data.published;
      await db.updateImportantDate(id, updateData);
      return { success: true };
    }),
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteImportantDate(input.id);
      return { success: true };
    }),
});
