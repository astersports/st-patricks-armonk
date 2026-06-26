# CLAUDE.md — Operating agreement (st-patricks-armonk)

> **Read this first.** It defines what this repository *is* and how work here reaches
> production. If you are a Claude Code session (or any agent) that just landed in this
> repo, the most important fact is in §1.

---

## 1. This repo is the SANDBOX, not production

`astersports/st-patricks-armonk` is the **build / sandbox** environment for the St. Patrick
in Armonk parish site. We design, build, audit, and verify here. **This repo does not host
the live parish site and never will.**

- It is **not** production hosting.
- It does **not** hold real parishioner PII as a system of record.
- Go-live, the public domain, and the production database live **elsewhere** (§2).

## 2. Production is a SEPARATE repo on a SEPARATE GitHub account

Per the **Archdiocese of New York's** organizational-separation requirements, production
must live under a **different GitHub account/org and a different hosting setup** from this
sandbox. That production repository — not this one — owns:

- production **hosting** (host still being decided),
- the public **domain / DNS** and the cutover off the incumbent (eCatholic),
- production **secrets** (DB, storage, OAuth, email service, CI tokens),
- real-PII handling and **form/record retention** policy,
- the **go-live** decision and any launch gates.

> Identity of the production repo/account and the host are **TBD** as of this writing.
> Do not invent or hard-code them. When known, record them here and in
> `docs/SANDBOX_AND_MIGRATION.md`.

## 3. Direction of flow: build here → migrate to production

Code and knowledge move **one way**: from this sandbox **to** the production repo. The
operator is standing up a **scheduler/agent that reads this repository** and transfers the
work into the production repo on the separate account. So:

- **`main` here is the canonical source of truth for WHAT to build and HOW the app
  behaves.** Keep it clean, green, and well-described — the migration reads it.
- Write commit messages, PR descriptions, and `docs/` so they are **legible to a migrating
  agent**, not just to humans. State intent, not just diffs.
- Don't do production-only work here (provisioning prod infra, wiring prod secrets,
  DNS) — that belongs in the production repo. Prepare it; don't perform it.

See `docs/SANDBOX_AND_MIGRATION.md` for what transfers vs. what is environment-specific and
must be re-provisioned on the production side.

## 4. What that means for how we work here

**In scope (do it here):** features, UI, forms, admin CMS, schema design + migrations,
tests, audits, specs, and any decision about how the *application* should behave. This repo
is where the app is actually built.

**Out of scope here (production-repo concerns — prepare, don't perform):** production
hosting choices, the eCatholic→production domain cutover, production secret provisioning,
real-PII retention/disposal policy, and the launch decision. **Do not block sandbox work on
these** — e.g. "form retention" is a production policy question, not a reason to hold a
feature here.

## 5. Standing conventions (unchanged)

- **Branch + PR.** Feature branch off `main`; PR into `main`; CI (`pnpm check` + `test` +
  `build`) must be green; squash-merge. `main` is the sandbox's verified state.
- **CI auth note:** `@aster/weather` is a private cross-repo dependency; CI authenticates
  the install with the org-level `ASTER_WEATHER_TOKEN`. This token, and any other secret,
  is **environment-specific** — it does **not** transfer to production as-is (§ migration).
- **Build/test:** `pnpm check` (tsc) and `pnpm test` (vitest). Keep both green before merge.

## 6. Pointers

| | |
|---|---|
| What this repo is + migration model | **this file** · [`docs/SANDBOX_AND_MIGRATION.md`](./docs/SANDBOX_AND_MIGRATION.md) |
| Architecture | [`ARCHITECTURE.md`](./ARCHITECTURE.md) |
| Paperwork/automation audit | [`docs/PAPERWORK_AUTOMATION_AUDIT_2026-06-26.md`](./docs/PAPERWORK_AUTOMATION_AUDIT_2026-06-26.md) |
| Forms rehost spec (architect) | `stpatrick-forms-rehost-spec` (Drive) |
