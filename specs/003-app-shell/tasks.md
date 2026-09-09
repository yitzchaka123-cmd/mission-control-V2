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

- [ ] T001 Create `web/` package with React 19 + TypeScript + Vite + Tailwind v4 per plan.md D1
- [ ] T002 [P] Configure Vitest in `web/vitest.config.ts` with `unit`, `i18n`, `bundle` and `design` projects
- [ ] T003 [P] Configure Playwright in `web/playwright.config.ts` with viewports at **390 px and 1440 px**
- [ ] T004 [P] Configure ESLint and Prettier in `web/.eslintrc.json`
- [ ] T005 [P] Add axe accessibility harness in `web/tests/a11y/harness.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: The gates come before the screens. That ordering is the entire lesson of v1's
111 button styles — they were never decided, they accumulated because nothing stopped them.

- [ ] T006 Create the single `@theme` token block in `web/src/design/theme.css` — canvas, surface, ink, brand, state colours; 11→36 px type scale; four radii; three shadows; 150/220 ms motion; focus ring (spec FR-005)
- [ ] T007 **Write the design lint FIRST** in `web/tests/design/tokens.test.ts` — fails the build on any hex colour outside the token block, any raw `<button>`, and any interactive element without a focus style (plan.md D2)
- [ ] T008 Verify T007 by adding a deliberate raw button and confirming the build **fails**, then remove it (plan.md Phase 1 exit condition)
- [ ] T009 [P] **Write the i18n key test FIRST** in `web/tests/i18n/coverage.test.ts` — fails on **any** missing Hebrew key (plan.md D3, spec SC-002)
- [ ] T010 [P] **Write the bundle-composition test FIRST** in `web/tests/bundle/no-3d-in-2d.test.ts` — asserts no 3D dependency appears in any non-office chunk (plan.md D5, spec FR-015)
- [ ] T011 Build the shared primitive set in `web/src/design/primitives/` — StatTile, Skeleton, Pill, Card, PageHeader, EmptyState (five variants), ErrorState, Sheet, ConfirmDialog, ListSearch, Explain, AgentLink, BrandLogo, EmptyNote (spec FR-006)
- [ ] T012 Implement `LockedButton` in `web/src/design/primitives/LockedButton.tsx` with a **required** `reason` prop — a locked control without an explanation must not compile (plan.md D6, spec FR-007)
- [ ] T013 Implement `ConfirmDialog` as the replacement for native `confirm`, gating every destructive action (spec FR-008)
- [ ] T014 [P] Implement the zustand store pattern in `web/src/stores/create.ts` — localStorage persistence + cloud mirror + the app-wide event bus (plan.md D4, spec FR-013)
- [ ] T015 [P] Implement the i18n layer in `web/src/i18n/` — `tr()`, `trT(template, vars)`, `trChat()`, direction flip at boot (spec FR-009)

**Checkpoint**: The rules are enforced by the build. Screens can now be written safely.

---

## Phase 3: User Story 1 — Navigable, never dead-ends (Priority: P1) 🎯 MVP

**Goal**: Every route resolves, deep links open the right row, Back/Forward work, and no control leads nowhere.

**Independent Test**: Visit every route, press every shell control, use browser Back and Forward.

### Tests for User Story 1

- [ ] T016 [P] [US1] Playwright test in `web/tests/e2e/routes.spec.ts` — all 17 rail routes plus `/app/room/<name>` resolve
- [ ] T017 [P] [US1] Playwright test in `web/tests/e2e/deep-links.spec.ts` — `?item=<id>` opens that row; `?q=<words>` pre-fills search (spec FR-015 of shell)
- [ ] T018 [P] [US1] Playwright test in `web/tests/e2e/history.spec.ts` — Back and Forward restore screen state
- [ ] T019 [P] [US1] Playwright test in `web/tests/e2e/standalone-modes.spec.ts` — `?chat=maria`, `?capture=1`, `?view=connections`, `?solo=<assetId>` (spec FR-002)
- [ ] T020 [P] [US1] Test in `web/tests/e2e/no-dead-ends.spec.ts` — every control either acts or is a `LockedButton` with a reason (spec SC-001)

### Implementation for User Story 1

- [ ] T021 [US1] Implement routing in `web/src/app/routes.tsx` for all 17 slugs plus the room workspace (spec FR-001)
- [ ] T022 [US1] Implement standalone modes in `web/src/app/standalone.tsx` (spec FR-002)
- [ ] T023 [P] [US1] Implement the collapsible sidebar in `web/src/shell/Sidebar.tsx` — 56 px icon rail, off-canvas drawer on phones (spec FR-004)
- [ ] T024 [P] [US1] Implement the top bar in `web/src/shell/TopBar.tsx` — greeting, date, status pill, search, undo dropdown, bell
- [ ] T025 [US1] Implement the skip-to-content link as the **first Tab stop** in `web/src/shell/SkipLink.tsx` (spec FR-004)
- [ ] T026 [US1] Implement the boot sequence in `web/src/app/boot.ts` — ask the door once, **wipe a foreign cached office**, hydrate within budget, start the outbox watcher, set direction, boot error reporting (spec FR-012)
- [ ] T027 [US1] Implement the app-wide event bus refresh in `web/src/stores/bus.ts` (spec FR-013)
- [ ] T028 [US1] Implement ⌘/Ctrl+K and Escape handling in `web/src/shell/keyboard.ts` (spec FR-011)

**Checkpoint**: The app is navigable with zero dead ends. Every later feature plugs into this.

---

## Phase 4: User Story 2 — Hebrew is first-class (Priority: P1)

**Goal**: The whole app flips to correct RTL — dropdowns anchored right, the bell on-screen, the Rulebook usable on a phone.

**Independent Test**: Switch language; walk every screen at 390 px and 1440 px.

### Tests for User Story 2

- [ ] T029 [P] [US2] Playwright test in `web/tests/e2e/rtl-anchoring.spec.ts` — every dropdown and popover stays **fully on-screen** in RTL (spec US2 scenario 2)
- [ ] T030 [P] [US2] Playwright test in `web/tests/e2e/rtl-390.spec.ts` — every screen usable in Hebrew at 390 px with no horizontal scroll
- [ ] T031 [P] [US2] Test in `web/tests/i18n/no-concatenation.test.ts` — data-built sentences use `trT` templates, never string concatenation (spec FR-009)
- [ ] T032 [P] [US2] Verify T009 by deliberately removing a Hebrew key and confirming the build **fails**, then restore it

### Implementation for User Story 2

- [ ] T033 [US2] Build the English-keyed dictionary in `web/src/i18n/en.ts` covering every shell string
- [ ] T034 [US2] Build the Hebrew dictionary in `web/src/i18n/he.ts` at **100 % coverage** (spec SC-002)
- [ ] T035 [US2] Implement RTL-safe dropdown and popover anchoring in `web/src/design/primitives/anchor.ts` (spec Must-not-repeat)
- [ ] T036 [US2] Implement the chat-language rule in `web/src/i18n/chatLanguage.ts` — reply in the language **written in**; chrome and greetings use the dashboard language (spec FR-010)
- [ ] T037 [US2] Implement the Language setting in `web/src/app/settings/LanguageCard.tsx` (spec FR-018)

**Checkpoint**: Hebrew is not a retrofit. v1's 57 % cannot recur — the build refuses.

---

## Phase 5: User Story 3 — Offline, phone, and keyboard (Priority: P2)

**Goal**: The app degrades honestly with no network, is fully keyboard-reachable, and works at 390 px.

**Independent Test**: Kill the network; tab through every screen; run at 390 px.

### Tests for User Story 3

- [ ] T038 [P] [US3] Playwright test in `web/tests/e2e/offline.spec.ts` — offline banner appears, **no invented data** (spec US3 scenario 1)
- [ ] T039 [P] [US3] Playwright test in `web/tests/e2e/data-health.spec.ts` — a failed data layer says so; it never silently substitutes demo data
- [ ] T040 [P] [US3] Test in `web/tests/a11y/contrast.spec.ts` — **zero** contrast failures across every screen (spec SC-003)
- [ ] T041 [P] [US3] Test in `web/tests/a11y/keyboard.spec.ts` — every control reachable; cards that act as buttons are focusable (spec FR-016)
- [ ] T042 [P] [US3] Verify T010 by adding a deliberate 3D import to a 2D screen and confirming the build **fails**, then remove it

### Implementation for User Story 3

- [ ] T043 [P] [US3] Implement the offline banner in `web/src/shell/OfflineBanner.tsx` (spec FR-004)
- [ ] T044 [P] [US3] Implement the data-health banner in `web/src/shell/DataHealthBanner.tsx` — red "couldn't load your office" with Try again, plus the slim loading state
- [ ] T045 [US3] Implement the hydration budget in `web/src/app/boot.ts` — on overrun, render with what arrived and **say what is missing** (plan.md D4)
- [ ] T046 [P] [US3] Implement the PWA manifest and service worker in `web/public/` — network-first pages, cache-first hashed assets (spec FR-014)
- [ ] T047 [US3] Implement the route-level 3D boundary in `web/src/app/routes.tsx` — the office route lazy-loads (plan.md D5)
- [ ] T048 [US3] Honour `prefers-reduced-motion` throughout `web/src/design/theme.css` (spec Edge Cases)

**Checkpoint**: All three user stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T049 [P] Build the landing page in `web/src/app/Landing.tsx` — **generic department names only**, sample figures labelled as samples, and **no real business named** (plan.md D7)
- [ ] T050 [P] Implement the Settings card frame in `web/src/app/settings/Frame.tsx` — each feature owns its own card's content (spec FR-018)
- [ ] T051 [P] Implement silent continuous autosave in `web/src/stores/autosave.ts` — **no "saved" badges** (spec FR-019)
- [ ] T052 [P] Add a copy sweep test in `web/tests/design/no-dev-notes.test.ts` — fails on codenames, dev notes or beta filler in any user-visible string (spec FR-020)
- [ ] T053 [P] Implement the Explain popover primitive in `web/src/design/primitives/Explain.tsx`
- [ ] T054 [P] Write `web/README.md` — the token system, the primitives, and the four blocking gates
- [ ] T055 Write the Done Contract in `specs/003-app-shell/done-contract.md`
- [ ] T056 Add this feature's 👁 verify items to the owner's verify list

---

## Dependencies

**Story completion order**: US1 → US2 → US3

```
Phase 1 Setup (T001–T005)
        ↓
