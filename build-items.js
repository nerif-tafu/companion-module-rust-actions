#!/usr/bin/env node

const fetch = require('node-fetch')

async function fetchCraftableItems() {
	try {
		console.log('Fetching items from Rust API...')
		
		// Use the new Rust items API endpoint
		const apiUrl = 'https://rust-api.tafu.casa/api/items?limit=10000&offset=0'
		
		const response = await fetch(apiUrl)
		
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`)
		}
		
		const data = await response.json()
		
		if (!data.items || !Array.isArray(data.items)) {
			throw new Error('API response does not contain items array')
		}
		
		console.log(`Found ${data.items.length} total items from Rust API`)
		
		// Filter for items that have crafting information (ingredients array)
		console.log('Filtering items for those with crafting recipes...')
		
		const craftableItems = data.items.filter(item => 
			item.ingredients && 
			Array.isArray(item.ingredients) && 
			item.ingredients.length > 0 &&
			item.displayName && 
			item.displayName.trim() !== ''
		)
		
		console.log(`Found ${craftableItems.length} craftable items out of ${data.items.length} total items`)
		
		// Sort by display name for better user experience
		const sortedItems = craftableItems.sort((a, b) => 
			a.displayName.localeCompare(b.displayName)
		)
		
		console.log(`Final craftable items count: ${sortedItems.length}`)
		
		generateChoicesFile(sortedItems)
		
	} catch (error) {
		console.error('❌ Failed to fetch items:', error.message)
		console.log('\n💡 Make sure the Rust API is accessible at https://rust-api.tafu.casa/api/items')
		process.exit(1)
	}
}

function generateChoicesFile(craftableItems) {
	// Create choices array for dropdowns with enhanced information
	const choices = craftableItems.map(item => ({
		id: item.itemid,
		label: item.displayName,
		shortname: item.shortname,
		category: item.categoryName,
		workbenchLevel: item.workbenchLevelRequired || 0,
		craftTime: item.craftTime || 0,
		amountToCreate: item.amountToCreate || 1,
		stackable: item.stackable || 1,
		ingredients: item.ingredients || []
	}))
	
	// Add a default "Select item" option
	choices.unshift({ 
		id: '', 
		label: 'Select item...', 
		shortname: '', 
		category: '',
		workbenchLevel: 0,
		craftTime: 0,
		amountToCreate: 1,
		stackable: 1,
		ingredients: []
	})
	
	// Generate the JavaScript file content
	const fileContent = `// Auto-generated file - do not edit manually
// Generated on: ${new Date().toISOString()}
// Total craftable items: ${craftableItems.length}
// Source: Rust API (https://rust-api.tafu.casa/api/items)

module.exports = ${JSON.stringify(choices, null, 2)}
`
	
	// Write to file
	const fs = require('fs')
	fs.writeFileSync('./craftable-items.js', fileContent)
	
	console.log('✅ Successfully generated craftable-items.js')
	console.log(`📝 File contains ${choices.length} choices (including "Select item..." option)`)
	
	// Show sample items with their categories and workbench requirements
	const sampleItems = craftableItems.slice(0, 5).map(item => 
		`${item.displayName} (${item.categoryName}, WB${item.workbenchLevelRequired || 0})`
	)
	console.log(`📋 Sample items: ${sampleItems.join(', ')}`)
	
	// Show a few examples of item details for verification
	if (craftableItems.length > 0) {
		console.log('\n🔍 Sample item details:')
		craftableItems.slice(0, 3).forEach(item => {
			console.log(`  ${item.displayName}:`)
			console.log(`    - ID: ${item.itemid}`)
			console.log(`    - Shortname: ${item.shortname}`)
			console.log(`    - Category: ${item.categoryName}`)
			console.log(`    - Workbench Level: ${item.workbenchLevelRequired || 0}`)
			console.log(`    - Craft Time: ${item.craftTime || 0}s`)
			console.log(`    - Amount Created: ${item.amountToCreate || 1}`)
			console.log(`    - Stackable: ${item.stackable || 1}`)
			if (item.ingredients && item.ingredients.length > 0) {
				console.log(`    - Ingredients: ${item.ingredients.map(ing => `${ing.amount}x ${ing.itemDef.displayName}`).join(', ')}`)
			}
		})
	}
	
	// Show category breakdown
	const categoryCounts = {}
	craftableItems.forEach(item => {
		const category = item.categoryName || 'Unknown'
		categoryCounts[category] = (categoryCounts[category] || 0) + 1
	})
	
	console.log('\n📊 Category breakdown:')
	Object.entries(categoryCounts)
		.sort(([,a], [,b]) => b - a)
		.forEach(([category, count]) => {
			console.log(`  ${category}: ${count} items`)
		})
}

// Run the script
fetchCraftableItems()
