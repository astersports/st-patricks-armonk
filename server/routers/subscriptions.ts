/**
 * Email Subscriptions Router — subscribe, unsubscribe, list.
 * ~45 lines
 */
import { adminProcedure, publicProcedure, router, z, db, nanoid } from "./_helpers";

export const subscriptionsRouter = router({
  subscribe: publicProcedure.input(z.object({
    email: z.string().email(),
    name: z.string().optional(),
    subscribedToBulletins: z.boolean().default(true),
    subscribedToNews: z.boolean().default(true),
  })).mutation(async ({ input }) => {
    const existing = await db.getSubscriptionByEmail(input.email);
    if (existing) {
      if (!existing.active) {
        const dbInstance = await db.getDb();
        if (dbInstance) {
          const { emailSubscriptions } = await import("../../drizzle/schema");
          const { eq } = await import("drizzle-orm");
          await dbInstance.update(emailSubscriptions)
            .set({ active: true, subscribedToBulletins: input.subscribedToBulletins, subscribedToNews: input.subscribedToNews })
            .where(eq(emailSubscriptions.id, existing.id));
        }
        return { success: true, message: "Subscription reactivated" };
      }
      return { success: true, message: "Already subscribed" };
    }
    const token = nanoid(32);
    await db.createSubscription({
      ...input,
      name: input.name ?? null,
      unsubscribeToken: token,
    });
    return { success: true, message: "Successfully subscribed" };
  }),
  unsubscribe: publicProcedure.input(z.object({
    token: z.string(),
  })).mutation(async ({ input }) => {
    await db.unsubscribeByToken(input.token);
    return { success: true };
  }),
  listAll: adminProcedure.query(async () => {
    return db.getAllSubscriptions();
  }),
});
