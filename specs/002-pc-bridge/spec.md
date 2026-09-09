# Feature Specification: The PC bridge (the messenger)

**Feature Branch**: `002-pc-bridge`
**Created**: 2026-09-09
**Status**: Draft
**Covers**: FEATURES §6.1–6.5, §2.12 (office lock), §12.1, §12.4 · Ripples R5, R6, R13
**Depends on**: 001

## Why this feature exists

The owner's PC sits behind NAT. The cloud cannot reach in, so something on the PC must
carry state out and commands in. That courier is the bridge.

In v1 the bridge was thick because it was translating a vendor CLI: spawning four
processes every 20 seconds (the *"30 node.exe probe storm"* it needed an overlap guard to
survive), retrying a flaky gateway probe three times, and reading session transcripts by
byte offset. With Hermes exposing a real API and a real event stream, almost all of that
work disappears (R5). What remains is the courier and the security boundary.

## User Scenarios & Testing

### User Story 1 — The website knows the truth about the PC (Priority: P1)

Issac opens the dashboard. The status pill, System health and every live figure reflect
what is actually happening on his PC — or say plainly that they cannot.

**Why this priority**: Every honest screen in the product reads from this one snapshot.

**Independent Test**: Start the bridge, watch a snapshot land, stop the bridge, watch every
dependent screen turn honest within the freshness window.

**Acceptance Scenarios**:
1. **Given** the bridge is running, **When** a tick completes, **Then** a snapshot is
   written to `hermes_live/snapshot` within 20 seconds.
2. **Given** a snapshot older than **3 minutes**, **When** any screen reads it, **Then**
   it is treated as stale and labelled so.
3. **Given** the bridge has never reported, **When** a screen loads, **Then** it says
   "Not connected — start the bridge on your office PC" and shows no invented values.
4. **Given** Hermes is healthy but has zero agents, **When** the snapshot is built,
   **Then** connected is **false** — a service probe alone never counts as connected.

---

### User Story 2 — Commands reach the PC, signed (Priority: P1)

Issac approves a draft on the website. The command travels to the PC, is proven authentic,
runs once, and reports back.

**Why this priority**: This is the write path for the whole product, and its security
boundary.

**Independent Test**: Queue one command, watch it verify, run and return a result; then
replay it and watch the replay be refused.

**Acceptance Scenarios**:
1. **Given** an office lock is set, **When** a command arrives, **Then** its HMAC-SHA256
   over `kind|ts|nonce|payload` is verified with a timing-safe compare before anything runs.
2. **Given** a command older than **2 minutes**, **When** it is verified, **Then** it is
   refused as stale.
3. **Given** a nonce already seen, **When** the command is replayed, **Then** it is refused.
4. **Given** a command of an unknown kind, **When** it arrives, **Then** it is refused —
   the menu is fixed and there is no "run anything" door.
5. **Given** a command succeeds, **When** it finishes, **Then** its result is written back
   and its status moves pending → running → done.

---

### User Story 3 — A late reply still finds its thread (Priority: P2)

Issac messages a room, closes his laptop, and the PC was asleep. Later the reply arrives
and lands in the same conversation, in the right place.

**Why this priority**: v1's single most-loved honesty behaviour. It is what makes the
product trustworthy when the PC is not always on.

**Independent Test**: Send with the PC asleep, confirm the outbox note, wake the PC,
confirm the reply lands in the original thread.

**Acceptance Scenarios**:
1. **Given** the PC does not pick up within ~30 s, **When** the verdict is reached,
   **Then** the message is parked in the outbox with "Saved ✅ — your office computer is
   asleep 💤".
2. **Given** a parked message, **When** the PC wakes, **Then** it is delivered and the
   reply lands in the same thread.
3. **Given** a reply arrives late (within ~5 min), **When** it lands, **Then** it appears
   in the original thread rather than a new one.
4. **Given** a run-task card is waiting, **When** the PC is unreachable, **Then** the task
   stays In Progress rather than flipping to a false state.

---

### User Story 4 — Cost is witnessed, not invented (Priority: P2)

Every tick, the bridge observes how many tokens each session has actually consumed, and
attributes the growth to the right room.

**Why this priority**: v1's Cost screen was the audit's worst honesty finding. Witnessing
real growth is the only defensible foundation.

**Independent Test**: Run several turns in different rooms; confirm per-room, per-day
token growth matches, and that a restart does not double-count.

**Acceptance Scenarios**:
1. **Given** a session first seen, **When** it is witnessed, **Then** its current total
   becomes a baseline and contributes zero.
2. **Given** a session's total grows, **When** the next tick runs, **Then** only the growth
   is attributed, to that session's room and today's date.
3. **Given** a session's total drops (a restart), **When** it is witnessed, **Then** it is
   re-baselined and no negative figure is recorded.
4. **Given** no growth was seen, **When** the tick ends, **Then** nothing is written to the
   cloud — absence of data is never a zero.

### Edge Cases

- Two bridges run at once → the second detects the first and refuses, loudly.
- The cloud is unreachable → the bridge keeps local state and reports the gap; it never
  discards observations.
