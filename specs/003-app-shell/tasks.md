---

description: "Task list for 003-app-shell"
---

# Tasks: App shell and design system

**Input**: Design documents from `/specs/003-app-shell/`
**Prerequisites**: [`plan.md`](./plan.md) ✅, [`spec.md`](./spec.md) ✅, constitution ✅

**Tests**: **REQUIRED** — Constitution Principle II, and this feature's whole value is that
its rules are enforced by blocking gates rather than intentions (plan.md D2, D3, D5).

**Organization**: Story order follows spec.md priority: US1 (P1) → US2 (P1) → US3 (P2).

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Write the Done Contract in `specs/003-app-shell/done-contract.md` — **written before any code**, naming what will be demonstrated to Issac and how (Constitution II)
- [ ] T002 Create `web/` package with React 19 + TypeScript + Vite + Tailwind v4 per plan.md D1
- [ ] T003 [P] Configure Vitest in `web/vitest.config.ts` with `unit`, `i18n`, `bundle` and `design` projects
- [ ] T004 [P] Configure Playwright in `web/playwright.config.ts` with viewports at **390 px and 1440 px**
- [ ] T005 [P] Configure ESLint and Prettier in `web/.eslintrc.json`
- [ ] T006 [P] Add axe accessibility harness in `web/tests/a11y/harness.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: The gates come before the screens. That ordering is the entire lesson of v1's
111 button styles — they were never decided, they accumulated because nothing stopped them.

- [ ] T007 Create the single `@theme` token block in `web/src/design/theme.css` — canvas, surface, ink, brand, state colours; 11→36 px type scale; four radii; three shadows; 150/220 ms motion; focus ring (spec FR-005)
- [ ] T008 **Write the design lint FIRST** in `web/tests/design/tokens.test.ts` — fails the build on any hex colour outside the token block, any raw `<button>`, and any interactive element without a focus style (plan.md D2) (spec SC-004)
- [ ] T009 Verify T008 by adding a deliberate raw button and confirming the build **fails**, then remove it (plan.md Phase 1 exit condition)
- [ ] T010 [P] **Write the i18n key test FIRST** in `web/tests/i18n/coverage.test.ts` — fails on **any** missing Hebrew key (plan.md D3, spec SC-002)
- [ ] T011 [P] **Write the bundle-composition test FIRST** in `web/tests/bundle/no-3d-in-2d.test.ts` — asserts no 3D dependency appears in any non-office chunk (plan.md D5, spec FR-015) (spec SC-005)
- [ ] T012 Build the shared primitive set in `web/src/design/primitives/` — StatTile, Skeleton, Pill, Card, PageHeader, EmptyState (five variants), ErrorState, Sheet, ConfirmDialog, ListSearch, Explain, AgentLink, BrandLogo, EmptyNote (spec FR-006)
- [ ] T013 Implement `LockedButton` in `web/src/design/primitives/LockedButton.tsx` with a **required** `reason` prop — a locked control without an explanation must not compile (plan.md D6, spec FR-007)
- [ ] T014 Implement `ConfirmDialog` as the replacement for native `confirm`, gating every destructive action (spec FR-008)
- [ ] T015 [P] Implement the zustand store pattern in `web/src/stores/create.ts` — localStorage persistence + cloud mirror + the app-wide event bus (plan.md D4, spec FR-013)
- [ ] T016 [P] Implement the i18n layer in `web/src/i18n/` — `tr()`, `trT(template, vars)`, `trChat()`, direction flip at boot (spec FR-009)

**Checkpoint**: The rules are enforced by the build. Screens can now be written safely.

---

## Phase 3: User Story 1 — Navigable, never dead-ends (Priority: P1) 🎯 MVP

**Goal**: Every route resolves, deep links open the right row, Back/Forward work, and no control leads nowhere.

**Independent Test**: Visit every route, press every shell control, use browser Back and Forward.

### Tests for User Story 1

- [ ] T017 [P] [US1] Playwright test in `web/tests/e2e/routes.spec.ts` — all 17 rail routes plus `/app/room/<name>` resolve
- [ ] T018 [P] [US1] Playwright test in `web/tests/e2e/deep-links.spec.ts` — `?item=<id>` opens that row; `?q=<words>` pre-fills search (spec FR-015 of shell)
- [ ] T019 [P] [US1] Playwright test in `web/tests/e2e/history.spec.ts` — Back and Forward restore screen state
- [ ] T020 [P] [US1] Playwright test in `web/tests/e2e/standalone-modes.spec.ts` — `?chat=maria`, `?capture=1`, `?view=connections`, `?solo=<assetId>` (spec FR-002)
- [ ] T021 [P] [US1] Test in `web/tests/e2e/no-dead-ends.spec.ts` — every control either acts or is a `LockedButton` with a reason (spec SC-001)
- [ ] T022 [P] [US1] Playwright test in `web/tests/e2e/gate-order.spec.ts` — a first-run visit passes through door → intro → wizard in order; each gate blocks until satisfied; the intro never auto-shows twice (spec FR-003)

### Implementation for User Story 1

- [ ] T023 [US1] Implement routing in `web/src/app/routes.tsx` for all 17 slugs plus the room workspace (spec FR-001)
- [ ] T024 [US1] Implement standalone modes in `web/src/app/standalone.tsx` (spec FR-002)
- [ ] T025 [P] [US1] Implement the collapsible sidebar in `web/src/shell/Sidebar.tsx` — 56 px icon rail, off-canvas drawer on phones (spec FR-004)
- [ ] T026 [P] [US1] Implement the top bar in `web/src/shell/TopBar.tsx` — greeting, date, status pill, search, undo dropdown, bell
- [ ] T027 [US1] Implement the skip-to-content link as the **first Tab stop** in `web/src/shell/SkipLink.tsx` (spec FR-004)
- [ ] T028 [US1] Implement the boot sequence in `web/src/app/boot.ts` — ask the door once, **wipe a foreign cached office**, hydrate within budget, start the outbox watcher, set direction, boot error reporting (spec FR-012)
- [ ] T029 [US1] Implement the app-wide event bus refresh in `web/src/stores/bus.ts` (spec FR-013)
- [ ] T030 [US1] Implement ⌘/Ctrl+K and Escape handling in `web/src/shell/keyboard.ts` (spec FR-011)
- [ ] T031 [US1] Implement the gate sequencer in `web/src/app/gates/GateSequence.tsx` — runs **front door → Maria's walk-in intro (once) → setup wizard (until an office exists)** in that order, handing over cleanly and never showing two gates at once (spec FR-003). The gates themselves live in 004 and 005; this owns the ordering.

**Checkpoint**: The app is navigable with zero dead ends. Every later feature plugs into this.

---

## Phase 4: User Story 2 — Hebrew is first-class (Priority: P1)

**Goal**: The whole app flips to correct RTL — dropdowns anchored right, the bell on-screen, the Rulebook usable on a phone.

**Independent Test**: Switch language; walk every screen at 390 px and 1440 px.

### Tests for User Story 2

- [ ] T032 [P] [US2] Playwright test in `web/tests/e2e/rtl-anchoring.spec.ts` — every dropdown and popover stays **fully on-screen** in RTL (spec US2 scenario 2)
- [ ] T033 [P] [US2] Playwright test in `web/tests/e2e/rtl-390.spec.ts` — every screen usable in Hebrew at 390 px with no horizontal scroll
- [ ] T034 [P] [US2] Test in `web/tests/i18n/no-concatenation.test.ts` — data-built sentences use `trT` templates, never string concatenation (spec FR-009)
- [ ] T035 [P] [US2] Verify T010 by deliberately removing a Hebrew key and confirming the build **fails**, then restore it

### Implementation for User Story 2

- [ ] T036 [US2] Build the English-keyed dictionary in `web/src/i18n/en.ts` covering every shell string
- [ ] T037 [US2] Build the Hebrew dictionary in `web/src/i18n/he.ts` at **100 % coverage** (spec SC-002)
- [ ] T038 [US2] Implement RTL-safe dropdown and popover anchoring in `web/src/design/primitives/anchor.ts` (spec Must-not-repeat)
- [ ] T039 [US2] Implement the chat-language rule in `web/src/i18n/chatLanguage.ts` — reply in the language **written in**; chrome and greetings use the dashboard language (spec FR-010)
- [ ] T040 [US2] Implement the Language setting in `web/src/app/settings/LanguageCard.tsx` (spec FR-018)

**Checkpoint**: Hebrew is not a retrofit. v1's 57 % cannot recur — the build refuses.

---

## Phase 5: User Story 3 — Offline, phone, and keyboard (Priority: P2)

**Goal**: The app degrades honestly with no network, is fully keyboard-reachable, and works at 390 px.

**Independent Test**: Kill the network; tab through every screen; run at 390 px.

### Tests for User Story 3

- [ ] T041 [P] [US3] Playwright test in `web/tests/e2e/offline.spec.ts` — offline banner appears, **no invented data** (spec US3 scenario 1)
- [ ] T042 [P] [US3] Playwright test in `web/tests/e2e/data-health.spec.ts` — a failed data layer says so; it never silently substitutes demo data
- [ ] T043 [P] [US3] Test in `web/tests/a11y/contrast.spec.ts` — **zero** contrast failures across every screen (spec SC-003)
- [ ] T044 [P] [US3] Test in `web/tests/a11y/keyboard.spec.ts` — every control reachable; cards that act as buttons are focusable (spec FR-016)
- [ ] T045 [P] [US3] Playwright test in `web/tests/e2e/responsive.spec.ts` — **every screen** at 390 px and 1440 px in English with **no horizontal scrolling** (spec FR-017, SC-006). T033 covers Hebrew; this covers the general case.
- [ ] T046 [P] [US3] Verify T011 by adding a deliberate 3D import to a 2D screen and confirming the build **fails**, then remove it

### Implementation for User Story 3

- [ ] T047 [P] [US3] Implement the offline banner in `web/src/shell/OfflineBanner.tsx` (spec FR-004)
- [ ] T048 [P] [US3] Implement the data-health banner in `web/src/shell/DataHealthBanner.tsx` — red "couldn't load your office" with Try again, plus the slim loading state
- [ ] T049 [US3] Implement the hydration budget in `web/src/app/boot.ts` — on overrun, render with what arrived and **say what is missing** (plan.md D4)
- [ ] T050 [P] [US3] Implement the PWA manifest and service worker in `web/public/` — network-first pages, cache-first hashed assets (spec FR-014)
- [ ] T051 [US3] Implement the route-level 3D boundary in `web/src/app/routes.tsx` — the office route lazy-loads (plan.md D5)
- [ ] T052 [US3] Honour `prefers-reduced-motion` throughout `web/src/design/theme.css` (spec Edge Cases)

**Checkpoint**: All three user stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T053 [P] Build the landing page in `web/src/app/Landing.tsx` — **generic department names only**, sample figures labelled as samples, and **no real business named** (plan.md D7)
- [ ] T054 [P] Implement the Settings card frame in `web/src/app/settings/Frame.tsx` — each feature owns its own card's content (spec FR-018)
- [ ] T055 [P] Implement silent continuous autosave in `web/src/stores/autosave.ts` — **no "saved" badges** (spec FR-019)
- [ ] T056 [P] Add a copy sweep test in `web/tests/design/no-dev-notes.test.ts` — fails on codenames, dev notes or beta filler in any user-visible string (spec FR-020)
- [ ] T057 [P] Implement the Explain popover primitive in `web/src/design/primitives/Explain.tsx`
- [ ] T058 [P] Write `web/README.md` — the token system, the primitives, and the four blocking gates
- [ ] T059 Add this feature's 👁 verify items to the owner's verify list

---

## Dependencies

**Story completion order**: US1 → US2 → US3

```
Phase 1 Setup (T002–T006)
        ↓
