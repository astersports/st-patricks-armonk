# St. Patrick — Paperwork & Sign-up Automation Audit

**Date:** 2026-06-26 · **Scope:** every public form/sign-up + every admin surface that
processes them, on merged `main`. **Lens:** overlap/duplication and opportunities to
automate the administration of paperwork and sign-ups.

> Grounding note: structural findings below were confirmed against the code (no
> unified person/household table exists; confirmation emails fire only for the 4
> sacraments + Mass intentions; `formExport` is manual CSV with Sheets scaffolding
> but no wired sync). The repo runs on the legacy MySQL/Drizzle stack today; the
> architect's `REHOST_SPEC_FORMS` already plans a Supabase rehost of the forms
> system — **the structural fixes here (unified record, form registry) belong in
> that rehost, not bolted onto the legacy stack.** Quick wins can ship on either.

---

## 1. Bottom line

Intake is **fragmented across ~14 separate public forms feeding ~13 separate tables,
with no unified person/household record.** The same parent re-enters their name, email,
phone, and address on every form, creating disconnected rows the staff must
cross-reference by hand. On the admin side, most processing is manual: status changes,
notifications (opt-in per action), CSV exports, and follow-ups. Confirmation emails are
inconsistent (4 of ~10 forms). The single biggest structural problem is the **absence of
a person/family record**; the single biggest day-to-day drag is **manual,
opt-in-per-action notification**.

---

## 2. The intake landscape

| # | Form / sign-up | Route | Table | Auto-confirm to submitter? | Stored? |
|---|---|---|---|---|---|
| 1 | Baptism registration | `/baptism` | `baptism_registrations` | ✅ | ✅ |
| 2 | Sponsor certificate | `/sponsor` | `sponsor_certificates` | ✅ | ✅ |
| 3 | Marriage inquiry | (in `/sacraments`) | `marriage_inquiries` | ✅ | ✅ |
| 4 | Funeral pre-planning | (in `/sacraments`) | `funeral_pre_planning` | ✅ | ✅ |
| 5 | Mass intention | `/mass-intention` | `mass_intentions` | ✅ | ✅ |
| 6 | Parish registration | `/parish-registration` | `parish_registrations` | ❌ | ✅ |
| 7 | CCD permissions | `/ccd-permissions` | `ccd_permissions` | ❌ | ✅ |
| 8 | Teen Life registration | `/faith-formation` | `teen_life_registrations` | ❌ | ✅ |
| 9 | Volunteer sign-up | `/serve` | `volunteer_signups` | ❌ | ✅ |
| 10 | Volunteer-needs response | `/serve` | `volunteer_need_responses` | ❌ | ✅ |
| 11 | Prayer intention | `/prayers` | `prayer_intentions` | ❌ | ✅ (public, no review) |
| 12 | Email/bulletin signup | `/` | `email_subscriptions` | ❌ | ✅ |
| 13 | Contact | `/contact` | (email only) | n/a | ❌ |
| 14 | **CCD registration** | `/ccd-registration` | `ccd_registrations` | external | **Droplet.io iframe** |

**Admin surfaces that process these:** `NeedsAttention` (unified pending inbox),
`SacramentsManager` (4 sacrament types), `CcdManager`, `CcdPermissionsManager`,
`ParishRegistrationsManager`, `VolunteerNeedsManager`, `MassIntentionsManager`,
`FormExport` (manual CSV), `NotificationRoutingEditor`, `AuditLog` (read-only).

---

## 3. Overlap / duplication findings (ranked)

**O-1 · No unified person / household record (CRITICAL).**
There is no `persons`/`families`/`households` table and no FK linking between form
tables. A parent who registers the family, enrolls a child in CCD, submits CCD
permissions, and requests a baptism produces **four unrelated rows in four tables**.
`ccd_permissions.ccdRegistrationId` exists but is optional and effectively unused.
Consequence: staff can't ask "show everything from this family/email" without manual
lookup; an address change in one table never propagates.

**O-2 · Duplicate field sets on every form.**
`parent/guardian name + email + phone + address` and `child name` are re-collected by
7+ forms with no dedupe and no "we already have you on file." Same person, retyped every
time.

**O-3 · Parallel CCD intake (data-integrity risk).**
CCD registration runs through an **external Droplet.io iframe**, but an internal
`ccd_registrations` table + `ccd.register` route also exist with **no visible
sync/webhook**. Two sources of truth; the internal table may be orphaned, or Droplet data
may never reach the parish DB.

