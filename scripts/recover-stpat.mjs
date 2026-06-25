/**
 * St. Patrick in Armonk — Manus data recovery (PUBLISHED content + linked media).
 *
 * Companion to docs/DATA_RECOVERY_PLAN_2026-06-25.txt. Read §0 of that doc FIRST.
 *
 * WHAT THIS RECOVERS
 *   - Every PUBLISHED row reachable through the site's own public tRPC API
 *     (news, events, bulletins, gallery, staff, FAQ, homilies, schedule,
 *     volunteer needs, holy days, important dates, prayer wall, CYO, site
 *     settings). Saved as JSON under ./recovery/json/.
 *   - Every media blob those rows reference (PDF / audio / image) via the open
 *     `/manus-storage/<key>` proxy (307 -> signed S3) or a direct CDN URL.
 *     Saved under ./recovery/media/. WORKS ONLY while a live app instance + a
 *     valid Forge key still exist — the proxy re-signs S3 on each request.
 *   - The 3 Google Calendar ICS feeds (full history), fetched directly from
 *     Google — these survive Manus entirely. Saved under ./recovery/ics/.
 *
 * WHAT THIS CANNOT RECOVER (see plan §0.A + §2)
 *   - The 19 MYSQL-ONLY private/PII tables (sacrament submissions, ccd_permissions,
 *     registrations, mass intentions, subscribers, volunteer signups, ...). Those
 *     were never rendered publicly; a scrape returns ZERO of them. They come ONLY
 *     from a MySQL dump (plan §4) or a surviving external mirror (plan §3).
 *
 * WHERE TO RUN
 *   A machine WITH internet egress to the parish origin. The audit/agent sandbox
 *   egress proxy denies the parish + Manus origins (org policy), so this will not
 *   run there until the domain is allowlisted. Node 18+ (global fetch).
 *
 * USAGE
 *   node scripts/recover-stpat.mjs
 *   ORIGIN=https://stpatsarmonk-24g7ux9f.manus.space node scripts/recover-stpat.mjs
 *   (default ORIGIN is the custom domain; fall back to the manus.space origin if
 *    the custom domain has already been unpointed.)
 */

