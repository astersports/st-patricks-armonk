# St. Patrick in Armonk — Architecture Guide

> Use this document as context when reviewing any file in this repository. It provides the full picture of how the system fits together.

## Overview

A modern parish website for St. Patrick Church in Armonk, NY (29 Cox Avenue, Armonk, NY 10504). Built as a full-stack web application with React frontend, Express/tRPC backend, and MySQL database. Deployed on Manus hosting platform.

**Live domain:** `stpatsarmonk-24g7ux9f.manus.space`
**GitHub:** `astersports/st-patricks-armonk`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| Routing | Wouter (lightweight client-side router) |
| State/Data | tRPC 11 (end-to-end type-safe API) |
| Backend | Express 4, tRPC procedures |
| Database | MySQL/TiDB via Drizzle ORM |
| Auth | Manus OAuth (owner-only admin) |
| Storage | S3 via Manus storage proxy (`/manus-storage/`) |
| Calendar | ICS feed parsing (Google Calendar .ics feeds) |
| Weather | Open-Meteo API (free, no key needed) |

## Directory Structure

```
├── client/src/
│   ├── pages/           # Page components (one per route)
│   ├── components/      # Reusable UI components
│   ├── components/ui/   # shadcn/ui primitives
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities (trpc client, liturgical season calc)
│   └── App.tsx          # Route definitions
├── server/
│   ├── _core/           # Framework plumbing (DO NOT EDIT)
│   ├── routers.ts       # All tRPC procedures (1455 lines)
│   ├── db.ts            # Database query helpers (961 lines)
│   ├── weather.ts       # Open-Meteo weather API integration
│   ├── icsParser.ts     # Google Calendar ICS feed parser
│   ├── dailyReadings.ts # USCCB daily readings scraper
│   ├── saintOfDay.ts    # Saint of the day data
│   └── storage.ts       # S3 storage helpers
├── drizzle/
│   ├── schema.ts        # Database schema (all tables)
│   └── relations.ts     # Table relationships
└── shared/
    ├── types.ts         # Shared TypeScript types
    ├── const.ts         # Shared constants
    └── roles.ts         # User role definitions
```

## Key Files to Review

### Backend (server/)

| File | Lines | Purpose |
|------|-------|---------|
| `routers.ts` | 1455 | All tRPC API procedures — news, events, bulletins, forms, calendar, weather, admin |
| `db.ts` | 961 | Database query helpers — CRUD for all entities |
| `weather.ts` | 432 | Open-Meteo integration: current conditions, hourly forecast, daily forecast, event weather |
| `icsParser.ts` | 136 | Parses Google Calendar .ics feeds into structured event objects |
| `dailyReadings.ts` | ~100 | Fetches USCCB daily Mass readings |
| `saintOfDay.ts` | ~80 | Returns today's saint info |

### Frontend Pages (client/src/pages/)

| File | Lines | Purpose |
|------|-------|---------|
| `Home.tsx` | 1565 | Homepage: hero, weather widget, This Week accordion, journey cards, news highlight |
| `Admin.tsx` | 1751 | Admin dashboard: news, bulletins, events, forms, subscribers management |
| `AllCalendars.tsx` | ~400 | Combined calendar with Parish/CCD/CYO filters |
| `MassTimes.tsx` | ~300 | Mass schedule, confession times, holy days |
| `Sacraments.tsx` | ~500 | Baptism, Confirmation, Marriage, Funerals with digital forms |
| `FaithFormation.tsx` | ~400 | CCD, Teen Life, RCIA, Walking With Purpose, Blaze |
| `Giving.tsx` | ~200 | WeShare, Venmo QR, Cardinals Appeal |
| `Staff.tsx` | ~400 | Staff directory with accordion sections |

### Frontend Components (client/src/components/)

| File | Purpose |
|------|---------|
| `ThisWeekAccordion.tsx` | Week view with day tabs, events, weather badges |
| `TimelineFeed.tsx` | Timeline-style event list with date badges and category colors |
| `WeatherIcons.tsx` | Colorful SVG weather icons (day + night variants) |
| `WeatherBadge.tsx` | Small weather pill for event cards |
| `Header.tsx` | Site navigation (desktop dropdowns + mobile hamburger) |
| `Footer.tsx` | Site footer with links, Aster Sports attribution |
| `MobileBottomNav.tsx` | Persistent bottom tab bar (Mass, Calendar, Give, More) |
| `PageHeader.tsx` | Consistent page title headers with breadcrumbs |

