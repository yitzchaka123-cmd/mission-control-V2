# Mission Control — THE COMPLETE FEATURE LIST (Hermes rebuild)

> **This is the working feature list for the rebuild.** It is v1's complete 1,619-line
> feature list, carried over line for line, with `OpenClaw` replaced by **Hermes** and with
> the consequences of that swap traced through every affected feature.
>
> The untouched original is preserved at `docs/FEATURES-V1-ORIGINAL.md`. The reasoning
> behind every change is in `docs/HERMES-RIPPLE.md`.
>
> **Nothing was dropped.** Where the swap removes a feature from the critical path, the
> feature is still described in full and marked deferred — never deleted. Per the
> constitution (Principle VIII): *no feature from v1 may be dropped without the owner
> saying so out loud.*

## ⚠ How to read the status marks

**The status marks in this document describe v1, not this repository.**

In this repository **nothing is built yet.** Not one line of application code exists. The
marks are kept because they are valuable evidence — they record what was genuinely proven
once, what was only planned, and what turned out to be fake. That is exactly the
information a rebuild needs in order to estimate honestly. But they are **history, not
status**, and treating them as status would violate Principle I (Nothing Fake).

v1's marks, unchanged in meaning:
> ✅ built · 🟢 confirmed working live by Issac · 🔄 half-built / partly real ·
> ⬜ planned, not built · ⏭ parked · ⏸ built but waiting on Issac's PC / eyes to prove.
> Honest to the 2026-09-02 professional audit (421 findings). Where the audit found a
> "built" thing to be fake or never run live, that is noted.

The rebuild's own status lives in `specs/` and in the task lists, never here.

## Ripple markers

Where the Hermes swap changed a feature's meaning, the line carries a marker such as
**[R4]**, pointing at the numbered ripple in `docs/HERMES-RIPPLE.md` §2. The twelve
ripples in brief:

| | Ripple |
|---|---|
| **R1** | Naming and copy; no third-party "official page" link for the runtime |
| **R2** | The roster stops having two masters — per-room agents come free, `rooms_migrate` dissolves |
| **R3** | The Connections store stops being a vendor's catalog and becomes a repo-owned manifest |
| **R4** | Chat channels collapse from thirteen to one required (Telegram); twelve deferred |
| **R5** | The bridge gets much thinner but still exists |
| **R6** | Honesty machinery simplifies — a real event stream replaces three scraping hacks |
| **R7** | The money gate becomes actually enforceable |
| **R8** | Scheduling comes home; triggered automation and Shabbos-aware crons become possible |
| **R9** | Memory unchanged, except Hermes must be an MCP client |
| **R10** | The Dev Room is almost untouched |
| **R11** | Rulebook and Police unchanged in substance |
| **R12** | Home Base's setup wizard changes; its shell does not |
| **R13** | Data-model renames |

**✅ The brain question is settled** (Issac, 2026-09-09): **Hermes rides the ChatGPT plan,
flat rate, no API costs.** Fallback is Claude on the Max plan — both lanes flat-rate. So:
Cost is a **usage** screen with **no dollar figures**, the $3/M constant is **deleted**,
"costs money" means **real outward currency only** (thinking is free), and Home Base's
plan-login watchdog is load-bearing. Full consequences: `docs/HERMES-RIPPLE.md` §4.

---

## 0. What this is

Two products, one idea: run your whole work-and-home life as a team of AI "departments" in a
bright, walkable 3D office, run by an AI office manager named **Maria**, with you as the only human.

1. **Hermes** — the agent runtime on the owner's Windows PC. It is the brain-runner: the
   only thing Mission Control ever talks to that runs agents. **[R1]** Hermes is a small,
   versioned service with an HTTP/WS API — `hello` (version + `capabilities[]` + brains),
   `turn`, `sessions`, `health`, `secrets` — plus a scheduler and the tool-execution gate.
   It replaces v1's OpenClaw dependency, which supplied fourteen separate subsystems and
   welded all of them into every screen. Capabilities Hermes does not have are declared
   absent at handshake, and the UI locks them with a plain reason rather than faking them.
   ⚠ Which brain it runs, and whether that brain is flat-rate or metered, is the one open
   question — see `docs/HERMES-RIPPLE.md` §4.
2. **Mission Control** (this repo) — the dashboard website + 3D office + a Windows companion app
   ("Home Base") + a small messenger program ("the bridge") that links the PC to the cloud, + a
   Dev Room coordinator ("Dexter") that runs coding sessions on the PC.

The owner: **Issac**, 25, Ramat Beit Shemesh, non-technical, hates dark themes, wants plain
language, visual progress, and everything provable. Phase I (later) turns it into a public product
anyone can sign up for.

**Non-negotiable product rules** (they shape every feature):
- Bright theme only. High-end, colorful, modern.
- Plain, natural language everywhere in the product. Say "Hermes", never "engine".
- Production-grade copy only. No beta filler, no dev notes on screens.
- Nothing fake: no demo numbers dressed as real, no dead buttons. A thing that can't work yet is
  visibly locked with a reason ("coming in Phase X").
- Built ≠ done. Done = proven by a command + screenshots + Issac saw it.
- The owner must never have to walk to the PC: everything drivable from the website, Maria, or the phone.

---

## 1. The people and the org chart

```
Issac (👑 the only human — approves the big stuff; "CEO · Issac")
└── Aaron — the CEO AGENT: runs PERSONAL behind a hard wall, sees everything
    in the business, says little. Maria reports to him. Room: "CEO Office".
    └── Maria — Office Manager / Chief of Staff: runs the whole business floor.
        Room: "Office Management" (biggest, most important room; her workers live there)
        ├── Room managers (one lead per department) — hire & fire their workers
        ├── Dexter — Dev Room manager (room "Development"): dispatches Claude Code sessions
        ├── Max — Maintenance lead (room "Maintenance"): keeps Hermes and the pipes healthy
        ├── 🚓 Police Station — Officer Stone (chief) + Officer Barak (deputy): read logs
        │   against the rulebook, REPORT ONLY, never punish
        └── Workers — light sessions inside their room's agent; promoted to a full agent
            only when they earn their own tools
```

### 1.1 Roles in detail
- **Maria** ✅ — Office Manager · Chief of Staff, 🧑‍💼, avatar "M". Renameable in Settings (rename
  ripples everywhere). Marvel house-style; single front door / concierge; round reception desk facing
  the entrance; knows every business; routes, hands off ("← Maria"), arbitrates. Builds the office by
  talking. Memory-aware (see/add/forget on your say-so). Knows the app's screen map ("where's the button
  for X?"), answers history questions from the activity log, patrols for credit waste. Her judgment
  (promotions etc.) = rule cards in her rulebook chapter. A woman; 3D model walks in on first visit.
- **Aaron** ✅ roster / ⏸ live — CEO agent (`ceo-aaron`), room "CEO Office". Only Aaron and Issac may
  write to the Personal Vault. Personal-management team lives in the CEO room. Personal asks that reach
  Maria → she warns + asks approval first, then passes up.
- **Dexter** 🟢 — Development room lead. A Claude Code session on the PC (NOT a Hermes agent), talked
  to on Telegram, dispatches coding tasks to one Claude Code session per project.
