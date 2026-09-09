---

description: "Task list for 001-hermes-runtime-contract"
---

# Tasks: Hermes runtime contract

**Input**: Design documents from `/specs/001-hermes-runtime-contract/`
**Prerequisites**: [`plan.md`](./plan.md) ✅, [`spec.md`](./spec.md) ✅, `.specify/memory/constitution.md` ✅

**Tests**: **REQUIRED** for this feature. Not because the spec asked, but because the
constitution does — Principle II (Built ≠ Done) and the Build-and-Prove loop make a Done
Contract and proof mandatory before anything counts as finished.

**Organization**: Tasks are grouped by user story. Story order follows spec.md priority:
US1 (P1) → US2 (P1) → US4 (P1) → US3 (P2) → US5 (P3).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Paths follow the structure in plan.md: `hermes/src/…`, `hermes/tests/…`

---

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Write the Done Contract for this feature in `specs/001-hermes-runtime-contract/done-contract.md` — what will be demonstrated to Issac, and how — **written before any code**, naming what will be demonstrated to Issac and how (Constitution II)
**Purpose**: Get a Node/TypeScript service skeleton standing that ships to a Windows PC.

- [ ] T002 Create `hermes/` package at repo root with `package.json`, `tsconfig.json`, Node 22 engine pin, per plan.md Project Structure
- [ ] T003 [P] Configure Vitest in `hermes/vitest.config.ts` with `unit` and `contract` test projects
- [ ] T004 [P] Configure linting and formatting in `hermes/.eslintrc.json` and `hermes/.prettierrc`
- [ ] T005 [P] Add the vendor-coupling grep gate to `hermes/tests/architecture/no-vendor-outside-adapters.test.ts` — fails if any vendor product name appears outside `hermes/src/adapters/` (Constitution IV, spec SC-007)
- [ ] T006 Create the shared contract types in `hermes/src/contract/types.ts` (Capability, Session, Turn, TurnEvent, Power, Job) and emit them for the web app to import

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Prove the riskiest assumption, then lay the pieces every story needs.

**⚠️ CRITICAL**: No user story work begins until this phase is complete.

### The spike — blocks EVERYTHING (plan.md D3)

> This runs on **Issac's own Windows PC**, not in CI. It is throwaway code. Its only job is
> to answer four questions in writing before anything is built on top of them. If it fails,
> T012 switches the critical path to the Claude Max adapter — already proven on that PC
> since 2026-08-17 — and Milestone 1 continues unblocked.

- [ ] T007 Write the spike harness in `hermes/spike/plan-adapter-spike.mjs` — a throwaway script that attempts one non-interactive agent turn using the owner's ChatGPT plan
- [ ] T008 Run T007 on Issac's PC and answer **Q1: can a first-party runner sign in with the ChatGPT plan and complete a turn without interactive browser steps each time?** Record the answer in `specs/001-hermes-runtime-contract/research.md`
- [ ] T009 Answer **Q2: can a structured result be read (text, tool calls, completion status) rather than scraping console output?** Record verbatim sample output in `research.md`
- [ ] T010 Answer **Q3: what does an expired plan login look like from outside, and can it be detected cleanly?** Record the observable signal in `research.md`
- [ ] T011 Answer **Q4: do two concurrent sessions work, or is there a single-session limit?** Record in `research.md`
- [ ] T012 Write the go/no-go decision into `research.md`: proceed with `chatgpt-plan` as the critical-path adapter, or switch to `claude-max`. **Get Issac's sign-off on the decision before T013.**

### Core pieces every story needs

- [ ] T013 Define the `BrainAdapter` interface in `hermes/src/adapters/adapter.ts` per plan.md D2 (`id`, `login()`, `run()`, `capabilities()`)
- [ ] T014 Write the adapter contract test suite in `hermes/tests/contract/brain-adapter.test.ts` — the suite **every** adapter must pass, derived from T008–T011 findings
- [ ] T015 [P] Implement the session store in `hermes/src/sessions/store.ts` — durable on disk, keyed by session key, first-use creates (plan.md D4)
- [ ] T016 [P] Implement per-key turn serialisation in `hermes/src/sessions/queue.ts` (spec FR-014)
- [ ] T017 Implement the HTTP server skeleton in `hermes/src/server/index.ts` — binds `127.0.0.1` only, never a public interface
- [ ] T018 [P] Implement the DPAPI write-only secret store in `hermes/src/secrets/store.ts` — no read-back path exists in the API surface (spec FR-005, plan.md D7)
- [ ] T019 [P] Implement structured logging in `hermes/src/log.ts` with secret redaction **at the source**, not at display

**Checkpoint**: Foundation ready — the spike is answered and signed off, and user stories can begin.

