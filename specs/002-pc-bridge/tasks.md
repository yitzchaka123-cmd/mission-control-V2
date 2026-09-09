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

- [ ] T001 Create `bridge/` package at repo root with `package.json` declaring **zero dependencies** (plan.md D1)
- [ ] T002 [P] Add a dependency guard in `bridge/test/no-dependencies.test.mjs` — fails if `dependencies` is ever non-empty
- [ ] T003 [P] Configure Node's built-in test runner in `bridge/package.json` test script
- [ ] T004 Create the state-file layout under the Home Base data folder in `bridge/state.mjs` (snapshot, outbox, lock, cloud-lane, cost-history, mirror-state)

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: No user story work begins until this phase is complete.

- [ ] T005 Implement the single-instance lock in `bridge/instance.mjs` — a second bridge refuses to start, **loudly** (spec FR-018)
- [ ] T006 [P] Implement the Hermes HTTP client in `bridge/hermes.mjs` — `GET /health`, `GET /sessions`, event subscribe. **Zero subprocess spawning** (plan.md D3, spec SC-005)
- [ ] T007 [P] Implement the three cloud lanes in `bridge/cloud/index.mjs` — door | direct | none, with the active lane published (plan.md D7, spec FR-015)
- [ ] T008 [P] Add a credential guard in `bridge/test/no-baked-keys.test.mjs` — no database key in any shipped script (spec FR-016)
- [ ] T009 Implement the rolling feed writer in `bridge/feed.mjs` — last 200 lines so Home Base sees the feed even when the office self-started (spec FR-017)
- [ ] T010 Implement source-level secret redaction in `bridge/redact.mjs` (spec FR-019)

**Checkpoint**: The bridge can reach Hermes and the cloud, and cannot leak or double-start.

---

## Phase 3: User Story 1 — The website knows the truth about the PC (Priority: P1) 🎯 MVP

**Goal**: Every honest screen reads one snapshot that reflects reality, or plainly says it cannot.

**Independent Test**: Start the bridge, watch a snapshot land; stop it, watch dependent screens turn honest within the freshness window.

### Tests for User Story 1

- [ ] T011 [P] [US1] Test in `bridge/test/snapshot-cadence.test.mjs` — a snapshot is written within 20 s of each tick (spec FR-002)
- [ ] T012 [P] [US1] Test in `bridge/test/snapshot-freshness.test.mjs` — a snapshot older than **3 minutes** is stale (spec FR-004)
- [ ] T013 [P] [US1] Test in `bridge/test/connected-requires-agent.test.mjs` — healthy service + **zero agents** = NOT connected (spec FR-004, US1 scenario 4)
- [ ] T014 [P] [US1] Test in `bridge/test/never-reported.test.mjs` — never-reported is distinguishable from off and from stale (spec SC-001)
- [ ] T015 [P] [US1] Test in `bridge/test/no-spawn-per-tick.test.mjs` — a tick spawns **zero** child processes (spec SC-005, the v1 probe storm)

### Implementation for User Story 1

- [ ] T016 [US1] Implement the 20 s tick loop with overlap guard in `bridge/tick.mjs` (spec FR-002)
- [ ] T017 [US1] Implement snapshot assembly in `bridge/snapshot.mjs` — agents, sessions, counts, health, memory block, locked flag, connect requests, connection statuses, MCP mounts, jobs, needs-you count, office brief, journals index, dev rows, personality (spec FR-003)
- [ ] T018 [US1] Implement the connected rule in `bridge/snapshot.mjs` — fresh **AND** at least one agent; a service probe alone never qualifies
- [ ] T019 [US1] Implement the snapshot push to `hermes_live/snapshot` in `bridge/push.mjs`
- [ ] T020 [US1] Publish the active cloud lane in the snapshot so screens can tell "no PC" from "no cloud" (plan.md D7)

**Checkpoint**: The website tells the truth about the PC. This is the MVP of this feature.

---

## Phase 4: User Story 2 — Commands reach the PC, signed (Priority: P1)

**Goal**: The write path for the whole product, with a boundary that refuses forgery, replay and staleness.

