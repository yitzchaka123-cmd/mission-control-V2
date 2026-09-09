# Feature Specification: The 3D office

**Feature Branch**: `015-office-3d`
**Created**: 2026-09-09
**Status**: Draft
**Covers**: FEATURES §3.9, §4.1–4.8 · Depends on: 003, 005, 007
**Assets**: [`docs/ASSETS-3D.md`](../../docs/ASSETS-3D.md) — **the one thing carried over from v1**

## Why this feature exists

This is the emotional core of the product: a bright, walkable, packed-with-life office where
Issac can see his team working. It is also the only part of v1 whose *output* survives —
**12 rendered characters, 109 props, and his own hand-built 91-item floor plan.**

**North star** (unchanged from v1): Sims-4 stylized-realistic meets Richard Scarry's
Busytown — packed detail, constant motion, bright, believable walking, a cozy compact
single floor with real hallways, against a low-rise Ramat Beit Shemesh backdrop. **No
fakes**: every unique piece gets its own generated asset.

## User Scenarios & Testing

### User Story 1 — His office, the way he drew it (Priority: P1)

Issac opens the Office. It is the floor plan he built himself — the same rooms, the same
desks, the same hallways.

**Why this priority**: `office-layout.json` is his design. v1 named it the build target:
*"Issac's hand-built layout is the layout the 3D build must match."*

**Independent Test**: Load the layout; compare against the v1 editor's intent room by room.

**Acceptance Scenarios**:
1. **Given** `office-layout.json`, **When** the scene builds, **Then** it reproduces the
   **intent** of all 91 items — coordinates are grid-snapped and approximate by design.
2. **Given** an item marked `spawn:true` on a **desk or partition**, **When** the scene
   builds, **Then** it is hidden until an agent without a desk is added.
3. **Given** `spawn:true` on a **room or amenity**, **When** read, **Then** it is **ignored**
   as a known false positive from the editor's pink fill.
4. **Given** a new department, **When** Maria adds one, **Then** seating is recomputed live
   and the new lead appears **without a reload**.

---

### User Story 2 — Everyone who works here is here (Priority: P1)

Every real worker stands at a real desk, as a real character — including Aaron, Max and the
officers.

**Why this priority**: v1's audit found *"real (non-demo) workers render as plain capsules"*,
*"the Police Station has no room"* and *"Maintenance has no desk"*. The office was a demo of
itself.

**Independent Test**: Create a real office with system rooms staffed; confirm zero capsules
and zero missing rooms.

**Acceptance Scenarios**:
1. **Given** any real worker, **When** rendered, **Then** it uses a real character model —
   **never a capsule**.
2. **Given** system rooms, **When** the scene builds, **Then** the Police Station has a room
   and Maintenance has a desk.
3. **Given** a worker with no rendered character yet, **When** rendered, **Then** it uses a
   **clearly-labelled placeholder identified as such**, and the gap is listed for generation —
   it is never passed off as a finished character.
4. **Given** a character, **When** shown, **Then** it carries a status light (green + glowing
   monitor = working, gray = idle) that flips **live from the room's real tasks**, a hover
   bubble with its real current work, and a name tag.
5. **Given** a retired-then-rehired worker, **When** rehired, **Then** it reuses **its own**
   character (005 FR-009); a character is never double-booked.

---

### User Story 3 — In-world objects are real controls (Priority: P2)

Issac clicks the bookcase and the Memory screen opens — with his real memories.

**Acceptance Scenarios**:
1. **Given** in-world control objects, **When** clicked, **Then** each opens its screen with
   **real** data: Memory Bookcase → Memory · Policy Shelf → Rulebook · Server Room → 
   Connections · Video Wall (six true counts) · Trophy Shelf (real grades) · Org chart (real
   roles) · Office Management whiteboard (the real room tasks, draggable) · Assembly Bell →
   the Weekly Assembly.
2. **Given** any ornament, **When** it displays a figure, **Then** the figure is real or the
   ornament shows nothing. **No ornament may display invented data.**
3. **Given** the desk dashboard, **When** a character is clicked, **Then** it shows live work,
   the task queue, model and thinking, schedules, real consumption, the scorecard, and opens
   that worker's one true chat thread.

---

### User Story 4 — It is alive (Priority: P3)

**Acceptance Scenarios**:
1. **Given** the scene, **When** watched, **Then** agents take staggered breaks, walk by
   pathfinding to game tables and back, and return when clicked ("Coming, boss! 🏃").
2. **Given** lighting, **When** the time-of-day slider is live, **Then** it tracks real local
   time, with weather sunny/cloudy/rain and a **bright-only** night.
3. **Given** props, **When** used, **Then** the whiteboard draws, the TV changes channels,
   the aquarium feeds, the arcade plays its mini-games, and the pet responds.

---

### User Story 5 — He can rearrange his own office (Priority: P3)

