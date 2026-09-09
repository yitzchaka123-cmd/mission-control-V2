# Mission Control — the Hermes rebuild

Run your whole work-and-home life as a team of AI departments in a bright, walkable 3D
office, run by an AI office manager named **Maria**, with you as the only human.

> **This repository contains no application code yet, and that is deliberate.**
> The rebuild is spec-first. Nothing gets built until the specification is complete and
> approved — see the constitution, Principle VIII.

## Why there is a v2

v1 reached a 2026-09-02 professional audit with **421 findings** across ~620 controls
pressed. The headline problems were not bugs; they were structural. Mission Control was
welded to fourteen separate subsystems of a third-party runtime it did not own, could not
test and could not fix. Whole systems were counted as "built" without ever having run live.

v2 fixes the structure first: **one named seam to the runtime (Hermes)**, and a
constitution that makes "nothing fake" and "built ≠ done" enforceable rather than
aspirational.

## What is here

| Path | What it is |
|---|---|
| [`.specify/memory/constitution.md`](.specify/memory/constitution.md) | The eight rules that outrank every spec. Five are non-negotiable. |
| [`docs/FEATURES.md`](docs/FEATURES.md) | The working feature list — v1's complete list with Hermes applied and every ripple traced. **Nothing dropped.** |
| [`docs/FEATURES-V1-ORIGINAL.md`](docs/FEATURES-V1-ORIGINAL.md) | v1's untouched 1,619-line list, kept as the traceability source. |
| [`docs/HERMES-RIPPLE.md`](docs/HERMES-RIPPLE.md) | Why the swap changes what it changes. Fourteen subsystems, thirteen numbered ripples, and the honest bill. |
| [`docs/ASSETS-3D.md`](docs/ASSETS-3D.md) | The one thing carried over from v1: 12 rendered characters, 109 props, and the hand-built floor plan. |
| [`specs/ROADMAP.md`](specs/ROADMAP.md) | Twenty features, their dependencies, and a coverage matrix proving zero orphaned sections. |
| `specs/0NN-*/spec.md` | One specification per feature. |

## The state of things

- ✅ Spec Kit installed (v1.0.6, Claude integration)
- ✅ Constitution ratified
- ✅ Feature list converted to Hermes with the ripple traced
- ✅ 3D assets inventoried and hashed
- ✅ All twenty `spec.md` files written
- ⬜ `plan.md` — not started
- ⬜ `tasks.md` — not started
- ⬜ Application code — not started

## ⚠ The one open question

**Is inference flat-rate (riding a subscription) or metered (per-token API)?**

v1 rode a ChatGPT subscription, so running the office cost nothing per turn. That single
fact is load-bearing across the Cost screen, the money gate's *ask-when-it-costs-money*
position, the Council's credit guard, weekly caps, and Home Base's login watchdog.

Two features are **blocked on the answer and must not be planned until it is settled**:
`012-cost-ledger` and `008-approvals-money-gate`. Everything else can be planned today.

Full reasoning: [`docs/HERMES-RIPPLE.md` §4](docs/HERMES-RIPPLE.md).

## Next steps

1. Read the constitution, the ripple analysis and the roadmap.
2. Answer the brain question.
3. `/speckit-clarify` on 012 and 008.
4. `/speckit-plan` per feature, Tier 0 first.
5. `/speckit-tasks`, then `/speckit-implement` — Milestone 1 only, then stop and prove.

**Milestone 1** is deliberately thin: features 001 → 006. One real department, one real
agent, one real conversation through Hermes, with the honesty machinery exercised end to
end. No 3D, no connectors, no Dev Room.
