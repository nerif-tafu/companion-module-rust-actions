# Rust Actions Companion Module

Control your Rust game through physical buttons with this Companion module.

## What it does

This module connects to your Rust Actions API and gives you button control over:
- **Crafting** - Build items from a dropdown of 1000+ items
- **Player controls** - Suicide, respawn, god mode, noclip, gestures
- **Chat** - Send messages, auto-message, delayed messages
- **Game controls** - Quit, connect/disconnect, time control
- **Inventory** - Stack items, toggle stacking
- **Settings** - Volume, HUD, look radius

## Quick Start

1. **Install the module** in Companion
2. **Add a connection** and set your API host/port (default: localhost:5000)
3. **Drag presets** to buttons or configure actions manually
4. **Start controlling** your Rust game!

## Building from source

```bash
# Install dependencies
yarn install

# Build the module (fetches items from API)
yarn build-tgz
```

## Creating a Release

```bash
# Build the package
yarn build-tgz

# Create and push a tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

This will trigger the GitHub Actions workflow to create a release with the `.tgz` file.

## Features

- **1,084 craftable items** - Complete dropdown with all Rust items
- **Smart toggles** - Visual feedback for all toggle states
- **Delayed messages** - Send messages with countdown timers
- **Auto messages** - Repeating messages with independent controls
- **50+ presets** - Ready-to-use buttons for common actions
- **Real-time status** - See connection and operation status

## Configuration

- **API Host**: Your Rust Actions API server (default: localhost)
- **API Port**: API port (default: 5000)

## Support

Issues and feature requests: [GitHub repository](https://github.com/nerif-tafu/companion-module-rust-actions)

## License

MIT License
