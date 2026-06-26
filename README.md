# St. Patrick Church — Armonk, NY

> **⚠️ This is the SANDBOX repo, not production.** We build and verify the parish site here;
> the live site is deployed from a **separate repository on a separate GitHub account**
> (an Archdiocese of New York organizational-separation requirement). Work flows one way —
> **sandbox → production** — via an operator-run agent that reads this repo. Start at
> [`CLAUDE.md`](./CLAUDE.md); details in [`docs/SANDBOX_AND_MIGRATION.md`](./docs/SANDBOX_AND_MIGRATION.md).

Parish website rebuild: public site (Mass times, bulletins, news, daily readings, calendar,
weather) + a staff admin CMS and **digital forms** (sacrament requests, CCD/CYO
registration, volunteer signups, document/gallery management, push notifications).

**Parish:** St. Patrick Church, 29 Cox Avenue, Armonk, NY 10504
**Status:** **Active build (sandbox).** This repo is where the parish site is built and
verified. **Go-live happens from the production repo on a separate account — not from here.**
**Owner:** Olive Juice Inc (DBA Aster Sports), on behalf of the parish.

> HOST PICTURE (do not confuse these):
> - **This sandbox** = build + verify only. No production hosting lives here.
> - **Production repo (separate account)** = owns hosting, public domain/DNS, secrets, and
>   the go-live decision. The host is **TBD**; the cutover off the incumbent is executed
>   *there*, not here.
> - **eCatholic** = the parish's *live* site today (the incumbent to replace). It is UP; the
>   parish controls it via a vendor. **Never cancel eCatholic until production is live and the
>   domain has been moved** — but that sequencing is owned by the production repo.
> - **Manus** = the old build/preview host, decommissioned.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 · Tailwind CSS 4 · Vite 7 · Wouter |
| Server | Express 4 · tRPC 11 |
| DB | **MySQL/TiDB** via Drizzle ORM (`mysql2`) — legacy Manus-era driver |
| Rich text | TipTap |
| Docs/PDF | react-pdf |
| Calendar | ICS feed parsing (`ical.js`) |
| Notifications | Web Push (VAPID) |
| Weather | `@aster/weather` / Open-Meteo |
| Storage | AWS S3 (presigned, Manus-era) |

> **Target stack at the production rehost: Supabase Postgres + Supabase Storage** (the #103
> pattern / forms rehost spec). The MySQL/TiDB + S3 rows above are the *current* legacy
> sandbox stack, not the end state — they get re-platformed onto Supabase when the work is
> migrated to the production repo (host TBD). Don't read MySQL/S3 as permanent.

## Quickstart

```bash
git clone git@github.com:astersports/st-patricks-armonk.git
cd st-patricks-armonk
pnpm install
cp .env.example .env   # DATABASE_URL (MySQL) + S3 + VAPID keys — file may need creating
pnpm dev               # tsx watch server/_core/index.ts
```

## Scripts (from package.json)

```bash
pnpm dev      # dev server (tsx watch)
pnpm build    # vite build + esbuild server bundle → dist/
pnpm start    # NODE_ENV=production node dist/index.js
pnpm check    # tsc --noEmit
pnpm test     # vitest run
pnpm format   # prettier --write .
pnpm db:push  # drizzle-kit generate && migrate
```

## Workflow

Feature branch off `main`, descriptive name, one concern per branch. Routine PRs auto-merge
on green CI; schema/auth changes hold for architect review.

## Where things live

| | |
|---|---|
| Architecture guide | [`ARCHITECTURE.md`](./ARCHITECTURE.md) |
| Rebuild plan | [`REDESIGN-PLAN.md`](./REDESIGN-PLAN.md) · [`RECOMMENDATIONS.md`](./RECOMMENDATIONS.md) |
| Forms rehost spec | architect handoff: `stpatrick-forms-rehost-spec` |
| Manus data recovery | [`docs/`](./docs) — S3 bulletin/photo/audio export (M3, irreversible clock) |
| Server (CMS/forms/routers) | `server/` |
