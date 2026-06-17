/**
 * Sacrament-related form routers: baptism, sponsor, marriage, funeral.
 */
import { adminProcedure, router, z, db, notifyOwner } from "../_helpers";
import { rateLimitedFormProcedure } from "../_rateLimited";

export const baptismRouter = router({
  submit: rateLimitedFormProcedure.input(z.object({
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
});

export const sponsorRouter = router({
  submit: rateLimitedFormProcedure.input(z.object({
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
});

export const marriageRouter = router({
  submit: rateLimitedFormProcedure.input(z.object({
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
});

export const funeralRouter = router({
  submit: rateLimitedFormProcedure.input(z.object({
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
});
