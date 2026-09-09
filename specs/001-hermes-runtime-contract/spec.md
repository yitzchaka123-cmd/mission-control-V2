# Feature Specification: Hermes runtime contract

**Feature Branch**: `001-hermes-runtime-contract`
**Created**: 2026-09-09
**Status**: Draft — no open questions
**Covers**: FEATURES §2.7, §2.9, §2.10, §6.6 · Ripples R2, R6, R7, R8
**Depends on**: nothing. This is the foundation.

## Why this feature exists

v1's central failure was not a bug. Mission Control was welded to fourteen separate
OpenClaw subsystems, none of which it owned, could test, or could fix. The audit's
headline findings all trace to it: *"the office never reads OpenClaw"*, *"per-room agents
don't exist live"*, *"the whole memory / rules / org machinery has never run live"*.

This feature replaces all fourteen with **one seam**: a small, versioned service the app
talks to, and nothing else that runs agents. It is Constitution Principle IV.

## User Scenarios & Testing

### User Story 1 — An agent answers (Priority: P1)

Issac types a message to a room lead. The lead answers, in that room's own session, with
its briefing and personality carried in. Nothing about which vendor or model produced the
answer leaks into the screen.

**Why this priority**: If this does not work, nothing else in the product matters. It is
the whole product in one turn.

**Independent Test**: Send one message to one room and receive one grounded reply, with
the turn's events observable from start to finish.

**Acceptance Scenarios**:
1. **Given** Hermes is running and healthy, **When** a turn is submitted for
   `hermes:room:<slug>`, **Then** the reply returns on that session and the session's
   token count increases.
2. **Given** a turn is in flight, **When** the caller subscribes to its events, **Then**
   `turn.started`, any `tool.called`, `text.delta` and exactly one terminal `turn.ended`
   arrive in order.
3. **Given** a turn produced no text and delivered nothing, **When** it ends, **Then**
   `turn.ended{status:"empty"}` is reported — never inferred by the caller.
4. **Given** the same session key is used again, **When** a second turn runs, **Then** it
   continues the same conversation.

---

### User Story 2 — The office degrades honestly (Priority: P1)

Hermes cannot reach Telegram. The phone-mirror row is visibly locked and says why, in
plain words. Nothing silently fails, and nothing pretends to work.

**Why this priority**: Constitution Principle I is non-negotiable, and it is unenforceable
without a machine-readable statement of what the runtime can actually do.

**Independent Test**: Start Hermes with a capability absent; confirm every UI that depends
on it locks with a reason rather than erroring or faking.

**Acceptance Scenarios**:
1. **Given** `capabilities[]` omits `channels.telegram`, **When** any screen renders a
   Telegram control, **Then** it is locked with a plain reason and is not clickable.
2. **Given** a capability is present, **When** its probe fails, **Then** it is reported
   degraded — not absent, and not healthy.
3. **Given** Hermes is unreachable entirely, **When** any screen loads, **Then** it says
   the office computer cannot be reached and shows no invented values.

---

### User Story 3 — Rooms and workers are just sessions (Priority: P2)

Maria adds a department. It gets its own agent immediately. A worker hired into it gets
its own session inside that room. No migration, no flip, no reconciliation.

**Why this priority**: v1 built this and never dared run the flip (§2.9). Under Hermes it
is free, and it unblocks the roster, the Council and per-room cost.

**Independent Test**: Create a department, send it a message, hire a worker, send the
worker a message — all without restarting Hermes.

**Acceptance Scenarios**:
1. **Given** a new department, **When** it is created, **Then** `hermes:room:<slug>`
   accepts a turn with no setup step.
2. **Given** a worker is hired, **When** it is messaged, **Then**
   `hermes:room:<slug>:w:<worker>` answers on its own session.
3. **Given** a room is renamed, **When** the rename lands, **Then** the session's history
   follows it.

---

### User Story 4 — Nothing outward happens without the gate (Priority: P1)

An agent tries to send an email. Hermes stops, and an Approval appears. The agent cannot
route around it, because the gate is inside the thing executing the tool.

