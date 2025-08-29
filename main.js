const { InstanceBase, Regex, runEntrypoint } = require('@companion-module/base')
const UpdateActions = require('./actions.js')
const UpdateFeedbacks = require('./feedbacks.js')
const UpdateVariableDefinitions = require('./variables.js')
const UpdatePresets = require('./presets.js')

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Initialize status variables
		this.antiAfkStatus = false
		this.stackStatus = false
		this.apiConnected = false
		this.godModeStatus = false
		this.hudStatus = false
		this.noclipStatus = false
		this.autoMessageStatus = false
		this.autoMessageInterval = null
		this.autoMessageInstances = new Map()
		this.delayedMessages = new Map()
		this.delayedMessageStates = new Map()

	}

	async init(config) {
		this.log('debug', 'Initializing module...')
		this.config = config

		// Set default host/port if not configured
		if (!this.config.host) this.config.host = 'localhost'
		if (!this.config.port) this.config.port = '5000'

		// Set initial status
		this.updateStatus('ok', 'Initializing...')

		// Update all module components first
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updatePresets() // export presets

		// Initialize status variables
		this.updateStatusVariables()

		// Test connection after module is ready (don't block initialization)
		this.testConnection().catch(error => {
			this.log('warn', `API connection test failed during init: ${error.message}`)
		})

		this.log('debug', 'Module initialization completed')
	}

	async destroy() {
		this.log('debug', 'destroy')
		
		// Clear all auto message intervals
		for (const [key, instance] of this.autoMessageInstances) {
			if (instance.intervalId) {
				clearInterval(instance.intervalId)
			}
		}
		this.autoMessageInstances.clear()
		
		// Clear all delayed message timeouts
		for (const [key, instance] of this.delayedMessages) {
			if (instance.timeoutId) {
				clearTimeout(instance.timeoutId)
			}
			if (instance.countdownIntervalId) {
				clearInterval(instance.countdownIntervalId)
			}
		}
		this.delayedMessages.clear()
		this.delayedMessageStates.clear()
	}

	async configUpdated(config) {
		this.log('debug', 'configUpdated')
		this.config = config
		await this.testConnection()
	}

	// Test connection to the API
	async testConnection() {
		try {
			const response = await this.apiRequest('GET', '/anti-afk/status')
			this.apiConnected = true
			this.log('info', 'Connected to Rust Actions API')
			this.updateStatusVariables()
			this.updateStatus('ok', 'Connected to Rust Actions API')
		} catch (error) {
			this.apiConnected = false
			this.log('error', `Failed to connect to Rust Actions API: ${error.message}`)
			this.updateStatusVariables()
			this.updateStatus('error', `Failed to connect: ${error.message}`)
		}
	}

	// Make API requests
	async apiRequest(method, endpoint, data = null) {
		const url = `http://${this.config.host}:${this.config.port}${endpoint}`
		const options = {
			method: method,
			headers: {},
		}

		// Only add Content-Type header if we're sending data
		if (data && (method === 'POST' || method === 'PUT')) {
			options.headers['Content-Type'] = 'application/json'
			options.body = JSON.stringify(data)
		}

		const response = await fetch(url, options)
		
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`)
		}

		const result = await response.json()
		
		// Log response summary for /items endpoint to avoid spam
		if (endpoint === '/items' && result && result.items) {
			this.log('debug', `API ${method} ${endpoint}: Found ${result.items.length} items`)
		} else {
			this.log('debug', `API ${method} ${endpoint}: ${JSON.stringify(result)}`)
		}
		
		return result
		} catch (error) {
			this.log('error', `API request failed ${method} ${endpoint}: ${error.message}`)
			throw error
		}

	// Update status variables
	updateStatusVariables() {
		this.log('debug', 'Updating status variables...')
		
		// Create auto message status object
		const autoMessageStatus = {}
		for (const [key, instance] of this.autoMessageInstances) {
			autoMessageStatus[key] = instance.active
		}
		
		// Create delayed message status object and instance-specific countdown texts
		const delayedMessageStatus = {}
		const variableValues = {
			anti_afk_status: this.antiAfkStatus ? 'Running' : 'Stopped',
			stack_status: this.stackStatus ? 'Enabled' : 'Disabled',
			api_connected: this.apiConnected ? 'Connected' : 'Disconnected',
			god_mode_status: this.godModeStatus ? 'Enabled' : 'Disabled',
			hud_status: this.hudStatus ? 'Enabled' : 'Disabled',
			noclip_status: this.noclipStatus ? 'Enabled' : 'Disabled',
			auto_message_status: this.autoMessageStatus ? 'Running' : 'Stopped',
			auto_message_states: JSON.stringify(autoMessageStatus),
		}
		
		// Initialize all countdown variables to empty
		for (let i = 1; i <= 10; i++) {
			variableValues[`delayed_message_countdown_${i}`] = ''
		}
		
		// Store named items for reference
		try {
			const namedItems = require('./craftable-items.js')
			variableValues.craftable_items = JSON.stringify(namedItems)
		} catch (error) {
			this.log('debug', 'craftable-items.js not found, skipping named items variable')
		}
		
		if (this.delayedMessageStates) {
			for (const [key, instance] of this.delayedMessageStates) {
				delayedMessageStatus[key] = instance
				
				// Create instance-specific countdown text
				if (instance.active && instance.remainingSeconds !== undefined) {
					const totalSeconds = instance.remainingSeconds
					let timeString = ''
					
					if (totalSeconds >= 86400) {
						// More than 24 hours: XXd XXh XXm
						const days = Math.floor(totalSeconds / 86400)
						const hours = Math.floor((totalSeconds % 86400) / 3600)
						const minutes = Math.floor((totalSeconds % 3600) / 60)
						timeString = `${days}d ${hours}h ${minutes}m`
					} else if (totalSeconds >= 3600) {
						// More than an hour: XXh XXm
						const hours = Math.floor(totalSeconds / 3600)
						const minutes = Math.floor((totalSeconds % 3600) / 60)
						timeString = `${hours}h ${minutes}m`
					} else if (totalSeconds >= 60) {
						// Less than an hour: XXm
						const minutes = Math.floor(totalSeconds / 60)
						timeString = `${minutes}m`
					} else {
						// Less than a minute: XXs
						timeString = `${totalSeconds}s`
					}
					
					variableValues[`delayed_message_countdown_${key}`] = timeString
				}
			}
		}
		
		// Set the delayed message states after populating the object
		variableValues.delayed_message_states = JSON.stringify(delayedMessageStatus)
		
		this.setVariableValues(variableValues)
		
		// Refresh feedbacks to update button colors
		this.checkFeedbacks()
		
		this.log('debug', 'Status variables updated successfully')
	}

	// Helper function to send chat messages
	async sendChatMessage(message, chatType) {
		const endpoint = chatType === 'team' ? '/chat/team' : '/chat/global'
		const response = await this.apiRequest('POST', endpoint, {
			message: message,
		})
		this.log('debug', `Sent ${chatType} message: ${message}`)
		return response
	}



	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'API Host',
				width: 8,
				default: 'localhost',
				regex: Regex.HOSTNAME,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'API Port',
				width: 4,
				default: '5000',
				regex: Regex.PORT,
			},
		]
	}

	// Validate configuration
	validateConfig(config) {
		if (!config.host || !config.port) {
			return 'Host and port are required'
		}
		return true
	}

	updateActions() {
		this.log('debug', 'Updating actions...')
		UpdateActions(this)
		this.log('debug', 'Actions updated successfully')
	}

	updateFeedbacks() {
		this.log('debug', 'Updating feedbacks...')
		UpdateFeedbacks(this)
		this.log('debug', 'Feedbacks updated successfully')
	}

	updateVariableDefinitions() {
		this.log('debug', 'Updating variable definitions...')
		UpdateVariableDefinitions(this)
		this.log('debug', 'Variable definitions updated successfully')
	}

	updatePresets() {
		this.log('debug', 'Updating presets...')
		UpdatePresets(this)
		this.log('debug', 'Presets updated successfully')
	}
}

runEntrypoint(ModuleInstance)