Phase 2 Foundational (T007–T016)
        ⚠ T008, T010, T011 are the BLOCKING GATES. They are written BEFORE
          the screens they protect. T009, T035 and T046 verify each gate
          actually fails when it should.
        ↓
Phase 3 US1 routing + shell  ← 🎯 MVP
        ↓
   ┌────┴────┐
Phase 4    Phase 5      (US2 and US3 are independent of each other)
  US2        US3
   └────┬────┘
        ↓
Phase 6 Polish
```

**Hard blockers**:
- T007 (tokens) blocks T008 and T012.
- T008 must pass T009 before any screen is written.
- T012, T013 (primitives) block every screen task.
- T036 (English dictionary) blocks T037 (Hebrew).

## Parallel execution examples

**Phase 1**: T003–T006 fully parallel.
**Phase 2**: T010, T011 parallel with T007; T015, T016 parallel after T012.
**Phase 3**: T017–T021 fully parallel; T025, T026 parallel.
**Phase 5**: T041–T046 fully parallel; T047, T048, T050 parallel.
**Phase 6**: T053–T058 fully parallel.

## Implementation strategy

**MVP = Phase 1 + 2 + 3.** A navigable shell with zero dead ends and the design gates live.
Nothing visible to a user yet — but every later feature plugs into it, and every later
feature inherits its discipline.

**Gates before screens, always.** T008, T010 and T011 are written before the code they
constrain, and each is verified by deliberately breaking it. That ordering is the single
highest-leverage decision in this feature: v1 did not decide to have 111 button styles,
400+ contrast failures and 57 % Hebrew — it drifted there because nothing said no.

**Stop and prove after Phase 3.** Show Issac the shell navigating, then the three gates
refusing a deliberate violation. That is what makes the discipline believable.
