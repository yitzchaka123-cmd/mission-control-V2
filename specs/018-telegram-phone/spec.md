# Feature Specification: Telegram and the phone

**Feature Branch**: `018-telegram-phone`
**Created**: 2026-09-09
**Status**: Draft
**Covers**: FEATURES §2.8, §10 · Ripple R4 · Depends on: 001, 002, 006

## Why this feature exists

The phone is where Issac actually is. Telegram is Maria's channel and the office's only
phone lane. **It is the one chat channel on the critical path** — v1 built thirteen, and
§10 is explicit that only this one is load-bearing (R4).

WhatsApp was rejected as Maria's own channel: an unofficial library means a ban risk and a
privacy risk. A WhatsApp *connection* for rooms remains specced in 011 and deferred.

## User Scenarios & Testing

### User Story 1 — One conversation, phone and desk (Priority: P1)

Issac tells Maria something on the train. He opens his laptop at home and she already knows.

**Independent Test**: The pomegranate test — state a fact on Telegram, reference it on the
website, then reverse the direction.

**Acceptance Scenarios**:
1. **Given** website, Telegram and voice, **When** any is used, **Then** they are **one
   session** (`hermes:main`), not three that sync.
2. **Given** a Telegram turn, **When** it happens, **Then** it is mirrored to the website
   thread with a 📨 chip and a 📱 door marker.
3. **Given** a website turn, **When** "One conversation everywhere" is on, **Then** it is
   mirrored to Telegram marked 🖥️, with room chats under "🏢 <name>".
4. **Given** engine log noise, **When** mirroring, **Then** it is stripped — only real
   conversation crosses.
5. **Given** day one, **When** the mirror is enabled, **Then** history is backfilled.

---

### User Story 2 — His phone only buzzes when it matters (Priority: P1)

Issac's phone is quiet all day. It buzzes three times: an approval, a breakage, a police catch.

**Why this priority**: A product that over-notifies gets muted, and then the approvals that
matter are missed. This is a trust boundary.

**Acceptance Scenarios**:
1. **Given** any event, **When** a ping is considered, **Then** it is sent **only** for: an
   approval waiting · something broke · a police catch.
2. **Given** the phone mirror is **off** (the default), **When** a moment occurs, **Then** the
   product is honest that it cannot reach the phone — it does not pretend to have pinged.
3. **Given** the Shabbos window, **When** a ping would go out, **Then** it is **held** and the
   hold is logged; it is delivered afterwards if still relevant.
4. **Given** a system-level break alert on the PC, **When** raised, **Then** it is sent by the
   **system**, not by Maria (a Windows popup plus a phone ping).
5. **Given** `notify_phone`, **When** used, **Then** it is the **only** phone lane in the
   entire product (006 FR-006).

---

### User Story 3 — Voice notes are heard and acted on (Priority: P2)

**Acceptance Scenarios**:
1. **Given** a voice note, **When** received, **Then** the audio is saved **first**, then
   transcribed, then logged and queued — the offset advances only after saving.
2. **Given** a transcription, **When** produced, **Then** it lands in the journals with a 🎤
   door marker and is acted on.
3. **Given** a rule spoken on Telegram, **When** heard, **Then** it is filed like any other
   (010 FR-004).

### Edge Cases

- The phone has no internet → a local retry queue; nothing is lost, nothing is double-sent.
- A message arrives while a session holds the line → the poller backs off and retries.
- The mirror is toggled off mid-conversation → the thread stays intact; only mirroring stops.
- A ping fires during Shabbos and is still relevant afterwards → delivered once, not repeatedly.
- Telegram is unreachable → the product says so; it never claims a ping was delivered.

## Requirements

### Functional Requirements

- **FR-001**: Telegram MUST be the official bot in pairing mode, with the owner as owner and
  every bot allow-listed to him.
- **FR-002**: Website, Telegram and voice MUST share one session with per-line door markers
  (🖥️ · 📱 · 🎤).
- **FR-003**: The Telegram → website mirror MUST strip engine log noise and dashboard-prefixed
  system text.
- **FR-004**: "One conversation everywhere" MUST be a switch, defaulting **off**.
- **FR-005**: The phone mirror MUST default **off**, and when off the product MUST say so
  rather than implying a ping was sent.
- **FR-006**: Phone pings MUST occur **only** for the three moments. No other event may buzz.
- **FR-007**: `notify_phone` MUST be the sole phone lane.
- **FR-008**: Pings MUST be held during the Shabbos window, with the hold logged.
- **FR-009**: Break alerts MUST be sent by the system, not by Maria.
- **FR-010**: Voice notes MUST be saved to disk **before** the read offset advances.
- **FR-011**: Voice notes MUST be transcribed, journaled and acted on.
- **FR-012**: Telegram MUST be a declared Hermes capability; when absent, every Telegram
  control locks with a plain reason (001 FR-013).
- **FR-013**: The other twelve channels MUST remain specified in FEATURES §8.2 and visibly
  deferred, not deleted (R4).
- **FR-014**: WhatsApp MUST NOT be used as Maria's own channel.

### Key Entities

- **Channel** — Telegram; its bot, pairing state, allow-list and probe result.
- **Mirror entry** — a turn copied across doors, with its marker.
- **Ping** — one of the three permitted causes, with hold state.
- **Voice note** — audio file, transcription, journal entry.

## Success Criteria

- **SC-001**: The pomegranate test passes in both directions.
- **SC-002**: Over a full day of normal use, the phone buzzes only for the three causes.
- **SC-003**: A Shabbos hold is applied and visible afterwards; nothing buzzes in the window.
- **SC-004**: No voice note is ever lost — v1 lost some on 2026-08-29.
- **SC-005**: With Telegram unreachable, nothing is ever reported as delivered.

## Assumptions

- Telegram is the only channel on the critical path (R4).
- Rich Telegram (inline Approve/Deny buttons, menus, quick replies) and PWA web push are
  specified in FEATURES §10 and scheduled after Milestone 1.
- The Dev Room's Telegram usage (016) shares the message formatter but has its own bots.

## Must not repeat (from the 2026-09-02 audit)

*The 2026-08-29 lost voice notes · "no silence flag verified — may buzz" on the mirror ·
claiming a ping was sent when the mirror was off.*
