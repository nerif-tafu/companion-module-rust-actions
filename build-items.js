#!/usr/bin/env node

const fetch = require('node-fetch')

async function fetchCraftableItems() {
	try {
		console.log('Fetching items from API...')
		
		// Always use the real API endpoint
		const apiUrl = 'https://pipes.tafu.casa/api/items/data'
		
		const response = await fetch(apiUrl)
		
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`)
		}
		
		const data = await response.json()
		
		if (!Array.isArray(data)) {
			throw new Error('API response is not an array of items')
		}
		
		// Filter for items that have a Name property (indicating they're named items)
		console.log('Filtering items for those with Names...')
		
		const itemsWithNames = data.filter(item => 
			item.Name && item.Name.trim() !== ''
		)
		
		console.log(`Found ${itemsWithNames.length} items with names out of ${data.length} total items`)
		
		// Sort by name for better user experience
		const namedItems = itemsWithNames.sort((a, b) => 
			(a.Name || a.shortname).localeCompare(b.Name || b.shortname)
		)
		
		console.log(`Final named items count: ${namedItems.length}`)
		
		generateChoicesFile(namedItems)
		
	} catch (error) {
		console.error('❌ Failed to fetch items:', error.message)
		console.log('\n💡 Make sure the API is accessible at https://pipes.tafu.casa/api/items/data')
		process.exit(1)
	}
}

function generateChoicesFile(namedItems) {
	// Create choices array for dropdowns
	const choices = namedItems.map(item => ({
		id: item.itemid,
		label: item.Name || item.shortname,
		shortname: item.shortname
	}))
	
	// Add a default "Select item" option
	choices.unshift({ id: '', label: 'Select item...', shortname: '' })
	
	// Generate the JavaScript file content
	const fileContent = `// Auto-generated file - do not edit manually
// Generated on: ${new Date().toISOString()}
// Total named items: ${namedItems.length}

module.exports = ${JSON.stringify(choices, null, 2)}
`
	
	// Write to file
	const fs = require('fs')
	fs.writeFileSync('./craftable-items.js', fileContent)
	
	console.log('✅ Successfully generated craftable-items.js')
	console.log(`📝 File contains ${choices.length} choices (including "Select item..." option)`)
	
	// Show sample items with their categories
	const sampleItems = namedItems.slice(0, 5).map(item => 
		`${item.Name || item.shortname} (${item.Category})`
	)
	console.log(`📋 Sample items: ${sampleItems.join(', ')}`)
	
	// Show a few examples of item details for verification
	if (namedItems.length > 0) {
		console.log('\n🔍 Sample item details:')
		namedItems.slice(0, 3).forEach(item => {
			console.log(`  ${item.Name || item.shortname}:`)
			console.log(`    - ID: ${item.itemid}`)
			console.log(`    - Shortname: ${item.shortname}`)
			console.log(`    - Category: ${item.Category}`)
		})
	}
}

// Run the script
fetchCraftableItems()
