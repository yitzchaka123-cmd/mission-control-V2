# Feature Specification: The Dev Room — Dexter and the coding sessions

**Feature Branch**: `016-dev-room`
**Created**: 2026-09-09
**Status**: Draft
**Covers**: FEATURES §3.20, §9 · Ripple R10 · Depends on: 002, 003, 010, 018

## Why this feature exists

Dexter is the Development room's lead: one always-on coding session on the PC that takes
tasks on Telegram and dispatches them to **one coding session per project**, genuinely in
parallel. Since 2026-08-17, Mission Control itself has been built through it.

**The Hermes swap barely touches this (R10).** Dexter was never a vendor agent — he is a
coding-agent session with its own Telegram bot. The contract, the Helper, the autonomy dial
and the message design all carry over verbatim. Two touch-points only: shared memory (009)
and the generated rules file (010). One bonus: "Watch it think" stops being a transcript
tail and becomes a real event subscription (R6).

## User Scenarios & Testing

### User Story 1 — One message, many projects, in parallel (Priority: P1)

Issac writes to Dexter: "Mission control: add a dark mode toggle. Mystery game: fix the PDF
export bug." Two different projects start working at once.

**Independent Test**: Dispatch to two projects; confirm two independent sessions, two
queues, and two result files.

**Acceptance Scenarios**:
1. **Given** a multi-project instruction, **When** received, **Then** Dexter writes one
   dispatch per task in the Build-and-Prove shape (goal, constraints, acceptance criteria,
   prove-it steps).
2. **Given** a dispatch, **When** the Helper picks it up (within ~5 s), **Then** it launches
   **one** session per project, in that project's folder, with its own bot.
3. **Given** a project already working, **When** a second task arrives, **Then** it queues —
   one task at a time per project.
4. **Given** a working session, **When** it is idle-checked, **Then** a **working** session
   is **never** idle-killed; idle sleep is **45 min** by default with a per-project override.
5. **Given** a session dies mid-task, **When** it happens, **Then** it is **loud** — feed,
   event and a phone alert. It is never silently restarted.

---

### User Story 2 — He can watch it work and see what it did (Priority: P2)

**Acceptance Scenarios**:
1. **Given** a running task, **When** the project chat is open, **Then** it shows "📋 From
   Dexter:" with the **exact** prompt, then **one** live checklist message edited in place
   (✅ ⏳ ⬜ per milestone), then a final result.
