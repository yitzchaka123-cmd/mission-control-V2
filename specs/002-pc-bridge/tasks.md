---

description: "Task list for 002-pc-bridge"
---

# Tasks: The PC bridge (the messenger)

**Input**: Design documents from `/specs/002-pc-bridge/`
**Prerequisites**: [`plan.md`](./plan.md) ✅, [`spec.md`](./spec.md) ✅, constitution ✅
**Depends on**: 001 (Hermes must expose `/health`, `/sessions` and the event stream)

**Tests**: **REQUIRED** — Constitution Principle II. This feature holds the security
boundary, so its tests are proofs, not demonstrations.

**Organization**: Story order follows spec.md priority: US1 (P1) → US2 (P1) → US3 (P2) → US4 (P2).

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Write the Done Contract in `specs/002-pc-bridge/done-contract.md` — **written before any code**, naming what will be demonstrated to Issac and how (Constitution II)
- [ ] T002 Create `bridge/` package at repo root with `package.json` declaring **zero dependencies** (plan.md D1) (spec FR-001)
- [ ] T003 [P] Add a dependency guard in `bridge/test/no-dependencies.test.mjs` — fails if `dependencies` is ever non-empty
- [ ] T004 [P] Configure Node's built-in test runner in `bridge/package.json` test script
- [ ] T005 Create the state-file layout under the Home Base data folder in `bridge/state.mjs` (snapshot, outbox, lock, cloud-lane, cost-history, mirror-state)

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: No user story work begins until this phase is complete.

- [ ] T006 Implement the single-instance lock in `bridge/instance.mjs` — a second bridge refuses to start, **loudly** (spec FR-018)
- [ ] T007 [P] Implement the Hermes HTTP client in `bridge/hermes.mjs` — `GET /health`, `GET /sessions`, event subscribe. **Zero subprocess spawning** (plan.md D3, spec SC-005)
- [ ] T008 [P] Implement the three cloud lanes in `bridge/cloud/index.mjs` — door | direct | none, with the active lane published (plan.md D7, spec FR-015)
- [ ] T009 [P] Add a credential guard in `bridge/test/no-baked-keys.test.mjs` — no database key in any shipped script (spec FR-016) (spec SC-006)
- [ ] T010 Implement the rolling feed writer in `bridge/feed.mjs` — last 200 lines so Home Base sees the feed even when the office self-started (spec FR-017)
- [ ] T011 Implement source-level secret redaction in `bridge/redact.mjs` (spec FR-019)

**Checkpoint**: The bridge can reach Hermes and the cloud, and cannot leak or double-start.

---

## Phase 3: User Story 1 — The website knows the truth about the PC (Priority: P1) 🎯 MVP

**Goal**: Every honest screen reads one snapshot that reflects reality, or plainly says it cannot.

**Independent Test**: Start the bridge, watch a snapshot land; stop it, watch dependent screens turn honest within the freshness window.

### Tests for User Story 1

- [ ] T012 [P] [US1] Test in `bridge/test/snapshot-cadence.test.mjs` — a snapshot is written within 20 s of each tick (spec FR-002)
- [ ] T013 [P] [US1] Test in `bridge/test/snapshot-freshness.test.mjs` — a snapshot older than **3 minutes** is stale (spec FR-004)
- [ ] T014 [P] [US1] Test in `bridge/test/connected-requires-agent.test.mjs` — healthy service + **zero agents** = NOT connected (spec FR-004, US1 scenario 4)
- [ ] T015 [P] [US1] Test in `bridge/test/never-reported.test.mjs` — never-reported is distinguishable from off and from stale (spec SC-001)
- [ ] T016 [P] [US1] Test in `bridge/test/no-spawn-per-tick.test.mjs` — a tick spawns **zero** child processes (spec SC-005, the v1 probe storm)

### Implementation for User Story 1

- [ ] T017 [US1] Implement the 20 s tick loop with overlap guard in `bridge/tick.mjs` (spec FR-002)
- [ ] T018 [US1] Implement snapshot assembly in `bridge/snapshot.mjs` — agents, sessions, counts, health, memory block, locked flag, connect requests, connection statuses, MCP mounts, jobs, needs-you count, office brief, journals index, dev rows, personality (spec FR-003)
- [ ] T019 [US1] Implement the connected rule in `bridge/snapshot.mjs` — fresh **AND** at least one agent; a service probe alone never qualifies
- [ ] T020 [US1] Implement the snapshot push to `hermes_live/snapshot` in `bridge/push.mjs`
- [ ] T021 [US1] Publish the active cloud lane in the snapshot so screens can tell "no PC" from "no cloud" (plan.md D7)

