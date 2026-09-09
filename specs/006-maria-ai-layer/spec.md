# Feature Specification: Maria and the AI layer

**Feature Branch**: `006-maria-ai-layer`
**Created**: 2026-09-09
**Status**: Draft
**Covers**: FEATURES §5.1–5.7, §2.7, §2.8, §3.23 (Maria chat, voice orb) · Ripple R6
**Depends on**: 001, 002, 003, 005

## Why this feature exists

Maria is the product's front door. She is the office manager, the concierge, the router and
the one who builds the office by talking. Almost everything Issac does, he can do by asking her.

The Hermes swap changes one thing profoundly: **honesty gets cheaper and truer**. v1 needed
three separate scraping hacks to know whether a turn had actually said anything. Hermes
reports it (R6), so the silent-turn watcher is not built at all.

## User Scenarios & Testing

### User Story 1 — She is never silent and never fakes (Priority: P1)

Issac asks Maria something while his PC is asleep. She says so plainly, saves the message,
and when the PC wakes the answer lands in the same conversation.

**Why this priority**: This single behaviour is what makes the product trustworthy. Every
other Maria feature is worthless if she can invent an answer.

**Independent Test**: Ask with the PC asleep, awake, and mid-restart. Confirm the right
honest behaviour in each case and that no reply is ever fabricated.

**Acceptance Scenarios**:
1. **Given** the PC is unreachable, **When** Issac sends, **Then** she says plainly "I can't
   reach the office computer", the message parks in the outbox ("Saved ✅ — your office
   computer is asleep 💤"), and **no answer is invented**.
2. **Given** a parked message, **When** the PC wakes, **Then** the reply lands in the same
   thread (002 User Story 3).
3. **Given** a turn that produced no text, **When** it ends, **Then** Hermes reports it
   (001 FR-006) and she says honestly that she looked into it but did not manage — the old
   "(no reply)" placeholder MUST NOT exist.
4. **Given** a turn is slow, **When** waiting, **Then** patience is ~2¾ min, the asleep
   verdict ~30 s with no pickup, and the late-reply watch ~5 min.
5. **Given** a run-task card is open, **When** the PC is unreachable, **Then** it stays In
   Progress rather than flipping to a false state.

---

### User Story 2 — She does things, not just says things (Priority: P1)

Issac says "add a design department with two people". A department appears — in the rail,
on the 3D floor, staffed — and a plain-words line says what changed.

**Why this priority**: Without hidden actions, Maria is a chatbot bolted onto a dashboard.

**Independent Test**: Exercise each action kind; confirm the real store changed, the visible
text stayed clean, and the change is undoable.

**Acceptance Scenarios**:
1. **Given** a reply containing an actions block, **When** parsed, **Then** the actions
   execute and the block is **stripped from the visible text**.
2. **Given** any executed action, **When** it lands, **Then** a plain-words "what changed"
   line is shown and an activity entry is written.
3. **Given** an action that is outward or irreversible, **When** attempted, **Then** it goes
   through Approvals (008) — never straight through.
4. **Given** a key pasted in chat, **When** received, **Then** it rides the locked pipe to
   the PC and is **never echoed back** into the conversation.
5. **Given** an action was wrong, **When** undo is used, **Then** it reverses through the
   same real store.

---

### User Story 3 — One conversation, everywhere (Priority: P2)

Issac asks Maria something on his phone, then opens the website. It is the same conversation.

**Independent Test**: The "pomegranate test" — say something on Telegram, reference it on
the website, and vice versa.

**Acceptance Scenarios**:
1. **Given** website, Telegram and voice, **When** any is used, **Then** all three share one
   session (`hermes:main`).
2. **Given** any line, **When** displayed, **Then** it is marked with its door: 🖥️ website ·
   📱 Telegram · 🎤 voice.
3. **Given** a voice note, **When** received, **Then** it is transcribed into the journals
   and acted on.

---

### User Story 4 — She knows the office and the owner (Priority: P2)

**Acceptance Scenarios**:
1. **Given** any turn, **When** the briefing is assembled, **Then** it carries Chapter 1 +
   the room chapter + the agent's own page + the mood line + one office-status text — from
   **one builder used by every channel** (§2.7).
2. **Given** "where's the button for X?", **When** asked, **Then** she answers from the
   app's screen map.
3. **Given** "did I ever approve X? when?", **When** asked, **Then** she answers from the
   real activity log.
4. **Given** a question about a project, **When** asked, **Then** she answers from the live
   Dev Room summary and what every room is doing.

---

### User Story 5 — She speaks (Priority: P3)

**Acceptance Scenarios**:
1. **Given** a voice key exists, **When** the speak toggle is on, **Then** she speaks with a
   tone that follows her mood, and each person has a stable voice.
2. **Given** the mic is blocked, **When** the voice orb opens, **Then** it stops at once and
   says plainly what to click — it MUST NOT retry in a loop.
