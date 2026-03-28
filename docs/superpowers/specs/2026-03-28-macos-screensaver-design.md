# macOS Screensaver — Design Spec

## Context

Wrap the existing word clock web MVP into a native macOS screensaver (`.saver` bundle). The web app renders in a WKWebView embedded inside a `ScreenSaverView` subclass. This is the fastest path to a real screensaver — the web MVP becomes the rendering engine, and a thin Swift wrapper handles the macOS integration.

## Architecture

```
apps/web/ (existing)          apps/screensaver/ (new)
     │                              │
     │  bun run build               │
     ▼                              │
  dist/                             │
  ├── index.html        ──copy──▶  Resources/index.html
  ├── assets/           ──copy──▶  Resources/assets/
  └── fonts/            ──copy──▶  Resources/fonts/
                                    │
                          QlockSaverView.swift
                          (ScreenSaverView + WKWebView)
                                    │
                              xcodebuild
                                    ▼
                          QlockSaver.saver
                                    │
                              install to
                                    ▼
                    ~/Library/Screen Savers/
```

## Components

### QlockSaverView.swift (~60 lines)

A `ScreenSaverView` subclass that:

- Creates a `WKWebView` sized to fill the frame in `init?(frame:isPreview:)`
- Adds the WebView as a subview with autoresizing mask
- Loads `index.html` from the bundle's Resources in `startAnimation()`
- Uses `Bundle(for: type(of: self))` (not `Bundle.main`) because screensavers load as plugins
- Passes the Resources directory to `allowingReadAccessTo:` so CSS/JS/fonts load
- No `animateOneFrame()` logic needed — the web app handles its own 15s timer
- Handles `isPreview` flag (the small preview in System Settings works automatically since the WebView auto-scales)

### Info.plist

Minimal screensaver bundle metadata:

- `CFBundlePackageType`: `BNDL`
- `NSPrincipalClass`: `QlockSaver.QlockSaverView`
- `CFBundleIdentifier`: `com.danielcspaiva.QlockSaver`
- Target: macOS 12.0+

### Xcode project

Created once, rarely opened:

- Bundle target (not App) with `.saver` extension
- Links `ScreenSaver.framework` and `WebKit.framework`
- "Copy Bundle Resources" build phase includes the Resources directory
- Release build configuration only (no debug needed for screensaver)

### Vite config change

Add `base: "./"` to `apps/web/vite.config.ts` so all asset URLs are relative paths. Required for `file://` loading inside the `.saver` bundle.

### Build script (`scripts/build.sh`)

Single command that:

1. Builds the web app: `cd apps/web && bun run build`
2. Syncs `dist/` → `apps/screensaver/Resources/`
3. Compiles: `xcodebuild -project ... -scheme QlockSaver -configuration Release build`
4. Copies the `.saver` to `~/Library/Screen Savers/`
5. Prints instructions to activate in System Settings

## Decisions

| Decision         | Choice                  | Rationale                                                |
| ---------------- | ----------------------- | -------------------------------------------------------- |
| Min macOS        | 12.0 (Monterey)         | Stable WKWebView + Apple Silicon support                 |
| Bundle loading   | `Bundle(for:)`          | Screensavers are plugins, not standalone apps            |
| HTML load timing | `startAnimation()`      | Avoids sandbox timing issues in `init`                   |
| Asset paths      | Relative (`base: "./"`) | Required for `file://` protocol                          |
| Settings panel   | None for MVP            | YAGNI — add later if needed                              |
| Code signing     | Ad-hoc (`-`)            | For personal use; proper signing needed for distribution |

## Out of Scope

- Settings/configuration panel in System Settings
- Code signing for distribution (notarization, Developer ID)
- Multi-monitor support (works by default — macOS creates one view per screen)
- Hot reload during development

## Verification

1. `./apps/screensaver/scripts/build.sh` completes without errors
2. `QlockSaver.saver` appears in `~/Library/Screen Savers/`
3. Open System Settings → Screen Saver → select "QlockSaver"
4. Preview shows the word clock with correct time
5. Activate screensaver (hot corner or `Cmd+Ctrl+Q` to lock) — clock displays fullscreen
6. Inactive letters barely visible, active letters bright white with glow
7. Let it run for 5+ minutes — transitions work, no freezing or memory issues
