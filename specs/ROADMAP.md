# The spec set — decomposition, dependencies and coverage

> The owner's instruction: **spec everything before any code.** This file is the map.
> It cuts v1's sixteen sections into twenty numbered features, orders them by dependency,
> and proves — section by section — that nothing was left without a home.

**Source of truth:** [`docs/FEATURES.md`](../docs/FEATURES.md) (Hermes) →
[`docs/FEATURES-V1-ORIGINAL.md`](../docs/FEATURES-V1-ORIGINAL.md) (untouched v1).
**Why things changed:** [`docs/HERMES-RIPPLE.md`](../docs/HERMES-RIPPLE.md).
**Rules that outrank every spec:** [`.specify/memory/constitution.md`](../.specify/memory/constitution.md).

---

## ⚠ Gate before planning

Two features **must not be planned** until the brain question is settled
(`docs/HERMES-RIPPLE.md` §4 — flat-rate subscription vs metered API):

- **012 · cost-ledger** — the entire screen's meaning depends on it
- **008 · approvals-money-gate** — the *ask-when-it-costs-money* switch position needs a
  definition of "costs money"

Run `/speckit-clarify` on those two first. Every other feature can be planned today.

---

## The twenty features

Ordered by dependency. A feature may only depend on lower numbers.

### Tier 0 — the seam and the pipes

| # | Feature | What it is | v1 §§ |
|---|---|---|---|
| **001** | `hermes-runtime-contract` | The five-verb contract, `capabilities[]`, session keys, the event stream, the tool gate, the scheduler | 2.7, 2.9, 2.10, 6.6 |
| **002** | `pc-bridge` | The courier: snapshot push, command pull, office lock, cloud lanes | 6.1–6.5 |
| **003** | `app-shell` | Routing, chrome, design tokens, primitives, Hebrew/RTL, PWA, accessibility, offline | 2.13, 3.0 |
| **004** | `front-door-accounts` | Keypad door, Supabase Auth, RLS, owner scoping, rate limits | 2.12, 3.2, 12.1 |

### Tier 1 — the office exists

| # | Feature | What it is | v1 §§ |
|---|---|---|---|
| **005** | `office-setup-roster` | Wizard, departments, rooms, people, career ladder, personality engine, hire/retire/rehire | 1.1–1.6, 3.3 |
| **006** | `maria-ai-layer` | Persona, assembled briefings, the hidden-actions block, chat, voice, honest-offline | 5.1–5.7 |
| **007** | `missions-board` | Happening, Projects, Playbooks, Calendar | 3.5–3.8 |
| **008** | `approvals-money-gate` | The deck, five actions, four-way power switch, reversible/irreversible | 2.2, 2.3, 3.11 |

### Tier 2 — the machinery that makes it trustworthy

| # | Feature | What it is | v1 §§ |
|---|---|---|---|
| **009** | `memory-system` | Three shelves, five floors, doors, trash, superseding, the Mover, the Map | 2.5, 3.12, 11 |
| **010** | `rulebook-police` | Chapters, rule life-cycle, clashes, police patrol, nightly librarian | 2.6, 3.13 |
| **011** | `connections-vault` | Vault, repo-owned catalog, installers, lanes, keyholes, Personal wall | 2.1, 2.4, 2.11, 3.14, 8 |
| **012** | `cost-ledger` | Cost witness, breakdowns, weekly caps, the Run gate | 3.15 |
| **013** | `home-dashboard` | Home widgets, Activity, Notifications, Start/Wrap my day, ⌘K, while-you-were-away | 3.4, 3.18, 3.19, 3.23 |

### Tier 3 — the things that make it his

