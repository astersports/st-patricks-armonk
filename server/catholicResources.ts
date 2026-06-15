/**
 * Catholic Resources Feed Aggregator
 * Fetches and caches RSS feeds from Vatican News and The Good Newsroom (Archdiocese of NY).
 * Provides static resource links for USCCB and Archdiocese of NY main sites.
 */

export interface FeedArticle {
  title: string;
  link: string;
  description: string;
  pubDate: string; // ISO string
  imageUrl?: string;
  source: "vatican" | "goodnewsroom";
}

export interface ResourceLink {
  name: string;
  description: string;
  url: string;
  logoUrl?: string;
  category: string;
}

// === Feed Caches ===
interface FeedCache {
  items: FeedArticle[];
  fetchedAt: number;
}

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

let vaticanCache: FeedCache = { items: [], fetchedAt: 0 };
let goodNewsroomCache: FeedCache = { items: [], fetchedAt: 0 };

const FEEDS = {
  vatican: "https://www.vaticannews.va/en.rss.xml",
  goodnewsroom: "https://thegoodnewsroom.org/feed/",
} as const;

// === Static Resource Links ===
export const CATHOLIC_RESOURCES: ResourceLink[] = [
  {
    name: "Archdiocese of New York",
    description: "Official site of the Archdiocese of New York — news, events, and parish resources for our local Church.",
    url: "https://www.archny.org/",
    category: "Local Church",
  },
  {
    name: "USCCB",
    description: "United States Conference of Catholic Bishops — daily readings, Church teachings, and national Catholic news.",
    url: "https://www.usccb.org/",
    category: "National",
  },
  {
    name: "Vatican",
    description: "The Holy See — papal documents, encyclicals, and official communications from Rome.",
    url: "https://www.vatican.va/content/vatican/en.html",
    category: "Universal Church",
  },
  {
    name: "The Good Newsroom",
    description: "Stories of faith, hope, and service from across the Archdiocese of New York.",
    url: "https://thegoodnewsroom.org/",
    category: "Local News",
  },
];

// === Feed Fetchers ===

async function fetchRSSFeed(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { "User-Agent": "StPatricksArmonk/1.0" },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`RSS fetch failed: ${response.status}`);
  return response.text();
}

function parseRSSItems(xml: string, source: FeedArticle["source"]): FeedArticle[] {
  const items: FeedArticle[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = extractTag(itemXml, "title");
    const link = extractTag(itemXml, "link");
    const description = extractTag(itemXml, "description");
    const pubDate = extractTag(itemXml, "pubDate");

    // Try to extract image from media:content, enclosure, or content:encoded
    let imageUrl =
      extractAttribute(itemXml, "media:content", "url") ||
      extractAttribute(itemXml, "enclosure", "url") ||
      extractImageFromContent(itemXml);

    if (title && link) {
      items.push({
        title: cleanHtml(title),
        link,
        description: cleanHtml(description || "").slice(0, 200),
        pubDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        imageUrl: imageUrl || undefined,
        source,
      });
    }
  }

  return items;
}

/**
 * Fetch Vatican News articles
 */
export async function fetchVaticanNews(maxItems: number = 5): Promise<FeedArticle[]> {
  if (Date.now() - vaticanCache.fetchedAt < CACHE_TTL && vaticanCache.items.length > 0) {
    return vaticanCache.items.slice(0, maxItems);
  }

  try {
    const xml = await fetchRSSFeed(FEEDS.vatican);
    const items = parseRSSItems(xml, "vatican");
    vaticanCache = { items, fetchedAt: Date.now() };
    return items.slice(0, maxItems);
  } catch (err) {
    console.error("Vatican News RSS error:", err);
    return vaticanCache.items.slice(0, maxItems);
  }
}

/**
 * Fetch Good Newsroom articles (Archdiocese of NY)
 */
export async function fetchGoodNewsroom(maxItems: number = 5): Promise<FeedArticle[]> {
  if (Date.now() - goodNewsroomCache.fetchedAt < CACHE_TTL && goodNewsroomCache.items.length > 0) {
    return goodNewsroomCache.items.slice(0, maxItems);
  }

  try {
    const xml = await fetchRSSFeed(FEEDS.goodnewsroom);
    const items = parseRSSItems(xml, "goodnewsroom");
    goodNewsroomCache = { items, fetchedAt: Date.now() };
    return items.slice(0, maxItems);
  } catch (err) {
    console.error("Good Newsroom RSS error:", err);
    return goodNewsroomCache.items.slice(0, maxItems);
  }
}

/**
 * Fetch combined feed from all sources, sorted by date
 */
export async function fetchAllFeeds(maxPerSource: number = 4): Promise<FeedArticle[]> {
  const [vatican, goodnewsroom] = await Promise.all([
    fetchVaticanNews(maxPerSource),
    fetchGoodNewsroom(maxPerSource),
  ]);

  // Interleave: alternate between sources for visual variety
  const combined: FeedArticle[] = [];
  const maxLen = Math.max(vatican.length, goodnewsroom.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < goodnewsroom.length) combined.push(goodnewsroom[i]);
    if (i < vatican.length) combined.push(vatican[i]);
  }

  return combined;
}

// === XML Parsing Helpers ===

function extractTag(xml: string, tag: string): string | null {
  // Handle CDATA
  const cdataRegex = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tag}>`, "i");
  const cdataMatch = cdataRegex.exec(xml);
  if (cdataMatch) return cdataMatch[1].trim();

  // Handle regular content
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = regex.exec(xml);
  return match ? match[1].trim() : null;
}

function extractAttribute(xml: string, tag: string, attr: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, "i");
  const match = regex.exec(xml);
  return match ? match[1] : null;
}

function extractImageFromContent(xml: string): string | null {
  // Try to find an image URL in content:encoded
  const contentMatch = /<content:encoded>\s*<!\[CDATA\[([\s\S]*?)\]\]>/i.exec(xml);
  if (contentMatch) {
    const imgMatch = /<img[^>]+src="([^"]+)"/i.exec(contentMatch[1]);
    if (imgMatch) return imgMatch[1];
  }
  return null;
}

function cleanHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "\u2019")
    .replace(/&#8216;/g, "\u2018")
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D")
    .replace(/&#8212;/g, "\u2014")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
