/**
 * Router Index — merges all domain routers into the single appRouter.
 * This is the only file that wires everything together.
 * ~50 lines
 */
import { router } from "./_helpers";

// Domain routers
import { authRouter } from "./auth";
import { newsRouter } from "./news";
import { bulletinsRouter } from "./bulletins";
import { bulletinComposeRouter } from "./bulletinCompose";
import { calendarSyncRouter } from "./calendarSync";
import { parishAssistantRouter } from "./parishAssistant";
import { formExportRouter } from "./formExport";
import { eventsRouter } from "./events";
import { weatherRouter } from "./weather";
import { calendarRouter } from "./calendar";
import { subscriptionsRouter } from "./subscriptions";
import { ccdRouter } from "./ccd";
import { cyoRouter } from "./cyo";
import { volunteerRouter } from "./volunteer";
import { galleryRouter } from "./gallery";
import { baptismRouter, sponsorRouter, marriageRouter, funeralRouter, documentsRouter, teenLifeRouter, parishRegistrationRouter, ccdPermissionsRouter } from "./forms";
import { adminStatsRouter, usersRouter, siteSettingsRouter, importantDatesRouter } from "./admin";
import { catholicResourcesRouter, vaticanNewsRouter, dailyReadingsRouter, saintOfDayRouter, prayerWallRouter } from "./content";

export const appRouter = router({
  auth: authRouter,
  news: newsRouter,
  bulletins: bulletinsRouter,
  bulletinCompose: bulletinComposeRouter,
  calendarSync: calendarSyncRouter,
  parishAssistant: parishAssistantRouter,
  formExport: formExportRouter,
  events: eventsRouter,
  weather: weatherRouter,
  googleCalendar: calendarRouter,
  subscriptions: subscriptionsRouter,
  ccd: ccdRouter,
  cyo: cyoRouter,
  volunteer: volunteerRouter,
  gallery: galleryRouter,
  baptism: baptismRouter,
  sponsor: sponsorRouter,
  marriage: marriageRouter,
  funeral: funeralRouter,
  documents: documentsRouter,
  teenLife: teenLifeRouter,
  parishRegistration: parishRegistrationRouter,
  ccdPermissions: ccdPermissionsRouter,
  importantDates: importantDatesRouter,
  adminStats: adminStatsRouter,
  users: usersRouter,
  siteSettings: siteSettingsRouter,
  catholicResources: catholicResourcesRouter,
  vaticanNews: vaticanNewsRouter,
  dailyReadings: dailyReadingsRouter,
  saintOfDay: saintOfDayRouter,
  prayerWall: prayerWallRouter,
});

export type AppRouter = typeof appRouter;

// Re-export for backward compatibility
export { sendCcdReminders } from "../notifications";
