# Done Contract: Hermes runtime contract

**Written**: 2026-09-09, **before any code** — Constitution Principle II.
**Feature**: 001-hermes-runtime-contract

> This document exists so "done" cannot be argued about later. It is written first, so it
> is a commitment that can be failed against — not a description of whatever got built.

## What "done" means for this feature

Done is **not** "the tests pass". Done is: Issac sat at his own PC, did each thing below,
and saw it work.

## What will be demonstrated, and how

| # | What Issac will see | How it is shown | Proves |
|---|---|---|---|
| **1** | He types a message to a room and gets a real answer back | Live, on his PC, with the reply on screen | SC-001 |
| **2** | The same room, asked again, remembers the first exchange | Two messages in one thread | FR-007, SC-005 |
| **3** | A brand-new department answers immediately — no setup, no restart | Create it, message it, within one minute | SC-005 |
| **4** | Every step of a turn, listed as it happens | The event trail printed live | FR-006 |
| **5** | An agent that answered nobody **says so** rather than going quiet | A deliberately empty turn, reported as empty | SC-004 |
| **6** | Something Hermes cannot do is **named**, not broken | Telegram switched off → the control locks with a plain sentence | SC-002 |
| **7** | An agent tries to send something outward and **is stopped** | Attempt with the power set to Ask → nothing sent, approval waiting | SC-003 |
| **8** | Approving twice sends **once** | Double-tap approve → one result | Idempotence |
| **9** | A timer fires on time, and holds on Shabbos | A job run, then a job held inside the window, with the hold visible after | SC-006 |
| **10** | Nothing in the website names a vendor | The grep gate run in front of him, passing | SC-007 |

## Evidence required before this feature is called done

- [ ] Screenshots of each of the ten items above, in this conversation
- [ ] The full test suite green, run in front of him
- [ ] The architecture gates green: no vendor name outside `adapters/`, no tool path bypassing the gate, no roster inside Hermes
- [ ] The spike findings written into `research.md` and signed off
- [ ] Two visual passes and the fix loop completed

## The 👁 verify list — only Issac closes these

Nobody else may tick these. Not a test, not a green build, not me.

- [ ] 👁 **001-V1** — I sent a message to a room and got a real answer, on my own computer
- [ ] 👁 **001-V2** — I made a new department and it answered me straight away
- [ ] 👁 **001-V3** — I saw an agent get stopped from sending something without my OK
- [ ] 👁 **001-V4** — I saw it tell me plainly about something it could not do
- [ ] 👁 **001-V5** — I saw a scheduled job get held for Shabbos, and I could see the hold afterwards

## What is explicitly NOT in scope for done

So that "done" cannot quietly expand:

- No connectors work yet (that is 011). Telegram is a **declared capability**, not a working one.
- No 3D office (015), no Dev Room (016), no Home Base (017).
- The website is not built (003). This is proven through the API and its tests.
- Only one brain lane needs to work. The fallback adapter may exist untested.

## The honest failure clause

If any of the ten demonstrations cannot be shown, this feature is **not done**, and the
report says exactly which one failed and why. A partial pass is reported as a partial pass.

There is no version of this where "the tests pass" substitutes for Issac seeing it.
