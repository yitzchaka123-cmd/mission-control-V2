# Feature Specification: Approvals and the money gate

**Feature Branch**: `008-approvals-money-gate`
**Created**: 2026-09-09
**Status**: Draft — ready to plan
**Covers**: FEATURES §2.2, §2.3, §3.11, §1.7 · Ripple R7 · Depends on: 001, 003, 005

## Why this feature exists

This is the product's safety boundary and Constitution Principle V: **reversible work is
free, irreversible work always asks.**

v1 designed the four-position gate and built its UI, then recorded honestly that
enforcement on the engine was **⬜ never built**. The switches were therefore decoration.
Hermes Core executes the tools, so the gate finally lives in the executor (R7) — it can no
longer be routed around.

## ✅ "Costs money" is now defined

Inference is **flat-rate on the ChatGPT plan** (decided 2026-09-09), so **thinking is never
a money action**. That makes the *Ask-when-it-costs-money* position sharper rather than
vaguer — it names a small, real set:

**A money action is one that spends real outward currency.** Specifically:
- a paid third-party service (Suno, Higgsfield, Tripo, ElevenLabs, a metered API key the
  owner supplied);
- a purchase or an order (AliExpress buy, a store checkout);
- a payment or transfer (Stripe, PayPal, an invoice being sent for payment);
- anything that consumes a prepaid credit balance the owner topped up.

**Not money actions:** agent thinking, tokens, plan usage, drafting, reading, searching, or
any Hermes turn — however long or expensive-looking. Those are covered by the plan.

This must be a **declared property of a power in the connector manifest** (011), not a
guess made at call time.

## User Scenarios & Testing

### User Story 1 — Nothing goes out without his say-so (Priority: P1)

An agent drafts an email. It does not send. It appears on the deck with its real recipient,
subject and body. Issac swipes approve, and only then does it go.

**Independent Test**: Have an agent attempt each outward action kind; confirm zero side
effects before approval and exactly one after.

**Acceptance Scenarios**:
1. **Given** a reversible action (draft, research, local edit), **When** an agent does it,
   **Then** it proceeds freely.
2. **Given** an irreversible or outward action (send, pay, post, delete, spawn), **When**
   attempted, **Then** it is held for approval, capped and logged — **including for a Lead**.
3. **Given** a pending approval, **When** it is approved, **Then** the action executes
   **exactly once** and its effect is real.
4. **Given** a pending approval, **When** it is rejected, **Then** nothing is queued and
   nothing happens.
5. **Given** any decision, **When** made, **Then** it is logged with what, who, when and the
   resulting delivery state.

---

### User Story 2 — The deck is fast and never lies (Priority: P1)

Issac has eleven things waiting. He clears them in a minute, swiping, and each card tells
him exactly what approving will do.

**Acceptance Scenarios**:
1. **Given** the deck, **When** loaded, **Then** it shows a 3-deep card stack with swipe
   animations, lane filters (All / Actions / Code changes) with counts, and a counter, or
   "Inbox zero".
2. **Given** any card, **When** shown, **Then** it names the room, risk, agent, time, tools
   and an explicit **"On approve:"** action line.
3. **Given** five actions, **When** offered, **Then** they are Reject · Skip · Send
   instructions · Ask <agent> · Approve.
4. **Given** "Send instructions", **When** used, **Then** the note is saved on the task, the
   task returns to New, and it is delivered to the room with visible delivery state.
5. **Given** "Ask <agent>", **When** opened, **Then** a real room chat opens with the card as
   context, and says honestly when it cannot reach the PC.
6. **Given** all cards cleared, **When** done, **Then** an all-caught-up card offers to show
   skipped items again.

---

### User Story 3 — Powers have four positions and sane defaults (Priority: P1)

**Acceptance Scenarios**:
1. **Given** a connection power, **When** configured, **Then** it is Off · Ask ·
   Ask-when-it-costs-money · Free.
2. **Given** defaults, **When** a connection is fresh, **Then** looking is Free, doing is
   Ask, money is always Ask, and it holds **no room keyholes until asked**.
3. **Given** a gate position, **When** an agent calls the power, **Then** Hermes enforces it
   inside execution (001 FR-009) — the UI is not the enforcement point.
4. **Given** an optional 🔐 4-digit code, **When** set on a connection, **Then** sensitive
   changes require it.
5. **Given** a one-time grant, **When** issued, **Then** it opens for exactly one task and
   closes itself when that task is Done.

