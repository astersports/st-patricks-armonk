/**
 * Parish "scan console" content per route — pure + testable.
 *
 * Drives the agent-style ParishScanConsole that sits at the top of each page:
 * a live, monospace console where a friendly parish "scout" appears to scan the
 * page's domain (this week's Masses, today's readings, ways to serve…) and
 * lights up category chips. This is the on-brand "alive" visual language —
 * adapted from the Aster frontier-scan console to warm parish content.
 *
 * Pure: route in, content out. The component owns the animation; this owns the
 * words. First match wins, most-specific first (mirrors pageAssistant).
 */

export interface ParishScan {
  /** Monospace eyebrow scope shown after "ST·PATRICK ·" (e.g. "MASS TIMES"). */
  scope: string;
  /** The lines the console "scans" through, in order. Keep them warm + active. */
  steps: string[];
  /** Category chips; the active one tracks the current step. UPPERCASE reads best. */
  chips: string[];
}

const DEFAULT_SCAN: ParishScan = {
  scope: "PARISH SCAN",
  steps: [
    "scanning the parish",
    "finding this week's Masses",
    "gathering today's readings",
    "looking for ways to help",
  ],
  chips: ["MASS", "THIS WEEK", "READINGS", "SERVE", "GIVING"],
};

interface ScanRule {
  test: (path: string) => boolean;
  scan: ParishScan;
}

// Routes where a scanning console would distract or feel wrong (legal, raw
// unsubscribe/landing utility pages). These render no console.
const SKIP = ["/privacy", "/unsubscribe", "/ccd-unsubscribe", "/404"];