**Independent Test**: Queue one command, watch it verify, run and return; then replay it and watch the replay refused.

### Tests for User Story 2

- [ ] T021 [P] [US2] Test in `bridge/test/lock-verify.test.mjs` — HMAC-SHA256 over `kind|ts|nonce|payload` with **timing-safe compare** (spec FR-006)
- [ ] T022 [P] [US2] Test in `bridge/test/lock-stale.test.mjs` — a command older than **2 minutes** is refused (spec US2 scenario 2)
- [ ] T023 [P] [US2] Test in `bridge/test/lock-replay.test.mjs` — a reused nonce is refused (spec US2 scenario 3)
- [ ] T024 [P] [US2] Test in `bridge/test/command-unknown-kind.test.mjs` — an unknown kind is refused; **no "run anything" door** (spec FR-007)
- [ ] T025 [P] [US2] Test in `bridge/test/command-lifecycle.test.mjs` — status moves pending → running → done | error (spec FR-008)

### Implementation for User Story 2

- [ ] T026 [US2] Implement HMAC sign/verify in `bridge/lock.mjs` — carried over from v1 unchanged (plan.md D4)
- [ ] T027 [US2] Implement the nonce replay store in `bridge/lock.mjs` with a 2-minute freshness window
- [ ] T028 [US2] Implement the 2 s command pull loop in `bridge/commands.mjs` (spec FR-005)
- [ ] T029 [US2] Implement the **fixed, enumerable** command menu in `bridge/commands/menu.mjs` (spec FR-007)
- [ ] T030 [US2] Route `set_secret` through the locked path only — remove v1's "only when no lock exists" exception (plan.md D4, 001 D7)
- [ ] T031 [US2] Implement result write-back with explicit truncation marker for oversized results (spec Edge Cases)
- [ ] T032 [US2] Report clock skew as a **named health problem**, not a mystery failure (spec Edge Cases)
- [ ] T033 [US2] Report open mode plainly when no office lock exists — every security-state screen must say so (spec Edge Cases)

**Checkpoint**: The security boundary is real and provably refuses forgery, replay and staleness.

---

## Phase 5: User Story 3 — A late reply still finds its thread (Priority: P2)

**Goal**: A message sent to a sleeping PC is never lost, and its reply lands in the original conversation.

**Independent Test**: Send with the PC asleep, confirm the outbox note, wake the PC, confirm the reply lands in the same thread.

### Tests for User Story 3

- [ ] T034 [P] [US3] Test in `bridge/test/outbox-park.test.mjs` — no pickup within ~30 s parks the message with the asleep note (spec FR-010)
- [ ] T035 [P] [US3] Test in `bridge/test/outbox-deliver.test.mjs` — on wake, the parked message is delivered
- [ ] T036 [P] [US3] Test in `bridge/test/late-reply-thread.test.mjs` — a late reply lands in the **original** thread, not a new one
- [ ] T037 [P] [US3] Test in `bridge/test/task-stays-in-progress.test.mjs` — an unreachable PC leaves a run-task card In Progress, never a false state

### Implementation for User Story 3

- [ ] T038 [P] [US3] Implement the outbox store in `bridge/outbox.mjs` with thread identity preserved
- [ ] T039 [US3] Implement park/deliver logic with the constants from the registry (~2¾ min patience, ~30 s asleep verdict, ~5 min late watch)
- [ ] T040 [US3] Implement late-reply landing in `bridge/outbox.mjs` keyed by thread identity
- [ ] T041 [US3] Subscribe to the Hermes event stream for the transcript mirror in `bridge/mirror.mjs` — **read no files** (plan.md D6, ripple R6)
- [ ] T042 [US3] Confirm the silent-turn watcher is **not built** — add `bridge/test/no-silent-turn-watcher.test.mjs` asserting no trajectory-log reader exists (spec FR-011)

**Checkpoint**: Nothing is lost when the PC sleeps. This is the behaviour that makes the product trustworthy.

---

## Phase 6: User Story 4 — Cost is witnessed, not invented (Priority: P2)