- A command's result is larger than the row allows → truncated with an explicit marker.
- The PC clock is wrong → signature freshness fails; the bridge reports clock skew as a
  named health problem rather than a mystery.
- The office lock is absent → the bridge runs in open mode and **says so** on every screen
  that shows security state.
- Hermes is up but the bridge is down → the website is honest that it cannot see the PC.

## Requirements

### Functional Requirements

- **FR-001**: The bridge MUST run as a plain Node program with no dependencies, startable
  by Home Base as a child or standalone from a Startup shortcut.
- **FR-002**: The bridge MUST tick every **20 s**, overlap-guarded, and build a snapshot
  from Hermes's `health` and `sessions` endpoints.
- **FR-003**: The snapshot MUST carry: agents (id, name, status, doing, model, tokens,
  session count) · sessions · counts · health (service ok, heartbeat, per-capability probes)
  · memory-engine block · locked flag · connect requests · connection statuses · MCP mounts
  · scheduled jobs · needs-you count · office brief · journals index · dev rows · personality.
- **FR-004**: "Connected" MUST mean the snapshot is fresh (**< 3 min**) AND at least one
  agent is reporting. A service probe alone MUST NOT satisfy it.
- **FR-005**: The bridge MUST poll for pending commands every **2 s** when commands are
  enabled.
- **FR-006**: Every command MUST be HMAC-SHA256 verified over `kind|ts|nonce|payload` with
  a **2-minute** freshness window, a nonce replay guard, and a timing-safe compare.
- **FR-007**: The command menu MUST be **fixed and enumerable**. Unknown kinds are refused.
- **FR-008**: The bridge MUST write results back with status pending → running → done | error.
- **FR-009**: The bridge MUST witness per-session lifetime token growth each tick and
  attribute it per room per day, baselining on first sight and re-baselining on a drop.
  Retention **60 days**; written to the cloud only when growth was seen.
- **FR-010**: The bridge MUST maintain an outbox for messages sent while the PC was asleep,
  and land late replies in their original thread.
- **FR-011**: The bridge MUST subscribe to Hermes's event stream for the transcript mirror
  rather than reading files (R6). The silent-turn watcher MUST NOT be built — `turn.ended`
  reports it (001 FR-006).
- **FR-012**: The bridge MUST write journals as `[YYYY-MM-DD HH:MM] from → to (door): text`
  with doors 🖥️ website · 📱 Telegram · 🎤 voice · 🤖 system. One file per day for the owner,
  one per agent pair. Written by code, costing zero tokens.
- **FR-013**: The bridge MUST walk the Hermes workspace read-only (**400 entries, depth 4**,
  skipping dotfiles and `node_modules`) and publish it every **10 min** when changed.
- **FR-014**: The bridge MUST run the police patrol (**00:00 UTC**) and the librarian tidy
  (**01:00 UTC**) on their sessions.
- **FR-015**: The bridge MUST support three cloud lanes: door mode (bridge token → the
  server's REST path), direct mode (a local credentials file), or none (local files only,
  and it MUST say so).
- **FR-016**: No database key may be baked into any script. The browser holds none, and the
  PC holds only its own scoped token.
- **FR-017**: Every log line MUST also go to a rolling feed file (last 200) so Home Base can
  show the feed even when the office self-started.
- **FR-018**: The bridge MUST refuse to start a second instance.
- **FR-019**: Secrets in streamed output MUST be redacted at the source, not at the display.

### Key Entities

- **Snapshot** — the single record of PC truth, replaced each tick, stamped with time.
- **Command** — `{id, owner, kind, target, payload, status, result, signature, nonce, ts}`.
- **Outbox entry** — a message parked for an asleep PC, with its thread identity.
- **Cost observation** — `{session, room, day, baseline, witnessed growth}`.
- **Journal line** — timestamped, from → to, with its door marker.

## Success Criteria

- **SC-001**: A snapshot lands at least every 20 s while the bridge runs; every screen
  reading it either shows fresh truth or says plainly that it cannot.
- **SC-002**: No command executes without a valid, fresh, non-replayed signature. Replay
  and staleness are both refused and logged.
- **SC-003**: A message sent to a sleeping PC is never lost and its reply never lands in
  the wrong thread.
- **SC-004**: Cost figures reconcile exactly with observed token growth; a Hermes restart
  produces no double count and no negative.
- **SC-005**: The bridge spawns **zero** subprocesses per tick — v1's probe storm cannot
  recur by construction.
- **SC-006**: A key scan of the built site and of every shipped script finds no database
  credential.

## Assumptions

- Hermes (001) is reachable on localhost; the bridge never talks to a vendor CLI.
- The cloud provides an allow-listed REST path for the PC, scoped by a per-office token.
- Home Base (017) owns process lifecycle; the bridge owns transport and attribution.
- The office lock passphrase is device-local and never transits the cloud.

## Must not repeat (from the 2026-09-02 audit)

- *"'your PC is asleep' shown with no cloud at all"* — the offline story must distinguish
  no-cloud from no-PC and say which.
- *"the office never reads OpenClaw"* — the snapshot must be the only runtime source, and
  staleness always visible.
- The *30 node.exe probe storm* — no per-tick process spawning, ever.
