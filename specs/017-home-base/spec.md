# Feature Specification: Home Base — the Windows PC app

**Feature Branch**: `017-home-base`
**Created**: 2026-09-09
**Status**: Draft
**Covers**: FEATURES §7 · Ripple R12 · Depends on: 001, 002, 011, 016

## Why this feature exists

A quiet background helper so Issac **never has to walk to the PC** (Constitution Principle
VI). It runs Hermes and the bridge as children — or adopts them if already running — shows
four honest lights, translates every log line into plain English, and finishes the
connection steps that can only happen on the machine.

The Hermes swap changes the setup wizard and the light names; the shell is untouched (R12).

## User Scenarios & Testing

### User Story 1 — Four lights that tell the truth (Priority: P1)

Issac glances at Home Base. He knows instantly whether his office is running, and if not,
which part is wrong.

**Independent Test**: Stop each component in turn; confirm the right light changes and that
"never heard from" is distinguishable from "off".

**Acceptance Scenarios**:
1. **Given** the Home screen, **When** loaded, **Then** four lights show **Hermes ·
   Messenger · Brain · Memory**, each good / warn / bad / off **(R12)**.
2. **Given** a component that has never reported, **When** shown, **Then** it is
   distinguishable from one that is **off** — the two are never conflated.
3. **Given** a report older than **3 minutes**, **When** evaluated, **Then** it is stale, not fresh.
4. **Given** Start / Stop / Restart, **When** pressed, **Then** they act on the real processes.
5. **Given** the health check, **When** run, **Then** it reports All clear / A few things /
   Run again in its own window.

---

### User Story 2 — Every line explained in his words (Priority: P1)

A wall of technical log text scrolls past. Issac reads a plain-English version of it and
understands what his office is doing.

**Why this priority**: Constitution Principle III. He is non-technical, and this screen is
where raw machine output would otherwise reach him.

**Acceptance Scenarios**:
1. **Given** any log line, **When** shown, **Then** it is translated to plain English; an
   unrecognised line still gets a gist, never raw noise alone.
2. **Given** a translated line, **When** "Explain this" is used, **Then** it explains further.
3. **Given** the raw/plain toggle, **When** switched, **Then** both views are available.
4. **Given** an installer running, **When** it streams, **Then** live wire lines appear with
   **secrets masked at the source** (011 FR-011).

---

### User Story 3 — Finishing what the website cannot (Priority: P1)

The website says "finish on your PC". Issac opens Home Base and a page is waiting with the
exact steps.

**Acceptance Scenarios**:
1. **Given** something waiting, **When** Home Base opens, **Then** a Finish-connecting page
   shows the same logo, About, Maria previews and recipe as the website (011 FR-003).
2. **Given** the PC steps, **When** walked, **Then** they come one at a time (Step X of Y,
   Back / hide / resume) and **never dead-end**.
3. **Given** a completed step, **When** it completes, **Then** green is earned by **proof**,
   not by self-attestation — the "I signed in here" button MUST NOT exist.
4. **Given** something waiting, **When** it waits, **Then** the tray and taskbar show
   "N waiting for your OK" and the bell reflects it.

---

### User Story 4 — It sets itself up and stays up (Priority: P2)

**Acceptance Scenarios**:
1. **Given** the setup wizard, **When** run, **Then** it walks ① Get Node → ② install Hermes
   → ③ connect a brain → ④ start the office, with **every tick measured from reality** and a
   "Re-check my PC" action **(R12)**.
2. **Given** the watchdog, **When** enabled, **Then** it checks every 2 minutes and at logon,
   heartbeats every 30 s, settles for 90 s, gives up after 5 tries per hour, and **never
   wakes a sleeping PC**.
3. **Given** auto-restart on crash, **When** enabled, **Then** it stands down after 3 quick
   crashes and **never** restarts a dev session.
4. **Given** any setting, **When** changed, **Then** it saves instantly — the Save button on
   the folders screen is the single deliberate exception.

---

### User Story 5 — Folders are shared deliberately (Priority: P2)

