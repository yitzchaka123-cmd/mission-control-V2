# OpenClaw → Hermes: the ripple analysis

> Written 2026-09-09, before any code, as the first act of the rebuild.
> Source: `docs/FEATURES-V1-ORIGINAL.md` (the 1,619-line v1 feature list, 50 mentions of
> OpenClaw across 47 lines).
> **Purpose:** the swap is not a find-and-replace. OpenClaw supplied fourteen separate
> subsystems. This document names every one, decides what happens to it, and traces the
> consequence into every feature that depended on it.

---

## 0. The decision, stated plainly

**Hermes is the named contract between Mission Control and whatever runs the agents.**
It is a small, versioned service on the owner's PC with an HTTP/WS API. Mission Control
talks only to Hermes. It never again shells out to a vendor CLI, parses a vendor's JSON,
or scrapes a vendor's transcript files.

Behind that contract sit **capability providers**. Milestone 1 ships exactly one — *Hermes
Core*, a thin Node service that does the four things Mission Control genuinely cannot live
without. Everything else OpenClaw used to hand over for free becomes an **optional
capability**, declared by Hermes at handshake, and absent capabilities degrade the UI
honestly instead of breaking it.

That last sentence is not new policy. It is v1's own rule, finally enforceable:

> *"Nothing fake: no demo numbers dressed as real, no dead buttons. A thing that can't work
> yet is visibly locked with a reason."* — v1 §0

### Why this is the right shape (the opinion you asked for)

You said v1 got "way too complicated" and you could not finish it. The ripple below shows
*why*, mechanically. Mission Control was welded to fourteen OpenClaw surfaces at once. Every
screen assumed a subsystem it did not own, could not test, and could not fix. The
2026-09-02 audit's headline findings are almost all this one disease:

- "the whole memory / rules / org machinery (B1–B10) has never run live"
- "per-room agents don't exist live" (built, flip never run)
- "the office never reads OpenClaw"
- "~40 dead-end store tiles" (tiles generated from a catalog you did not control)
- "every MCP registration other than supermemory is still unproven"

A named seam with declared capabilities fixes the disease rather than the symptoms. It also
means **you can finish Milestone 1 without a single connector working**, which is the whole
point.

**One honest caveat, stated up front:** OpenClaw handed you 42 skill tiles, 13 chat
channels, a plugin system, browser automation and a cron daemon for free. Owning Hermes
means none of those are free any more. See §3 — *what the swap costs* — for the full bill.
I think the trade is clearly worth it, and §3 explains why the honest loss is far smaller
than the raw numbers suggest.

---

## 1. The fourteen subsystems, and the verdict on each

OpenClaw was doing all of this. Each row is a decision the rebuild must make on purpose.

| # | Subsystem OpenClaw supplied | v1 surface | Verdict |
|---|---|---|---|
| 1 | Agent turn execution (`agent --message --session-key --thinking --model`) | every chat, task, council turn | **Hermes Core — required, M1** |
| 2 | Session registry (`sessions --json`) | snapshot, Cost witness, Dev Room | **Hermes Core — required, M1** |
| 3 | Agent registry (`agents list`) | roster reconciliation, `rooms_migrate` | **Dropped — Mission Control already owns the roster** |
| 4 | Gateway process + `health` | status pill, System health, Home Base lights | **Hermes Core — required, M1 (simplified)** |
| 5 | Chat channels ×13 (`channels add/login/status`) | §8.2 D1–D13, phone lane | **Capability — only Telegram required; 12 deferred** |
| 6 | Skills catalog (42 tiles, `skills.entries.<skill>.apiKey`) | the entire Connections store | **Mission Control owns its own catalog** |
| 7 | Plugin system (`plugins install/enable/…`) | "Your engine's library" 🧩 half | **Dropped** |
| 8 | MCP mounting (`mcp add/probe/…`) | supermemory, engine library ◈ | **Capability — Hermes is an MCP *client*** |
| 9 | Secrets (`secrets configure/apply/audit`) | the Vault's PC half | **Hermes Core — required, M1** |
| 10 | `approvals` / `exec-policy` enforcement | the money gate (⬜ never built) | **Hermes Core — and now actually buildable** |
| 11 | Cron daemon (`cron list --json`) | Calendar panel, Playbooks (⬜) | **Hermes Core scheduler — and now buildable** |
| 12 | Brains: GPT-5.5 via ChatGPT OAuth, flat cost | §2.10, the whole Cost screen | **⚠ OPEN QUESTION — see §4** |
| 13 | Browser automation (managed profile) | AliExpress (D2) | **Capability — deferred** |
| 14 | Transcripts as JSONL on disk | transcript mirror, "Watch it think", silent-turn watcher | **Hermes emits a real event stream** |