3. **Given** silence, **When** listening, **Then** back-off is 400 ms → 1.2 s, giving up
   after three tries.

### Edge Cases

- Two Marias (a cloud fallback and the PC) → exactly one is authoritative at a time, and the
  screen says which. The audit found v1 showing both.
- A reply arrives after the user navigated away → it lands in the thread, not on screen.
- An action references a room that no longer exists → refused with a plain reason, not a crash.
- Maria is asked something Personal → she warns, asks approval, then passes it up to Aaron.
- She is asked to do something she cannot → she proposes adding a room or a connection.
  **"No dead ends" applies to her answers too.**

## Requirements

### Functional Requirements

- **FR-001**: A permanent persona MUST be loaded into Hermes, plain-ASCII, re-taught only
  when its hash changes, carrying the screen map, folder safety, the no-dead-ends rule,
  house rules on connections, and promotion criteria.
- **FR-002**: She MUST NEVER ask for a password in chat.
- **FR-003**: Every turn MUST carry an assembled briefing from one builder shared by every
  channel (§2.7).
- **FR-004**: Replies MUST support a hidden actions block, parsed out and executed by both
  the website and the PC, leaving the visible text clean.
- **FR-005**: The action set MUST cover: `add_dept` · `rename_dept` · `remove_dept` ·
  `set_org` · `set_ceo` · `request` · `add_task` · `hire_worker` · `draft_send` ·
  `grant_once` · `connect_app` · `connect_request` · `connect_key` · `connect_pc` ·
  `connection_grant` · `connection_power` · `undo_last` · `handoff`/`handback` ·
  `remember`/`forget`/`supersede` · `rule_add` · `dev_task` · `notify_phone` · `pc_control`.
- **FR-006**: `notify_phone` MUST be the **only** phone lane, and MUST fire only for
  approvals waiting · something broke · a police catch.
- **FR-007**: Every action MUST produce a plain-words "what changed" line and an activity entry.
- **FR-008**: Outward or irreversible actions MUST route through Approvals (008).
- **FR-009**: Keys received in chat MUST ride the locked pipe and never be echoed.
- **FR-010**: She MUST be honest when offline, park messages in the outbox, and never invent
  a reply. Timings per the constants registry.
- **FR-011**: The silent-turn watcher MUST NOT be built; `turn.ended{status}` replaces it (R6).
- **FR-012**: Website, Telegram and voice MUST share one session with per-line door markers.
- **FR-013**: Chat MUST answer in the language written in (003 FR-010).
- **FR-014**: She MUST be reachable as a floating launcher, a standalone window, and her own
  room — all the same thread. The launcher MUST never cover a primary action.
- **FR-015**: Chat MUST support a live connect card (polling the PC) and a hookup card
  (recipe, room keyholes, start/continue installation).
- **FR-016**: Voice MUST support listen → think → speak, a stable per-person voice, mood-
  following tone, browser fallback, and immediate honest failure when the mic is blocked.
- **FR-017**: She MUST be memory-aware — see, add and forget on the owner's say-so, with a
  one-line receipt (009).
- **FR-018**: She MUST patrol for credit waste and route Personal asks to Aaron with a warning
  and an approval.

### Key Entities

- **Persona** — the permanent system prompt, hashed, re-taught only on change.
- **Briefing** — rulebook chapters + agent page + mood line + office status.
- **Action** — a typed instruction parsed from a reply, with its executor and undo.
- **Thread** — one saved conversation per person, shared by chat, the board bubble and voice.
- **Outbox entry** — a message parked for a sleeping PC.

## Success Criteria

- **SC-001**: Maria never produces an answer that did not come from a real turn. Zero
  fabricated replies under any offline or failure condition.
- **SC-002**: The pomegranate test passes: a fact stated on Telegram is known on the website
  and vice versa, in one thread.
- **SC-003**: Every action kind changes a real store, shows a plain-words change line, and
  is undoable.
- **SC-004**: No key ever appears in a transcript, journal or log.
- **SC-005**: A blocked mic produces one honest message and zero retries — v1's orb restarted
  speech recognition ~1,000×/s.
- **SC-006**: Exactly one Maria is authoritative at any moment, and the UI says which.

## Assumptions

- Maria runs on `hermes:main` with website, Telegram and voice sharing that session.
- A cloud fallback may exist for offices with no PC, but is never active simultaneously.
- Proactive suggestions, the writing canvas and the capability-gap loop (§5.7) are specced
  here but scheduled after Milestone 1.

## Must not repeat (from the 2026-09-02 audit)

*Two Marias · the voice orb restarting recognition ~1,000×/s when the mic was blocked ·
"your PC is asleep" shown with no cloud at all · the scripted "live reasoning stream"
(deleted as fake) · comments and decisions never reaching the agent.*
