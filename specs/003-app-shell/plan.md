# Implementation Plan: App shell and design system

**Branch**: `claude/dazzling-dirac-th0asg` | **Date**: 2026-09-09
**Spec**: [`spec.md`](./spec.md) | **Tier**: 0 | **Milestone**: 1

## Summary

The frame every screen lives in: routing, chrome, design tokens, shared primitives,
Hebrew/RTL, PWA, offline and accessibility. Five of v1's audit findings were shell failures,
not screen failures — fixing them once here is far cheaper than eighteen times later.

## Technical Context

**Language/Version**: TypeScript, React 19
**Primary Dependencies**: Vite, Tailwind v4, React Router, zustand, lucide-react
**Storage**: `localStorage` mirrored to cloud rows (v1's proven pattern)
**Testing**: Vitest units · Playwright acceptance · axe for accessibility · a custom token/primitive lint
**Target Platform**: browsers, 390 px → 1440 px, PWA-installable
**Constraints**: bright theme only · 100 % Hebrew coverage · no 3D bundle on 2D screens
**Scale/Scope**: 18 screens, ~400 interactive controls

## Constitution Check

| Principle | How |
|---|---|
| **I. Nothing Fake** | `LockedButton` is the **only** way a non-working control renders, and it always carries a reason. |
| **II. Built ≠ Done** | The control census (020) click-tests every control and requires 0 dead ends before merge. |
| **III. Plain Language** | One dictionary, owner-facing strings only; a test fails the build on any untranslated key. |
| **VII. Bright, One System** | One `@theme` block; a lint rule fails the build on a raw colour or a hand-rolled button. |
| **VIII. Spec Before Code** | Spec approved, zero open questions. |

**Result: PASS.**

---

## The decisions

### D1 — Keep v1's stack

**Decision**: React 19 + TypeScript + Vite + Tailwind v4, unchanged from v1 §2.13.

**Why**: Three independent reasons, and no reason against. The 3D assets are authored for
React-Three-Fiber (015). The Dev Room already builds in it, so Dexter needs no retraining.
And the audit's complaints were about *discipline* — 111 button styles, 400+ contrast
failures — not about the framework. Changing stacks would discard working knowledge to fix a
problem the stack did not cause.

**Rejected**: Next.js (server rendering buys nothing for a single-owner app behind a door,
and complicates the Vercel function layout that already works); a rewrite in anything else
(cost with no benefit).

### D2 — The design system is enforced by a build gate, not by good intentions

**Decision**: One `@theme` token block is the only place a colour, size, radius, shadow or
duration is defined. A lint rule fails the build on: a hex colour outside the token block, a
`<button>` that is not a primitive, and any interactive element without a focus style.

**Why**: This is the single highest-leverage decision in the feature. v1 did not *intend* 111
button styles; it drifted there over months because nothing stopped it. Intent does not
survive a year of building. A build gate does.

### D3 — Hebrew is enforced at 100 %, from the first screen

**Decision**: One English-keyed dictionary with `tr()`, `trT(template, vars)` and `trChat()`.
A test enumerates every user-facing string and **fails the build on any missing Hebrew key**.
Direction flips at boot. RTL is exercised in Playwright at 390 px, not just checked by eye.

**Why**: v1 reached 57 % and the audit found the bell dropdown off-screen and the Rulebook
unusable on a phone in Hebrew. Retrofitting RTL is dramatically more expensive than never
letting it drift. The owner lives in Ramat Beit Shemesh; this is not a nice-to-have.

**Note**: `trT` with variables exists because data-built sentences must never be assembled by
string concatenation — that is what breaks RTL.

### D4 — Stores are local-first, mirrored to the cloud

**Decision**: zustand stores persisted to `localStorage`, mirrored to cloud rows, hydrated at
boot within a stated budget. An app-wide event bus refreshes every screen on any store write.

**Why**: v1's proven pattern, and it is what makes the offline banner honest — the last view
genuinely exists locally. The stated hydration budget matters: when it is exceeded, the app
renders with what arrived and **says what is missing** rather than hanging or faking.

### D5 — The 3D bundle is behind a route-level boundary

**Decision**: The office route lazy-loads; a bundle-composition test asserts no 3D dependency
appears in any other route's chunk.

**Why**: The audit found *every* 2D screen downloading 9.5–18.7 MB of 3D. A lazy import alone
does not guarantee this — one stray shared import re-couples it. The test is the guarantee.

### D6 — `LockedButton` is the single honesty primitive

**Decision**: One component renders every non-working control, taking a required `reason`
string. There is no other way to render a disabled or unavailable control, and the dead-control
sweep (020) fails on any that appear.

**Why**: Principle I needs a mechanism, not a habit. Making the reason a **required prop**
means a locked control without an explanation cannot compile.

### D7 — The landing page names no real business

**Decision**: The public page uses generic department names and sample figures that are
labelled as samples.

**Why**: The audit found v1's landing page listing Issac's actual private businesses. The
landing page is public; his client list is not.

---

## Project structure

```
web/
  src/
    app/          routes, gates (door → intro → wizard), boot sequence
    shell/        sidebar, top bar, banners, skip link, command bar
    design/       the @theme token block + the primitive set
    i18n/         dictionary, tr/trT/trChat, direction
    stores/       zustand + persistence + the event bus
    lib/
  tests/
    a11y/         axe sweeps per screen
    i18n/         fails on any missing Hebrew key
    bundle/       asserts no 3D in 2D chunks
    design/       fails on raw colours and non-primitive buttons
```

---

## Phases

| Phase | What | Exit condition |
|---|---|---|
| **1 · Tokens** | The `@theme` block, the primitive set, the design lint | The lint fails a deliberately-added raw button |
| **2 · Shell** | Routing, sidebar, top bar, banners, skip link | Every route resolves; Back/Forward work; deep links open rows |
| **3 · Gates** | Front door → intro → wizard, in order | Each gate blocks correctly and hands over cleanly |
| **4 · Hebrew** | Dictionary, direction, RTL anchoring | The i18n test fails on a deliberately-removed key; RTL passes at 390 px |
| **5 · Resilience** | Offline, data-health, hydration budget, PWA | Three distinct failure states are distinguishable and honest |

---

## Risks

| Risk | Response |
|---|---|
| Tailwind v4 token discipline erodes over time | The design lint is blocking from day one, before the second screen exists. |
| RTL breaks in a component added later | RTL is a Playwright pass over every screen, run in the gate — not a one-time review. |
| A shared import silently re-couples the 3D bundle | The bundle-composition test, not the lazy import, is the guarantee. |
| Hydration budget exceeded on a slow connection | Render with what arrived and say what is missing. Never hang, never fake. |

---

## Idea ledger check

[`docs/IDEA-LEDGER.md`](../../docs/IDEA-LEDGER.md) lists **1 unbuilt v1 idea** against this
feature's sections:

| Ledger item | v1 § | Decision |
|---|---|---|
| *"Phase I plan ⬜: a breathtaking landing FIRST → email/password/forgot sign-up → download Home Base → …"* | 3.1 | **Deferred to Phase I, with a reason.** This is the public-product sign-up journey. Milestone 1 has exactly one user, and the landing page's only job now is to exist, be honest, and not name his real businesses (D7). Building a sign-up funnel before the office works would be the exact scope inflation that stalled v1. It stays on the ledger and returns when Phase I is opened deliberately. |

**Deferred, not deleted.** The item remains in the ledger and must be re-checked whenever
this feature is revisited.
