/**
 * Page-aware context for the Parish Assistant — pure + testable.
 *
 * Maps the current route to a human label (passed to the model so it can prefer
 * page-relevant answers) and a short list of quick prompts shown when the chat
 * is empty. This makes the single site-wide assistant behave like a contextual
 * agent on every page, without spawning a second assistant per page.
 */

export interface PageAssistantContext {
  /** Human label for the current page (sent to the model + shown in the UI). */
  label: string;
  /** Page-relevant quick prompts shown when the conversation is empty (max ~4). */
  suggestions: string[];
}

interface PageRule {
  /** Matched against the pathname (query string stripped), most-specific first. */
  test: (path: string) => boolean;
  context: PageAssistantContext;
}

const DEFAULT_CONTEXT: PageAssistantContext = {
  label: "St. Patrick in Armonk",
  suggestions: ["Mass times?", "How do I register?", "Confessions?", "CCD info?"],
};

// Order matters: the FIRST matching rule wins, so list specific paths before
// their prefixes (e.g. /ccd-registration before /ccd).
const RULES: PageRule[] = [
  {
    test: (p) => p === "/" || p === "",
    context: {
      label: "Home",
      suggestions: ["What time is Sunday Mass?", "What's happening this week?", "How do I register?", "How can I get involved?"],
    },
  },
  {
    test: (p) => p.startsWith("/mass-times"),
    context: {
      label: "Mass Times & Confession",
      suggestions: ["What time is Mass on Sunday?", "When is Confession?", "Is there a weekday Mass?", "What about Holy Days?"],
    },
  },
  {
    test: (p) => p.startsWith("/mass-intention"),
    context: {
      label: "Mass Intentions",
      suggestions: ["How do I request a Mass intention?", "What's the suggested offering?", "Can I request one for someone living?"],
    },
  },
  {
    test: (p) => p.startsWith("/baptism-form"),
    context: {
      label: "Baptism Request",
      suggestions: ["What documents do I need for a Baptism?", "Who can be a godparent?", "How far ahead should I request?"],
    },
  },
  {
    test: (p) => p.startsWith("/marriage-form"),
    context: {
      label: "Marriage Request",
      suggestions: ["How far in advance must we book a wedding?", "What preparation is required?", "What documents do we need?"],
    },
  },
  {
    test: (p) => p.startsWith("/funeral-form"),
    context: {
      label: "Funeral Request",
      suggestions: ["How do I arrange a funeral Mass?", "Who do I contact first?", "Can we hold a memorial Mass?"],
    },
  },
  {
    test: (p) => p.startsWith("/sponsor-form"),
    context: {
      label: "Sponsor Certificate Request",
      suggestions: ["How do I request a sponsor certificate?", "What are the requirements to be a sponsor?"],
    },
  },
  {
    test: (p) => p.startsWith("/sacraments") || p.startsWith("/sacrament-preparation"),
    context: {
      label: "Sacraments",
      suggestions: ["How do I arrange a Baptism?", "What's needed to get married here?", "How do I request a sponsor certificate?", "When is First Communion?"],
    },
  },
  {
    test: (p) => p.startsWith("/forms"),
    context: {
      label: "Forms & Documents",
      suggestions: ["What forms can I submit online?", "How do I request a sacrament certificate?", "Where do I find the bulletin?"],
    },
  },
  {
    test: (p) => p.startsWith("/ccd-permissions"),
    context: {
      label: "CCD Permission Forms",
      suggestions: ["What does the permission form cover?", "How do I authorize pickup?", "Who do I contact about CCD?"],
    },
  },
  {
    test: (p) => p.startsWith("/ccd-registration") || p.startsWith("/faith-formation"),
    context: {
      label: "Faith Formation (CCD)",
      suggestions: ["How do I register my child for CCD?", "What grades does CCD cover?", "What is Teen Life?", "When do classes meet?"],
    },
  },
  {
    test: (p) => p.startsWith("/prayers"),
    context: {
      label: "Prayers & Devotions",
      suggestions: ["How do I submit a prayer intention?", "When is the Rosary?", "When is Adoration?"],
    },
  },
  {
    test: (p) => p.startsWith("/worship"),
    context: {
      label: "Today's Readings & Saint",
      suggestions: ["What are today's readings?", "Who is the saint of the day?", "What's the Gospel today?"],
    },
  },
  {
    test: (p) => p.startsWith("/bulletins"),
    context: {
      label: "Bulletins & Homilies",
      suggestions: ["Where's the latest bulletin?", "What's in this week's bulletin?"],
    },
  },
  {
    test: (p) => p.startsWith("/calendar"),
    context: {
      label: "Calendar",
      suggestions: ["What events are coming up?", "When is the next CCD class?", "Any CYO games this week?"],
    },
  },
  {
    test: (p) => p.startsWith("/news"),
    context: {
      label: "Parish News",
      suggestions: ["What's the latest parish news?", "What's coming up?"],
    },
  },
  {
    test: (p) => p.startsWith("/serve") || p.startsWith("/ministries"),
    context: {
      label: "Serve & Ministries",
      suggestions: ["How can I volunteer?", "What ministries can I join?", "Are there urgent volunteer needs?"],
    },
  },
  {
    test: (p) => p.startsWith("/giving"),
    context: {
      label: "Giving",
      suggestions: ["How can I give online?", "What is the Cardinal's Appeal?", "Can I give by text?"],
    },
  },
  {
    test: (p) => p.startsWith("/new-here"),
    context: {
      label: "I'm New Here",
      suggestions: ["I'm visiting — what should I know?", "Where do I park?", "What time should I arrive?"],
    },
  },
  {
    test: (p) => p.startsWith("/parish-registration"),
    context: {
      label: "Parish Registration",
      suggestions: ["How do I register as a parishioner?", "What information do I need?"],
    },
  },
  {
    test: (p) => p.startsWith("/safe-environment"),
    context: {
      label: "Safe Environment",
      suggestions: ["How do I report a concern?", "What training do volunteers need?", "What is VIRTUS?"],
    },
  },
  {
    test: (p) => p.startsWith("/watch"),
    context: {
      label: "Watch Mass",
      suggestions: ["How do I watch Mass online?", "When is Mass livestreamed?"],
    },
  },
  {
    test: (p) => p.startsWith("/contact") || p.startsWith("/about") || p.startsWith("/staff"),
    context: {
      label: "About & Contact",
      suggestions: ["What are the office hours?", "How do I contact the parish?", "Who is the pastor?"],
    },
  },
];

/** Resolve the assistant context for a route. Query/hash are ignored. */
export function pageAssistantContext(pathname: string): PageAssistantContext {
  const path = (pathname || "/").split("?")[0].split("#")[0];
  return RULES.find((r) => r.test(path))?.context ?? DEFAULT_CONTEXT;
}
