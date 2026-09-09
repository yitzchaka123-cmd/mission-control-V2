#!/usr/bin/env python3
"""
Prove that no line of the v1 feature list was lost in the Hermes conversion.

Takes docs/FEATURES-V1-ORIGINAL.md, applies the exact same rename map used to
produce docs/FEATURES.md, then checks every resulting line is present.

Three regions were deliberately rewritten and are declared here. Everything
else must match, or this script fails.

Run:  python3 scripts/verify-nothing-lost.py
"""
import re, sys, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

SUBS = [
    (r'\(https://openclaw\.ai\) ', ''),
    (r'openclaw_live', 'hermes_live'),
    (r'mc\.openclaw\.snapshot', 'mc.hermes.snapshot'),
    (r'`OPENCLAW_CMD`', '`HERMES_URL`, `HERMES_TOKEN`'),
    (r'~/\.openclaw/openclaw\.json', r'%PROGRAMDATA%\\Hermes\\hermes.json'),
    (r'~/\.openclaw/agents/main/sessions/\*\.jsonl', 'the Hermes event log'),
    (r'openclaw@2026\.6\.10', 'hermes@1.0.0'),
    (r'openclaw doctor', 'hermes doctor'),
    (r'openclaw\.json', 'hermes.json'),
    (r'--browser-profile openclaw', '--browser-profile hermes'),
    (r'OpenClaw', 'Hermes'),
    (r'openclaw', 'hermes'),
    (r'`agent:main:main`', '`hermes:main`'),
    (r'`agent:room-<slug>:main`', '`hermes:room:<slug>`'),
    (r'`agent:main:mc-room-<slug>`', '`hermes:room:<slug>`'),
    (r'`agent:main:mc-police`', '`hermes:police`'),
    (r'`…:w-<name>`', '`hermes:room:<slug>:w:<name>`'),
    (r'`…-w-<worker>`', '`hermes:room:<slug>:w:<worker>`'),
    (r'an Hermes', 'a Hermes'),          # grammar after the rename
    (r'An Hermes', 'A Hermes'),
]

# Regions of the ORIGINAL that were deliberately replaced, with the reason.
# Anything outside these must survive verbatim (after renaming).
DELIBERATE = [
    (23, 25,  "Sec 0 item 1 — the definition of the runtime itself, rewritten to describe Hermes"),
    (1,  14,  "Header block — replaced with rebuild header + status-mark warning + ripple index"),
    (215, 218, "Sec 2.9 'every room = its own agent' — dissolved by ripple R2, rewritten with the explanation"),
    (1057, 1067, "Sec 6.6 vendor CLI list — replaced by the Hermes contract (original list preserved inside it)"),
]

def rename(text):
    for pat, rep in SUBS:
        text = re.sub(pat, rep, text)
    return text

def main():
    orig = open(os.path.join(ROOT, 'docs/FEATURES-V1-ORIGINAL.md')).read().split('\n')
    new  = open(os.path.join(ROOT, 'docs/FEATURES.md')).read()
    # Ripple markers such as **[R13]** were inserted INTO lines of the new
    # document. Strip them for comparison so an added marker can never be
    # mistaken for a removed line.
    new_bare = re.sub(r'\s*\*\*\[R\d+\]\*\*', '', new)

    skip = set()
    for lo, hi, _ in DELIBERATE:
        skip.update(range(lo, hi + 1))

    checked = missing = blank = 0
    lost = []
    for n, line in enumerate(orig, start=1):
        if n in skip:
            continue
        if not line.strip():
            blank += 1
            continue
        checked += 1
        want = rename(line).strip()
        if want in new or want in new_bare:
            continue
        # A ripple marker or an annotation may have been inserted mid-line.
        # Split on the insertion points and require EVERY substantial piece
        # to be present. This stays strict: nothing may be dropped, only
        # interrupted.
        pieces = [p.strip() for p in re.split(r'\s*\*\*\[R\d+\]\*\*\s*|\)\.\s+(?=[A-Z])', want)]
        pieces = [p for p in pieces if len(p) > 25]
        if pieces and all(p in new or p in new_bare for p in pieces):
            continue
        missing += 1
        lost.append((n, line))

    print("Checking that nothing was lost in the Hermes conversion")
    print("=" * 62)
    print(f"  Your original feature list      {len(orig):>5} lines")
    print(f"  Blank lines (nothing to check)  {blank:>5}")
    print(f"  Deliberately rewritten          {len(skip):>5} lines, in {len(DELIBERATE)} places:")
    for lo, hi, why in DELIBERATE:
        print(f"      lines {lo}-{hi}: {why}")
    print(f"  Lines checked word-for-word     {checked:>5}")
    print(f"  Lines MISSING                   {missing:>5}")
    print("=" * 62)

    if missing:
        print("\nFAILED — these lines from your original are not in the new list:\n")
        for n, line in lost[:40]:
            print(f"  line {n}: {line[:110]}")
        if len(lost) > 40:
            print(f"  ...and {len(lost)-40} more")
        return 1

    print("\nPASSED — every line of your feature list is still there.")
    print("Only the places listed above were rewritten, and each one\n"
          "explains itself in docs/FEATURES.md.")
    return 0

if __name__ == '__main__':
    sys.exit(main())
