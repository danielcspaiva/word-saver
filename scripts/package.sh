#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$REPO_ROOT/release"

echo "==> Building screensaver..."
"$REPO_ROOT/apps/screensaver/scripts/build.sh"

INSTALL_DIR="$HOME/Library/Screen Savers"
SAVER="$INSTALL_DIR/WordSaver.saver"

if [ ! -d "$SAVER" ]; then
  echo "ERROR: WordSaver.saver not found at $SAVER"
  exit 1
fi

echo "==> Packaging for distribution..."
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"
cp -r "$SAVER" "$OUTPUT_DIR/"

cd "$OUTPUT_DIR"
zip -r -q WordSaver.saver.zip WordSaver.saver
rm -rf WordSaver.saver

SIZE=$(du -h "$OUTPUT_DIR/WordSaver.saver.zip" | awk '{print $1}')
echo ""
echo "Done! Package ready at: release/WordSaver.saver.zip ($SIZE)"
echo ""
echo "To create a GitHub release:"
echo "  gh release create v1.0.0 release/WordSaver.saver.zip --title 'WordSaver v1.0.0' --notes 'Initial release'"
