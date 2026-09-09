# Feature Specification: Home, Activity, Notifications and the day rituals

**Feature Branch**: `013-home-dashboard`
**Created**: 2026-09-09
**Status**: Draft
**Covers**: FEATURES §3.4, §3.18, §3.19, §3.23, §1.6 · Depends on: 003, 005, 007, 008

## Why this feature exists

Home is the first thing Issac sees and the place he starts and ends his day. Activity is
the memory of what he did; Notifications is the queue of what needs him. Together they are
the update ladder made visible: workers → manager → Maria → Issac.

## User Scenarios & Testing

### User Story 1 — Home tells him where things stand, truthfully (Priority: P1)

Issac opens the app. In five seconds he knows how many agents are working, what is waiting
for him, and whether his office computer is even on.

**Independent Test**: Load Home with the PC on, off, and never-connected. Confirm three
different honest states and zero invented figures.

**Acceptance Scenarios**:
1. **Given** Home, **When** loaded, **Then** widgets show real figures: agents active
   (working/total), tasks in queue with a "for your OK" sub-line, today's consumption,
   system health, the mission queue, latest activity, departments, and the Dev Room.
2. **Given** the PC has never reported, **When** the health widget renders, **Then** it says
   "Not connected · start the bridge on your office PC" — not a zero.
3. **Given** any stat tile, **When** its "?" is pressed, **Then** an Explain popover states
   what the number means and where it comes from.
4. **Given** pre-setup, **When** demo figures appear, **Then** they are labelled "demo
   office · sample figures".
5. **Given** edit mode, **When** used, **Then** widgets can be reordered, moved, removed and
   resized (1→2→4 columns), with the layout persisted and silently autosaved.

---

### User Story 2 — Start and wrap the day (Priority: P2)

Each morning Issac presses "Start my day" and gets a slideshow of his real office. Each
evening, a mirror of what actually happened.

**Acceptance Scenarios**:
1. **Given** Start My Day, **When** opened, **Then** it shows an intro, one slide per **real**
   worker (Maria and each lead; system rooms and Aaron only when they have work) with a live
   status line, a "been up to" recap, the room's real open queue and real consumption, then a
   wrap-up.
2. **Given** Wrap up my day, **When** opened after 15:00, **Then** it shows only non-empty
   categories: Finished today · Moved forward · Waiting for your OK · Waiting on you
   elsewhere · Due now or overdue.
3. **Given** a slide row, **When** clicked, **Then** it opens that room or item.
4. **Given** an absence of ≥30 real minutes, **When** he returns, **Then** a "While you were
   away" digest appears with linked items and a "Got it".

---

### User Story 3 — One unread count, and pings only when they matter (Priority: P2)

**Acceptance Scenarios**:
1. **Given** the bell, the rail badge and the inbox, **When** any is read, **Then** they
   share **one** unread count.
2. **Given** notification tiers, **When** shown, **Then** Needs-you and FYI are distinguished.
3. **Given** a row, **When** snoozed, **Then** it returns after **1 hour** and self-cleans.
4. **Given** a phone ping, **When** sent, **Then** it is **only** for: an approval waiting ·
   something broke · a police catch. Nothing else buzzes.
5. **Given** the Shabbos window, **When** a ping would go out, **Then** it is **held** and the
   hold is logged.
6. **Given** a notification row, **When** created, **Then** it never invents a room.

---

### User Story 4 — Activity answers "did I do that?" (Priority: P2)

**Acceptance Scenarios**:
1. **Given** the Activity log, **When** viewed, **Then** it shows the owner's real actions —
   rooms opened, tasks given and finished, approvals, held Shabbos pings, undo, playbook runs,
   goal hits, pause flips — grouped Today · Yesterday · real date · Earlier, with real times.
2. **Given** Maria, **When** asked "did I ever approve X? when?", **Then** she answers from
   this log (006 User Story 4).
3. **Given** ⌘K, **When** opened, **Then** it offers base commands and typed search across
   departments, missions, projects, memories, agents, approvals, docs and activity, with
   arrow-key selection and deep-linking results.

### Edge Cases

- The office is paused → Home shows a banner with an Un-pause action.
- A widget's data source is unavailable → the widget says so; it does not disappear or zero.
- ⌘K matches nothing → an honest empty state, never a phantom result.
- Two devices read the same notification → the count converges, never goes negative.

## Requirements

### Functional Requirements

- **FR-001**: Home MUST be an editable widget grid with drag-reorder, move, remove, resize,
  an Add-widget drawer and a confirmed Reset, persisted and silently autosaved.
- **FR-002**: Every widget MUST show real data after setup, or an honest unavailable state.
- **FR-003**: Every stat tile MUST have an Explain popover naming its source.
- **FR-004**: Banners MUST cover: office paused · While you were away (after **30 real
  minutes**) · Wrap up my day (from 15:00).
- **FR-005**: Start My Day MUST build from real workers and real queues only.
- **FR-006**: Wrap up my day MUST show only non-empty categories.
- **FR-007**: One unread count MUST be shared by bell, rail badge and inbox.
- **FR-008**: Snooze MUST be **1 hour** and self-cleaning.
- **FR-009**: Phone pings MUST be limited to the three moments, and MUST be held during the
  Shabbos window with the hold logged.
- **FR-010**: The Activity log MUST record the owner's actions with kinds (approve · reject ·
  navigate · edit · chat · run · setting), searchable, last 120, deep-link highlighted.
- **FR-011**: ⌘K MUST offer base commands plus search across eight sources, deduped by stable
  id, max 14 results, keyboard-navigable.
- **FR-012**: Quick capture MUST create a **real** task, with a room select and a recent list.
- **FR-013**: Notification rows MUST never invent a room; sample notices MUST ride the same
  machinery as real ones.
- **FR-014**: The global Undo dropdown MUST appear only when something is undoable and MUST
  name the last change.

### Key Entities

- **Widget** — id, title, span, order, data source, explain text.
- **Log entry** — kind, text, detail, day, time.
- **Notification** — kind, tier, text, room, time, unread, snoozed-until.
- **Digest** — the away/start/end summary assembled from real stores.

## Success Criteria

- **SC-001**: Every Home figure traces to a real source or says it is unavailable — zero
  invented numbers.
- **SC-002**: The unread count is identical in all three places at all times.
- **SC-003**: Phone pings occur for exactly three causes and for no other.
- **SC-004**: A Shabbos hold is applied, logged and visible afterwards.
- **SC-005**: ⌘K never returns a result that does not resolve — v1 had phantom results.
- **SC-006**: Start My Day contains no slide for a worker with no work.

## Assumptions

- Home reads from every other feature's stores; it owns none of the underlying data.
- Shabbos times are computed live (007 FR-011).
- PWA push, quick actions, daily email digest and Focus/DND are specced in FEATURES §3.19
  and scheduled after Milestone 1.

## Must not repeat (from the 2026-09-02 audit)

*⌘K phantom results · the demo bell being fake · a static "Online" pill · sample figures
indistinguishable from real ones · notification rows inventing rooms.*
