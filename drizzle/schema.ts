import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * News posts / announcements managed by admin
 */
export const newsPosts = mysqlTable("news_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  excerpt: varchar("excerpt", { length: 1000 }),
  imageUrl: text("imageUrl"),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  authorId: int("authorId"),
});

export type NewsPost = typeof newsPosts.$inferSelect;
export type InsertNewsPost = typeof newsPosts.$inferInsert;

/**
 * Weekly bulletins (PDF uploads)
 */
export const bulletins = mysqlTable("bulletins", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: varchar("description", { length: 1000 }),
  pdfUrl: text("pdfUrl").notNull(),
  pdfKey: varchar("pdfKey", { length: 500 }).notNull(),
  weekDate: timestamp("weekDate").notNull(),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  authorId: int("authorId"),
});

export type Bulletin = typeof bulletins.$inferSelect;
export type InsertBulletin = typeof bulletins.$inferInsert;

/**
 * Parish events
 */
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 500 }),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  allDay: boolean("allDay").default(false).notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  authorId: int("authorId"),
});

export type ParishEvent = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

/**
 * Email subscriptions for parishioners
 */
export const emailSubscriptions = mysqlTable("email_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  subscribedToBulletins: boolean("subscribedToBulletins").default(true).notNull(),
  subscribedToNews: boolean("subscribedToNews").default(true).notNull(),
  active: boolean("active").default(true).notNull(),
  unsubscribeToken: varchar("unsubscribeToken", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmailSubscription = typeof emailSubscriptions.$inferSelect;
export type InsertEmailSubscription = typeof emailSubscriptions.$inferInsert;

/**
 * CCD (Religious Education) Registrations
 */
export const ccdRegistrations = mysqlTable("ccd_registrations", {
  id: int("id").autoincrement().primaryKey(),
  // Parent/Guardian Info
  parentFirstName: varchar("parentFirstName", { length: 255 }).notNull(),
  parentLastName: varchar("parentLastName", { length: 255 }).notNull(),
  parentEmail: varchar("parentEmail", { length: 320 }).notNull(),
  parentPhone: varchar("parentPhone", { length: 20 }).notNull(),
  address: text("address").notNull(),
  // Child Info
  childFirstName: varchar("childFirstName", { length: 255 }).notNull(),
  childLastName: varchar("childLastName", { length: 255 }).notNull(),
  childDob: timestamp("childDob").notNull(),
  grade: varchar("grade", { length: 20 }).notNull(),
  // Sacraments
  baptized: boolean("baptized").default(false).notNull(),
  baptismChurch: varchar("baptismChurch", { length: 500 }),
  firstCommunion: boolean("firstCommunion").default(false).notNull(),
  // Status
  schoolYear: varchar("schoolYear", { length: 20 }).notNull(),
  status: mysqlEnum("status", ["pending", "approved", "waitlisted", "cancelled"]).default("pending").notNull(),
  notes: text("notes"),
  // Reminder preferences
  reminderOptIn: boolean("reminderOptIn").default(true).notNull(),
  unsubscribeToken: varchar("unsubscribeToken", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CcdRegistration = typeof ccdRegistrations.$inferSelect;
export type InsertCcdRegistration = typeof ccdRegistrations.$inferInsert;

/**
 * CYO Basketball Teams
 */
export const cyoTeams = mysqlTable("cyo_teams", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  division: varchar("division", { length: 100 }).notNull(),
  ageGroup: varchar("ageGroup", { length: 50 }).notNull(),
  season: varchar("season", { length: 20 }).notNull(),
  coachName: varchar("coachName", { length: 255 }),
  coachEmail: varchar("coachEmail", { length: 320 }),
  coachPhone: varchar("coachPhone", { length: 20 }),
  wins: int("wins").default(0).notNull(),
  losses: int("losses").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CyoTeam = typeof cyoTeams.$inferSelect;
export type InsertCyoTeam = typeof cyoTeams.$inferInsert;

/**
 * CYO Basketball Games
 */
export const cyoGames = mysqlTable("cyo_games", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  opponent: varchar("opponent", { length: 255 }).notNull(),
  gameDate: timestamp("gameDate").notNull(),
  location: varchar("location", { length: 500 }).notNull(),
  homeAway: mysqlEnum("homeAway", ["home", "away"]).default("home").notNull(),
  ourScore: int("ourScore"),
  theirScore: int("theirScore"),
  status: mysqlEnum("status", ["scheduled", "completed", "cancelled", "postponed"]).default("scheduled").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CyoGame = typeof cyoGames.$inferSelect;
export type InsertCyoGame = typeof cyoGames.$inferInsert;

/**
 * Volunteer Opportunities
 */
export const volunteerOpportunities = mysqlTable("volunteer_opportunities", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  ministry: varchar("ministry", { length: 255 }),
  eventDate: timestamp("eventDate"),
  startTime: varchar("startTime", { length: 20 }),
  endTime: varchar("endTime", { length: 20 }),
  spotsAvailable: int("spotsAvailable").default(0).notNull(),
  spotsFilled: int("spotsFilled").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VolunteerOpportunity = typeof volunteerOpportunities.$inferSelect;
export type InsertVolunteerOpportunity = typeof volunteerOpportunities.$inferInsert;

/**
 * Volunteer Sign-ups
 */
export const volunteerSignups = mysqlTable("volunteer_signups", {
  id: int("id").autoincrement().primaryKey(),
  opportunityId: int("opportunityId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["confirmed", "cancelled"]).default("confirmed").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VolunteerSignup = typeof volunteerSignups.$inferSelect;
export type InsertVolunteerSignup = typeof volunteerSignups.$inferInsert;

/**
 * CCD Class Events - managed by admin, displayed on CCD Calendar
 */
export const ccdEvents = mysqlTable("ccd_events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  eventDate: timestamp("eventDate").notNull(),
  endDate: timestamp("endDate"),
  eventType: mysqlEnum("eventType", ["class", "holiday", "special", "sacrament"]).default("class").notNull(),
  grade: varchar("grade", { length: 50 }),
  location: varchar("location", { length: 500 }),
  schoolYear: varchar("schoolYear", { length: 20 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CcdEvent = typeof ccdEvents.$inferSelect;
export type InsertCcdEvent = typeof ccdEvents.$inferInsert;

/**
 * Parish documents and forms managed by admin
 * Categories: baptism, confirmation, marriage, funeral, ccd, general
 */
export const parishDocuments = mysqlTable("parish_documents", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileKey: varchar("fileKey", { length: 500 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ParishDocument = typeof parishDocuments.$inferSelect;
export type InsertParishDocument = typeof parishDocuments.$inferInsert;
