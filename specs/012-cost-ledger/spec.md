# Feature Specification: Cost — the witnessed ledger

**Feature Branch**: `012-cost-ledger`
**Created**: 2026-09-09
**Status**: Draft — ⚠ **BLOCKED on the brain question. Do not plan this feature yet.**
**Covers**: FEATURES §3.15, §6.5 (cost witness) · Depends on: 001, 002, 003, 005

## ⚠ Why this feature is blocked

The whole screen's *meaning* depends on an unanswered question: is inference **flat-rate**
(riding a subscription) or **metered** (per-token API)?

v1 rode a ChatGPT subscription, so running the office was flat-rate — and the Cost screen
then displayed dollar figures derived from a hidden **$3-per-million-tokens** rate. The
audit's verdict was blunt and correct: **fiction, because the plan is flat-rate.**

- If **flat-rate**: this is a **usage** screen. Tokens, quota and attribution are real;
  dollars are not, and must not be shown. The Council's credit guard becomes a quota guard.
- If **metered**: this is a **spend** screen. Dollars become real, the audit's complaint
  resolves, and every cap, gate and guard becomes genuinely load-bearing.
- If **both** (selectable per room): the screen must show each room in its own terms and
  never total across the two.

**Run `/speckit-clarify` before `/speckit-plan`.** See `docs/HERMES-RIPPLE.md` §4.

Everything below that does **not** depend on the answer is specified now; everything that
does is marked.

## User Scenarios & Testing

### User Story 1 — Every figure is witnessed, or absent (Priority: P1)

Issac looks at what his office consumed today. Every number traces to something the bridge
actually observed. Where nothing was observed, it says so — it never shows a zero.

**Why this priority**: This is the honesty core. v1's Cost screen was the audit's worst
misleading finding, and it is the reason this feature exists at all.

**Independent Test**: Run turns in several rooms; reconcile every displayed figure against
observed token growth; then check a room that did nothing and confirm it says "not
recorded", not "$0.00".

**Acceptance Scenarios**:
1. **Given** a session first observed, **When** witnessed, **Then** its total becomes a
   baseline contributing zero.
2. **Given** growth, **When** the next tick runs, **Then** only the growth is attributed, to
   that session's room and today's date.
3. **Given** a restart (the total drops), **When** witnessed, **Then** it re-baselines and no
   negative appears.
4. **Given** a room or worker with nothing observed, **When** displayed, **Then** it shows
   **"not recorded"** or "—" — **never a fabricated $0.00**.
5. **Given** any displayed figure, **When** inspected, **Then** its source and basis are
   stated plainly.
6. **Given** attribution, **When** applied, **Then** worker desks count for their room,
   Maria/Telegram/unknown count for Office Management, and the patrol counts for the Police
   Station.

---

### User Story 2 — Caps actually stop work (Priority: P1)

Issac sets a weekly cap on a room. When it is reached, that room stops doing paid work — it
does not merely turn red.

**Acceptance Scenarios**:
1. **Given** a weekly cap, **When** set, **Then** it persists per room and is shown ("$0 / $25 weekly").
2. **Given** a room at its cap, **When** paid work is attempted, **Then** the **Run gate
   refuses it** with a plain reason — enforced in Hermes (001 FR-009), not in the UI.
3. **Given** a room over cap, **When** displayed, **Then** it is clearly marked over.

---

### User Story 3 — He can see where it went (Priority: P2)

**Acceptance Scenarios**:
1. **Given** the screen, **When** loaded, **Then** four stat tiles show Today · This week ·
   Tokens this week · Projected month, each with an Explain popover.
2. **Given** breakdowns, **When** viewed, **Then** By Department, By Agent and By Model are
   available with search, and sessions with no named model are skipped rather than guessed.
3. **Given** a row's details, **When** opened, **Then** it shows consumption **and** "What
   they delivered" (scorecard and last 5 done tasks).
4. **Given** a spend-over-time chart, **When** no data exists, **Then** it says "no spend
   witnessed yet" rather than drawing a flat line at zero.

### Edge Cases

- The PC has not reported → the screen says so; it does not carry yesterday's figure forward.
- A room is deleted mid-week → its history stays in an unclaimed bucket, labelled.
- Sessions the bridge cannot attribute → collected in a named "unclaimed" bucket, never
  silently dropped or misassigned.
- The retention window (**60 days**) rolls → older data ages out; the screen says the window.

## Requirements

### Functional Requirements

- **FR-001**: All figures MUST derive from witnessed per-session token growth (002 FR-009).
- **FR-002**: Where nothing was observed, the UI MUST say "not recorded" and MUST NOT display
  a zero.
- **FR-003**: Attribution MUST follow the rules in User Story 1 scenario 6.
- **FR-004**: History retention MUST be **60 days**.
- **FR-005**: Weekly caps MUST persist per room and MUST be enforced by the Run gate inside
  Hermes.
- **FR-006**: Every figure MUST state its basis in plain words.
- **FR-007**: Breakdowns MUST cover Department, Agent and Model; unnamed models are skipped,
  never guessed.
- **FR-008**: Demo content MUST be labelled sample throughout.
- **FR-009**: The screen MUST be responsive to 390 px.
- **FR-010**: [NEEDS CLARIFICATION: flat-rate vs metered. Determines whether dollars may be
  displayed **at all**, what "Projected month" means, and whether the credit guard is a
  quota guard or a spend guard.]
- **FR-011**: [NEEDS CLARIFICATION: if metered, the real per-model rates and their source. A
  hidden constant presented as measured spend is a Principle I violation and MUST NOT recur.]
- **FR-012**: If flat-rate is chosen, the screen MUST NOT display dollar figures anywhere,
  and MUST instead show usage against the plan's own limits, with an honest note that the
  office is covered by the plan.

### Key Entities

- **Cost observation** — session, room, day, baseline, witnessed growth.
- **Cap** — room, period, limit, consumed, state.
- **Basis** — the stated explanation behind any displayed figure.

## Success Criteria

- **SC-001**: Every figure on the screen reconciles exactly with witnessed growth.
- **SC-002**: Zero fabricated zeros anywhere — a room with no data says so.
- **SC-003**: A room at its cap cannot perform paid work, proven by attempting it.
- **SC-004**: No figure appears whose basis is not stated. The audit's "$3/M fiction" cannot recur.
- **SC-005**: A Hermes restart produces no double-count and no negative.

## Assumptions

- The bridge is the only witness (002); this feature owns presentation, caps and attribution.
- Forecasting, per-agent drill-down by hour, spike alerts and auto-pause are specced in
  FEATURES §3.15 and scheduled after the brain question is settled.

## Must not repeat (from the 2026-09-02 audit)

*Cost dollars derived from a hidden $3/M rate and presented as measured spend · workers
showing a fake $0.00 · a static "Online" pill · demo figures indistinguishable from real ones.*
