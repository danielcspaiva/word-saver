#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCREENSAVER_DIR="$(dirname "$SCRIPT_DIR")"
REPO_ROOT="$(dirname "$(dirname "$SCREENSAVER_DIR")")"
WEB_DIR="$REPO_ROOT/apps/web"
XCODE_DIR="$SCREENSAVER_DIR/WordSaver"
RESOURCES_DIR="$XCODE_DIR/Resources"
INSTALL_DIR="$HOME/Library/Screen Savers"

echo "==> Building web app..."
cd "$WEB_DIR" && bun run build

echo "==> Syncing dist to Resources..."
rm -rf "$RESOURCES_DIR"
mkdir -p "$RESOURCES_DIR"
cp -r "$WEB_DIR/dist/"* "$RESOURCES_DIR/"

echo "==> Patching index.html for file:// compatibility..."
sed -i '' 's/ crossorigin//g' "$RESOURCES_DIR/index.html"

echo "==> Building screensaver..."
cd "$XCODE_DIR"
xcodebuild -project WordSaver.xcodeproj \
  -scheme WordSaver \
  -configuration Release \
  CODE_SIGN_IDENTITY="-" \
  build 2>&1 | tail -5

# Find the built .saver
BUILD_DIR=$(xcodebuild -project WordSaver.xcodeproj \
  -scheme WordSaver \
  -configuration Release \
  -showBuildSettings 2>/dev/null \
  | grep " BUILT_PRODUCTS_DIR" \
  | awk '{print $3}')
SAVER="$BUILD_DIR/WordSaver.saver"

if [ ! -d "$SAVER" ]; then
  echo "ERROR: Build failed — $SAVER not found"
  exit 1
fi

echo "==> Injecting web resources into bundle..."
mkdir -p "$SAVER/Contents/Resources"
cp -r "$RESOURCES_DIR/"* "$SAVER/Contents/Resources/"

echo "==> Installing to ~/Library/Screen Savers/..."
mkdir -p "$INSTALL_DIR"
rm -rf "$INSTALL_DIR/WordSaver.saver"
cp -r "$SAVER" "$INSTALL_DIR/"

echo ""
echo "Done! Open System Settings → Screen Saver → select WordSaver"