---

### User Story 4 — Card kinds cover everything that can ask (Priority: P2)

**Acceptance Scenarios**:
1. **Given** the deck, **When** populated, **Then** it can carry: room work "For your OK" ·
   outgoing drafts (real to/subject/body with line breaks kept) · Maria's one-time access
   asks · Maria's PC-control asks · office-wide rule proposals · code changes (requested by,
   files, "Open preview before approving", "On a branch · add-only · never auto-merged").
2. **Given** an approval of room work, **When** approved, **Then** the task moves to Done
   with an activity entry and a personality mood event; when sent back, it returns to New.

### Edge Cases

- Approval granted after the underlying task changed → refused with a plain reason; never
  applied to a stale target.
- The PC is unreachable at approval time → the intent is queued, the card shows "waiting for
  the PC", and nothing is claimed as sent.
- The same card approved twice (double tap, two devices) → executes once; idempotent.
- A weekly cap is reached → paid work is refused at the gate with a plain reason (012).
- An approval expires unanswered → it stays; nothing auto-approves, ever.

## Requirements

### Functional Requirements

- **FR-001**: Reversible actions MUST proceed freely; irreversible or outward actions MUST
  always require approval, a spend cap and a full log, **regardless of autonomy level**.
- **FR-002**: Powers MUST have four positions with defaults: looking Free, doing Ask, money Ask.
- **FR-003**: Enforcement MUST occur inside Hermes tool execution (001 FR-009). A UI-only
  gate is a spec violation.
- **FR-004**: Fresh connections MUST hold no room keyholes until asked.
- **FR-005**: An optional 4-digit code MUST be settable per connection for sensitive changes.
- **FR-006**: One-time keyholes MUST open for a single task and auto-close when it is Done.
- **FR-007**: The deck MUST support all card kinds listed in User Story 4.
- **FR-008**: Every card MUST show an explicit "On approve:" line.
- **FR-009**: The five actions MUST be Reject, Skip, Send instructions, Ask <agent>, Approve.
- **FR-010**: Delivery state MUST be visible and honest: sending · delivered · waiting for
  the PC · saved-only · failed.
- **FR-011**: Approving MUST be idempotent — one execution per card, whatever the input.
- **FR-012**: Decisions MUST be logged and readable in a Recent decisions panel, deep-linkable
  from Notifications.
- **FR-013**: The real pending count MUST feed Home and Start My Day.
- **FR-014**: An approval MUST NEVER be granted automatically, on timeout, or by policy.
- **FR-015**: A power MUST carry an explicit **money flag** declared in the connector
  manifest (011). *Ask-when-it-costs-money* MUST consult that flag and nothing else.
- **FR-016**: Agent thinking, tokens and plan usage MUST NEVER be treated as money actions.
  A turn MUST NOT raise a money approval.
- **FR-017**: A power with no declared money flag MUST default to **money = true** — the
  safe direction. An undeclared power asks.
- **FR-018**: Usage caps (012) MUST be enforced separately from the money gate. Hitting a
  usage cap refuses work; it does not raise a money approval.

### Key Entities

- **Approval** — id, agent, room, title, detail, action line, risk, tools, time, category,
  requested-by, preview, files, decision, delivery state.
- **Power** — a connection's named ability, with a gate position and a money flag.
- **Keyhole** — a room's grant on a connection; standing or one-time.
- **Decision** — the record of a resolved approval, with its note and outcome.

## Success Criteria

- **SC-001**: No outward action in the entire product can occur without an approval —
  demonstrated by attempting each kind and observing zero side effects.
- **SC-002**: Approving twice produces exactly one effect.
- **SC-003**: Every card's "On approve:" line matches what actually happens, verified per kind.
- **SC-004**: A "Send instructions" note is never lost.
- **SC-005**: With the PC unreachable, nothing is ever reported as sent.
- **SC-006**: Zero paths exist by which a gate position can be bypassed, including by a Lead.

## Assumptions

- The gate is enforced in Hermes (001); this feature owns the policy, the deck and the record.
- Weekly caps and the Run gate live in 012 and are consulted here.
- Approving from the phone with inline buttons is specced in 018 and scheduled after Milestone 1.

## Must not repeat (from the 2026-09-02 audit)

*Enforcement of grants on the engine never built (the switches were decoration) · send-back
throwing instructions away · decisions never reaching the agent · a per-use paid-API gate
that was only ever a plan.*