---

## Phase 3: User Story 1 — An agent answers (Priority: P1) 🎯 MVP

**Goal**: A message sent to a room returns a grounded reply on that room's own session, with the whole turn observable from start to finish.

**Independent Test**: Send one message to one room, receive one grounded reply, and watch the full event sequence.

### Tests for User Story 1

> Write these FIRST and confirm they FAIL before implementing.

- [ ] T020 [P] [US1] Contract test for `POST /hermes/turn` in `hermes/tests/contract/turn.test.ts` — accepts session key, message, briefing block, model, thinking level
- [ ] T021 [P] [US1] Contract test for `GET /hermes/sessions` in `hermes/tests/contract/sessions.test.ts` — id, label, model, lifetime tokens, age
- [ ] T022 [P] [US1] Integration test in `hermes/tests/integration/turn-lifecycle.test.ts` — events arrive in order with exactly one terminal `turn.ended` (spec SC-001)
- [ ] T023 [P] [US1] Integration test in `hermes/tests/integration/turn-empty.test.ts` — a turn producing no text ends `status:"empty"`, **reported not inferred** (spec US1 scenario 3) (spec SC-004)
- [ ] T024 [P] [US1] Integration test in `hermes/tests/integration/session-continuity.test.ts` — a second turn on the same key continues the conversation

### Implementation for User Story 1

- [ ] T025 [P] [US1] Implement the turn event types in `hermes/src/events/types.ts` — `turn.started`, `tool.called`, `text.delta`, `turn.ended{ok|empty|error|interrupted|awaiting-approval}` (spec FR-006)
- [ ] T026 [US1] Implement the SSE event stream in `hermes/src/events/stream.ts` (plan.md D5)
- [ ] T027 [US1] Implement durable terminal-state storage in `hermes/src/events/terminal.ts` so a dropped stream is recoverable by polling (spec Edge Cases)
- [ ] T028 [US1] Implement the `chatgpt-plan` adapter in `hermes/src/adapters/chatgpt-plan/index.ts` against the T013 interface and the T008–T011 findings (spec FR-018 — flat rate, ChatGPT plan)
- [ ] T029 [US1] Implement `POST /hermes/turn` in `hermes/src/server/turn.ts` (spec FR-002)
- [ ] T030 [US1] Implement `GET /hermes/sessions` in `hermes/src/server/sessions.ts` (spec FR-003)
- [ ] T031 [US1] Implement the assembled-briefing pass-through in `hermes/src/server/briefing.ts` — rulebook chapters, agent page, mood line, one office-status text (spec FR-008)
- [ ] T032 [US1] Wire per-key serialisation (T016) into the turn path so two turns on one key never interleave
- [ ] T033 [US1] Handle mid-turn restart: emit `turn.ended{status:"interrupted"}` rather than stranding a turn (spec Edge Cases)

**Checkpoint**: An agent answers. This is the MVP of the whole rebuild.

---

## Phase 4: User Story 2 — The office degrades honestly (Priority: P1)

**Goal**: Every capability the runtime lacks is declared, so the UI locks it with a reason instead of failing or faking.

**Independent Test**: Start Hermes with a capability absent; confirm it is declared absent, not errored.

### Tests for User Story 2

- [ ] T034 [P] [US2] Contract test for `GET /hermes/hello` in `hermes/tests/contract/hello.test.ts` — returns `{version, capabilities[], brains[]}`
- [ ] T035 [P] [US2] Contract test for `GET /hermes/health` in `hermes/tests/contract/health.test.ts` — service state, heartbeat, per-capability probe results
- [ ] T036 [P] [US2] Integration test in `hermes/tests/integration/capability-states.test.ts` — absent · degraded · healthy are three distinguishable states (spec FR-013) (spec SC-002)
- [ ] T037 [P] [US2] Integration test in `hermes/tests/integration/login-expiry.test.ts` — an expired plan login is a **named state**, not an outage (spec FR-019)

### Implementation for User Story 2

- [ ] T038 [P] [US2] Implement the capability registry in `hermes/src/capabilities/registry.ts` with absent/degraded/healthy and a required plain-language reason
- [ ] T039 [P] [US2] Implement capability probes in `hermes/src/capabilities/probe.ts`
- [ ] T040 [US2] Implement `GET /hermes/hello` in `hermes/src/server/hello.ts` (spec FR-001, FR-016 version reporting)
- [ ] T041 [US2] Implement `GET /hermes/health` in `hermes/src/server/health.ts` (spec FR-004)
- [ ] T042 [US2] Implement plan-login state reporting (signed in · expiring · signed out) in `hermes/src/adapters/login-state.ts` (spec FR-019)
- [ ] T043 [US2] Handle a capability disappearing between handshake and use — report degraded, never crash (spec Edge Cases)

