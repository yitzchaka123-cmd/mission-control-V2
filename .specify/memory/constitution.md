# Mission Control Constitution

> The non-negotiable rules of the rebuild. Distilled from v1's §0 product rules and §15
> working method, plus the standing lessons of the 2026-09-02 audit (421 findings).
> Every spec, plan and task in this repository is subordinate to this document.

**The owner:** Issac, 25, Ramat Beit Shemesh, non-technical. He is the only human in the
office. Every rule below exists because it serves him.

---

## Core Principles

### I. Nothing Fake (NON-NEGOTIABLE)

No demo numbers dressed as real. No dead buttons. No placeholder that could be mistaken
for a working thing. A capability that does not exist yet is **visibly locked with a
plain-language reason** ("Hermes on your PC can't reach Telegram yet"), never hidden and
never faked.

Concretely, these are all violations, and each one is a real v1 audit finding:
- a settings card that renders state but saves nothing;
- a status pill that is hard-coded rather than read from a source;
- a dollar figure derived from a hidden rate presented as measured spend;
- a store tile for a service that has no working install path;
- a "live reasoning stream" that is scripted;
- an ornament in the 3D office displaying invented data.

When data cannot be obtained, the UI says so in the owner's words. "Not connected — start
the bridge on your office PC" is a correct answer. A plausible-looking zero is not.

### II. Built ≠ Done

**Done** = proven by a command + screenshots + Issac saw it with his own eyes.

Writing the code is the beginning of a feature, not the end. A feature is not done because
a test passes, because it typechecks, or because it looks right in a diff. v1 shipped a
memory/rules/org machinery (B1–B10) that had *never run live*, and per-room agents that
were "built, flip never run". Both were counted as built. Neither was.

Every feature carries a **Done Contract** written *before* the code, naming what will be
demonstrated and how. The 👁 verify list is the owner's, and only he can tick it.

### III. Plain Language Everywhere

The owner is non-technical. Product copy is natural, human and production-grade.

- Say **"Hermes"**, never "the engine". Name things; do not hide them behind jargon.
- No beta filler, no codenames, no developer notes on any screen the owner sees.
- Errors explain what happened and what to do, in his words.
- The product speaks the language the person **wrote in** (chat), and the dashboard
  language for greetings and chrome. English and Hebrew, RTL-correct, from day one —
  not retrofitted at 57% like v1.

### IV. One Seam To The Runtime (NON-NEGOTIABLE)

Mission Control talks to **Hermes** and to nothing else that runs agents. It never shells
out to a vendor CLI, parses a vendor's JSON, or scrapes a vendor's files.

Hermes declares its `capabilities[]` at handshake. Absent capabilities degrade the UI
honestly (Principle I); they never crash it and never fake it.

This principle is the direct fix for v1's central failure: fourteen vendor subsystems
welded into every screen, none of them owned, testable or fixable. See
`docs/HERMES-RIPPLE.md`.

### V. Irreversible Actions Always Ask

Reversible work — drafting, researching, editing locally — agents do freely.

Anything **outward or irreversible** — send, pay, post, delete, spawn — always requires an
Approval, a spend cap and a full log. **Including for a Lead.** No autonomy level, no
policy, and no room override can loosen this.

Supporting rules that inherit from it:
- Every connection power has four positions: Off · Ask · Ask-when-it-costs-money · Free.
  Defaults: **looking is free, doing asks, money always asks.**
- Fresh connections hold no room keyholes until asked for.
- The gate is enforced **inside Hermes**, where tools actually execute — never merely in
  the UI. A gate the runtime can ignore is not a gate.
- Every command from cloud to PC is HMAC-signed (2-minute freshness, nonce replay guard,
  timing-safe compare). There is no "run anything" door: the PC accepts a fixed menu.

### VI. The Owner Never Walks To The PC

Everything is drivable from the website, from Maria, or from the phone. When a step
genuinely can only happen on the PC, the product says so plainly and hands it to Home
Base — it never dead-ends and never silently waits.

