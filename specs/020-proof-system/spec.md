# Feature Specification: The proof system

**Feature Branch**: `020-proof-system`
**Created**: 2026-09-09
**Status**: Draft
**Covers**: FEATURES §4.7, §13, §14.4 · Depends on: everything (and precedes everything)

## Why this feature exists

Constitution Principle II: **Built ≠ Done.** Done = proven by a command + screenshots +
Issac saw it.

v1 shipped a memory/rules/org machinery that had never run live, per-room agents whose flip
was never pressed, and four Settings cards that saved nothing — and all of it was counted as
built. The 2026-09-02 audit found **421 findings** from **≈620 controls pressed** and **566
screenshots**, and left this standing lesson:

> *A gap list is worth nothing until someone has pressed every control in the running app
> and looked at the shots.*

This feature is the machine that makes that lesson unavoidable. **It is written early and
run always** — it is not a phase at the end.

## User Scenarios & Testing

### User Story 1 — One command says whether it is real (Priority: P1)

Before anything merges, Issac (or CI) runs one command and gets a yes or a no.

**Independent Test**: Introduce a deliberate fake — an empty handler, a `#` link, a
hard-coded figure, a database key in the bundle — and confirm the gate refuses each.

**Acceptance Scenarios**:
1. **Given** the fast gate, **When** run, **Then** it performs, in order: typecheck → build →
   **key scan** → **dead-control sweep** → unit tests → integration tests → **control census**
   → acceptance tests for the touched screens.
2. **Given** a database key in the built page, **When** scanned, **Then** the gate **fails**.
3. **Given** a banned stand-in — demo text, an empty handler, a `#` link, a TODO, a fake
   alert — **When** swept, **Then** the gate **fails** and names the file and line.
4. **Given** the control census, **When** run, **Then** it reports "X of X controls
   click-tested, **0 dead ends**", and **any** dead end fails the gate.
5. **Given** the gate is running, **When** a second run starts, **Then** it waits — one run at
   a time behind a lock.

---

### User Story 2 — The 3D office is verified without a graphics card (Priority: P2)

**Acceptance Scenarios**:
1. **Given** a push touching the office, **When** CI runs, **Then** it produces per-angle
   screenshots, an orbit video, a motion contact sheet, a trace and a QA report on a **real
   browser**.
2. **Given** the QA hooks, **When** queried, **Then** they expose scene state and a control
   API (015 FR-014), with readiness defined as the whole team visible for 1.5 s across ≥2
   frames.
3. **Given** no graphics card, **When** Photo Mode runs, **Then** it still produces a real
   frame (015 FR-013).

---

### User Story 3 — Every proven behaviour has a spec that guards it (Priority: P2)

**Acceptance Scenarios**:
1. **Given** any behaviour declared done, **When** checked, **Then** an acceptance spec exists
   that would fail if it regressed.
2. **Given** a feature's Done Contract, **When** written, **Then** it precedes the code and
   names what will be demonstrated and how.
3. **Given** a completed step, **When** reported, **Then** the report carries: the step ID ·
   the Done Contract · the wiring count · the ripple map · **screenshots in the chat** · fresh
   eyes · checks · the 👁 verify entry.
4. **Given** the 👁 verify list, **When** an item is closed, **Then** **only Issac** may close it.

### Edge Cases

- A test passes but the screen is visibly wrong → two visual passes and a fix loop are part
  of the contract; a green test alone never closes a step.
- A flaky acceptance test → quarantining is **forbidden**. It is fixed or the gate stays red.
- The gate is slow → a fast gate for the touched screens and a full gate for everything;
  the full gate must still be run before a milestone closes.
- A control is intentionally locked → the census counts it as locked-with-reason, which
  passes; a control that is locked with **no** reason fails.

## Requirements

### Functional Requirements

- **FR-001**: A fast gate MUST exist, running the sequence in User Story 1, behind a lock.
- **FR-002**: A full gate MUST exist covering the whole suite.
- **FR-003**: The **key scan** MUST fail the build on any credential in the built page or in
  any shipped script.
- **FR-004**: The **dead-control sweep** MUST fail on banned stand-ins and name file and line.
- **FR-005**: The **control census** MUST enumerate every interactive control, click-test it,
  and require **0 dead ends**.
- **FR-006**: Acceptance specs MUST exist one per proven behaviour, and MUST include reload
  round-trips, not just first render.
- **FR-007**: Screenshots and video MUST be captured for the touched screens.
- **FR-008**: The 3D office MUST be verified on a real browser in CI on every push touching it.
- **FR-009**: A live-site check MUST run nightly and after deploy against the deployed site.
- **FR-010**: A realistic-office seed MUST exist for auditing: a named owner, several rooms,
  tasks in every stage, a real PC report and an active Vault row.
- **FR-011**: Nothing may merge unproven. The gate is **blocking, not advisory**.
- **FR-012**: Every step MUST have a permanent ID and name.
- **FR-013**: The 👁 verify list MUST be owner-closable only.
- **FR-014**: Flaky tests MUST NOT be skipped, disabled or quarantined.
- **FR-015**: A launch checklist MUST gate the public path: accounts, data safety, abuse and
  limits, product completeness, performance and devices, and a final full-gate pass with a
  stranger signing up on their phone.
- **FR-016**: The proof gate MUST verify Constitution Principle IV by proving the codebase
  contains **no vendor CLI references** (001 SC-007).

### Key Entities

- **Gate run** — the ordered checks, their results, and the artifacts produced.
- **Acceptance spec** — one proven behaviour, its scenario and its assertions.
- **Control census entry** — control, screen, click-tested, outcome, locked-reason.
- **Verify item** — step ID, what to look at, owner-closable.
- **Done Contract** — written before code; what will be demonstrated and how.

## Success Criteria

- **SC-001**: A deliberately introduced fake of each banned kind is caught by the gate.
- **SC-002**: The census reports 0 dead ends on every merge.
- **SC-003**: No credential can reach the built page.
- **SC-004**: The 3D office is verified headlessly on every relevant push.
- **SC-005**: Every "done" claim in the project has a named proof artifact behind it.
- **SC-006**: Zero skipped or quarantined tests exist in the suite.

## Assumptions

- This feature is written **first among the build tasks** and run continuously — v1 ran its
  audit at the end, and that is the mistake being corrected.
- The progress page (a visual mirror of the task list, with verified screenshots per step)
  is specified in FEATURES §13 and built alongside the gate.

## Must not repeat (from the 2026-09-02 audit)

*421 findings discovered only at the end · a machinery counted as built that had never run
live · four Settings cards that saved nothing · "built" claimed without anyone pressing the
control in a running app.*