**Checkpoint**: The runtime tells the truth about itself. Principle I is now mechanically supported.

---

## Phase 5: User Story 4 — Nothing outward without the gate (Priority: P1)

**Goal**: An agent cannot cause an outward side effect without passing a gate it structurally cannot route around.

**Independent Test**: Set a power to *Ask*, have an agent invoke it, confirm zero side effects and one pending approval.

### Tests for User Story 4

- [ ] T044 [P] [US4] Integration test in `hermes/tests/integration/gate-off.test.ts` — an **Off** power is blocked with zero side effects (spec SC-003)
- [ ] T045 [P] [US4] Integration test in `hermes/tests/integration/gate-ask.test.ts` — an **Ask** power raises an approval and does nothing outwardly
- [ ] T046 [P] [US4] Integration test in `hermes/tests/integration/gate-money.test.ts` — **Ask-when-it-costs-money** runs a free action, asks on a money action
- [ ] T047 [P] [US4] Integration test in `hermes/tests/integration/gate-thinking-is-free.test.ts` — a turn **never** raises a money approval, however long (spec FR-020, 008 FR-016)
- [ ] T048 [P] [US4] Integration test in `hermes/tests/integration/gate-undeclared.test.ts` — a power with **no declared money flag defaults to money = true** (008 FR-017)
- [ ] T049 [P] [US4] Integration test in `hermes/tests/integration/gate-lead-not-exempt.test.ts` — a Lead is gated identically (Constitution V)

### Implementation for User Story 4

- [ ] T050 [US4] Implement the single tool-dispatch chokepoint in `hermes/src/gate/dispatch.ts` — **the only path a tool call can take** (plan.md D6, spec FR-009)
- [ ] T051 [US4] Implement gate-position resolution in `hermes/src/gate/resolve.ts` (Off · Ask · Ask-when-it-costs-money · Free) reading the power's declared money flag
- [ ] T052 [US4] Implement the `awaiting-approval` turn terminal state so a blocked turn ends honestly rather than hanging (spec Edge Cases)
- [ ] T053 [US4] Implement tool-execution logging in `hermes/src/gate/audit.ts` — actor, session, power, argument summary, outcome (spec FR-010)
- [ ] T054 [US4] Add an architecture test in `hermes/tests/architecture/gate-is-sole-path.test.ts` asserting no tool execution path bypasses `gate/dispatch.ts`
- [ ] T055 [US4] Verify the fixed command surface — assert no general "run anything" endpoint exists (spec FR-015)

**Checkpoint**: The money gate is real, not decoration. This is the failure v1 recorded honestly and never fixed.

---

## Phase 6: User Story 3 — Rooms and workers are just sessions (Priority: P2)

**Goal**: A new department is conversational immediately, with no provisioning, migration or flip.

**Independent Test**: Create a department, message it, hire a worker, message the worker — without restarting Hermes.

### Tests for User Story 3

- [ ] T056 [P] [US3] Integration test in `hermes/tests/integration/room-first-use.test.ts` — `hermes:room:<slug>` accepts a turn with no setup step (spec FR-007) (spec SC-005)
- [ ] T057 [P] [US3] Integration test in `hermes/tests/integration/worker-session.test.ts` — `hermes:room:<slug>:w:<worker>` answers on its own session
- [ ] T058 [P] [US3] Integration test in `hermes/tests/integration/room-rename.test.ts` — history follows a renamed room

### Implementation for User Story 3

- [ ] T059 [P] [US3] Implement session-key parsing and validation in `hermes/src/sessions/keys.ts` for the four shapes (`hermes:main`, `hermes:room:<slug>`, `hermes:room:<slug>:w:<worker>`, `hermes:police`)
- [ ] T060 [US3] Implement first-use room creation in `hermes/src/sessions/store.ts` — no provisioning step (plan.md D4)
- [ ] T061 [US3] Implement session rename/migration-free key remapping in `hermes/src/sessions/rename.ts`
- [ ] T062 [US3] Confirm Hermes holds **no roster** — add `hermes/tests/architecture/no-roster.test.ts` asserting no agent registry exists (ripple R2, spec Assumptions)
- [ ] T063 [US3] Handle concurrent session limits found in T011 — queue through the serialiser rather than failing (spec Edge Cases)

**Checkpoint**: Per-room agents work live. v1's never-run flip is retired by construction.

---

## Phase 7: User Story 5 — Schedules run where the office lives (Priority: P3)

**Goal**: A job fires on time, can be run by hand, and holds still on Shabbos.

