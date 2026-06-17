/**
 * FAQ Router — admin CRUD for parish FAQ knowledge base.
 * ~65 lines
 */
import { publicProcedure, protectedProcedure, router, z, db } from "./_helpers";

export const faqRouter = router({
  /** Public: get all active FAQs (for display or assistant context) */
  listActive: publicProcedure.query(async () => {
    return db.getActiveFaqs();
  }),

  /** Admin: get all FAQs including inactive */
  listAll: protectedProcedure.query(async () => {
    return db.getAllFaqs();
  }),

  /** Admin: create a new FAQ */
  create: protectedProcedure.input(z.object({
    question: z.string().min(1).max(500),
    answer: z.string().min(1),
    category: z.string().max(100).default("general"),
    sortOrder: z.number().int().default(0),
  })).mutation(async ({ input }) => {
    await db.createFaq(input);
    return { success: true };
  }),

  /** Admin: update an existing FAQ */
  update: protectedProcedure.input(z.object({
    id: z.number().int(),
    question: z.string().min(1).max(500).optional(),
    answer: z.string().min(1).optional(),
    category: z.string().max(100).optional(),
    sortOrder: z.number().int().optional(),
    active: z.boolean().optional(),
  })).mutation(async ({ input }) => {
    const { id, ...data } = input;
    await db.updateFaq(id, data);
    return { success: true };
  }),

  /** Admin: delete a FAQ */
  delete: protectedProcedure.input(z.object({
    id: z.number().int(),
  })).mutation(async ({ input }) => {
    await db.deleteFaq(input.id);
    return { success: true };
  }),
});
