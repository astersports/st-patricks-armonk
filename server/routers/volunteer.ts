/**
 * Volunteer Router — opportunities and signups.
 * ~80 lines
 */
import { adminProcedure, publicProcedure, router, z, db } from "./_helpers";
import { rateLimitedFormProcedure } from "./_rateLimited";

export const volunteerRouter = router({
  listOpportunities: publicProcedure.query(async () => {
    return db.getVolunteerOpportunities(true);
  }),
  listAllOpportunities: adminProcedure.query(async () => {
    return db.getVolunteerOpportunities(false);
  }),
  createOpportunity: adminProcedure.input(z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    ministry: z.string().optional(),
    eventDate: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    spotsAvailable: z.number().min(1),
  })).mutation(async ({ input }) => {
    const id = await db.createVolunteerOpportunity({
      ...input,
      description: input.description ?? null,
      ministry: input.ministry ?? null,
      eventDate: input.eventDate ? new Date(input.eventDate) : null,
      startTime: input.startTime ?? null,
      endTime: input.endTime ?? null,
    });
    return { success: true, id };
  }),
  updateOpportunity: adminProcedure.input(z.object({
    id: z.number(),
    title: z.string().optional(),
    description: z.string().optional(),
    ministry: z.string().optional(),
    eventDate: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    spotsAvailable: z.number().optional(),
    active: z.boolean().optional(),
  })).mutation(async ({ input }) => {
    const { id, eventDate, ...rest } = input;
    const data: any = { ...rest };
    if (eventDate) data.eventDate = new Date(eventDate);
    await db.updateVolunteerOpportunity(id, data);
    return { success: true };
  }),
  deleteOpportunity: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await db.deleteVolunteerOpportunity(input.id);
    return { success: true };
  }),
  signup: rateLimitedFormProcedure.input(z.object({
    opportunityId: z.number(),
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    notes: z.string().optional(),
  })).mutation(async ({ input }) => {
    const id = await db.createVolunteerSignup({
      ...input,
      phone: input.phone ?? null,
      notes: input.notes ?? null,
    });
    return { success: true, id };
  }),
  listSignups: adminProcedure.input(z.object({
    opportunityId: z.number(),
  })).query(async ({ input }) => {
    return db.getVolunteerSignups(input.opportunityId);
  }),
  cancelSignup: adminProcedure.input(z.object({
    id: z.number(),
    opportunityId: z.number(),
  })).mutation(async ({ input }) => {
    await db.cancelVolunteerSignup(input.id, input.opportunityId);
    return { success: true };
  }),
});
