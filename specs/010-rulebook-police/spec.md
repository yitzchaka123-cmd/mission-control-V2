# Feature Specification: The Rulebook, the Police and the Librarian

**Feature Branch**: `010-rulebook-police`
**Created**: 2026-09-09
**Status**: Draft
**Covers**: FEATURES §2.6, §3.13 · Ripple R11 · Depends on: 001, 002, 005, 009

## Why this feature exists

One book that says how the office runs, written by Issac in his own words, carried into
every agent's every turn, and checked nightly by officers who **report but never punish**.

The Hermes swap leaves this substantially unchanged (R11) — the rulebook is Mission
Control's own data; the patrol and the librarian simply run as Hermes sessions.

## User Scenarios & Testing

### User Story 1 — Saying a rule files a rule (Priority: P1)

Issac tells Maria "never email a client after 8pm". It is filed instantly, he sees where,
and every agent follows it from the next turn onward.

**Why this priority**: This is the mechanism by which the office learns his judgment. If
rules do not reach the briefing, the rulebook is scenery.

**Independent Test**: Say a rule in each channel; confirm the receipt, the chapter, and that
an agent's very next turn carries it.

**Acceptance Scenarios**:
1. **Given** a rule spoken anywhere ("always / never / from now on"), **When** said, **Then**
   it is filed instantly with a receipt: "📕 Filed: Chapter 1, rule 23" and a one-tap undo.
2. **Given** a newly filed rule, **When** filed, **Then** an **instant clash check** runs
   against the whole book.
3. **Given** any agent's next turn, **When** its briefing is assembled, **Then** the rule is
   carried at the top (001 FR-008).
4. **Given** a rule card, **When** displayed, **Then** it shows the plain sentence, 📍 chapter,
   🗣️ said-by, 📅 date and version.
5. **Given** an edit, **When** saved, **Then** the version bumps; **Given** a revoke, **When**
   confirmed, **Then** it deactivates and is **never deleted**.

---

### User Story 2 — Contradictions are surfaced, not resolved behind his back (Priority: P1)

Issac says something that contradicts an older rule. Both are filed, both are marked, and
he is asked to settle it.

**Acceptance Scenarios**:
1. **Given** a clash, **When** detected, **Then** **both** rules are filed and both cards are
   marked; Issac is asked to settle it.
2. **Given** an unsettled clash, **When** an agent acts, **Then** it follows the **newer**
   rule, marked "pending Issac's call".
3. **Given** a chapter over its **~20-rule** soft cap, **When** the nightly librarian runs,
   **Then** it proposes merges and retirements — it never applies them itself.

---

### User Story 3 — The police watch and report (Priority: P2)

Overnight, Officer Stone reads the logs against the rulebook and files what he found, with
evidence. Nothing is punished.

**Acceptance Scenarios**:
1. **Given** the nightly patrol (**00:00 UTC**), **When** it runs on Stone's session, **Then**
   it produces findings with severity (note · warning · serious), what it is about, the
   finding, and **named evidence**.
2. **Given** a finding, **When** shown, **Then** it appears on the Rulebook screen with a
   **Seen** action.
3. **Given** any finding, **When** produced, **Then** the police **report only** — they never
   punish, block or change anything.
4. **Given** the librarian (**01:00 UTC**), **When** it runs, **Then** proposals land in the
   same place for Issac's decision.
5. **Given** credit waste, **When** observed, **Then** it is reported like any other finding.

---

### User Story 4 — Three chapters, and who may use what (Priority: P2)

**Acceptance Scenarios**:
1. **Given** the book, **When** browsed, **Then** it has three chapters — office → room →
   agent — with one page per agent, **including fired ones**.
2. **Given** the master copy, **When** stored, **Then** it lives in the Filing Cabinet with a
   searchable copy in the Library.
3. **Given** the "Who can use what" panel, **When** viewed, **Then** it shows per-connection
   rows with room chips vs "Everyone", one-task keyholes, and pending asks.
4. **Given** the 7 live-enforced rules, **When** shown, **Then** each carries a real receipt
   ("✓ Enforced by: …") naming the mechanism that enforces it.

### Edge Cases

- A rule contradicts a **hard limit** → refused with a plain reason; hard limits cannot be
  loosened by a room.
- A rule is spoken on Telegram → filed identically, with its door marker.
- A rule references a deleted room → kept, marked orphaned, offered for re-scoping.
- The patrol finds nothing → nothing is filed. Silence is a valid, honest result.
- A rule is revoked while agents are mid-turn → it applies from the next briefing.

## Requirements

### Functional Requirements

- **FR-001**: One book MUST have three chapters (office → room → agent), one page per agent,
  fired agents' pages kept.
- **FR-002**: The master copy MUST live in the Filing Cabinet; a searchable copy in the Library.
- **FR-003**: A rule card MUST carry plain sentence + chapter + said-by + date + version.
- **FR-004**: Filing MUST work from any channel, produce a receipt naming chapter and number,
  and offer one-tap undo.
- **FR-005**: An instant clash check MUST run on every new rule; a clash MUST file **both**
  and mark both; agents follow the newer, marked pending.
- **FR-006**: Rules MUST be carried at the top of every agent's every briefing.
- **FR-007**: A **~20-rule** soft cap per chapter MUST trigger librarian proposals, never
  automatic changes.
- **FR-008**: Office-wide rules with per-room overrides MUST be supported, plus **hard limits
  a room cannot loosen**.
- **FR-009**: Rules MUST be versioned, audited and revocable; revoke deactivates and never
  deletes.
- **FR-010**: Dangerous changes MUST be read back before taking effect.
- **FR-011**: The nightly patrol MUST run at **00:00 UTC** on the police session and
  **report only**.
- **FR-012**: Findings MUST carry severity, subject, finding and named evidence, and be
  markable Seen. Retention cap 200.
- **FR-013**: The librarian MUST run at **01:00 UTC** and propose merges and retirements.
- **FR-014**: Live-enforced rules MUST display a receipt naming their enforcement mechanism.
- **FR-015**: The Dev Room's rules file MUST be generated from the office rulebook
  (Chapter 1 + the Dev Room chapter + Dexter's page) between markers (016).
- **FR-016**: The in-world Policy Shelf MUST open this screen with real data (015).

### Key Entities

- **Rule** — title, sentence, chapter, room, agent, topic, kind, hard-limit flag, set-by,
  version, active, supersedes/superseded-by, clash-pending.
- **Police finding** — severity, about, finding, evidence[], seen.
- **Librarian proposal** — merge or retire, with its reasoning.

## Success Criteria

- **SC-001**: A rule spoken in any channel reaches the very next agent turn.
- **SC-002**: A clash files both rules and asks — it never silently picks one.
- **SC-003**: The police never modify anything; every finding names real evidence.
- **SC-004**: No rule is ever deleted; revoked rules remain auditable.
- **SC-005**: Every "enforced" claim names a mechanism that genuinely enforces it.
- **SC-006**: The rulebook machinery **runs live**, unlike v1's.

## Assumptions

- Officers Stone and Barak run as Hermes sessions on the police room (R11).
- The patrol reads logs and the rulebook only; it has no write access to office data.
- Maria-written policies with engine-side read-back are specced but scheduled later.

## Must not repeat (from the 2026-09-02 audit)

*The rules machinery never ran live · the Rulebook unusable on a phone in Hebrew · a
duplicated "Office Management" row · claims of enforcement with nothing behind them.*
