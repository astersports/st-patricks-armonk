import { eq, desc } from "drizzle-orm";
import { bulletins } from "../../drizzle/schema";
import type { InsertBulletin } from "../../drizzle/schema";
import { getDb } from "./_connection";

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

export async function getPublishedBulletins(limit = 100) {
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