### The Hermes Core contract (rows 1, 2, 4, 9, 10, 11)

Four verbs and a handshake. That is the entire required surface:

```
GET  /hermes/hello      → { version, capabilities[], brains[] }
POST /hermes/turn       → run one agent turn on a session key, stream events
GET  /hermes/sessions   → live sessions, token counts, ages
GET  /hermes/health     → gateway ok, heartbeat, per-capability probes
POST /hermes/secrets    → write a secret; never read back
```

`capabilities[]` is the honesty mechanism. If `channels.telegram` is absent, the phone
mirror row is locked with "Hermes on your PC can't reach Telegram yet" instead of silently
failing. If `cron` is absent, the Calendar's recurring-jobs panel says so.

---

## 2. Feature-by-feature ripple

Numbered ripples (**R#**) are referenced from `docs/FEATURES.md` wherever a v1 feature
changed meaning. Section numbers are v1's.

### R1 — Naming and copy (§0, §3, §7, everywhere)
- The standing rule *"Say 'OpenClaw', never 'engine'"* becomes **"Say 'Hermes', never
  'engine'"**. It survives intact — the point was always to name the thing rather than
  hide it behind jargon.
- Every user-facing string carries over with the name swapped: the top-bar status pill,
  "Not connected · start the bridge on your office PC", "I can't reach the office
  computer", "waiting for the PC".
- **Loss:** `https://openclaw.ai` was a real external "official page" link. Hermes is
  yours, so there is no third-party page. The Connections store's per-tile "official page
  link" must now be sourced **per service** (Slack's page, Notion's page), never per
  engine. This was arguably always the correct behaviour.

### R2 — The roster stops having two masters (§1, §2.9)
v1 kept *who exists* in two places: OpenClaw's agent list and Mission Control's `mc_setup`
departments. Reconciling them required the `rooms_migrate` command — back up
`openclaw.json`, patch it, verify, flip — and §2.9 records the honest outcome: **"built /
⏸ flip never run."** The office still ran on one agent with per-room session keys.

Under Hermes, a room *is* a session namespace. There is nothing to migrate.

- **Dissolved:** §2.9's whole migration project; the `rooms_migrate` bridge command;
  the "Today the office still runs on ONE agent" caveat.
- **Now free:** per-room agents, per-worker sessions, the promotion of a worker from
  "light session" to "full agent" (§1.3) — all of it is just session-key policy.
- **Session keys** carry over in shape, renamed: `hermes:main` (Maria),
  `hermes:room:<slug>`, `hermes:room:<slug>:w:<worker>`, `hermes:police`.
- Audit finding *"per-room agents don't exist live"* is retired by construction.

### R3 — The Connections store stops being someone else's catalog (§3.14, §8)
This is the deepest ripple. v1's store tiles were **born from OpenClaw's own skills
catalog**, refreshed from the PC every 12h into a cloud row: 42 live tiles (9 ready, 27
needing setup, 6 Mac-only) + 12 channel tiles + 41 "through the dev room" tiles.

With no OpenClaw there is no catalog to be born from. **Mission Control must own a static,
versioned connector manifest in the repo.**

- **This is an improvement, not a loss.** The audit found *"~40 dead-end store tiles"* and
  *"11 known-bad wizard journeys"* — precisely because the store advertised a vendor's
  capabilities rather than what had been built and proven. A repo-owned manifest can only
  list what exists.
- The **truth ladder** (Not connected → Setting up → Login proven → LIVE) survives
  unchanged; it was always the right idea.
- The **five lanes** (§8.1) reduce to three: KEY, CHANNEL, MCP/API. The HELPER+OWN-LOGIN
  lane and its 17 helper programs (E1–E17) become deferred capabilities. DEV-ROOM lane
  (⬜, never built) survives as a plan.
- The **shared installer recipe** format (§8.3) survives intact and is now more useful —
  it becomes the *source* of the catalog rather than a decoration on top of a vendor's.
- The "Mac-only, gray" tiles disappear: nothing is Mac-only when you own the runtime.

### R4 — Chat channels collapse from thirteen to one (§8.2, §10)
v1 built and specced 13 channel connectors (D1–D13: Telegram, AliExpress, WhatsApp, Slack,
Discord, Google Chat, Teams, Signal, iMessage, LINE, SMS/Twilio, Matrix, Twitch), each with
a shared wizard, a live probe, adopt-a-running-bot and a logout path.

Only **one** is load-bearing. §10 is explicit: Telegram is Maria's channel, WhatsApp was
rejected on ban/privacy grounds, and phone pings exist for exactly three moments
(approvals waiting · something broke · a police catch).

- **M1 requires:** Telegram only.
- **Deferred, specs kept verbatim:** the other 12. Their per-service field lists,
  wizard steps and probe designs are preserved in `docs/FEATURES.md` §8.2 — nothing is
  thrown away, it is queued.
- **Single biggest complexity cut in the entire rebuild.** Twelve OAuth/token/QR/Docker
  onboarding flows leave the critical path.

### R5 — The bridge gets much thinner, but still exists (§6)
The bridge is still needed: the PC is behind NAT, the cloud cannot reach in, so something
must poll. But most of what it did was *CLI translation*, and that work evaporates.

| v1 bridge job | Under Hermes |
|---|---|
| spawn `sessions --json`, `agents list`, `health`, `cron list` every 20s | one `GET /hermes/health` + `/hermes/sessions` |
| "the fix for the 30 node.exe probe storm" (overlap guard) | **problem does not exist** — no process spawning |
| 3-retry health with flaky gateway probe | Hermes reports its own state |
| read session JSONL by byte offset for the transcript mirror | Hermes emits events (R8) |
| silent-turn watcher reading the trajectory log | Hermes reports turn outcome directly (R8) |
| 13 `channel_configure` + 13 `_logout` command kinds | 1 (Telegram), 12 deferred |
| `rooms_migrate` | deleted (R2) |
| `set_secret` (only when no lock exists) | `POST /hermes/secrets`, always locked |
| `engine_restart` (detached gateway restart) | `hermes restart`, same shape |

- **Survives unchanged and must:** the **office lock** — HMAC-SHA256 over
  `kind|ts|nonce|payload`, 2-minute freshness, nonce replay guard, timing-safe compare.
  This is the security boundary and the swap does not touch it.
- **Survives:** the snapshot push (~20s), the command pull (~2s), the fixed command menu
  with **no "run anything" door**, the cloud-lane modes (door / direct / none).
- The 20s/2s cadence and the 3-minute freshness rule survive (§12.5).

### R6 — Honesty machinery gets simpler and more truthful (§5.4, §6.5, §9)
Three separate v1 mechanisms existed only because OpenClaw would not tell you what
happened to a turn:

1. **Silent-turn watcher** — read the trajectory log, spot a run that answered nobody,
   retry once, then apologise.
2. **Transcript mirror** — read the session JSONL by byte offset, skip website turns and
   dashboard-prefixed system text.
3. **"Watch it think" (DR6)** — tail each session's transcript, only new bytes, match the
   project folder, *"ambiguity = honestly no view."*

All three are scraping hacks around a missing event stream. Hermes emits one:
`turn.started · tool.called · text.delta · turn.ended{status}`.

- The silent-turn watcher **is deleted**: `turn.ended{status:"empty"}` is reported, not inferred.
- The transcript mirror becomes a **subscription**, not a file tail.
- "Watch it think" becomes reliable, and the honest *"ambiguity = no view"* fallback is no
  longer routinely hit.
- **Preserved exactly:** the timings and the copy — ~2¾ min patience, ~30s asleep verdict,
  ~5 min late-reply watch, the outbox ("Saved ✅ — your office computer is asleep 💤"),
  and the rule that a late reply lands in the same thread. Those are product decisions,
  not engine artifacts.

### R7 — The money gate becomes real (§2.3, §8.1)
v1 designed the four-position switch (Off · Ask · Ask-when-it-costs-money · Free) and built
the *UI* for it, but §8.1 records the truth: **"Enforcement of grants on the engine
(`approvals` / `exec-policy`) ⬜"** — never built. The gate could not be enforced because
the thing executing tools belonged to someone else.

Hermes Core executes the tools. The gate moves to where it belongs.

- `use_power` stops being a request the engine may ignore and becomes the **only** path
  a tool call can take.
- Per-agent grants (⬜ in v1) and per-use paid-API gating (⬜) become buildable.
- **Preserved:** the defaults (looking is free, doing asks, money always asks), the
  optional 🔐 4-digit code, the reversible/irreversible split (§2.2), fresh connections
  holding no keyholes until asked.

### R8 — Scheduling comes home; automation becomes possible (§3.7, §3.8)
v1's crons lived on the PC inside OpenClaw. Consequences it had to live with, all recorded
honestly in the doc:

- Calendar could show crons but **not draw them on the grid** — "Jobs scheduled on your
  office computer aren't drawn on the grid" + a *Show them* button as consolation.
- The cron "Run now" button was **locked**: "the schedule runs itself on the PC".
- §3.7's Playbooks could only be *"Trigger: Run by hand"*; triggered playbooks and
  watch-folders were ⬜ "Phase J — Automation that runs".
- §9: **"⚠ PC-side schedules don't pause for Shabbos yet."**

Hermes owns the scheduler, so all four resolve:
- crons draw on the Calendar grid;
- "Run now" unlocks;
- Playbook = recipe, Cron = timer, watch-folder = trigger — all three can finally fire;
- **Shabbos mode extends to schedules**, closing a real halachic gap. The three LOCKED
  Shabbos switches (pause non-urgent crons · keep coding running · keep backups running)
  become live switches.

### R9 — Memory: mostly untouched, one clarification (§2.5, §11)
supermemory was reached two ways: **REST** (`/v3/documents` with container tags) and **MCP**
registered into OpenClaw.

- REST path: **unchanged**. Containers, the five floors, `doors.mjs` enforcement, the
  stamp/filter rules, the 30-day trash, superseding, the Mover — all carry over verbatim.
- MCP path: Hermes must be an **MCP client**. That is the one new requirement.
- The "rooms can use it · n tools" pill now reflects **Hermes's** MCP mounts.
- §11's ⬜ *"proper secret storage for the key on the PC (Phase-4 gate)"* is satisfied by
  Hermes Core's secrets store (subsystem 9) rather than deferred.

### R10 — The Dev Room is almost untouched (§9)
Worth stating clearly because it is the one large system the swap barely reaches:
**Dexter was never an OpenClaw agent.** §1.1 is explicit — he is a Claude Code session on
the PC with the Telegram plugin. The Helper, the dispatch contract, per-project sessions,
the autonomy dial, the message design, the Max-plan rule: all survive verbatim.

Two small touch-points only:
- Dexter's shared memory via supermemory MCP → follows R9.
- His generated rules file (Chapter 1 + Dev Room chapter + his page) → follows R11.

### R11 — Rulebook and Police: unchanged in substance (§2.6, §3.13)
The rulebook is Mission Control's own data (Supabase master + Library copy). The police
patrol and nightly librarian ran *as agent sessions*, so they follow R2 — they become
Hermes sessions (`hermes:police`) with no other change. Chapters, the ~20-rule soft cap,
the clash-files-both rule, report-only policing, the assembled briefing (§2.7): all verbatim.

### R12 — Home Base: the setup wizard changes, the shell does not (§7)
- Wizard §7.4 was: ① Get Node → ② `npm i -g openclaw@2026.6.10` → ③ sign in to ChatGPT →
  ④ start the office. Becomes: ① Get Node → ② install Hermes → ③ **connect a brain (see §4)**
  → ④ start the office.
- The four lights become **Hermes · Messenger · Brain · Memory**. The good/warn/bad/off
  states, the 3-minute freshness and the "haven't heard yet" ≠ "off" distinction survive.
- `openclaw doctor` → `hermes doctor`; the All clear / A few things / Run again shape survives.
- "auto-fix ChatGPT login" and the 🔑 *Fix my login* banner depend entirely on §4.
- Everything else — tray, hotkeys (Ctrl+Shift+M / Ctrl+Shift+N), watchdog, shared folders,
  the plain-English feed, Issac's 12 locked design answers — is engine-agnostic and survives.

### R13 — Data model renames (§12)
| v1 | Hermes |
|---|---|
| table `openclaw_live` (id `snapshot`) | `hermes_live` |
| `mc.openclaw.snapshot` (localStorage) | `mc.hermes.snapshot` |
| env `OPENCLAW_CMD` | `HERMES_URL`, `HERMES_TOKEN` |
| `~/.openclaw/openclaw.json` | `%PROGRAMDATA%\Hermes\hermes.json` |
| `~/.openclaw/agents/main/sessions/*.jsonl` | Hermes event log (R6) |
| `skills.entries.<skill>.apiKey` | Hermes secrets store |
| `mc.engine.lastseen.v1` | unchanged (already engine-neutral) |

Snapshot shape (§6.2) survives field-for-field except: the `plugins` half of engine library
is dropped (subsystem 7), `connector statuses` now come from our own manifest (R3), and
per-channel live probes reduce to Telegram (R4).

---

## 3. What the swap costs — the honest bill

Stated plainly, because the analysis is worthless if it only lists wins.

| Lost | Raw size | Honest size |
|---|---|---|
| OpenClaw skills catalog | 42 tiles | ~9 were "ready"; the audit called ~40 store tiles dead ends |
| Chat channels | 13 built | 1 is load-bearing (§10); 11 were never verified by Issac (§8.2 "👁 verify items 1–45 wait on Issac") |
| Helper-lane programs E1–E17 | 17 | 3 reached 🟢 (OpenAI STT, Weather, Google) |
| Plugin system | whole subsystem | zero plugins were in use |
| Browser automation | 1 connector | AliExpress only, ⏸ unverified |
| Flat-rate ChatGPT brain | cost architecture | **genuinely valuable — see §4** |

Everything in that table except the last row was already unproven in v1. The audit's own
standing lesson applies: *"a gap list is worth nothing until someone has pressed every
control in the running app."* By that standard, the swap costs far less than the raw
numbers suggest.

**The last row is a real cost and must not be hand-waved.**

---

## 4. ⚠ The one genuinely open question: the brain and its cost model

v1 §2.10: *"Primary GPT-5.5 via ChatGPT OAuth (flat cost); fallback Claude Sonnet 4.6."*
The parenthesis is the important part. OpenClaw rode the **ChatGPT subscription**, so
running the office was flat-rate — agents could think without metering.

That single fact is load-bearing across the product:
- §3.15 **Cost screen** — the whole screen. The audit already called the $3-per-million-
  tokens figure *"fiction because the plan is flat-rate."*
- §3.4 Home's *Today's cost* widget; the "honest plan-rider cost widget (covered by your
  ChatGPT plan)" idea.