**Why this priority**: Constitution Principle V. v1 designed this gate, built its UI, and
recorded honestly that engine enforcement was **⬜ never built** — so it was decoration.

**Independent Test**: Set a power to *Ask*, have an agent invoke it, confirm no side effect
occurred and an approval is pending.

**Acceptance Scenarios**:
1. **Given** a power set to **Off**, **When** an agent calls it, **Then** the call is
   blocked and the agent is told plainly.
2. **Given** a power set to **Ask**, **When** an agent calls it, **Then** nothing happens
   outwardly and an approval is raised.
3. **Given** a power set to **Ask-when-it-costs-money**, **When** a free action is called,
   **Then** it runs; **When** a money action is called, **Then** it asks.
4. **Given** an approval is granted, **When** the action resumes, **Then** it executes once
   and is logged.
5. **Given** any outward action of any kind, **When** it executes, **Then** it is logged
   with actor, session, power and outcome — including for a Lead.

---

### User Story 5 — Schedules run where the office lives (Priority: P3)

A recurring job fires on time, appears on the Calendar grid, can be run by hand, and holds
still on Shabbos.

**Why this priority**: v1 could not do any of these four because the scheduler belonged to
the vendor (R8). It unblocks triggered playbooks and closes a real halachic gap.

**Independent Test**: Register a job, watch it fire, run it by hand, and confirm it is
withheld inside the Shabbos window.

**Acceptance Scenarios**:
1. **Given** a registered job, **When** its time arrives, **Then** it runs once and reports.
2. **Given** the Shabbos window is active and the job is not urgent, **When** its time
   arrives, **Then** it is held and the hold is logged.
3. **Given** a job is listed, **When** *Run now* is pressed, **Then** it runs immediately.

### Edge Cases

- Hermes restarts mid-turn → the turn ends `turn.ended{status:"interrupted"}`; the caller
  never sees a hung turn.
- Two turns submitted on one session key → serialised, never interleaved.
- A tool call blocks on approval and the approval never comes → the turn ends
  `status:"awaiting-approval"` and the task stays In Progress; no phantom completion.
- The event stream drops mid-turn → the terminal state is recoverable by polling the turn.
- Clock skew between PC and cloud → signed commands use the 2-minute freshness window; a
  skewed clock is reported as a health problem, not a mysterious failure.
- A capability disappears between handshake and use → treated as degraded, and the UI
  re-locks without a page reload.

## Requirements

### Functional Requirements

- **FR-001**: Hermes MUST expose `GET /hermes/hello` returning `{version, capabilities[], brains[]}`.
- **FR-002**: Hermes MUST expose `POST /hermes/turn` running one turn on a session key,
  accepting message text, an assembled briefing block, a model and a thinking level.
- **FR-003**: Hermes MUST expose `GET /hermes/sessions` — live sessions with id, label,
  model, lifetime token count and age.
- **FR-004**: Hermes MUST expose `GET /hermes/health` — service state, heartbeat, and a
  per-capability probe result.
- **FR-005**: Hermes MUST expose `POST /hermes/secrets` to write a secret. Secrets MUST NOT
  be readable back through any endpoint.
- **FR-006**: Hermes MUST emit an ordered event stream per turn: `turn.started`,
  `tool.called`, `text.delta`, and exactly one terminal `turn.ended{status}` where status
  is one of `ok | empty | error | interrupted | awaiting-approval`.
- **FR-007**: Session keys MUST follow `hermes:main` (Maria), `hermes:room:<slug>`,
  `hermes:room:<slug>:w:<worker>`, `hermes:police`. A room MUST require no provisioning
  step beyond first use.
- **FR-008**: Hermes MUST accept an assembled briefing with every turn — rulebook chapters,
  the agent's own page, its personality/mood line, and one office-status text (§2.7). One
  builder serves every channel.
- **FR-009**: Hermes MUST enforce the four-position power gate (Off · Ask ·
  Ask-when-it-costs-money · Free) **inside tool execution**. A blocked call MUST have no
  side effect.
- **FR-010**: Hermes MUST log every tool execution with actor, session, power, arguments
  summary and outcome.
