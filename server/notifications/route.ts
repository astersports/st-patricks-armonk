/**
 * Section-based Notification Routing.
 * Routes form submissions to the department alias that owns the section,
 * always BCC'ing the catch-all. Falls back to catch-all when unmapped.
 * A routing failure never blocks the form submission.
 */
import { getSiteSetting } from "../db";
import { sendEmail } from "../email";
import { notifyOwner } from "../_core/notification";
import type { AdminSection } from "../../shared/roles";

// ─── Types ──────────────────────────────────────────────────────────────────

export type NotificationRouting = {
  catchall: string;
  bySection: Partial<Record<AdminSection, string>>;
};

// ─── Default seed (from parish's existing aliases) ──────────────────────────

export const DEFAULT_NOTIFICATION_ROUTING: NotificationRouting = {
  catchall: "office@stpatrickinarmonk.org",
  bySection: {
    sacraments: "office@stpatrickinarmonk.org",
    ccd_registrations: "reled@stpatrickinarmonk.org",
    ccd_permissions: "reled@stpatrickinarmonk.org",
    teen_life: "teenlife@stpatrickinarmonk.org",
    cyo: "gym@stpatrickinarmonk.org",
    volunteers: "office@stpatrickinarmonk.org",
    registrations: "office@stpatrickinarmonk.org",
  },
};

const ROUTING_KEY = "notification_routing";

/** Escape user-supplied text before embedding it in HTML email bodies. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ─── Load routing config ────────────────────────────────────────────────────

export async function getRoutingConfig(): Promise<NotificationRouting> {
  try {
    const raw = await getSiteSetting(ROUTING_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_ROUTING;
    return JSON.parse(raw) as NotificationRouting;
  } catch {
    return DEFAULT_NOTIFICATION_ROUTING;
  }
}

// ─── Save routing config ────────────────────────────────────────────────────

export async function saveRoutingConfig(config: NotificationRouting): Promise<void> {
  const { upsertSiteSetting } = await import("../db");
  await upsertSiteSetting(ROUTING_KEY, JSON.stringify(config));
}

// ─── Main routing function ──────────────────────────────────────────────────

export async function routeNotification(
  section: AdminSection,
  payload: { title: string; content: string }
): Promise<void> {
  try {
    const config = await getRoutingConfig();
    const to = config.bySection[section] || config.catchall;
    const bcc = to !== config.catchall ? config.catchall : undefined;

    // Build a simple HTML email body (escape user-supplied fields).
    const safeTitle = escapeHtml(payload.title);
    const safeContent = escapeHtml(payload.content);
    const htmlBody = `
      <h2 style="margin:0 0 16px;color:#1a5c2e;">${safeTitle}</h2>
      <div style="white-space:pre-wrap;line-height:1.6;">${safeContent}</div>
    `;
    const subject = `[St. Patrick] ${payload.title}`;

    // Send to the section recipient
    await sendEmail(to, subject, htmlBody);

    // BCC the catch-all separately (sendEmail doesn't support BCC natively)
    if (bcc) {
      await sendEmail(bcc, subject, htmlBody);
    }
  } catch (error) {
    // Routing failure must never block the form submission
    console.error("[NotificationRouting] Failed to route notification:", error);
  }

  // Always also notify the Manus owner channel (belt-and-suspenders)
  try {
    await notifyOwner(payload);
  } catch (error) {
    console.error("[NotificationRouting] notifyOwner fallback failed:", error);
  }
}