### Database Schema (drizzle/schema.ts)

Key tables:
- `user` — Auth users with role (admin/user)
- `news_posts` — Parish news/announcements
- `bulletins` — Weekly bulletin PDFs
- `events` — Parish events
- `email_subscribers` — Newsletter subscribers
- `baptism_submissions`, `marriage_submissions`, `funeral_submissions`, `sponsor_submissions` — Sacrament form data
- `ccd_registrations`, `ccd_permissions` — Religious education forms
- `parish_registrations` — New parishioner registration
- `teen_life_registrations` — Teen program signups
- `volunteer_signups` — Ministry volunteer forms
- `documents` — Uploaded parish documents/forms
- `site_settings` — Dynamic site configuration
- `photo_gallery`, `gallery_images` — Photo galleries

## Data Flow

```
User → React Page → trpc.feature.useQuery() → tRPC Procedure → db.ts helper → MySQL
                                                     ↓
                                              External APIs:
                                              - Open-Meteo (weather)
                                              - Google Calendar ICS feeds
                                              - USCCB readings
```

## Authentication & Roles

- **Public**: All parish content pages (Mass times, calendar, news, forms, etc.)
- **Protected (owner-only)**: Admin dashboard (`/admin/*`) — only the site owner (checked via `OWNER_OPEN_ID`) can access
- Auth uses Manus OAuth with session cookies
- `protectedProcedure` in tRPC checks auth; admin routes additionally check `ctx.user.role === 'admin'`

## External Integrations

| Service | Purpose | Config |
|---------|---------|--------|
| Open-Meteo | Weather data (current, hourly, daily) | No API key needed, uses lat/lon for Armonk |
| Google Calendar ICS | Parish, CCD, CYO event feeds | Public .ics URLs |
| USCCB | Daily Mass readings | Web scraping |
| Manus Storage (S3) | File uploads (bulletins, photos, documents) | Built-in, no config |
| Manus Notifications | Owner alerts on form submissions | Built-in |

## Calendar ICS Feeds

- **Parish Events:** `stpatrickinarmonk.org_...@group.calendar.google.com`
- **CCD (Religious Ed):** `reled@stpatrickinarmonk.org`
- **CYO Basketball:** `stpatrickinarmonk.org_5snqr5qqph11et22r6sk81k67g@group.calendar.google.com`

## Weather System

The weather system has three layers:
1. **Current conditions** (`getCurrentWeather`) — Real-time temp, wind, humidity via Open-Meteo `current` endpoint. 15-min server cache.
2. **Hourly forecast** (`getWeatherForEvent`) — Used for per-event weather badges in This Week accordion.
3. **Daily forecast** (`getDailyForecast`) — 7-day high/low, precipitation probability, sunrise/sunset. 30-min cache.

Frontend refreshes every 30 minutes. Weather widget in hero shows current conditions with tap-to-expand popover (feels-like, humidity, wind, sunrise/sunset). Night-mode icons activate based on `is_day` flag.

## Design System

- **Colors:** Forest green (#1B5E20, #2E7D32), gold (#C8A951), cream backgrounds
- **Fonts:** Fraunces (headings), Inter (body), Playfair Display (accents)
- **Theme:** Light mode with green/gold parish branding
- **Mobile:** Bottom tab bar, hamburger menu, responsive everything
- **Animations:** Scroll reveal, staggered entrances, button press feedback

## How to Review This Code

When reviewing specific files, here's what to focus on:

**For `server/routers.ts`:** Check input validation, error handling, auth guards, and SQL injection prevention.

**For `server/weather.ts`:** Check caching logic, API error handling, and data transformation accuracy.

**For `client/src/pages/Home.tsx`:** Check component composition, data fetching patterns, loading states, and mobile responsiveness.

**For `drizzle/schema.ts`:** Check table relationships, index usage, and data types.

**For `server/db.ts`:** Check query efficiency, proper use of Drizzle ORM, and error handling.

## Common Patterns

- All API calls use tRPC procedures (never raw fetch)
- Database queries go through `server/db.ts` helpers
- Forms use React Hook Form + Zod validation
- Loading states use skeleton components
- Errors show toast notifications via Sonner
- File uploads go to S3 via `storagePut()`
- Admin checks use `OWNER_OPEN_ID` comparison