const RULES: ScanRule[] = [
  {
    test: (p) => p === "/" || p === "",
    scan: {
      scope: "PARISH PULSE",
      steps: [
        "scanning this week at the parish",
        "finding the next Mass",
        "gathering today's readings",
        "checking for parish news",
      ],
      chips: ["MASS", "THIS WEEK", "READINGS", "NEWS", "GIVING"],
    },
  },
  {
    test: (p) => p.startsWith("/mass-times"),
    scan: {
      scope: "MASS & CONFESSION",
      steps: ["finding this Sunday's Masses", "checking confession times", "noting daily Mass", "looking up Holy Days"],
      chips: ["MASS", "CONFESSION", "ADORATION", "HOLY DAYS"],
    },
  },
  {
    test: (p) => p.startsWith("/mass-intention"),
    scan: {
      scope: "MASS INTENTIONS",
      steps: ["preparing a Mass intention", "finding available Mass dates", "noting the offering"],
      chips: ["INTENTION", "DATES", "OFFERING"],
    },
  },
  {
    test: (p) => p.startsWith("/baptism-form"),
    scan: {
      scope: "BAPTISM",
      steps: ["preparing a baptism request", "noting the documents needed", "finding godparent guidance"],
      chips: ["BAPTISM", "DOCUMENTS", "GODPARENTS"],
    },
  },
  {
    test: (p) => p.startsWith("/marriage-form"),
    scan: {
      scope: "MARRIAGE",
      steps: ["preparing a marriage request", "noting preparation steps", "finding available dates"],
      chips: ["MARRIAGE", "PREPARATION", "DATES"],
    },
  },
  {
    test: (p) => p.startsWith("/funeral-form"),
    scan: {
      scope: "FUNERAL",
      steps: ["preparing a funeral request", "noting how to reach the office", "finding Mass options"],
      chips: ["FUNERAL", "OFFICE", "MASS"],
    },
  },
  {
    test: (p) => p.startsWith("/sponsor-form"),
    scan: {
      scope: "SPONSOR CERTIFICATE",
      steps: ["preparing a sponsor certificate", "checking eligibility", "noting the candidate"],
      chips: ["SPONSOR", "ELIGIBILITY", "CANDIDATE"],
    },
  },
  {
    test: (p) => p.startsWith("/sacraments") || p.startsWith("/sacrament-preparation"),
    scan: {
      scope: "SACRAMENTS",
      steps: ["reviewing sacrament preparation", "finding baptism guidance", "checking marriage requirements", "noting sponsor certificates"],
      chips: ["BAPTISM", "MARRIAGE", "FUNERAL", "SPONSOR"],
    },
  },
  {
    test: (p) => p.startsWith("/worship"),
    scan: {
      scope: "TODAY'S WORD",
      steps: ["reading today's Scripture", "finding the saint of the day", "noting the liturgical season"],
      chips: ["READINGS", "SAINT", "GOSPEL"],
    },
  },
  {
    test: (p) => p.startsWith("/bulletins"),
    scan: {
      scope: "BULLETIN",
      steps: ["finding the latest bulletin", "scanning this week's highlights", "checking the archive"],
      chips: ["BULLETIN", "THIS WEEK", "ARCHIVE"],
    },
  },
  {
    test: (p) => p.startsWith("/calendar"),
    scan: {
      scope: "CALENDAR",
      steps: ["gathering upcoming events", "finding CCD classes", "checking CYO games"],
      chips: ["PARISH", "CCD", "CYO"],
    },
  },
  {
    test: (p) => p.startsWith("/news"),
    scan: {
      scope: "PARISH NEWS",
      steps: ["scanning the latest parish news", "finding what's coming up"],
      chips: ["NEWS", "EVENTS"],
    },
  },
  {
    test: (p) => p.startsWith("/serve") || p.startsWith("/ministries"),
    scan: {
      scope: "SERVE",
      steps: ["finding ways to serve", "checking urgent volunteer needs", "exploring ministries"],
      chips: ["VOLUNTEER", "MINISTRIES", "URGENT"],
    },
  },
  {
    test: (p) => p.startsWith("/giving"),
    scan: {
      scope: "GIVING",
      steps: ["preparing online giving", "finding the Cardinal's Appeal", "noting ways to give"],
      chips: ["ONLINE", "APPEAL", "TEXT"],
    },
  },
  {
    test: (p) => p.startsWith("/faith-formation") || p.startsWith("/ccd-registration") || p.startsWith("/ccd-permissions"),
    scan: {
      scope: "FAITH FORMATION",
      steps: ["finding faith formation", "checking CCD registration", "noting Teen Life"],
      chips: ["CCD", "TEEN LIFE", "REGISTER"],
    },
  },
  {
    test: (p) => p.startsWith("/prayers"),
    scan: {
      scope: "PRAYER",
      steps: ["gathering prayer intentions", "finding the Rosary", "noting Adoration"],
      chips: ["INTENTIONS", "ROSARY", "ADORATION"],
    },
  },
  {
    test: (p) => p.startsWith("/new-here") || p.startsWith("/parish-registration"),
    scan: {
      scope: "WELCOME",
      steps: ["welcoming new parishioners", "finding registration", "noting what to expect"],
      chips: ["WELCOME", "REGISTER", "VISIT"],
    },
  },
  {
    test: (p) => p.startsWith("/watch"),
    scan: {
      scope: "WATCH LIVE",
      steps: ["finding the livestream", "checking Mass times online"],
      chips: ["LIVE", "MASS", "YOUTUBE"],
    },
  },
  {
    test: (p) => p.startsWith("/contact") || p.startsWith("/about") || p.startsWith("/staff"),
    scan: {
      scope: "PARISH OFFICE",
      steps: ["finding parish contacts", "noting office hours", "meeting the staff"],
      chips: ["CONTACT", "OFFICE", "STAFF"],
    },
  },
];

/** Resolve the scan-console content for a route, or null if it should be hidden. */
export function pageScan(pathname: string): ParishScan | null {
  const path = (pathname || "/").split("?")[0].split("#")[0];
  if (SKIP.some((s) => path === s || path.startsWith(s + "/"))) return null;
  return RULES.find((r) => r.test(path))?.scan ?? DEFAULT_SCAN;
}
