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
| [`docs/IDEA-LEDGER.md`](docs/IDEA-LEDGER.md) | All 62 unbuilt ideas from v1, and which spec owns each. |
| [`specs/ROADMAP.md`](specs/ROADMAP.md) | Twenty features, their dependencies, and a coverage matrix proving zero orphaned sections. |
| `specs/0NN-*/spec.md` | One specification per feature. |

## The state of things

- ✅ Spec Kit installed (v1.0.6, Claude integration)
- ✅ Constitution ratified
- ✅ Feature list converted to Hermes with the ripple traced
- ✅ 3D assets inventoried and hashed
- ✅ All twenty `spec.md` files written — **zero open questions**
- ✅ Brain settled: flat rate, ChatGPT plan
- ✅ `plan.md` for Tier 0 (001–004) — the four foundation features
- ⬜ `plan.md` for Tiers 1–4
- ⬜ `tasks.md` — not started
- ⬜ Application code — not started

## How you know nothing was lost

Two checks you can run yourself, any time:

```bash
python3 scripts/verify-nothing-lost.py    # every line of the old list is still there
python3 scripts/build-idea-ledger.py      # every unbuilt idea, and which spec owns it
```

- **`verify-nothing-lost.py`** takes your original 1,619-line list, applies the exact same
  rename, and checks every line survived. It currently reports **1,458 lines checked
  word-for-word, 0 missing** — with the four deliberately rewritten places named and
  explained. If anything ever goes missing, this fails and prints the line.
- **[`docs/IDEA-LEDGER.md`](docs/IDEA-LEDGER.md)** goes further. Words surviving is not the
  same as ideas surviving, so this pulls out all **62 items you planned but never built**
  (the ones with no code to remind anyone they existed) and names the spec now responsible
  for each. **Zero are unassigned.**

## The brain: settled

**Hermes rides your ChatGPT plan. Flat rate. No API costs.** Fallback is Claude on the Max
plan — both lanes flat-rate, so nothing silently starts metering.

What follows: Cost is a **usage** screen with **no dollar figures at all**; the $3/M
constant is deleted; "costs money" means real outward currency only (thinking is never a
money action); weekly caps count usage. Full consequences:
[`docs/HERMES-RIPPLE.md` §4](docs/HERMES-RIPPLE.md).

## Next steps

1. Read the constitution, the ripple analysis and the roadmap.
2. Read the four Tier 0 plans and push back on anything that looks wrong.
3. `/speckit-tasks` for Tier 0, then `/speckit-implement` — starting with the Phase 0 spike.
4. `/speckit-plan` for Tiers 1–4 once Tier 0 is proven.

**Milestone 1** is deliberately thin: features 001 → 006. One real department, one real
agent, one real conversation through Hermes, with the honesty machinery exercised end to
end. No 3D, no connectors, no Dev Room.
