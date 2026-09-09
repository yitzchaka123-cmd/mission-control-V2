# The v1 3D assets — inventory and migration

> **This is the one thing being carried over from v1.** Everything else in this repository
> is being rebuilt from the specification. The owner's words: *"I rendered a bunch of 3D
> objects for the 3D office... that's the only thing I want to take from the old program."*

**Source:** `yitzchaka123-cmd/Mission-Control` @ `9914449` — path `my-mission-control/public`
**Captured:** 2026-09-09 · **260 files · 195 MB**
**Byte-exact manifest with hashes:** [`assets-3d/MANIFEST.json`](../assets-3d/MANIFEST.json)

---

## ⚠ Why the binaries are not committed to this repo yet

They are **safe** — they live in the source repo above, and `assets-3d/MANIFEST.json`
records a SHA-256 for every single file, so any drift is detectable.

They are **not committed here** because this repository is currently spec-only, and adding
195 MB of binaries before a single line of application code exists would bloat every clone
of a repo that is, today, entirely documents. `scripts/fetch-3d-assets.sh` pulls and
verifies them in one command when the 3D milestone starts.

**Two things follow from that, and both matter:**

1. **Do not delete or force-push `yitzchaka123-cmd/Mission-Control`.** Until these assets
   are committed here, that repo is the only copy. It is the asset source of record.
2. **Say the word and I will commit them now instead.** No individual file exceeds
   GitHub's 100 MB hard limit (largest is 7.6 MB), so it is a supported, if heavy, choice.

---

## Characters — 12 rendered people, 40 files

Generated in Tripo, with the tiered scheme v1 locked on 2026-06-18: `char.glb` for the
office view, `char.hero.glb` for solo close-ups, `char.perf.glb` for weak devices, and
`char.rigged.glb` carrying the walk/idle clips.

| Character | Tiers available |
|---|---|
| `char_baby` | base 1428 KB |
| `char_devmgr` | base 1770 KB · hero 7408 KB · perf 1039 KB |
| `char_friday` | base 1720 KB · hero 7459 KB · perf 1045 KB · rigged 2012 KB |
| `char_fury` | base 1530 KB · hero 7142 KB · perf 999 KB · rigged 1772 KB |
| `char_jarvis` | base 1291 KB · hero 7361 KB · perf 1012 KB · rigged 1537 KB |
| `char_loki` | base 1407 KB · hero 7055 KB · perf 990 KB · rigged 1629 KB |
| `char_om` | base 1421 KB · hero 7019 KB · perf 986 KB · rigged 1662 KB |
| `char_pepper` | base 1542 KB · hero 7083 KB · perf 986 KB · rigged 1757 KB |
| `char_quill` | base 684 KB · hero 1281 KB · perf 400 KB |
| `char_vision` | base 2407 KB · hero 7769 KB · perf 1114 KB · rigged 2760 KB |
| `char_wanda` | base 1724 KB · hero 7444 KB · perf 1042 KB · rigged 1970 KB |
| `char_wife` | base 1355 KB |

**Rigged (walk + idle animation clips):** char_friday, char_fury, char_jarvis, char_loki, char_om, char_pepper, char_vision, char_wanda — 8 of 12.

**Roster mapping** (v1 §1.1, §4.1): `om` is Maria (Office Manager) · `devmgr` is Dexter ·
`pepper` `jarvis` `friday` `vision` `fury` `wanda` `quill` `loki` are the demo lead roster ·
`wife` and `baby` are the background family NPCs.

**Gaps to fill when the 3D milestone starts:** `quill` and `devmgr` have no `.rigged`
variant, and `baby`/`wife` have no tiers at all. Aaron (CEO agent), Max (Maintenance) and
Officers Stone & Barak have **no character at all** — v1 §4.1 records the matching audit
finding: *"on the live office the Police Station has no room and Maintenance no desk"* and
*"real (non-demo) workers render as plain capsules."*

---

## Props — 109 pieces

