# How this works — the plain English version

> Written for Issac. No code, no jargon. If any sentence here needs a technical
> word to make sense, that's a bug in the sentence — say so and I'll rewrite it.

---

## 1. What GitHub Spec Kit actually is

It's a free tool from GitHub. It doesn't write anything and it isn't clever.

**What it does is force an order, and leave a paper trail at each step.**

| Step | Command | What it produces |
|---|---|---|
| 1 | `/speckit-constitution` | The rules that never change |
| 2 | `/speckit-specify` | **What** you want. Plain English. No tech. |
| 3 | `/speckit-clarify` | It asks *you* questions to fill the holes |
| 4 | `/speckit-plan` | **How** to build it. First place tech is allowed. |
| 5 | `/speckit-tasks` | The step-by-step to-do list |
| 6 | `/speckit-implement` | Actually builds, ticking items off |

Plus checkers: `/speckit-analyze` (do the documents contradict each other?) and
`/speckit-converge` (does the finished code match what you asked for?).

The important bit is the split between **step 2 and step 4**. Step 2 is written so *you*
can read it, catch what's wrong, and correct me — without knowing any code. Step 4 is
where the technical decisions live. Keeping them apart is what lets a non-technical owner
stay in charge of his own product.

---

## 2. "But this project already exists. How does that fit?"

This is the thing that felt confusing, and the answer is simpler than it looks:

> **Starting from your old feature list *is* step 2. You just did it a year early.**

Normally step 2 means describing what you want from a blank page. You had already done
that — in enormous detail, 1,619 lines of it. Nothing about that is wasted, and nothing
about it is skipped.

So the workflow is identical. Only the raw material changed:

```
   Normal:   an idea in your head  →  step 2 writes it down  →  steps 3,4,5,6

   Ours:     your 1,619-line list  →  step 2 reshapes it     →  steps 3,4,5,6
```

**Nothing is being reused from the old project except the 3D models.** Not one line of
the old code. The UI is being designed fresh. What carries over is the *thinking* — the
features you worked hard on — not the building.

---

## 3. "The list has thousands of items. How did you check each one against Hermes?"

**I didn't. And checking each one would have been the wrong thing to do.**

Here's what I actually did, and why it's better.

### First: I looked for where OpenClaw was even mentioned

Out of 1,619 lines, OpenClaw appears on **47 lines**. Under 3% of the document.

That's the first clue. **Most of your features don't care what runs the agents.**

- The aquarium you can feed in the 3D office? Doesn't care.
- Dragging a task from New to In Progress? Doesn't care.
- Shabbos times on the calendar? Doesn't care.
- Retiring a worker and rehiring her with her memory intact? Doesn't care.

That's roughly 95% of your list. Swapping the engine simply doesn't reach it.

### Second: I asked what OpenClaw was actually *doing* for you

Those 47 lines weren't 47 separate problems. They cluster into **14 jobs** OpenClaw was
doing on your PC. Running the agents. Holding the sessions. Talking to Telegram and 12
other chat apps. Providing the app store of connections. Running the timers. Holding the
keys. And so on.

**So the real question was never "do 1,619 features work with Hermes?"**

**It was "which of these 14 jobs does Hermes need to do?"** — and that's a list of 14
decisions, which is a thing a person can actually think about carefully.

Every one of those 14 has a written decision in `docs/HERMES-RIPPLE.md`, with the
consequences traced. That's what the "R1, R2, R3…" markers are — thirteen knock-on effects,
each explained.

### Third — and this is the important safety net

Searching for the word "OpenClaw" would have missed things. Some features depended on it
**without ever naming it.**

The clearest example: your Connections store. Its tiles were generated from OpenClaw's own
catalog of services. The word "OpenClaw" doesn't appear next to most of those tiles — but
take OpenClaw away and there's no catalog to generate from. That's a big change, and a
word-search would have sailed right past it.

So I worked it from **both ends**:
- **From the name** — every line that says OpenClaw.
- **From the job** — for each of the 14 jobs, who was relying on it?

The second pass is what caught the store (ripple R3), the flat-rate cost problem (R4/§4),
and the fact that your calendar couldn't draw its own timers (R8).

---

## 4. "How do I know nothing got lost?"

There's an unbroken chain, and **every link has a check you can run yourself.**

```
  your original list  ──►  the Hermes list  ──►  20 specs  ──►  plans  ──►  tasks  ──►  code
      (untouched)              (same words)                                            (none yet)
           │                        │                │              │            │
        check 1                  check 2          check 3        check 4      check 5
```

| Check | What it proves | How to run it |
|---|---|---|
| **1** | Your original is untouched | `docs/FEATURES-V1-ORIGINAL.md` — read it |
| **2** | Every line survived the rename | `python3 scripts/verify-nothing-lost.py` → *1,458 lines checked, 0 missing* |
| **3** | Every section has an owning spec | `specs/ROADMAP.md` coverage table → *0 orphans* |
| **4** | Every unbuilt idea has a home | `docs/IDEA-LEDGER.md` → *62 ideas, 0 unassigned* |
| **5** | Specs, plans and tasks agree | `/speckit-analyze` → *100% requirement coverage* |

**Check 4 is the one that matters most to you.** The riskiest items aren't the built ones —
they're the **62 things you planned and never built**. There's no code to remind anyone
those existed. Just a line in a document. So they're pulled out into their own list, each
assigned to the spec now responsible for it. Ask-your-docs, the meeting-room whiteboard,
Clawy the office pet, holiday decorations, the Scout agent — all of them have an owner.

**The rule:** an idea may be moved to later, with the reason written down. It may not
quietly disappear.

### These checks have already caught me three times

Worth saying plainly, because it's the whole argument for working this way:

1. An edit of mine **silently deleted half a line** in the Cost section. Check 2 caught it.
2. My own idea ledger **filed three sections under the wrong feature**. Caught when a plan went looking for its items.
3. I wrote the rule "the Done Contract comes before the code" into the constitution — then **broke it in all four task lists.** Check 5 caught it.

None of those came from me being careful. They came from a checker. That's the point.

---

## 5. Where we are right now

```
  ✅ Step 1  Constitution          8 rules, 5 non-negotiable
  ✅ Step 2  Specify               20 specs, covering every part of your list
  ✅ Step 3  Clarify               the brain question — settled, flat rate
  ✅ Step 4  Plan                  4 of 20 done (the foundation)
  ✅ Step 5  Tasks                 4 of 20 done — 244 tasks
  ⬜ Step 6  Implement             not started. No code exists yet.
```

**The 20 specs are not the same thing as your feature list.** Your list is the *source
material* — the thing we check against. The specs are what actually gets built from. That
separation is why nothing can quietly go missing: the list stays whole and unedited, and
the specs have to answer to it.

---

## 6. What happens next

**The first thing built is a throwaway test on your PC.** Not a feature — a two-hour
experiment that answers four questions about running agents on your ChatGPT plan.

It's first because everything else sits on top of it. Finding out it doesn't work *after*
building four features on top is exactly how the last version ended up with 421 problems.

If it fails, nothing is lost: Claude Max is the backup, and it's already running on your PC
for the Dev Room. The office gets built either way — only the brain changes.

**After that:** one department, one agent, one real conversation, working end to end.
Then we stop and you look at it before anything else gets built.
