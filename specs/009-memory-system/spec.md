# Feature Specification: The memory system

**Feature Branch**: `009-memory-system`
**Created**: 2026-09-09
**Status**: Draft
**Covers**: FEATURES §2.5, §2.4 (memory half), §3.12, §11 · Ripple R9 · Depends on: 001, 002, 003, 005

## Why this feature exists

One brain for the whole office, visible and editable, where "forget" actually works and
nothing leaks across the Personal wall. The Master Memory Plan was sealed on 2026-08-21
after 46 locked picks — this spec carries it forward intact.

The Hermes swap barely touches it (R9). The one new requirement is that Hermes must be an
MCP client so agents can reach the memory engine themselves.

## User Scenarios & Testing

### User Story 1 — Remember and forget both work, everywhere (Priority: P1)

Issac says "remember that Tzvi prefers WhatsApp". It lands on the right floor with a
receipt. Later he says "forget that" and it is gone from every copy.

**Why this priority**: A memory you cannot delete is a liability, and one that silently
fails to save is worse than none.

**Independent Test**: Save a fact in each channel; confirm floor, stamp and receipt. Forget
it; confirm it is gone from browser, cloud and engine, and recoverable from trash for 30 days.

**Acceptance Scenarios**:
1. **Given** "remember this" in any chat, **When** said, **Then** it lands on the correct
   floor and a one-line receipt is shown.
2. **Given** any save, **When** written, **Then** it is stamped `{floor, author, room/agent}`.
3. **Given** any read, **When** performed, **Then** it is filtered by the reader's doors.
4. **Given** "forget that", **When** said, **Then** **one** delete removes every copy —
   browser, cloud and engine — and lands in a **30-day** trash.
5. **Given** trash, **When** Rescue is used, **Then** the memory is restored everywhere
   including the engine.
6. **Given** a superseding fact, **When** saved, **Then** the new fact is dated and the old
   is stamped "was true until <date>" and appears in Changes — never silently overwritten.

---

### User Story 2 — Personal stays walled (Priority: P1)

Issac's medical paperwork is discussed with Aaron. No business room can see it, and Maria
refuses to bridge it.

**Why this priority**: The wall is a promise about his private life. A leak is
unrecoverable.

**Independent Test**: Write to the Personal Vault; attempt to read it as Maria, as a room
lead, and as the police. Confirm three refusals and one honest offer.

**Acceptance Scenarios**:
1. **Given** the Personal Vault, **When** written, **Then** only **Aaron and Issac** may write.
2. **Given** Maria, **When** she encounters a Personal need, **Then** she refuses to bridge it
   and offers **one-time access** instead — she requests, Issac approves, it is used for that
   one task, and it closes itself.
3. **Given** the door matrix, **When** enforced, **Then**: Aaron opens everything · Maria
   everything but the Vault · Police read all business · managers, workers and Dexter get
   office + own room + own drawer and must knock for the rest, with the knock logged.
4. **Given** enforcement, **When** it happens, **Then** it happens **in code**, not by prompt.

---

### User Story 3 — He can see what it knows (Priority: P2)

**Acceptance Scenarios**:
1. **Given** the Memory screen, **When** loaded, **Then** views Map · Notes · Journals ·
   Trash · Changes are available with scope chips (Everything · Office-wide · one per room).
2. **Given** the Map, **When** opened, **Then** both modes work: **Universe** (physics
   galaxies, aging states, typed edges, fly-through) and **Ball** (room hubs in room colours,
   hexagons for memories, squares for documents, a **gradient of both colours** for a memory
   shared by two rooms, a legend, Fit/Center/zoom, tag filters, 2D⟷3D, keyboard control, and
   a "Who holds what" ownership panel).
3. **Given** a memory is opened, **When** viewed, **Then** it shows full text, source, date,
   room, and a **Forget this** action that deletes every copy.
4. **Given** the memory engine is off, **When** the screen loads, **Then** a red banner
   distinguishes "not connected" from "key saved but not answering" and states how many
   notes are waiting.
5. **Given** device-only facts, **When** sync runs, **Then** they are pushed once, deduped by
   normalised text, and queued when the PC is asleep.

---

### User Story 4 — Memory can move house (Priority: P3)

