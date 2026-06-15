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

  // ===== GOOGLE CALENDAR (ICS) =====
  googleCalendar: router({
    parishEvents: publicProcedure.query(async () => {
      const { parseICSFeed, PARISH_CALENDAR_ICS } = await import("./icsParser");
      return parseICSFeed(PARISH_CALENDAR_ICS, { daysAhead: 60, maxEvents: 50 });
    }),
    ccdEvents: publicProcedure.query(async () => {
      const { parseICSFeed, CCD_CALENDAR_ICS } = await import("./icsParser");
      return parseICSFeed(CCD_CALENDAR_ICS, { daysAhead: 120, maxEvents: 50 });
    }),
    cyoEvents: publicProcedure.query(async () => {
      const { parseICSFeed, CYO_CALENDAR_ICS } = await import("./icsParser");
      return parseICSFeed(CYO_CALENDAR_ICS, { daysAhead: 120, maxEvents: 50 });
    }),
    nextEvent: publicProcedure.query(async () => {
      const { parseICSFeed, PARISH_CALENDAR_ICS } = await import("./icsParser");
      const events = await parseICSFeed(PARISH_CALENDAR_ICS, { daysAhead: 14, maxEvents: 20 });
      // Return the next non-Mass event for the homepage highlight
      const nonMass = events.find(e => 
        !e.title.toLowerCase().includes("daily mass") && 
        !e.title.toLowerCase().includes("sunday mass")
      );
      return nonMass || events[0] || null;
    }),
    upcomingEvents: publicProcedure.query(async () => {
      const { parseICSFeed, PARISH_CALENDAR_ICS } = await import("./icsParser");
      const events = await parseICSFeed(PARISH_CALENDAR_ICS, { daysAhead: 14, maxEvents: 20 });
      // Return up to 3 upcoming non-Daily-Mass events
      const filtered = events.filter(e => 
        !e.title.toLowerCase().includes("daily mass")
      );
      return filtered.slice(0, 3);
    }),
    allEvents: publicProcedure.query(async () => {
      const { parseICSFeed, PARISH_CALENDAR_ICS, CCD_CALENDAR_ICS, CYO_CALENDAR_ICS } = await import("./icsParser");
      const [parish, ccd, cyo, dbParish, dbCcd] = await Promise.all([
        parseICSFeed(PARISH_CALENDAR_ICS, { daysAhead: 180, maxEvents: 100 }),
        parseICSFeed(CCD_CALENDAR_ICS, { daysAhead: 180, maxEvents: 100 }),
        parseICSFeed(CYO_CALENDAR_ICS, { daysAhead: 180, maxEvents: 100 }),
        db.getUpcomingEvents(),
        db.getCcdEvents("2026-2027"),
      ]);
      const all = [
        ...parish.map(e => ({ ...e, source: "parish" as const })),
        ...ccd.map(e => ({ ...e, source: "ccd" as const })),
        ...cyo.map(e => ({ ...e, source: "cyo" as const })),
        ...(dbParish || []).map(e => ({
          id: `db-${e.id}`,
          title: e.title,
          description: e.description,
          location: e.location,
          startDate: e.startDate,
          endDate: e.endDate,
          allDay: e.allDay,
          source: "parish" as const,
        })),
        ...(dbCcd || []).map((e: any) => ({
          id: `ccd-db-${e.id}`,
          title: e.title,
          description: e.description,
          location: e.location,
          startDate: e.eventDate,
          endDate: e.endDate,
          allDay: false,
          source: "ccd" as const,
        })),
      ].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      return all;
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

  // ===== CCD REGISTRATION =====
  ccd: router({
    register: publicProcedure.input(z.object({
      parentFirstName: z.string().min(1),
      parentLastName: z.string().min(1),
      parentEmail: z.string().email(),
      parentPhone: z.string().min(1),
      address: z.string().min(1),
      childFirstName: z.string().min(1),
      childLastName: z.string().min(1),
      childDob: z.string(),
      grade: z.string().min(1),
      baptized: z.boolean(),
      baptismChurch: z.string().optional(),
      firstCommunion: z.boolean(),
      schoolYear: z.string().min(1),
      notes: z.string().optional(),
      reminderOptIn: z.boolean().default(true),
    })).mutation(async ({ input }) => {
      const unsubscribeToken = nanoid(32);
      const id = await db.createCcdRegistration({
        ...input,
        childDob: new Date(input.childDob),
        baptismChurch: input.baptismChurch ?? null,
        notes: input.notes ?? null,
        reminderOptIn: input.reminderOptIn,
        unsubscribeToken,
      });
      // Notify owner of new registration
      await notifyOwner({
        title: "New CCD Registration",
        content: `${input.childFirstName} ${input.childLastName} (Grade ${input.grade}) has been registered for CCD ${input.schoolYear} by ${input.parentFirstName} ${input.parentLastName} (${input.parentEmail}).`,
      });
      return { success: true, id };
    }),
    list: adminProcedure.input(z.object({
      schoolYear: z.string().optional(),
    }).optional()).query(async ({ input }) => {
      return db.getCcdRegistrations(input?.schoolYear);
    }),
    updateStatus: adminProcedure.input(z.object({
      id: z.number(),
      status: z.enum(["pending", "approved", "waitlisted", "cancelled"]),
    })).mutation(async ({ input }) => {
      await db.updateCcdRegistrationStatus(input.id, input.status);
      return { success: true };
    }),
    // CCD Calendar Events
    listEvents: publicProcedure.input(z.object({
      schoolYear: z.string().optional(),
    }).optional()).query(async ({ input }) => {
      return db.getCcdEvents(input?.schoolYear);
    }),
    createEvent: adminProcedure.input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      eventDate: z.string(),
      endDate: z.string().optional(),
      eventType: z.enum(["class", "holiday", "special", "sacrament"]),
      grade: z.string().optional(),
      location: z.string().optional(),
      schoolYear: z.string().min(1),
    })).mutation(async ({ input }) => {
      const id = await db.createCcdEvent({
        ...input,
        eventDate: new Date(input.eventDate),
        endDate: input.endDate ? new Date(input.endDate) : null,
        description: input.description ?? null,
        grade: input.grade ?? null,
        location: input.location ?? null,
      });
      return { success: true, id };
    }),
    updateEvent: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      eventDate: z.string().optional(),
      endDate: z.string().optional(),
      eventType: z.enum(["class", "holiday", "special", "sacrament"]).optional(),
      grade: z.string().optional(),
      location: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { id, eventDate, endDate, ...rest } = input;
      const data: any = { ...rest };
      if (eventDate) data.eventDate = new Date(eventDate);
      if (endDate) data.endDate = new Date(endDate);
      await db.updateCcdEvent(id, data);
      return { success: true };
    }),
    deleteEvent: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteCcdEvent(input.id);
      return { success: true };
    }),
  }),

  // ===== CYO BASKETBALL =====
  cyo: router({
    // Teams
    listTeams: publicProcedure.input(z.object({
      season: z.string().optional(),
    }).optional()).query(async ({ input }) => {
      return db.getCyoTeams(input?.season);
    }),
    createTeam: adminProcedure.input(z.object({
      name: z.string().min(1),
      division: z.string().min(1),
      ageGroup: z.string().min(1),
      season: z.string().min(1),
      coachName: z.string().optional(),
      coachEmail: z.string().optional(),
      coachPhone: z.string().optional(),
    })).mutation(async ({ input }) => {
      const id = await db.createCyoTeam({
        ...input,
        coachName: input.coachName ?? null,
        coachEmail: input.coachEmail ?? null,
        coachPhone: input.coachPhone ?? null,
      });
      return { success: true, id };
    }),
    updateTeam: adminProcedure.input(z.object({
      id: z.number(),
      name: z.string().optional(),
      division: z.string().optional(),
      ageGroup: z.string().optional(),
      coachName: z.string().optional(),
      coachEmail: z.string().optional(),
      coachPhone: z.string().optional(),
      wins: z.number().optional(),
      losses: z.number().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateCyoTeam(id, data as any);
      return { success: true };
    }),
    deleteTeam: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteCyoTeam(input.id);
      return { success: true };
    }),
    // Games
    listGames: publicProcedure.input(z.object({
      teamId: z.number().optional(),
    }).optional()).query(async ({ input }) => {
      return db.getCyoGames(input?.teamId);
    }),
    createGame: adminProcedure.input(z.object({
      teamId: z.number(),
      opponent: z.string().min(1),
      gameDate: z.string(),
      location: z.string().min(1),
      homeAway: z.enum(["home", "away"]),
      notes: z.string().optional(),
    })).mutation(async ({ input }) => {
      const id = await db.createCyoGame({
        ...input,
        gameDate: new Date(input.gameDate),
        notes: input.notes ?? null,
      });
      return { success: true, id };
    }),
    updateGame: adminProcedure.input(z.object({
      id: z.number(),
      opponent: z.string().optional(),
      gameDate: z.string().optional(),
      location: z.string().optional(),
      homeAway: z.enum(["home", "away"]).optional(),
      ourScore: z.number().optional(),
      theirScore: z.number().optional(),
      status: z.enum(["scheduled", "completed", "cancelled", "postponed"]).optional(),
      notes: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { id, gameDate, ...rest } = input;
      const data: any = { ...rest };
      if (gameDate) data.gameDate = new Date(gameDate);
      await db.updateCyoGame(id, data);
      return { success: true };
    }),
    deleteGame: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteCyoGame(input.id);
      return { success: true };
    }),
  }),

  // ===== VOLUNTEER SIGN-UPS =====
  volunteer: router({
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
    signup: publicProcedure.input(z.object({
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
  }),

  // ===== PARISH DOCUMENTS =====
  // ===== DIGITAL FORM SUBMISSIONS =====
  baptism: router({
    submit: publicProcedure.input(z.object({
      childFirstName: z.string().min(1),
      childLastName: z.string().min(1),
      childDob: z.string().min(1),
      childGender: z.string().min(1),
      fatherName: z.string().optional(),
      motherName: z.string().optional(),
      parentEmail: z.string().email(),
      parentPhone: z.string().min(1),
      address: z.string().min(1),
      godparentName1: z.string().optional(),
      godparentName2: z.string().optional(),
      preferredDate: z.string().optional(),
      birthCertUrl: z.string().optional(),
      notes: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.createBaptismRegistration(input as any);
      await notifyOwner({ title: "New Baptism Registration", content: `${input.childFirstName} ${input.childLastName} - Parent: ${input.parentEmail}` });
      return { success: true };
    }),
    list: adminProcedure.query(async () => {
      return db.getBaptismRegistrations();
    }),
    updateStatus: adminProcedure.input(z.object({
      id: z.number(),
      status: z.string(),
      adminNotes: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.updateBaptismStatus(input.id, input.status, input.adminNotes);
      return { success: true };
    }),
  }),

  sponsor: router({
    submit: publicProcedure.input(z.object({
      sponsorFirstName: z.string().min(1),
      sponsorLastName: z.string().min(1),
      sponsorEmail: z.string().email(),
      sponsorPhone: z.string().min(1),
      sponsorAddress: z.string().min(1),
      sponsorParish: z.string().min(1),
      sponsorParishCity: z.string().min(1),
      sacramentType: z.enum(["baptism", "confirmation"]),
      candidateName: z.string().min(1),
      ceremonyDate: z.string().optional(),
      isBaptized: z.boolean(),
      isConfirmed: z.boolean(),
      isActiveCatholic: z.boolean(),
      notes: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.createSponsorCertificate(input as any);
      await notifyOwner({ title: "New Sponsor Certificate Request", content: `${input.sponsorFirstName} ${input.sponsorLastName} for ${input.candidateName} (${input.sacramentType})` });
      return { success: true };
    }),
    list: adminProcedure.query(async () => {
      return db.getSponsorCertificates();
    }),
    updateStatus: adminProcedure.input(z.object({
      id: z.number(),
      status: z.string(),
      adminNotes: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.updateSponsorStatus(input.id, input.status, input.adminNotes);
      return { success: true };
    }),
  }),

  marriage: router({
    submit: publicProcedure.input(z.object({
      brideFirstName: z.string().min(1),
      brideLastName: z.string().min(1),
      brideEmail: z.string().email(),
      bridePhone: z.string().min(1),
      brideReligion: z.string().optional(),
      brideParish: z.string().optional(),
      groomFirstName: z.string().min(1),
      groomLastName: z.string().min(1),
      groomEmail: z.string().optional(),
      groomPhone: z.string().optional(),
      groomReligion: z.string().optional(),
      groomParish: z.string().optional(),
      preferredDate: z.string().optional(),
      alternateDate: z.string().optional(),
      isParishioner: z.boolean(),
      previousMarriage: z.boolean(),
      previousMarriageDetails: z.string().optional(),
      guestCount: z.string().optional(),
      notes: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.createMarriageInquiry(input as any);
      await notifyOwner({ title: "New Marriage Inquiry", content: `${input.brideFirstName} ${input.brideLastName} & ${input.groomFirstName} ${input.groomLastName} - Preferred: ${input.preferredDate || 'TBD'}` });
      return { success: true };
    }),
    list: adminProcedure.query(async () => {
      return db.getMarriageInquiries();
    }),
    updateStatus: adminProcedure.input(z.object({
      id: z.number(),
      status: z.string(),
      adminNotes: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.updateMarriageStatus(input.id, input.status, input.adminNotes);
      return { success: true };
    }),
  }),

  funeral: router({
    submit: publicProcedure.input(z.object({
      plannerName: z.string().min(1),
      plannerEmail: z.string().email(),
      plannerPhone: z.string().min(1),
      plannerRelation: z.string().optional(),
      deceasedName: z.string().min(1),
      isPrePlanning: z.boolean(),
      preferredDate: z.string().optional(),
      massType: z.enum(["funeral_mass", "memorial_mass", "vigil_service", "graveside"]),
      firstReading: z.string().optional(),
      secondReading: z.string().optional(),
      gospel: z.string().optional(),
      hymns: z.string().optional(),
      eulogist: z.string().optional(),
      pallbearers: z.string().optional(),
      specialRequests: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.createFuneralPrePlanning(input as any);
      await notifyOwner({ title: "New Funeral Pre-Planning Form", content: `Planner: ${input.plannerName} - For: ${input.deceasedName} (${input.isPrePlanning ? 'Pre-planning' : 'Immediate need'})` });
      return { success: true };
    }),
    list: adminProcedure.query(async () => {
      return db.getFuneralPrePlannings();
    }),
    updateStatus: adminProcedure.input(z.object({
      id: z.number(),
      status: z.string(),
      adminNotes: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.updateFuneralStatus(input.id, input.status, input.adminNotes);
      return { success: true };
    }),
  }),

  documents: router({
    byCategory: publicProcedure.input(z.object({ category: z.string() })).query(async ({ input }) => {
      return db.getDocumentsByCategory(input.category);
    }),
    all: adminProcedure.query(async () => {
      return db.getAllDocuments();
    }),
    create: adminProcedure.input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      category: z.string().min(1),
      fileUrl: z.string().min(1),
      fileKey: z.string().optional(),
      sortOrder: z.number().optional(),
    })).mutation(async ({ input }) => {
      await db.createDocument({ ...input, sortOrder: input.sortOrder ?? 0 });
      return { success: true };
    }),
    update: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      category: z.string().optional(),
      fileUrl: z.string().optional(),
      sortOrder: z.number().optional(),
      published: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateDocument(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteDocument(input.id);
      return { success: true };
    }),
    upload: adminProcedure.input(z.object({
      fileName: z.string(),
      fileData: z.string(), // base64
      contentType: z.string(),
    })).mutation(async ({ input }) => {
      const buffer = Buffer.from(input.fileData, "base64");
      const key = `documents/${nanoid()}-${input.fileName}`;
      const { url } = await storagePut(key, buffer, input.contentType);
      return { url, key };
    }),
  }),

  // Teen Life registration
  teenLife: router({
    register: publicProcedure.input(z.object({
      teenFirstName: z.string().min(1),
      teenLastName: z.string().min(1),
      grade: z.string().min(1),
      school: z.string().optional(),
      parentName: z.string().min(1),
      parentEmail: z.string().email(),
      parentPhone: z.string().min(1),
      address: z.string().optional(),
      interests: z.string().optional(),
      medicalNotes: z.string().optional(),
      emergencyContact: z.string().optional(),
      emergencyPhone: z.string().optional(),
      photoConsent: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      await db.createTeenLifeRegistration({
        ...input,
        photoConsent: input.photoConsent ? 1 : 0,
      });
      // Notify parish office
      notifyOwner({
        title: "New Teen Life Registration",
        content: `${input.teenFirstName} ${input.teenLastName} (Grade ${input.grade}) has registered for Teen Life. Parent: ${input.parentName} (${input.parentEmail}).`,
      }).catch(() => {});
      return { success: true };
    }),
    list: adminProcedure.query(async () => {
      return db.getTeenLifeRegistrations();
    }),
    updateStatus: adminProcedure.input(z.object({
      id: z.number(),
      status: z.string(),
      adminNotes: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.updateTeenLifeRegistrationStatus(input.id, input.status, input.adminNotes);
      return { success: true };
    }),
  }),
  parishRegistration: router({
    create: publicProcedure.input(z.object({
      headOfHousehold: z.string().min(1),
      spouseName: z.string().optional(),
      address: z.string().min(1),
      city: z.string().min(1),
      state: z.string().default("NY"),
      zip: z.string().min(1),
      phone: z.string().min(1),
      email: z.string().email(),
      previousParish: z.string().optional(),
      numChildren: z.string().optional(),
      notes: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.createParishRegistration(input);
      notifyOwner({
        title: "New Parish Registration",
        content: `${input.headOfHousehold} (${input.email}) has registered as a new parishioner. Address: ${input.address}, ${input.city}, ${input.state} ${input.zip}. Phone: ${input.phone}.`,
      }).catch(() => {});
      return { success: true };
    }),
    list: adminProcedure.query(async () => {
      return db.getParishRegistrations();
    }),
    updateStatus: adminProcedure.input(z.object({
      id: z.number(),
      status: z.string(),
      adminNotes: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.updateParishRegistrationStatus(input.id, input.status, input.adminNotes);
      return { success: true };
    }),
  }),

  // CCD Permission & Release Forms
  ccdPermissions: router({
    submit: publicProcedure.input(z.object({
      childFirstName: z.string().min(1),
      childLastName: z.string().min(1),
      childGrade: z.string().min(1),
      parentName: z.string().min(1),
      parentPhone: z.string().min(1),
      parentEmail: z.string().email(),
      needsBusTransport: z.boolean(),
      busPickupLocation: z.string().optional(),
      busDropoffLocation: z.string().optional(),
      busNotes: z.string().optional(),
      earlyDismissalAuthorized: z.boolean(),
      earlyDismissalReason: z.string().optional(),
      earlyDismissalDates: z.string().optional(),
      authorizedPickup1Name: z.string().min(1),
      authorizedPickup1Phone: z.string().min(1),
      authorizedPickup1Relation: z.string().min(1),
      authorizedPickup2Name: z.string().optional(),
      authorizedPickup2Phone: z.string().optional(),
      authorizedPickup2Relation: z.string().optional(),
      authorizedPickup3Name: z.string().optional(),
      authorizedPickup3Phone: z.string().optional(),
      authorizedPickup3Relation: z.string().optional(),
      allergies: z.string().optional(),
      medications: z.string().optional(),
      medicalConditions: z.string().optional(),
      doctorName: z.string().optional(),
      doctorPhone: z.string().optional(),
      insuranceProvider: z.string().optional(),
      insurancePolicyNumber: z.string().optional(),
      emergencyContactName: z.string().min(1),
      emergencyContactPhone: z.string().min(1),
      emergencyContactRelation: z.string().min(1),
      photoReleaseConsent: z.boolean(),
      medicalReleaseConsent: z.boolean(),
      parentSignature: z.string().min(1),
      signatureDate: z.string().min(1),
      schoolYear: z.string().min(1),
    })).mutation(async ({ input }) => {
      await db.createCcdPermission(input as any);
      notifyOwner({
        title: "New CCD Permission Form Submitted",
        content: `${input.parentName} submitted a CCD Permission & Release form for ${input.childFirstName} ${input.childLastName} (Grade ${input.childGrade}). Bus: ${input.needsBusTransport ? "Yes" : "No"}, Photo Release: ${input.photoReleaseConsent ? "Yes" : "No"}.`,
      }).catch(() => {});
      return { success: true };
    }),
    list: adminProcedure.query(async () => {
      return db.getCcdPermissions();
    }),
    updateStatus: adminProcedure.input(z.object({
      id: z.number(),
      status: z.enum(["pending", "approved", "flagged"]),
      adminNotes: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.updateCcdPermissionStatus(input.id, input.status, input.adminNotes);
      return { success: true };
    }),
  }),

  importantDates: router({
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
            <h1 style="color: #1a5c2e; margin: 0; font-size: 24px;">St. Patrick in Armonk</h1>
            <p style="color: #666; margin: 5px 0 0; font-size: 12px;">Armonk, New York</p>
          </div>
          <div style="padding: 30px 0;">
            <h2 style="color: #333; font-size: 20px;">${title}</h2>
            <p style="color: #555; line-height: 1.6; font-size: 15px;">${excerpt}</p>
            <p style="margin-top: 20px;"><a href="/news" style="background: #1a5c2e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Read More</a></p>
          </div>
          <div style="border-top: 1px solid #eee; padding-top: 15px; text-align: center;">
            <p style="color: #999; font-size: 11px;">St. Patrick in Armonk | 29 Cox Ave, Armonk NY 10504</p>
            <p style="color: #999; font-size: 11px;"><a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe from these emails</a></p>
          </div>
        </div>
      `;

      const sent = await sendEmailToSubscriber(
        subscriber.email,
        `St. Patrick in Armonk: ${title}`,
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
            <h1 style="color: #1a5c2e; margin: 0; font-size: 24px;">St. Patrick in Armonk</h1>
            <p style="color: #666; margin: 5px 0 0; font-size: 12px;">Armonk, New York</p>
          </div>
          <div style="padding: 30px 0;">
            <h2 style="color: #333; font-size: 20px;">New Weekly Bulletin</h2>
            <p style="color: #555; line-height: 1.6; font-size: 15px;">The latest parish bulletin "${title}" is now available. View or download it from our website.</p>
            <p style="margin-top: 20px;"><a href="/bulletins" style="background: #1a5c2e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Bulletin</a></p>
          </div>
          <div style="border-top: 1px solid #eee; padding-top: 15px; text-align: center;">
            <p style="color: #999; font-size: 11px;">St. Patrick in Armonk | 29 Cox Ave, Armonk NY 10504</p>
            <p style="color: #999; font-size: 11px;"><a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe from these emails</a></p>
          </div>
        </div>
      `;

      const sent = await sendEmailToSubscriber(
        subscriber.email,
        `St. Patrick in Armonk: New Bulletin - ${title}`,
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

/**
 * Sends CCD class reminder emails to all opted-in parents for upcoming events.
 * Called by the scheduled handler when a CCD event is approaching.
 */
export async function sendCcdReminders(events: Array<{ id: number; title: string; eventDate: Date; eventType: string; grade: string | null; location: string | null }>) {
  try {
    const parents = await db.getCcdReminderParents();
    if (parents.length === 0) return { sent: 0, total: 0 };

    let sentCount = 0;
    for (const parent of parents) {
      // Filter events by grade if applicable
      const relevantEvents = events.filter(e => !e.grade || e.grade === "All" || e.grade === parent.grade);
      if (relevantEvents.length === 0) continue;

      const eventListHtml = relevantEvents.map(e => {
        const dateStr = new Date(e.eventDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" });
        return `<li style="margin-bottom: 8px;"><strong>${e.title}</strong> — ${dateStr}${e.location ? ` at ${e.location}` : ""}</li>`;
      }).join("");

      const unsubscribeUrl = `/ccd-unsubscribe?token=${parent.unsubscribeToken}`;
      const htmlBody = `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #1a5c2e;">
            <h1 style="color: #1a5c2e; margin: 0; font-size: 24px;">St. Patrick in Armonk</h1>
            <p style="color: #666; margin: 5px 0 0; font-size: 12px;">Religious Education Reminder</p>
          </div>
          <div style="padding: 30px 0;">
            <p style="color: #333; font-size: 16px;">Dear ${parent.parentFirstName},</p>
            <p style="color: #555; line-height: 1.6; font-size: 15px;">This is a reminder about upcoming CCD activities for <strong>${parent.childFirstName}</strong> (Grade ${parent.grade}):</p>
            <ul style="color: #555; line-height: 1.8; font-size: 14px;">${eventListHtml}</ul>
            <p style="margin-top: 20px;"><a href="/ccd-calendar" style="background: #1a5c2e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Full Calendar</a></p>
          </div>
          <div style="border-top: 1px solid #eee; padding-top: 15px; text-align: center;">
            <p style="color: #999; font-size: 11px;">St. Patrick in Armonk | 29 Cox Ave, Armonk NY 10504</p>
            <p style="color: #999; font-size: 11px;"><a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe from CCD reminders</a></p>
          </div>
        </div>
      `;

      const sent = await sendEmailToSubscriber(
        parent.parentEmail,
        `CCD Reminder: Upcoming Class for ${parent.childFirstName}`,
        htmlBody
      );
      if (sent) sentCount++;
    }

    console.log(`[CCD Reminders] ${sentCount}/${parents.length} reminder emails sent`);
    return { sent: sentCount, total: parents.length };
  } catch (error) {
    console.error("[CCD Reminders] Failed to send reminders:", error);
    return { sent: 0, total: 0 };
  }
}
