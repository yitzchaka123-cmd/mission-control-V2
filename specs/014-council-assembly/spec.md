# Feature Specification: The Council and the Weekly Assembly

**Feature Branch**: `014-council-assembly`
**Created**: 2026-09-09
**Status**: Draft
**Covers**: FEATURES §3.10 · Depends on: 001, 003, 005, 006, 007

## Why this feature exists

The mini-parliament — Issac's own original idea. Several room leads sit at one table with
Maria as chair, argue a question through their **own real sessions**, and hand him a
recommendation he can approve, reject or send back.

## User Scenarios & Testing

### User Story 1 — Real leads, arguing for real (Priority: P1)

Issac convenes four leads on a question. Each answers from its own session with its own
briefing and personality. They quote each other and disagree.

**Why this priority**: If the leads are simulated in one session, the Council is theatre.

**Independent Test**: Convene three leads, ask a question, and confirm three distinct
sessions produced three answers with their own briefings and token growth.

**Acceptance Scenarios**:
1. **Given** picked leads (minimum 2, any room including system rooms), **When** convened,
   **Then** each answers through its **own** session (001 FR-007), with Maria as chair.
2. **Given** a thread, **When** rendered, **Then** messages are numbered, the owner's carry a
   🎭 "as <lead>" badge when speaking as one, and lead messages support **[REPLY: n]** quotes
   and a ⚖️ round badge.
3. **Given** a disagreement, **When** detected, **Then** an inline "⚖️ Launch a debate about
   this?" chip is offered.
4. **Given** a debate, **When** run, **Then** a floor manager drives convergence, the
   challenged lead answers first, and there are no fixed rounds.
5. **Given** routing, **When** a room is named, **Then** only it answers — typo-tolerant;
   "everyone" addresses the table; otherwise leads may pass silently, and the UI says
   "Nobody had anything to add".
6. **Given** a lead's own room, **When** it is the speaker, **Then** it never answers itself.

---

### User Story 2 — It cannot run away with his money or his day (Priority: P1)

The debate is long. At twenty messages the Council stops and asks whether to continue.

**Acceptance Scenarios**:
1. **Given** **20 messages**, **When** reached, **Then** a guard card offers "Keep going +20"
   or "Wrap it up now".
2. **Given** an ongoing debate, **When** every **10** messages pass, **Then** Maria sends one
   phone ping that it is still debating.
3. **Given** the PC is asleep, **When** it happens mid-session, **Then** the Council pauses
   honestly with a Continue action — it does not invent turns.
4. **Given** a lead is still thinking, **When** others are ready, **Then** the table does not
   stall.

---

### User Story 3 — The table reaches a verdict he owns (Priority: P2)

**Acceptance Scenarios**:
1. **Given** a wrap-up, **When** the chair produces it, **Then** it carries a recommendation
   with Approve / Reject / Send back and a verdict-coloured decision ribbon.
2. **Given** approval, **When** given, **Then** it is the **closing move** of the session;
   reject and send-back keep it open.
3. **Given** the wrap-up, **When** it lands, **Then** each lead's stance goes to memory
   (tagged to its room plus an office-wide record) and Maria is notified.
4. **Given** the right panel, **When** viewed, **Then** it shows Sessions history (live and
   past, with reopen-and-continue that continues the numbering), **Points agreed** (rewritten
   every 3 spoken messages, editable), the **⚖️ Odds board** (2–8 candidate verdicts with
   live normalised bars, hoverable and pinnable), the Verdict card, and **what this council
   consumed** from real per-speaker figures.

---

### User Story 4 — The Weekly Assembly (Priority: P3)

**Acceptance Scenarios**:
1. **Given** Thursday night, **When** the Assembly runs, **Then** it plays as a slideshow:
   an intro with Issac at the head, one slide per lead presenting its **real** week
   (finished, score, plate), Maria moderating, and a wrap-up with real counts.
2. **Given** the in-office Assembly Bell, **When** rung, **Then** it convenes the Assembly
   (015).

### Edge Cases

- A lead's room is deleted mid-session → its prior messages remain; it stops contributing,
  and the thread says why.
- Two leads answer simultaneously → both are recorded in arrival order with correct numbering.
- A session is reopened after archive → numbering continues, and the odds board is restored.
- Every lead passes → "Nobody had anything to add", not an empty screen.

## Requirements

### Functional Requirements

- **FR-001**: Each participating lead MUST answer through its own Hermes session.
- **FR-002**: Minimum two leads; all rooms including system rooms are valid.
- **FR-003**: Messages MUST be numbered, quotable via [REPLY: n], and badged by round.
- **FR-004**: A credit guard MUST trigger at **20 messages**; points are rewritten every
  **3** spoken messages; a phone ping every **10**.
- **FR-005**: The odds board MUST support 2–8 candidate verdicts, normalised to 100, with
  live bars, hover detail and pinning, carried through archive and reopen.
- **FR-006**: Wrap-up MUST offer Approve / Reject / Send back; approve closes the session.
- **FR-007**: Stances MUST be written to memory tagged per room plus office-wide (009).
- **FR-008**: "Take to Council" from a task MUST pre-pick the room and pre-type the question
  (007 FR-006).
- **FR-009**: Consumption figures MUST come from real per-speaker growth, and MUST say
  honestly when the PC has not reported (012).
- **FR-010**: Routing MUST be typo-tolerant and MUST allow silent passes.
- **FR-011**: Sessions MUST be archivable and reopenable with continuous numbering.
- **FR-012**: The Weekly Assembly MUST present each lead's real week; it MUST NOT invent a
  score or a recap.
- **FR-013**: Offline behaviour MUST pause honestly and never fabricate a lead's turn.

### Key Entities

- **Council session** — id, participants, chair, state (open | closed), messages[], verdict.
- **Message** — number, speaker, text, replies-to, round, pass flag.
- **Odds entry** — candidate verdict, live weight, pinned.
- **Points agreed** — chair-maintained list, editable by the owner.

## Success Criteria

- **SC-001**: Every lead's contribution traces to its own session's token growth — proof the
  table is real.
- **SC-002**: No session exceeds the guard without the owner's explicit continue.
- **SC-003**: Odds always total 100 and survive archive and reopen.
- **SC-004**: Approving a verdict closes the session and is recorded as the closing move.
- **SC-005**: The Assembly contains no invented week — every figure traces to real tasks.

## Assumptions

- The Council is a Tier 3 feature and is built after the seam and the board are proven.
- Full 3D staging of the Assembly is specced in 015 and scheduled with the office.
- A single speech-to-text service for the mic beside the input is parked.
