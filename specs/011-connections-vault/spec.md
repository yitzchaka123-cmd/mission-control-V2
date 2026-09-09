# Feature Specification: Connections — the Vault, the catalog and the lanes

**Feature Branch**: `011-connections-vault`
**Created**: 2026-09-09
**Status**: Draft
**Covers**: FEATURES §2.1, §2.4, §2.11, §3.14, §8.1–8.3, §1.7 · Ripples R3, R4, R7
**Depends on**: 001, 002, 003, 005, 008

## Why this feature exists

This is how the office reaches the outside world: the Vault that holds the keys, the store
that offers connections, the wizards that install them, and the keyholes that decide which
room may use what.

**The deepest ripple lands here (R3).** v1's store tiles were born from OpenClaw's own
skills catalog, refreshed from the PC. With no vendor there is no catalog to be born from,
so **Mission Control owns a static, versioned connector manifest in the repo**. That is
why the audit's *~40 dead-end store tiles* and *11 known-bad wizard journeys* cannot recur:
a repo-owned manifest can only list what has been built.

## User Scenarios & Testing

### User Story 1 — A connection is only green when it is genuinely working (Priority: P1)

Issac connects Weather. It does not go green because he clicked something. It goes green
because an agent used it and he saw it work.

**Why this priority**: The truth ladder is the honesty backbone of the whole store.

**Independent Test**: Walk one connection through all four rungs; attempt to reach LIVE
without a real use and confirm it is impossible.

**Acceptance Scenarios**:
1. **Given** the ladder, **When** a connection progresses, **Then** it moves Not connected →
   Setting up → Login proven → **LIVE**, where LIVE requires an agent used it **and** Issac
   saw it.
2. **Given** a self-attestation ("I signed in here"), **When** clicked, **Then** it **never**
   earns green — v1 removed this button for exactly this reason.
3. **Given** a failed probe, **When** it fails, **Then** green is removed.
4. **Given** a connection not yet live-tested, **When** displayed, **Then** it carries a 🧪
   "Not live-tested yet" badge until Issac confirms it worked.

---

### User Story 2 — Every tile leads somewhere (Priority: P1)

Issac browses the store. Every tile he can press has a real install path to the end.

**Acceptance Scenarios**:
1. **Given** the store, **When** rendered, **Then** every tile comes from the repo-owned
   manifest (R3), and a service with no working install path is **either absent or visibly
   locked with a reason** — never a dead end.
2. **Given** the shared installer wizard, **When** opened, **Then** it shows the real logo,
   name, subtitle and state; an About section; a one-sentence "How it connects"; three
   human-titled Maria scenario previews; a "Before you install" disclosure (requirements,
   privacy, cost, risk, limits); and the official page link **for that service**.
3. **Given** wizard steps, **When** walked, **Then** they come one at a time (Step X of Y,
   Back/Next/close) with safe reload and resume, and **the key is requested only on the
   final step**.
4. **Given** drafts are persisted, **When** saved, **Then** only non-secret fields are stored.
5. **Given** a PC-only step, **When** reached, **Then** the website says plainly "finish on
   your PC" and hands off to Home Base — never a dead stop.

---

### User Story 3 — Rooms hold keys, not agents (Priority: P1)

Issac grants the Yesh Magnetim room access to Google Drive. No other room can use it, and
he can take it back in one click.

**Acceptance Scenarios**:
1. **Given** one tile, **When** created, **Then** it represents one **account** —
   multi-account is first-class.
2. **Given** a fresh connection, **When** created, **Then** it holds **no room keyholes
   until asked**, and every power defaults to Ask.
3. **Given** a keyhole, **When** granted, **Then** it is scoped to that room, visible, and
   revocable with confirmation.
4. **Given** a one-time keyhole, **When** issued, **Then** it opens for a single task and
   closes itself when that task is Done.
5. **Given** a revoke, **When** confirmed, **Then** it closes for every room.

---

### User Story 4 — Personal is walled at the data layer (Priority: P1)

Issac marks his personal Gmail Personal. No business room can touch it, even through Maria.

**Acceptance Scenarios**:
1. **Given** the 🔒 Personal toggle, **When** set, **Then** the **data** is walled — not the
   login — from every business room.
2. **Given** walling, **When** applied, **Then** any business keyhole it held is dropped.
3. **Given** a business room needs it, **When** asked, **Then** Maria refuses to bridge it
   and offers **one-time access** (she requests → Issac approves → used for that one task →
   closes itself).
4. **Given** Personal-side rooms only (a Personal department and the CEO Office), **When**
   granted, **Then** only they may hold a standing key.

---

### User Story 5 — Keys never leak (Priority: P1)