- §3.10 Council's **credit guard** at 20 messages and the "💚 What this council costs" card.
- §2.3 the money gate's *"Ask-when-it-costs-money"* position — which needs a definition of
  "costs money" that flat-rate makes almost vacuous and metered makes central.
- §3.15 weekly caps per room and the Run gate that refuses paid work at the cap.
- §7 Home Base's ChatGPT-login light and "auto-fix ChatGPT login" watchdog.

**Three candidate answers, to be settled in `/speckit-clarify` before the Cost and
Approvals specs are finalised:**

- **(a) Hermes keeps riding a subscription** (ChatGPT and/or Claude Max). Preserves flat
  cost; Cost becomes a *usage* screen, not a *spend* screen; the credit guard becomes a
  quota guard. Depends on terms permitting programmatic use.
- **(b) Hermes uses metered APIs.** Cost becomes real and the $3/M estimate stops being
  fiction — the audit's complaint resolves. But the office now costs money per turn, and
  every cap, gate and guard becomes load-bearing rather than decorative.
- **(c) Both, selectable per room/worker** — v1 already had a per-room brain picker
  (§3.22), so the UI exists. Most honest, most work.

**This is the only question in the whole ripple that the specs cannot answer for you.**
Everything else above is decided.

---

## 5. Net effect on the rebuild

**Leaves the critical path** (specced, queued, nothing deleted): 12 chat channels · 17
helper programs · the plugin system · browser automation · the OpenClaw skills catalog ·
`rooms_migrate` and the per-room-agent flip · the silent-turn watcher · the transcript
byte-offset mirror.

**Becomes buildable that never was** (all ⬜ or ⚠ in v1): money-gate enforcement · per-agent
grants · per-use paid-API gating · crons drawn on the Calendar grid · cron "Run now" ·
triggered playbooks · watch-folder triggers · Shabbos-aware scheduling · reliable
"Watch it think" · per-room agents live.

**Unchanged and carried over verbatim:** the office lock and its HMAC discipline · the
memory doors and five floors · the rulebook, police and librarian · the Dev Room in full ·
the approvals deck and the reversible/irreversible split · every constant in §12.5 · the
3D office in full · Home Base's shell, tray, hotkeys and watchdog · all product copy and
honesty rules.