| `aquarium` | `arcade_machine` | `armchair` | `bar_stool` |
| `basketball_hoop` | `bean_bag` | `bench_outdoor` | `big_screen` |
| `bollard_outdoor` | `bookshelf` | `bulletin_board` | `bush` |
| `camera_tripod` | `car_blue` | `car_red` | `cash_register` |
| `coat_rack` | `coffee_machine` | `coffee_table` | `conf_table` |
| `council_audience` | `council_bench` | `dartboard` | `desk` |
| `desk_bell` | `desk_calculator` | `desk_dev` | `desk_exec_big` |
| `desk_lamp` | `desk_lshaped` | `desk_mug` | `desk_notebook` |
| `desk_small` | `doormat` | `doormat_hello` | `doormat_office` |
| `exec_chair` | `filing_cabinet` | `fire_hydrant` | `fireplace` |
| `floor_lamp` | `foosball_table` | `fridge` | `front_desk_glass` |
| `globe_desk` | `hanging_plant` | `janitor_cart` | `judge_desk` |
| `kitchen_chair` | `kitchen_clutter` | `kitchen_counter` | `kitchen_table` |
| `kitchenette` | `lamppost` | `laptop` | `magic_8ball` |
| `microwave` | `monitor` | `mop_bucket` | `office_chair` |
| `office_sign` | `parking_lot` | `partition_cubicle` | `pen_cup` |
| `pendant_light` | `pet_dog` | `photo_frame` | `ping_pong` |
| `plant_medium` | `plant_small` | `plant_tall` | `planter_box_outdoor` |
| `planter_outdoor` | `podium` | `poster_art` | `reception_desk` |
| `reception_glass` | `reception_plant` | `recording_mic` | `retail_shelf` |
| `rug_blue` | `rug_green` | `rug_rectangular` | `rug_round` |
| `rug_round_pattern` | `rug_terracotta` | `server_rack` | `side_table` |
| `sofa` | `speaker` | `street_sign_small` | `suggestion_box` |
| `supply_shelf` | `telephone` | `trash_bin` | `trash_bin_outdoor` |
| `tree_pine` | `tree_round` | `trophy_shelf` | `tv_xbox_unit` |
| `vending` | `video_wall` | `waiting_chair` | `wall_art` |
| `wall_clock` | `wall_shelf` | `water_cooler` | `whiteboard` |
| `window_blinds` |  |  |  |

Plus 0 individually-foldered models: .

Every in-world control object v1 specified in §4.3 has its asset here: `bookshelf`
(Memory), `server_rack` (Connections), `video_wall`, `trophy_shelf`, `whiteboard`,
`suggestion_box`, `bulletin_board`, `desk_bell` (the Assembly Bell). So do the §4.4 games
and props: `arcade_machine`, `ping_pong`, `foosball_table`, `dartboard`, `basketball_hoop`,
`magic_8ball`, `aquarium`, `pet_dog`, `fireplace`, `telephone`, `speaker`, `globe_desk`,
`photo_frame`.

---

## `office-layout.json` — the hand-built floor plan

**This is the highest-value single file in the migration.** v1 §4 calls it the build
target: *"Issac's hand-built `public/office-layout.json` is the layout the 3D build must
match."* It is the owner's own design, made in the v1 editor on 2026-06-18.

- Stage **1120 × 840**, snapped to a **25 px** grid
- **91 placed items**

| Item type | Count |
|---|---|
| `desk` | 27 |
| `text` | 13 |
| `partition` | 11 |
| `couch` | 5 |
| `branch` | 4 |
| `hallway` | 4 |
| `plant` | 4 |
| `screen` | 2 |
| `reception` | 2 |
| `counter` | 2 |
| `hangout` | 1 |
| `ceo` | 1 |
| `council` | 1 |
| `audience` | 1 |
| `conftable` | 1 |
| `meeting` | 1 |
| `kitchen` | 1 |
| `office` | 1 |
| `tv` | 1 |
| `pingpong` | 1 |
| `foosball` | 1 |
| `door` | 1 |
| `frontdesk` | 1 |
| `meettable` | 1 |
| `room` | 1 |
| `barstool` | 1 |
| `fridge` | 1 |

Its embedded note, preserved verbatim, carries build instructions that must survive into
the new renderer:

> *Issac's office layout from the editor (2026-06-18, WITH colors + spawn). BUILD TARGET for Batch 4. Coordinates 25px-grid-snapped & approximate (build to the INTENT). spawn:true desks/partitions = RED = hidden in the base scene, appear only when an agent without a desk is added. spawn:true on a ROOM/amenity (e.g. kitchen) is a false positive from its pink fill — ignore spawn for non-desk types. Right-side 'Room' = office maintenance / janitor's closet (high detail).*

Three rules follow from that note and must be encoded in the 3D office spec:
1. **Build to the intent, not the pixel** — coordinates are approximate and grid-snapped.
2. **`spawn:true` on a desk or partition means hidden by default** — it appears only when
   an agent without a desk is added. This is the mechanism behind v1's "seating recomputed
   live when Maria adds a department".
3. **`spawn:true` on a room or amenity is a false positive** from its pink fill and must
   be ignored.

---

## Migration

```bash
./scripts/fetch-3d-assets.sh          # clone, copy, verify
./scripts/verify-3d-assets.py public  # re-verify at any time
```

`fetch-3d-assets.sh` warns if the source repo has moved off `9914449`, and verification
fails loudly on any missing or changed file rather than proceeding quietly.

## Known work these assets still need (v1 §4.1, carried forward)

Recorded here so it is not rediscovered later. None of it is a defect in the assets — it
is the optimisation pass v1 specified but never completed: **KTX2 texture compression ·
baked lighting · LOD / impostors · meshopt compression**. v1's own standing rule was
*"never ship raw GLBs"*, and at 195 MB these are still raw. v1 §4.1's audit finding
*"every 2D screen downloads the 3D office bundle (9.5–18.7 MB)"* is a loading-strategy
problem for the new build to solve, not an asset problem.