**Acceptance Scenarios**:
1. **Given** the Mover in Settings, **When** run, **Then** it copies every memory with its
   tags to the target, **counts both sides**, and **deletes nothing** until confirmed.

### Edge Cases

- Two rooms share a fact → it lives in both scopes and renders as a colour gradient.
- The engine is unreachable at save → the fact is queued locally and the count is shown; it
  is never reported as saved.
- A retired agent's drawer → frozen into the Archive, readable, never deleted.
- Conflicting facts → both kept, the newer one leading, and the conflict visible in Changes.
- More than 200 memories in a view → paged; never truncated silently.

## Requirements

### Functional Requirements

- **FR-001**: Three shelves MUST exist: **the Library** (cloud engine — facts, learnings,
  rulebook copy, done-task summaries, conversation summaries, journal index) · **the Filing
  Cabinet** (database — tasks, approvals, rulebook master, live status, queried live and
  never copied) · **the Recorder** (journals and transcripts, verbatim).
- **FR-002**: Five floors MUST be enforced **in code**: Personal Vault (sealed container) ·
  Office Floor · Room Shelves · Agent Drawers · the Archive.
- **FR-003**: The door matrix MUST be as stated in User Story 2, with knocks logged.
- **FR-004**: Every save MUST be stamped and every read filtered.
- **FR-005**: "Forget" MUST be a single action that removes every copy and lands in a
  **30-day** trash with Rescue and Empty-now (confirmed).
- **FR-006**: Superseding MUST date the new fact and mark the old "was true until <date>",
  surfaced in a Changes view.
- **FR-007**: The end of every conversation MUST write a dated summary to the Library with a
  pointer to the recording; every done task MUST write a dated note.
- **FR-008**: There MUST be exactly **one** memory brain. No separate memory helper setting.
- **FR-009**: Hermes MUST register the memory engine over MCP, and the "rooms can use it ·
  n tools" pill MUST reflect the actual registration and probe result (R9).
- **FR-010**: Registration MUST NOT show green until its probe passes.
- **FR-011**: The Map MUST provide both Universe and Ball modes as described, with the
  shared-memory colour gradient and the ownership panel.
- **FR-012**: The Notes view MUST include the "What Maria knows about me" profile (about me ·
  family · work · how I like things · notes) with silent autosave, fed into Maria's prompt.
- **FR-013**: The Journals view MUST read the PC's journal files on demand.
- **FR-014**: The Mover MUST copy with tags, count both sides, and delete nothing until
  confirmed.
- **FR-015**: The engine key MUST be stored properly on the PC via Hermes secrets — v1
  deferred this to a Phase-4 gate (R9).
- **FR-016**: The in-world Memory Bookcase MUST open this screen with real data (015).

### Key Entities

- **Memory fact** — text, floor, room(s), agent, author, saved-at, version, supersede chain.
- **Floor** — the access scope; enforced in code with a reader/writer matrix.
- **Journal** — per-day and per-agent-pair verbatim record with door markers.
- **Trash entry** — a deleted memory with its 30-day expiry and full restore payload.

## Success Criteria

- **SC-001**: A forget removes the fact from browser, cloud **and** engine — verified in all
  three, not asserted.
- **SC-002**: No business room can read a Personal Vault item by any path, including via
  Maria, the police or a knock.
- **SC-003**: Every fact on screen carries a real floor, author and date; none are invented.
- **SC-004**: The Mover leaves both sides intact and counted, with nothing deleted.
- **SC-005**: The engine-connected pill is green only when a probe has actually passed.
- **SC-006**: The B1–B10 machinery **runs live** — v1's largest untested block.

## Assumptions

- The engine is hosted for now; the local binary is Mac/Linux-only, and the Mover brings it
  home later.
- Personal uses its own sealed container, separate from the business container.
- Per-agent memory layers, editable fact text and engine-side conflict rules are specced
  here but scheduled after Milestone 1.

## Must not repeat (from the 2026-09-02 audit)

*The whole memory/rules/org machinery (B1–B10) never ran live · the cluster graph hidden
behind a "Ball" toggle · every MCP registration but one unproven · the memory key with no
proper storage on the PC.*