**Checkpoint**: The website tells the truth about the PC. This is the MVP of this feature.

---

## Phase 4: User Story 2 — Commands reach the PC, signed (Priority: P1)

**Goal**: The write path for the whole product, with a boundary that refuses forgery, replay and staleness.

**Independent Test**: Queue one command, watch it verify, run and return; then replay it and watch the replay refused.

### Tests for User Story 2

- [ ] T022 [P] [US2] Test in `bridge/test/lock-verify.test.mjs` — HMAC-SHA256 over `kind|ts|nonce|payload` with **timing-safe compare** (spec FR-006) (spec SC-002)
- [ ] T023 [P] [US2] Test in `bridge/test/lock-stale.test.mjs` — a command older than **2 minutes** is refused (spec US2 scenario 2)
- [ ] T024 [P] [US2] Test in `bridge/test/lock-replay.test.mjs` — a reused nonce is refused (spec US2 scenario 3)
- [ ] T025 [P] [US2] Test in `bridge/test/command-unknown-kind.test.mjs` — an unknown kind is refused; **no "run anything" door** (spec FR-007)
- [ ] T026 [P] [US2] Test in `bridge/test/command-lifecycle.test.mjs` — status moves pending → running → done | error (spec FR-008)

### Implementation for User Story 2

- [ ] T027 [US2] Implement HMAC sign/verify in `bridge/lock.mjs` — carried over from v1 unchanged (plan.md D4)
- [ ] T028 [US2] Implement the nonce replay store in `bridge/lock.mjs` with a 2-minute freshness window
- [ ] T029 [US2] Implement the 2 s command pull loop in `bridge/commands.mjs` (spec FR-005)
- [ ] T030 [US2] Implement the **fixed, enumerable** command menu in `bridge/commands/menu.mjs` (spec FR-007)
- [ ] T031 [US2] Route `set_secret` through the locked path only — remove v1's "only when no lock exists" exception (plan.md D4, 001 D7)
- [ ] T032 [US2] Implement result write-back with explicit truncation marker for oversized results (spec Edge Cases)
- [ ] T033 [US2] Report clock skew as a **named health problem**, not a mystery failure (spec Edge Cases)
- [ ] T034 [US2] Report open mode plainly when no office lock exists — every security-state screen must say so (spec Edge Cases)

**Checkpoint**: The security boundary is real and provably refuses forgery, replay and staleness.

---

## Phase 5: User Story 3 — A late reply still finds its thread (Priority: P2)

**Goal**: A message sent to a sleeping PC is never lost, and its reply lands in the original conversation.

**Independent Test**: Send with the PC asleep, confirm the outbox note, wake the PC, confirm the reply lands in the same thread.

### Tests for User Story 3

- [ ] T035 [P] [US3] Test in `bridge/test/outbox-park.test.mjs` — no pickup within ~30 s parks the message with the asleep note (spec FR-010)
- [ ] T036 [P] [US3] Test in `bridge/test/outbox-deliver.test.mjs` — on wake, the parked message is delivered
- [ ] T037 [P] [US3] Test in `bridge/test/late-reply-thread.test.mjs` — a late reply lands in the **original** thread, not a new one (spec SC-003)
- [ ] T038 [P] [US3] Test in `bridge/test/task-stays-in-progress.test.mjs` — an unreachable PC leaves a run-task card In Progress, never a false state

### Implementation for User Story 3

- [ ] T039 [P] [US3] Implement the outbox store in `bridge/outbox.mjs` with thread identity preserved
- [ ] T040 [US3] Implement park/deliver logic with the constants from the registry (~2¾ min patience, ~30 s asleep verdict, ~5 min late watch)
- [ ] T041 [US3] Implement late-reply landing in `bridge/outbox.mjs` keyed by thread identity
- [ ] T042 [US3] Subscribe to the Hermes event stream for the transcript mirror in `bridge/mirror.mjs` — **read no files** (plan.md D6, ripple R6)
- [ ] T043 [US3] Confirm the silent-turn watcher is **not built** — add `bridge/test/no-silent-turn-watcher.test.mjs` asserting no trajectory-log reader exists (spec FR-011)

**Checkpoint**: Nothing is lost when the PC sleeps. This is the behaviour that makes the product trustworthy.

