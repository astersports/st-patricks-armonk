import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, newsPosts, bulletins, events, emailSubscriptions, ccdRegistrations, cyoTeams, cyoGames, volunteerOpportunities, volunteerSignups, ccdEvents } from "../drizzle/schema";
import type { InsertNewsPost, InsertBulletin, InsertEvent, InsertEmailSubscription, InsertCcdRegistration, InsertCyoTeam, InsertCyoGame, InsertVolunteerOpportunity, InsertVolunteerSignup, InsertCcdEvent } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ===== USER HELPERS =====

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== NEWS POSTS =====

export async function createNewsPost(data: Omit<InsertNewsPost, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(newsPosts).values(data);
  return result[0].insertId;
}

export async function updateNewsPost(id: number, data: Partial<InsertNewsPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(newsPosts).set(data).where(eq(newsPosts.id, id));
}

export async function deleteNewsPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(newsPosts).where(eq(newsPosts.id, id));
}

export async function getPublishedNewsPosts(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsPosts)
    .where(eq(newsPosts.published, true))
    .orderBy(desc(newsPosts.publishedAt))
    .limit(limit);
}

export async function getAllNewsPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsPosts).orderBy(desc(newsPosts.createdAt));
}

export async function getNewsPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(newsPosts).where(eq(newsPosts.id, id)).limit(1);
  return result[0];
}

// ===== BULLETINS =====

export async function createBulletin(data: Omit<InsertBulletin, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(bulletins).values(data);
  return result[0].insertId;
}

export async function updateBulletin(id: number, data: Partial<InsertBulletin>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bulletins).set(data).where(eq(bulletins.id, id));
}

export async function deleteBulletin(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(bulletins).where(eq(bulletins.id, id));
}

export async function getPublishedBulletins(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bulletins)
    .where(eq(bulletins.published, true))
    .orderBy(desc(bulletins.weekDate))
    .limit(limit);
}

export async function getAllBulletins() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bulletins).orderBy(desc(bulletins.weekDate));
}

export async function getBulletinById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(bulletins).where(eq(bulletins.id, id)).limit(1);
  return result[0];
}

// ===== EVENTS =====

export async function createEvent(data: Omit<InsertEvent, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(events).values(data);
  return result[0].insertId;
}

export async function updateEvent(id: number, data: Partial<InsertEvent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(events).set(data).where(eq(events.id, id));
}

export async function deleteEvent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(events).where(eq(events.id, id));
}

export async function getUpcomingEvents(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(events)
    .where(and(eq(events.published, true), sql`${events.startDate} >= NOW()`))
    .orderBy(events.startDate)
    .limit(limit);
}

export async function getAllEvents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(events).orderBy(desc(events.startDate));
}

export async function getEventById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return result[0];
}

// ===== EMAIL SUBSCRIPTIONS =====

export async function createSubscription(data: Omit<InsertEmailSubscription, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(emailSubscriptions).values(data);
  return result[0].insertId;
}

export async function getSubscriptionByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(emailSubscriptions).where(eq(emailSubscriptions.email, email)).limit(1);
  return result[0];
}

export async function getActiveSubscribers(type: "bulletins" | "news") {
  const db = await getDb();
  if (!db) return [];
  if (type === "bulletins") {
    return db.select().from(emailSubscriptions)
      .where(and(eq(emailSubscriptions.active, true), eq(emailSubscriptions.subscribedToBulletins, true)));
  }
  return db.select().from(emailSubscriptions)
    .where(and(eq(emailSubscriptions.active, true), eq(emailSubscriptions.subscribedToNews, true)));
}

export async function unsubscribeByToken(token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(emailSubscriptions)
    .set({ active: false })
    .where(eq(emailSubscriptions.unsubscribeToken, token));
}

export async function getAllSubscriptions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(emailSubscriptions).orderBy(desc(emailSubscriptions.createdAt));
}

// ===== CCD REGISTRATION HELPERS =====

export async function createCcdRegistration(data: InsertCcdRegistration) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(ccdRegistrations).values(data);
  return result[0].insertId;
}

export async function getCcdRegistrations(schoolYear?: string) {
  const db = await getDb();
  if (!db) return [];
  if (schoolYear) {
    return db.select().from(ccdRegistrations)
      .where(eq(ccdRegistrations.schoolYear, schoolYear))
      .orderBy(desc(ccdRegistrations.createdAt));
  }
  return db.select().from(ccdRegistrations).orderBy(desc(ccdRegistrations.createdAt));
}

