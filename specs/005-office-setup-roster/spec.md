# Feature Specification: Office setup, roster and the career ladder

**Feature Branch**: `005-office-setup-roster`
**Created**: 2026-09-09
**Status**: Draft
**Covers**: FEATURES §1.1–1.6, §3.3, §3.22 · Ripple R2 · Depends on: 001, 003

## Why this feature exists

This is where the office becomes *his*. Departments, the people in them, how they are hired,
promoted, retired and rehired, and the personality engine that makes them feel alive.

Under Hermes a room **is** a session namespace (R2), so v1's dread project — one agent per
room, *built but the flip was never run* — evaporates. Rooms are conversational the moment
they exist.

## User Scenarios & Testing

### User Story 1 — Maria builds the office by talking (Priority: P1)

First run. Maria walks in, introduces herself, and interviews Issac. At the end he has real
departments with real leads, and the office preview beside her fills in as they talk.

**Independent Test**: Complete the wizard from empty; confirm every department is real,
addressable and staffed.

**Acceptance Scenarios**:
1. **Given** a first visit, **When** the app opens, **Then** Maria's walk-in intro plays
   once — she walks in, turns, waves, and a speech bubble types her greeting.
2. **Given** the wizard, **When** Issac gives his name, departments, leads, personalities
   and CEO-room vibe, **Then** each is saved and reflected live in the preview beside it.
3. **Given** the wizard completes, **When** the office opens, **Then** every department is
   in the rail, on the 3D floor, and answers a message with no further setup **(R2)**.
4. **Given** a department is removed during setup, **When** removed, **Then** the personality
   engine registers it as a firing event.
5. **Given** the wizard is re-entered, **When** "Edit my setup" is used, **Then** existing
   choices are preserved, not reset.

---

### User Story 2 — Hire, promote, retire, rehire (Priority: P1)

Issac adds a worker to a room. Later he promotes one, retires another, and brings her back —
and she remembers everything.

**Why this priority**: "Fired ≠ deleted" is one of the product's defining ideas, and the
thing that makes the office feel like a place rather than a list.

**Independent Test**: Hire → promote → retire → rehire one worker; verify memory, rulebook
page, personality and journals survive the round trip.

**Acceptance Scenarios**:
1. **Given** any new or spawned worker, **When** created, **Then** it is born **Intern**.
2. **Given** an Intern, **When** it acts, **Then** every action needs a nod; a **Specialist**
   is free inside its lane; a **Lead** is full and may guide, propose hires and delegate.
3. **Given** a promotion, **When** a manager proposes it, **Then** Maria approves and Issac
   is told; Issac's own dropdown overrides either.
4. **Given** a retire, **When** confirmed, **Then** the worker's memory drawer, rulebook
   page, personality and pair-journals are **frozen into the Archive, never deleted**, and
   the worker stays visible on the dashboard as retired.
5. **Given** a rehire, **When** requested, **Then** the AI argues "experience vs fresh eyes"
   out loud and Issac decides; on rehire everything is restored and the worker's **own 3D
   character** is reused.
6. **Given** a temp worker, **When** marked, **Then** it carries a ⏳ TEMP tag; "Make
   permanent" clears it on the same id; retire keeps it; rehire returns the same still-temp
   worker.
7. **Given** spawning, **When** attempted, **Then** it is gated by a global "ask me first"
   default plus a per-department override.

---

### User Story 3 — Every worker has a mood that reacts to real events (Priority: P2)

A room lead is praised. Her mood lifts, and it shows in how she writes for the rest of the day.

**Independent Test**: Trigger each event type; confirm mood moves, colleagues react, and the
mood line reaches the briefing.

**Acceptance Scenarios**:
1. **Given** the six personalities (warm · precise · energetic · workhorse · creative ·
   wise), **When** one is assigned, **Then** it shapes that agent's voice consistently.
2. **Given** a real event (praised · task done · sent back · fired · colleague fired · hired
   · promoted), **When** it occurs, **Then** mood moves and the change is logged in the
   experience log.
3. **Given** a colleague is fired, **When** it happens, **Then** other workers react
   according to their temper.
4. **Given** any turn, **When** the briefing is assembled, **Then** the current mood line is
   included **(001 FR-008)**.

---

### User Story 4 — The department workspace is where work actually happens (Priority: P2)

**Acceptance Scenarios**:
1. **Given** a room, **When** opened, **Then** chat is the big centre thing, with the lead
   and each hired worker as its own live tab on its own session.
2. **Given** the room header, **When** a brain and thinking level are chosen, **Then** they
   persist per room and are sent with every message and task.
3. **Given** the "Right now" panel, **When** viewed, **Then** it shows the work strip, alerts,
   the plate (≤4 + "+n more"), last reported, health reasons, Goals, Scratchpad and Crew.
