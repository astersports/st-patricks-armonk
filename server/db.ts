import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, newsPosts, bulletins, events, emailSubscriptions, ccdRegistrations, cyoTeams, cyoGames, volunteerOpportunities, volunteerSignups, ccdEvents, parishDocuments, baptismRegistrations, sponsorCertificates, marriageInquiries, funeralPrePlanning, teenLifeRegistrations, parishRegistrations, ccdPermissions, importantDates } from "../drizzle/schema";
import type { InsertNewsPost, InsertBulletin, InsertEvent, InsertEmailSubscription, InsertCcdRegistration, InsertCyoTeam, InsertCyoGame, InsertVolunteerOpportunity, InsertVolunteerSignup, InsertCcdEvent, InsertParishDocument, BaptismRegistration, SponsorCertificate, MarriageInquiry, FuneralPrePlanning, TeenLifeRegistration, ParishRegistration, CcdPermission } from "../drizzle/schema";
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

// ===== CCD REMINDER HELPERS =====

/**
 * Get all CCD parents who have opted in to reminders and have approved registrations.
 */
export async function getCcdReminderParents() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: ccdRegistrations.id,
    parentFirstName: ccdRegistrations.parentFirstName,
    parentEmail: ccdRegistrations.parentEmail,
    childFirstName: ccdRegistrations.childFirstName,
    grade: ccdRegistrations.grade,
    unsubscribeToken: ccdRegistrations.unsubscribeToken,
  }).from(ccdRegistrations)
    .where(and(
      eq(ccdRegistrations.reminderOptIn, true),
      eq(ccdRegistrations.status, "approved"),
    ));
}

/**
 * Get CCD events happening in the next N days (for scheduled reminders).
 */
export async function getUpcomingCcdEvents(daysAhead: number = 2) {
  const db = await getDb();
  if (!db) return [];
  const now = new Date();
  const future = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  return db.select().from(ccdEvents)
    .where(and(
      gte(ccdEvents.eventDate, now),
      lte(ccdEvents.eventDate, future),
    ))
    .orderBy(ccdEvents.eventDate);
}

/**
 * Unsubscribe a CCD parent from reminders by their token.
 */
export async function unsubscribeCcdReminder(token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(ccdRegistrations)
    .set({ reminderOptIn: false })
    .where(eq(ccdRegistrations.unsubscribeToken, token));
}

// ===== PARISH DOCUMENTS =====

export async function getDocumentsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(parishDocuments)
    .where(and(eq(parishDocuments.category, category), eq(parishDocuments.published, true)))
    .orderBy(parishDocuments.sortOrder);
}

export async function getAllDocuments() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(parishDocuments).orderBy(parishDocuments.category, parishDocuments.sortOrder);
}

export async function createDocument(doc: InsertParishDocument) {
  const db = await getDb();
  if (!db) return;
  await db.insert(parishDocuments).values(doc);
}

export async function updateDocument(id: number, data: Partial<InsertParishDocument>) {
  const db = await getDb();
  if (!db) return;
  await db.update(parishDocuments).set(data).where(eq(parishDocuments.id, id));
}

export async function deleteDocument(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(parishDocuments).where(eq(parishDocuments.id, id));
}

// ===== DIGITAL FORM SUBMISSIONS =====

// Baptism Registrations
export async function createBaptismRegistration(data: Omit<BaptismRegistration, "id" | "status" | "adminNotes" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(baptismRegistrations).values(data as any);
  return result;
}

export async function getBaptismRegistrations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(baptismRegistrations).orderBy(desc(baptismRegistrations.createdAt));
}

export async function updateBaptismStatus(id: number, status: string, adminNotes?: string) {
  const db = await getDb();
  if (!db) return;
  const updateData: any = { status };
  if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
  await db.update(baptismRegistrations).set(updateData).where(eq(baptismRegistrations.id, id));
}

// Sponsor Certificates
export async function createSponsorCertificate(data: Omit<SponsorCertificate, "id" | "status" | "adminNotes" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(sponsorCertificates).values(data as any);
}

export async function getSponsorCertificates() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sponsorCertificates).orderBy(desc(sponsorCertificates.createdAt));
}