**Independent Test**: Register a job, watch it fire, run it by hand, confirm it is withheld inside a hold window.

### Tests for User Story 5

- [ ] T064 [P] [US5] Integration test in `hermes/tests/integration/scheduler-fires.test.ts` — a job runs once within a minute of its time
- [ ] T065 [P] [US5] Integration test in `hermes/tests/integration/scheduler-hold.test.ts` — a non-urgent job inside a hold window is held **and the hold is logged** (spec SC-006)
- [ ] T066 [P] [US5] Integration test in `hermes/tests/integration/scheduler-run-now.test.ts` — Run now executes immediately

### Implementation for User Story 5

- [ ] T067 [P] [US5] Implement durable job state in `hermes/src/scheduler/store.ts`
- [ ] T068 [US5] Implement the fire loop in `hermes/src/scheduler/loop.ts` (spec FR-011)
- [ ] T069 [US5] Implement caller-supplied hold windows in `hermes/src/scheduler/hold.ts` — **Hermes stays ignorant of the Jewish calendar**; 013 supplies the window (plan.md D8)
- [ ] T070 [US5] Implement run-now in `hermes/src/scheduler/run-now.ts`
- [ ] T071 [P] [US5] Implement the MCP client in `hermes/src/mcp/client.ts` for the memory engine (spec FR-012)
- [ ] T072 [US5] Implement MCP probe-before-register in `hermes/src/mcp/register.ts` — **never green until the probe passes** (spec FR-010 of 009)
- [ ] T073 [US5] Register `cron` and `mcp` as declared capabilities so their absence locks the UI honestly

**Checkpoint**: All five user stories independently functional.

---

## Phase 8: Polish & Cross-Cutting Concerns

- [ ] T074 [P] Implement the `claude-max` fallback adapter in `hermes/src/adapters/claude-max/index.ts` and pass the T014 contract suite (spec FR-018 — the flat-rate fallback)
- [ ] T075 [P] Assert brain-picker options are all flat-rate in `hermes/tests/unit/brains-are-flat-rate.test.ts` — a metered option must not appear (spec FR-021)
- [ ] T076 [P] Handle clock skew as a **named health problem** in `hermes/src/server/health.ts` (spec Edge Cases, 002 alignment)
- [ ] T077 [P] Write the Windows service install/start/stop scripts in `hermes/scripts/`
- [ ] T078 [P] Write `hermes/README.md` — what Hermes is, the five verbs, and how to add an adapter
- [ ] T079 Add this feature's 👁 verify items to the owner's verify list (Constitution II — only Issac closes them)
- [ ] T080 Delete `hermes/spike/` — the spike was throwaway and its findings live in `research.md`

---

## Dependencies

**Story completion order**: US1 → US2 → US4 → US3 → US5 (spec.md priority order)

```
Phase 1 Setup (T002–T006)
        ↓
Phase 2 Foundational (T007–T019)
        ⚠ T007–T012 = THE SPIKE. Blocks everything. Needs Issac's PC and sign-off.
        ↓
Phase 3 US1  ← 🎯 MVP. Everything below depends on a turn actually running.
        ↓
   ┌────┴────┬─────────┐
Phase 4    Phase 5   Phase 6      (US2, US4, US3 are independent of each other)
  US2        US4       US3
   └────┬────┴─────────┘
        ↓
Phase 7 US5 (scheduler + MCP)
        ↓
Phase 8 Polish
```

**Hard blockers**:
- T012 (spike sign-off) blocks T013 and everything after.
- T013 (adapter interface) blocks T028 and T074.
- T025–T027 (events) block T029.
- T050 (chokepoint) blocks T051–T055.

## Parallel execution examples

**Phase 2** — after T012 sign-off: T015, T018, T019 run in parallel (different files, no shared deps).
**Phase 3** — T020–T024 (all tests) in parallel; then T025 alone; then T029–T031 in parallel.
**Phase 4** — T034–T037 in parallel; T038 and T039 in parallel.
**Phase 5** — T044–T049 (all six gate tests) fully parallel.
**Phase 8** — T074–T078 all parallel.

## Implementation strategy

**MVP = Phase 1 + Phase 2 + Phase 3.** At that point one agent answers on its own session
through Hermes, with the whole turn observable. That is the seam proven, and it is the
smallest thing worth showing Issac.

**Then, in order of what protects him**: US2 (honesty) before US4 (the gate) before US3
(rooms) before US5 (schedules). US2 first because Principle I is unenforceable without
declared capabilities, and every later screen depends on it.

**Stop and prove after Phase 3.** Do not start Phase 4 until Issac has seen an agent answer
on his own machine. That is Principle II, and skipping it is exactly how v1 accumulated 421
findings before anyone pressed a control.
