/**
 * Parish contact constants — single source of truth.
 *
 * Before this module the parish phone, email, and Flocknote URL were
 * copy-pasted across ~25 pages, and they had drifted: one failure message
 * showed the wrong phone (914-273-9325 instead of -9724), and two email
 * domains were in use (stpatrickinarmonk.org vs stpatricksarmonk.org — the
 * latter is a dead inbox). Import from here instead of hardcoding.
 */

export const PARISH_NAME = "St. Patrick Church";
export const PARISH_CITY = "Armonk, NY";
export const PARISH_ADDRESS = "St. Patrick Church, 29 Cox Ave, Armonk NY 10504";

/** Canonical parish office phone. (914) 273-9724 — NOT 9325. */
export const PARISH_PHONE = "(914) 273-9724";

/**
 * Canonical office email. The working domain is stpatrickinarmonk.org (the
 * server notification routing + department aliases all live here);
 * stpatricksarmonk.org was a drifted, dead variant.
 */
export const PARISH_EMAIL = "office@stpatrickinarmonk.org";
export const PARISH_EMAIL_DOMAIN = "stpatrickinarmonk.org";

/** Flocknote (parish newsletter / messaging) sign-up URL. */
export const PARISH_FLOCKNOTE_URL = "https://stpatarmonk.flocknote.com/home";
