# St. Patrick Church — Armonk, NY

Parish website rebuild: public site (Mass times, bulletins, news, daily readings, calendar,
weather) + a staff admin CMS and **digital forms** (sacrament requests, CCD/CYO
registration, volunteer signups, document/gallery management, push notifications).

**Parish:** St. Patrick Church, 29 Cox Avenue, Armonk, NY 10504
**Status:** **REBUILD in progress.** This repo is the new build (previously previewed on
Manus). Target host: **Railway** (the #103 pattern). At cutover it **replaces the current
live parish site**, which runs on **eCatholic** (managed CMS — the incumbent).
**Owner:** Olive Juice Inc (DBA Aster Sports), on behalf of the parish.

> HOST PICTURE (charter Part 5 — do not confuse these three):
> - **eCatholic** = the parish's *live* site today (the incumbent to replace). It is UP. The
>   parish controls it via a vendor; we have no console.
> - **Manus** = the old build/preview host. Being **decommissioned** — superseded by Railway.
> - **Railway** = the target host for this rebuild.
>
> Cutover is gated on (a) operator review of the build and (b) moving the parish domain/DNS
> **out of eCatholic first** (needs parish authorization + auth/EPP code — long lead; start
> early). **Never cancel eCatholic until the domain is moved AND Railway is live.**

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

> **Target stack at the Railway cutover: Supabase Postgres + Supabase Storage** (the #103
> pattern / forms rehost spec). The MySQL/TiDB + S3 rows above are the *current* legacy
> stack, not the end state — they get re-platformed onto Supabase when this build moves to
> Railway. Don't read MySQL/S3 as permanent.

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