export async function updateCcdRegistrationStatus(id: number, status: "pending" | "approved" | "waitlisted" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(ccdRegistrations).set({ status }).where(eq(ccdRegistrations.id, id));
}

// ===== CYO BASKETBALL HELPERS =====

export async function createCyoTeam(data: InsertCyoTeam) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(cyoTeams).values(data);
  return result[0].insertId;
}

export async function getCyoTeams(season?: string) {
  const db = await getDb();
  if (!db) return [];
  if (season) {
    return db.select().from(cyoTeams).where(eq(cyoTeams.season, season)).orderBy(cyoTeams.name);
  }
  return db.select().from(cyoTeams).orderBy(desc(cyoTeams.createdAt));
}

export async function updateCyoTeam(id: number, data: Partial<InsertCyoTeam>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(cyoTeams).set(data).where(eq(cyoTeams.id, id));
}

export async function deleteCyoTeam(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cyoGames).where(eq(cyoGames.teamId, id));
  await db.delete(cyoTeams).where(eq(cyoTeams.id, id));
}

export async function createCyoGame(data: InsertCyoGame) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(cyoGames).values(data);
  return result[0].insertId;
}

export async function getCyoGames(teamId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (teamId) {
    return db.select().from(cyoGames).where(eq(cyoGames.teamId, teamId)).orderBy(cyoGames.gameDate);
  }
  return db.select().from(cyoGames).orderBy(cyoGames.gameDate);
}

export async function updateCyoGame(id: number, data: Partial<InsertCyoGame>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(cyoGames).set(data).where(eq(cyoGames.id, id));
}

export async function deleteCyoGame(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cyoGames).where(eq(cyoGames.id, id));
}

// ===== VOLUNTEER HELPERS =====

export async function createVolunteerOpportunity(data: InsertVolunteerOpportunity) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(volunteerOpportunities).values(data);
  return result[0].insertId;
}

export async function getVolunteerOpportunities(activeOnly = true) {
  const db = await getDb();
  if (!db) return [];
  if (activeOnly) {
    return db.select().from(volunteerOpportunities)
      .where(eq(volunteerOpportunities.active, true))
      .orderBy(volunteerOpportunities.eventDate);
  }
  return db.select().from(volunteerOpportunities).orderBy(desc(volunteerOpportunities.createdAt));
}

export async function updateVolunteerOpportunity(id: number, data: Partial<InsertVolunteerOpportunity>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(volunteerOpportunities).set(data).where(eq(volunteerOpportunities.id, id));
}

export async function deleteVolunteerOpportunity(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(volunteerSignups).where(eq(volunteerSignups.opportunityId, id));
  await db.delete(volunteerOpportunities).where(eq(volunteerOpportunities.id, id));
}

export async function createVolunteerSignup(data: InsertVolunteerSignup) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(volunteerSignups).values(data);
  // Increment spots filled
  await db.update(volunteerOpportunities)
    .set({ spotsFilled: sql`spotsFilled + 1` })
    .where(eq(volunteerOpportunities.id, data.opportunityId));
  return result[0].insertId;
}

export async function getVolunteerSignups(opportunityId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(volunteerSignups)
    .where(and(eq(volunteerSignups.opportunityId, opportunityId), eq(volunteerSignups.status, "confirmed")))
    .orderBy(desc(volunteerSignups.createdAt));
}

export async function cancelVolunteerSignup(id: number, opportunityId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(volunteerSignups).set({ status: "cancelled" }).where(eq(volunteerSignups.id, id));
  await db.update(volunteerOpportunities)
    .set({ spotsFilled: sql`GREATEST(spotsFilled - 1, 0)` })
    .where(eq(volunteerOpportunities.id, opportunityId));
}

// ===== CCD EVENTS =====

export async function getCcdEvents(schoolYear?: string) {
  const db = await getDb();
  if (!db) return [];
  if (schoolYear) {
    return db.select().from(ccdEvents).where(eq(ccdEvents.schoolYear, schoolYear)).orderBy(ccdEvents.eventDate);
  }
  return db.select().from(ccdEvents).orderBy(desc(ccdEvents.eventDate));
}

export async function createCcdEvent(data: Omit<InsertCcdEvent, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(ccdEvents).values(data as any);
  return result[0].insertId;
}

export async function updateCcdEvent(id: number, data: Partial<Omit<InsertCcdEvent, "id" | "createdAt" | "updatedAt">>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(ccdEvents).set(data as any).where(eq(ccdEvents.id, id));
}

export async function deleteCcdEvent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(ccdEvents).where(eq(ccdEvents.id, id));
}