Phone pings happen for exactly three things: **an approval is waiting · something broke ·
the police caught something.** Nothing else earns a buzz.

### VII. Bright, One Design System

Bright theme only. High-end, colourful, modern. No dark theme anywhere in the product
(the Dev Room's "watch it think" terminal is the single deliberate exception).

One `@theme` token block is the only source of colour, type, radius, shadow and motion.
Shared primitives are used rather than re-styled — v1 shipped **111 distinct button
styles** and **400+ contrast failures**. Every interactive control is keyboard-reachable
and meets contrast on the first pass, not in a later accessibility sweep.

### VIII. Spec Before Code (NON-NEGOTIABLE for this rebuild)

No implementation begins until the spec set is complete and the owner has approved it.
This is the owner's explicit instruction for the rebuild and the reason this repository
starts with documents instead of an app.

Every feature traces to a numbered requirement in `docs/FEATURES.md`, which in turn traces
to v1's `docs/FEATURES-V1-ORIGINAL.md`. **No feature from v1 may be dropped without the
owner saying so out loud.** Re-ordering is allowed and expected; deleting is not.

---

## Additional Constraints

### Naming
The runtime is **Hermes**. The product is **Mission Control**. The office manager is
**Maria** (renameable by the owner, and the rename ripples everywhere). "OpenClaw" appears
in this repository only inside `docs/FEATURES-V1-ORIGINAL.md` and historical notes.

### Honesty of state
A snapshot older than **3 minutes** is stale and must be labelled so. "Connected" means
fresh **and** at least one agent reporting — never a gateway probe alone. "I signed in
here" never earns a green light; only a proven action does. The truth ladder is
**Not connected → Setting up → Login proven → LIVE**, and LIVE requires that an agent used
it *and* Issac saw it.

### Data and secrets
The browser holds no database key. All reads go through an allow-listed query API; the PC
goes through its own token-scoped path. Row-level security is the second belt, never the
first. Keys typed anywhere ride the locked pipe to the PC and are never echoed back.
Personal data is walled at the **data** layer, not the login layer.

### Memory
One brain for everything. Every save is stamped `{floor, author, room/agent}` and every
read is filtered. "Forget that" deletes every copy and lands in a 30-day trash. Facts are
superseded with dates, never silently overwritten.

---

## Development Workflow

### The Build-and-Prove loop
1. **Done Contract** written before any code — what will be demonstrated, and how.
2. **Ripple map** — every screen, store, row and copy string the change touches.
3. Build the **vertical slice** on real data. Never a horizontal layer with nothing behind it.
4. **Prove**: typecheck → build → key scan → dead-control sweep → unit → integration →
   acceptance for the touched screens. Screenshots in the chat.
5. **Wiring inventory**: "X of X controls click-tested, 0 dead ends."
6. 👁 add to the owner's verify list. Only he closes it.

### Gates
Nothing merges unproven. The dead-control sweep (banned stand-ins: demo text, empty
handlers, `#` links, TODOs, fake alerts) and the key scan are blocking, not advisory.

### One task at a time
Foundation first. Calculate backwards from the finished app. No hacks, no loose ends, and
no second task started before the first is proven. This is the discipline whose absence
left v1 at 421 findings.

---

## Governance

This constitution supersedes all other practices, including anything in a spec, plan or
task that contradicts it. Where a spec and this document disagree, this document wins and
the spec is wrong.

- Every plan runs a **Constitution Check** before design and again after. A violation must
  be either removed or recorded in the plan's Complexity Tracking with a justification the
  owner accepts.
- Amendments require the owner's explicit approval, a version bump, and a note of what
  changed and why.
- Principles I, II, IV, V and VIII are marked NON-NEGOTIABLE: they may be clarified but not
  weakened, and never waived for convenience or speed.

**The standing lesson, kept verbatim from the audit:** *a gap list is worth nothing until
someone has pressed every control in the running app and looked at the screenshots.*

**Version**: 1.0.0 | **Ratified**: 2026-09-09 | **Last Amended**: 2026-09-09
