# Implementation Plan: Hermes runtime contract

**Branch**: `claude/dazzling-dirac-th0asg` | **Date**: 2026-09-09
**Spec**: [`spec.md`](./spec.md) | **Tier**: 0 (foundation) | **Milestone**: 1

## Summary

Build **Hermes Core**: a small Node/TypeScript service on the owner's Windows PC that owns
sessions, runs agent turns, emits a real event stream, enforces the tool gate, and runs the
scheduler. Mission Control talks to it and to nothing else that runs agents.

The turn itself is delegated to a **brain adapter** — one file, one interface — that drives a
first-party agent runner signed into the owner's **ChatGPT plan** (flat rate, no API costs).

## Technical Context

**Language/Version**: TypeScript on Node 22 (matches the v1 PC toolchain and Home Base's Electron runtime)
**Primary Dependencies**: deliberately few — an HTTP server, an MCP client, a scheduler. No agent framework.
**Storage**: local JSON/SQLite state under `%PROGRAMDATA%\Hermes\`; secrets via Windows DPAPI
**Testing**: Vitest for units; a contract test suite that any brain adapter must pass
**Target Platform**: Windows 11, localhost only (never binds a public interface)
**Project Type**: local service (HTTP + Server-Sent Events)
**Constraints**: flat-rate brains only · no vendor coupling outside the adapter · fixed command surface
**Scale/Scope**: one owner, ~10–30 concurrent sessions, one PC

## Constitution Check

| Principle | How this plan satisfies it |
|---|---|
| **I. Nothing Fake** | `capabilities[]` is machine-readable; absent capabilities lock their UI with a reason. Health distinguishes absent · degraded · healthy. |
| **II. Built ≠ Done** | The adapter spike (Phase 0) must be demonstrated on Issac's own PC before anything is built on it. |
| **III. Plain Language** | Every health and capability state carries an owner-facing sentence, authored here, not generated. |
| **IV. One Seam** | ✅ This *is* the seam. Vendor coupling is confined to `adapters/` and proven by a grep gate (020). |
| **V. Irreversible Asks** | The gate is a single chokepoint inside tool execution. No tool call can reach a side effect without passing it. |
| **VI. Never Walk To The PC** | Hermes exposes everything the website needs; PC-only steps are declared capabilities, not dead ends. |
| **VII. Bright, One System** | N/A — no UI in this feature. |
| **VIII. Spec Before Code** | This plan follows an approved spec with zero open questions. |

**Result: PASS.** One item goes to Complexity Tracking (the adapter's vendor coupling — see below).

---

## The decisions

### D1 — Hermes is a local HTTP service, not a library or a CLI

**Decision**: A long-running Node process on `127.0.0.1`, speaking HTTP with Server-Sent
Events for the turn stream.

**Why**: The bridge (002), Home Base (017) and the Dev Room helper (016) all need to reach
it from separate processes. A library cannot serve three consumers; a CLI would recreate
exactly the parsing-and-spawning problem v1 had (its bridge spawned four processes every 20
seconds — the "30 node.exe probe storm").

**Rejected**: an in-process library (only serves one consumer); a CLI (reintroduces spawn
cost and output parsing); gRPC or WebSocket-only (more machinery than a localhost service needs;
SSE covers the one streaming case).

### D2 — The brain is reached through an adapter, and the adapter is one file

**Decision**: A `BrainAdapter` interface with exactly one implementation on the critical path:
a first-party agent runner signed into the owner's **ChatGPT plan**. A second adapter drives
Claude on the **Max plan** as fallback. Both are flat-rate.

```ts
interface BrainAdapter {
  id: string                       // 'chatgpt-plan' | 'claude-max'
  login(): Promise<LoginState>     // signed-in | expiring | signed-out
  run(turn: TurnRequest): AsyncIterable<TurnEvent>
  capabilities(): Capability[]
}
```

**Why**: This is the whole architectural point of v2. v1 spread vendor knowledge across
fourteen subsystems and every screen. Here it lives behind one interface, in one directory,
and the proof gate greps to keep it that way. Swapping brains later is a file, not a rewrite.

**⚠ The honest tension.** Constitution Principle IV says the app never drives a vendor CLI —
and the flat-rate requirement means Hermes almost certainly *must*, because riding a
subscription is only possible through a first-party tool that supports plan sign-in. These do
not actually conflict: Principle IV constrains **Mission Control**, and Hermes is the seam
that absorbs exactly this coupling. But it is the one place the two rules meet, so it is
recorded in Complexity Tracking rather than glossed over.

### D3 — The riskiest assumption gets proven first, before anything is built on it

**Decision**: Phase 0 is a throwaway spike on Issac's own PC that answers four questions and
nothing else:

1. Can a first-party runner sign in with his ChatGPT plan and complete a turn, non-interactively?
2. Can we read a **structured** result (text, tool calls, completion status) rather than scraping console output?
3. What does an expired plan login look like from outside, and can we detect it cleanly?
4. Does a second concurrent session work, or is there a single-session limit?

**Why**: Everything in Milestone 1 rests on this. If the answer to (1) or (2) is bad, the plan
changes — and it is far cheaper to learn that in a two-hour spike than after 002, 003 and 005
are built on top. This is Principle II applied to a *design assumption* rather than a feature.

**If the spike fails**: the fallback is the Claude Max adapter, which is **already proven
working on his PC** (the Dev Room has run on it since 2026-08-17). Milestone 1 proceeds either
way; only the brain identity changes. This is why the adapter interface is worth having on day one.

### D4 — Sessions are ours, durable, and serialised per key

**Decision**: Hermes owns a session store on disk keyed by session key
(`hermes:main`, `hermes:room:<slug>`, `hermes:room:<slug>:w:<worker>`, `hermes:police`).
A room requires no provisioning: first use creates it. Turns on one key are serialised.

**Why**: This is ripple R2 cashed in. v1 kept "who exists" in two places and needed a
migration it never dared run. Here the roster lives in Mission Control's database and Hermes
just namespaces conversations — so per-room agents are free.

### D5 — One event stream, and it reports the truth about a turn

**Decision**: `turn.started · tool.called · text.delta · turn.ended{status}` where status is
`ok | empty | error | interrupted | awaiting-approval`. Emitted over SSE, and every turn's
terminal state is also durable so a dropped stream can be recovered by polling.

**Why**: This deletes three v1 mechanisms outright (R6) — the silent-turn watcher, the
transcript byte-offset mirror, and the "watch it think" file tail. `empty` is *reported*, not
inferred. A dropped connection must never strand a turn, hence durability alongside the stream.

### D6 — The gate is a chokepoint, not a policy consulted politely

**Decision**: Every tool invocation passes through one function. It resolves the power's gate
position (Off · Ask · Ask-when-it-costs-money · Free) and the power's **declared money flag**
before any side effect. Blocked and awaiting-approval calls have no effect at all.

**Why**: v1 built the switches and recorded honestly that engine enforcement was never built —
so they were decoration. The only way this is real is if it is structurally impossible to
route around, which means one chokepoint that owns tool dispatch.

**Flat-rate consequence**: agent thinking is never a money action. `money` is a property
declared per power in the connector manifest (011), and an **undeclared power defaults to
money = true** — the safe direction.

### D7 — Secrets are write-only

**Decision**: `POST /hermes/secrets` writes; nothing reads back. Stored via Windows DPAPI,
scoped to the machine account.

**Why**: Satisfies v1's deferred Phase-4 gate ("proper secret storage for the key on the PC")
at the start rather than the end, and makes "keys are never echoed" enforceable rather than
merely intended.

### D8 — The scheduler lives here

**Decision**: An in-process scheduler with durable job state, supporting fire, run-now, and a
caller-supplied **hold window**.

**Why**: Ripple R8. This single decision unlocks four things v1 had to apologise for: crons
drawn on the calendar grid, an unlocked "Run now", triggered playbooks, and Shabbos-aware
scheduling. The hold window is supplied by the caller rather than computed here, so Hermes
stays ignorant of the Jewish calendar and 013 owns that logic.

---

## Project structure

```
hermes/
  src/
    server/        hello · turn · sessions · health · secrets  (the five verbs)
    sessions/      session store, per-key serialisation
    events/        the turn event stream + durable terminal state
    gate/          the single tool-dispatch chokepoint
    scheduler/     jobs, hold windows, run-now
    mcp/           MCP client (for the memory engine, 009)
    secrets/       DPAPI write-only store
    capabilities/  the declared roster + probes
    adapters/      ← the ONLY directory that may know a vendor's name
      chatgpt-plan/
      claude-max/
  tests/
    contract/      the suite EVERY adapter must pass
    unit/
```

**Structure decision**: `hermes/` is a sibling of the web app, not a package inside it. It
ships to the PC; the website never imports from it. They share only a generated types file
describing the contract.

---

## Phases

| Phase | What | Exit condition |
|---|---|---|
| **0 · Spike** | Prove the ChatGPT-plan adapter on Issac's PC (D3) | The four questions answered, in writing, with a real turn completed. **Blocks the adapter implementation and the contract-test content — see the correction below.** |
| **1 · Contract** | The five verbs, sessions, the event stream | A turn runs end-to-end on `hermes:main` and streams events |
| **2 · Honesty** | `capabilities[]`, health, probes, login state | An absent capability is declared, not failed; an expired login is a named state |
| **3 · Gate** | The tool-dispatch chokepoint | A blocked call demonstrably has zero side effects |
| **4 · Scheduler** | Jobs, run-now, hold windows | A job fires, is held in a window, and the hold is logged |
| **5 · MCP** | MCP client for the memory engine | A probe passes before anything shows green |

Phases 3–5 can proceed in parallel once 1 and 2 land.

### ⚠ Correction to this plan (2026-09-09, during implementation)

This plan originally said the spike **"blocks everything"**. That was wrong, and stating it
plainly is cheaper than quietly working around it.

The spike answers questions about **the brain**. It does not touch the session store, the
event stream, the HTTP server, the gate or the scheduler — all of which are deliberately
brain-agnostic. Blocking them on it would have meant sitting idle for no safety gain.

What the spike genuinely blocks:
- **the `chatgpt-plan` adapter implementation** — it is the thing being validated;
- **the contract-test suite's content** — the tasks say it is derived from the findings.

Everything else in Phase 2 may proceed. The `BrainAdapter` interface may be written
provisionally, since the spike may amend it.

**This correction is itself evidence the seam design is right.** If a bad spike result
forced a rewrite of the session store, the abstraction would be in the wrong place. It
doesn't, so it isn't.

---

## Risks

| Risk | Likelihood | Response |
|---|---|---|
| The ChatGPT-plan runner cannot be driven non-interactively | Medium | **Phase 0 spike finds out first.** Fallback: the Claude Max adapter, already proven on his PC. |
| Structured output unavailable; only console text | Medium | Spike question 2. If text-only, the adapter parses in one contained place — never leaking upward. |
| Plan login expires mid-day | **High — expected** | Not an outage. A first-class health state (FR-019) with a plain sentence and a Home Base fix banner (017). v1 grew a login watchdog for exactly this reason. |
| Provider terms change for programmatic plan use | Low, high impact | The adapter interface means switching to the Claude Max lane is a config change, not a rewrite. This is the main reason D2 exists. |
| Single-session limits on the plan | Medium | Spike question 4. If limited, sessions queue through the serialiser rather than failing — degraded, declared, honest. |

---

## Complexity Tracking

| Item | Why it is justified |
|---|---|
| **The adapter drives a vendor CLI** (D2) | Riding a flat-rate subscription is only possible through a first-party tool. The coupling is confined to `adapters/`, covered by a contract test suite, and enforced by a grep gate in 020. Rejected alternative — a metered API — was ruled out by the owner's flat-rate decision. |
| **Two adapters instead of one** | The second (Claude Max) is already running on his PC and is the fallback that keeps Milestone 1 unblocked if the spike fails. Its cost is one file implementing an interface that must exist anyway. |

---

## Idea ledger check

[`docs/IDEA-LEDGER.md`](../../docs/IDEA-LEDGER.md) lists **0 unbuilt v1 ideas** against this
feature's sections (§2.7, §2.9, §2.10, §6.6). Nothing to schedule or defer.

Two v1 items in these sections are **dissolved rather than deferred**, and both are recorded
in `docs/HERMES-RIPPLE.md`: the per-room-agent flip (R2 — free by construction here) and the
silent-turn watcher (R6 — replaced by `turn.ended{status}`, D5).
