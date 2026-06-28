/**
 * Parish Highlights Router — public "This Week at the Parish" card.
 *
 * Aggregates the parish's own structured rows (DB events, key dates, holy days)
 * into one window-filtered list via the pure shared helper, and optionally adds
 * a warm AI-written intro that summarizes ONLY those facts. Deterministic core
 * works with no AI key; the intro degrades to a template on any failure.
 */
import { publicProcedure, z, db } from "./_helpers";
import { invokeLLM } from "../_core/llm";
import { ENV } from "../_core/env";
import {
  buildThisWeekHighlights,
  defaultHighlightsIntro,
  type RawHighlight,
} from "../../shared/thisWeekHighlights";

/** Parse a holy-day "YYYY-MM-DD" string to a Date at local noon (no tz rollover). */
function parseDateOnly(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0);
}

/** Gather the live rows and normalize them into RawHighlight shape. */
async function gatherRawHighlights(): Promise<RawHighlight[]> {
  const items: RawHighlight[] = [];

  try {
    for (const e of await db.getUpcomingEvents(20)) {
      items.push({ kind: "event", title: e.title, date: new Date(e.startDate), location: e.location });
    }
  } catch (err) { console.error("[Highlights] events fetch failed:", err); }

  try {
    for (const k of await db.getAllPublishedImportantDates()) {
      items.push({ kind: "key_date", title: k.title, date: new Date(k.eventDate), location: k.location, note: k.note, allDay: true });
    }
  } catch (err) { console.error("[Highlights] key dates fetch failed:", err); }

  try {
    for (const h of await db.getUpcomingHolyDays(10)) {
      const times = Array.isArray(h.massTimes) ? (h.massTimes as string[]).join(", ") : "";
      items.push({
        kind: "holy_day",
        title: h.name,
        date: parseDateOnly(h.date),
        note: times ? `Mass at ${times}` : h.notes,
        allDay: true,
      });
    }
  } catch (err) { console.error("[Highlights] holy days fetch failed:", err); }

  return items;
}

/** Collapse whitespace and length-bound a fact field before it enters the prompt. */
function boundFact(s: string, max: number): string {
  return (s || "").replace(/\s+/g, " ").trim().slice(0, max);
}

/** One warm sentence summarizing the given highlights. Null on any failure. */
async function aiIntro(highlights: { title: string; dateLabel: string }[]): Promise<string | null> {
  // Degrade quietly to the template intro when no key is configured (the sandbox
  // default) — invokeLLM would otherwise throw and log on every page load.
  if (!ENV.forgeApiKey) return null;
  try {
    // Bound each fact: parish-provided, but a stray long title shouldn't bloat the prompt.
    const facts = highlights.map((h) => `- ${boundFact(h.title, 80)} (${boundFact(h.dateLabel, 40)})`).join("\n");
    const result = await invokeLLM({
      maxTokens: 120,
      messages: [
        {
          role: "system",
          content:
            "You write one warm, brief sentence introducing a Catholic parish's upcoming week to parishioners. " +
            "Summarize ONLY the provided items — never invent events, dates, or theology. " +
            "Plain, welcoming tone. One sentence, under 200 characters. No list, no markdown.",
        },
        { role: "user", content: `This week's items:\n${facts}` },
      ],
    });
    const raw = result.choices[0]?.message?.content;
    const text = typeof raw === "string" ? raw : Array.isArray(raw) ? raw.map((p) => ("text" in p ? p.text : "")).join("") : "";
    const cleaned = text.replace(/\s+/g, " ").trim().slice(0, 200);
    return cleaned.length > 0 ? cleaned : null;
  } catch (err) {
    console.error("[Highlights] AI intro failed, using template:", err);
    return null;
  }
}

export const highlightsRouter = {
  /** Public: the next 7 days of parish highlights, with an optional AI intro. */
  thisWeek: publicProcedure
    .input(z.object({ withAiIntro: z.boolean().optional().default(false) }).optional())
    .query(async ({ input }) => {
      const raw = await gatherRawHighlights();
      const items = buildThisWeekHighlights(raw, new Date(), { windowDays: 7, max: 8 });

      let intro = defaultHighlightsIntro(items.length);
      let introSource: "ai" | "template" = "template";
      if (input?.withAiIntro && items.length > 0) {
        const refined = await aiIntro(items);
        if (refined) { intro = refined; introSource = "ai"; }
      }

      return { items, intro, introSource };
    }),
};