2. **Given** a result, **When** posted, **Then** it includes ✅ and elapsed time ("Done in
   4m 12s"), the model used, the files touched with one-liners, and a link.
3. **Given** the Dev Room screen, **When** opened, **Then** it shows project cards (state,
   exact current task, queue count, last result), a detail view with **"Watch it think"** as
   a live event stream (R6), the autonomy dial and per-project idle minutes.
4. **Given** ambiguity about which session a stream belongs to, **When** it arises, **Then**
   the UI says honestly that it has no view rather than showing the wrong one.

---

### User Story 3 — Autonomy is his to set (Priority: P2)

**Acceptance Scenarios**:
1. **Given** the autonomy dial, **When** set per project, **Then** **Careful** asks before
   every edit and command · **Normal** (default) edits freely and asks before commands ·
   **Free** runs without asking. Dexter may override it per task.
2. **Given** a permission prompt, **When** raised, **Then** it is relayed to Telegram as
   ✅ Approve / ❌ Deny. Permissions stay **on** — the skip-permissions flag is never used.
3. **Given** the coding plan, **When** work runs, **Then** it uses the **subscription plan,
   never metered API credits**, and an offer to "switch to API" is declined.

---

### User Story 4 — Schedules and a nightly digest (Priority: P3)

**Acceptance Scenarios**:
1. **Given** a scheduled dev task, **When** due, **Then** a once-a-minute check writes an
   ordinary dispatch; Dexter manages schedules in chat.
2. **Given** the nightly digest (off by default, **21:00**), **When** enabled, **Then** it
   sends one message built from the day's real events; **a quiet day sends nothing**.
3. **Given** the Shabbos window, **When** a schedule is due, **Then** it is held (R8) — v1
   recorded "⚠ PC-side schedules don't pause for Shabbos yet".

### Edge Cases

- Two dispatches for one project arrive together → queued in order, never interleaved.
- A result file is malformed → reported as a failure with the raw text, never silently dropped.
- Dexter's memory file is missing → recreated empty; **existing memory is never overwritten**.
- A project's bot token is wrong → the project shows as unreachable with a plain reason.
- A task fails → the honest-failure clause applies: say what failed and why. **Never bluff.**

## Requirements

### Functional Requirements

- **FR-001**: Dexter MUST be one always-on coding session with a persistent, never-reset
  memory (brief · preferences · log), staying light and working sequentially.
- **FR-002**: The Helper MUST watch a dispatch folder every ~5 s and launch one session per
  project with per-child environment, its own bot state and a shared config directory.
- **FR-003**: The dispatch contract MUST be `{kind: dispatch|stop|schedule|unschedule,
  project, task, taskId, autonomy?, time, days, scheduleId}` with a per-project result file.
- **FR-004**: One task at a time per project, with a queue.
- **FR-005**: Idle sleep MUST default to **45 min** with a per-project override; a working
  session MUST NEVER be idle-killed.
- **FR-006**: Sessions MUST NEVER auto-restart; a mid-task death MUST be loud in three places.
- **FR-007**: The live picture MUST be written three ways: a status file for Dexter, the Home
  Base screen, and cloud rows for the website.
- **FR-008**: "Watch it think" MUST consume Hermes/session events (R6) and MUST say honestly
  when it has no view.
- **FR-009**: The autonomy dial MUST offer Careful · Normal · Free per project, overridable
  per task.
- **FR-010**: Permissions MUST stay on; prompts are relayed as Approve / Deny. The
  skip-permissions flag MUST NEVER be used.
- **FR-011**: Coding MUST run on the subscription plan, never metered API credits, with the
  model stated in every result.
- **FR-012**: One shared Telegram message formatter MUST serve Home Base and Dexter: HTML,
  a block model, defined symbols, 4096/1024 limits, a 38-char line target, 5 visible lines,
  and a checker ensuring the message still reads with every emoji stripped.
- **FR-013**: Message shapes MUST cover answer · status · dispatch confirm · handover · ask ·
  checklist (+ result) · result · voice ack.
- **FR-014**: Command words MUST include **status** · **queue** · **kill <project>** · **usage**.
- **FR-015**: Every project bot MUST be allow-listed to the owner.
- **FR-016**: Dexter's rules file MUST be **generated** from the office rulebook between
  markers (010 FR-015).
- **FR-017**: Dexter MUST propose office-wide rules via a single Approvals card (008).
- **FR-018**: Dev tasks MUST also appear on the Missions board and the Home widget, from one
  source of truth, and MUST NOT be draggable there.
- **FR-019**: Dexter MUST never reset memory and never bluff. Built ≠ done.
- **FR-020**: Telegram is the conversation layer; the website is the status layer. Mission
  Control MUST NOT duplicate the Telegram chat UI.
- **FR-021**: Scheduled dev tasks MUST be held during the Shabbos window (R8).

### Key Entities

- **Project** — id, emoji, folder, bot token, state, current task, queue, last result,
  rest-after minutes, autonomy.
- **Dispatch** — the task envelope written to the folder.
- **Result** — elapsed, model, files, link, summary, honest-failure text.
- **Schedule** — id, project, task, time, days, enabled, last fired.

## Success Criteria

- **SC-001**: Two projects genuinely work in parallel, with independent queues and results.
- **SC-002**: A working session is never killed by the idle timer.
- **SC-003**: A session death is always loud — never silent, never auto-restarted.
- **SC-004**: Every result states its model and elapsed time; every failure is honest.
- **SC-005**: A message with all emoji stripped still reads correctly.
- **SC-006**: A quiet day sends no digest at all.

## Assumptions

- Dexter and the Helper live on the PC under Home Base (017); the website is status only.
- Per-session isolated checkouts (git worktrees) and multi-worker orchestration are specced
  in FEATURES §9 and scheduled later.
- Coding sessions eventually become real org workers with drawers, pair-journals and desks
  on the 3D floor (015).