Phase 2 Foundational (T006–T015)
        ⚠ T007, T009, T010 are the BLOCKING GATES. They are written BEFORE
          the screens they protect. T008, T032 and T042 verify each gate
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
- T006 (tokens) blocks T007 and T011.
- T007 must pass T008 before any screen is written.
- T011, T012 (primitives) block every screen task.
- T033 (English dictionary) blocks T034 (Hebrew).

## Parallel execution examples

**Phase 1**: T002–T005 fully parallel.
**Phase 2**: T009, T010 parallel with T006; T014, T015 parallel after T011.
**Phase 3**: T016–T020 fully parallel; T023, T024 parallel.
**Phase 5**: T038–T042 fully parallel; T043, T044, T046 parallel.
**Phase 6**: T049–T054 fully parallel.

## Implementation strategy

**MVP = Phase 1 + 2 + 3.** A navigable shell with zero dead ends and the design gates live.
Nothing visible to a user yet — but every later feature plugs into it, and every later
feature inherits its discipline.

**Gates before screens, always.** T007, T009 and T010 are written before the code they
constrain, and each is verified by deliberately breaking it. That ordering is the single
highest-leverage decision in this feature: v1 did not decide to have 111 button styles,
400+ contrast failures and 57 % Hebrew — it drifted there because nothing said no.

**Stop and prove after Phase 3.** Show Issac the shell navigating, then the three gates
refusing a deliberate violation. That is what makes the discipline believable.
