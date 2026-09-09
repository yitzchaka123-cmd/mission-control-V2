---

description: "Task list for 004-front-door-accounts"
---

# Tasks: Front door, accounts and data isolation

**Input**: Design documents from `/specs/004-front-door-accounts/`
**Prerequisites**: [`plan.md`](./plan.md) ✅, [`spec.md`](./spec.md) ✅, constitution ✅
**Depends on**: 003 (the shell hosts the gates)

**Tests**: **REQUIRED** — Constitution Principle II. Cross-tenant leakage is the one bug class
that cannot be walked back, so isolation is proven by tests that attempt real cross-reads,
never by reading policy files (plan.md D2).

**Organization**: Story order follows spec.md priority: US1 (P1) → US2 (P1) → US3 (P3).

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Write the Done Contract in `specs/004-front-door-accounts/done-contract.md` — **written before any code**, naming what will be demonstrated to Issac and how (Constitution II)
- [ ] T002 Create `api/` serverless function package with TypeScript config per plan.md Project Structure
- [ ] T003 [P] Create `db/migrations/` with an ordered, idempotent migration runner
- [ ] T004 [P] Configure Vitest projects `tenancy`, `door` and `keyscan` in `api/vitest.config.ts`
- [ ] T005 [P] Document required server settings in `api/env.example` — every name the "not set up" state must be able to report

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: The database door closes **before** real data exists. v1 wrote this migration
and never ran it, and it sat unrun while the app collected real data (plan.md D4).

- [ ] T006 Write migration `db/migrations/0001_schema.sql` — the live tables with an `owner_id` column on every one
- [ ] T007 Write migration `db/migrations/0002_close_public_door.sql` — enable row-level security, drop every permissive policy, revoke anonymous and authenticated roles (spec FR-012)
- [ ] T008 **Verify T007 by test, not by its own success** — `api/tests/tenancy/anonymous-reads-nothing.test.ts` asserts an unauthenticated request reads zero rows (plan.md D4) (spec SC-001)
- [ ] T009 Write migration `db/migrations/0003_accounts.sql` — composite keys, per-owner policies, bridge-token table, one-time legacy-office claim
- [ ] T010 [P] **Write the key scan FIRST** in `api/tests/keyscan/no-credentials.test.ts` — scans the built bundle and every shipped script; any hit **fails the build** (plan.md D6, spec FR-009) (spec SC-003)
- [ ] T011 [P] Implement the signed-cookie helper in `api/lib/cookie.ts` — HttpOnly, 12-hour validity
- [ ] T012 [P] Implement the rate limiter in `api/lib/rateLimit.ts` — per visitor per door, returning **429 with Retry-After** in plain words (spec FR-010)

**Checkpoint**: The database door is shut and proven shut. Data can now safely exist.

---

## Phase 3: User Story 1 — The door keeps strangers out (Priority: P1) 🎯 MVP

**Goal**: The owner gets in; a guesser is locked out and stays locked out.

**Independent Test**: Enter correctly; then fail five times and confirm the lock survives a reload, a new tab and a new browser.

### Tests for User Story 1

- [ ] T013 [P] [US1] Test in `api/tests/door/server-side-only.test.ts` — the code never appears in the client bundle (spec FR-001)
- [ ] T014 [P] [US1] Test in `api/tests/door/cookie.test.ts` — success issues a signed HttpOnly cookie valid **12 hours** (spec FR-002)
- [ ] T015 [P] [US1] Test in `api/tests/door/lockout-durable.test.ts` — **5 wrong in 10 minutes → 15-minute lock**, surviving reload, new tab and new browser (spec FR-003, SC-002)
- [ ] T016 [P] [US1] Test in `api/tests/door/not-set-up.test.ts` — the "not set up" state **names each missing setting** (spec FR-004)
- [ ] T017 [P] [US1] Playwright test in `web/tests/e2e/door-keyboard.spec.ts` — keypad digits and backspace work from the keyboard

### Implementation for User Story 1

- [ ] T018 [US1] Implement the durable attempt counter in `db/migrations/0004_door_guard.sql` and `api/lib/doorGuard.ts` — counted in the **database**, not in memory (plan.md D3)
- [ ] T019 [US1] Implement `api/door.ts` — GET state · POST code · DELETE lock, with server-side comparison
- [ ] T020 [US1] Implement `DoorGate` in `web/src/app/gates/DoorGate.tsx` — 0–9 keypad, backspace, four dots, welcome line, tries-left line
- [ ] T021 [US1] Implement the "not set up" state listing missing settings by name (spec FR-004)
- [ ] T022 [US1] State remaining lock time plainly when an attempt arrives during a lock (spec Edge Cases)
- [ ] T023 [US1] Implement Settings → "Lock now" in `web/src/app/settings/SecurityCard.tsx` (spec FR-011)

**Checkpoint**: The door is real and the lockout is durable. This is the MVP of this feature.

---

## Phase 4: User Story 2 — Two people never see each other's office (Priority: P1)

**Goal**: Two independent belts, each of which alone refuses a cross-read.

**Independent Test**: Two accounts, two offices, two browsers; attempt cross-reads directly against the data API.

### Tests for User Story 2

