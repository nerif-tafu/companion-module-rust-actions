module.exports = function (self) {
	self.setActionDefinitions({
		// [CHAT] Actions
		'[chat]_send': {
			name: '[CHAT] Send Message',
			options: [
				{
					id: 'message',
					type: 'textinput',
					label: 'Message',
					default: '',
					required: true,
				},
				{
					id: 'chat_type',
					type: 'dropdown',
					label: 'Chat Type',
					default: 'global',
					choices: [
						{ id: 'global', label: 'Global Chat' },
						{ id: 'team', label: 'Team Chat' },
					],
				},
			],
			callback: async (event) => {
				try {
					const endpoint = event.options.chat_type === 'team' ? '/chat/team' : '/chat/global'
					const response = await self.apiRequest('POST', endpoint, {
						message: event.options.message,
					})
					self.log('info', `Sent ${event.options.chat_type} message: ${event.options.message}`)
				} catch (error) {
					self.log('error', `Failed to send ${event.options.chat_type} message: ${error.message}`)
				}
			},
		},

		'[chat]_auto_message': {
			name: '[CHAT] Auto Message',
			options: [
				{
					id: 'instance_id',
					type: 'textinput',
					label: 'Instance ID (must match feedback ID)',
					default: '1',
					required: true,
				},
				{
					id: 'message',
					type: 'textinput',
					label: 'Message to Send',
					default: 'Hello from Companion!',
					required: true,
				},
				{
					id: 'interval',
					type: 'number',
					label: 'Interval (seconds)',
					default: 60,
					min: 10,
					max: 3600,
					required: true,
				},
				{
					id: 'chat_type',
					type: 'dropdown',
					label: 'Chat Type',
					default: 'global',
					choices: [
						{ id: 'global', label: 'Global Chat' },
						{ id: 'team', label: 'Team Chat' },
					],
				},
			],
			callback: async (event) => {
				try {
					// Use the instance ID for tracking
					const instanceId = event.options.instance_id
					const currentInstance = self.autoMessageInstances.get(instanceId)
					
					self.log('debug', `Auto message toggle - Instance ID: ${instanceId}`)
					self.log('debug', `Auto message toggle - Current instance active: ${currentInstance ? currentInstance.active : 'undefined'}`)
					
					if (currentInstance && currentInstance.active) {
						// Stop this specific auto message instance
						if (currentInstance.intervalId) {
							clearInterval(currentInstance.intervalId)
						}
						self.autoMessageInstances.set(instanceId, { ...currentInstance, active: false, intervalId: null })
						self.updateStatusVariables()
						self.log('info', `Auto messaging stopped: "${event.options.message}"`)
					} else {
						// Start auto messaging for this instance
						const message = event.options.message
						const intervalMs = event.options.interval * 1000 // Convert to milliseconds
						const chatType = event.options.chat_type
						
						// Send first message immediately
						await self.sendChatMessage(message, chatType)
						
						// Set up interval for this instance
						const intervalId = setInterval(async () => {
							try {
								await self.sendChatMessage(message, chatType)
							} catch (error) {
								self.log('error', `Failed to send auto message: ${error.message}`)
							}
						}, intervalMs)
						
						// Store this instance
						self.autoMessageInstances.set(instanceId, {
							message: message,
							interval: intervalMs,
							chatType: chatType,
							active: true,
							intervalId: intervalId
						})
						
						self.updateStatusVariables()
						self.log('info', `Auto messaging started: "${message}" every ${event.options.interval} seconds to ${chatType} chat`)
					}
				} catch (error) {
					self.log('error', `Failed to toggle auto messaging: ${error.message}`)
				}
			},
		},

		'[chat]_type_enter': {
			name: '[CHAT] Type and Enter',
			options: [
				{
					id: 'text',
					type: 'textinput',
					label: 'Text to Type',
					default: '',
					required: true,
				},
			],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/input/type-enter', {
						text: event.options.text,
					})
					self.log('info', `Typed and entered: ${event.options.text}`)
				} catch (error) {
					self.log('error', `Failed to type and enter: ${error.message}`)
				}
			},
		},

		'[chat]_delayed_message': {
			name: '[CHAT] Delayed Message',
			options: [
				{
					id: 'message',
					type: 'textinput',
					label: 'Message to Send',
					default: 'Delayed message sent!',
					required: true,
				},
				{
					id: 'delay_seconds',
					type: 'number',
					label: 'Delay (seconds)',
					default: 60,
					min: 1,
					max: 86400,
					required: true,
				},
				{
					id: 'chat_type',
					type: 'dropdown',
					label: 'Chat Type',
					default: 'global',
					choices: [
						{ id: 'global', label: 'Global Chat' },
						{ id: 'team', label: 'Team Chat' },
					],
				},
				{
					id: 'instance_id',
					type: 'textinput',
					label: 'Instance ID (for cancellation)',
					default: '1',
					required: true,
				},
			],
			callback: async (event) => {
				try {
					const message = event.options.message
					const delaySeconds = event.options.delay_seconds
					const chatType = event.options.chat_type
					const instanceId = event.options.instance_id
					
					// Check if there's already a delayed message running for this instance
					if (!self.delayedMessages) {
						self.delayedMessages = new Map()
					}
					
					const existingInstance = self.delayedMessages.get(instanceId)
					if (existingInstance) {
						// Cancel existing delayed message
						clearTimeout(existingInstance.timeoutId)
						clearInterval(existingInstance.countdownIntervalId)
						self.delayedMessages.delete(instanceId)
						
						// Clean up the state
						if (self.delayedMessageStates) {
							self.delayedMessageStates.delete(instanceId)
						}
						
						self.updateStatusVariables()
						self.checkFeedbacks('delayed_message_status') // Specifically check delayed message feedbacks
						self.log('info', `Cancelled delayed message: "${existingInstance.message}"`)
						return
					}
					
					const startTime = Date.now()
					const endTime = startTime + (delaySeconds * 1000)
					
					self.log('info', `Scheduled message: "${message}" in ${delaySeconds} seconds to ${chatType} chat`)
					
					// Set up countdown updates for button display
					const countdownIntervalId = setInterval(() => {
						try {
							const now = Date.now()
							const remainingSeconds = Math.max(0, Math.ceil((endTime - now) / 1000))
							
							// Update the delayed message state for button feedback
							if (!self.delayedMessageStates) {
								self.delayedMessageStates = new Map()
							}
							self.delayedMessageStates.set(instanceId, {
								remainingSeconds: remainingSeconds,
								message: message,
								active: remainingSeconds > 0
							})
							
							self.log('debug', `Delayed message action - Updated state for ${instanceId}: ${JSON.stringify(self.delayedMessageStates.get(instanceId))}`)
							
							self.updateStatusVariables()
							self.checkFeedbacks('delayed_message_status') // Specifically check delayed message feedbacks
							
							if (remainingSeconds <= 0) {
								clearInterval(countdownIntervalId)
							}
						} catch (error) {
							self.log('error', `Failed to update countdown: ${error.message}`)
						}
					}, 1000) // Update every second
					
					// Set up the final delayed message
					const delayedMessageId = setTimeout(async () => {
						try {
							// Clear the countdown interval
							clearInterval(countdownIntervalId)
							
							// Send the final message
							await self.sendChatMessage(message, chatType)
							self.log('info', `Delayed message sent: "${message}" to ${chatType} chat`)
							
							// Clean up the state
							if (self.delayedMessageStates) {
								self.delayedMessageStates.delete(instanceId)
							}
							self.delayedMessages.delete(instanceId)
							self.updateStatusVariables()
							self.checkFeedbacks('delayed_message_status') // Specifically check delayed message feedbacks
						} catch (error) {
							self.log('error', `Failed to send delayed message: ${error.message}`)
						}
					}, delaySeconds * 1000)
					
					// Store the instance for potential cancellation
					self.delayedMessages.set(instanceId, {
						timeoutId: delayedMessageId,
						countdownIntervalId: countdownIntervalId,
						message: message,
						endTime: endTime,
						chatType: chatType
					})
					
					// Initialize the state
					if (!self.delayedMessageStates) {
						self.delayedMessageStates = new Map()
					}
					self.delayedMessageStates.set(instanceId, {
						remainingSeconds: delaySeconds,
						message: message,
						active: true
					})
					
					self.updateStatusVariables()
					self.checkFeedbacks('delayed_message_status') // Specifically check delayed message feedbacks
					
				} catch (error) {
					self.log('error', `Failed to schedule delayed message: ${error.message}`)
				}
			},
		},

		// [UTILS] Actions
		'[utils]_copy_json': {
			name: '[UTILS] Copy JSON',
			options: [
				{
					id: 'json_data',
					type: 'textinput',
					label: 'JSON Data',
					default: '{"key": "value"}',
					required: true,
				},
			],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/clipboard/copy-json', {
						json_data: JSON.parse(event.options.json_data),
					})
					self.log('info', 'JSON copied to clipboard')
				} catch (error) {
					self.log('error', `Failed to copy JSON to clipboard: ${error.message}`)
				}
			},
		},

		// [PLAYER] Actions
		'[player]_toggle_afk': {
			name: '[PLAYER] Toggle AFK',
			options: [
				{
					id: 'enable',
					type: 'dropdown',
					label: 'Enable/Disable',
					default: 'toggle',
					choices: [
						{ id: 'toggle', label: 'Toggle (Current State)' },
						{ id: 'true', label: 'Enable' },
						{ id: 'false', label: 'Disable' },
					],
				},
			],
			callback: async (event) => {
				try {
					let newState
					if (event.options.enable === 'toggle') {
						newState = !self.antiAfkStatus
					} else {
						newState = event.options.enable === 'true'
					}
					
					if (newState) {
						const response = await self.apiRequest('POST', '/anti-afk/start')
						self.log('info', 'Anti-AFK started')
					} else {
						const response = await self.apiRequest('POST', '/anti-afk/stop')
						self.log('info', 'Anti-AFK stopped')
					}
					self.antiAfkStatus = newState
					self.updateStatusVariables()
				} catch (error) {
					self.log('error', `Failed to toggle anti-AFK: ${error.message}`)
				}
			},
		},

		'[player]_suicide': {
			name: '[PLAYER] Suicide',
			options: [],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/player/suicide')
					self.log('info', 'Player suicide executed')
				} catch (error) {
					self.log('error', `Failed to execute suicide: ${error.message}`)
				}
			},
		},

		'[player]_kill': {
			name: '[PLAYER] Kill',
			options: [],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/player/kill')
					self.log('info', 'Player kill executed')
				} catch (error) {
					self.log('error', `Failed to execute kill: ${error.message}`)
				}
			},
		},

		'[player]_respawn': {
			name: '[PLAYER] Respawn',
			options: [
				{
					id: 'spawn_id',
					type: 'textinput',
					label: 'Spawn ID (optional)',
					default: '',
					required: false,
				},
			],
			callback: async (event) => {
				try {
					const data = event.options.spawn_id ? { spawn_id: event.options.spawn_id } : {}
					const response = await self.apiRequest('POST', '/player/respawn', data)
					self.log('info', 'Player respawned')
				} catch (error) {
					self.log('error', `Failed to respawn: ${error.message}`)
				}
			},
		},

		'[player]_respawn_random': {
			name: '[PLAYER] Respawn Random',
			options: [],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/player/respawn-random')
					self.log('info', 'Player respawned at random location')
				} catch (error) {
					self.log('error', `Failed to respawn random: ${error.message}`)
				}
			},
		},

		'[player]_respawn_bed': {
			name: '[PLAYER] Respawn at Bed',
			options: [
				{
					id: 'spawn_id',
					type: 'textinput',
					label: 'Bed Spawn ID',
					default: '12345',
					required: true,
				},
			],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/player/respawn-bed', {
						spawn_id: event.options.spawn_id,
					})
					self.log('info', `Player respawned at bed with spawn ID: ${event.options.spawn_id}`)
				} catch (error) {
					self.log('error', `Failed to respawn at bed: ${error.message}`)
				}
			},
		},

		'[player]_auto_run': {
			name: '[PLAYER] Auto Run',
			options: [],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/player/auto-run')
					self.log('info', 'Auto run enabled')
				} catch (error) {
					self.log('error', `Failed to enable auto run: ${error.message}`)
				}
			},
		},

		'[player]_auto_run_jump': {
			name: '[PLAYER] Auto Run and Jump',
			options: [],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/player/auto-run-jump')
					self.log('info', 'Auto run and jump enabled')
				} catch (error) {
					self.log('error', `Failed to enable auto run and jump: ${error.message}`)
				}
			},
		},

		'[player]_auto_crouch_attack': {
			name: '[PLAYER] Auto Crouch and Attack',
			options: [],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/player/auto-crouch-attack')
					self.log('info', 'Auto crouch and attack enabled')
				} catch (error) {
					self.log('error', `Failed to enable auto crouch and attack: ${error.message}`)
				}
			},
		},

		'[player]_gesture': {
			name: '[PLAYER] Gesture',
			options: [
				{
					id: 'gesture_name',
					type: 'dropdown',
					label: 'Gesture',
					default: 'wave',
					choices: [
						{ id: 'wave', label: 'Wave' },
						{ id: 'victory', label: 'Victory' },
						{ id: 'shrug', label: 'Shrug' },
						{ id: 'thumbsup', label: 'Thumbs Up' },
						{ id: 'hurry', label: 'Hurry' },
						{ id: 'ok', label: 'OK' },
						{ id: 'thumbsdown', label: 'Thumbs Down' },
						{ id: 'clap', label: 'Clap' },
						{ id: 'point', label: 'Point' },
						{ id: 'friendly', label: 'Friendly' },
						{ id: 'cabbagepatch', label: 'Cabbage Patch' },
						{ id: 'twist', label: 'Twist' },
						{ id: 'raisetheroof', label: 'Raise the Roof' },
						{ id: 'beatchest', label: 'Beat Chest' },
						{ id: 'throatcut', label: 'Throat Cut' },
						{ id: 'fingergun', label: 'Finger Gun' },
						{ id: 'shush', label: 'Shush' },
						{ id: 'shush_vocal', label: 'Shush Vocal' },
						{ id: 'watchingyou', label: 'Watching You' },
						{ id: 'loser', label: 'Loser' },
						{ id: 'nono', label: 'No No' },
						{ id: 'knucklescrack', label: 'Knuckle Crack' },
						{ id: 'rps', label: 'Rock Paper Scissors' },
					],
				},
			],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/player/gesture', {
						gesture_name: event.options.gesture_name,
					})
					self.log('info', `Performed gesture: ${event.options.gesture_name}`)
				} catch (error) {
					self.log('error', `Failed to perform gesture: ${error.message}`)
				}
			},
		},

		'[player]_god_mode': {
			name: '[PLAYER] God Mode',
			options: [
				{
					id: 'enable',
					type: 'dropdown',
					label: 'Enable/Disable',
					default: 'toggle',
					choices: [
						{ id: 'toggle', label: 'Toggle (Current State)' },
						{ id: 'true', label: 'Enable' },
						{ id: 'false', label: 'Disable' },
					],
				},
			],
			callback: async (event) => {
				try {
					let newState
					if (event.options.enable === 'toggle') {
						newState = !self.godModeStatus
					} else {
						newState = event.options.enable === 'true'
					}
					
					const response = await self.apiRequest('POST', '/player/god-mode', {
						enable: newState,
					})
					self.godModeStatus = newState
					self.updateStatusVariables()
					self.log('info', `God mode ${newState ? 'enabled' : 'disabled'}`)
				} catch (error) {
					self.log('error', `Failed to toggle god mode: ${error.message}`)
				}
			},
		},

		'[player]_combat_log': {
			name: '[PLAYER] Combat Log Toggle',
			options: [],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/player/combat-log')
					self.log('info', 'Combat log toggled')
				} catch (error) {
					self.log('error', `Failed to toggle combat log: ${error.message}`)
				}
			},
		},

		'[player]_clear_console': {
			name: '[PLAYER] Clear Console',
			options: [],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/player/clear-console')
					self.log('info', 'Console cleared')
				} catch (error) {
					self.log('error', `Failed to clear console: ${error.message}`)
				}
			},
		},

		'[player]_toggle_console': {
			name: '[PLAYER] Toggle Console',
			options: [],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/player/toggle-console')
					self.log('info', 'Console toggled')
				} catch (error) {
					self.log('error', `Failed to toggle console: ${error.message}`)
				}
			},
		},

		// [ADMIN] Actions
		'[admin]_noclip': {
			name: '[ADMIN] Noclip Toggle',
			options: [
				{
					id: 'enable',
					type: 'dropdown',
					label: 'Noclip State',
					default: 'toggle',
					choices: [
						{ id: 'toggle', label: 'Toggle' },
						{ id: 'true', label: 'Enable' },
						{ id: 'false', label: 'Disable' },
					],
				},
			],
			callback: async (event) => {
				try {
					let enable = event.options.enable
					if (enable === 'toggle') {
						// Toggle the current state
						enable = !self.noclipStatus
					}
					
					const response = await self.apiRequest('POST', '/player/noclip', {
						enable: enable === 'true' || enable === true
					})
					
					// Update the status based on the response
					self.noclipStatus = enable === 'true' || enable === true
					self.updateStatusVariables()
					
					self.log('info', `Noclip ${self.noclipStatus ? 'enabled' : 'disabled'}`)
				} catch (error) {
					self.log('error', `Failed to toggle noclip: ${error.message}`)
				}
			},
		},

		'[admin]_set_time': {
			name: '[ADMIN] Set Time',
			options: [
				{
					id: 'time_hour',
					type: 'dropdown',
					label: 'Time of Day',
					default: '12',
					choices: [
						{ id: '0', label: 'Midnight (0)' },
						{ id: '4', label: 'Early Morning (4)' },
						{ id: '8', label: 'Morning (8)' },
						{ id: '12', label: 'Noon (12)' },
						{ id: '16', label: 'Afternoon (16)' },
						{ id: '20', label: 'Evening (20)' },
					],
				},
			],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/player/set-time', {
						time_hour: parseInt(event.options.time_hour),
					})
					self.log('info', `Set time to ${event.options.time_hour}`)
				} catch (error) {
					self.log('error', `Failed to set time: ${error.message}`)
				}
			},
		},

		'[admin]_teleport_marker': {
			name: '[ADMIN] Teleport to Marker',
			options: [],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/player/teleport-marker')
					self.log('info', 'Teleported to marker')
				} catch (error) {
					self.log('error', `Failed to teleport to marker: ${error.message}`)
				}
			},
		},

		// [CRAFT] Actions
		'[craft]_item': {
			name: '[CRAFT] Item',
			options: [
				{
					id: 'item_id',
					type: 'dropdown',
					label: 'Item',
					default: '',
					required: true,
					choices: require('./craftable-items.js'),
				},
				{
					id: 'quantity',
					type: 'textinput',
					label: 'Quantity (supports variables)',
					default: '1',
					required: true,
					useVariables: true,
				},
			],
			callback: async (event) => {
				try {
					// Resolve variables first
					const resolvedQuantity = await self.parseVariablesInString(event.options.quantity)
					self.log('debug', `Resolved quantity: ${resolvedQuantity}`)

					const quantity = parseInt(resolvedQuantity, 10)
					if (isNaN(quantity) || quantity < 1) {
						self.log('error', `Invalid quantity: ${resolvedQuantity}. Must be a positive number.`)
						return
					}

					const response = await self.apiRequest('POST', '/craft/id', {
						item_id: event.options.item_id,
						quantity: quantity,
					})
					self.log('info', `Crafted ${quantity}x ${event.options.item_id}`)
				} catch (error) {
					self.log('error', `Failed to craft item: ${error.message}`)
				}
			},
		},

		'[craft]_cancel_item': {
			name: '[CRAFT] Cancel Item',
			options: [
				{
					id: 'item_id',
					type: 'dropdown',
					label: 'Item',
					default: '',
					required: true,
					choices: require('./craftable-items.js'),
				},
				{
					id: 'quantity',
					type: 'textinput',
					label: 'Quantity (supports variables)',
					default: '1',
					required: true,
					useVariables: true,
				},
			],
			callback: async (event) => {
				try {
					// Resolve variables first
					const resolvedQuantity = await self.parseVariablesInString(event.options.quantity)
					self.log('debug', `Resolved quantity: ${resolvedQuantity}`)

					const quantity = parseInt(resolvedQuantity, 10)
					if (isNaN(quantity) || quantity < 1) {
						self.log('error', `Invalid quantity: ${resolvedQuantity}. Must be a positive number.`)
						return
					}

					const response = await self.apiRequest('POST', '/craft/cancel/id', {
						item_id: event.options.item_id,
						quantity: quantity,
					})
					self.log('info', `Cancelled craft for ${quantity}x ${event.options.item_id}`)
				} catch (error) {
					self.log('error', `Failed to cancel craft: ${error.message}`)
				}
			},
		},

		'[craft]_cancel_all': {
			name: '[CRAFT] Cancel All',
			options: [],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/craft/cancel-all', {
						iterations: 80,
					})
					self.log('info', 'Cancelled all crafts')
				} catch (error) {
					self.log('error', `Failed to cancel all crafts: ${error.message}`)
				}
			},
		},

		// [GAME] Actions
		'[game]_quit': {
			name: '[GAME] Quit',
			options: [],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/game/quit')
					self.log('info', 'Game quit')
				} catch (error) {
					self.log('error', `Failed to quit game: ${error.message}`)
				}
			},
		},

		'[game]_disconnect': {
			name: '[GAME] Disconnect',
			options: [],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/game/disconnect')
					self.log('info', 'Game disconnected')
				} catch (error) {
					self.log('error', `Failed to disconnect: ${error.message}`)
				}
			},
		},

		'[game]_connect': {
			name: '[GAME] Connect',
			options: [
				{
					id: 'server_ip',
					type: 'textinput',
					label: 'Server IP',
					default: '',
					required: true,
				},
			],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/game/connect', {
						server_ip: event.options.server_ip,
					})
					self.log('info', `Connected to server: ${event.options.server_ip}`)
				} catch (error) {
					self.log('error', `Failed to connect to server: ${error.message}`)
				}
			},
		},

		// [INVENTORY] Actions
		'[inventory]_stack': {
			name: '[INVENTORY] Stack',
			options: [
				{
					id: 'iterations',
					type: 'number',
					label: 'Iterations',
					default: 80,
					min: 1,
					max: 1000,
				},
			],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/inventory/stack', {
						iterations: event.options.iterations,
					})
					self.log('info', `Inventory stacked with ${event.options.iterations} iterations`)
				} catch (error) {
					self.log('error', `Failed to stack inventory: ${error.message}`)
				}
			},
		},

		'[inventory]_toggle_stack': {
			name: '[INVENTORY] Toggle Stack',
			options: [
				{
					id: 'enable',
					type: 'dropdown',
					label: 'Enable/Disable',
					default: 'toggle',
					choices: [
						{ id: 'toggle', label: 'Toggle (Current State)' },
						{ id: 'true', label: 'Enable' },
						{ id: 'false', label: 'Disable' },
					],
				},
			],
			callback: async (event) => {
				try {
					let newState
					if (event.options.enable === 'toggle') {
						newState = !self.stackStatus
					} else {
						newState = event.options.enable === 'true'
					}
					
					const response = await self.apiRequest('POST', '/inventory/toggle-stack', {
						enable: newState,
					})
					self.stackStatus = newState
					self.updateStatusVariables()
					self.log('info', `Continuous stack ${newState ? 'enabled' : 'disabled'}`)
				} catch (error) {
					self.log('error', `Failed to toggle stack: ${error.message}`)
				}
			},
		},

		// [SETTINGS] Actions
		'[settings]_look_radius': {
			name: '[SETTINGS] Look Radius',
			options: [
				{
					id: 'radius',
					type: 'dropdown',
					label: 'Look Radius',
					default: '20.0',
					choices: [
						{ id: '20.0', label: 'Normal (20.0)' },
						{ id: '0.0002', label: 'Precise (0.0002)' },
					],
				},
			],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/settings/look-radius', {
						radius: parseFloat(event.options.radius),
					})
					self.log('info', `Set look radius to ${event.options.radius}`)
				} catch (error) {
					self.log('error', `Failed to set look radius: ${error.message}`)
				}
			},
		},

		'[settings]_voice_volume': {
			name: '[SETTINGS] Voice Volume',
			options: [
				{
					id: 'volume',
					type: 'dropdown',
					label: 'Voice Volume',
					default: '0.5',
					choices: [
						{ id: '0.0', label: 'Muted (0.0)' },
						{ id: '0.25', label: 'Low (0.25)' },
						{ id: '0.5', label: 'Medium (0.5)' },
						{ id: '0.75', label: 'High (0.75)' },
						{ id: '1.0', label: 'Full (1.0)' },
					],
				},
			],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/settings/voice-volume', {
						volume: parseFloat(event.options.volume),
					})
					self.log('info', `Set voice volume to ${event.options.volume}`)
				} catch (error) {
					self.log('error', `Failed to set voice volume: ${error.message}`)
				}
			},
		},

		'[settings]_master_volume': {
			name: '[SETTINGS] Master Volume',
			options: [
				{
					id: 'volume',
					type: 'dropdown',
					label: 'Master Volume',
					default: '0.5',
					choices: [
						{ id: '0.0', label: 'Muted (0.0)' },
						{ id: '0.25', label: 'Low (0.25)' },
						{ id: '0.5', label: 'Medium (0.5)' },
						{ id: '0.75', label: 'High (0.75)' },
						{ id: '1.0', label: 'Full (1.0)' },
					],
				},
			],
			callback: async (event) => {
				try {
					const response = await self.apiRequest('POST', '/settings/master-volume', {
						volume: parseFloat(event.options.volume),
					})
					self.log('info', `Set master volume to ${event.options.volume}`)
				} catch (error) {
					self.log('error', `Failed to set master volume: ${error.message}`)
				}
			},
		},

		'[settings]_hud': {
			name: '[SETTINGS] HUD',
			options: [
				{
					id: 'enabled',
					type: 'dropdown',
					label: 'Enable/Disable',
					default: 'toggle',
					choices: [
						{ id: 'toggle', label: 'Toggle (Current State)' },
						{ id: 'true', label: 'Enable' },
						{ id: 'false', label: 'Disable' },
					],
				},
			],
			callback: async (event) => {
				try {
					let newState
					if (event.options.enabled === 'toggle') {
						newState = !self.hudStatus
					} else {
						newState = event.options.enabled === 'true'
					}
					
					const response = await self.apiRequest('POST', '/settings/hud', {
						enabled: newState,
					})
					self.hudStatus = newState
					self.updateStatusVariables()
					self.log('info', `HUD ${newState ? 'enabled' : 'disabled'}`)
				} catch (error) {
					self.log('error', `Failed to toggle HUD: ${error.message}`)
				}
			},
		},
	})
}
