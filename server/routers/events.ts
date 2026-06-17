/**
 * Events Router — CRUD for parish events.
 * ~55 lines
 */
import { adminProcedure, publicProcedure, router, z, db } from "./_helpers";

export const eventsRouter = router({
  listUpcoming: publicProcedure.query(async () => {
    return db.getUpcomingEvents();
  }),
  listAll: adminProcedure.query(async () => {
    return db.getAllEvents();
  }),
  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return db.getEventById(input.id);
  }),
  create: adminProcedure.input(z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    location: z.string().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    allDay: z.boolean().default(false),
    published: z.boolean().default(true),
  })).mutation(async ({ input, ctx }) => {
    const id = await db.createEvent({
      ...input,
      description: input.description ?? null,
      location: input.location ?? null,
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : null,
      authorId: ctx.user.id,
    });
    return { id };
  }),
  update: adminProcedure.input(z.object({
    id: z.number(),
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    allDay: z.boolean().optional(),
    published: z.boolean().optional(),
  })).mutation(async ({ input }) => {
    const { id, ...data } = input;
    const updateData: Record<string, unknown> = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    await db.updateEvent(id, updateData as any);
    return { success: true };
  }),
  delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await db.deleteEvent(input.id);
    return { success: true };
  }),
});
