/**
 * Forms Router — baptism, sponsor certificates, marriage, funeral,
 * documents, teen life, parish registration, CCD permissions.
 * These are all the "form submission" endpoints grouped together.
 * ~280 lines
 */
import { adminProcedure, publicProcedure, router, z, db, nanoid, storagePut, notifyOwner } from "./_helpers";

export const baptismRouter = router({
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
});

export const sponsorRouter = router({
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
});

export const marriageRouter = router({
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
});

export const funeralRouter = router({
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
});

export const documentsRouter = router({
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
    fileData: z.string(),
    contentType: z.string(),
  })).mutation(async ({ input }) => {
    const buffer = Buffer.from(input.fileData, "base64");
    const key = `documents/${nanoid()}-${input.fileName}`;
    const { url } = await storagePut(key, buffer, input.contentType);
    return { url, key };
  }),
});

export const teenLifeRouter = router({
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
});

export const parishRegistrationRouter = router({
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
});

export const ccdPermissionsRouter = router({
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
});