| # | Feature | What it is | v1 §§ |
|---|---|---|---|
| **014** | `council-assembly` | The mini-parliament, debates, odds board, Weekly Assembly | 3.10 |
| **015** | `office-3d` | The scene, characters, editor, photo mode, in-world controls, props, games | 3.9, 4 |
| **016** | `dev-room` | Dexter, the Helper, dispatch, autonomy, schedules, message design | 3.20, 9 |
| **017** | `home-base` | The Electron PC app: lights, feed, wizard, folders, tray, watchdog | 7 |
| **018** | `telegram-phone` | Telegram channel, one-conversation-everywhere, mirror, the three pings | 2.8, 10 |
| **019** | `docs-files` | Docs sources, workspace file tree, ask-your-docs | 3.16, 3.17 |

### Tier 4 — the gate

| # | Feature | What it is | v1 §§ |
|---|---|---|---|
| **020** | `proof-system` | `prove`, acceptance specs, control census, QA hooks, CI, the progress page | 4.7, 13 |

---

## Dependency graph

```
001 hermes-runtime-contract ──┬── 002 pc-bridge ──┬── 006 maria-ai-layer
                              │                   ├── 009 memory-system
                              │                   ├── 012 cost-ledger ⚠
                              │                   ├── 016 dev-room
                              │                   └── 017 home-base
                              └── 011 connections-vault (tool gate)

003 app-shell ──┬── 004 front-door-accounts
                ├── 005 office-setup-roster ──┬── 007 missions-board ── 014 council-assembly
                │                             ├── 010 rulebook-police
                │                             └── 015 office-3d
                ├── 008 approvals-money-gate ⚠
                ├── 013 home-dashboard
                └── 019 docs-files

018 telegram-phone → needs 001 (channel capability) + 006 (Maria)
020 proof-system → wraps everything; written early, run always
```

**Milestone 1 (the thin end that proves the seam):** 001 → 002 → 003 → 004 → 005 → 006.
At that point one real department, staffed by one real agent, holds one real conversation
through Hermes, and the honesty machinery is exercised end to end. No 3D, no connectors,
no Dev Room.

---

## Coverage matrix — every v1 section has a home

The "nothing lost" proof. Every section of `docs/FEATURES.md` maps to at least one feature.

| v1 § | Title | Owned by |
|---|---|---|
| 0 | What this is | constitution + this roadmap |
| 1.1–1.3 | People, roles, personalities, career ladder | **005** |
| 1.4–1.5 | Issac's departments, business types | **005** |
| 1.6 | The update ladder | **006**, **013**, **018** |
| 1.7 | Tool requests | **011**, **008** |
| 2.1 | Vault | **011** |
| 2.2 | Reversible vs irreversible | **008** |
| 2.3 | The money gate | **008**, **001** (enforcement) ⚠ |
| 2.4 | The Personal wall | **011** (connection half), **009** (memory half) |
| 2.5 | Memory: shelves, floors, doors | **009** |
| 2.6 | Rulebook + Police | **010** |
| 2.7 | Assembled briefings | **001**, **006** |
| 2.8 | One conversation everywhere | **018**, **006** |
| 2.9 | Every room = its own agent | **001** *(dissolved — R2)* |
| 2.10 | Brain | **001** ⚠ |
| 2.11 | Connections: the three doors | **011** *(R3)* |
| 2.12 | Security | **004**, **002** (office lock) |
| 2.13 | Tech stack | **003** |
| 3.0 | Shell, routing, gates, global behaviour | **003** |
| 3.1 | Landing page | **003** |
| 3.2 | Front door and sign-in | **004** |
| 3.3 | Maria's intro + setup wizard | **005** |
| 3.4 | Home | **013** |
| 3.5 | Happening (Missions board) | **007** |
| 3.6 | Projects | **007** |
| 3.7 | Playbooks | **007** *(R8)* |
| 3.8 | Calendar | **007** *(R8)* |
| 3.9 | Office (on-screen controls) | **015** |
| 3.10 | Council | **014** |
| 3.11 | Approvals | **008** |
| 3.12 | Memory screen | **009** |
| 3.13 | Rulebook screen | **010** |
| 3.14 | Connections screen | **011** |
| 3.15 | Cost | **012** ⚠ |
| 3.16 | Docs | **019** |
| 3.17 | Files | **019** |
| 3.18 | Activity | **013** |
| 3.19 | Notifications | **013** |
| 3.20 | Dev Room (website side) | **016** |
| 3.21 | Settings | **003** (frame) + each feature owns its own card |
| 3.22 | Department workspace | **005**, **007** |
| 3.23 | Global overlays | **013** (⌘K, day slideshows), **006** (Maria chat, voice orb) |
| 4.1–4.8 | The 3D office, editor, photo mode, QA hooks | **015**, **020** (hooks) |
| 5.1–5.7 | Maria and the AI layer | **006** |
| 6.1–6.5 | The bridge | **002** |
| 6.6 | The Hermes contract | **001** |
| 7 | Home Base | **017** |
| 8.1–8.3 | Connection system, connectors, recipes | **011** |
| 9 | The Dev Room | **016** |
| 10 | Telegram and the phone | **018** |
| 11 | Memory engine specifics | **009** |
| 12.1 | Supabase tables and migrations | **004** (schema + RLS), each feature owns its rows |
| 12.2 | Browser stores | **003** (the store pattern), each feature owns its keys |
| 12.3 | Core types | each feature owns its own |
| 12.4 | Files on the PC | **002**, **016**, **017** |
| 12.5 | Constants worth keeping | **constants registry**, below |
| 13 | The proof system | **020** |
| 14.1 | Roadmap stages 1–9 | folded into the twenty features |
| 14.2 | The 2026-09-02 audit | constitution + per-feature "must not repeat" |
| 14.3 | Open questions for Issac | `/speckit-clarify` per feature |
| 14.4 | Launch checklist | **020** |
| 15 | The working method | constitution |
| 16 | Timeline | history; kept for orientation |