**O-4 · Redundant admin triage surfaces.**
The unified `NeedsAttention` inbox and the per-type managers (`SacramentsManager`,
`CcdPermissionsManager`, `ParishRegistrationsManager`, …) overlap — the same pending item
appears in two places with separate mutation paths, so status can drift between views.

**O-5 · Near-identical sacrament schemas.**
`baptism_registrations`, `sponsor_certificates`, `marriage_inquiries`,
`funeral_pre_planning` each repeat contact/address/status/notes columns with
slightly-different status enums and 4 separate `updateStatus` procedures — 4× the
maintenance for any change.

**O-6 · No cross-form duplicate detection.**
The same email across forms is never flagged; the subscribe path silently reactivates
duplicates. Admin finds duplicates only by eye.

---

## 4. What's already automated (don't rebuild)

- **Notification routing** by form type → department aliases (`NotificationRoutingEditor`,
  `services/notificationRouting`).
- **Confirmation emails** for the 4 sacraments + Mass intentions.
- **Weekly analytics digest** + subscriber digest (`server/scheduled/*`).
- **Status-update emails** — but **opt-in per action** (a "Notify" checkbox), so they're
  frequently skipped.
- **Manual CSV export** with Google-Sheets **scaffolding** (a configurable spreadsheet ID)
  — but no Sheets client or cron, so the actual push is manual today.

---

## 5. Automation opportunities (ROI vs effort)

| # | Opportunity | Manual work today | Effort | ROI |
|---|---|---|---|---|
| A-1 | Auto-confirmation on the 5–6 forms that lack it (parish reg, teen life, CCD permissions, volunteer) + a reference ID | "Did you get my form?" emails | **Low** | **High** |
| A-2 | Default `notify=true` on milestone statuses (approved/scheduled/denied); admin un-checks to suppress | Per-action checkbox, often skipped | **Low** | **High** |
| A-3 | CCD-permission report exports (bus roster, allergy/medical alert, photo-release list, early-dismissal) from data already collected | Manual re-reading/transcription | **Med** | **High** |
| A-4 | Resolve CCD intake: pick one source of truth; if Droplet stays, wire its webhook → `ccd_registrations` | Two disconnected systems | **Med-High** | **High** |
| A-5 | Wire the existing Sheets scaffold to a scheduled incremental export | ~2 hrs/week export+import | **Med** | **Med** |
| A-6 | **Unified person/household record** + dedupe-on-submit + a "family" view | ~hours/month cross-referencing | **High** | **Med (strategic)** |
| A-7 | Stale-submission reminders + weekly "pending > 7 days" digest to each team | Manual reminder emails | **Med** | **Med** |
| A-8 | `.ics` invite auto-attached when a sacrament is scheduled | "what time is it?" emails | **Low** | **Low-Med** |
| A-9 | Online payment for Mass-intention offerings / any fees (Stripe) + receipt | Manual offering follow-up | **Med** | **Low** (only if fees are collected) |
| A-10 | E-signature on CCD permissions (today it's a plain text field) | Legal exposure on unsigned forms | **High** | **Low-Med** |
| A-11 | Collapse the 4 sacrament tables into one model | 4× schema maintenance | **High** | **Low** (do it inside the rehost) |

---

## 6. Recommended sequencing

**Phase 1 — quick wins (days, ship on the legacy stack):** A-1, A-2, A-8. Pure additive;
removes the most parishioner-facing friction and the most common staff slip
(forgotten notify).

**Phase 2 — staff time-savers:** A-3 (permission reports), A-5 (Sheets sync), A-7
(reminders/digest). Each removes recurring manual hours.

**Phase 3 — structural, do inside the Supabase forms-rehost (`REHOST_SPEC_FORMS`):**
A-6 (unified person/household + dedupe), A-4 (single CCD source of truth), A-11
(unified form/sacrament model), A-10 (e-sign), A-9 (payment). These are the architecture
decisions the rehost should bake in rather than retrofit.

**The two highest-leverage moves:** ship **A-1 + A-2** now (cheap, immediate relief),
and make the **unified person/household record (A-6)** the centerpiece of the rehost so
every future form attaches to one family file instead of spawning another orphan row.