- **Max** ✅ roster — Maintenance lead. Maintenance = where office changes are discussed ("move the
  couch"); planned: a master developer with access to Mission Control's own code (fixes on approval).
- **Officer Stone + Officer Barak** ✅ roster / ⏸ first patrol — Police Station (`sys-police`),
  props 🚓📋🔦⚖️. Night patrol, contradiction check on every new rule, credit watch, dashboard
  reports with evidence.
- **System rooms** ✅ (always present, never removable, valid everywhere a room can be picked/filtered):
  `sys-mgmt` Office Management (lead Maria, wise, 4 desks) · `sys-dev` Development (Dexter, precise,
  settable colour default `#0ea5e9`) · `sys-maint` Maintenance (Max, precise) · `sys-police` Police
  Station (Stone, precise, 2 desks) · plus the **CEO Office** (Issac's own room, with a vibe).
- **Demo roster** (pre-setup sample office): Office Manager · Development Manager · Pepper (Email &
  paperwork, CEO Office) · Wanda (Designer) · Jarvis (Dept lead) · Friday (Developer) · Vision
  (Support) · Fury (Researcher) · Quill (Social & content) · Loki (Content writer). Background NPCs:
  wife + baby (planned pet "Clawy").
- **Lead name pool**: Pepper, Jarvis, Friday, Vision, Wanda, Fury, Quill, Loki, Hawk, Stark, Banner,
  Romanoff, Rogers, Strange, Parker, Rhodes, Danvers, Barton, Odin, Shuri.

### 1.2 Personalities (6) ✅
warm "Warm & friendly" 😊 · precise "Calm & precise" 🎯 · energetic "Fast & energetic" ⚡ ·
workhorse "Serious workhorse" 💪 · creative "Creative & playful" 🎨 · wise "Wise & thoughtful" 🦉.
A **living personality engine** (`personality.ts`): traits + a live mood that reacts to real events
(praised, task done, sent back, fired, colleague fired, hired, promoted), colleagues react by temper,
trait drift + experience log; the mood line joins every agent briefing and colours the voice.

### 1.3 The career ladder (autonomy) ✅
- **Intern** (ask-first; every action needs a nod) → **Specialist** (free inside its lane) →
  **Lead** (full; can guide workers, propose hires, delegate/spawn).
- Every new or spawned worker is born Intern. Spawning is gated by a global "ask me first" default
  plus a per-department override.
- Promotions: manager proposes → Maria approves → Issac told ("⬆ Ask Maria" button; Issac's own
  dropdown overrides).
- **Temp / hot-desk workers**: Temp box on the Hire row → ⏳ TEMP tag → "Make permanent" clears the
  tag on the same id; retire keeps the tag; rehire returns the same still-temp worker.
- **Fired ≠ deleted**: retiring freezes the worker's memory drawer, rulebook page, personality and
  pair-journals into the Archive; rehire restores everything. Retired workers stay visible on the
  dashboard. Rehire = the AI argues "experience vs fresh eyes" out loud ("🗣 Her take"), Issac decides.
  A worker's 3D character is 1:1 with the worker and reused on rehire.
- Workers = light sessions inside the room's agent; promoted to a full agent when they need their own tools.

### 1.4 Issac's departments (the real office)
| # | Department | What | Accounts |
|---|---|---|---|
| 1 | Personal | paperwork, government, bills, house, family | personal Google; WALLED OFF (Aaron) |
| 2 | Yesh Magnetim | magnet photography business; calendar events, files→Drive; management software (coding) | Google |
| 3 | TzviAir | employer / day job; coding | separate account, Zoho |
| 4 | Photoshop / "RBS Store" | a store in Ramat Beit Shemesh (name to confirm) | — |
| 5 | Studio / Mystery Studio (ClueCrafter) | mid-build coding project under a Development Manager | — |
| 6 | Lashon Hatov / Lashon Atov | coding / content project | — |
| + | The Newmans (Newmans Production Studio), Sandbox | seen as real rooms in the live office | — |

### 1.5 Business types (onboarding catalog; each furnishes its room with fitting props) ✅
photography 📸 violet (2 desks, Portfolio shelf, 📷💡🖼️🖨️) · retail 🛍️ amber (Catalog shelf,
🛒🧾🏷️🧺) · software 💻 sky (3 desks, Docs shelf, 🖥️⌨️🗄️🧠) · content 🎬 rose (Script shelf,
🎙️🎥💡✂️) · education 📚 teal (Lesson library, ✏️🗒️🎓🗂️) · food 🍽️ orange (1 desk, Recipe shelf,
🍳📋☕🧊) · services 🔧 indigo (Job-file shelf, 🔧📐📞🗂️) · personal 🏠 emerald (1 desk, Records
shelf, 🗂️🪴📬🗓️) · general 🏢 slate (Bookcase, 🪴📊🗂️☕).
System types: management 🏛️ `#7c3aed` 4 desks · devroom 🛠️ · maintroom 🔧 (Runbook shelf) ·
police 🚓 `#1e40af` (The rulebook stand).
**CEO room vibes**: Mission command 🚀 · Cozy lounge 🛋️ · Arcade corner 🕹️ · Zen garden 🧘 · Trophy room 🏆.

### 1.6 How updates flow (the update ladder) ✅ design
workers → manager (live) · manager → Maria "boss update" (what I did today / what's stuck / what's
next) · Maria → Issac morning briefing (Start My Day) · **phone pings ONLY for**: approvals waiting ·
something broke · a police catch. Agents talk directly to each other; every exchange is logged in a
pair-journal; Issac gets quiet summaries.

### 1.7 Tool requests ✅ design / 🔄 built
Agent hits a wall → walks to Maria or Dexter (logged) → prepared through the Connections system →
Issac approves every grant via one Approvals card ("Ada wants Sheets access for the Newmans room —
allow?") → the tool attaches scoped and revocable, visible in Connections.

---

## 2. Locked architecture (the foundation a rebuild must lay first)

### 2.1 Three-layer foundation
1. **Vault** — keys/logins stored once ON THE PC with Hermes; agents request a capability, never
   see raw keys. Website side = the Connections screen + grant/"allow?" system on top.
2. **Memory** — layered (Desk / Room / Office); visible, editable, "forget" works; narrower scope wins.
3. **Policies / the Rulebook** — office-wide + per-room overrides; hard limits a room can't loosen;
   versioned, audited, revocable; read-back on dangerous changes.

### 2.2 Reversible vs irreversible ✅
Reversible (draft / research / edit locally) = agents do freely. Irreversible / outward (send, pay,
post, delete, spawn) = ALWAYS Approvals + spend cap + full log, even for a Lead.

### 2.3 The money gate ✅ (`actionGate.ts`, bridge `use_power`)
Every connection power has a four-position switch: **Off → blocked · Ask → Approvals · Ask-when-
it-costs-money → Approvals only for money actions · Free → runs on its own.** Defaults: looking is
free, doing asks, money always asks. Fresh connections default to Ask and hold no room keyholes
until asked. Optional 🔐 4-digit code per connection for sensitive changes.

> **[R7] Now actually enforceable.** In v1 the four-way switch had a UI but no teeth: §8.1 records *"enforcement of grants on the engine (`approvals`/`exec-policy`) ⬜"* — never built, because the thing executing tools belonged to a vendor. Hermes Core executes the tools, so the gate moves to where it belongs and `use_power` becomes the only path a tool call can take. Per-agent grants and per-use paid-API gating (both ⬜ in v1) become buildable.

### 2.4 The Personal wall ✅ (connection half) / ⬜ (task + memory half)
Wall the DATA, not the login. A per-connection 🔒 Personal toggle walls it off from every business
room; only Personal-side rooms (a Personal dept + the CEO Office) may hold a standing key; walling
drops any business key it had; Maria refuses to bridge it and offers **one-time access** instead
(Maria requests → you approve → used for that one task → closes itself).

### 2.5 Memory — three shelves, five floors, tagged doors (Master Memory Plan, sealed 2026-08-21)
| Shelf | Store | Holds |
|---|---|---|
| 📚 The Library | supermemory (cloud; the Mover can bring it to the PC) | facts, learnings, rulebook copy, done-task summaries, conversation summaries, journal index |
| 🗄️ The Filing Cabinet | Supabase | tasks, approvals, rulebook MASTER, who's working on what, live status — queried live, never copied |
| 🎙️ The Recorder | journals + transcripts | every word verbatim; Issac's daily journal; one journal per agent pair; fired agents' history |

Five floors, all inside supermemory, enforced in code (`doors.mjs`):
🔒 **Personal Vault** (sealed container `mission-control-personal`; Aaron + Issac only; Maria by
one-time protocol) · 🏢 **Office Floor** (all business agents) · 🚪 **Room Shelves** (that room + Maria +
Aaron + police) · 🗄️ **Agent Drawers** (owner only; others knock, logged) · 🗃️ **The Archive** (fired
agents, frozen whole).

Door matrix: Aaron opens everything; Maria everything but the Vault; Police read all business;
managers/workers/Dexter: office + own room + own drawer, ask for the rest.

Memory rules: every save stamped {floor, author, room/agent}; every read filtered · "remember this"
in any chat lands on the right floor with a one-line receipt · "forget that" = ONE delete hits every
copy → 30-day trash · superseding: new fact dated, old stamped "was true until <date>" · agents
self-correct by superseding (Changes view) · ONE brain for everything (no separate memory helper) ·
end of every conversation → dated summary into the Library with a pointer to the recording ·
done task → dated Library note · **the Mover**: Settings switch Cloud ↔ This PC, copies every memory
with tags, counts both sides, deletes nothing until confirmed.

### 2.6 The Rulebook + the Police (P2 picks)
One book, three chapters: **office → room → agent** (one page per agent, fired ones kept).
Master copy = the Policies store in the Cabinet; searchable copy in the Library. A rule card = plain
sentence + 📍 chapter + 🗣️ said-by + 📅 date + version. Life of a rule: said anywhere ("always /
never / from now on") → filed instantly → "📕 Filed: Chapter 1, rule 23" + one-tap undo → instant
police check of the new rule vs the book → carried at the top of every agent's every briefing →
full cross-sweep at the nightly patrol. A **clash files BOTH** rules and asks Issac; until answered
agents follow the newer one marked "pending Issac's call". **Soft cap ~20 active rules per
chapter**; the nightly **librarian** proposes merges/retirements. Police **report only**.

### 2.7 Assembled briefings ✅ (bridge)
Every agent's every session starts with: Chapter 1 + its room chapter + its own page + its current
personality/mood line + ONE office-status text (one builder for every channel).

### 2.8 One conversation everywhere (P5 picks)
Maria is ONE session across website, Telegram and voice. Website ↔ Telegram full two-way sync;
every agent's chat mirrors to Telegram as SILENT messages; every line marked with its door 🖥️
website · 📱 Telegram · 🎤 voice; voice notes transcribed into the journals; backfill of history on
day one. Real phone pings only for approvals / broken / police.

### 2.9 Every room = its own agent — **[R2] dissolved: now free by construction**
Rooms get their own agent; workers are light sessions inside it. Session keys: Maria
`hermes:main` · rooms `hermes:room:<slug>` · workers `hermes:room:<slug>:w:<name>` ·
police `hermes:police`. Website, Telegram and voice share Maria's one thread.

**What changed.** In v1 this was ✅ built / ⏸ *flip never run* — the office still ran on ONE
agent with per-room session keys, because *who exists* lived in two places at once
(OpenClaw's agent list and Mission Control's `mc_setup` departments). Reconciling them
needed a whole migration (`rooms_migrate`: back up the config, patch it, verify, flip)
that was never dared. Under Hermes a room **is** a session namespace, so there is nothing
to migrate and no second master. The migration project, the `rooms_migrate` command and
the "today the office still runs on ONE agent" caveat are all deleted, and the audit
finding *"per-room agents don't exist live"* is retired by construction. Promoting a
worker from a light session to a full agent (§1.3) becomes session-key policy.

### 2.10 Brain
Primary GPT-5.5 via ChatGPT OAuth (flat cost); fallback Claude Sonnet 4.6; switch between tasks, not
mid-task. Selectable per room/worker: `openai/gpt-5.5`, `gpt-5.5-pro`, `gpt-5.4-mini`,
`claude-cli/claude-sonnet-4-6`, `claude-cli/claude-opus-4-8`; thinking Quick / Balanced / Deep sent
as real `--model` / `--thinking` flags. Dev Room coding = Claude Code on the Max plan (never API
credits; Sonnet default, Opus deliberately).

> **✅ SETTLED — flat rate, on the ChatGPT plan.** (Issac, 2026-09-09.) The subscription was always the cost architecture and it stays; the fallback is Claude on the Max plan, so **both lanes are flat-rate and no path silently starts metering**. Consequences: Cost (§3.15) is a **usage** screen showing tokens and plan usage with **no dollar figures**; the $3/M constant is **deleted**; the money gate's *ask-when-it-costs-money* position means **real outward currency only** — a paid connection, a purchase, a payment — and **thinking is never "costs money"**; weekly caps count usage; the Council guard (§3.10) is a quota-and-attention guard; Home Base's plan-login watchdog (§7) is load-bearing, because a subscription login can go stale in a way an API key does not. See `docs/HERMES-RIPPLE.md` §4.

### 2.11 Connections (the three doors)
The UI = buttons over Hermes's OWN setup. Three doors: native Hermes connectors → MCP adapter
socket → custom wraps built by the Development room. One tile = one ACCOUNT (multi-account
first-class). Honest ladder: Not connected → Setting up → Login proven → LIVE (an agent used it AND
Issac saw). PC-only steps happen in Home Base; the website does what it can and plainly says "finish
on your PC". Keys typed anywhere ride a locked pipe to the PC.

> **[R3] The catalog changes owner.** v1's tiles were *born from OpenClaw's own skills catalog*, refreshed from the PC every 12h. With no vendor there is no catalog to be born from, so **Mission Control owns a static, versioned connector manifest in the repo**. This is an improvement: the audit found *~40 dead-end store tiles* and *11 known-bad wizard journeys* precisely because the store advertised a vendor's capabilities rather than what had been built. A repo-owned manifest can only list what exists. The truth ladder and the shared installer recipes (§8.3) survive unchanged — the recipes now *are* the catalog. The "Mac-only, gray" tiles disappear: nothing is Mac-only when you own the runtime.

### 2.12 Security
- Server-side front door (code compared on the server, signed 12-hour HttpOnly cookie, 5 wrong in
  10 min → 15-min lock, durable counter). Placeholder code 0331 until accounts.
- Accounts (behind `MC_ACCOUNTS=1`): Supabase Auth email + password; `owner_id` on every office row;
  row-level security; every website query pinned to the signed-in owner AND run with the person's
  own token; per-office hashed bridge tokens; delete-my-account; rate limits per door (429).
- Browser holds NO database key; all data goes through `/api/data` (allow-listed query shapes) and the
  PC through `/api/rest/*` with its bridge token. Key-scan test proves no key in the built page.
- Office lock: every command to the PC is HMAC-signed with a passphrase (2-min freshness, nonce
  replay guard); the snapshot is signed too.
- Phase-4 gate named requirements: mandatory owner tag (done in migration 0004), proper secret
  storage for the memory key on the PC, backups, Sentry, rate limits, delete-my-account.

### 2.13 Tech stack (as built)
React 19 + TypeScript + Vite + Tailwind v4 + lucide-react; three / React-Three-Fiber / drei /
postprocessing for the 3D office; zustand + localStorage stores mirrored to Supabase rows; Vercel
serverless functions (`api-src/*.ts` → `api/*.js`); Supabase (Postgres + Auth); Vitest + Playwright;
PWA (manifest + service worker); Electron for Home Base; plain Node (no deps) for the bridge;
PowerShell for the Dexter installer; GitHub Actions for cloud QA and the installer build; Vercel
auto-deploys `main`. Design tokens: canvas `#f5f6fb`, brand violet `#7c3aed` / `#6D5EF8`, Inter body +
Fraunces display, radius 8/12/16/pill, three shadows, 150/220 ms motion, focus ring, reduced-motion.

---

## 3. The web app — screen by screen

Rail order: Home · Happening · Projects · Playbooks · Calendar · Office · Council · Approvals ·
Memory · Rulebook · Connections · Cost · Docs · Activity · Notifications · Dev Room · Settings
(Files lives under Settings; a department workspace opens by clicking a department in the rail;
Landing at `/`). Census: 406 interactive controls across 18 screens, 0 dead ends.

### 3.0 Shell, routing, gates, global behaviour ✅
- **Routes** (`/app` + slug): `missions`, `projects`, `playbooks`, `calendar`, `office` (legacy
  `/office` works for QA), `council`, `approvals`, `memory`, `rulebook`, `connections`, `cost`,
  `docs`, `files`, `activity`, `notifications`, `dev-room`, `settings`; room workspace
  `/app/room/<name>`. Deep links `?item=<id>` (open that row) and `?q=<words>` (search). Browser
  Back/Forward work. Standalone modes: `?chat=maria` (Maria window for Home Base), `?capture=1[&text=]`
  (quick-note window), `?view=connections` (connections hub window), `?solo=<assetId>` (3D asset viewer).
- **Gates in order**: front door (keypad, or sign-in when accounts are on) → Maria's walk-in intro
  (once) → onboarding wizard (until an office exists).
- **Chrome**: collapsible sidebar (56 px icon rail when the Office is immersive; off-canvas drawer on
  phones), top bar (hidden on the immersive Office), offline banner ("you're offline — showing your
  last view"), data-health banner (red "couldn't load your office… showing the demo, not your data" +
  Try again; slim blue "Loading your office…"), skip-to-content link (first Tab stop).
- **Sidebar**: logo · 17 nav items with an unread badge on Notifications and rule-count badges on
  Rulebook chapters · "Meet your Office Manager" (pre-setup; replays the intro) · Departments list
  with worker chips and ⭐ pin (pinned rooms float to the top, per-browser) · "Start my day" card ·
  tagline "your AI team HQ" · collapsed icon rail with expand toggle.
- **Top bar**: mobile menu · real time-of-day greeting with the owner's name + today's date (Hebrew
  locale when set) or the screen's title/subtitle · Hermes status pill (live / off, from the PC
  snapshot) · search button (opens ⌘K) · 🐙 button ("Everything's working!" overlay: octopus conductor
  with swinging tentacles, hoverable working tools, gears, sun/clouds, sparkles, conveyor belt) ·
  ↩️ global Undo dropdown (only when something is undoable; names the last change) · 🔔 bell dropdown ·
  "Online" chip (audit: static, P1). Under small widths the 🐙 hides and chips slim to icons.
- **Keyboard**: Cmd/Ctrl+K command bar; Escape closes palette / Start-my-day / End-of-day / busy
  scene / wizard / intro; Ctrl/Cmd+Z, Shift+Z, Y = undo/redo in office edit mode; keyboard digits at
  the door; ←→↑↓ Enter Z C in the memory graph; arrow-key nudges in the office editor.
- **Boot**: asks the door once, wipes another person's cached office, hydrates every store from the
  cloud (12 hydrators, 2.5 s cap), starts the outbox watcher (20 s poll for replies that landed while
  the PC was asleep), sets text direction, boots error reporting.
- **App-wide events** (any store write refreshes every screen): setup changed, tasks changed, activity
  changed, requests changed, pins changed, outbox changed/landed, DB retry, open chat, open Maria, open
  agent, navigate, Dev Room colour changed, open assembly, signal.
- **Design system**: tokens in one `@theme` block (canvas/surface/ink/brand/state colours, 11→36 px
  type scale, four radii, three shadows), app-wide focus ring, reduced-motion honoured, Inter body,
  Fraunces display, landing animation classes. Shared primitives: StatTile, Skeleton, Pill, Card,
  PageHeader, EmptyState (first-use · no-results · cleared · done · offline), ErrorState, Sheet,
  ConfirmDialog (themed, replaces native confirm), ListSearch, Explain ("?" popover), LockedButton
  (dimmed, cursor-not-allowed, tap shows the same reason as the tooltip), AgentLink (name → that
  agent's room chat), BrandLogo (generated SVG map + category fallbacks), EmptyNote.
- **Hebrew + RTL** ✅ (57 % coverage per audit): one English-keyed dictionary (~880 strings) → Hebrew;
  `tr()`, `trT(template, vars)` for data-built sentences, `trChat()` for canned chat lines; page
  direction flips at boot; Settings → Language (English / עברית, reload). **Chat language rule**:
  Maria and every room answer in the language the person WROTE in, never the dashboard setting;
  greetings use the dashboard language. Hebrew day letters on the calendar; RTL-safe dropdown
  anchoring (PA-3).
- **PWA** ✅: manifest (name "Mission Control", start `/app`, standalone, theme `#6366f1`), service
  worker (network-first pages, cache-first hashed assets), Add-to-Home-Screen on Android, iOS
  apple-touch meta. Off-canvas nav + responsive pass 390–1440 px across every main screen.
- **Accessibility** (audit, open): 31 rail tab-stops, cards not focusable, 400+ contrast failures,
  111 button styles. PA-4 added the skip link + focusable cards.

### 3.1 Landing page (`/`) ✅
Public marketing page, no data. Fixed nav (logo, anchors Departments / Features / How it works /
The Office, "Sign in" → `/app`, "See it live"). Hero "Run your business like you have a hundred
people"; primary CTA "Create your account" when accounts are on, else "See the live office"; "Tour
the live demo"; illustration panel labelled *illustration* (4 generic rooms + "Everything's working"
chip; sample numbers "14 tasks done", "$2.18 spent", "2 approvals waiting"). Marquee strip. Six
department cards (generic names). Bento features (3D Office, Tinder-style approvals, Memory,
Happening board, The Council, Start My Day) + three assurance cards (It asks first · Walled
departments · Runs on Shabbos rules). How it works (3 steps). Office teaser. Closing CTA. Footer.
Reveal-on-scroll, aurora background, grain. Translated + RTL-aware. Fake waitlist deleted. Audit P1:
Issac's private businesses were listed on the landing (removed).
Phase I plan ⬜: a breathtaking landing FIRST → email/password/forgot sign-up → download Home Base →
guided setup → Office-Manager-led onboarding (big intro animation → gorgeous chat interview → she
builds the new client's office); Google sign-in at the very end; verified Google app.

### 3.2 Front door and sign-in ✅
- **Keypad door** (`DoorGate`): 0–9 + backspace, 4 dots, welcome line with the owner's name, error line
  with tries left; keyboard digits work; code compared on the server; signed 12-hour HttpOnly cookie;
  5 wrong in 10 min → 15-min lock (durable counter in the DB); "not set up" state lists the missing
  server settings by name; Settings "Lock now". Placeholder code 0331 (temporary).
- **Sign-in** (`AuthGate`, accounts mode): one card, three modes (sign in / create account / reset
  password); email + password (min 8) checks; Supabase Auth behind `/api/auth`; wrong-password
  throttle; Settings "Signed in as … / Sign out / Delete my account (confirm)". Earlier: a 4-digit
  PIN lock with remember-this-device (salted hash) — replaced by the server door.

### 3.3 First run: Maria's walk-in intro + the setup wizard ✅
- **Maria intro**: full-screen 3D stage; Maria's rigged model (professional woman: blazer + glasses,
  warm 3-light studio) walks in on her walk clip, turns to the camera, does a real arm-bone wave; a
  Sim-style speech bubble TYPES "Hi, I'm Maria — how may I help you?" (spoken aloud when a voice key
  exists, with voice-driven head motion); buttons "Let's build my office" → wizard / "Maybe later" →
  demo office; never auto-shows twice; QA hook exposes ready/phase/wave/snap. Mouth-sync is beyond the
  baked model (no morph targets) — logged; "THE LIVING MARIA" (face rig, visemes, lip-sync, gesture set,
  emotional realtime voice) ⬜.
- **Setup wizard** (Maria-led, chat-styled): intro → your name (CEO name + optional company name) →
  departments (add bullets, pick a business type chip) → people (lead name from the pool, personality)
  → CEO room vibe → office (keep the hand-built 3D map vs a fresh default floor) → done ("Enter my
  office" reloads). Right pane = live office preview (rooms, desks, bookcase, props, "Building your
  office…", "N desks"). Removing a department fires the personality "soul engine" (a firing event).
  Saves `mc.setup.v1` + the cloud row `mc_setup/me`. Settings → "Edit my setup" / "Set up my office" /
  "Restore demo data" (confirm-gated after the audit). Hebrew.
- Vision ⬜: **interview-first room creation** — when asked to add a room Maria interviews first (what
  the business does, how it runs, what "done" looks like), then designs a detailed room with matching
  props and a fitting character, shows a sketch/plan + cost, and builds only on approval.
  **Guided new-business onboarding** (P2-L) ⬜. **Whole-app first-run tour** ⬜.

### 3.4 Home ✅ (24 controls)
- **Editable widget grid**: Edit mode (drag-reorder, move ◀▶, remove ✕, resize cycle 1→2→4
  columns / small→wide→full), "Add widget" library drawer, Reset (confirm); layout + spans persisted;
  silent autosave. Demo (pre-setup) figures are labelled "demo office · sample figures".
- **Hermes status card** on top (see 3.24).
- **Banners**: office paused (+ Un-pause) · "While you were away" digest (after ≥30 real minutes
  away: for-your-OK / drafts / access asks / moved tasks, each a link; "Got it") · "Wrap up my day"
  evening banner (from 15:00).
- **Widgets** (all real after setup): Agents active (working/total) · Tasks in queue (+ "for your OK"
  sub-line) · Today's cost ($ estimate + tokens) · System health (live snapshot; honest "Not connected
  · start the bridge on your office PC") — each with a "?" Explain popover · Mission queue (6 stage
  tiles → board, "Open board") · Latest activity (live "right now" rows with clickable agent names +
  real history with real times) · Departments (Working/Idle chips) · This week's spend (gradient card
  + 7 real day bars) · Spend trend (line chart) · Cost by department (donut) · Next scheduled (soonest
  dated task, else first Scheduled) · Talk to Maria · Start my day · 👑 The Weekly Assembly · Dev Room
  (running / queued / last result, live from the PC).
- Ideas 💡: everything-clickable drill-down (click "5 sessions" → see them); honest plan-rider cost
  widget ("covered by your ChatGPT plan").

### 3.5 Happening — the Missions board ✅ (14 controls)
- Six columns **Ideas → New → Scheduled → In progress → For your OK → Done** (internal keys Ideas /
  Inbox / Scheduled / In Progress / Review / Done — labels only), counts, per-column "+", empty states.
- Toolbar: department chips (All + every real room incl. system rooms; "Development" only when the
  Dev Room has reported; own row under 640 px) · search · **Add a task** · **Select** toggle.
- Drag-and-drop between columns (desktop) + a "Move to" picker on every card under 1024 px + a Stage
  picker in the detail panel; one shared move path behind all of them; moves persist.
- **Saved views** bar: "Save this view" → one-tap chips, × deletes with confirm.
- **Select mode + bulk bar**: move all to any column; approve all when every pick is in For your OK.
- **Cards**: dept chip, priority flag (High/Low), title, progress bar (only real numbers, e.g. Dev
  Room), tool chips, agent link, comment badge, due chip; Enter/Space opens; checkbox in Select mode.
- **Dev Room strip**: live coding cards from the PC (one source of truth, not draggable) + "Open the
  Dev Room"; quiet-day line.
- **Detail panel** (right drawer): Stage select · Priority select · Assigned to · Due · Progress ·
  Tools (honestly empty until powers are used) · Tags · "Where this came from" · **Story** (created →
  notes → stage moves → reported result; the per-task "why" trace) · Conversation with a comment box
  (signed by the owner, dated) · **Take to Council** (room pre-picked, question pre-typed) · Escape
  closes with focus return.
- **Add-a-task bubble**: stage-specific title ("Add an idea" / "Add a task"…), room select, talk-to
  toggle (🏢 Maria vs 👤 the room lead), that person's real recent thread (one saved thread per person,
  shared with the big chat and the voice orb; greeting seeds once), "↗ Open the full chat", gray ghost
  text per column with Tab-to-fill, pending quick-add with due date + priority + confirm. Live: asks the
  real manager; still-working (late reply lands), asleep (outbox), applies Maria's hidden actions.
- Pre-setup demo board: amber "nothing here is kept" note. Send-back-with-instructions saves the
  note ON the task, returns it to New, tells the room through the real lane (PA-1).
- ⬜ Comments & @mentions; live sessions on cards (engine link); cross-team task category.

### 3.6 Projects ✅ (12 controls)
- One initiative per real department, derived from its live tasks: card = title + "Manager · <lead>"
  bubble + "N of M tasks done" + live "Working on: …" (animated dots) / "Idle — waiting for a task" +
  Working/Idle chip + progress ring + status (On track / At risk / Planning) + health chip (only when
  troubled) + 🎯 "N/M goals" chip + milestones count + due.
- Search rooms (clear; "no room matches that"). **New project** → opens Maria's chat. **🤝 New shared
  project**.
- **Cross-room projects** panel: name, room chips (system rooms valid), "Start the project" (queues a
  real brief to Maria for the leads), cards with progress %, archive (confirm; never delete),
  milestone checklist (toggle, add). Cloud-mirrored, boot-hydrated.
- Opening a room makes **chat the big center thing** (lead + "Sub-agent N" not-live tabs) with a side
  panel: description, progress, Room brain select (shared per-room pref), milestones, linked missions.
  Maria's room = her big chat. Dev projects flagged.
- ⬜ Team meets in the meeting room with an animated multi-page dry-erase whiteboard; summary report to
  the CEO office (Telegram or PDF); approve the cross-team plan; work in the meeting room or own
  rooms; git worktrees for safe parallel work; live preview links; Maria assembling the team on command.
- Audit P1: "New project" creates nothing itself (it opens Maria).

### 3.7 Playbooks ✅ (5 controls)
Reusable per-department recipes. **New playbook** (name, room, one step per line) · search · cards
(dept chip, "run N×", steps count) · detail drawer with numbered "Tasks it creates" · **Run this
playbook now** → one REAL task per step on the board (New, assigned to the room lead), run count
bumps, activity note. "Trigger: Run by hand". Demo recipes (New photo job, Monthly billing, New
content episode, Pay a bill, Store restock) with locked buttons.
Clarified: **Playbook = the recipe (what)** · **Cron = a timer (when)** · **watch-folder = run when a
new file appears**; all three can trigger the same playbook. ⬜ Triggered playbooks that actually fire
on a schedule / watch-folder (Phase J "Automation that runs"); ⬜ "Maria suggests automations" (low).

> **[R8] Automation becomes possible.** v1's playbooks could only be *"Trigger: Run by hand"* because the scheduler lived inside the vendor on the PC. Hermes owns the scheduler, so triggered playbooks and watch-folder triggers move from ⬜ Phase J to buildable.

### 3.8 Calendar ✅ (9 controls)
- Real current week (real dates, today, Saturday = Shabbos tint), prev/next/Today, **Day / Week /
  Month** switch (phones open on Day; "+N more" opens that day; today ring).
- Dated tasks land on their day as room-coloured chips → click → board. Standing weekly events project
  forward only (↻ "Every week"). Done tasks dimmed.
- **Shabbos badge** Fri + Sat with the real Ramat Beit Shemesh times ("Shabbos from 6:33 pm" / "until
  7:32 pm"); the "pings pause" claim shows only while the switch is on.
- **Recurring jobs** panel from Hermes's `cron list` (count / "Can't see them right now" when the PC
  is offline; job cards with dept chip, schedule, next run "Today 9:00 PM", paused state; Run button
  locked "the schedule runs itself on the PC"); "Jobs scheduled on your office computer aren't drawn
  on the grid" + **Show them** (scroll + flash).
- Hebrew day letters (א׳–ש׳). Calendar events have no writer until Google Calendar connects.
- ⬜ **Two-way Google Calendar sync** ("must just work" — definite); crons drawn on the grid; calendar-
  event-from-chat as an agent capability.

> **[R8] Three honesty caveats resolve.** Because v1's crons ran inside the vendor, the Calendar could not draw them on the grid (offering a *Show them* button as consolation), the cron **Run now** button was locked (*"the schedule runs itself on the PC"*), and §9 recorded *"⚠ PC-side schedules don't pause for Shabbos yet."* Hermes owns the scheduler: crons draw on the grid, Run now unlocks, and **Shabbos mode extends to schedules** — which also turns the three LOCKED Shabbos switches in §3.21 (pause non-urgent crons · keep coding running · keep backups running) into live switches.

### 3.9 Office — the 3D office ✅ (17 on-screen controls; full system in §4)
See §4 for everything inside the scene. On-screen: Controls bar (Overview/recenter, Top-down map,
Fly/explore, Photo Mode, Edit office, Name tags, Org chart, Ambient sound, Weather, time-of-day slider
+ "live"), Quality switcher (Performance / Quality / Ultra), Team Status side panel (Show panel,
Office cost today, Departments, team search + All/Working/Idle filter that dims non-matching
characters, click a row → fly to that desk, Activity), Org chart card (CEO · managers · others), Desk
dashboard on focus, Edit panels, Photo Mode, prop/game overlay host, sound, fly-mode hint bar (WASD /
Space / Shift / Esc; touch devices get "needs keyboard and mouse" + "Back to the office"), build stamp
only on dev / `?qa=1`, the Weekly Assembly via the in-world bell.

### 3.10 Council ✅ (15 controls) — "the mini-parliament" (Issac's original idea)
- **Group chat of picked room leads** (chips; all rooms incl. system rooms; min 2) with **Maria as
  chair**; each lead answers through its OWN real session on the PC. "Convene the council" · "Start the
  Weekly Assembly" · ➕ New session (parks the current one) · End this council (two-tap).
- Thread: numbered messages (#n); your messages (with a 🎭 "as <lead>" badge); lead messages with
  WhatsApp-style **[REPLY: n] quotes**, ⚖️ round badge; disagreement → inline "⚖️ Launch a debate
  about this?" chip; debate = floor manager ([MORE] / [REST] convergence, challenged lead answers
  first, no fixed rounds); chair wrap-up card with recommendation + Approve / Reject / Send back; a
  decision ribbon coloured by verdict; **credit guard** card at 20 messages (▶ Keep going +20 / 🧑‍⚖️
  Wrap it up now) + Maria phone ping "still debating" every 10; honest asleep pause + ▶ Continue;
  still-thinking leads don't stall; turn indicator.
- Composer: 🎭 "talk as" select (default You, the CEO; a lead's own room never answers itself) ·
  input · send. **Routing**: name a room → only it answers (typo-tolerant, "office managment" works);
  "everyone" → the whole table; otherwise leads may `[PASS]` silently ("Nobody had anything to add").
- Right panel: **Sessions** history (live + past; ✅ Closed / ⏳ Still open badges; past-session banner
  with 🔄 Reopen & continue (numbering continues) and Back to now; approving the verdict = the closing
  move; reject/send-back keep it open) · **Points agreed** (chair rewrites every 3 spoken messages in
  any talk; ✏️ pen edit, empty = delete) · **⚖️ Odds board** ("Where it's leaning": chair's live odds
  across 2–8 candidate verdicts, green→orange→red animated bars, hover pop, tap to pin, normalised to
  100, carried through archive/reopen) · **Verdict** card · **💚 What this council costs** (real token
  growth per speaker from the PC, earlier sittings vs this sitting, final reading on archived
  sessions, "PC hasn't reported" honesty, ChatGPT-plan footnote).
- Wrap-up hands each lead's stance to memory (tagged to its room + an office-wide record); decisions
  notify Maria. "Take to Council" from a task card. Weekly Assembly moved to the convene screen; 👑
  Home widget; in-office Assembly Bell.
- **Weekly Assembly** ✅: Thursday-night ceremony as a slideshow — intro (you at the head), one slide
  per lead presenting their REAL week (finished this week, score, plate), Maria moderating, wrap-up
  counts; ⬜ full 3D staging (agents walk to the head desk one by one, CEO at the front, Maria aside).
- 💡 mic by the council input on one speech-to-text service (parked).

### 3.11 Approvals ✅ (7 controls) — the Tinder-style deck
- Card kinds: room work "For your OK" (a task's report) · outgoing **drafts** (real to / subject /
  body, line breaks kept) · Maria's **one-time access** asks ("closes itself") · Maria's **PC-control**
  asks ("🔧 Maria asks: restart Hermes — reason") · Dexter's office-wide rule proposals · code
  changes (requested by, files, "Open preview before approving", "On a branch · add-only · never
  auto-merged") · (planned) Scout ideas.
- Lanes All / Actions / Code changes with counts; counter "n of total · left waiting" / "Inbox zero";
  3-deep card stack with swipe animations; dept chip, risk chip, agent avatar + link, time, tool
  chips, "On approve:" action line.
- **Five actions**: Reject ✕ · Skip ⏱ · **Send instructions** (textarea → "Send & send back": note
  saved on the task, task → New, delivered to the room; delivery state sending / delivered / waiting
  for the PC / saved-only / failed) · **Ask <agent>** side chat drawer (real room chat with the card as
  context; "…is answering"; honest "I can't reach the office computer") · Approve ✓.
- Real effects: task → Done or back to New with activity + personality mood events; one-task keyhole
  approve/decline; draft approve → signed `send_via_connector` → PC outbox ("waiting-connector") /
  decline → nothing queued; PC-control approve/decline.
- All-caught-up card ("Show skipped items again" / "Replay the demo stack"); Telegram-mirror note
  (mirrored vs off); right-hand **Recent decisions** log with note + delivery state; deep link.
- Real approvals count feeds Home + Start My Day; decisions open from Notifications.
- ⬜ approve FROM the phone (engine half); per-use paid-API gate with Telegram ping (who / what / how much).

### 3.12 Memory ✅ (20 controls) — one memory, several views
- Data = Maria's saved facts (local `mc.maria.memory.v1` + cloud) merged with the PC's supermemory
  memories; **ONE BRAIN sync-up** pushes device-only facts once (dedup by normalised text, queue-flush
  when the PC is asleep, "☁ syncing N memories…" chip).
- Red **off banner** when supermemory isn't connected ("key saved but not answering" vs off; N notes
  waiting). Engine pill (connected + count) + tools pill ("rooms can use it · n tools" / "rooms can't
  use it yet").
- Toolbar: search (lights up matches) · sync chip · pills · views **Map / Notes / Journals / Trash /
  Changes** · count. **Scope chips**: Everything · Office-wide · one per room in room colours (system
  rooms included); a two-room fact lives in both.
- **Map** — two modes:
  - 🌌 **Universe** (hero): 2D canvas with physics galaxies; docs vs memories as different shapes;
    aging states (fresh / static / expiring / forgotten); typed edges (updates / extends / derives);
    fly-through pan/zoom, drag nodes, hover card, search lights up matches.
  - 🔮 **Ball**: room hubs in room colour, memory bubbles around, office-wide between clusters,
    a memory shared by two rooms shows a **gradient of both colours**; hexagons = memories, squares =
    source documents (dashed "derives" link); hover cards (text, room, when, version, ⚡engine, id);
    LEGEND (Memories / Documents / Connections / Derives / Room ties; Recent <24 h / Older); controls
    Fit (Z) · Center (C) · zoom % · ALL TAGS filter (rooms + Office-wide + Engine/Local); 2D ⟷ 3D
    rotating sphere (drag orbit, wheel zoom); keyboard ← → ↑ ↓ Enter Z C; **"Who holds what"**
    ownership panel (per-room rows with proportion bars → General + per-agent private counts, Office-
    wide, "In between" shared; row click filters both views). Audit P1: the cluster graph is hidden
    behind "Ball".
- **Notes**: **"What Maria knows about me"** know-me card (about me · family · work · how I like things ·
  notes; silent autosave; fed into Maria's prompt) + memory rows (dept, date, "from your setup").
  Demo: grouped by project with task-progress headers.
- **Journals** tab: the PC's journal files (per day, per agent pair), text read on demand.
- **Trash** tab: 30-day can, Rescue (restores everywhere incl. the engine), Empty now (confirm).
- **Changes** tab: every superseded rule/fact — was / now / who / when.
- Open a bubble/note → full text, source, date, room → **Forget this** (confirm; deletes every copy:
  browser, cloud, engine) / Close. Edit = locked. Deep link `?q=`.
- In-world Memory Bookcase → this screen. Old "which AI runs memory" setting deleted (one brain);
  replaced by the Memory-home Mover in Settings.
- ⬜ click a note → shows exactly which memory bits it pulls from (traceable to source); per-desk
  (agent) layer once facts carry agents; editable fact text; conflict rules; paging >200; designed
  "what Maria knows about me" report; Council/agents reading engine memories.

### 3.13 Rulebook (was "Policies") ✅
- Scope rail: Office-wide (count) + one chip per room (real chapter counts) + Office Management; becomes
  a chip strip under 1024 px (PA-3).
- Header with **cap chip** "n / 20" (over → "the nightly librarian will propose which to merge or
  retire") + **New policy** (title · scope office-wide/room · kind Approval / Spend / Autonomy /
  Safety / Schedule · plain-words rule → "Put it on the record").
- Cards: **7 LIVE-enforced rules with receipts** ("✓ Enforced by: …": born-Intern · nothing outward
  without your OK · one-time access via approval · Shabbos ping hold · confirm-click revoke ·
  office-lock signed commands · weekly-cap Run gate) and **your own rules** ("On the record · vN"; Edit
  bumps the version; Revoke deactivates, never deletes, with confirm).
- Filing from anywhere: say a rule to Maria (website, Telegram via mirror) → `rule_add` → "📕 Filed:
  Chapter …, rule N" receipt; chapters office / room / agent; topic groups; supersede chain; clash
  marks on BOTH cards ("both stay filed; the newer one guides until you settle it").
- **Who can use what**: per-connection rows with room chips vs "Everyone", ⏳ one-task keyholes,
  pending asks on Approvals.
- **🚓 Police reports**: findings from Officers Stone & Barak with severity (note / warning /
  serious), named evidence, **Seen**; nightly librarian proposals (merge near-duplicates, retire stale).
- Injected into Dexter's own rules file between markers. In-world Policy Shelf → this screen.
- Bug fixed: double "Office Management" row. ⬜ Maria-written policies with read-back on the engine side.

### 3.14 Connections — the Vault + the app store ✅ (180 controls; system detail in §6)
- Demo (no office): read-only Vault list with locked buttons. Real office → the live Vault.
- Header: **Installed apps N** toggle · **Browse all** · PC status chip.
- **The store** ("the store of everything"): search (clear, summary) · tabs All / Services / API / MCP /
  Other · categories All / Work / Social / Files / Money / Media · **Featured hero carousel** (Google
  account, Zoho, Telegram, Suno, Higgsfield, Computer folder, AliExpress; prev/next/dots) · ⭐ best-
  services row · live Hermes tiles born from the PC's own skills catalog with truth pills (Connected
  ✓ · ready · needs-its-key · needs-its-helper · Mac-only) and lane chips (🟢 wired / 🟡 key→dev room /
  ⚪ on the plan) · 🧪 "Not live-tested yet" badge until "✅ I tested it — it worked" · 12 **chat-
  channel tiles** · **"Through the dev room" tiles** (services with no ready connector → Development
  room) · API / MCP / other grids (OpenAI API, Claude API, Gemini API, An API, An MCP server,
  Something else) · "0 results … Nothing by that name yet" · ✓ Installed / Finishing markers in search.
- **Add flow**: back · **💬 Talk this out with Maria** · label · folder path · URL · key (password
  box) · per-power four-way switches (💸 money tags) · room keyholes · **Connect** (disabled until named).
- **One shared installer wizard** per service: real logo + name + subtitle + state (Install / Ready /
  Add to Maria / Finishing / Tested) · "About this connection" · one-sentence "How it connects" ·
  3 human-titled Maria-chat scenario previews · "Before you install" disclosure (requirements, privacy,
  cost, risk, limits) · official page link · steps one at a time (Step X of Y, Back/Next/close, safe
  reload/resume, non-secret drafts only): name → rooms → safety (switches, defaults Ask) → review →
  key on the final step only → "Finish installing" in Home Base · **Install it on my PC** (result box).
  Service-specific fields (Telegram token + BotFather link; Twitch username / client id / token /
  channel / owner id; Slack bot + app tokens; Discord token / server / user ids; Google Chat credential
  JSON + webhook; Teams app id / password / tenant / endpoint; Signal number + separate-bot tick;
  LINE token / secret / webhook; SMS SID / auth / sender / webhook; Matrix homeserver / user / token /
  rooms; gifgrep provider; OpenAI Audio model / speech model / voice / format; Songsee view / palette /
  format; Summarize length / language + paid consent; Video-frames format).
- **Installed detail page**: status · how · proof · **Test with Maria** · **Rooms & safety** (Edit:
  rename, 🔐 opt-in 4-digit code, 🔒 Personal wall, power switches, room grants, one-time chip) ·
  **Finish** / **Remove** for stuck rows · **Disconnect** (confirm "close it for every room?") ·
  "Finish in Home Base" · "I saw it work" · per-channel re-check · "adopt live" (a bot already running
  on the PC) · key panel · setup note · switch honesty line.
- **Your engine's library** card: the PC's installed MCP servers ◈ + plugins 🧩 (typed, live from the
  snapshot; no PC = honest empty) with per-room keyhole chips that save instantly, mirror to the cloud,
  and ride the signed pipe to the PC's `library-grants.json`.
- Maria one-shot handoff (`?view=connections&service=…&source=maria`) preselects rooms.
- In-world Server Room → this screen. Audit: ~40 dead-end store tiles, 11 known-bad wizard journeys.
>
> **[R3][R4] What this screen becomes.** Tiles come from the repo's own manifest, not a vendor catalog, so the ~40 dead ends cannot recur. The 12 chat-channel tiles reduce to **one required** (Telegram) with eleven declared-but-deferred **[R4]**; "Through the dev room" tiles survive as a plan. The engine-library card keeps its MCP servers ◈ and loses its plugins 🧩 half (no plugins were ever in use).
- ⬜ enforcement of grants on the engine (`approvals` / `exec-policy`); the "allow?" prompt that pops
  wherever Issac is (Telegram / office / UI) with two-way sync; per-AGENT grants; separate server-rack
  visuals per type in 3D; the Development-room pipeline for unknown APIs/MCPs; Scout agent.

### 3.15 Cost ✅ (19 controls)
- Four StatTiles with Explain popovers: Today · This week · Tokens this week · Projected month.
- **Spend over time**: 7-day bars (tooltip = witnessed tokens + labelled $ estimate; "no spend
  witnessed yet"). **ChatGPT plan usage** bars (demo caps; real office says the plan isn't readable
  yet). **Live from Hermes** card (real total tokens + per-agent token rows from the fresh snapshot).
- **Breakdown** By Department (real weekly tokens + $ estimates; Office Management merges her two
  lanes; Police Station on the sheet; Development row + weekly-cap slot; unclaimed history buckets) ·
  By Agent (workers show "not recorded" / "—", never a fake $0.00) · By Model (live sessions; sessions
  with no named model skipped) · search · honest notes.
- **Weekly cap per room** chip ("No cap set" → $/week → Save; "$0 / $25 weekly"; rose "Over cap";
  the Run gate refuses paid work at the cap).
- **Details** drawer per row: spend (tokens + estimate or "no figure" + reason) + **What they
  delivered** (scorecard stars + last 5 done tasks).
- Dollars = a declared estimate at **$3 per million tokens** ("estimated at API rates"; audit P1 calls
  this fiction because the plan is flat-rate). Source: the bridge witnesses per-session lifetime token
  growth per room per day (worker desks count for the room; Telegram/main = Office Management; patrol =
  Police Station; first sighting = baseline; 60-day history on the PC → cloud only on growth).

> **✅ Settled — this is a usage screen, not a spend screen.** The audit called the $3/M figure *fiction because the plan is flat-rate*, and it was right. With flat rate locked in, the fix is **deletion, not correction**: no dollar figures appear anywhere on this screen. It shows real witnessed tokens, per-room attribution, and usage against the plan's own limits, with the honest plan-rider line ("covered by your ChatGPT plan"). Weekly caps become **usage** caps and the Run gate still refuses work at the cap. See `docs/HERMES-RIPPLE.md` §4.
- Demo screen fully labelled "sample". Mobile-responsive.
- ⬜ cost forecast ("at this rate ~₪X this month"); per-agent drill by day and hour (Issac's
  nice-to-have); spike alerts; month view; auto-pause on the PC; per-worker cost; honest plan-rider
  widget; per-use paid-API gate.

### 3.16 Docs ✅ (6 controls)
Sources column (All documents + each source; first REAL source = "This PC · Hermes workspace",
md + pdf, newest first; Google Drive per account / Zoho WorkDrive arrive with those connections),
locked **Connect an account** (reason shown), per-agent permissions note, file grid (kind icons,
"Walled" badge for Personal-only, access avatars, modified), search, honest empty state, deep link
rings a card. Cards are not clickable (contents never leave the PC). Audit P1: can't open anything.
⬜ **Ask-your-docs** (RAG over connected Drive/email with citations, Personal walled) · **source-
restricted answering** (lock a room to approved sources, e.g. the shul's halacha sites; answers cite
the source) · watch-folder → Drive upload · per-room document access.

### 3.17 Files (Settings → Workspace files) ✅
Real folder tree of the PC's Hermes workspace (read-only walker: depth 4, 400 entries, skips
dotfiles/node_modules, sizes + modified, "truncated" flag, refreshed every 10 min on change),
back-to-Settings, search that keeps parent folders visible, expand/collapse, file details + "This file
lives on your PC — its contents never leave the machine", honest "the PC hasn't reported its workspace
yet", stacked-then-side-by-side phone layout.

### 3.18 Activity ✅ (5 controls)
The master log of the USER's actions and what actually happened: rooms opened, tasks given /
finished, needs provided, approvals, held Shabbos pings, undo, playbook runs, goal hits, pause flips;
kinds approve / reject / navigate / edit / chat / run / setting; search; grouped Today · Yesterday ·
real date ("Sun, Aug 3") · Earlier; real times; last 120; deep-link highlight; fed to Maria so she can
answer "did I ever approve X? when?". Read/snooze extensions feed the Notifications inbox.

### 3.19 Notifications ✅ (bell + inbox, 8 controls)
- **Bell dropdown**: tiers Needs-you / FYI; persisted unread watermark; "Mark all as read"; ⏰ snooze
  per row (1 h, self-cleans); "See all"; team rows ("Sandbox finished “X” — waiting for your OK",
  "<room> is stuck", "PC stopped reporting"); sample-office notices ride the same machinery (PA-3).
- **Inbox screen**: All / Unread / Snoozed tabs; per-item read/unread; snooze / bring back with return
  time; mark all; Today / Yesterday / Earlier; expand → "Open Approvals" (decisions) / "See it in the
  Activity log"; search; ONE unread count shared by bell + rail badge + inbox; rows never invent a room.
- ⏭ precise room/deep-link metadata for connection-created notices; ⬜ urgent PWA push + quick-actions
  (Android, if easy); daily digest to email/Telegram; Focus / Do-Not-Disturb.

### 3.20 Dev Room ✅ (14 controls) — the website side of Dexter
Dexter header (colour dot) · waiting state · **project cards** (emoji, name, running / awake / off,
exact current task, queued count, last result) · **detail** (last result: summary, model, minutes,
files, "See the change" link; recent moments; **"Watch it think — live from the PC"** dark mono
tool/text trail; **Autonomy dial** Careful / Normal / Free per project; per-project idle minutes) ·
**What happened** history with per-project filter · **Dev Room settings**: room colour picker (sky /
violet / emerald / amber / rose; ripples everywhere incl. the 3D floor and Dexter's shirt), sessions-
rest-after idle minutes (disabled until the PC reports), nightly digest toggle + time, message-mirror
status line, coding brain note (Claude) · **Add a project** two-step instructions (Home Base folder +
bot token). Dev tasks also live on the Happening board and the Home widget; Maria's briefing carries
the dev summary; QuickCapture can target Development. ⏭ Dexter's brain shown here.

### 3.21 Settings ✅ (37 controls) — every card
- **Your setup**: status sentence · Edit my setup / Set up my office (wizard) · Restore demo data
  (confirm; clears local + cloud).
- **Home Base (the PC app)**: Download Home Base (rolling GitHub release) · 📥 Refresh the office code now.
- **Connect your office PC** (accounts mode): mint a key shown once + paste-into-Home-Base steps ·
  list of computers with "last heard from" · disconnect.
- **Memory engine** (supermemory): status line (three states) · tools line · saved-key tag
  (`sm_…4f2a` + saved-at) · Test the key · Use a different key · password box + Connect.
- **Memory home** (the Mover): Cloud (today) / **Move to this PC** (copies, counts both sides, deletes
  nothing).
- **Voice & emotions**: OpenAI key (device-local) · voice test · help steps when missing.
- **Office lock**: passphrase (device-local) set / change / clear · status vs the PC (locked ✓ / not
  locked yet / UNLOCKED) · PC walkthrough.
- **Phone mirror (Telegram)**: mirror toggle (shared row with Home Base) · **One conversation
  everywhere** toggle (default OFF) · Send a test to my phone.
- **Recent changes — undo**: capped ledger in plain words; ONE tap puts it back exactly (task moves,
  keyholes, power switches, renames) through the same real stores.
- **Backup & restore**: Export `mission-control-backup-<date>.json` (versioned, dated; audit: exports
  7 of the promised stores) · Restore (confirm strip; junk refused; reload).
- **Pause the office** (rose switch; rooms won't start new work; banner on Home).
- **Agents & autonomy** (Intern / Specialist / Lead per agent) · **Spawn governance** (ask before
  spawn; "new workers start as Intern") · **Guardrails** (email / spend / deploy / delete / publish
  toggles) · **Brain & models** (Primary / Fallback: GPT-5.5 (Codex), Claude Sonnet 4.6, Claude Opus
  4.8, GPT-5.5 mini, Local (Ollama); per-project override Allowed) — **audit P1: these four cards are
  pure screen state and save nothing**.
- **Connections** summary from the real Vault (label, service, room count, "finishing on your PC",
  green only when active; "No accounts connected yet" + Connect).
- **System health**: gateway Online / Not connected from the live snapshot, heartbeat, sessions,
  agents awake (working/total), CPU / Memory / Disk "—" until the bridge reports, amber login-trouble
  warning.
- **Workspace files** (Open → Files). **Your office manager** (rename Maria; ripples everywhere).
- **Language** (English / עברית; reload).
- **Security**: accounts → Signed in as … / Sign out / Delete my account (confirm); code mode → Lock
  now, "Fixed code" tag.
- **Office layout**: Export / Import JSON / Reset the 3D layout (confirm).
- **Shabbos mode**: "Pause notifications & outbound messages" (LIVE: holds every outward phone ping in
  the window and logs the hold) + three LOCKED switches (pause non-urgent crons · keep coding running ·
  keep backups running; stored, padlocked until the PC side exists) + "This week" real Ramat Beit
  Shemesh times, computed live (solar math: Friday sunset −18 min → Saturday sunset +42 min).
- Standing rule: editor/settings save silently and continuously; no "saved" badges (Home Base's Save
  button is Issac's one exception).

### 3.22 Department workspace (`/app/room/<name>`) ✅
- Header: character bust, room name, worker count, lead name, room-health chip (Healthy / Needs a
  look / Stuck), **brain** select (Office default, GPT-5.5, GPT-5.5 Pro, GPT-5.4 mini, Claude Sonnet
  4.6, Claude Opus 4.8) + **thinking** select (Quick / Balanced / Deep) with a caption — persisted per
  room and sent with every message and task.
- Tabs: **Chat** (the lead + every hired worker as its own live tab on its own engine session; 💤
  not-live tabs; optimistic pending dots; still-working swap-in; asleep "Saved ✅" note) with the
  **"Right now" command center** · **Decisions** (Approve acts; Discuss opens the real chat) · **Crons /
  Schedules** (real crons; "Run now" locked) · **Review** (Approve & continue / Send back with notes —
  real moves) · **History** (whole room / exact worker incl. retired / Unassigned · stage · Today / 7
  days / 30 days / All time · text search; persisted per room; expandable task entries with the full
  story + reported result; hire/retire moments; honest empties).
- **Right now** mini-dashboard: lead line; work strip (Open / In progress / For your OK / Done /
  Overdue, local calendar day, with jumps); alerts (drafts waiting → Approvals, decisions → tab,
  access asks → Maria); plate (≤4 + "+n more in History"); last reported; health reasons; **Goals**
  (checkboxes → activity "hit a goal"; add; × with confirm); **Scratchpad** (soft-yellow pad, silent
  autosave); **Crew** (rows with ⏳ temp badge, ⬆ Ask Maria promotion, autonomy select = Issac's
  override, Pause / Resume, Make permanent, Retire; "+ Add a worker" form name / role / temp; Retired
  list "Retired — never deleted" with 🗣 Her take + Rehire).
- "N outgoing drafts waiting for your OK"; mood line + 🔊 speak toggle; personality fallback for
  system rooms; room requests checklist ("your rooms need N things": account / tool / skill / info
  with Done buttons); pins. Phone: header + model controls stack; command center + chat full width.
- The old scripted "live reasoning stream" was DELETED (fake). ⬜ per-worker permissions editor by
  chat with read-back; real sub-agent chats when spawned; hiring through the lead's conversation.

### 3.23 Global overlays ✅
- **⌘K command bar**: Cmd/Ctrl+K; base commands (Start my day, Wrap up my day, Add a task, Review
  approvals, Go to <every screen incl. Files, Dev Room, Notifications>); typed search across
  departments, missions, projects, memories, agents, approvals, docs, activity (max 14, deduped by
  stable id, rows are options with aria-selected); arrows + Enter; results deep-link.
- **Start My Day** slideshow: intro (greeting + date) → one slide per REAL worker (Maria + each lead;
  system rooms + Aaron only when they have work): live status line, "Been up to" recap, plan (the
  room's open queue), real tokens today + ~$ → wrap-up (agents, cost, real waiting-for-OK count).
  Progress bar, Back/Next. Opened from the sidebar card, the top-bar search, the Home widget.
- **End of day — "Wrap up my day"**: evening mirror over today's real stores: summary, slides only for
  non-empty categories (Finished today / Moved forward / Waiting for your OK / Waiting on you elsewhere
  (drafts → Approvals, access asks → Maria) / Due now or overdue), rows open the room; Finish marks
  it done. ⏭ Shabbos-aware banner.
- **While you were away** digest (Home). **Weekly Assembly** (Council/Home/bell). **Quick capture**
  (input, Ctrl/Cmd+Enter, room select incl. Office Management + Development, save → a REAL task,
  recent list; small & subtle; in the office only on zoom-in). **🐙 BusyScene**. **Explain** popovers.
  **ConfirmDialog**. **LockedButton**. **Empty states** on every screen that can be empty.
- **Maria chat** (see §5 for her brain): floating "Talk to Maria" launcher (hidden on Council, never
  covers a primary action) → 380×560 panel, or standalone window, or her room: header with room
  back-button, live **mood line**, 🔊 speak-aloud toggle, **Connect** app picker (search over the 39
  canonical apps, "I can't find it" triage → Development / Maintenance with a prefilled prompt),
  **Talk** (voice orb), close; room-requests + rooms-at-work strips ("Rooms at work": every open task
  with **Run** → In Progress → Review on report; capped/paused → disabled); thread with channel tags
  (📨 TELEGRAM chip; 🖥️📱🎤 source markers; 📓 logged tail); **live connect card** (polls the PC every
  6 s) and **hookup card** (recipe about/how, room keyhole chips, Start/Continue installation →
  Connections); mic dictation; input; send. History hydrates from the cloud; late replies and
  outbox landings drop into the right thread.
- **Maria voice orb**: full-screen dark orb; listen → think → speak loop (Web Speech + OpenAI TTS);
  statuses; heard text; blocked mic stops at once with plain words on what to click; silence backs off
  400 ms → 1.2 s and gives up after three tries; heard words send; listens in the app's language.

---

## 4. The 3D office (everything inside the scene)

**North star**: Sims-4 stylized-realistic meets Richard Scarry's Busytown (packed detail, constant
motion); bright; believable walking; cozy/compact single floor with real hallways; low-rise Ramat
Beit Shemesh city backdrop; **no fakes** — every unique piece gets its own generated asset; Issac's
hand-built `public/office-layout.json` is the layout the 3D build must match. Visual truth comes ONLY
from a real graphics card (the cloud QA pipeline or Issac's browser), never the sandbox renderer.

### 4.1 Scene ✅
- Real-time React-Three-Fiber canvas (ACES tone mapping, shadows, drawing buffer kept for photos),
  studio HDRI, soft shadows, **lighting** that tracks real local time (or a manual slider), weather
  sunny / cloudy / rain, bright-only night; bloom + vignette (N8AO on Ultra); dust particles.
- **Camera rig**: orbit overview / top-down map / desk-focus fly-behind / free-fly (WASD + pointer
  lock, Space up, Shift down, Esc release; desktop only); recenter; minimap bridge.
- **Building**: four solid walls + grand entrance; editable rooms with their own floor + perimeter
  walls + door gap; free-standing user walls (glass / solid) with openings; wood floor; set dressing
  (signage, wall art, desk clutter, lobby, procedural textures); exterior (grass, foundation, parking,
  trees); instanced low-poly city ring; ambient pedestrians; occlusion fader (dollhouse cutaway of
  walls between the camera and the focused desk).
- **Rooms = departments** in room colours, data-driven ("grow the building": designed slots first,
  then a southern expansion row per real department); system rooms on the floor with desks (Office
  Management — biggest; Development in the settable colour with Dexter's desk; Maintenance with Max's
  desk; Police Station 🚓); the CEO Office (Issac's, with his vibe; games live here); amenities
  (kitchen, conference/meeting room, hangout, foosball, arcade); Council auditorium; parking lot with
  per-agent cars that arrive AM / leave PM by the real clock. Audit P0: on the live office the Police
  Station has no room and Maintenance no desk.
- **Desks**: dev-desk GLB + a glowing task screen; empty desks for open seats; seating recomputed live
  when Maria adds a department (the new lead appears without reload).
- **Characters**: ~10 Tripo-generated GLBs (rigged walk/idle clips for om, friday, fury, jarvis,
  loki, pepper, vision, wanda), plumbob status light (green + glowing monitor = working, gray = idle),
  hover bubble ("what I'm up to", real), name tag, bobbing; Working/Idle flips LIVE from the rooms'
  real tasks; click → desk dashboard / chat; crowned CEO avatar ("you"); family members (crawling
  baby + wife, hover/click reactions). Audit P0: real (non-demo) workers render as plain capsules.
- **Agent life**: staggered breaks (walk via A* pathfinding to game tables / arcade and back); click
  a desk → "Coming, boss! 🏃"; meetings; council. ⬜ GTA-style: talk to an NPC → he turns to face you
  + hand gestures; click his desk → he runs over, sits, faces the screen and types; typing + occasional
  breaks (get up, play) while "thinking"; arrive AM / leave PM walking; speech bubbles; cheers.
- **Tiered assets**: `char.glb` (office) / `char.hero.glb` (solo close-up) / `char.perf.glb` (weak
  device); props get one aggressive version + instancing; meshopt compression, demand rendering,
  adaptive DPR (scales with FPS), lazy-load, animate only on-screen/near/focused tab; never ship raw
  GLBs. Quality modes Performance / Quality (default) / Ultra (+ `?lowperf`, `?preview`, mobile →
  performance; edit mode forces lite). ⬜ KTX2 textures, baked lighting, LOD / impostors, zoom LOD.
  Audit P2: every 2D screen downloads the 3D office bundle (9.5–18.7 MB).

### 4.2 Desk dashboard (click a character) ✅
Editable panel rails: **Live work** (doing + progress only when real) · **Task queue** · **Skills**
(locked "coming in Phase J") · **Model & thinking** (shared per-room brain prefs) · **Schedules** (real
crons) · **Cost & tokens** (the room's real figure; "not recorded" for workers) · **Scorecard** (real
grade) · add-panel · "back to office" · **open chat** (the worker's one true thread). Glass panels.

### 4.3 In-world control objects (one source of truth, manipulable in 3D) ✅
Memory Bookcase → Memory screen (real memory docs) · Policy Shelf → Rulebook · Server Room / rack →
Connections (real Vault rows: label, status, keyholes, powers) · **Video Wall** (six true counts:
tasks done, open work, tokens today, week tokens, agents on, spend estimate; chart only where a series
exists; click-through board with real team / activity / money) · **Trophy Shelf** (real leads graded
by room score; first-try rate; done count) · **Org chart** (tiers from real roles; CEO name from
setup) · **Office Management whiteboard** (the REAL room tasks in 3 columns, drag + ◀ ▶ moves them) ·
**Assembly Bell** 🔔 (golden drawer card; place it; click → gong + swing + the Weekly Assembly
convenes) · **Suggestion box** (ideas) · **Bulletin board** (sticky notes + photos) · Kanban board (To
do / Doing / Done over the real Office Management tasks). ⬜ separate server-rack visuals per type
(skills / MCP / plugins / tools) with grant controls; per-room logos.

### 4.4 Interactive props and games ✅
Whiteboard (draw + saved gallery) · TV (channels) · click effects · Pet dog · Aquarium (feed) ·
Basketball hoop · Dartboard · Magic 8-ball · Photo frame · Fireplace · Bookshelf · Telephone (rings) ·
Reception bell · Speaker (music) · Spinning globe · Party mode (disco) · Confetti cannon · playable
ping-pong / foosball tables · **Arcade** cabinets → mini-games Pac-Man, Pinball, Bowling, Breakout,
Snake, Whack-a-Mole, Ping-Pong, Foosball · Edit terminal (the Maintenance PC opens edit mode) ·
Zoom-reveal content (appears when the camera nears). Audit P1: several ornaments showed fake data
(fixed in IR3: five ornaments read the real office).

### 4.5 The office editor ✅
Object library (every placeable asset grouped by category; search) · upload your own .glb (bytes kept
in IndexedDB) · "copy the Tripo style prompt" · **Generate it?** via Tripo when nothing matches ·
tools select / multi / rotate / scale / wall / door / glass · drag / rotate (±15°, 90°) / scale
(bigger/smaller) / duplicate / delete · grid snap + size · smart snapping · surface nesting (small
props ride desks/tables) · two-click wall drawing; openings add / move / resize; wall shorten /
extend / lower / raise / add doorway · rooms move / resize corners / add / remove / rename / assign
department / floor style (Tonal, Hardwood, Light tile, Carpet, Concrete, Polished) / door (side,
width, style open / single / double / archway) · marquee selection · undo / redo · arrow-key nudges,
`[` `]`, Delete, Esc · minimap (drag the viewport) · silent continuous autosave · Reset + Export /
Import layout live in main Settings. Rooms sync to departments (a room appears for each department
even over a saved layout, and pops up live when Maria adds one).

### 4.6 Photo Mode 📷 ✅
An in-office camera: free roam (left-drag rotate, right-drag pan, scroll zoom, Top view, Reset), a
shutter that renders a small light frame → real PNG filmstrip with download; whole-view or fly-to and
photograph ONE room; finishes with no graphics card, which is what lets the office be verified
headlessly. Audit P1: room-only shot bug.

### 4.7 QA hooks ✅
`/office?qa=1&camera=iso|front|back|left|right|top|orbit`, `?solo=<agentId>`; the scene exposes
`window.__OFFICE_QA_STATE__` (ready, loaded/total, FPS, renderer, per-agent id/name/status/visible/
position/rotation/height/bbox/facing/facingCamera/hasPlumbob, camera, stable frames) and
`window.__OFFICE_QA__` (setCamera, orbit, hover, click, clearSelection, report). Readiness = the whole
team visible for 1.5 s across ≥2 frames. The cloud pipeline produces per-angle screenshots, an orbit
video, a motion contact sheet, a Playwright trace, `qa-report.md` and `qa-state.json` on every push to
`main` that touches the office. Tripo generation pipeline scripts for new assets.

### 4.8 Office life & look — planned ⬜ (Phase G / Stage 7 / backlog)
Textures (floor/grass/concrete), fixed walls/shell, compact layout, per-asset rotation · rigged
characters walking (coffee / kitchen / ping-pong), meetings, arrive AM / leave PM, speech bubbles ·
Council debate scene · wire the office to live Hermes state · office-only cost meter · quick-capture
"+" that appears only on zoom-in · **holiday decorations** (Jewish calendar: Sukkah, Chanukah…) ·
**day/night + live weather** from the installed weather skill (only after a saved location + privacy
boundary; today's selector is manual) · office pet **Clawy** · your logo / branding on the walls and
dashboard · personalized desk items per agent · ambient sound + milestone celebrations · office party
on big wins + a manual "throw a party" button · agent of the week spotlight · suggestion box → ideas ·
day-in-30-seconds replay · Weekly Assembly ceremony view in 3D · **themed rooms** with fitting props
(music, shul…) · **spawn-a-character pipeline** (approve the cost first → generate in Tripo → rig to
walk/talk) · reusable **character drawer** (only idle/free characters; a character is 1:1 with a worker;
rehire reuses that worker's own character; never double-booked; background NPCs separate) · room
preview / sketch before building · meeting-room collaboration scene with an animated multi-page
dry-erase whiteboard · Maintenance/janitor room dev agent (sandboxed, add-only, preview + approval,
one-click rollback, no Vault access).

---

## 5. Maria and the AI layer

### 5.1 Her permanent personality (`persona.mjs`, loaded into Hermes) ✅
Plain-ASCII system prompt (Windows console safe), sent in chunks, re-taught only when its hash
changes; carries the screen-by-screen map of Mission Control ("where's the button for X?"), folder
safety (reading is free, touching asks), "no dead ends" (she proposes adding rooms instead of saying
no), never asks for a password in chat, house rules on connections, promotion criteria.
**Assembled briefings** replace the old one-time priming: every message = rulebook chapters + her
mood line + ONE office status text.

### 5.2 Her hidden actions — the `[[MC-ACTIONS]] … [[/MC-ACTIONS]]` block ✅
Parsed out of every reply; the website and the PC both execute them; the visible text stays clean and
a plain-words "what changed" line is shown:
`add_dept` (business type, personality, workers 1–6, needs) · `rename_dept` · `remove_dept` ·
`set_org` · `set_ceo` (vibe) · `request` (a room needs an account / tool / skill / info) · `add_task`
(+ due date → Calendar/Scheduled, priority) · `hire_worker` (born Intern) · `draft_send` (→ the
Approvals deck) · `grant_once` (one-task keyhole) · `connect_app` (hookup card) · `connect_request`
(explicit API/MCP URL) · `connect_key` (a key pasted in chat, never echoed, rides the locked pipe) ·
`connect_pc` (helper lane) · `connection_grant` · `connection_power` (off / ask / ask-money / free;
code-armed connections refuse) · `google_step` · `undo_last` · `handoff` / `handback` (route to a room
and back, "← Maria") · `remember` / `forget` / `supersede` · `rule_add` (→ "📕 Filed: Chapter …, rule
N") · `dev_task` (→ Dexter) · `notify_phone` (the ONLY phone lane) · `pc_control` (engine restart,
via Approvals). Rich cards in chat: live connect card (polls the PC) and hookup card.

### 5.3 What she knows on every turn ✅
The live office brief (from the PC when fresh) · the rulebook chapters for "Maria" · Issac's saved
memories · the know-me profile · recent decisions from the activity log (so she answers "did I ever
approve X? when?") · the live Dev Room summary · what every room is doing (she is the front door and
knows every business; rooms know her abilities and are told to loop her in when stuck).

### 5.4 Never silent, never fake ✅
- Honest offline: when the PC is asleep she says so plainly ("I can't reach the office computer")
  and never invents a reply; the message is parked in the website **outbox** ("Saved ✅ — your office
  computer is asleep 💤" vs "couldn't save — send again"), a watcher lands the late reply in the same
  thread; run-task cards stay In Progress meanwhile.
- Honest patience: ~2¾ min wait, "asleep" verdict after ~30 s with no pickup, late-reply watch ~5 min.
- Silent-turn watcher on the PC: a run that answered nobody gets one retry, then an honest "Sorry — I
  looked into that but didn't manage…"; a 5-minute backstop line; the old "(no reply)" placeholder killed.

> **[R6] Three scraping hacks become one event stream.** The silent-turn watcher, the transcript byte-offset mirror (§6.5) and the Dev Room's "Watch it think" tail (§9) all existed only because the vendor would not say what happened to a turn. Hermes emits `turn.started · tool.called · text.delta · turn.ended{status}`. So: the **silent-turn watcher is deleted** — an empty turn is *reported*, not inferred; the transcript mirror becomes a subscription; and "Watch it think" stops routinely hitting its honest *"ambiguity = no view"* fallback. **Preserved exactly:** every timing and every string — ~2¾ min patience, ~30 s asleep verdict, ~5 min late-reply watch, the outbox copy ("Saved ✅ — your office computer is asleep 💤"), and the rule that a late reply lands in the same thread. Those are product decisions, not engine artifacts.
- One Maria conversation across website / Telegram / voice (the "pomegranate" test 🟢).
- A cloud Maria (Claude behind `/api/maria`) exists for offices with no PC (behind the door; unwired).

### 5.5 Voice ✅ (⏸ needs the OpenAI key on the site)
Maria speaks with an expressive OpenAI voice whose tone follows her mood; every person gets a stable
voice; browser-voice fallback; 🔊 speak toggle in chat; the intro speaks. ⏭ Phase H: per-agent
emotional voices via a realtime human-like engine, each matched to the character's look (gender,
ethnicity); shines in the Weekly Assembly.

### 5.6 The personality engine ✅
Six archetypes + a per-name fingerprint; living mood reacting to real events; colleagues react by
temper; trait drift + an experience log; cloud-mirrored; joins every briefing and colours the voice.
Soul-engine loop: hires / promotions / retirements / rehires land on mood and personality.

### 5.7 Maria as chief of staff — planned ⬜ (Stage 3)
Proactive suggestions in chat + a suggestions spot (important to Issac) · cross-day memory of context
(a basic must-have) · "Explain this" on any number/screen (✅ on the stat tiles) · smart daily
prioritization · auto-learn preferences into the profile (NEVER auto-decide anything important,
destructive or money-costing) · suggested-reply chips when an agent asks something · Maria as a
draggable/resizable dashboard widget (✅ widget) · inline AI writing canvas in the chat (co-write /
refine text) · capability-gap loop (an agent hits a limit → tells Maria → she gets a "price quote" from
the Dev room → transfers you in or just tells them to build it) · Maria watches room quality and flags
messes proactively (rides the engine loop) · robust-chat upgrade (structured questions, canvases,
interactive replies in every AI chat) 💡 · "Maria's eyes on my computer" (hover chat + mic) 💡.

---

## 6. The PC side — the bridge ("the messenger")

A plain Node program (no dependencies) that lives on the Windows PC next to Hermes. Home Base runs
it as a child; it can also run on its own from a Startup-folder shortcut (`start-bridge.bat`
self-refreshes its code from the public site on every launch, no git needed).

### 6.1 Loops ✅
- **Tick every 20 s** (overlap-guarded, the fix for the "30 node.exe probe storm"): read Hermes
  (`sessions --json`, `agents list`, `health` with 3 retries, `cron list --json`) → build the
  **snapshot** → push it to the cloud row `hermes_live/snapshot` (HMAC-signed when an office lock
  exists). Also each tick: refresh the "LIVE OFFICE STATUS" note in memory, witness token cost, refresh
  the workspace file list (10 min), run the night patrol / night tidy at their hour, mirror the main
  transcript, watch for silent turns.
- **Command loop every 2 s** (only with `--commands`): pull pending `mc_commands` rows, verify the
  office-lock signature (HMAC-SHA256 over kind|ts|nonce|payload, 2-min freshness, nonce replay guard,
  timing-safe compare; open mode when no lock), run, write the result back.
- Boot: prime/assemble Maria's persona; engine inventory 15 s after boot and every 12 h (`--help` of
  every command → cloud row); scrub poisoned mirror rows; heal the memory tool address 20 s after boot.
- Every log line also goes to `hb-feed.json` (rolling 200) so Home Base can show the feed even when
  the office self-started.

> **[R5] The bridge survives, much thinner.** It is still needed — the PC is behind NAT and the cloud cannot reach in — but most of its work was *CLI translation*, which evaporates. Gone: spawning four CLI processes per tick (and with them the *"30 node.exe probe storm"* the overlap guard existed to fix — **the problem ceases to exist**), the 3-retry flaky gateway probe, and the JSONL byte-offset reading **[R6]**. **Survives unchanged and must:** the office lock (HMAC-SHA256 over `kind|ts|nonce|payload`, 2-min freshness, nonce replay guard, timing-safe compare), the ~20 s snapshot push, the ~2 s command pull, the fixed command menu with **no "run anything" door**, and the cloud-lane modes.

### 6.2 The snapshot (what the website knows about the PC) ✅
Agents (id, name, status, doing, model, tokens, session count) · sessions (id, channel, label, model,
total tokens, age) · counts · health (gateway ok, heartbeat, session entries, event-loop max,
login-trouble stamp that fades after 15 quiet minutes, per-channel live probes for Telegram /
WhatsApp / Slack / Discord / Google Chat / Teams / Signal / LINE / SMS / Matrix / Twitch + accounts —
probed one at a time, every 2 min when configured, every 30 min when not) · supermemory block
(connected, configured, hint, saved-at, tools registered/count/url/why, count, memories[]) · locked
flag · connect requests · connector statuses · engine library (MCP servers + plugins, 10-min cache) ·
crons · needs-you count (tasks in Review) · office brief · journals index · dev rows · personality.
Fresh = under 3 minutes; "connected" = fresh AND at least one agent (not the flaky gateway probe).

### 6.3 Command kinds the PC understands (a fixed menu, ~17 core + system; NO "run anything" door) ✅
`chat` (Maria; `agent --message "[context]\n\ntext" --session-key agent:main:main --thinking low`) ·
`room_chat` (a room lead or a named worker, with briefing block + role preamble + the room's real
`--model`/`--thinking`) · `run_task` · `send_message` · `approve` / `reject` (CLI syntax unconfirmed —
unsupported) · `connector_configure` / `connector_key` / `connector_probe` / `connector_test` /
`connector_done` / `connector_revoke` / `send_via_connector` (local outbox) / `library_grant` ·
`telegram_notify` · `engine_restart` (detached gateway restart) · `hb_refresh` (re-pull code) ·
`set_secret` (only when no lock exists) · `rooms_migrate` (one agent per room: back up hermes.json,
patch, verify, flip) · `use_power` (money-gate verdict → blocked / approval request on the deck /
auto) · `memory_add` / `memory_forget` (by id or by text across every copy) / `memory_move` (copy to
a target, count both sides, delete nothing) · `sm_configure` / `sm_test` · `rule_add` (file → rulebook
row + Library copy + instant clash check) · `journal_read` / `journals_backfill` · `dev_task` (dispatch
envelope → Dexter's folder) · `dexter_rulebook_sync` / `dexter_memory_import` · `dev_set_idle` /
`dev_set_digest` / `dev_set_autonomy` · `google_setup` (steps setupwin / status / credentials /
authorize / verifyauth / authhelp / verify through Hermes's own Google skill) · channel setups and
logouts (`channel_configure` + `telegram_logout`, `whatsapp_setup` (QR), `slack_setup`,
`discord_setup`, `googlechat_setup`, `msteams_setup`, `signal_setup` (Docker helper container + QR),
`line_setup`, `sms_setup` (Twilio), `matrix_setup`, `twitch_setup`, each with `_logout`) ·
`browser_setup` (Hermes's isolated managed browser; AliExpress) · `helper_setup` (the recipe lane:
discover / configure / verify / paste / import / authstatus / addfeed / removefeed …) · `chat_mirror`
(rows written BY the bridge for Telegram turns). Empty chat replies get one retry then a real error;
replies are journaled and, with "one conversation" on, mirrored to Telegram.

> **[R5] How this menu changes.** Deleted: `rooms_migrate` **[R2]**. Replaced: `set_secret` → `POST /hermes/secrets` (always locked, no no-lock exception); `engine_restart` → `hermes restart` (same shape). Reduced: the 13 `channel_configure`/`_logout` pairs to **one** (Telegram), with twelve preserved below and deferred **[R4]**. Unchanged: everything else, including the principle that this is a **fixed menu with no "run anything" door**.

### 6.4 Session keys ✅
Maria `hermes:main` (dmScope=main); rooms `hermes:room:<slug>` today, `hermes:room:<slug>`
after the flip; workers `hermes:room:<slug>:w:<worker>`; police `hermes:police`. Brain pickers become real flags.

### 6.5 Memory doors, rulebook, police, librarian, journals, cost, files ✅
- **Doors**: containers `mission-control` / `mission-control-personal`; floors vault | office |
  room:<name> | drawer:<agent> | archive; writers/readers per the matrix; every save stamped; reads
  filtered. REST to supermemory (`/v3/documents` with container tags); MCP tool registration
  (`mcp unset` + `mcp add` with the Bearer key; `mcp probe` decides "rooms can use it").
- **Rulebook**: append a rule → policy card + receipt "📕 Filed: <chapter>, rule N"; Library copy;
  briefing text (cap 20 per chapter); persona line; Dexter injection between markers.
- **Police**: night patrol at 00:00 UTC on Officer Stone's session (REPORT-never-punish, JSON-only,
  credit watch) → findings {severity note/warning/serious, about, finding, evidence[]} → cloud row
  (cap 200); instant clash check on every new rule marks both cards.
- **Librarian**: night tidy at 01:00 UTC → merge / retire proposals to the same row.
- **Money gate**: off → blocked · free → auto · ask-money → approve only if it costs money · ask → approve.
- **Journals**: `[YYYY-MM-DD HH:MM] from → to (door): text`; doors 🖥️ website | 📱 telegram | 🎤 voice
  | 🤖 system; Issac gets one file per day, every agent pair one file; an index note in the Library;
  written by code (zero tokens); backfill replays old chat rows.
- **Cost witness**: per-session lifetime token growth seen tick by tick → per room per day; first
  sighting = baseline, a drop = restart; Maria/Telegram/unknown → Office Management, patrol → Police
  Station; 60-day history; cloud row only when growth was seen.
- **Files reporter**: bounded read-only walk of the Hermes workspace (400 entries, depth 4; md /
  json / image / pdf / code) → cloud row every 10 min when changed.
- **Transcript mirror**: reads the main session JSONL by byte offset, skips website turns and
  dashboard-prefixed system text, writes `chat_mirror` rows; files a rule Maria spoke on Telegram.
- **Silent-turn watcher**: reads the trajectory log; a person-addressed run that ended with no text
  and no delivery → one recovery ask → plain fallback to Telegram + the website thread; 5-min backstop.
- **Engine inventory / library / probes**: MCP JSON-RPC probe (`initialize` + `tools/list`, 8 s) before
  registering; key → `skills.entries.<skill>.apiKey` + enabled → gateway restart → re-read (green only
  after the engine re-reads); live provider-only health probes; streaming output with secrets
  redacted at the source (`[wire:<service>:<step>]` lines for Home Base's live-wire box).
- **Cloud lane**: door mode (bridge token → `/api/rest/*`) or direct mode (Supabase URL + service key
  in a local file) or none (local files only; says so). No DB key baked into any script anymore.
- **State files on the PC**: snapshot, `connectors.json`, `keys.json` (retired), `outbox.json`,
  `office-lock.json`, `cloud-lane.json`, `bridge-config.json` (Telegram target), `sm-config.json`,
  `agents-mode.json`, `cost-history.json`, `persona-mark.json`, `mirror-state.json`,
  `silent-turn-state.json`, `refresh-request.json`, `library-grants.json`, `engine-inventory.json`,
  `journals/*.md`, `dev-mappings.json`, per-helper discovery/mapping/session files.
- Tests: `test-bridge.mjs`, 1,359 assertions (office lock, every channel setup, recipes, doors,
  rulebook, journals, cost, files, silent turns, cloud lane, Maria's phone sentences vs the message
  design, supermemory address fix …).

> *Assertion counts throughout this document are v1 history, not rebuild targets. The rebuild's proof gate is defined in §13 and in the constitution's Build-and-Prove loop.*

### 6.6 The Hermes contract the rebuild relies on **[R5]**

v1 depended on a **vendor CLI surface**: `status` · `sessions --json` · `agents list --json` ·
`health` · `agent --message --session-key --thinking --model` · `message send --channel` ·
`gateway run/install/stop/restart` · `channels add/login/status/capabilities/remove` ·
`mcp add/set/list/show/login/probe/configure/reload` · `secrets configure/apply/audit/reload` ·
`skills list/inspect/install` · `plugins install/enable/disable/inspect` ·
`approvals allowlist/get/set` · `exec-policy show/set/preset` · `cron list --json` ·
`models list` · `sessions cleanup --fix-dm-scope` · `configure --section` ·
`browser --browser-profile start/open/snapshot`.
*(Preserved above for traceability — this is what the rebuild is replacing.)*

**Hermes replaces all of it with one versioned HTTP/WS contract.** Required in Milestone 1:

```
GET  /hermes/hello      → { version, capabilities[], brains[] }
POST /hermes/turn       → run one agent turn on a session key; streams events
GET  /hermes/sessions   → live sessions, token counts, ages
GET  /hermes/health     → gateway ok, heartbeat, per-capability probes
POST /hermes/secrets    → write a secret; never read back
```

Plus, inside Hermes Core and not exposed as separate surfaces: the **scheduler** (R8), the
**tool-execution gate** (R7), the **MCP client** (R9), and the **event stream**
`turn.started · tool.called · text.delta · turn.ended{status}` (R6).

`capabilities[]` is the honesty mechanism required by Principle I: an absent capability
locks its UI with a plain reason ("Hermes on your PC can't reach Telegram yet") instead of
failing silently. Capabilities beyond Milestone 1 — the twelve deferred chat channels
**[R4]**, browser automation, the helper-lane programs **[R3]** — are declared, never assumed.

**Dropped outright:** the agent registry (Mission Control already owns the roster, **[R2]**)
and the plugin system (no plugins were ever in use).

Decision: the runtime is **Hermes** for the single-user build. Because Mission Control now
talks to one seam rather than fourteen vendor surfaces, the Phase-4 option — a cloud brain
behind the same bridge/database seam — becomes a Hermes provider swap rather than a rewrite.

---

## 7. Home Base — the Windows PC app (Electron)

A quiet background helper so Issac never has to walk to the PC. Runs Hermes + the messenger as
children (or ADOPTS an engine that is already running), one stable installer `Home-Base-Setup.exe`
built by CI on every push, self-updating. Windows-only (Tauri and WSL rejected; the old scheduled-task
autostart replaced by Home Base's own start-with-Windows). Running copy on the PC: v2.0.1.

### 7.1 Screens ✅
- **Home** ("Your office"): four lights (Hermes · Messenger · ChatGPT login · Memory; good / warn /
  bad / off; distinguishes "haven't heard yet" from "off"; 3-min freshness), whole-app glow, live
  **Start / Stop / Restart** buttons + 🩺 Health check (own window: hermes doctor → All clear / A few
  things / Run again), Maria's one-line "what she's doing", **plain-English feed** (every line
  translated, unknown lines still get a gist, "Explain this", raw/plain toggle, Engine/Messenger
  tabs, live `[wire:…]` terminal lines with secrets masked), "Requests from Mission Control" strip
  (connect-request prompt), setup strip, 🔔 bell (🔌 connect-waiting · 🙋 needs-your-OK → Maria · ⬇️
  update-ready → Settings · 🚨 red-light alerts; derived fresh every heartbeat), corner notice "[app]
  needs you for a moment" Finish it / Later, tray + taskbar badge "N waiting for your OK".
- **Maria**: the real dashboard chat embedded (also a summon window on Ctrl+Shift+M, always on top).
- **Connections** ("Connected on this computer"): tile grid (label, dot, status word, rooms count) →
  keyholes + the four-way switches (Off · Ask me each time · Ask when it costs money · Free) + ✋ Stop
  this connection; Finish / Remove on stuck rows; revoked hidden; the embedded Vault.
- **Finish connecting** (only while something waits): per-app pages with the same logo / About / Maria
  previews / recipe as the website; exact PC steps one at a time (Step X of Y, Back / hide / resume);
  LIVE WIRE terminal box; "Still connecting" / "Connecting by itself" / "Waiting" panels; Google
  guided approval (email + the 4 real moves); Spotify helper card (sign-in tick → install → borrow the
  browser login with a browser picker → prove; `spogo auth paste` boxes); WhatsApp QR; Signal QR (only
  after the local helper answers); X 5-step; LINE / SMS / Matrix / Teams / Discord / Slack / Google
  Chat / Twitch forms. The old "✅ I signed in here" self-attest button was REMOVED (no green without proof).
- **Set up my office** wizard (until complete): ① Get Node → ② install Hermes pinned
  `npm install -g hermes@1.0.0` → ③ sign in to ChatGPT (the engine's own login) → ④ start the
  office; every tick measured from reality; "Re-check my PC".
- **Shared folders**: house rules, the list of folder grants (name, path, rooms, status), ✋ Stop

  > **[R12] The wizard changes; the shell does not.** Step ② becomes *install Hermes*; step ③ becomes *connect a brain* and depends on the open question (⚠ §2.10). The four lights become **Hermes · Messenger · Brain · Memory**, keeping their good/warn/bad/off states, the 3-minute freshness rule and the "haven't heard yet" ≠ "off" distinction. `hermes doctor` keeps the All clear / A few things / Run again shape. Everything else in §7 — tray, hotkeys, watchdog, shared folders, the plain-English feed, Issac's 12 locked design answers — is engine-agnostic and survives verbatim.
  sharing, the real Windows folder picker, room checkboxes from the real office, ✏️ Edit (name, rooms,
  powers **Look** (locked on) / Organize / Rename / Delete — doing always asks first).
- **Dev Room**: "Dexter's brain" card (which Claude · how hard he thinks · sentence preview · Switch
  his brain; keeps the conversation with `--continue`), per-project rows (working / awake / asleep ·
  current task · queue count · last result · rest-after minutes) + Start / Stop, add a project (native
  folder picker + bot token → PC-only file), idle-minutes setting, schedules list (next fire · on/off ·
  remove), nightly digest toggle + time, "Your messages, copied to Dexter" card, "Watch it think" live
  transcript.
- **Settings** (every choice saves instantly; a Save button is Issac's one exception): start office at
  boot · keep awake · auto-restart on crash (stands down after 3 quick crashes; never for dev
  sessions) · auto-fix ChatGPT login (🔑 "Fix my login" banner when off) · App updates Automatic /
  Tell me / Ask + Check now / Install now (re-check every 4 h; private-repo fallback reads a cloud
  stamp and offers the download page) · Phone mirror toggle (shared row with the website) · "Never let
  my office sit closed" watchdog (Windows task every 2 min + at logon; heartbeat every 30 s; settling
  90 s; gives up after 5 tries/hour; never wakes a sleeping PC) · Your data folder + 📂 Open · ↩️ Reset
  Home Base settings · Remove Home Base (stops the office, sweeps strays, uninstaller) · **Office key**
  row (paste → `cloud-lane.json` → Restart).
- Tray right-click: Open · Start / Stop office · Open dashboard · Fix login · Pause everything · Quit
  (warns "this stops your office — Maria goes quiet"); ❌ hides to tray; single-instance lock;
  heartbeat glow.
- Hotkeys: **Ctrl+Shift+M** summon Maria · **Ctrl+Shift+N** quick note (+ drag-a-file prefill).
- Remote refresh: the website's "📥 Refresh the office code now" → a request file → re-pull code +
  restart the messenger within 10 s.
- Issac's 12 locked design answers (2026-07-08): startup = a setting · Home = dashboard front ·
  mini-Maria only · a Folders section · folder powers always ask · updating = a setting · a break =
  Windows popup + phone ping (system-sent, not Maria) · geeky text in tabs · expiring login = a setting
  · Mission-Control look · tray menu has everything · NO weekly PC backup · a dedicated Connections space.
- 💡 later: multiple PCs on Home Base; Mac.
- Tests: `test-homebase.mjs`, 1,822 assertions (real 2026-07-08 log lines → plain words, lights, every
  finish-connecting panel never dead-ends, the approved Telegram design verbatim, watchdog rules vs the
  2026-08-18 six-hour silence, the 2026-08-29 lost voice notes with a real HTTP server, vendor copies
  equal the source …).

---

## 8. The connection system (Vault + store + installers + lanes)

### 8.1 Locked shape ✅
- "The store of everything": tiles are born from Hermes's OWN skills catalog (a cloud row the PC
  refreshes at boot + every 12 h): 42 live tiles (9 ready / 27 need setup / 6 Mac-only, gray) + 12
  chat-channel tiles + the API / MCP / folder lane + 41 "Through the dev room" tiles; 72 generated
  service logos.
- **Five lanes**: KEY (a key into `skills.entries.<skill>.apiKey` / secrets) ✅ · HELPER + OWN-LOGIN
  (a small helper program installed from its release + the service's own login; recipe table) ✅ ·
  CHANNEL (`channels add / login / status`) ✅ · MCP / API (probe → register) ✅ · DEV-ROOM (Maria
  triages an unknown service → the Development room wraps it → a plug + logo + powers → the learning
  catalog) ⬜. Enforcement of grants on the engine (`approvals` / `exec-policy`) ⬜.

> **[R3][R4][R7] Lane arithmetic.** The five lanes reduce to three on the critical path — **KEY**, **CHANNEL** (Telegram only) and **MCP/API**. The **HELPER + OWN-LOGIN** lane and its seventeen helper programs (E1–E17 below) are declared and deferred, not deleted; the **DEV-ROOM** lane was ⬜ in v1 and survives as a plan. Enforcement of grants stops being ⬜: it moves inside Hermes Core **[R7]**. The 42 vendor-catalog tiles become a repo-owned manifest **[R3]**.
- Eight CS-v3 picks: two front doors (website + Home Base) one engine · app-store look · unknown
  services triaged by Maria → Development (a connection) vs Maintenance (a Mission Control
  improvement) with a plan + money guard · keys typed anywhere ride the locked pipe · Maria takes keys
  in chat with a live card · fresh connections hold no keyholes until asked · switches default to
  ask-every-time · PC-only → "finish on your PC" + the Home Base bell, no auto phone ping.
- Honest truth ladder on every tile: Not connected → Setting up → Login proven → LIVE (an agent used
  it + Issac saw); a failed probe removes green; "I signed in here" never earns green; every MCP
  registration other than supermemory is still unproven (the probe path exists).
- **Vault record** per connection: service, label, scopes, per-room keyholes (grants), status
  (waiting-for-PC → active → revoked), power modes per power, tested, key installer, 🔒 Personal wall,
  🔐 code-armed, setup note, proof note + time, account id/label; PC truth wins on reconcile; cloud
  mirrored. One-time keyholes (⏳ one task; auto-close when the task is Done). Folder connections
  (path; powers look / organize / rename / delete). Learned recipes ("Learned by your office" 📖).
  Library grants for the engine's MCP servers + plugins. Undo ledger covers keyholes, switches, renames.
- Curated catalog (the bigger plan, kept): Google (mail read/draft/send, files see/add/delete, cal
  see/add/change), Zoho, Telegram, Facebook, X, Suno ($), Higgsfield ($), Computer folder, WhatsApp
  Business, Instagram, LinkedIn, YouTube, Spotify, TikTok, Discord, Slack, Notion, Weather, GitHub
  (merge / rerun $), Trello, Airtable, Dropbox, OneDrive, Stripe, PayPal, Shopify, QuickBooks, Canva,
  ElevenLabs, Outlook, Teams, Zoom, Calendly, monday, Asana, Jira, Linear, Figma, Salesforce, HubSpot,
  Mailchimp, Twilio, OpenAI / Claude / Gemini APIs, Wix, Etsy, eBay, Amazon Seller, AliExpress
  (browse / orders / cart / buy $), Xero, Green Invoice ₪, "An API", "An MCP server", "Something else".
  Categories Work · Social · Files · Money & selling · Music & media · APIs, MCP & more.

### 8.2 Every connector (ID · name · how it connects · status)
Chat channels (each with a shared wizard, live provider-only probe, adopt-a-running-bot, logout):

> **[R4] The single biggest complexity cut in the rebuild.** Thirteen channels were built in v1; **one is load-bearing.** §10 is explicit — Telegram is Maria's channel, WhatsApp was rejected on ban/privacy grounds, and phone pings exist for exactly three moments. Milestone 1 requires **D1 Telegram only**. The other twelve keep their full specifications below — per-service fields, wizard steps, probe designs, logout paths — and are queued as declared Hermes capabilities. Nothing here is deleted; twelve OAuth/token/QR/Docker onboarding flows simply leave the critical path. Note the honest v1 record: *"👁 verify items 1–45 wait on Issac except Weather, Google, OpenAI Audio 🟢"* — eleven of the thirteen were never verified by the owner anyway.

- D1 **Telegram** (BotFather token, pairing; "Use live Telegram") ✅ 🟢
- D2 **AliExpress** (Hermes's isolated managed browser profile; human login; proof = account read) ✅
- D3 **WhatsApp** (QR link via `channels login`; unlink) ✅
- D4 **Slack** (Socket Mode bot + app tokens; powers messages/threads, sends/edits, files, reactions/pins) ✅
- D5 **Discord** (bot token + server id + user id; intents; mention required) ✅
- D6 **Google Chat** (service-account JSON + webhook) ✅
- D7 **Microsoft Teams** (app id, client secret, tenant, `/api/messages`) ✅
- D8 **Signal** (Docker helper on localhost, separate bot number, QR) ✅
- D9 **iMessage** (Mac only; honest, no fake form) ✅
- D10 **LINE** (channel access token + secret + webhook) ✅
- D11 **SMS / Twilio** (Account SID + auth token; E.164 or messaging service; webhook) ✅
- D12 **Matrix** (homeserver + user + token; up to 10 rooms; end-to-end encrypted) ✅
- D13 **Twitch** (bot username, client id, OAuth token, channel, owner id) ✅
Ready services (grant-and-prove; Hermes skills that need nothing on the PC):
- A1 Browser automation · A2 Diagram maker (SVG/HTML + Excalidraw) · A3 **Google** (`gog`: Gmail ·
  Drive · Calendar · Docs · Sheets · Contacts; 9 four-way modes; guided PC approval) 🟢 · A4 Grammar ·
  A5 Graphic Design · A6 Meme maker · A7 Notion (read / write / delete modes) · A8 Connector workshop
  (skill-creator) · A9 **Weather** (wttr.in; one read-only power) 🟢 — the first real connection.
Key services: B (dynamic; any skill with a documented key slot; key on the final step, memory-only).
Own-login: C **X / Twitter** (`xurl`; developer app client id/secret PC-only; `/2/users/me` proof) ·
**Outlook** (honestly unavailable).
Helper lane (a small helper program + the service's own login; verdict functions per service):
- E1 **1Password** (`op` CLI, Windows Hello, exact vault; vault metadata Free / secret use Ask /
  secret changes Off) · E2 **Blog & RSS watcher** (public feed) · E3 **BluOS speakers** (`blu`;
  discover → private alias) · E4 **Security cameras / camsnap** (RTSP/ONVIF; ffmpeg; fresh JPEG) · 🔚
  E5 Coding agent (Codex / Claude Code — RETIRED into the Dev Room) · E6 **Eight Sleep** (`eightctl`;
  side left/right/solo; mode + level) · E7 **Gemini CLI** (`GEMINI_API_KEY`; headless proof) · E8
  **GitHub Issues** (`gh`; one exact owner/repo + label; dry-run only) · E9 **gifgrep** (GIPHY / KLIPY
  key; rating G) · E10 **GitHub** (`gh`; proof against this repo) · E11 **Google Places** (Places API
  New; "Jerusalem City Hall" proof) · E12 **PDF editor / nano-pdf** (uv; Gemini key, may reuse; sibling
  PDF) · E13 **OpenAI speech-to-text** (gpt-4o-transcribe / mini / diarize; 25 MB; sibling .txt) 🟢 ·
  E14 **OpenAI text-to-speech** (tts-1 / tts-1-hd; 9 voices; MP3/Opus/AAC/FLAC/WAV/PCM; Downloads
  folder) · E15 **Songsee** (4 views / 9 panels, 6 palettes, PNG/JPG) · E16 **Summarize** (shared
  OpenAI key; short/medium/long; auto/en/he; paid proof needs explicit approval) · E17 **Video frame
  grabber** (FFmpeg; first / timestamp / frame index) · **Spotify** (`spogo`; borrow the browser login
  with a browser picker or paste cookies; Premium note) ✅ ⏸ · **ElevenLabs** key ⏸.
Skipped from the burn-down: IMAP/SMTP (himalaya), Foodora (ordercli), Sonos, Trello, Philips Hue.
Parked: Obsidian, local Whisper. Replaced: sherpa-onnx-tts → OpenAI TTS.
Planned ⬜: Gmail as a walled Personal connection, Google Calendar (two-way), Zoho (TzviAir; Maria-
guided), Suno / Higgsfield / Tripo (API keys, credit-costing → paid-API gate), Facebook / Messenger /
Instagram / Canva via the dev-room lane, Drive, payments (capped + gated), social via MCP as needed;
~40 per-connector follow-ups in the Idea Inbox (multi-account managers, allowlists, SharePoint files,
Twilio voice, Signal registration, LINE tunnel, camera presets/motion clips, BluOS groups, feed
digests, 1Password service account, Twitch refresh, Matrix spaces, live coding-session view /
multi-worker orchestration / auto-PR publishing).
Facts: the PC's coding CLI is signed into a DIFFERENT Claude account (cards must say so); 👁 verify
items 1–45 (one per connector end-to-end) wait on Issac except Weather, Google, OpenAI Audio 🟢.

### 8.3 Shared installer recipes ✅ (one file used by the website AND Home Base)
Each recipe = version · service · skill · name · subtitle · PC flag · about / how · 3 scenarios ·
before-install disclosure (requirements, privacy, cost, risk, limits) · website steps · computer
steps (kinds tick / risk / file / folder / links / allow / check / run / login / choice / vault /
human / credentials) · official links. Recipes: Telegram, WhatsApp, Slack, Discord, Google Chat,
Microsoft Teams, Signal, LINE, SMS texts, Matrix, Blog & RSS watcher, BluOS speakers, Security
cameras, Eight Sleep, Gemini, Nano PDF Editor, OpenAI Audio (×2), GitHub Issues, GitHub, Google Places,
gifgrep, Songsee, Video frame grabber, Summarize, Twitch chat, AliExpress, Browser automation,
Diagram maker, Grammar, Graphic Design, Meme maker, Notion, Weather, 1Password, X, Microsoft Outlook
(informational), Connector workshop, Google account, + a generic key installer. The website persists
only safe drafts, never secrets.

---

## 9. The Dev Room — Dexter + per-project coding sessions

### 9.1 The idea (Issac's plan, locked 2026-08-14) 🟢 live on the PC since 2026-08-17

> **[R10] Almost untouched by the swap.** Worth stating plainly because this is the largest system the rename barely reaches: **Dexter was never a vendor agent.** §1.1 is explicit — he is a Claude Code session on the PC with the Telegram plugin. The Helper, the dispatch contract, per-project sessions, the autonomy dial, the message design and the Max-plan rule all survive verbatim. Two touch-points only: Dexter's shared memory via supermemory MCP follows **[R9]**, and his generated rules file follows **[R11]**. One bonus — "Watch it think" (DR6) stops being a transcript tail and becomes a real event subscription **[R6]**.
- **Dexter** = one always-on Claude Code session on the PC with the official Telegram channels
  plugin, his own Telegram bot and chat, a persistent never-reset memory (brief · preferences · log),
  stays light (no codebases in his head), works sequentially, can do small direct work, answers
  project questions, helps refine prompts, and **dispatches coding tasks**.
- **The Helper** (inside Home Base, no UI): watches a dispatch folder every 5 s; launches ONE Claude
  Code session per project in that project's folder with its own Telegram bot (per-child env, own
  Telegram state dir, shared Dev Room config dir); one task at a time per project with a queue; reads
  result files; idle-sleeps sessions (default **45 min**, per-project override; a WORKING session is
  never idle-killed); never auto-restarts; a death mid-task is LOUD (feed + event + phone alert through
  Dexter's bot); writes the live picture three ways (a status file for Dexter, the Home Base screen,
  cloud rows `dev-status` / `dev-events` / `dev-live`).
- **Project sessions**: 🎛️ Mission Control · 🕵️ Mystery Game (cluecrafter-pro) · 📺 The Newmans ·
  Speech-to-text · Our-Money · Wolfson-management-app (second GitHub account); one-time BotFather ritual
  per project (~2 min, Dexter-guided); genuinely parallel.
- **Task flow**: Issac → Dexter on Telegram ("Mission control: add a dark mode toggle. Mystery game:
  fix the PDF export bug.") → Dexter writes a dispatch prompt per task in the Build-and-Prove shape
  (goal, constraints, acceptance criteria, prove-it steps) → Helper → the project chat shows "📋 From
  Dexter:" + the EXACT prompt → ONE live checklist message edited in place (✅ ⏳ ⬜ per milestone) →
  final result message → cloud → Dev Room screen → Maria answers "status on all my projects".
- **Dispatch contract**: `dispatch\<taskId>.json` = `{"kind":"dispatch"|"stop"|"schedule"|
  "unschedule", "project", "task", "taskId", "autonomy"?, "time", "days", "scheduleId"}`; result file
  `<project>/devroom/<taskId>.result.json` (self-gitignoring); worker task file rules (verbatim task ·
  one checklist · result with elapsed / brain + model / files / link · honest-failure clause).
- **Scheduled dev tasks** (DR4): `{id, project, task, time, days (daily or 0..6), enabled,
  lastFiredDate}`; a once-a-minute due-check writes an ordinary dispatch file; Dexter manages schedules
  in chat; **nightly digest** (off by default; 21:00; one message from the day's real events; a quiet
  day sends nothing; Maria gives the "nightly summary" any time). ⚠ PC-side schedules don't pause for
  Shabbos yet.
- **Watch it think** (DR6): the Helper tails each session's transcript (only new bytes; project folder
  match; ambiguity = honestly no view), distills ≤40 compact steps (⚙ tool/file/command · 💬 words) →
  cloud → the website's dark mono stream. **Autonomy dial**: Careful (asks before every edit and
  command) · Normal (default; edits freely, asks before commands) · Free (runs without asking); per
  project, overridable per task by Dexter.
- **Dexter's brain** (DR-BRAIN): switch model (opus / sonnet / haiku / fable) and effort (low…max) from
  Home Base; `brain.txt` + `resume.flag` → `--continue` keeps the conversation; Start / Stop / Show /
  Hide launchers; hidden autostart.
- **Message mirror** (MB): every project-chat message not addressed to Dexter is copied to his chat
  (📋 card, 👀 reaction ack, folded past 220 chars) and to `dexter/mirror/log.md`; disk queue with
  backoff; **live line** (ML): Home Base polls each project bot itself on its own clock when no session
  holds it (409 = a session is on the line), saves voice-note audio FIRST to the project's inbox, then
  logs + queues, only then advances the offset.
- **Telegram message design** (MD, one shared formatter for Home Base + Dexter's tool): HTML not
  MarkdownV2; block model (txt / bold / mono / link / line / gap / fold); symbols ✅ ⏳ ⬜ ⛔ ❓ 📋 📊 🎤
  🔨; limits 4096 / caption 1024 / 38-char line target / 5 visible lines; a checker ("strip every
  emoji and it must still read"); shapes answer · status · dispatch confirm · handover · ask ·
  checklist (+ result) · result · voice ack. Result messages always include ✅ + elapsed ("Done in 4m
  12s"), 🧠 model, files touched with one-liners, PR/commit link, project emoji; progress edits are
  silent; completion / failure / stuck / approval buzz; permission prompts relayed as ✅ Approve / ❌
  Deny (permissions stay ON — never `--dangerously-skip-permissions`); command words **status** ·
  **queue** · **kill <project>** / stop · **usage** (approximate); failures with personality; files ≤50
  MB ("send as File"), bigger via a storage link.
- **Dexter's tools**: send-only Telegram voice (`send`, `keyboard`, `status` pin-once-then-edit,
  `album`, `voice` OGG/Opus, `draft`, `check`), OpenAI text-to-speech (voice "ash") and transcription
  (25 MB cap, ffmpeg conversion) using the OpenAI Audio key from Hermes's config.
- **Setup**: one PowerShell paste from the public site (7 re-runnable steps: folders under
  `C:\MissionControl\DevRoom` → brief / memory / tools from the public site (never overwrites existing
  memory) → Bun → Claude Code → clone this repo → bot token → launchers + Startup shortcut → sign-in in
  its own config dir → the Telegram plugin → start), then pair `/telegram:access pair CODE` + allowlist
  policy; Check / Show / Hide scripts; RECIPE.md in 6 parts.
- **Rules**: everything on the Claude **Max plan** (never API credits; decline "switch to API"), default
  Sonnet, Opus deliberately, model stated in every result, one shared usage pool; official plugin only;
  every bot allow-listed to Issac; sessions must be running to receive (no offline queue); Telegram
  chats are the permanent record; Dexter never resets memory, never bluffs, built ≠ done; no chat UI in
  Mission Control that duplicates Telegram (Telegram = conversation layer, the site = status layer).
- **Locked answers**: main Claude account · Claude-first, Codex parked (no disabled teaser) · the Dev
  Room is the ONLY coding system (the shipped E5 coding-agent connector retired) · DB fix = Path A
  (find the Supabase login) 👁 DR-A · scheduled tasks in scope · digest optional · mid-task pings =
  Dexter's judgment (always-on three: live checklist · "status" · the website) · on-demand onboarding ·
  supermemory needs only its key on the PC 👁 DR-B · dev tasks on the Missions board · settable room
  colour · Cost includes Development · Maria hands off to Development · all projects are GitHub repos.
  Since 2026-08-17 Mission Control itself is built THROUGH the Dev Room.
- **Dexter's memory** (3 layers): his own files re-read every start · shared supermemory via MCP ·
  the cloud task record; pick 32 moves layer 1 into the Library and GENERATES his rules file from the
  office Rulebook (Chapter 1 + the Dev Room chapter + his page) — two bridge commands exist, 👁 not yet
  pressed. Coding sessions become real org workers (drawers, pair-journals, desks on the floor).
  Dexter proposes rules office-wide via one Approvals card.
- Phases: DR0 lock ✅ · DR0.5 real tables `dev_projects · dev_tasks · dev_events` + `mc_chats` ⏸ (needs
  the DB login) · DR1 Dexter alone 🟢 · DR2 the Helper 🟢 · DR3 cloud records + Dev Room screen + Maria
  + board ✅ · DR3.5 E5 retirement ✅ · DR4 schedules + digest ✅ · DR5 Codex as brain #2 ⏭ · DR6 live
  view + autonomy ✅ · DR7 Development room on the 3D floor ✅ · DR-IDLE ✅ · DR-BRAIN ✅ · MB / MD / ML ✅
  · B7 Dexter comes home ✅ (⏸ press). Future: per-session isolated checkouts (git worktrees); Dexter's
  brain shown on the website; store dev-tiles → "ask Dexter" deep link.

---

## 10. Telegram and the phone

- Official Telegram bot (pairing mode; Issac is owner). WhatsApp was rejected as Maria's own channel
  (unofficial library = ban + privacy risk); a WhatsApp channel connection via QR exists for rooms.
- Maria is office-aware on Telegram (the LIVE OFFICE STATUS note; engine log noise stripped) 🟢; one
  Maria conversation across website and phone 🟢; Telegram → website transcript mirror (📨 chip, 📱
  door) 🟢; Maria pings the phone (`notify_phone`, "💬 Maria:" prefix; held on Shabbos; honest when the
  mirror is off) 🟢.
- **Phone mirror** (Settings; OFF by default): three "needs you" moments → a Telegram ping: work for
  your OK · a new outgoing draft · a one-time access ask ✅. **One conversation everywhere** switch:
  website exchanges → Telegram marked 🖥️, rooms under "🏢 <name>" ✅ (no silence flag verified — may buzz).
- Phone pings only ever for approvals waiting · something broke · a police catch.
- Voice notes are always transcribed and acted on (design); the OpenAI Audio connection transcribes
  Dexter's voice notes 🟢.
- Break alerts on the PC = a Windows popup + a phone ping sent by the system, not Maria.
- ⬜ **Rich Telegram** (its own track): inline Approve / Deny / Allow buttons inside the message,
  menus, formatted messages, quick replies, interactive flows · approve FROM the phone · voice-note
  intake → transcribe → route to the right room → task + reply back · urgent PWA web-push (Android) +
  notification quick-actions (only if easy) · a local retry queue when the phone has no internet ·
  "allow?" prompts that pop wherever Issac is with two-way sync · daily digest to email / Telegram.

---

## 11. Memory engine specifics (supermemory)

- Locked 2026-07-01 as the cluster-graph "second brain": never forgets, never bloats (old fades,
  important stays); knowledge graph; MCP-native so every agent + Maria share ONE memory; open-source,
  free tier; planned fully-local on the PC (the local binary is Mac/Linux-only, so hosted for now;
  the Mover brings it home later).

> **[R9] Almost entirely unchanged.** The REST path (`/v3/documents` with container tags), the five floors, `doors.mjs` enforcement, the stamp/filter rules, the 30-day trash, superseding and the Mover all carry over verbatim. **One new requirement:** Hermes must be an **MCP client**, and the "rooms can use it · n tools" pill now reflects Hermes's own MCP mounts. **One deferred item satisfied early:** v1's ⬜ *"proper secret storage for the key on the PC (Phase-4 gate)"* is met by Hermes Core's secrets store rather than postponed.
- Wiring: REST (`/v3/documents` with container tags + metadata) + MCP registered into Hermes at
  `https://mcp.supermemory.ai/mcp` (streamable HTTP, Bearer key; 15 tools); the key is pasted once in
  Settings (website) → the PC configures, tests, re-registers a dead address; the "rooms can reach
  memories themselves" pill shows whether the tools registered.
- Content: ~21 memories at last count; stamped floor / owner / author / room / agent; the LIVE OFFICE
  STATUS note is one document replaced each tick.
- Personal stays walled off (its own container). The old "which AI runs memory" setting was deleted
  (one brain). The Mover: copy every memory to a target with its tags, count both sides, delete
  nothing until confirmed, proven there and back.
- ⬜ per-desk (agent) layer once facts carry agents; editable fact text; conflict rules (engine side);
  proper secret storage for the key on the PC (Phase-4 gate); traceable "which bits does this note pull
  from"; auto-guard after a slip (tighten a power after a bad outcome).

---

## 12. Data model

### 12.1 Supabase (the Filing Cabinet)
- **Live tables**: `mc_setup (owner_id, id, data jsonb, updated_at)` **[R13]** — the office record store, one
  row per store; `hermes_live (owner_id, id, data, updated_at)` — the PC snapshot (`snapshot`);
  `mc_commands (id uuid, owner_id, kind, agent_id, payload jsonb, status pending | running | done |
  error | cancelled, result, created_at, updated_at)` — the durable conversation + command queue
  (`chat_mirror` rows for Telegram turns); `mc_bridge_tokens (token_hash, owner_id, label, created_at,
  last_seen_at)`; `app_singletons` (retired).
- **`mc_setup` row ids in use**: `me` (the office: CEO name, org, vibe, departments with leads /
  personalities / worker counts, completed-at) · `room-tasks` · `workers` · `vault` · `vault-once` ·
  `drafts` · `goals` · `scratch` · `budgets` · `playbooks` · `views` · `telegram` · `shabbos` · `pause`
  · `pccontrol` · `room-requests` · `catalog-learned` · `library-grants` · `skills-catalog` ·
  `cross-projects` · `policies` · `maria-memory` · `memory-trash` · `know-me` · `activity-log` ·
  `personality` · `police-reports` · `cost-history` · `workspace-files` · `engine-inventory` ·
  `gog-auth-help` · `hb-latest` · `dev-status` · `dev-events` · `dev-live` · `door-guard`.
- **Demo content tables** (migration 0001, seeded from the mock data; read-only): departments ·
  agents · missions · mission_comments · projects · project_milestones · playbooks · approvals (+ code-
  change columns from 0002) · activity_log · notifications · briefings · calendar_events · cron_jobs ·
  memory_docs · council_motion · council_members · council_statements · doc_sources · doc_files ·
  cost_daily · cost_by_dept · cost_by_agent · cost_by_model · app_singletons.
- **Migrations**: 0001 schema · 0002 approvals code-change · 0003 close the public door (RLS on,
  drop every policy, revoke anon/authenticated — not yet run live) · 0004 accounts (`owner_id` on the
  three live tables, composite keys, RLS for signed-in people, demo read-only, bridge tokens,
  `claim_legacy_office()`).
- **Planned**: real tables `dev_projects · dev_tasks · dev_events`; `mc_chats` (paging / retention).
- **Data path**: browser → `/api/data` (allow-listed described queries: select / eq / in / order /
  limit / single / insert / upsert / update / delete; a change must name rows; max 500) → PostgREST
  with the person's own token (row-level security is the second belt). PC → `/api/rest/<table>` with
  its bridge token and a PC table allow-list. No Realtime subscriptions and no edge functions: the PC
  pushes every ~20 s and polls every 2 s; the site polls rows (3-min freshness).
- **Server functions** (Vercel): `/api/door` (GET / POST code / DELETE lock) · `/api/auth` (who am I;
  sign up / in / out / recover / delete) · `/api/data` · `/api/rest/*` · `/api/bridge-token` (list /
  mint / revoke) · `/api/maria` (cloud Maria fallback) · `/api/tts` (OpenAI voice) · `/api/tripo-
  generate` + `/api/tripo-status` · `/api/errors` (→ Sentry) · `/api/health`. Rate limits per visitor
  per door (data 240/min · auth 20/min · maria 30/min; 429 + Retry-After).
- **Env vars**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `MC_SESSION_SECRET`,
  `MC_BRIDGE_TOKEN`, `MC_LEGACY_OWNER_EMAIL`, `MC_ACCOUNTS`, `MC_ACCESS_CODE`, `ANTHROPIC_API_KEY`,
  `OPENAI_API_KEY`, `TRIPO_API_KEY`, `SENTRY_DSN`; PC: `HERMES_URL`, `HERMES_TOKEN`, `POLL_SECONDS`, `ENABLE_COMMANDS`,
  `BRIDGE_STATE_DIR`, `MC_SITE_URL`, `MC_BRIDGE_TOKEN`, `MC_OFFICE_LOCK`, `MC_WORKSPACE_DIR`,
  `DEVROOM_DIR`, `SUPERMEMORY_API_KEY/_API_URL/_MCP_URL`, `TELEGRAM_TARGET`.

### 12.2 Browser stores (localStorage, most mirrored to a cloud row; 55 `mc.*` keys; backup covers 26)
`mc.setup.v1` (office) · `mc.room.tasks.v1` (RoomTask: id, dept, title, detail, stage, agent, result,
notes[{text, at, from owner|agent}], history[{at, what}], due, priority, at) · `mc.workers.v1`
(Worker: id, dept, name, role, autonomy, status active|paused|retired, hiredAt, retiredAt, temp) ·
`mc.activity.v1` · `mc.knowme.v1` · `mc.vault.v1` · `mc.vault.once.v1` · `mc.drafts.v1` (email|message,
to, subject, body, task, status) · `mc.telegram.v1` · `mc.shabbos.v1` · `mc.budgets.v1` ·
`mc.policies.v1` (title, rule, chapter office|room|agent, room, agent, topic, kind, hardLimit, setBy,
version, active, supersedes / supersededBy, clashPending) · `mc.playbooks.v1` · `mc.pause.v1` ·
`mc.views.v1` · `mc.goals.v1` · `mc.scratch.v1` · `mc.snooze.v1` · `mc.notif.read.v1` ·
`mc.notif.seen.v1` · `mc.eod.v1` · `mc.visit.v1` · `mc.pccontrol.v1` · `mc.maria.memory.v1` +
`mc.memory.trash.v1` + `mc.memory.sync.v1` + `mc.memory.mapmode` · `mc.council.v1` +
`mc.council.sessions.v1` + `mc.council.takeup.v1` · `mc.room.requests.v1` · `mc.crossprojects.v1` ·
`mc.cost.history.v1` · `mc.workspace.v1` · `mc.library.v1` · `mc.catalog.learned.v1` · `mc.police.v1` ·
`mc.pins.v1` · `mc.undo.v1` · `mc.outbox.v1` · `mc.chat.threads.v1` + `mc.chat.<key>` · `mc.chat.speak`
· `mc.personality.v1` · `mc.engine.lastseen.v1` · `mc.hermes.snapshot` · `mc.sm.saved` ·
`mc.office.lock` · `mc.om.name` · `mc.lang` · `mc.onboard.seen` · `mc.intro.seen` ·
`mc.devroom.prefs.v1` · `mc.home.assembly.v1` · `mc.home.devroom.v1` · `mc-dashboard-layout` ·
`mc-dashboard-spans` · `mc.roomwork.waiting.v1` · `mc.connection.handoff.v1` · `mc.installer.*.v1` ·
`mc.maria.hookup.<svc>.v1` · `mc-live-catalog-v1` · `mc.pref.deptmodel.<dept>` /
`deptthinking.<dept>` / `history.<dept>` · `office.placedObjects.v1` · `office.walls.v2` ·
`office.rooms.v1` · `office.quality` · `office.ideas` · `mission-control.who`. Three copies of truth
for some things (browser · cloud row · Library) — "hydrate-merge"; the Library is boss.

### 12.3 Core types
Dept {name, dot, chip, workers, status Working|Idle} · Agent {id, name, role, room, status, progress,
doing} · Mission {id, title, dept, agent, stage Ideas|Inbox|Scheduled|In Progress|Review|Done,
priority Low|Normal|High, tags[], tools[], progress, due, source, comments[]} · Project {id, name,
dept, lead, description, status On track|At risk|Planning, progress, due, coding, milestones[{label,
done}]} · Playbook {id, name, dept, trigger, description, steps[], runs} · Approval {id, agent, dept,
title, detail, action, risk Low|Medium|High, tools[], time, category Action|Code change, requestedBy,
preview, files[]} · LogEntry {id, kind, text, detail, day, time} · Notif {id, kind approval|decision|
alert|standup, text, dept, time, unread} · Briefing {agent, dept, doing, recap, plan, tokens, cost} ·
CalEvent {id, day 0–6, time, title, dept, agent} · CronJob {id, title, schedule, dept, agent, next} ·
MemoryDoc {id, type Working|Long-term|Journal, title, dept, agent, updated, body} · DocSource {id,
name, kind local|google|zoho, account, connected, count} · DocFile {id, name, kind doc|sheet|pdf|
folder|image, sourceId, modified, access[]} · FileNode {name, kind, size, modified, children} ·
Policy · VaultConnection {id, service, label, grants[], powers, powerModes, identified, skill,
keyName, keyInstaller, personalWall, codeRequired, setupNote, proofNote, proofAt, accountId,
accountLabel, tested, status waiting-pc|active|revoked, addedAt} · MemoryFact {text, dept (a|b for
shared), agent, floor, savedAt} · EngineMemory {id, text, agent, metadata} · dev rows `dev-status
{projects[{id, emoji, state working|awake|asleep, currentTask, queue, lastResult, restAfter}]}`,
`dev-events [{taskId, project, kind, at, model, summary, files, link, elapsed}]`, `dev-live {steps[]}` ·
Snapshot (see 6.2). Room colours: Office Management indigo · CEO Office amber · Personal emerald ·
Yesh Magnetim violet · TzviAir sky · Photoshop / RBS Store amber · Studio rose · Lashon Hatov teal ·
Development settable (sky) · Police Station blue-800.

### 12.4 Files on the PC
`C:\MissionControl\DevRoom\` (dispatch\, devroom-status.json, dexter\ CLAUDE.md + memory\{brief,
preferences, log}.md + tools\ + telegram-state\ + bot-token.txt + brain.txt + resume.flag + mirror\,
projects\<id>\telegram-state\inbox\, claude-config\, dev-mappings.json, dev-events.json) ·
`Home Base\office-state\*.json` (see 6.5) · `%PROGRAMDATA%\Hermes\hermes.json` (skills entries, MCP mounts,
dmScope, agents) · `the Hermes event log` (transcripts) · journals · Downloads
sub-folders for audio / visuals / frames.

### 12.5 Constants worth keeping
$3 per million tokens (declared estimate) · 60-day cost history · ~20 rules per chapter · council
guard 20 messages, points every 3, phone ping every 10 · snooze 1 h · away digest after 30 min ·
chat patience ~2¾ min / asleep verdict ~30 s / late watch ~5 min · idle 45 min · digest 21:00 · tick
20 s / commands 2 s / probes 2 min & 30 min · door cookie 12 h, 5 wrong → 15 min · office lock 2 min ·
trash 30 days · Shabbos window Fri sunset −18 → Sat sunset +42 · files 400 entries / depth 4 ·
memory brief cap ~20 · 3-min "fresh" snapshot.

---

## 13. The proof system (how "built" is checked)

- **`npm run prove`** (the FAST gate; one run at a time behind a lock): typecheck (app + server) →
  server-bundle check → build → key scan (no DB key in the built page) → dead-control sweep (banned
  stand-ins: demo text, empty handlers, "#" links, TODOs, fake alerts) → unit tests (~788, Vitest) →
  bridge tests (1,359 asserts) → Home Base tests (1,822 asserts) → control census (406–431 controls,
  0 dead ends → `WIRING.md`) → real-door + real-accounts tests → Playwright acceptance for the touched
  screens (3 workers; 90 s normal / 15 min for the 3D office; click-tests, reload round-trips,
  screenshots, video). **`npm run prove:full`** = the whole suite (~63 min). Also `prove:live` (real
  bridge round-trip), `prove:door`, `prove:site`, `check:live` (nightly real Chrome at the deployed
  site, also a Windows scheduled task at 3:00 AM), `wait:deploy`, `qa:office`, `seed`, `sweep`,
  `census`, `keyscan`, `audit-open` (opens the built app with a realistic office: owner "Dana", seven
  rooms, tasks in every stage, the PC's real report, an active Vault row).
- ~100 acceptance specs, one per proven behaviour (accounts, approvals send-back, assembly, away
  digest, backup, power tools, bell + ⌘K, board views, budgets, bulk actions, calendar, connections,
  cost, council v2–v5, crew, cross projects, data health, dev room, docs, drafts, end of day, files,
  folder keyhole, front door, goals, happening, Hebrew ×3, Home Base UI incl. every shared installer,
  home, know-me, landing, library, Maria chat / connect card / hookup / intro / summon, memory map /
  tools, navigation URLs, never silent, notifications, office bell / live / lock, PA fixes, pause, PC
  control, permissions, phase-locked, phone layout, photo mode, playbooks, policies, prefs, progress
  page, projects, quick capture, room chat / health / history / overview, scratchpad, settings health,
  Shabbos, start-day, system rooms, Telegram mirror, undo, vault (every connector's website + wizard
  journey), workspace).
- **GitHub Actions**: `qa-office.yml` (the 3D office on a real browser on every push to main touching
  it) · `build-homebase.yml` (Windows installer → rolling release, cloud version stamp, prune) ·
  `live-site-check.yml` (nightly + after deploy).
- **The progress page** (`/progress-html/`, a bright visual mirror of TASKS.md): "where we are" panel
  (overall %, slices done/left, wiring-coverage meter, what's next) · phase bars · **Build** tab (253
  steps with "✅ Verified — what we built" + named full-size screenshots / videos) · **Features** tab
  (13 phases A–L with item status) · **👁 Verify with your eyes** tab (75 items with step IDs) · **🔍
  Audit** page · Idea Inbox (84 ideas with 💡 / 🔄 / 🟢 / ⏭) · Two-AI activity board · extra pages
  (memory brief, scenarios, Hermes-vs-Claude report, mockups).
- The 30-rule **Build-and-Prove protocol** (in CLAUDE.md): vertical slices on real data; Done
  Contract before code; full ripple map; wiring inventory; tests that prove not perform; screenshots
  shown in chat + two visual passes + fix loop; step IDs; the 👁 verify list; Idea Inbox confirmed out
  loud; companions offered before building; nothing merges to main unproven.

---

## 14. Planned, parked and known-broken (the honest remainder)

### 14.1 The roadmap stages (frozen map, items 1–102) and where they stand
- **Stage 1 — prove it live on the PC** 🟢 (bridge auto-starts; honest Connected; Maria round-trips;
  Maria builds a room that appears in the rail + 3D; a room does a task and reports; Review → board →
  Activity; Approve → Done). Still open: reset the demo office · Maria interviews you → real
  departments · each department its own agent (built, flip not run).
- **Stage 2 — trustworthy dashboard** ✅ mostly (audit mock vs real · PIN → door · real widgets · ⌘K ·
  empty states · honest Cost / Calendar / Projects / Docs · Health · bell · PWA · mobile · offline ·
  Hebrew batches 1–4 · search/filter · walk-in intro · Happening rename · no-dead-ends sweep). Open:
  Settings/Health CPU-RAM-uptime from the PC; QA on desktop + phone.
- **Stage 3 — Maria as chief of staff** 🔄 (see 5.7) + MEMORY M1–M7 (superseded by the supermemory
  hookup + Master Plan).
- **Stage 4 — permissions, the Vault, real account actions** 🔄: Vault ✅ · Connections ✅ ·
  permissions UI ✅ · verification click + optional 4-digit code ✅ · connector framework ✅ · Gmail /
  Calendar / Zoho / Suno-Higgsfield-Tripo / social ⬜ · email read / unsubscribe / send from a chosen
  account / read calendar ⬜ (drafts → your OK ✅) · policy engine v1 ✅ · reversible gate ✅ · per-use
  paid-API gate + per-agent budgets ⬜ (weekly caps ✅) · one-time grants ✅ · privacy wall (connection
  half ✅, tasks/memory ⬜) + personal team in the CEO room ⬜.
- **Stage 5 — per-worker control & the skills platform** 🔄: named workers ✅ · pause/close ✅ ·
  permissions + autonomy editor (UI ✅, by-chat with read-back ⬜) · retire-not-delete ✅ · retired view ✅
  · temp workers ✅ · Skill / Plugin / MCP library (dashboard inventory ✅; engine enforcement ⬜) ·
  server-rack visuals ⬜ · grant-anywhere prompts ⬜ · **Scout / research agent** (studies the office,
  scouts tools, drops ideas into Approvals → missions) ⬜ · themed rooms ⬜ · spawn-a-character ⬜ ·
  character library ⬜ · room preview ⬜ · RAG rooms ⬜ · **self-modification Dev room** (proposed →
  previewed → approved) ⬜ · cross-room teams (data ✅) · git worktrees ⬜ · meeting-room whiteboard ⬜ ·
  CEO summary report ⬜ · cross-team category ⬜.
- **Stage 6 — Telegram** 🔄 (see 10). **Stage 7 — the living office** 🔄 (see 4.8). **Stage 8 —
  insight & automation** 🔄: crons that fire + watch-folders + executable playbooks ⬜ · goals ✅ / OKRs
  ⬜ · scorecards ✅ · weekly review ✅ (Assembly) · room health ✅ · cost forecast ⬜ · per-agent drill by
  day/hour ⬜ · budgets ✅ / alerts ⬜ · wrap-up ✅ · digest ⬜ · while-away ✅ · inbox ✅ · saved views ✅
  · pins ✅ · bulk ✅ · pause-everything ✅ · confirm destructive ✅ · comments/@mentions ⬜ · scratchpad
  ✅ · accent picker ⬜ · agent of the week ⬜ · suggestion box (3D ✅) · work history ✅ · day-in-30s ⬜ ·
  focus/DND ⬜ · two-way Calendar sync ⬜ · per-agent emotional voices ⏭. **Stage 9 — final live
  verification** ⬜ (full click-through desktop · phone · Telegram; Issac signs off).
- **Parked / gated**: public SaaS (Phase I; only after the demo works and Issac says go) · backup &
  export (✅ since) · Codex as brain #2 · local supermemory install.

### 14.2 The 2026-09-02 professional audit — what a rebuild must not repeat
421 findings (14 broken · 99 fake or misleading · 199 weak · 109 polish) from ≈620 controls pressed
and 566 screenshots. The top broken items: Send-back threw the instructions away (fixed PA-1) · the
voice orb restarted speech recognition ~1,000×/s when the mic was blocked (fixed PA-2) · keyboard
users couldn't reach the page (fixed PA-4) · ⌘K phantom results (fixed) · Hebrew bell dropdown
off-screen and the Rulebook unusable on a phone (fixed PA-3) · the demo bell was fake (fixed) · the
whole memory / rules / org machinery (B1–B10) has never run live · real workers render as plain
capsules · the 3D office is unusable on a phone · no Police room / no Maintenance desk on the live
floor · "Chat with Aaron" is a dead end. The misleading ones: four Settings cards (Agents & autonomy,
Guardrails, Spawn governance, Brain & models) save nothing · "Restore demo data" wiped the office in
one click (now confirmed) · comments and decisions never reach the agent and were all signed "Issac" ·
"your PC is asleep" shown with no cloud at all · two Marias · a static "Online" pill · Cost dollars
from a hidden $3/M rate · ~40 dead-end store tiles · the cluster graph hidden behind "Ball" · Backup
exports 7 of the promised stores · codenames / dev notes on customer screens · Hebrew 57 % translated
· 400+ contrast failures · 111 button styles · every 2D screen downloads the 3D office · the landing
listed Issac's private businesses · "New project" creates nothing · Docs / Files can't open anything ·
per-room agents don't exist live · the office never reads Hermes. Standing lesson: a gap list is
worth nothing until someone has pressed every control in the running app and looked at the shots.

### 14.3 Open questions for Issac ("Needs Yitz", asked once)
What a paying stranger with no office PC gets (default: bring your own PC via Home Base; cloud Maria
next) · live DB login Path A vs a new project B · Personal wall vs "Maria's starter kit = everything"
(wall) · hosted vs PC supermemory (hosted; the Mover stays) · UI approach (tokens + primitives) ·
landing CTA (open sign-up behind the flag) · which email claims the legacy office · backups (Supabase
Pro at launch) · billing (free beta, Stripe later) · delete the 0331 placeholder once accounts are live.

### 14.4 Launch checklist (LAUNCH.md)
A accounts (run migration 0004, email provider on, site URL + redirect, Vercel env vars, create an
account + claim the office, remove the placeholder code) · B data safety (anon revoked ✅, backups
plan, per-office export, delete-my-account ✅) · C abuse / errors / limits (brute-force lock ✅,
throttle ✅, Sentry, health ✅) · D product completeness (no-PC first run, gap blockers, landing sign-
in/up) · E performance & devices (390 px pass, bundle budget, font swap, 3D lazy, two people isolated)
· F last mile (FULL gate green, live-site check, Issac's own sign-up walkthrough, one stranger signs
up on their phone).

---

## 15. The working method that shaped the product (keep it if you rebuild)

Plain natural language always (rule #1, Issac is non-technical) · "Hermes", never "engine" ·
production copy only · bright theme only · do it right the first time, no hacks · one task at a time
· build step-by-step with no loose ends, foundation first, calculate from the finished app backwards ·
merge to `main` only behind a green gate · never the pop-up question picker (numbered lists in chat) ·
every step gets a permanent ID + name · report-back shape (✅ step · Done Contract · Wiring "X of X
controls click-tested" · Ripple · 📸 screenshots in the chat · 👀 fresh eyes · 🧪 checks · 👁 verify list
· 💡 Idea Inbox · 📍 position) · the three live records (TASKS.md · the progress page · WIRING.md) updated
on every action turn, never on question turns · ROADMAP.md frozen · the Slow Plan method (one small
sitting per page, starred recommendations, numbered locked picks, a sealed master file) for any new
area · parallel workers get their own worktree, branch and file list; the primary builder owns the record.

---

## 16. Timeline (for orientation)
2026-06-15 first notes (Hermes v2026.6.6; "Octopus dashboard" idea; build from scratch chosen over
forking; TenacitOS cloned for reference only; three reference dashboards merged: Cathryn / Bhanu /
Alex Finn) · 06-17 Home v1, all 11 rail screens, isometric office, ⌘K, Start My Day, notifications, 🐙
· 06-18 tiered 3D quality locked · 06-25 wiring plan (CLI → bridge → Supabase → dashboard) · 06-27
TASKS.md becomes the one master list · 06-30 Stage 1 proven live on the PC; the 30-rule protocol ·
07-01 supermemory locked; PIN; real screens; Photo Mode; walk-in intro · 07-06/07 Protocol v2: the
whole dashboard real (14 slices); Phase K helpers; Vault D1; drafts D3; Shabbos F1; backup F2; budgets
F3; policies F4; Telegram mirror E1 · 07-08/09 Home Base v1 → v2 (multi-screen) · 07-10/12 F-Gate,
memory layers, privacy wall, undo, cross-room projects, temp workers, J-Lib · 07-12 Maria's own room
locked; connection-system replan · 07-14 CS-v3 "store of everything" locked; Council v5 · 07-16 the
30 rules re-locked; three-connector batches · 07-26 parallel-worker handoff · 08-02 Weather = first
real connection · 08-13/14 Dev Room plan + lock · 08-17 Dexter live; Mission Control built through
the Dev Room · 08-18 real-vs-fake audit; server-side door · 08-19 memory-system map · 08-21 the Master
Memory Plan sealed (46 picks) · 08-22/23 B1–B10 built overnight · 08-28 UI fix scan → FIX-1…16 · 09-02
accounts foundation (ACC-1…8), UI tokens, the professional audit (421 findings), PA-1…4 fixes.