**Goal**: Every usage figure traces to an observation, and absence of data is never a zero.

**Independent Test**: Run turns in several rooms, reconcile figures against observed growth, confirm a restart causes no double count.

### Tests for User Story 4

- [ ] T043 [P] [US4] Test in `bridge/test/cost-baseline.test.mjs` — first sighting sets a baseline contributing **zero** (spec FR-009)
- [ ] T044 [P] [US4] Test in `bridge/test/cost-growth.test.mjs` — only growth is attributed, to the right room and day
- [ ] T045 [P] [US4] Test in `bridge/test/cost-restart.test.mjs` — a drop re-baselines; **no negative, no double count** (spec SC-004)
- [ ] T046 [P] [US4] Test in `bridge/test/cost-no-growth-no-write.test.mjs` — no growth means nothing written; absence is never a zero
- [ ] T047 [P] [US4] Test in `bridge/test/cost-no-currency.test.mjs` — the bridge computes **no currency figure anywhere** (flat rate; 012 FR-014)

### Implementation for User Story 4

- [ ] T048 [P] [US4] Implement the token-growth witness in `bridge/cost.mjs` with 60-day retention (plan.md D5)
- [ ] T049 [US4] Implement attribution rules — worker desks to their room, Maria/Telegram/unknown to Office Management, patrol to Police Station (spec FR-009)
- [ ] T050 [US4] Implement the unclaimed bucket for unattributable sessions — named, never silently dropped (spec Edge Cases)
- [ ] T051 [P] [US4] Implement the journal writer in `bridge/journals.mjs` — `[YYYY-MM-DD HH:MM] from → to (door): text`, doors 🖥️📱🎤🤖, **written by code at zero token cost** (spec FR-012)
- [ ] T052 [P] [US4] Implement the bounded workspace walk in `bridge/files.mjs` — 400 entries, depth 4, skip dotfiles and `node_modules`, refresh every 10 min on change (spec FR-013)
- [ ] T053 [US4] Implement the police patrol (00:00 UTC) and librarian tidy (01:00 UTC) triggers in `bridge/nightly.mjs` (spec FR-014)

**Checkpoint**: All four user stories independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T054 [P] Build the replay test suite in `bridge/test/replay/` over **recorded real v1 log lines** (plan.md Testing)
- [ ] T055 [P] Handle a long cloud outage — keep local state, report the gap, discard nothing (spec Edge Cases)
- [ ] T056 [P] Write the Startup-shortcut and Home Base child-process launch scripts in `bridge/scripts/`
- [ ] T057 [P] Write `bridge/README.md` — what it carries, the two loops, and the lock
- [ ] T058 Write the Done Contract in `specs/002-pc-bridge/done-contract.md`
- [ ] T059 Add this feature's 👁 verify items to the owner's verify list

---

## Dependencies

**Story completion order**: US1 → US2 → US3 → US4

```
Phase 1 Setup (T001–T004)
        ↓
Phase 2 Foundational (T005–T010)   ← needs 001 Phase 3 (a running Hermes)
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
- 001 Phase 3 (a turn actually runs) blocks T006 and everything downstream.
- T016 (tick loop) blocks T017–T020.
- T026 (HMAC) blocks T027–T033.
- T041 (event subscription) depends on 001 T025.

## Parallel execution examples

**Phase 2**: T006, T007, T008 in parallel.
**Phase 3**: T011–T015 (all five tests) fully parallel.
**Phase 4**: T021–T025 fully parallel; then T026 alone; then T028–T033.
**Phase 6**: T043–T047 fully parallel; T051 and T052 parallel with T048.

## Implementation strategy

**MVP = Phase 1 + 2 + 3.** The website reads one honest snapshot. Combined with 001's MVP,
that is the first end-to-end proof that the seam works: a real turn on the PC, reported
truthfully to the cloud.

**Then US2 before US3 before US4** — the security boundary before convenience before
accounting. US2 is the write path; nothing else should exist before it is provably safe.

**Stop and prove after Phase 4.** Issac should see a command he issued on the website run on
his PC, and see a forged one refused.