export async function updateSponsorStatus(id: number, status: string, adminNotes?: string) {
  const db = await getDb();
  if (!db) return;
  const updateData: any = { status };
  if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
  await db.update(sponsorCertificates).set(updateData).where(eq(sponsorCertificates.id, id));
}

// Marriage Inquiries
export async function createMarriageInquiry(data: Omit<MarriageInquiry, "id" | "status" | "adminNotes" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(marriageInquiries).values(data as any);
}

export async function getMarriageInquiries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(marriageInquiries).orderBy(desc(marriageInquiries.createdAt));
}

export async function updateMarriageStatus(id: number, status: string, adminNotes?: string) {
  const db = await getDb();
  if (!db) return;
  const updateData: any = { status };
  if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
  await db.update(marriageInquiries).set(updateData).where(eq(marriageInquiries.id, id));
}

// Funeral Pre-Planning
export async function createFuneralPrePlanning(data: Omit<FuneralPrePlanning, "id" | "status" | "adminNotes" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(funeralPrePlanning).values(data as any);
}

export async function getFuneralPrePlannings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(funeralPrePlanning).orderBy(desc(funeralPrePlanning.createdAt));
}

export async function updateFuneralStatus(id: number, status: string, adminNotes?: string) {
  const db = await getDb();
  if (!db) return;
  const updateData: any = { status };
  if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
  await db.update(funeralPrePlanning).set(updateData).where(eq(funeralPrePlanning.id, id));
}

// ===== TEEN LIFE REGISTRATIONS =====
export async function createTeenLifeRegistration(data: {
  teenFirstName: string;
  teenLastName: string;
  grade: string;
  school?: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address?: string;
  interests?: string;
  medicalNotes?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  photoConsent?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(teenLifeRegistrations).values(data);
  return result;
}

export async function getTeenLifeRegistrations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teenLifeRegistrations).orderBy(desc(teenLifeRegistrations.createdAt));
}

export async function updateTeenLifeRegistrationStatus(id: number, status: string, adminNotes?: string) {
  const db = await getDb();
  if (!db) return;
  const updateData: Record<string, unknown> = { status };
  if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
  await db.update(teenLifeRegistrations).set(updateData).where(eq(teenLifeRegistrations.id, id));
}

// ===== PARISH REGISTRATIONS =====
export async function createParishRegistration(data: {
  headOfHousehold: string;
  spouseName?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  previousParish?: string;
  numChildren?: string;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(parishRegistrations).values(data);
  return result;
}

export async function getParishRegistrations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(parishRegistrations).orderBy(desc(parishRegistrations.createdAt));
}

export async function updateParishRegistrationStatus(id: number, status: string, adminNotes?: string) {
  const db = await getDb();
  if (!db) return;
  const updateData: Record<string, unknown> = { status };
  if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
  await db.update(parishRegistrations).set(updateData).where(eq(parishRegistrations.id, id));
}

// ===== CCD PERMISSIONS =====

export async function createCcdPermission(data: Omit<CcdPermission, "id" | "createdAt" | "updatedAt" | "status" | "adminNotes">) {
  const db = await getDb();
  const result = await db!.insert(ccdPermissions).values(data as any);
  return result[0].insertId;
}

export async function getCcdPermissions(schoolYear?: string) {
  const db = await getDb();
  if (schoolYear) {
    return db!.select().from(ccdPermissions).where(eq(ccdPermissions.schoolYear, schoolYear)).orderBy(desc(ccdPermissions.createdAt));
  }
  return db!.select().from(ccdPermissions).orderBy(desc(ccdPermissions.createdAt));
}

export async function updateCcdPermissionStatus(id: number, status: "pending" | "approved" | "flagged", adminNotes?: string) {
  const db = await getDb();
  await db!.update(ccdPermissions).set({ status, adminNotes: adminNotes || undefined }).where(eq(ccdPermissions.id, id));
}

// ===== IMPORTANT DATES =====

export async function getUpcomingImportantDates(limit = 12) {
  const db = await getDb();
  const now = new Date();
  return db!.select().from(importantDates)
    .where(and(
      eq(importantDates.published, true),
      gte(importantDates.eventDate, now)
    ))
    .orderBy(importantDates.eventDate)
    .limit(limit);
}

export async function getAllImportantDates() {
  const db = await getDb();
  return db!.select().from(importantDates).orderBy(importantDates.eventDate);
}
