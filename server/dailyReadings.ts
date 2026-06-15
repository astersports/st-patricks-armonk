/**
 * Daily Readings from Evangelizo.org
 * Fetches the daily Mass readings (First Reading, Psalm, Gospel) with caching.
 */

interface DailyReadingsData {
  date: string;
  liturgicTitle: string;
  firstReading: { title: string; text: string };
  psalm: { title: string; text: string };
  gospel: { title: string; text: string };
  secondReading?: { title: string; text: string };
}

let cache: { data: DailyReadingsData; fetchedAt: number; dateKey: string } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

function getTodayDateString(): string {
  // Use Eastern Time for the date
  const now = new Date();
  const eastern = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const year = eastern.getFullYear();
  const month = String(eastern.getMonth() + 1).padStart(2, "0");
  const day = String(eastern.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function stripHtmlTags(html: string): string {
  return html
    .replace(/<font[^>]*>/gi, "")
    .replace(/<\/font>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function cleanBodyText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<\/?p[^>]*>/gi, "\n")
    .replace(/<font[^>]*>/gi, "")
    .replace(/<\/font>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function fetchReading(date: string, type: string, content?: string): Promise<string> {
  const params = new URLSearchParams({ date, type, lang: "AM" });
  if (content) params.set("content", content);
  const url = `https://feed.evangelizo.org/v2/reader.php?${params.toString()}`;
  
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) return "";
    const text = await response.text();
    return text.trim();
  } catch {
    return "";
  }
}

export async function getDailyReadings(): Promise<DailyReadingsData | null> {
  const today = getTodayDateString();
  
  // Return cached data if still valid and for today
  if (cache && cache.dateKey === today && Date.now() - cache.fetchedAt < CACHE_DURATION) {
    return cache.data;
  }

  try {
    const [liturgicTitle, frTitle, frText, psTitle, psText, gspTitle, gspText, srTitle, srText] = await Promise.all([
      fetchReading(today, "liturgic_t"),
      fetchReading(today, "reading_lt", "FR"),
      fetchReading(today, "reading", "FR"),
      fetchReading(today, "reading_lt", "PS"),
      fetchReading(today, "reading", "PS"),
      fetchReading(today, "reading_lt", "GSP"),
      fetchReading(today, "reading", "GSP"),
      fetchReading(today, "reading_lt", "SR"),
      fetchReading(today, "reading", "SR"),
    ]);

    const data: DailyReadingsData = {
      date: today,
      liturgicTitle: stripHtmlTags(liturgicTitle) || "Daily Readings",
      firstReading: { title: stripHtmlTags(frTitle) || "First Reading", text: cleanBodyText(frText) },
      psalm: { title: stripHtmlTags(psTitle) || "Responsorial Psalm", text: cleanBodyText(psText) },
      gospel: { title: stripHtmlTags(gspTitle) || "Gospel", text: cleanBodyText(gspText) },
    };

    if (srText) {
      data.secondReading = { title: stripHtmlTags(srTitle) || "Second Reading", text: cleanBodyText(srText) };
    }

    cache = { data, fetchedAt: Date.now(), dateKey: today };
    return data;
  } catch (error) {
    console.error("Failed to fetch daily readings:", error);
    return cache?.data || null;
  }
}