4. **Given** History, **When** filtered by worker (including retired), stage, period or text,
   **Then** results persist per room and expand to the full story.

### Edge Cases

- A department is renamed → sessions, colours, tasks, journals and 3D room follow it.
- Two departments given the same name → refused with a plain reason.
- A worker retired while holding an in-progress task → the task returns to the room, and the
  history says who dropped it and why.
- System rooms → always present, never removable, valid everywhere a room can be picked.
- Setup abandoned midway → nothing half-saved; the wizard resumes where it left off.

## Requirements

### Functional Requirements

- **FR-001**: The wizard MUST be Maria-led and chat-styled: name → departments (with a
  business-type chip) → people (lead name + personality) → CEO room vibe → office layout
  choice → done, with a live office preview throughout.
- **FR-002**: Maria's walk-in intro MUST play once, never auto-show twice, and be replayable
  from the sidebar.
- **FR-003**: System rooms MUST always exist and never be removable: Office Management
  (Maria, biggest) · Development (Dexter) · Maintenance (Max) · Police Station (Stone,
  Barak) · the CEO Office (Aaron, with a vibe).
- **FR-004**: Nine business types MUST be selectable, each furnishing its room with fitting
  props and a colour: photography · retail · software · content · education · food ·
  services · personal · general. System types: management · devroom · maintroom · police.
- **FR-005**: Five CEO-room vibes MUST be selectable: Mission command · Cozy lounge · Arcade
  corner · Zen garden · Trophy room.
- **FR-006**: A lead-name pool MUST be offered (Pepper, Jarvis, Friday, Vision, Wanda, Fury,
  Quill, Loki, Hawk, Stark, Banner, Romanoff, Rogers, Strange, Parker, Rhodes, Danvers,
  Barton, Odin, Shuri).
- **FR-007**: The career ladder MUST be Intern → Specialist → Lead, with every new worker
  born Intern and spawning gated by a global default plus a per-department override.
- **FR-008**: Retire MUST freeze — never delete — the worker's memory drawer, rulebook page,
  personality and pair-journals into the Archive. Rehire MUST restore all of it.
- **FR-009**: A worker's 3D character MUST be 1:1 with the worker and reused on rehire.
- **FR-010**: Temp workers MUST carry a ⏳ tag with make-permanent, retire and rehire
  semantics as specified in User Story 2.
- **FR-011**: Six personalities MUST exist, with a living mood engine reacting to real
  events, colleague reactions by temper, trait drift and an experience log.
- **FR-012**: The department workspace MUST provide tabs Chat · Decisions · Schedules ·
  Review · History, plus the "Right now" panel.
- **FR-013**: Brain and thinking-level preferences MUST persist per room and be sent with
  every message and task.
- **FR-014**: Renaming Maria MUST ripple everywhere she is named.
- **FR-015**: The update ladder MUST hold: workers → manager (live) · manager → Maria
  ("boss update") · Maria → Issac (morning briefing). Phone pings **only** for approvals
  waiting · something broke · a police catch.
- **FR-016**: Room requests ("your rooms need N things": account · tool · skill · info)
  MUST be raised, listed and closable.

### Key Entities

- **Department/Room** — name, slug, business type, colour, lead, worker count, status, system flag.
- **Worker** — id, room, name, role, autonomy, status (active | paused | retired), hired/retired
  timestamps, temp flag.
- **Personality** — archetype, per-name fingerprint, live mood, trait drift, experience log.
- **Room request** — kind (account | tool | skill | info), text, state.

## Success Criteria

- **SC-001**: A department created in the wizard is conversational, visible in the rail and
  standing on the 3D floor without a reload or a migration.
- **SC-002**: A retire → rehire round trip restores memory, rulebook page, personality,
  journals and the same 3D character — provably, item by item.
- **SC-003**: No worker anywhere is born above Intern.
- **SC-004**: Every mood change traces to a real logged event; none are invented.
- **SC-005**: Renaming a room or Maria leaves no stale name anywhere in the product.

## Assumptions

- The roster is Mission Control's data; Hermes has no opinion about who exists (R2).
- Workers are light sessions inside their room's agent, promoted to a full agent when they
  earn their own tools.
- Aaron runs Personal behind a hard wall; only Aaron and Issac may write to the Personal
  Vault (see 009, 011).

## Must not repeat (from the 2026-09-02 audit)

*"Chat with Aaron" is a dead end · real workers render as plain capsules · no Police room
and no Maintenance desk on the live floor · four Settings cards (Agents & autonomy,
Guardrails, Spawn governance, Brain & models) that save nothing · comments and decisions
never reaching the agent and all signed "Issac".*
