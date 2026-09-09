#!/usr/bin/env python3
"""Verify fetched 3D assets against assets-3d/MANIFEST.json."""
import hashlib, json, os, sys

dest = sys.argv[1] if len(sys.argv) > 1 else "public"
here = os.path.dirname(os.path.abspath(__file__))
man = json.load(open(os.path.join(here, "..", "assets-3d", "MANIFEST.json")))

missing, bad = [], []
for f in man["files"]:
    p = os.path.join(dest, f["path"])
    if not os.path.exists(p):
        missing.append(f["path"]); continue
    h = hashlib.sha256(open(p, "rb").read()).hexdigest()[:16]
    if h != f["sha256_16"] or os.path.getsize(p) != f["bytes"]:
        bad.append(f["path"])

ok = len(man["files"]) - len(missing) - len(bad)
print(f"  {ok}/{len(man['files'])} files verified")
for label, items in (("MISSING", missing), ("CHANGED", bad)):
    for p in items[:20]:
        print(f"  {label}: {p}")
    if len(items) > 20:
        print(f"  …and {len(items) - 20} more {label}")
sys.exit(1 if (missing or bad) else 0)
