# Companion Module: Rust Actions

A Bitfocus Companion module for controlling Rust game actions via REST API.

## Features

This module provides physical button control for all Rust Actions API endpoints, including:

### Crafting Controls
- Craft items by ID with quantity
- Cancel specific crafts
- Cancel all active crafts

### Player Controls
- Suicide/Kill player
- Respawn (normal, random, bed)
- Auto-run and auto-jump
- Auto crouch and attack
- Gestures/emotes
- Noclip and God mode toggle
- Time of day control
- Teleport to marker
- Combat log toggle
- Console controls

### Chat Controls
- Send global messages
- Send team messages

### Game Controls
- Quit game
- Connect/disconnect from servers

### Inventory Controls
- Stack inventory items
- Toggle continuous stacking

### Settings Controls
- Voice and master volume control
- HUD toggle
- Look radius adjustment

### Input Controls
- Type and enter commands
- Clipboard operations

### Anti-AFK Controls
- Start/stop anti-AFK
- Status monitoring

## Installation

### Prerequisites
- Node.js and Yarn installed
- Internet connection to access the Rust items API

### Building the Module

1. **Install dependencies:**
   ```bash
   yarn install
   ```

	2. **Build named items:**
	   ```bash
	   yarn build
	   ```
	   
	   This will fetch the list of named items from the Rust API and generate a static dropdown list.

3. **Package the module:**
   ```bash
   yarn package
   ```

### Configuration

### Required Configuration
- **API Host**: The IP address of your Rust Actions API server (default: localhost)
- **API Port**: The port number of your Rust Actions API server (default: 5000)

## Actions

The module provides actions for all API endpoints, organized into logical categories:

### Crafting Actions
- `craft_item` - Craft items by ID with quantity
- `cancel_craft` - Cancel specific crafts
- `cancel_all_crafts` - Cancel all active crafts

### Player Actions
- `player_suicide` - Kill player character
- `player_kill` - Kill player character only
- `player_respawn` - Respawn with optional spawn ID
- `player_respawn_random` - Respawn at random location
- `player_respawn_bed` - Respawn at sleeping bag
- `player_auto_run` - Enable auto run
- `player_auto_run_jump` - Enable auto run and jump
- `player_auto_crouch_attack` - Enable auto crouch and attack
- `player_gesture` - Perform gestures/emotes
- `player_noclip` - Toggle noclip
- `player_god_mode` - Toggle god mode
- `player_set_time` - Set time of day
- `player_teleport_marker` - Teleport to marker
- `player_combat_log` - Toggle combat log
- `player_clear_console` - Clear console
- `player_toggle_console` - Toggle console

### Chat Actions
- `chat_global` - Send global chat message
- `chat_team` - Send team chat message

### Game Actions
- `game_quit` - Quit the game
- `game_disconnect` - Disconnect from server
- `game_connect` - Connect to server

### Inventory Actions
- `inventory_stack` - Stack inventory items
- `inventory_toggle_stack` - Toggle continuous stacking

### Settings Actions
- `settings_look_radius` - Set look radius
- `settings_voice_volume` - Set voice volume
- `settings_master_volume` - Set master volume
- `settings_hud` - Toggle HUD

### Input Actions
- `input_type_enter` - Type text and press enter
- `clipboard_copy_json` - Copy JSON to clipboard

### Anti-AFK Actions
- `anti_afk_start` - Start anti-AFK
- `anti_afk_stop` - Stop anti-AFK
- `check_anti_afk_status` - Check anti-AFK status

## Feedbacks

The module provides visual feedback for:

- **Anti-AFK Status** - Green when running, normal when stopped
- **Stack Status** - Orange when enabled, normal when disabled
- **API Connected** - Green when connected, red when disconnected

## Variables

The module provides the following variables:

- `$(rust-actions:anti_afk_status)` - Current anti-AFK status (Running/Stopped)
- `$(rust-actions:stack_status)` - Current stack status (Enabled/Disabled)
- `$(rust-actions:api_connected)` - API connection status (Connected/Disconnected)

## Installation

1. Install the module in your Companion instance
2. Add a new Rust Actions connection
3. Configure the API host and port
4. Start using the actions on your buttons

## Requirements

- Rust Actions API server running and accessible
- Network connectivity between Companion and the API server

## Support

For issues and feature requests, please visit the [GitHub repository](https://github.com/nerif-tafu/companion-module-rust-actions).

## License

This module is licensed under the MIT License.
