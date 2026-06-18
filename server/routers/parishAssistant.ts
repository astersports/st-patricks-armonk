/**
 * Parish Assistant Router — AI chatbot that answers common parish questions.
 * Uses the built-in LLM with parish context + live ICS calendar events.
 * ~140 lines
 */
import { publicProcedure, router, z, db } from "./_helpers";
import { rateLimitedChatProcedure } from "./_rateLimited";
import { invokeLLM } from "../_core/llm";
import { DEFAULT_PARISH_SCHEDULE, DEFAULT_PARISH_INFO, generateSEODescription, parseTimeToMinutes, minutesToTimeString } from "../../shared/scheduleEngine";
import { generateSacramentPoliciesSummary } from "../../shared/sacramentPolicies";

/**
 * Build the schedule portion of the system prompt from the shared engine.
 * This ensures the AI assistant always has correct, up-to-date Mass times.
 */
function buildScheduleContext(): string {
  const s = DEFAULT_PARISH_SCHEDULE;
  const info = DEFAULT_PARISH_INFO;
  const lines: string[] = [];
  lines.push(`- Location: ${info.address}, ${info.city}, ${info.state} ${info.zip}`);
  lines.push(`- Phone: ${info.phone}`);
  lines.push(`- Pastor: ${info.pastorName}`);

  // Weekend Masses
  const satVigil = s.services.find(svc => svc.dayOfWeek === 6 && svc.type === "mass");
  const sunMasses = s.services.filter(svc => svc.dayOfWeek === 0 && svc.type === "mass");
  const sunTimes = sunMasses.map(m => {
    let t = m.time;
    if (m.seasonal) t += ` (${m.seasonal.note})`;
    return t;
  }).join(", ");
  lines.push(`- Weekend Masses: Saturday Vigil ${satVigil?.time || "5:30 PM"}, Sunday ${sunTimes}`);

  // Weekday Mass
  const weekdayMass = s.services.find(svc => svc.dayOfWeek >= 2 && svc.dayOfWeek <= 5 && svc.type === "mass");
  if (weekdayMass) lines.push(`- Weekday Mass: Tuesday–Friday ${weekdayMass.time} (no Monday Mass)`);

  // Morning Prayer
  const prayer = s.services.find(svc => svc.type === "prayer");
  if (prayer) lines.push(`- Morning Prayer (Lauds): Tuesday–Friday ${prayer.time}`);

  // Confession
  const confession = s.services.find(svc => svc.type === "confession");
  if (confession) {
    const endMin = parseTimeToMinutes(confession.time) + confession.durationMin;
    const endTime = minutesToTimeString(endMin);
    lines.push(`- Confessions: Saturday ${confession.time}–${endTime.split(" ")[0]} ${endTime.split(" ")[1]} or by appointment`);
  }

  lines.push(`- Parish Office Hours: ${info.officeHours}`);
  return lines.join("\n");
}

const PARISH_CONTEXT = `You are the AI Parish Assistant for St. Patrick Church in Armonk, New York.
You help parishioners and visitors with questions about the parish.

KEY INFORMATION:
${buildScheduleContext()}

PROGRAMS:
- CCD (Religious Education): Classes for grades 1-8, registration required
- Teen Life: Youth ministry for high school students (meets in St. Francis Hall)
- CYO Basketball: Grades 3-8, November–March, St. Francis Hall
- RCIA: Rite of Christian Initiation of Adults

SACRAMENTS:
${generateSacramentPoliciesSummary()}

GUIDELINES:
- Be warm, welcoming, and helpful
- If you have calendar event data below, USE IT to answer questions about upcoming events
- Keep answers concise but informative
- Never make up information about specific people, dates, or events you don't have data for
- You can reference the bulletin, events calendar, and news sections of the website
- If unsure, direct them to call the parish office at (914) 273-9724`;