- [ ] T024 [P] [US2] Test in `api/tests/tenancy/two-owners.test.ts` — each account sees only its own rows (spec SC-004)
- [ ] T025 [P] [US2] Test in `api/tests/tenancy/belt-one-alone.test.ts` — with row-level security disabled, the **allow-list still refuses** a cross-read
- [ ] T026 [P] [US2] Test in `api/tests/tenancy/belt-two-alone.test.ts` — with the allow-list bypassed, **row-level security still refuses** (plan.md D2 — two belts that share a failure mode are one belt)
- [ ] T027 [P] [US2] Test in `api/tests/tenancy/pc-token-scope.test.ts` — the PC token reaches only its allow-listed tables (spec FR-008)
- [ ] T028 [P] [US2] Test in `api/tests/tenancy/no-user-enumeration.test.ts` — errors never reveal whether an email exists (spec FR-014)

### Implementation for User Story 2

- [ ] T029 [US2] Implement the allow-listed query API in `api/data.ts` — described queries only (select / eq / in / order / limit / single / insert / upsert / update / delete), a change **must name its rows**, max 500 (spec FR-007)
- [ ] T030 [US2] Execute every query with the signed-in person's own token in `api/lib/userClient.ts` (spec FR-007)
- [ ] T031 [US2] Implement the PC's token-scoped path in `api/rest/[table].ts` with its own table allow-list (spec FR-008)
- [ ] T032 [US2] Implement `api/bridge-token.ts` — list, mint, revoke, stored hashed (spec FR-006)
- [ ] T033 [US2] Wire the key scan (T010) into the build as a **blocking** gate (spec FR-009)

**Checkpoint**: Isolation is proven by attempted attack, not by inspection.

---

## Phase 5: User Story 3 — Issac can leave (Priority: P3)

**Goal**: Accounts work end to end, including leaving.

**Independent Test**: Create an account, sign out, sign back in, delete it, and confirm every owned row is gone.

### Tests for User Story 3

- [ ] T034 [P] [US3] Test in `api/tests/tenancy/delete-account.test.ts` — deleting removes **every** row the owner owned (spec SC-005)
- [ ] T035 [P] [US3] Test in `api/tests/door/placeholder-unreachable.test.ts` — with accounts mode on, **no fixed placeholder code path is reachable** (plan.md D5, spec FR-013)
- [ ] T036 [P] [US3] Test in `api/tests/tenancy/legacy-claim-once.test.ts` — a legacy office is claimable **once**, then never again (spec Edge Cases)

### Implementation for User Story 3

- [ ] T037 [US3] Implement `api/auth.ts` — who am I, sign up, sign in, sign out, recover, delete
- [ ] T038 [US3] Implement `AuthGate` in `web/src/app/gates/AuthGate.tsx` — one card, three modes, email plus 8-character minimum password
- [ ] T039 [US3] Implement wrong-password throttling in `api/auth.ts` (spec FR-005)
- [ ] T040 [US3] Implement Settings → Signed in as… / Sign out / Delete my account with confirmation (spec FR-011)
- [ ] T041 [US3] Implement the one-time legacy-office claim (spec Edge Cases)
- [ ] T042 [US3] Handle cookie expiry mid-session — the door reappears **without losing unsaved local drafts** (spec Edge Cases)

**Checkpoint**: All three user stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T043 [P] Apply rate limits per door in `api/` — data 240/min, auth 20/min, assistant 30/min (spec FR-010)
- [ ] T044 [P] Write `api/README.md` — the two belts, the door, and why the public-door migration is a build step rather than a launch task
- [ ] T045 [P] Add the v1 §14.4 launch-checklist items owned by this feature to `docs/LAUNCH.md`, each marked **already done in Phase 2–5** (plan.md ledger check)
- [ ] T046 Add this feature's 👁 verify items to the owner's verify list

---

## Dependencies

**Story completion order**: US1 → US2 → US3

```
Phase 1 Setup (T002–T005)
        ↓
Phase 2 Foundational (T006–T012)
        ⚠ T007 closes the public database door, and T008 proves it closed —
          by an anonymous-read test, NOT by the migration reporting success.
          This is v1's exact failure, corrected by ordering.
        ↓
Phase 3 US1 the door  ← 🎯 MVP
        ↓
Phase 4 US2 the two belts
        ↓
Phase 5 US3 accounts
        ↓
Phase 6 Polish
```

**Hard blockers**:
- 003 Phase 3 (the shell) blocks T020 and T038 — the gates render inside it.
- T007 blocks T008; T008 blocks every task that writes real data.
- T010 (key scan) must exist before T033 wires it into the build.
- T029 (allow-list) blocks T025 and T026.

## Parallel execution examples

**Phase 2**: T010, T011, T012 fully parallel with the migration work.
**Phase 3**: T013–T017 fully parallel.
**Phase 4**: T024–T028 fully parallel; T031 and T032 parallel after T029.
**Phase 5**: T034–T036 fully parallel.
**Phase 6**: T043–T045 fully parallel.

## Implementation strategy

**MVP = Phase 1 + 2 + 3.** The door works and the database is shut. Note the ordering: the
door is the *third* thing, not the first — because closing the database is what actually
protects the data, and a keypad in front of an open database protects nothing.

**Then US2 before US3.** Isolation before convenience. The two-belt tests (T025, T026) are the
most important tests in this feature: each disables one belt and confirms the other still
refuses, because two belts sharing a failure mode are one belt.

**Stop and prove after Phase 4.** Show Issac a cross-read being refused with each belt turned
off in turn. That is the proof that matters before the product holds anything real.
