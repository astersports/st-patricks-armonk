# Sandbox → Production: how this repo reaches go-live

This document explains the two-repo model for the St. Patrick in Armonk parish site and
gives the **migration scheduler/agent** a concrete map of what to carry across and what to
leave behind. See [`../CLAUDE.md`](../CLAUDE.md) for the short version.

## The two-repo model

```
┌─────────────────────────────┐        migration            ┌──────────────────────────────┐
│  SANDBOX (this repo)         │   scheduler/agent reads     │  PRODUCTION (separate account) │
│  astersports/                │   this repo and transfers   │  <TBD account> / <TBD repo>     │
│  st-patricks-armonk          │ ─────────────────────────▶ │  • hosting (TBD)               │
│  • build + audit + verify    │     code + knowledge        │  • public domain / DNS         │
│  • main = source of truth    │                             │  • production secrets          │
│  • CI green before merge     │                             │  • real PII + retention        │
│  • NOT production            │                             │  • go-live decision            │
└─────────────────────────────┘                             └──────────────────────────────┘
```

**Why two repos / two accounts:** the Archdiocese of New York requires production to be
organizationally separated from the build environment — a different GitHub account/org and
a different hosting setup. This sandbox is owned by Olive Juice Inc (DBA Aster Sports) on
behalf of the parish; production lives on the Archdiocese-compliant account.

**Flow is one-way:** sandbox → production. Nothing about real production data flows back
here. This repo never holds the production system of record.

## What TRANSFERS (carry across)

The *application and its knowledge* — everything that defines what to build and how it
behaves:

- **App code:** `client/`, `server/`, `shared/`.
- **Schema + migrations:** `drizzle/` (as the schema design; the production DB instance is
  re-provisioned separately).
- **Tests:** `*.test.{ts,tsx}` — they should pass in production too.
- **Docs & specs:** `docs/`, `ARCHITECTURE.md`, audits, the forms-rehost spec.
- **Build/test tooling intent:** `package.json` scripts, `tsconfig`, vite/vitest config,
  the CI workflow *shape* (`.github/workflows/ci.yml`) — adapted to production's secrets.

## What is ENVIRONMENT-SPECIFIC (do NOT copy as-is; re-provision on the production side)

These are bound to *this* sandbox and must be recreated/replaced for production:

- **Secrets & tokens:** anything in env / GitHub Actions secrets. Notably the
  `ASTER_WEATHER_TOKEN` org token used to install the private `@aster/weather` dep in CI —
  production needs its own access path to that package (or vendors/forks it).
- **Datastores:** the DB and object storage instances/credentials (the legacy MySQL/S3
  here, or the Supabase instances the rehost targets) — new instances on the production
  side.
- **Auth app credentials:** OAuth client IDs/secrets, JWT signing secrets.
- **Email-service keys**, push (VAPID) keys, any third-party API keys.
- **Host/deploy config:** whatever production picks (host TBD) — domains, DNS, build hooks.
- **Third-party form embeds** (e.g. the Droplet.io CCD form) and external subscriber lists
  (Flocknote) — these are accounts, re-pointed/owned on the production side.

> Rule of thumb for the migrating agent: **carry code and intent; never carry credentials,
> instance handles, or host wiring.** If a value would grant access to a running system,
> it does not cross.

## What this repo deliberately does NOT decide

Because this is the sandbox, the following are **production-repo concerns** and should not
block or be "finished" here — prepare/spec them, don't perform them:

- Production **hosting** choice and provisioning.
- The **eCatholic → production** domain/DNS cutover and its sequencing.
- Real-PII **retention/disposal** policy and DPA/legal sign-off.
- **Go-live** gating and launch.

(The forms-rehost spec's "form retention" question, for example, is answered on the
production side — it is not a reason to hold a feature in this sandbox.)

## Keeping the migration legible

To make the scheduler/agent's job clean:

- Keep `main` green and self-consistent (CI gates this).
- Write commit/PR text that states **intent**, not just the diff.
- Put durable decisions in `docs/` (audits, specs, this file), not only in chat.
- When the production repo/account/host become known, **record them in the diagram above
  and in `CLAUDE.md` §2** so future sessions stop treating them as TBD.

## Open items (fill in when known)

- [ ] Production GitHub account/org + repo name.
- [ ] Production host.
- [ ] The migration scheduler/agent mechanism + cadence.
- [ ] Production access path for the private `@aster/weather` dependency.
