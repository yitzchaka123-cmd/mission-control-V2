# Feature Specification: Front door, accounts and data isolation

**Feature Branch**: `004-front-door-accounts`
**Created**: 2026-09-09
**Status**: Draft
**Covers**: FEATURES §2.12, §3.2, §12.1, §14.4 · Depends on: 003

## Why this feature exists

Everything private in the product sits behind this. v1 got the shape right — a server-side
door, signed cookies, a durable lockout, and an accounts foundation with row-level
security — but shipped with a placeholder code (`0331`) and migration 0003 (closing the
public database door) **not yet run live**. The rebuild starts with the door shut.

## User Scenarios & Testing

### User Story 1 — The door keeps strangers out (Priority: P1)

Issac types his code and is in. Someone guessing is locked out and stays locked out even
if they reload.

**Independent Test**: Enter correctly; then fail five times and confirm the lock survives
a reload and a new tab.

**Acceptance Scenarios**:
1. **Given** the correct code, **When** entered, **Then** a signed HttpOnly cookie is issued
   for **12 hours** and the app opens.
2. **Given** the code is compared, **When** verification happens, **Then** it happens **on
   the server**. The code never reaches the browser bundle.
3. **Given** **5 wrong attempts in 10 minutes**, **When** the fifth fails, **Then** a
   **15-minute** lock applies, counted durably in the database — surviving reload, new tab
   and new browser.
4. **Given** required server settings are missing, **When** the door loads, **Then** it says
   "not set up" and **names the missing settings**, rather than failing opaquely.
5. **Given** the keypad, **When** the keyboard is used, **Then** digits and backspace work.

---

### User Story 2 — Two people never see each other's office (Priority: P1)

A second person signs up. Nothing of Issac's is visible to them, at any layer.

**Why this priority**: This is the gate on the whole public-product path (Phase I), and the
one failure mode that is unrecoverable if discovered late.

**Independent Test**: Two accounts, two offices, in two browsers; attempt cross-reads
directly against the data API.

**Acceptance Scenarios**:
1. **Given** two accounts, **When** each loads, **Then** each sees only its own rows.
2. **Given** a crafted request for another owner's row, **When** sent, **Then** it is
   refused by row-level security **and** by the query allow-list — two independent belts.
3. **Given** the built page, **When** scanned, **Then** it contains **no database key**.
4. **Given** the PC bridge, **When** it writes, **Then** it uses a per-office hashed token
   scoped to an allow-listed table set.

---

### User Story 3 — Issac can leave (Priority: P3)

**Acceptance Scenarios**:
1. **Given** Settings, **When** "Delete my account" is confirmed, **Then** every row the
   owner owns is removed and the session ends.
2. **Given** Settings, **When** "Sign out" or "Lock now" is used, **Then** access ends
   immediately.

### Edge Cases

- Cookie expires mid-session → the door reappears without losing unsaved local drafts.
- A door attempt while already locked → the remaining lock time is stated plainly.
- Accounts mode off → the keypad path; accounts mode on → the sign-in path. Never both.
- A legacy office with no owner → claimable once, by one named account, then never again.
- Rate limits hit → **429 with Retry-After**, in plain words.

## Requirements

### Functional Requirements

- **FR-001**: The door code MUST be compared server-side and MUST NOT appear in the client bundle.
- **FR-002**: A successful entry MUST issue a signed HttpOnly cookie valid **12 hours**.
- **FR-003**: **5** wrong attempts within **10 minutes** MUST trigger a **15-minute** lock,
  counted durably server-side.
- **FR-004**: The "not set up" state MUST name each missing server setting.
- **FR-005**: Accounts mode MUST offer sign in / create account / reset password, with email
  and a minimum 8-character password, behind a server auth endpoint.
- **FR-006**: Every office row MUST carry an owner id; row-level security MUST be enabled on
  every live table.
- **FR-007**: Browser reads MUST go through an allow-listed query API (select / eq / in /
  order / limit / single / insert / upsert / update / delete; a change MUST name its rows;
  max 500) executed with the signed-in person's own token.
- **FR-008**: The PC MUST use a separate token-scoped path with its own table allow-list.
- **FR-009**: The browser MUST hold no database key. A key scan MUST be a blocking gate.
- **FR-010**: Rate limits MUST apply per visitor per door (data 240/min · auth 20/min ·
  assistant 30/min) returning 429 with Retry-After.
- **FR-011**: Settings MUST offer Signed in as… / Sign out / Delete my account (confirmed)
  in accounts mode, and Lock now in code mode.
- **FR-012**: The public database door MUST be closed before any live data exists —
  anonymous and authenticated roles revoked, every permissive policy dropped.
- **FR-013**: The placeholder code MUST be removed before the product accepts a second person.
- **FR-014**: Errors MUST never reveal whether an email exists.

### Key Entities

- **Owner** — the account that owns an office; the scope key on every row.
- **Door attempt** — durable counter keyed by visitor, with a lock expiry.
- **Bridge token** — per-office hashed secret, listable, mintable, revocable.

## Success Criteria

- **SC-001**: No unauthenticated request can read or write any office row — proven by test,
  not by inspection.
- **SC-002**: The lockout survives reload, new tab and new browser.
- **SC-003**: A key scan of the built site finds zero credentials.
- **SC-004**: Two accounts in two browsers share nothing; a crafted cross-read is refused
  by both belts independently.
- **SC-005**: Deleting an account removes every row it owned, verifiably.

## Assumptions

- Hosted Postgres with built-in auth and row-level security; serverless functions for the
  server-side doors.
- The owner is the only account until the public path is opened deliberately.
- The office lock (002) is a separate, device-local secret and never transits the cloud.

## Must not repeat (from the 2026-09-02 audit)

*The placeholder code shipping past accounts · migration 0003 never run live · the browser
holding a database key · "Restore demo data" wiping the office in one click.*