- **FR-011**: Hermes MUST provide a scheduler that fires registered jobs, supports run-now,
  and honours a hold window supplied by the caller (Shabbos).
- **FR-012**: Hermes MUST act as an MCP client so agents can reach the memory engine (R9).
- **FR-013**: Hermes MUST declare absent capabilities rather than failing calls opaquely.
  Callers MUST be able to distinguish absent · degraded · healthy.
- **FR-014**: Hermes MUST serialise turns per session key.
- **FR-015**: Hermes MUST NOT expose a general "run anything" endpoint. The command surface
  is fixed and enumerable.
- **FR-016**: The contract MUST be versioned, and the version MUST be reported by `hello`.
- **FR-017**: Hermes MUST run on Windows as the owner's PC is Windows-only.
- **FR-018**: Hermes MUST run on the owner's **ChatGPT plan** as the primary brain —
  **flat rate, no API costs** (decided 2026-09-09). The fallback MUST be Claude on the Max
  plan. **Both lanes are flat-rate**; Hermes MUST NOT fall back to a metered API path, and
  an offer to "switch to API" MUST be declined.
- **FR-019**: Hermes MUST report the plan-login state as a first-class health value, with at
  least: signed in · expiring · signed out. A stale subscription login is a **normal,
  expected state**, not an outage, and MUST be explained plainly (017).
- **FR-020**: Because inference is flat-rate, Hermes MUST NOT treat thinking as a
  money action. The money gate applies to **real outward currency only** (008 FR-015).
- **FR-021**: Brains MUST remain selectable per room and per worker, and every selectable
  option MUST be flat-rate. A metered option MUST NOT appear in the picker.

### Key Entities

- **Capability** — a named ability (`channels.telegram`, `cron`, `mcp`, `browser`) with
  state absent · degraded · healthy, and a plain-language reason when not healthy.
- **Session** — a durable conversation addressed by session key; carries model, thinking
  level, lifetime tokens, age.
- **Turn** — one exchange on a session; emits events; ends in exactly one terminal status.
- **Power** — a named capability of a connection, carrying a gate position and a money flag.
- **Job** — a scheduled unit of work: schedule, target, enabled, last fired, holdable.

## Success Criteria

- **SC-001**: A message sent to any room returns a grounded reply on that room's own
  session, with no per-room setup step.
- **SC-002**: Every UI control that depends on a capability is either working or locked
  with a plain reason — zero controls fail silently or display invented data.
- **SC-003**: No outward action can occur without passing the gate. Attempting to bypass it
  produces a blocked call and a log line, not a side effect.
- **SC-004**: An empty or failed turn is always *reported* by Hermes, never inferred by the
  caller — v1's silent-turn watcher becomes unnecessary and is not built.
- **SC-005**: A department created in the UI is conversational within one turn, with no
  restart, migration or flip.
- **SC-006**: A scheduled job fires within one minute of its time, and is held during the
  Shabbos window with the hold visible in the log.
- **SC-007**: The app contains zero references to any vendor CLI. One seam, verifiable by
  grep in the proof gate (020).

## Assumptions

- Hermes runs on the owner's Windows PC alongside the bridge, started by Home Base (017).
- The PC is behind NAT; the cloud never connects inward. All cloud→PC traffic goes via 002.
- Milestone 1 needs only the five verbs, the event stream, the gate and the scheduler.
  Channels beyond Telegram, browser automation and helper programs are declared-absent
  capabilities (R3, R4).
- The roster lives in Mission Control's database, not in Hermes. Hermes has no opinion
  about who exists (R2).
- Secrets are write-only by design; the Vault UI (011) shows metadata, never values.

## Must not repeat (from the 2026-09-02 audit)

- *"the office never reads OpenClaw"* — the snapshot is the only source of runtime truth,
  and staleness is always visible.
- *"per-room agents don't exist live"* — impossible here: a room is a session namespace.
- *"every MCP registration other than supermemory is still unproven"* — a registration is
  not green until its probe passes.
- *"enforcement of grants on the engine ⬜"* — the gate lives in the executor or it does
  not exist.
