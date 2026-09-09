# Feature Specification: App shell and design system

**Feature Branch**: `003-app-shell`
**Created**: 2026-09-09
**Status**: Draft
**Covers**: FEATURES §2.13, §3.0, §3.1, §3.21 (frame) · Ripple R1
**Depends on**: nothing (parallel with 001/002)

## Why this feature exists

Every screen in the product sits inside this shell. v1's audit found **111 distinct button
styles**, **400+ contrast failures**, **31 rail tab-stops with unfocusable cards**, Hebrew
at **57 %** coverage, and *every 2D screen downloading the 3D office bundle (9.5–18.7 MB)*.
All five are shell failures, not screen failures. Getting this right once is cheaper than
fixing it eighteen times.

## User Scenarios & Testing

### User Story 1 — The app is navigable and never dead-ends (Priority: P1)

Issac moves between screens by rail, by keyboard, by URL and by browser Back. Every route
resolves, deep links open the right row, and no control leads nowhere.

**Why this priority**: The shell is the precondition for every other feature's acceptance test.

**Independent Test**: Visit every route, press every shell control, use Back/Forward.

**Acceptance Scenarios**:
1. **Given** any rail item, **When** clicked, **Then** its route loads and the URL reflects it.
2. **Given** a deep link `?item=<id>`, **When** opened, **Then** that row opens; `?q=<words>`
   pre-fills search.
3. **Given** browser Back after navigating, **When** pressed, **Then** the previous screen
   returns with its state.
4. **Given** any control anywhere, **When** pressed, **Then** it either does something real
   or is visibly locked with a reason. There are no dead ends.

---

### User Story 2 — Hebrew is first-class, not a retrofit (Priority: P1)

Issac switches to עברית. The whole app flips to RTL correctly — dropdowns anchor on the
right side, the bell opens on-screen, the Rulebook is usable on a phone.

**Why this priority**: The owner is in Ramat Beit Shemesh. v1 shipped 57 % coverage and the
audit found the Hebrew bell dropdown off-screen and the Rulebook unusable on a phone.
Retrofitting RTL is far more expensive than building it in.

**Independent Test**: Switch language; walk every screen at 390 px and 1440 px.

**Acceptance Scenarios**:
1. **Given** Hebrew is selected, **When** the app loads, **Then** direction is RTL and every
   string is translated — no English leaks.
2. **Given** RTL, **When** any dropdown or popover opens, **Then** it anchors correctly and
   stays fully on-screen.
3. **Given** a data-built sentence, **When** rendered, **Then** it uses a template with
   variables, never string concatenation.
4. **Given** a chat message, **When** an agent replies, **Then** it answers in the language
   the person **wrote in** — not the dashboard setting. Greetings use the dashboard language.

---

### User Story 3 — It works offline, on a phone, and for a keyboard (Priority: P2)

**Independent Test**: Kill the network; tab through every screen; run at 390 px.

**Acceptance Scenarios**:
1. **Given** no network, **When** a screen loads, **Then** an offline banner says "you're
   offline — showing your last view" and no invented data appears.
2. **Given** the data layer fails, **When** a screen loads, **Then** a red banner says it
   could not load the office and is showing the demo — never silently substituting.
3. **Given** the first Tab press, **When** made, **Then** focus lands on a skip-to-content link.
4. **Given** any interactive element, **When** focused, **Then** the app-wide focus ring is
   visible and contrast passes.
5. **Given** a 2D screen, **When** loaded, **Then** the 3D bundle is **not** downloaded.

### Edge Cases

- Another person's cached office in this browser → wiped at boot before hydration.
- Hydration exceeds its budget → the app renders with what arrived and says what is missing.
- `prefers-reduced-motion` → all motion honoured down to none.
- A store write during navigation → every screen refreshes via the app-wide event bus.

## Requirements

### Functional Requirements

- **FR-001**: Routes MUST cover: `missions`, `projects`, `playbooks`, `calendar`, `office`,
  `council`, `approvals`, `memory`, `rulebook`, `connections`, `cost`, `docs`, `files`,
  `activity`, `notifications`, `dev-room`, `settings`, plus `/app/room/<name>` and the
  landing page at `/`.