---

## Phase 6: User Story 4 — Cost is witnessed, not invented (Priority: P2)

**Goal**: Every usage figure traces to an observation, and absence of data is never a zero.

**Independent Test**: Run turns in several rooms, reconcile figures against observed growth, confirm a restart causes no double count.

### Tests for User Story 4

- [ ] T044 [P] [US4] Test in `bridge/test/cost-baseline.test.mjs` — first sighting sets a baseline contributing **zero** (spec FR-009)
- [ ] T045 [P] [US4] Test in `bridge/test/cost-growth.test.mjs` — only growth is attributed, to the right room and day
- [ ] T046 [P] [US4] Test in `bridge/test/cost-restart.test.mjs` — a drop re-baselines; **no negative, no double count** (spec SC-004)
- [ ] T047 [P] [US4] Test in `bridge/test/cost-no-growth-no-write.test.mjs` — no growth means nothing written; absence is never a zero
- [ ] T048 [P] [US4] Test in `bridge/test/cost-no-currency.test.mjs` — the bridge computes **no currency figure anywhere** (flat rate; 012 FR-014)

### Implementation for User Story 4

- [ ] T049 [P] [US4] Implement the token-growth witness in `bridge/cost.mjs` with 60-day retention (plan.md D5)
- [ ] T050 [US4] Implement attribution rules — worker desks to their room, Maria/Telegram/unknown to Office Management, patrol to Police Station (spec FR-009)
- [ ] T051 [US4] Implement the unclaimed bucket for unattributable sessions — named, never silently dropped (spec Edge Cases)
- [ ] T052 [P] [US4] Implement the journal writer in `bridge/journals.mjs` — `[YYYY-MM-DD HH:MM] from → to (door): text`, doors 🖥️📱🎤🤖, **written by code at zero token cost** (spec FR-012)
- [ ] T053 [P] [US4] Implement the bounded workspace walk in `bridge/files.mjs` — 400 entries, depth 4, skip dotfiles and `node_modules`, refresh every 10 min on change (spec FR-013)
- [ ] T054 [US4] Implement the police patrol (00:00 UTC) and librarian tidy (01:00 UTC) triggers in `bridge/nightly.mjs` (spec FR-014)

**Checkpoint**: All four user stories independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T055 [P] Build the replay test suite in `bridge/test/replay/` over **recorded real v1 log lines** (plan.md Testing)
- [ ] T056 [P] Handle a long cloud outage — keep local state, report the gap, discard nothing (spec Edge Cases)
- [ ] T057 [P] Write the Startup-shortcut and Home Base child-process launch scripts in `bridge/scripts/`
- [ ] T058 [P] Write `bridge/README.md` — what it carries, the two loops, and the lock
- [ ] T059 Add this feature's 👁 verify items to the owner's verify list

---

## Dependencies

**Story completion order**: US1 → US2 → US3 → US4

```
Phase 1 Setup (T002–T005)
        ↓
Phase 2 Foundational (T006–T011)   ← needs 001 Phase 3 (a running Hermes)
        ↓
Phase 3 US1 snapshot  ← 🎯 MVP
        ↓
Phase 4 US2 signed commands
        ↓
   ┌────┴────┐
Phase 5    Phase 6      (US3 and US4 are independent of each other)
  US3        US4
   └────┬────┘
        ↓
Phase 7 Polish
```

**Hard blockers**:
- 001 Phase 3 (a turn actually runs) blocks T007 and everything downstream.
- T017 (tick loop) blocks T018–T021.
- T027 (HMAC) blocks T028–T034.
- T042 (event subscription) depends on 001 T026.

## Parallel execution examples

**Phase 2**: T007, T008, T009 in parallel.
**Phase 3**: T012–T016 (all five tests) fully parallel.
**Phase 4**: T022–T026 fully parallel; then T027 alone; then T029–T034.
**Phase 6**: T044–T048 fully parallel; T052 and T053 parallel with T049.

## Implementation strategy

**MVP = Phase 1 + 2 + 3.** The website reads one honest snapshot. Combined with 001's MVP,
that is the first end-to-end proof that the seam works: a real turn on the PC, reported
truthfully to the cloud.

**Then US2 before US3 before US4** — the security boundary before convenience before
accounting. US2 is the write path; nothing else should exist before it is provably safe.

**Stop and prove after Phase 4.** Issac should see a command he issued on the website run on
his PC, and see a forged one refused.
