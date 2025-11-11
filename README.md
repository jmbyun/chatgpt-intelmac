# ChatGPT Desktop App for Intel Mac

> Vive-coded with Codex+GPT5. Of course the readme file is also from the GPT5. Let's see what it says:

For all the stingy devs who can only afford ancient Intel Macs right now — just like myself — here’s your ticket to a snappy ChatGPT desktop app without the hardware FOMO.

This repo bundles a minimal Electron shell around [chatgpt.com](https://chatgpt.com/). It boots straight into the web experience, keeps your session alive between restarts, grants voice mode the permissions it needs, and ships with a proper app icon so it feels native on macOS.

## Features

- ✅ Always opens `chatgpt.com` in a dedicated window with a persistent session storage partition.
- 🎤 Voice mode works: microphone/camera permissions are requested only when ChatGPT asks for them, not on launch.
- 🖼 Custom icon + dock title say “ChatGPT,” not “Electron.”
- 📦 Packaging via `electron-builder`, with ready-made scripts for Apple Silicon and Intel DMG/ZIP artifacts.
- 🛠 Automatically patches Electron’s `Info.plist` so Continuity Camera warnings disappear.

## Requirements

- macOS with a GUI session (tested on Sonoma).
- Node.js 20+ and npm.
- `python3` on your `PATH` (macOS ships one via the Xcode Command Line Tools). The build scripts create a shim so `python` points to `python3`.
- Internet access when running `npm run dist*` so electron-builder can download the appropriate Electron runtime.

## Getting Started

```bash
git clone git@github.com:jmbyun/chatgpt-intelmac.git
cd chatgpt-intelmac
npm install
npm start
```

`npm install` triggers:

1. `npm run patch-info` – updates every `Info.plist` inside Electron’s bundle with the required camera/mic keys.
2. The rest of the usual dependency install process.

## Everyday Commands

| Command | What it does |
| --- | --- |
| `npm start` | Launches the Electron app (GUI required). |
| `npm run build:icon` | Rebuilds `build/icon.icns` from `assets/icon.png` using `png2icons`. |
| `npm run patch-info` | Reapplies the Info.plist camera/mic patch (normally run automatically). |
| `npm run ensure-python` | Creates `scripts/.bin/python`, a shim that points to `python3` for node-gyp. |

## Packaging

All packaging scripts run `build:icon`, `patch-info`, and `ensure-python` automatically before invoking `electron-builder`.

| Command | Target | Output |
| --- | --- | --- |
| `npm run dist` | Apple Silicon (arm64) | `dist/ChatGPT-<version>-arm64.dmg` + `.zip` |
| `npm run dist-intel` | Intel macOS (x86_64) | `dist/ChatGPT-<version>-x64.dmg` + `.zip` |
| `npm run pack` | Unpacked app dir | `dist/mac-[arch]/ChatGPT.app` |

If you plan to distribute the DMG publicly, codesign + notarize the output in the usual macOS way (not covered here).

## Troubleshooting

- **Electron crashes when run headless**: `npm start` must run inside a logged-in macOS GUI session. Headless terminals can’t display the window.
- **Voice mode still fails**: Open DevTools (`⇧⌘I`) and check the console for 403s or LiveKit errors. Most issues are account-side; hardware permissions already auto-approve via the session handler.
- **`python` errors during packaging**: `npm run dist*` calls `npm run ensure-python`. Ensure `python3` exists (`xcode-select --install` if needed).
- **Continuity Camera warnings**: Run `npm run patch-info` to rewrite Electron’s helper `Info.plist` files if you ever clean `node_modules`.

## License

MIT — see `LICENSE` for the full text. Have fun shipping ChatGPT to every Intel Mac holdout (and Apple Silicon friends) you know. 😉
