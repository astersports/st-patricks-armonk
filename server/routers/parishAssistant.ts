/**
 * Parish Assistant Router — AI chatbot that answers common parish questions.
 * Uses the built-in LLM with parish context to help parishioners.
 * ~130 lines
 */
import { publicProcedure, router, z, db } from "./_helpers";
import { invokeLLM } from "../_core/llm";

const PARISH_CONTEXT = `You are the AI Parish Assistant for St. Patrick Church in Armonk, New York.
You help parishioners and visitors with questions about the parish.

KEY INFORMATION:
- Location: 29 Cox Avenue, Armonk, NY 10504
- Phone: (914) 273-9724
- Pastor: Please check the website for current pastor information
- Weekend Masses: Saturday 5:00 PM, Sunday 8:00 AM, 10:00 AM, 12:00 PM
- Daily Mass: Monday–Friday 8:30 AM
- Confessions: Saturday 4:00–4:45 PM or by appointment
- Parish Office Hours: Monday–Friday 9:00 AM – 4:00 PM

PROGRAMS:
- CCD (Religious Education): Classes for grades 1-8, registration required
- Teen Life: Youth ministry for high school students
- CYO Basketball: Parish basketball program
- RCIA: Rite of Christian Initiation of Adults (for those interested in becoming Catholic)
- Baptism: Contact the parish office to schedule
- Marriage: Contact the parish office at least 6 months in advance
- Funeral: Contact the parish office

GUIDELINES:
- Be warm, welcoming, and helpful
- If you don't know something specific, direct them to call the parish office at (914) 273-9724
- Keep answers concise but informative
- Never make up information about specific people, dates, or events
- For current events and schedules, suggest checking the website calendar
- You can reference the bulletin, events calendar, and news sections of the website`;

export const parishAssistantRouter = router({
  /** Chat with the AI Parish Assistant */
  chat: publicProcedure.input(z.object({
    message: z.string().min(1).max(2000),
    history: z.array(z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })).max(20).default([]),
  })).mutation(async ({ input }) => {
    // Build context with recent events and news
    let dynamicContext = "";
    try {
      const upcomingEvents = await db.getUpcomingEvents(5);
      if (upcomingEvents.length > 0) {
        dynamicContext += "\n\nUPCOMING EVENTS:\n";
        for (const e of upcomingEvents) {
          const dateStr = new Date(e.startDate).toLocaleDateString("en-US", {
            weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit",
          });
          dynamicContext += `- ${e.title} — ${dateStr}${e.location ? ` at ${e.location}` : ""}\n`;
        }
      }

      const recentNews = await db.getPublishedNewsPosts(3);
      if (recentNews.length > 0) {
        dynamicContext += "\n\nRECENT NEWS:\n";
        for (const n of recentNews) {
          dynamicContext += `- ${n.title}: ${n.excerpt || n.content?.substring(0, 80) || ""}\n`;
        }
      }
    } catch {
      // If DB is unavailable, continue without dynamic context
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
