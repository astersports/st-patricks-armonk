import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, newsPosts, bulletins, events, emailSubscriptions } from "../drizzle/schema";
import type { InsertNewsPost, InsertBulletin, InsertEvent, InsertEmailSubscription } from "../drizzle/schema";
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