export const parishAssistantRouter = router({
  /** Chat with the AI Parish Assistant */
  chat: rateLimitedChatProcedure.input(z.object({
    message: z.string().min(1).max(2000),
    history: z.array(z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })).max(20).default([]),
  })).mutation(async ({ input }) => {
    let dynamicContext = "";

    try {
      // Fetch ICS calendar events (the same data that powers the calendar page)
      const { parseICSFeed, PARISH_CALENDAR_ICS, CCD_CALENDAR_ICS, CYO_CALENDAR_ICS } = await import("../icsParser");
      const [parishIcs, ccdIcs, cyoIcs] = await Promise.all([
        parseICSFeed(PARISH_CALENDAR_ICS, { daysAhead: 90, maxEvents: 40 }),
        parseICSFeed(CCD_CALENDAR_ICS, { daysAhead: 90, maxEvents: 20 }),
        parseICSFeed(CYO_CALENDAR_ICS, { daysAhead: 90, maxEvents: 20 }),
      ]);

      const allCalEvents = [
        ...parishIcs.map(e => ({ ...e, source: "Parish" })),
        ...ccdIcs.map(e => ({ ...e, source: "CCD" })),
        ...cyoIcs.map(e => ({ ...e, source: "CYO" })),
      ].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

      if (allCalEvents.length > 0) {
        dynamicContext += "\n\nUPCOMING CALENDAR EVENTS (from Google Calendar feeds):\n";
        for (const e of allCalEvents.slice(0, 40)) {
          const dateStr = new Date(e.startDate).toLocaleDateString("en-US", {
            weekday: "short", month: "short", day: "numeric",
          });
          const timeStr = e.allDay ? "All Day" : new Date(e.startDate).toLocaleTimeString("en-US", {
            hour: "numeric", minute: "2-digit", timeZone: "America/New_York",
          });
          dynamicContext += `- [${e.source}] ${e.title} — ${dateStr}, ${timeStr}${e.location ? ` @ ${e.location}` : ""}\n`;
        }
      }

      // Inject FAQ knowledge base
      const faqs = await db.getActiveFaqs();
      if (faqs.length > 0) {
        dynamicContext += "\n\nFAQ KNOWLEDGE BASE (use these to answer common questions):\n";
        for (const faq of faqs) {
          dynamicContext += `Q: ${faq.question}\nA: ${faq.answer}\n\n`;
        }
      }

      // Include ALL Key Dates (important_dates table - includes Bag Bingo, Confirmation, etc.)
      // Use getAllPublishedImportantDates to get everything, then filter to future only
      const allKeyDates = await db.getAllPublishedImportantDates();
      const now = new Date();
      const keyDates = allKeyDates.filter(kd => new Date(kd.eventDate) >= now);
      if (keyDates.length > 0) {
        dynamicContext += "\n\nKEY DATES & SPECIAL EVENTS (from parish database):\n";
        for (const kd of keyDates) {
          const dateStr = new Date(kd.eventDate).toLocaleDateString("en-US", {
            weekday: "short", month: "short", day: "numeric", year: "numeric",
          });
          dynamicContext += `- [${kd.category}] ${kd.title} — ${dateStr}${kd.location ? ` @ ${kd.location}` : ""}${kd.note ? ` (${kd.note})` : ""}\n`;
        }
      }

      // Also include DB events and news
      const upcomingEvents = await db.getUpcomingEvents(5);
      if (upcomingEvents.length > 0) {
        dynamicContext += "\n\nDB PARISH EVENTS:\n";
        for (const e of upcomingEvents) {
          const dateStr = new Date(e.startDate).toLocaleDateString("en-US", {
            weekday: "short", month: "short", day: "numeric",
          });
          dynamicContext += `- ${e.title} — ${dateStr}${e.location ? ` @ ${e.location}` : ""}\n`;
        }
      }

      const recentNews = await db.getPublishedNewsPosts(3);
      if (recentNews.length > 0) {
        dynamicContext += "\n\nRECENT NEWS:\n";
        for (const n of recentNews) {
          dynamicContext += `- ${n.title}: ${n.excerpt || n.content?.substring(0, 80) || ""}\n`;
        }
      }
    } catch (err) {
      console.error("[Parish Assistant] Context fetch error:", err);
    }

    const systemPrompt = PARISH_CONTEXT + dynamicContext;

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
      ...input.history.map(h => ({ role: h.role as "user" | "assistant", content: h.content })),
      { role: "user", content: input.message },
    ];

    try {
      const result = await invokeLLM({
        messages,
        maxTokens: 500,
      });

      const reply = result.choices[0]?.message?.content;
      const text = typeof reply === "string" ? reply : Array.isArray(reply) ? reply.map(p => "text" in p ? p.text : "").join("") : "I'm sorry, I couldn't generate a response. Please try again.";

      return { reply: text };
    } catch (error: any) {
      console.error("[Parish Assistant] LLM error:", error);
      return {
        reply: "I'm sorry, I'm having trouble right now. Please call the parish office at (914) 273-9724 for assistance.",
      };
    }
  }),
});
