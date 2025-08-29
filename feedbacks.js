const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		anti_afk_status: {
			name: 'Anti-AFK Status',
			type: 'boolean',
			label: 'Anti-AFK Status',
			defaultStyle: {
				bgcolor: combineRgb(0, 255, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: (feedback) => {
				return self.antiAfkStatus
			},
		},

		stack_status: {
			name: 'Stack Status',
			type: 'boolean',
			label: 'Stack Status',
			defaultStyle: {
				bgcolor: combineRgb(0, 255, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: (feedback) => {
				return self.stackStatus
			},
		},

		api_connected: {
			name: 'API Connected',
			type: 'boolean',
			label: 'API Connected',
			defaultStyle: {
				bgcolor: combineRgb(0, 255, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: (feedback) => {
				return self.apiConnected
			},
		},

		api_disconnected: {
			name: 'API Disconnected',
			type: 'boolean',
			label: 'API Disconnected',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: (feedback) => {
				return !self.apiConnected
			},
		},
		god_mode_status: {
			name: 'God Mode Status',
			type: 'boolean',
			label: 'God Mode Status',
			defaultStyle: {
				bgcolor: combineRgb(0, 255, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: (feedback) => {
				return self.godModeStatus
			},
		},
		hud_status: {
			name: 'HUD Status',
			type: 'boolean',
			label: 'HUD Status',
			defaultStyle: {
				bgcolor: combineRgb(0, 255, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: (feedback) => {
				return self.hudStatus
			},
		},

		noclip_status: {
			name: 'Noclip Status',
			type: 'boolean',
			label: 'Noclip Status',
			defaultStyle: {
				bgcolor: combineRgb(0, 255, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: (feedback) => {
				return self.noclipStatus
			},
		},
		auto_message_status: {
			name: 'Auto Message Status',
			type: 'boolean',
			label: 'Auto Message Status',
			defaultStyle: {
				bgcolor: combineRgb(0, 255, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'instance_id',
					type: 'textinput',
					label: 'Instance ID (must match action ID)',
					default: '1',
					required: true,
				},
			],
			callback: (feedback) => {
				try {
					// Get the auto message states from the variable
					const autoMessageStates = self.getVariableValue('auto_message_states')
					
					if (!autoMessageStates) {
						self.log('debug', `Auto message feedback - No auto message states variable found`)
						return false
					}
					
					// Parse the JSON to get the states object
					const states = JSON.parse(autoMessageStates)
					
					// Check if this specific instance is active
					const isActive = states[feedback.options.instance_id] === true
					self.log('debug', `Auto message feedback - Checking instance: ${feedback.options.instance_id}, Active: ${isActive}`)
					return isActive
				} catch (error) {
					self.log('error', `Auto message feedback - Error parsing states: ${error.message}`)
					return false
				}
			},
		},

		delayed_message_status: {
			name: 'Delayed Message Status',
			type: 'boolean',
			label: 'Delayed Message Status',
			defaultStyle: {
				bgcolor: combineRgb(0, 255, 0), // Green when active
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'instance_id',
					type: 'textinput',
					label: 'Instance ID (must match action ID)',
					default: '1',
					required: true,
				},
			],
			callback: (feedback) => {
				try {
					// Get the delayed message states from the variable
					const delayedMessageStates = self.getVariableValue('delayed_message_states')
					
					if (!delayedMessageStates) {
						self.log('debug', `Delayed message feedback - No delayed message states variable found`)
						return false
					}
					
					// Parse the JSON to get the states object
					const states = JSON.parse(delayedMessageStates)
					
					self.log('debug', `Delayed message feedback - All states: ${JSON.stringify(states)}`)
					self.log('debug', `Delayed message feedback - Looking for instance: ${feedback.options.instance_id}`)
					
					// Check if this specific instance is active
					const instance = states[feedback.options.instance_id]
					const isActive = instance && instance.active === true
					
					self.log('debug', `Delayed message feedback - Instance found: ${JSON.stringify(instance)}`)
					self.log('debug', `Delayed message feedback - Checking instance: ${feedback.options.instance_id}, Active: ${isActive}`)
					
					return isActive
				} catch (error) {
					self.log('error', `Delayed message feedback - Error parsing states: ${error.message}`)
					return false
				}
			},
		},
	})
}