- **FR-002**: Standalone modes MUST work: `?chat=maria`, `?capture=1[&text=]`,
  `?view=connections`, `?solo=<assetId>`.
- **FR-003**: Gates MUST run in order: front door → Maria's walk-in intro (once) → setup
  wizard (until an office exists).
- **FR-004**: The shell MUST provide a collapsible sidebar (56 px icon rail; off-canvas
  drawer on phones), a top bar, an offline banner, a data-health banner and a skip link.
- **FR-005**: One `@theme` token block MUST be the sole source of colour, type scale, radii,
  shadows and motion. **Bright theme only.**
- **FR-006**: Shared primitives MUST exist and be used rather than re-styled: StatTile,
  Skeleton, Pill, Card, PageHeader, EmptyState (first-use · no-results · cleared · done ·
  offline), ErrorState, Sheet, ConfirmDialog, ListSearch, Explain, LockedButton, AgentLink,
  BrandLogo, EmptyNote.
- **FR-007**: `LockedButton` MUST show the same plain reason on hover and on tap, and MUST
  be the only way a non-working control is presented.
- **FR-008**: `ConfirmDialog` MUST replace native `confirm` and gate every destructive action.
- **FR-009**: The app MUST support English and Hebrew from one English-keyed dictionary with
  `tr()`, `trT(template, vars)` and `trChat()`. Direction flips at boot.
- **FR-010**: Chat MUST answer in the language written in; chrome and greetings use the
  dashboard language.
- **FR-011**: Keyboard MUST support ⌘/Ctrl+K, Escape to close any overlay, and per-screen
  bindings declared by their features.
- **FR-012**: Boot MUST ask the door once, wipe a foreign cached office, hydrate stores from
  the cloud within a stated budget, start the outbox watcher, set direction and boot error
  reporting.
- **FR-013**: An app-wide event bus MUST refresh every screen on any store write.
- **FR-014**: PWA: manifest, service worker (network-first pages, cache-first hashed assets),
  Add-to-Home-Screen, iOS meta.
- **FR-015**: The 3D bundle MUST be lazy-loaded and MUST NOT be fetched by any 2D screen.
- **FR-016**: Every interactive control MUST be keyboard-reachable and meet contrast **on the
  first pass**. Cards that act as buttons MUST be focusable.
- **FR-017**: Responsive from **390 px to 1440 px** on every screen.
- **FR-018**: Settings MUST provide the card frame; each feature owns its own card's content.
- **FR-019**: Editors and settings MUST save silently and continuously — no "saved" badges.
- **FR-020**: No codename, dev note or beta filler may appear on any screen.

### Key Entities

- **Route** — slug, title, subtitle, icon, badge source, gate requirements.
- **Design token** — the single definition of a colour, size, radius, shadow or duration.
- **Locked reason** — the plain sentence shown wherever a capability is absent.

## Success Criteria

- **SC-001**: Control census reports every interactive control click-tested with **0 dead ends**.
- **SC-002**: Hebrew coverage is **100 %** of user-visible strings; no English leaks in RTL.
- **SC-003**: Zero contrast failures and zero unreachable controls in an automated pass.
- **SC-004**: Button styles trace to a single primitive set — v1's 111 variants cannot recur.
- **SC-005**: A 2D screen's initial payload contains no 3D bundle.
- **SC-006**: Every screen usable at 390 px with no horizontal scrolling.

## Assumptions

- One owner per browser; multi-tenant isolation is 004's job.
- The landing page is public and reads no office data. It MUST NOT name the owner's real
  businesses — the audit found v1's landing listing them.
- Demo/sample content is always labelled as such and never mistakable for real data.

## Must not repeat (from the 2026-09-02 audit)

*111 button styles · 400+ contrast failures · keyboard users couldn't reach the page ·
Hebrew 57 % · RTL bell off-screen · Rulebook unusable on a phone · every 2D screen
downloading the 3D office · codenames and dev notes on customer screens · the landing
listing Issac's private businesses · "Restore demo data" wiping the office in one click.*
