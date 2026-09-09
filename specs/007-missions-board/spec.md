# Feature Specification: Missions, Projects, Playbooks and Calendar

**Feature Branch**: `007-missions-board`
**Created**: 2026-09-09
**Status**: Draft
**Covers**: FEATURES §3.5, §3.6, §3.7, §3.8 · Ripple R8 · Depends on: 003, 005, 006

## Why this feature exists

This is where work lives. The board is the spine; Projects, Playbooks and the Calendar are
three views onto the same real tasks.

Hermes owning the scheduler (R8) resolves four things v1 had to apologise for: crons could
not be drawn on the Calendar grid, "Run now" was locked, playbooks could only be run by
hand, and PC-side schedules did not pause for Shabbos.

## User Scenarios & Testing

### User Story 1 — Work moves through six columns (Priority: P1)

Issac drags a task from New to In progress. The room is told through the real lane, and it
stays moved.

**Independent Test**: Move a task by drag, by picker and by the detail panel; reload; confirm
one shared move path and one persisted result.

**Acceptance Scenarios**:
1. **Given** the board, **When** loaded, **Then** six columns show: Ideas → New → Scheduled
   → In progress → For your OK → Done, with counts, a per-column "+" and empty states.
2. **Given** a card, **When** moved by drag (desktop), by "Move to" (<1024 px) or by the
   detail panel's stage picker, **Then** all three use **one shared move path** and persist.
3. **Given** a card, **When** opened, **Then** the detail panel shows stage, priority,
   assignee, due, progress, tools, tags, where it came from, its **Story** (created → notes
   → stage moves → reported result) and a comment box signed by its real author.
4. **Given** a task is sent back with instructions, **When** sent, **Then** the note is saved
   **on the task**, the task returns to New, and the room is told through the real lane.
5. **Given** progress is shown, **When** rendered, **Then** it uses only real numbers — never
   a decorative bar.

---

### User Story 2 — A playbook creates real work (Priority: P2)

Issac runs "New photo job". Real tasks appear on the board, assigned to the right room.

**Acceptance Scenarios**:
1. **Given** a playbook, **When** run, **Then** one **real** task per step is created in New,
   assigned to the room lead, the run count bumps and an activity note is written.
2. **Given** the three trigger kinds, **When** configured, **Then** Playbook = the recipe,
   Cron = a timer, watch-folder = run when a file appears — and **all three can fire** (R8).
3. **Given** a scheduled playbook, **When** its time arrives inside the Shabbos window and it
   is not urgent, **Then** it is held and the hold is logged (R8).

---

### User Story 3 — The calendar tells the truth about time (Priority: P2)

**Acceptance Scenarios**:
1. **Given** the calendar, **When** loaded, **Then** it shows the real current week with real
   dates, today marked, Saturday tinted, and Day/Week/Month switching (phones open on Day).
2. **Given** dated tasks, **When** rendered, **Then** they land on their day as room-coloured
   chips that open the board.
3. **Given** recurring jobs, **When** listed, **Then** they are **drawn on the grid** and
   "Run now" works (R8) — v1's two apologies are gone.
4. **Given** Friday and Saturday, **When** shown, **Then** the real Ramat Beit Shemesh Shabbos
   times appear, computed live (Friday sunset −18 min → Saturday sunset +42 min).
5. **Given** Hebrew, **When** selected, **Then** day letters (א׳–ש׳) are used.

---

### User Story 4 — Projects show each room's real initiative (Priority: P3)

**Acceptance Scenarios**:
1. **Given** a department with tasks, **When** Projects loads, **Then** its card derives from
   live tasks: "N of M done", live "Working on: …" or "Idle — waiting for a task", progress
   ring, status, goals and milestones.
2. **Given** a cross-room project, **When** started, **Then** a real brief is queued to Maria
   for the leads.
3. **Given** archive, **When** used, **Then** the project is archived with confirmation and
   **never deleted**.

### Edge Cases

- A task's room is deleted → it becomes Unassigned and says so; it is never orphaned silently.
- A due date in the past → shown as overdue, not hidden.
- Bulk approve when a selection is not all in "For your OK" → the action is unavailable, with
  a reason.
- A Dev Room card → appears on the board from one source of truth and is not draggable.
- Two devices move the same task → last write wins, and the Story records both moves.

## Requirements

### Functional Requirements

- **FR-001**: Six stages MUST exist with fixed internal keys and owner-facing labels only.
- **FR-002**: All move affordances MUST share one persisted move path.
- **FR-003**: The toolbar MUST offer department chips (all rooms including system rooms),
  search, "Add a task" and a Select toggle with a bulk bar.
- **FR-004**: Saved views MUST be creatable as one-tap chips and deletable with confirmation.
- **FR-005**: The detail panel MUST include the **Story** trace and a conversation whose
  comments are signed by their real author and dated.
- **FR-006**: "Take to Council" MUST open Council with the room pre-picked and the question
  pre-typed (014).
- **FR-007**: The add-a-task bubble MUST offer a room select, a talk-to toggle (Maria vs the
  room lead), that person's real recent thread, stage-specific ghost text with Tab-to-fill,
  and a pending quick-add with due date and priority.
- **FR-008**: Send-back MUST save the note on the task, return it to New, and deliver it to
  the room, with delivery state shown (sending · delivered · waiting for the PC · saved-only
  · failed).
- **FR-009**: Playbooks MUST create one real task per step and support hand-run, cron and
  watch-folder triggers (R8).
- **FR-010**: The Calendar MUST draw scheduled jobs on the grid and allow Run now (R8).
- **FR-011**: Shabbos times MUST be computed live for Ramat Beit Shemesh; scheduled work MUST
  be held in the window unless urgent (R8).
- **FR-012**: Projects MUST derive from live tasks only; a project MUST NOT display a figure
  it cannot source.
- **FR-013**: Cross-room projects MUST support room chips, milestones, progress and archive-
  never-delete.
- **FR-014**: Pre-setup demo boards MUST be labelled "nothing here is kept".
- **FR-015**: Deep links `?item=<id>` MUST open the named row.

### Key Entities

- **Mission/Task** — id, room, title, detail, stage, agent, result, notes[], history[], due,
  priority, tags, tools, progress, source, comments[].
- **Project** — derived initiative per room: lead, status, progress, goals, milestones, due.
- **Playbook** — name, room, trigger, steps[], run count.
- **Calendar event** — day, time, title, room, agent.
- **Scheduled job** — schedule, target, next run, enabled, holdable.

## Success Criteria

- **SC-001**: Every move affordance produces the identical persisted result.
- **SC-002**: Running a playbook creates exactly one real task per step, verifiable on the board.
- **SC-003**: Scheduled jobs appear on the calendar grid and can be run by hand — both of
  v1's apologies removed.
- **SC-004**: No progress bar, count or figure appears that cannot be traced to real data.
- **SC-005**: A send-back never loses its instructions — v1's worst broken finding.
- **SC-006**: Shabbos holds are applied and logged, and are visible after the fact.

## Assumptions

- Tasks are Mission Control's data; Hermes executes and reports but does not own them.
- Comments and @mentions, live sessions on cards, and a cross-team category are specced but
  scheduled after Milestone 1.
- Two-way Google Calendar sync depends on 011 and is scheduled with it.

## Must not repeat (from the 2026-09-02 audit)

*Send-back threw the instructions away (v1's worst break) · "New project" creates nothing ·
comments never reach the agent and were all signed "Issac" · progress bars with invented
numbers.*
