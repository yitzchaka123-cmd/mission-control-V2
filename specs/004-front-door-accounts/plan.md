# Implementation Plan: Front door, accounts and data isolation

**Branch**: `claude/dazzling-dirac-th0asg` | **Date**: 2026-09-09
**Spec**: [`spec.md`](./spec.md) | **Tier**: 0 | **Milestone**: 1 | **Depends on**: 003

## Summary

Everything private sits behind this: the keypad door, accounts, and the two independent belts
that keep one person's office invisible to another. v1 had the right shape but shipped with a
placeholder code and left the migration that closes the public database door **unrun**. Here
the door is shut before any real data exists.

## Technical Context

**Language/Version**: TypeScript; serverless functions
**Primary Dependencies**: hosted Postgres with built-in auth and row-level security (Supabase), serverless hosting (Vercel)
**Storage**: Postgres; signed HttpOnly cookies; durable lockout counter in the database
**Testing**: Vitest; a cross-tenant test suite that attempts real cross-reads; a key scan in CI
**Target Platform**: browsers + serverless
**Constraints**: no database key in the browser · two independent belts · placeholder code removed before a second person
**Scale/Scope**: one owner now; designed so a second account changes nothing structural

## Constitution Check

| Principle | How |
|---|---|
| **I. Nothing Fake** | The "not set up" state **names each missing setting** instead of failing opaquely. |
| **II. Built ≠ Done** | Cross-tenant isolation is proven by tests that attempt real cross-reads, not by reading policy files. |
| **III. Plain Language** | Lockouts, rate limits and errors say what happened and what to do. |
| **V. Irreversible Asks** | Account deletion is confirmed and complete. |
| **VIII. Spec Before Code** | Spec approved, zero open questions. |

**Result: PASS.**

---

## The decisions

### D1 — Keep the hosted-Postgres + serverless stack

**Decision**: Supabase (Postgres, Auth, row-level security) behind Vercel serverless
functions, as in v1 §2.13.

**Why**: v1's data-path design was sound and the audit did not fault it — it faulted the
migration never being *run*. Row-level security and an allow-listed query API give two
genuinely independent belts, which is the property that matters. Switching stacks would
discard a working design to fix an operational failure.

### D2 — Two belts, and they must fail independently

**Decision**: Belt one is the allow-listed query API (described queries only: select / eq / in
/ order / limit / single / insert / upsert / update / delete; a change must name its rows; max
500). Belt two is row-level security, evaluated with the signed-in person's own token.

**Why**: A single belt is a single point of failure, and cross-tenant leakage is the one bug
class that cannot be walked back after it happens. The test suite disables each belt in turn
and confirms the other still refuses — because two belts that share a failure mode are one belt.

### D3 — The door is server-side, and the lockout is durable

**Decision**: The code is compared on the server and never enters the client bundle. Success
issues a signed HttpOnly cookie for 12 hours. Five wrong attempts in ten minutes triggers a
fifteen-minute lock, counted **in the database**.

**Why**: A lockout in memory or in the browser is not a lockout — it dies with the function
instance or with a new tab. Durability is what makes it real.

### D4 — The public database door is closed before real data exists

**Decision**: Run the migration that revokes anonymous and authenticated roles and drops every
permissive policy **as part of this feature**, not as a launch task.

**Why**: v1 wrote this migration and never ran it. It sat unrun while the app collected real
data. Ordering is the entire fix: close the door, then put things in the room.

### D5 — The placeholder code cannot outlive single-user mode

**Decision**: A test asserts that when accounts mode is on, no fixed placeholder code path is
reachable.

**Why**: v1 shipped `0331` as a temporary code and it survived into the accounts work. A test
is the only thing that reliably kills a temporary measure.

### D6 — The key scan is a blocking gate from the first build

**Decision**: The built bundle is scanned for credentials; any hit fails the build. Wired into
the gate (020) before the first screen ships.

**Why**: Adding it later means auditing history rather than preventing a mistake. Cheap now,
expensive later.

---

## Project structure

```
api/
  door.ts            GET state · POST code · DELETE lock
  auth.ts            who am I · sign up / in / out · recover · delete
  data.ts            the allow-listed query API (belt one)
  rest/              the PC's token-scoped path (its own table allow-list)
  bridge-token.ts    list · mint · revoke
db/
  migrations/        schema · close-the-public-door · accounts + RLS
web/src/app/gates/   DoorGate · AuthGate
tests/
  tenancy/           cross-read attempts, each belt disabled in turn
  door/              lockout durability across reload, tab and browser
  keyscan/           blocking credential scan
```

---

## Phases

| Phase | What | Exit condition |
|---|---|---|
| **1 · Door** | Server-side code, signed cookie, durable lockout | The lock survives reload, a new tab and a new browser |
| **2 · Schema** | Tables, owner column, **close the public door** | An anonymous request reads nothing, proven |
| **3 · Belts** | Allow-listed query API + row-level security | Cross-read refused with each belt disabled in turn |
| **4 · Accounts** | Sign up / in / out, reset, delete my account | Deleting removes every owned row, verifiably |
| **5 · Limits** | Per-door rate limits, 429 with Retry-After | Limits trigger and explain themselves plainly |

---

## Risks

| Risk | Response |
|---|---|
| A future query shape bypasses the allow-list | The allow-list is additive and reviewed; row-level security catches what it misses. That is the point of two belts. |
| A migration runs out of order in production | Migrations are ordered and idempotent; the public-door migration is verified by an anonymous-read test, not by its own success. |
| The owner locks himself out | The lock is 15 minutes and self-clearing. It is never permanent. |
| Legacy office rows with no owner | Claimable **once**, by one named account, then never again. |

---

## Idea ledger check

[`docs/IDEA-LEDGER.md`](../../docs/IDEA-LEDGER.md) lists **0 unbuilt v1 ideas** against
§2.12, §3.2 and §12.1. Nothing to schedule or defer.

Note: v1's §14.4 launch checklist items that belong to this feature — running the
close-the-public-door migration, removing the placeholder code, delete-my-account — are
**pulled forward into the phases above** rather than left as launch tasks, because v1 left
them as launch tasks and they never ran.