**Acceptance Scenarios**:
1. **Given** a key typed anywhere — website, Home Base or Maria's chat — **When** entered,
   **Then** it rides the locked pipe to the PC and is **never echoed** into chat, logs,
   journals or transcripts.
2. **Given** the Vault UI, **When** viewed, **Then** it shows metadata only (a masked tag and
   a saved-at time), never the value.
3. **Given** streamed installer output, **When** displayed, **Then** secrets are redacted
   **at the source**.

### Edge Cases

- A connection is stuck half-installed → Finish and Remove are both offered; it is never
  left in limbo.
- A bot is already running on the PC → adoptable, with proof required before green.
- The PC is unreachable during install → the wizard says so and resumes later without loss.
- A service is Mac-only → does not arise; Hermes is ours (R3).
- A key is rotated → the old one is replaced and the change is logged; no silent dual state.

## Requirements

### Functional Requirements

- **FR-001**: The connector catalog MUST be a **static, versioned manifest in this
  repository** (R3), never generated from a vendor's catalog.
- **FR-002**: The truth ladder MUST be enforced: LIVE requires a real agent use **and** the
  owner's confirmation. Self-attestation never earns green.
- **FR-003**: A shared installer recipe format MUST serve both the website and Home Base,
  carrying version · service · name · subtitle · PC flag · about/how · 3 scenarios ·
  before-install disclosure · website steps · computer steps · official links.
- **FR-004**: Recipes MUST be the **source** of the store's tiles.
- **FR-005**: Keys MUST be requested only on the final wizard step; only non-secret drafts
  may be persisted.
- **FR-006**: One tile MUST equal one account; multi-account is first-class.
- **FR-007**: Fresh connections MUST hold no keyholes and default every power to Ask (008).
- **FR-008**: One-time keyholes MUST auto-close when their task is Done.
- **FR-009**: The 🔒 Personal wall MUST wall the data, drop business keyholes, and restrict
  standing keys to Personal-side rooms.
- **FR-010**: Maria MUST refuse to bridge Personal and MUST offer one-time access instead.
- **FR-011**: Keys MUST ride the locked pipe, never be echoed, and never be readable back.
- **FR-012**: Three lanes MUST be supported on the critical path — **KEY**, **CHANNEL**
  (Telegram only, R4) and **MCP/API**. The helper lane and the dev-room lane MUST be
  declared and visibly deferred, not deleted.
- **FR-013**: MCP registration MUST probe before registering, and MUST NOT show green until
  the probe passes.
- **FR-014**: PC-only steps MUST hand off to Home Base with a plain sentence and MUST NOT
  send an automatic phone ping.
- **FR-015**: An installed connection's detail page MUST offer status, how, proof, Test with
  Maria, Rooms & safety (rename, 🔐 code, Personal wall, power switches, room grants),
  Finish/Remove for stuck rows, and Disconnect with confirmation.
- **FR-016**: Unknown services MUST be triaged by Maria into Development (a connection) or
  Maintenance (a product improvement), with a plan and a money guard.
- **FR-017**: The undo ledger MUST cover keyholes, power switches and renames.
- **FR-018**: The in-world Server Room MUST open this screen with real Vault rows (015).
- **FR-019**: Every store tile MUST either work or be visibly locked with a reason. **Zero
  dead ends** is a blocking gate.

### Key Entities

- **Vault connection** — service, label, account, scopes, keyholes[], powers + gate
  positions, status (waiting-pc | active | revoked), tested, Personal wall, code-armed,
  setup note, proof note + time.
- **Recipe** — the shared installer definition; the source of a tile.
- **Keyhole** — a room's grant; standing or one-time.
- **Lane** — how a connection is established: KEY · CHANNEL · MCP/API (+ deferred lanes).

## Success Criteria

- **SC-001**: Zero dead-end tiles — every tile either completes an install or is locked with
  a reason. v1 had ~40.
- **SC-002**: No connection reaches LIVE without a real agent use plus the owner's confirmation.
- **SC-003**: No key appears in any log, journal, transcript or UI value field.
- **SC-004**: A Personal-walled connection is unreachable from every business room by every
  path, including via Maria.
- **SC-005**: Revoking a connection closes it for every room immediately.
- **SC-006**: Every wizard journey completes or explains itself; v1 had 11 known-bad journeys.

## Assumptions

- Milestone 1 needs **no working connector at all**. This feature is specced fully and built
  after the seam is proven.
- Telegram is the only channel on the critical path (R4); the other twelve keep their full
  specifications in FEATURES §8.2 and are queued.
- Gate enforcement lives in Hermes (001, R7); this feature owns the Vault, the catalog and
  the grants.

## Must not repeat (from the 2026-09-02 audit)

*~40 dead-end store tiles · 11 known-bad wizard journeys · "I signed in here" earning green ·
enforcement of grants never built · every MCP registration but one unproven.*
