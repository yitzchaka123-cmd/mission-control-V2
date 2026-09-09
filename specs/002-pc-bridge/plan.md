# Implementation Plan: The PC bridge

**Branch**: `claude/dazzling-dirac-th0asg` | **Date**: 2026-09-09
**Spec**: [`spec.md`](./spec.md) | **Tier**: 0 | **Milestone**: 1 | **Depends on**: 001

## Summary

A plain Node program on the PC that carries state out to the cloud and commands in. It is
the courier and the security boundary — nothing more. Most of v1's bridge was CLI
translation, and that work is gone (R5).

## Technical Context

**Language/Version**: JavaScript on Node 22 — **no dependencies**
**Storage**: local JSON state files under the Home Base data folder
**Testing**: Node's built-in test runner; a replay suite over recorded real log lines
**Target Platform**: Windows 11, started by Home Base or from a Startup shortcut
**Constraints**: zero subprocess spawning per tick · fixed command menu · HMAC on every command
**Scale/Scope**: 20 s snapshot push, 2 s command pull, one owner

## Constitution Check

| Principle | How |
|---|---|
| **I. Nothing Fake** | "Connected" requires fresh **and** an agent reporting. Absence of data is never a zero. |
| **II. Built ≠ Done** | Signature refusal, replay refusal and the sleeping-PC round trip are each demonstrated, not asserted. |
| **III. Plain Language** | Every state the bridge publishes carries an owner-facing sentence. |
| **IV. One Seam** | The bridge calls Hermes over HTTP. It contains no vendor knowledge at all. |
| **V. Irreversible Asks** | The command menu is fixed and enumerable. There is no "run anything" door. |
| **VI. Never Walk To The PC** | This feature *is* the mechanism for that principle. |
| **VIII. Spec Before Code** | Spec approved, zero open questions. |

**Result: PASS.** No complexity entries.

---

## The decisions

### D1 — No dependencies, still

**Decision**: Keep v1's rule. Plain Node, standard library only.

**Why**: It self-installs, it is auditable end to end, and it cannot break because a
transitive package changed. This program holds the HMAC boundary; its supply chain should be
empty. v1 proved this is achievable for exactly this job.

### D2 — Separate process from Hermes

**Decision**: Hermes and the bridge are two processes, both started by Home Base.

**Why**: Hermes is the risky part — it drives a vendor runner and holds a plan login. The
courier must survive Hermes crashing, precisely so the website can *report* that Hermes is
down. Merging them would mean a Hermes crash produces silence, which is the one thing the
honesty rules forbid.

**Rejected**: one process (a crash blinds the website); the bridge as a Home Base thread
(couples transport to a GUI app, and v1 deliberately allowed the bridge to run standalone).

### D3 — The tick reads two endpoints, and spawns nothing

**Decision**: Each 20 s tick is `GET /hermes/health` + `GET /hermes/sessions`, then build and
push the snapshot.

**Why**: This is R5 cashed in. v1 spawned four CLI processes per tick and needed an overlap
guard to survive the resulting "30 node.exe probe storm". Two HTTP calls make that class of
bug structurally impossible. The overlap guard stays anyway — cheap insurance against a slow
cloud write, not against process storms.

### D4 — The office lock is unchanged, deliberately

**Decision**: HMAC-SHA256 over `kind|ts|nonce|payload`, 2-minute freshness, nonce replay
guard, timing-safe compare. Carried over from v1 exactly.

**Why**: It is the security boundary of the whole product and it was sound. A rebuild is the
worst moment to redesign the one piece that was already right. The one change: `set_secret`
loses its "only when no lock exists" exception — secrets now always go through the locked
path (001 D7).

### D5 — Cost is witnessed by difference, and never invented

**Decision**: Each tick records per-session lifetime token totals. First sighting sets a
baseline contributing zero. A drop means a restart and re-baselines. Only growth is
attributed. Nothing is written to the cloud when no growth was seen.

**Why**: This is the only defensible foundation for 012, and 012's whole point is that the
audit caught v1 inventing figures. **Flat-rate note**: this records *usage*, not spend. No
currency is computed here or anywhere.

### D6 — The transcript mirror subscribes; the silent-turn watcher is not built

**Decision**: Subscribe to Hermes's event stream. Do not read files. Do not infer emptiness.

**Why**: R6. `turn.ended{status:"empty"}` is reported by Hermes (001 D5), so the watcher has
nothing left to do. Deleting a whole subsystem is the cheapest possible outcome.

### D7 — Three cloud lanes, and it says which one it is on

**Decision**: door mode (bridge token → the server's REST path), direct mode (local
credentials file), or none (local files only). The active lane is published in the snapshot.

**Why**: v1's audit found *"'your PC is asleep' shown with no cloud at all"* — the product
could not distinguish "no PC" from "no cloud". Publishing the lane makes that distinction
available to every screen.

---

## Project structure

```
bridge/
  bridge.mjs          entry; the two loops
  snapshot.mjs        build the snapshot from Hermes
  commands.mjs        pull, verify, dispatch, write back
  lock.mjs            HMAC sign/verify, nonce store
  cost.mjs            token-growth witness
  journals.mjs        the verbatim record (zero tokens, written by code)
  outbox.mjs          messages parked for a sleeping PC
  files.mjs           bounded read-only workspace walk
  cloud/              door | direct | none
  test/               replay suite over recorded real log lines
```

---

## Phases

| Phase | What | Exit condition |
|---|---|---|
| **1 · Courier** | Tick, snapshot, push; command pull and write-back | A snapshot lands every 20 s; a command round-trips |
| **2 · Lock** | HMAC sign/verify, freshness, nonce replay | A replayed and a stale command are both refused, provably |
| **3 · Honesty** | Freshness, connected-means-agent, cloud-lane reporting | Three distinct offline states are distinguishable on screen |
| **4 · Outbox** | Park, deliver, land late replies in the same thread | Send asleep → wake → reply lands in the original thread |
| **5 · Witness** | Token growth, journals, workspace walk | Figures reconcile; a restart causes no double-count |

---

## Risks

| Risk | Response |
|---|---|
| Cloud unreachable for a long period | Keep local state, report the gap, never discard observations. The lane is published so screens stay honest. |
| PC clock skew breaks signature freshness | Report clock skew as a **named health problem**, not a mystery failure. |
| Two bridges started at once | Refuse to start, loudly. Single-instance check on boot. |
| A command result exceeds the row limit | Truncate with an explicit marker — never silently. |

---

## Idea ledger check

[`docs/IDEA-LEDGER.md`](../../docs/IDEA-LEDGER.md) lists **0 unbuilt v1 ideas** against §6.
Nothing to schedule or defer.

One v1 item is **dissolved**: the transcript byte-offset mirror and the silent-turn watcher
become a subscription (D6, ripple R6).
