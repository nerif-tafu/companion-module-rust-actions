# Rust Actions Module Help

## Overview

The Rust Actions module allows you to control your Rust game through physical buttons using the Rust Actions REST API.

## Setup

1. **Install Rust Actions API**: Make sure you have the Rust Actions API server running on your system
2. **Configure Connection**: 
   - Set the API Host (default: localhost)
   - Set the API Port (default: 5000)
3. **Test Connection**: The module will automatically test the connection and show status

## Quick Start

1. Add a new Rust Actions connection in Companion
2. Configure the host and port to match your API server
3. Add buttons and assign actions from the Rust Actions category
4. Use feedbacks to show status on your buttons

## Common Actions

### Anti-AFK Control
- Use "Anti-AFK Start" to begin anti-AFK protection
- Use "Anti-AFK Stop" to stop anti-AFK protection
- Add feedback to show current status

### Quick Commands
- Use "Input Type and Enter" to send commands like `/kill`, `/respawn`
- Use "Chat Global" or "Chat Team" for quick messages

### Player Control
- Use "Player Suicide" for quick respawn
- Use "Player Respawn Random" for random spawn location
- Use "Player Auto Run" for automatic movement

### Inventory Management
- Use "Inventory Stack" to stack items once
- Use "Inventory Toggle Stack" to enable continuous stacking

## Troubleshooting

### Connection Issues
- Verify the Rust Actions API server is running
- Check the host and port configuration
- Ensure firewall allows the connection

### Action Not Working
- Check the Companion logs for error messages
- Verify the API endpoint is available
- Test the API directly with curl or similar tool

## API Reference

For detailed API documentation, visit: https://github.com/nerif-tafu/rust-actions

## Support

If you encounter issues:
1. Check the Companion logs
2. Verify your Rust Actions API is working
3. Create an issue on the GitHub repository