import { mkdir, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";

const ORIGIN = (process.env.ORIGIN || "https://stpatrickinarmonk.org").replace(/\/$/, "");
const OUT = process.env.OUT || "./recovery";
const TRPC = `${ORIGIN}/api/trpc`;

// Public, no-input tRPC queries. namespace.procedure from server/routers/index.ts.
// Each was verified as `publicProcedure.query` with no required input. Caps noted
// in the plan §5 (news=20, events=upcoming/future-only, bulletins=100) mean older
// rows beyond the cap are DB-only — flagged in the run summary, not recoverable here.
const PUBLIC_QUERIES = [
  "news.listPublished",
  "bulletins.listPublished",
  "events.listUpcoming",
  "gallery.listPublished",
  "gallery.albums",
  "staff.list",
  "faq.listActive",
  "homilies.list",
  "parishSchedule.getSchedule",
  "parishSchedule.getInfo",
  "volunteerNeeds.list",
  "holyDays.upcoming",
  "importantDates.allPublished",
  "siteSettings.get",
  "prayerWall.getIntentions",
  "googleCalendar.parishEvents",
  "googleCalendar.ccdEvents",
  "googleCalendar.cyoEvents",
  "googleCalendar.allEvents",
  "googleCalendar.upcomingEvents",
];

// Google Calendar ICS feeds (public, full history) — server/icsParser.ts:129.
const ICS_FEEDS = {
  parish:
    "https://calendar.google.com/calendar/ical/auhh52vq6k97cih05uovakdvlcobb3qj%40import.calendar.google.com/public/basic.ics",
  ccd: "https://calendar.google.com/calendar/ical/reled%40stpatrickinarmonk.org/public/basic.ics",
  cyo: "https://calendar.google.com/calendar/ical/stpatrickinarmonk.org_5snqr5qqph11et22r6sk81k67g%40group.calendar.google.com/public/basic.ics",
};

// superjson-encoded null input — the SPA's httpBatchLink shape.
const NULL_INPUT = encodeURIComponent(JSON.stringify({ json: null }));

function safeName(s) {
  return s.replace(/[^a-z0-9._-]+/gi, "_").slice(0, 180);
}

async function fetchQuery(proc) {
  const url = `${TRPC}/${proc}?input=${NULL_INPUT}`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const body = await res.json();
  // tRPC v10 single-call envelope: { result: { data: { json: <payload> } } }
  // (superjson). Some deployments answer batch-shaped [ { result... } ]; handle both.
  const env = Array.isArray(body) ? body[0] : body;
  const data = env?.result?.data;
  return data && "json" in data ? data.json : data;
}

// Pull every media reference out of an arbitrary JSON payload: relative
// /manus-storage/<key> proxy paths, absolute http(s) media URLs (S3, eCatholic
// CDN), and any *Url / *Key field the schema uses.
function harvestMediaUrls(payload) {
  const found = new Set();
  const MEDIA_EXT = /\.(pdf|mp3|m4a|jpe?g|png|gif|webp|wav|ogg|mp4|mov|docx?|xlsx?)(\?|$)/i;
  const walk = (v) => {
    if (v == null) return;
    if (typeof v === "string") {
      if (v.startsWith("/manus-storage/")) found.add(ORIGIN + v);
      else if (/^https?:\/\//i.test(v) && (MEDIA_EXT.test(v) || v.includes("/manus-storage/")))
        found.add(v);
      return;
    }
    if (Array.isArray(v)) return v.forEach(walk);
    if (typeof v === "object") return Object.values(v).forEach(walk);
  };
  walk(payload);
  return [...found];
}

async function download(url, destDir) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  let base = safeName(decodeURIComponent(path.basename(new URL(url).pathname)) || "blob");
  if (!path.extname(base)) {
    const ct = res.headers.get("content-type") || "";
    const ext = ct.includes("pdf") ? ".pdf" : ct.includes("mpeg") ? ".mp3" : ct.includes("png") ? ".png" : ct.includes("jpeg") ? ".jpg" : "";
    base += ext;
  }
  const dest = path.join(destDir, base);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  return dest;
}

async function main() {
  const jsonDir = path.join(OUT, "json");
  const mediaDir = path.join(OUT, "media");
  const icsDir = path.join(OUT, "ics");
  for (const d of [jsonDir, mediaDir, icsDir]) await mkdir(d, { recursive: true });

  console.log(`# Recovery target: ${ORIGIN}`);
  const mediaUrls = new Set();
  const summary = { origin: ORIGIN, queries: {}, ics: {}, media: { total: 0, ok: 0, failed: 0 } };

  // 1. Published content via the public tRPC API.
  for (const proc of PUBLIC_QUERIES) {
    try {
      const payload = await fetchQuery(proc);
      await writeFile(path.join(jsonDir, `${safeName(proc)}.json`), JSON.stringify(payload, null, 2));
      const count = Array.isArray(payload) ? payload.length : payload ? 1 : 0;
      summary.queries[proc] = count;
      harvestMediaUrls(payload).forEach((u) => mediaUrls.add(u));
      console.log(`  ok   ${proc.padEnd(34)} ${count} record(s)`);
    } catch (e) {
      summary.queries[proc] = `ERROR: ${e.message}`;
      console.log(`  FAIL ${proc.padEnd(34)} ${e.message}`);
    }
  }

  // 2. Google Calendar ICS (independent of Manus — full history).
  for (const [name, url] of Object.entries(ICS_FEEDS)) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      await writeFile(path.join(icsDir, `${name}.ics`), text);
      const events = (text.match(/BEGIN:VEVENT/g) || []).length;
      summary.ics[name] = events;
      console.log(`  ok   ICS ${name.padEnd(30)} ${events} VEVENT(s)`);
    } catch (e) {
      summary.ics[name] = `ERROR: ${e.message}`;
      console.log(`  FAIL ICS ${name.padEnd(30)} ${e.message}`);
    }
  }

  // 3. Media blobs referenced by the published rows (WHILE the proxy + Forge key live).
  summary.media.total = mediaUrls.size;
  console.log(`\n# ${mediaUrls.size} linked media URL(s) discovered — downloading...`);
  for (const url of mediaUrls) {
    try {
      const dest = await download(url, mediaDir);
      summary.media.ok++;
      console.log(`  ok   ${url} -> ${dest}`);
    } catch (e) {
      summary.media.failed++;
      console.log(`  FAIL ${url} ${e.message}`);
    }
  }
  await writeFile(path.join(mediaDir, "_urls.txt"), [...mediaUrls].join("\n"));

  await writeFile(path.join(OUT, "_summary.json"), JSON.stringify(summary, null, 2));
  console.log(`\n# Done. JSON+ICS+media under ${OUT}/  · summary: ${OUT}/_summary.json`);
  console.log(
    "# REMINDER: this recovers PUBLISHED content + linked media only. The 19 PII/forms tables\n" +
      "# and any admin-only blobs come from a MySQL dump + DB-key-driven file pull (plan §2, §4)."
  );
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