**Acceptance Scenarios**:
1. **Given** shared folders, **When** listed, **Then** each shows name, path, rooms and status
   with a ✋ Stop sharing action.
2. **Given** folder powers, **When** edited, **Then** **Look** is locked on, and Organize /
   Rename / Delete always ask first.
3. **Given** the folder picker, **When** opened, **Then** it is the real Windows picker and
   room checkboxes come from the real office.

### Edge Cases

- Hermes is already running when Home Base starts → adopted, not duplicated.
- Two Home Base instances → single-instance lock; the second surfaces the first.
- An update is available on a private release channel → falls back to a cloud version stamp
  and offers the download page.
- The PC sleeps mid-install → the wizard resumes at the same step with nothing lost.
- Closing the window → hides to tray, with a tray warning that quitting stops the office.

## Requirements

### Functional Requirements

- **FR-001**: Home Base MUST run Hermes and the bridge as children, or adopt running ones.
- **FR-002**: Four lights MUST be Hermes · Messenger · Brain · Memory, with good/warn/bad/off,
  3-minute freshness, and "haven't heard yet" distinct from "off".
- **FR-003**: Every log line MUST be translated to plain English, with a gist fallback, an
  Explain action and a raw/plain toggle.
- **FR-004**: Secrets in streamed output MUST be masked at the source.
- **FR-005**: Finish-connecting pages MUST share the website's recipes and never dead-end.
- **FR-006**: Green MUST require proof. Self-attestation MUST NOT exist.
- **FR-007**: The setup wizard MUST measure every step from reality, never from a stored flag.
- **FR-008**: Settings MUST cover start-at-boot, keep-awake, auto-restart (standing down
  after 3 quick crashes, never for dev sessions), update mode, phone mirror, the watchdog,
  the data folder, reset and remove, and the office key row.
- **FR-009**: The watchdog MUST never wake a sleeping PC.
- **FR-010**: The tray menu MUST offer Open · Start/Stop office · Open dashboard · Fix login ·
  Pause everything · Quit (warning that it stops the office).
- **FR-011**: Hotkeys MUST be Ctrl+Shift+M (summon Maria) and Ctrl+Shift+N (quick note, with
  drag-a-file prefill).
- **FR-012**: A remote refresh from the website MUST re-pull code and restart the messenger
  within ~10 s.
- **FR-013**: Shared folders MUST work as in User Story 5, with Look locked on.
- **FR-014**: The Dev Room screen MUST show Dexter's brain, per-project rows with Start/Stop,
  add-a-project, idle minutes, schedules, the digest toggle and the live transcript (016).
- **FR-015**: The installer MUST be one stable, self-updating Windows executable built by CI.
- **FR-016**: Settings MUST save instantly, with the folders Save button the one exception.
- **FR-017**: The embedded Maria chat MUST be the real dashboard chat (006), not a copy.

### Key Entities

- **Light** — component, state, last-heard-at, reason.
- **Feed line** — raw text, plain translation, gist flag, timestamp.
- **Folder grant** — name, path, rooms, powers, status.
- **Update state** — channel, available version, mode.

## Success Criteria

- **SC-001**: Every light distinguishes off, stale, never-heard and healthy — no conflation.
- **SC-002**: Every feed line reaches the owner in plain English; zero raw-only lines.
- **SC-003**: No finish-connecting panel dead-ends.
- **SC-004**: No green light anywhere is earned by self-attestation.
- **SC-005**: The watchdog never wakes a sleeping PC and always stands down as specified.
- **SC-006**: No secret ever appears in the feed or the wire box.

## Assumptions

- Windows-only. Tauri and WSL were rejected; multiple PCs and macOS are later ideas.
- Home Base owns process lifecycle; the bridge owns transport (002).
- Issac's 12 locked design answers of 2026-07-08 stand and are carried into the UI.

## Must not repeat (from the 2026-09-02 audit)

*The "I signed in here" self-attest button earning green · a six-hour silence the watchdog
did not catch · lost voice notes · conflating "off" with "haven't heard from yet".*
