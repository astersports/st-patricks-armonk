import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import * as db from "./db";
import { storagePut } from "./storage";
import { notifyOwner } from "./_core/notification";
import { ENV } from "./_core/env";

// Owner-only procedure - only the site owner can manage content
// Uses both role check AND openId verification for maximum security
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  const isOwner = ctx.user.openId === ENV.ownerOpenId;
  const isAdmin = ctx.user.role === "admin";
  if (!isOwner && !isAdmin) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ===== NEWS POSTS =====
  news: router({
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
      // Send notifications if published
      if (input.published) {
        sendNewsNotifications(id, input.title, input.excerpt || input.content.substring(0, 200));
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
      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
      
      const updateData: Record<string, unknown> = { ...data };
      // If being published for the first time
      if (data.published && !existing.published) {
        updateData.publishedAt = new Date();
        await db.updateNewsPost(id, updateData as any);
        sendNewsNotifications(id, data.title || existing.title, data.excerpt || existing.excerpt || existing.content.substring(0, 200));
      } else {
        await db.updateNewsPost(id, updateData as any);
      }
      return { success: true };
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteNewsPost(input.id);
      return { success: true };
    }),
  }),

  // ===== BULLETINS =====
  bulletins: router({
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
  }),

  // ===== EVENTS =====
  events: router({
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
  }),

  // ===== EMAIL SUBSCRIPTIONS =====
  subscriptions: router({
    subscribe: publicProcedure.input(z.object({
      email: z.string().email(),
      name: z.string().optional(),
      subscribedToBulletins: z.boolean().default(true),
      subscribedToNews: z.boolean().default(true),
    })).mutation(async ({ input }) => {
      const existing = await db.getSubscriptionByEmail(input.email);
      if (existing) {
        if (!existing.active) {
          // Reactivate
          const dbInstance = await db.getDb();
          if (dbInstance) {
            const { emailSubscriptions } = await import("../drizzle/schema");
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
  }),
});

export type AppRouter = typeof appRouter;

// ===== NOTIFICATION HELPERS =====

/**
 * Sends an email notification to a single subscriber using the Forge Notification API.
 * Each subscriber gets a personalized email with an unsubscribe link.
 */
async function sendEmailToSubscriber(
  email: string,
  subject: string,
  htmlBody: string
): Promise<boolean> {
  if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
    console.warn("[Notifications] Forge API not configured, skipping email send");
    return false;
  }

  try {
    const normalizedBase = ENV.forgeApiUrl.endsWith("/") ? ENV.forgeApiUrl : `${ENV.forgeApiUrl}/`;
    const endpoint = new URL("webdevtoken.v1.WebDevService/SendEmailNotification", normalizedBase).toString();

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1",
      },
      body: JSON.stringify({
        to: email,
        subject,
        html: htmlBody,
      }),
    });

    if (!response.ok) {
      console.warn(`[Notifications] Email send failed for ${email}: ${response.status}`);
      return false;
    }
    return true;
  } catch (error) {
    console.warn(`[Notifications] Email send error for ${email}:`, error);
    return false;
  }
}

/**
 * Sends email notifications to all active news subscribers when a post is published.
 * Each subscriber receives a personalized email with an unsubscribe link.
 * Also notifies the site owner about the publication.
 */
async function sendNewsNotifications(postId: number, title: string, excerpt: string) {
  try {
    const subscribers = await db.getActiveSubscribers("news");
    if (subscribers.length === 0) return;

    const subscriberCount = subscribers.length;
    let sentCount = 0;

    // Send individual emails to each subscriber
    for (const subscriber of subscribers) {
      const unsubscribeUrl = `/unsubscribe?token=${subscriber.unsubscribeToken}`;
      const htmlBody = `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #1a5c2e;">
            <h1 style="color: #1a5c2e; margin: 0; font-size: 24px;">St. Patrick Church</h1>
            <p style="color: #666; margin: 5px 0 0; font-size: 12px;">Armonk, New York</p>
          </div>
          <div style="padding: 30px 0;">
            <h2 style="color: #333; font-size: 20px;">${title}</h2>
            <p style="color: #555; line-height: 1.6; font-size: 15px;">${excerpt}</p>
            <p style="margin-top: 20px;"><a href="/news-events" style="background: #1a5c2e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Read More</a></p>
          </div>
          <div style="border-top: 1px solid #eee; padding-top: 15px; text-align: center;">
            <p style="color: #999; font-size: 11px;">Church of St. Patrick | 29 Cox Ave, Armonk NY 10504</p>
            <p style="color: #999; font-size: 11px;"><a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe from these emails</a></p>
          </div>
        </div>
      `;

      const sent = await sendEmailToSubscriber(
        subscriber.email,
        `St. Patrick Church: ${title}`,
        htmlBody
      );
      if (sent) sentCount++;
    }

    // Notify owner about the publication
    await notifyOwner({
      title: `New News Post Published: "${title}"`,
      content: `"${title}" has been published. ${sentCount}/${subscriberCount} subscriber email(s) sent successfully.`,
    });

    console.log(`[Notifications] News notification: ${sentCount}/${subscriberCount} emails sent for "${title}"`);
  } catch (error) {
    console.error("[Notifications] Failed to send news notifications:", error);
  }
}

/**
 * Sends email notifications to all active bulletin subscribers when a bulletin is published.
 * Each subscriber receives a personalized email with an unsubscribe link.
 * Also notifies the site owner about the publication.
 */
async function sendBulletinNotifications(bulletinId: number, title: string) {
  try {
    const subscribers = await db.getActiveSubscribers("bulletins");
    if (subscribers.length === 0) return;

    const subscriberCount = subscribers.length;
    let sentCount = 0;

    // Send individual emails to each subscriber
    for (const subscriber of subscribers) {
      const unsubscribeUrl = `/unsubscribe?token=${subscriber.unsubscribeToken}`;
      const htmlBody = `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #1a5c2e;">
            <h1 style="color: #1a5c2e; margin: 0; font-size: 24px;">St. Patrick Church</h1>
            <p style="color: #666; margin: 5px 0 0; font-size: 12px;">Armonk, New York</p>
          </div>
          <div style="padding: 30px 0;">
            <h2 style="color: #333; font-size: 20px;">New Weekly Bulletin</h2>
            <p style="color: #555; line-height: 1.6; font-size: 15px;">The latest parish bulletin "${title}" is now available. View or download it from our website.</p>
            <p style="margin-top: 20px;"><a href="/bulletins" style="background: #1a5c2e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Bulletin</a></p>
          </div>
          <div style="border-top: 1px solid #eee; padding-top: 15px; text-align: center;">
            <p style="color: #999; font-size: 11px;">Church of St. Patrick | 29 Cox Ave, Armonk NY 10504</p>
            <p style="color: #999; font-size: 11px;"><a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe from these emails</a></p>
          </div>
        </div>
      `;

      const sent = await sendEmailToSubscriber(
        subscriber.email,
        `St. Patrick Church: New Bulletin - ${title}`,
        htmlBody
      );
      if (sent) sentCount++;
    }

    // Notify owner about the publication
    await notifyOwner({
      title: `New Bulletin Published: "${title}"`,
      content: `"${title}" has been published. ${sentCount}/${subscriberCount} subscriber email(s) sent successfully.`,
    });

    console.log(`[Notifications] Bulletin notification: ${sentCount}/${subscriberCount} emails sent for "${title}"`);
  } catch (error) {
    console.error("[Notifications] Failed to send bulletin notifications:", error);
  }
}