**Acceptance Scenarios**:
1. **Given** edit mode, **When** used, **Then** objects can be placed, dragged, rotated,
   scaled, duplicated and deleted, with grid snap, smart snapping, surface nesting, marquee
   selection, undo/redo, arrow-key nudges and a minimap.
2. **Given** walls and rooms, **When** edited, **Then** two-click wall drawing, openings,
   room resize/add/remove/rename, department assignment, floor styles and door styles work.
3. **Given** any edit, **When** made, **Then** it autosaves silently and continuously.

### Edge Cases

- No graphics card (headless) → Photo Mode still produces a real frame, which is what makes
  the office verifiable in CI.
- A weak device → Performance quality mode; edit mode forces lite.
- A phone → the 3D office was **unusable on a phone** in v1. It must either work at 390 px or
  say plainly that it needs a keyboard and mouse, with a way back.
- A layout referencing a missing asset → a labelled placeholder plus a listed gap, never a
  silent hole.
- More departments than designed slots → the southern expansion row grows the building.

## Requirements

### Functional Requirements

- **FR-001**: The scene MUST build from `office-layout.json`, honouring intent, the
  `spawn:true` desk/partition rule and the room/amenity false-positive rule.
- **FR-002**: Rooms MUST be data-driven from real departments in room colours, growing the
  building as departments are added, with system rooms always present and staffed.
- **FR-003**: Real workers MUST render as real characters. Capsules are forbidden.
- **FR-004**: A missing character MUST render a clearly-labelled placeholder and register a gap.
- **FR-005**: Status lights and hover bubbles MUST reflect the room's real tasks, live.
- **FR-006**: A character MUST be 1:1 with a worker, reused on rehire, never double-booked.
- **FR-007**: In-world control objects MUST open their screens with real data.
- **FR-008**: **No ornament may display invented data** — real or nothing.
- **FR-009**: The camera rig MUST support orbit overview, top-down map, desk-focus fly-behind,
  and free-fly (desktop only), with an occlusion fader for walls between camera and focus.
- **FR-010**: Quality modes MUST be Performance / Quality (default) / Ultra, with mobile
  defaulting to Performance and edit mode forcing lite.
- **FR-011**: Assets MUST be tiered (`char.glb` office · `char.hero.glb` close-up ·
  `char.perf.glb` weak device), instanced for props, compressed, lazily loaded, and animated
  only when on-screen or focused. **Raw GLBs MUST NOT ship** — see the outstanding
  optimisation work in `docs/ASSETS-3D.md`.
- **FR-012**: The 3D bundle MUST NOT be downloaded by any 2D screen (003 FR-015).
- **FR-013**: Photo Mode MUST render a real PNG **without a graphics card**, so the office is
  verifiable headlessly.
- **FR-014**: QA hooks MUST expose scene state (ready, loaded/total, FPS, renderer, per-agent
  id/name/status/visible/position/facing, camera, stable frames) and a control API, with
  readiness defined as the whole team visible for 1.5 s across ≥2 frames.
- **FR-015**: The editor MUST provide the full toolset in User Story 5, with silent autosave
  and Export / Import / Reset in Settings.
- **FR-016**: Layout changes MUST sync to departments — a room appears for each department
  even over a saved layout, and appears live when Maria adds one.
- **FR-017**: The 3D office MUST be usable on a phone, or say plainly that it needs a
  keyboard and mouse and offer a way back.

### Key Entities

- **Layout item** — type, position, rotation, size, colour, spawn flag, room assignment.
- **Character** — worker id, model tiers, animation clips, status light, name tag.
- **Control object** — an in-world prop bound to a real screen and a real data source.
- **Asset gap** — a needed model that does not yet exist, listed for generation.

## Success Criteria

- **SC-001**: The rendered office matches the owner's hand-built layout's intent, room by room.
- **SC-002**: Zero capsules. Every real worker has a real character or a labelled placeholder.
- **SC-003**: Every in-world ornament shows real data or nothing — zero invented figures.
- **SC-004**: Photo Mode produces a real frame in CI with no GPU.
- **SC-005**: A 2D screen's payload contains no 3D bundle.
- **SC-006**: The Police Station has a room and Maintenance has a desk on a real office.
- **SC-007**: Adding a department places its lead without a reload.

## Assumptions

- Assets are fetched by `scripts/fetch-3d-assets.sh` when this milestone starts; the source
  repo is the record until then (`docs/ASSETS-3D.md`).
- Missing characters (Aaron, Max, Stone, Barak; rigs for `quill` and `devmgr`) are generated
  through the spawn-a-character pipeline: approve the cost → generate → rig to walk and talk.
- Holiday decorations, live weather, the office pet, branding, the day-in-30-seconds replay
  and full 3D Assembly staging are specced in FEATURES §4.8 and scheduled after the office stands.

## Must not repeat (from the 2026-09-02 audit)

*Real workers rendering as plain capsules · no Police room and no Maintenance desk · the 3D
office unusable on a phone · ornaments showing fake data · every 2D screen downloading the
3D bundle (9.5–18.7 MB) · shipping raw GLBs.*
