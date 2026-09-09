#!/usr/bin/env bash
# Pull the v1 3D assets into this repo. Run when the 3D office milestone starts.
# They are NOT committed here yet — see docs/ASSETS-3D.md for why.
set -euo pipefail

SRC_REPO="${SRC_REPO:-https://github.com/yitzchaka123-cmd/Mission-Control}"
SRC_COMMIT="9914449da34dad56807f2ab48fff1ee78d2de808"
DEST="${DEST:-$(cd "$(dirname "$0")/.." && pwd)/public}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "→ cloning $SRC_REPO (shallow)…"
git clone --depth 1 "$SRC_REPO" "$TMP/src"

HEAD_SHA="$(git -C "$TMP/src" rev-parse HEAD)"
if [ "$HEAD_SHA" != "$SRC_COMMIT" ]; then
  echo "⚠  source repo has moved: expected $SRC_COMMIT, got $HEAD_SHA"
  echo "   assets may differ from assets-3d/MANIFEST.json — verify before trusting."
fi

mkdir -p "$DEST"
cp -r "$TMP/src/my-mission-control/public/models"             "$DEST/"
cp    "$TMP/src/my-mission-control/public/office-layout.json" "$DEST/"

echo "→ verifying against assets-3d/MANIFEST.json…"
python3 "$(dirname "$0")/verify-3d-assets.py" "$DEST"
echo "✅ 3D assets in place at $DEST"
