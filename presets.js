const { combineRgb } = require('@companion-module/base')

module.exports = function (self) {
	const presets = {}

	// AFK Controls
	presets[`afk_toggle`] = {
		type: 'button',
		category: 'AFK Controls',
		name: 'AFK Toggle',
		style: {
			text: 'AFK',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: '[player]_toggle_afk',
						options: {
							enable: 'toggle',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'anti_afk_status',
				options: {},
				style: {
					bgcolor: combineRgb(0, 255, 0),
					color: combineRgb(0, 0, 0),
				},
			},
		],
	}

	// Game Controls
	presets[`cancel_all_crafts`] = {
		type: 'button',
		category: 'Game Controls',
		name: 'Cancel All Crafts',
		style: {
			text: '⏹\nCancel\nCrafts',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: '[craft]_cancel_all',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`quit_game`] = {
		type: 'button',
		category: 'Game Controls',
		name: 'Quit Game',
		style: {
			text: '⏼\nQuit\nGame',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: '[game]_quit',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`disconnect_game`] = {
		type: 'button',
		category: 'Game Controls',
		name: 'Disconnect from Game',
		style: {
			text: '⏏️\nDisconnect',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 165, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: '[game]_disconnect',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Inventory Controls
	presets[`toggle_inventory_stack`] = {
		type: 'button',
		category: 'Inventory',
		name: 'Toggle Inventory Stack',
		style: {
			text: '📦\nStack',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: '[inventory]_toggle_stack',
						options: {
							enable: 'toggle',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'stack_status',
				options: {},
				style: {
					bgcolor: combineRgb(0, 255, 0),
					color: combineRgb(0, 0, 0),
				},
			},
		],
	}

	// Player Movement
	presets[`auto_run`] = {
		type: 'button',
		category: 'Player Movement',
		name: 'Auto Run',
		style: {
			text: '⏵\nAuto\nRun',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 204, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: '[player]_auto_run',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`auto_swim`] = {
		type: 'button',
		category: 'Player Movement',
		name: 'Auto Swim',
		style: {
			text: '🏊\nAuto\nSwim',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 51, 204),
		},
		steps: [
			{
				down: [
					{
						actionId: '[player]_auto_run_jump',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`auto_hit`] = {
		type: 'button',
		category: 'Player Movement',
		name: 'Auto Hit',
		style: {
			text: '⚔️\nAuto\nHit',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: '[player]_auto_crouch_attack',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Player Actions
	presets[`player_suicide`] = {
		type: 'button',
		category: 'Player Actions',
		name: 'Player Suicide',
		style: {
			text: '💀\nKill\nPlayer',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: '[player]_suicide',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`player_respawn_random`] = {
		type: 'button',
		category: 'Player Actions',
		name: 'Player Respawn Random',
		style: {
			text: '🔄\nRespawn\nRandom',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 204, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: '[player]_respawn_random',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`toggle_god_mode`] = {
		type: 'button',
		category: 'Player Actions',
		name: 'Toggle God Mode',
		style: {
			text: '👑\nGod\nMode',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: '[player]_god_mode',
						options: {
							enable: 'toggle',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'god_mode_status',
				options: {},
				style: {
					bgcolor: combineRgb(0, 255, 0),
					color: combineRgb(0, 0, 0),
				},
			},
		],
	}

	presets[`teleport_marker`] = {
		type: 'button',
		category: 'Player Actions',
		name: 'Teleport to Marker',
		style: {
			text: '📍\nTeleport\nMarker',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 51, 204),
		},
		steps: [
			{
				down: [
					{
						actionId: '[admin]_teleport_marker',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`noclip_toggle`] = {
		type: 'button',
		category: 'Player Actions',
		name: 'Noclip Toggle',
		style: {
			text: '👻\nNoclip',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: '[admin]_noclip',
						options: {
							enable: 'toggle',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'noclip_status',
				options: {},
				style: {
					bgcolor: combineRgb(0, 255, 0),
					color: combineRgb(0, 0, 0),
				},
			},
		],
	}

	// Utility
	presets[`clear_console`] = {
		type: 'button',
		category: 'Utility',
		name: 'Clear Console',
		style: {
			text: '🗑️\nClear\nConsole',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(128, 128, 128),
		},
		steps: [
			{
				down: [
					{
						actionId: '[player]_clear_console',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`toggle_combat_log`] = {
		type: 'button',
		category: 'Utility',
		name: 'Toggle Combat Log',
		style: {
			text: '📋\nCombat\nLog',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: '[player]_combat_log',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Settings - Time Presets
	const timePresets = [
		{ id: '0', label: '12 AM', icon: '🌙' },
		{ id: '4', label: '4 AM', icon: '🌅' },
		{ id: '8', label: '8 AM', icon: '☀️' },
		{ id: '12', label: '12 PM', icon: '☀️' },
		{ id: '16', label: '4 PM', icon: '☀️' },
		{ id: '20', label: '8 PM', icon: '🌆' },
	]

	timePresets.forEach((time) => {
		presets[`set_time_${time.id}`] = {
			type: 'button',
			category: 'Time Settings',
			name: `Set Time ${time.label}`,
			style: {
				text: `${time.icon}\n${time.label}`,
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 51, 204),
			},
			steps: [
				{
									down: [
					{
						actionId: '[admin]_set_time',
						options: {
							time_hour: time.id,
						},
					},
				],
					up: [],
				},
			],
			feedbacks: [],
		}
	})

	// Settings - Volume Presets
	const volumePresets = [
		{ id: '0.0', label: 'Muted', icon: '🔇' },
		{ id: '0.25', label: 'Low', icon: '🔈' },
		{ id: '0.5', label: 'Medium', icon: '🔉' },
		{ id: '0.75', label: 'High', icon: '🔊' },
		{ id: '1.0', label: 'Full', icon: '🔊' },
	]

	volumePresets.forEach((volume) => {
		presets[`set_master_volume_${volume.id.replace('.', '_')}`] = {
			type: 'button',
			category: 'Volume Settings',
			name: `Master Volume ${volume.label}`,
			style: {
				text: `${volume.icon}\nMaster\n${volume.label}`,
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 51, 204),
			},
			steps: [
				{
					down: [
						{
							actionId: '[settings]_master_volume',
							options: {
								volume: volume.id,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets[`set_voice_volume_${volume.id.replace('.', '_')}`] = {
			type: 'button',
			category: 'Volume Settings',
			name: `Voice Volume ${volume.label}`,
			style: {
				text: `${volume.icon}\nVoice\n${volume.label}`,
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 51, 204),
			},
			steps: [
				{
					down: [
						{
							actionId: '[settings]_voice_volume',
							options: {
								volume: volume.id,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	})

	// Settings - Other
	presets[`toggle_hud`] = {
		type: 'button',
		category: 'Settings',
		name: 'Toggle HUD',
		style: {
			text: '📺\nToggle\nHUD',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: '[settings]_hud',
						options: {
							enabled: 'toggle',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'hud_status',
				options: {},
				style: {
					bgcolor: combineRgb(0, 255, 0),
					color: combineRgb(0, 0, 0),
				},
			},
		],
	}

	presets[`set_look_radius_normal`] = {
		type: 'button',
		category: 'Settings',
		name: 'Set Look Radius Normal',
		style: {
			text: '👁️\nLook\nNormal',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 51, 204),
		},
		steps: [
			{
				down: [
					{
						actionId: '[settings]_look_radius',
						options: {
							radius: '20.0',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets[`set_look_radius_precise`] = {
		type: 'button',
		category: 'Settings',
		name: 'Set Look Radius Precise',
		style: {
			text: '🔍\nLook\nPrecise',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 51, 204),
		},
		steps: [
			{
				down: [
					{
						actionId: 'preset_set_look_radius',
						options: {
							radius: '0.0002',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Auto Message Toggle
	presets[`auto_message_toggle`] = {
		type: 'button',
		category: 'Chat',
		name: 'Auto Message Toggle',
		style: {
			text: '💬\nAuto\nMessage',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: '[chat]_auto_message',
						options: {
							instance_id: '1',
							message: 'Hello from Companion!',
							interval: 60,
							chat_type: 'global',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'auto_message_status',
				options: {
					instance_id: '1',
				},
				style: {
					bgcolor: combineRgb(0, 255, 0),
					color: combineRgb(0, 0, 0),
				},
			},
		],
	}

	// Generate delayed message presets for instances 1-10
	for (let i = 1; i <= 10; i++) {
		const presetKey = i === 1 ? 'delayed_message' : `delayed_message_${i}`
		const presetName = i === 1 ? 'Delayed Message' : `Delayed Message (Instance ${i})`
		
		presets[presetKey] = {
			type: 'button',
			category: 'Chat',
			name: presetName,
			style: {
				text: `DELAYTEXT${i} - $(companion-module-rust-actions:delayed_message_countdown_${i})`,
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(255, 0, 0), // Red (default inactive state)
			},
			steps: [
				{
					down: [
						{
							actionId: '[chat]_delayed_message',
							options: {
								message: 'This is a delayed message!',
								delay_seconds: 60,
								chat_type: 'global',
								instance_id: i.toString(),
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'delayed_message_status',
					options: {
						instance_id: i.toString(),
					},
					style: {
						bgcolor: combineRgb(0, 255, 0), // Green (active state)
						color: combineRgb(0, 0, 0),
					},
				},
			],
		}
	}

	// Admin - Give Items JSON Preset
	presets[`give_items_json`] = {
		type: 'button',
		category: 'Admin',
		name: 'Give Items (JSON)',
		style: {
			text: `🎁\nGive Items\n(JSON)`,
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 165, 0), // Orange
		},
		steps: [
			{
				down: [
					{
						actionId: '[admin]_give_items',
						options: {
							items_json: '[{"item_name": "wood", "quantity": 1000}]',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Admin - Give Item Single Preset
	presets[`give_item_single`] = {
		type: 'button',
		category: 'Admin',
		name: 'Give Item (Single)',
		style: {
			text: `📦\nGive Item\n(Single)`,
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 128, 255), // Blue
		},
		steps: [
			{
				down: [
					{
						actionId: '[admin]_give_item',
						options: {
							item_id: '',
							quantity: '1000',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Admin - Give Items Multi Preset
	presets[`give_items_multi`] = {
		type: 'button',
		category: 'Admin',
		name: 'Give Items (Multi)',
		style: {
			text: `📦📦📦\nGive Items\n(Multi)`,
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 128, 255), // Blue
		},
		steps: [
			{
				down: [
					{
						actionId: '[admin]_give_items_multi',
						options: {
							item_1: '',
							quantity_1: '1000',
							item_2: '',
							quantity_2: '1000',
							item_3: '',
							quantity_3: '1000',
							item_4: '',
							quantity_4: '1000',
							item_5: '',
							quantity_5: '1000',
							item_6: '',
							quantity_6: '1000',
							item_7: '',
							quantity_7: '1000',
							item_8: '',
							quantity_8: '1000',
							item_9: '',
							quantity_9: '1000',
							item_10: '',
							quantity_10: '1000',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Admin - Kill Entity
	presets[`kill_entity`] = {
		type: 'button',
		category: 'Admin',
		name: 'Kill Entity',
		style: {
			text: '💀\nKill Entity',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(255, 0, 0), // Red
		},
		steps: [
			{
				down: [
					{
						actionId: '[admin]_kill_entity',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Emotes
	const emotes = [
		{ id: 'wave', label: 'Wave', icon: '👋' },
		{ id: 'victory', label: 'Victory', icon: '✌️' },
		{ id: 'shrug', label: 'Shrug', icon: '🤷' },
		{ id: 'thumbsup', label: 'Thumbs Up', icon: '👍' },
		{ id: 'hurry', label: 'Hurry', icon: '🏃' },
		{ id: 'ok', label: 'OK', icon: '👌' },
		{ id: 'thumbsdown', label: 'Thumbs Down', icon: '👎' },
		{ id: 'clap', label: 'Clap', icon: '👏' },
		{ id: 'point', label: 'Point', icon: '👆' },
		{ id: 'friendly', label: 'Friendly', icon: '🤝' },
		{ id: 'cabbagepatch', label: 'Cabbage Patch', icon: '💃' },
		{ id: 'twist', label: 'Twist', icon: '🕺' },
		{ id: 'raisetheroof', label: 'Raise the Roof', icon: '🙌' },
		{ id: 'beatchest', label: 'Beat Chest', icon: '💪' },
		{ id: 'throatcut', label: 'Throat Cut', icon: '🔪' },
		{ id: 'fingergun', label: 'Finger Gun', icon: '🔫' },
		{ id: 'shush', label: 'Shush', icon: '🤫' },
		{ id: 'shush_vocal', label: 'Shush Vocal', icon: '🤫' },
		{ id: 'watchingyou', label: 'Watching You', icon: '👀' },
		{ id: 'loser', label: 'Loser', icon: '😞' },
		{ id: 'nono', label: 'No No', icon: '🙅' },
		{ id: 'knucklescrack', label: 'Knuckle Crack', icon: '👊' },
		{ id: 'rps', label: 'Rock Paper Scissors', icon: '✂️' },
	]

	emotes.forEach((emote) => {
		presets[`emote_${emote.id}`] = {
			type: 'button',
			category: 'Emotes',
			name: `Emote ${emote.label}`,
			style: {
				text: `${emote.icon}\n${emote.label}`,
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(255, 0, 255),
			},
			steps: [
				{
									down: [
					{
						actionId: '[player]_gesture',
						options: {
							gesture_name: emote.id,
						},
					},
				],
					up: [],
				},
			],
			feedbacks: [],
		}
	})

	self.setPresetDefinitions(presets)
}