**Result: 0 orphaned sections.**

---

## The constants registry (v1 §12.5)

These are product decisions with real reasoning behind them. They belong to no single
feature and must not be re-litigated feature by feature. Each spec references this list
rather than restating a number.

| Constant | Value | Owner |
|---|---|---|
| Snapshot freshness | 3 min | 002 |
| Snapshot push / command pull | 20 s / 2 s | 002 |
| Office lock freshness | 2 min + nonce replay guard | 002 |
| Door cookie / lockout | 12 h · 5 wrong → 15 min | 004 |
| Chat patience | ~2¾ min | 006 |
| "Asleep" verdict | ~30 s with no pickup | 006 |
| Late-reply watch | ~5 min | 006 |
| Away digest threshold | 30 real minutes | 013 |
| Notification snooze | 1 h | 013 |
| Memory trash retention | 30 days | 009 |
| Briefing memory cap | ~20 items | 009 |
| Rules per chapter (soft cap) | ~20 | 010 |
| Council credit guard | 20 messages · points every 3 · ping every 10 | 014 |
| Cost history retention | 60 days | 012 |
| Token cost estimate | $3 / M ⚠ *contingent on the brain question* | 012 |
| Dev session idle | 45 min (per-project override) | 016 |
| Nightly digest | 21:00, off by default | 016 |
| Channel probes | 2 min configured · 30 min not | 002 |
| Workspace walk | 400 entries · depth 4 · refresh 10 min | 019 |
| Shabbos window | Fri sunset −18 min → Sat sunset +42 min | 013 |
| Police patrol / librarian | 00:00 UTC / 01:00 UTC | 010 |

---

## Status

Every feature below has a written `spec.md`. **No `plan.md` or `tasks.md` exists yet, and
no application code exists yet** — that is deliberate, and it is what the owner asked for.

**Next steps, in order:**
1. Owner reads the specs and the ⚠ brain question.
2. `/speckit-clarify` on **012** and **008** once the brain question is answered.
3. `/speckit-plan` per feature, Tier 0 first.
4. `/speckit-tasks` per feature.
5. `/speckit-implement` — Milestone 1 only, then stop and prove.
