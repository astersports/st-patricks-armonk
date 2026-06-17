import { eq, desc } from "drizzle-orm";
import { baptismRegistrations, sponsorCertificates, marriageInquiries, funeralPrePlanning, teenLifeRegistrations, parishRegistrations } from "../../drizzle/schema";
import type { BaptismRegistration, SponsorCertificate, MarriageInquiry, FuneralPrePlanning } from "../../drizzle/schema";
import { getDb } from "./_connection";

// ===== BAPTISM REGISTRATIONS =====

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

// ===== SPONSOR CERTIFICATES =====

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

// ===== MARRIAGE INQUIRIES =====

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

// ===== FUNERAL PRE-PLANNING =====

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
