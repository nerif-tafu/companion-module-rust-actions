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
		
		// Filter for all items with display names (for Give Items command)
		console.log('Filtering items for those with display names...')
		
		const allItems = data.items.filter(item => 
			item.displayName && 
			item.displayName.trim() !== ''
		)
		
		console.log(`Found ${allItems.length} items with display names out of ${data.items.length} total items`)
		
		// Sort by display name for better user experience
		const sortedAllItems = allItems.sort((a, b) => 
			a.displayName.localeCompare(b.displayName)
		)
		
		console.log(`Final all items count: ${sortedAllItems.length}`)
		
		generateChoicesFiles(sortedItems, sortedAllItems)
		
	} catch (error) {
		console.error('❌ Failed to fetch items:', error.message)
		console.log('\n💡 Make sure the Rust API is accessible at https://rust-api.tafu.casa/api/items')
		process.exit(1)
	}
}

function generateChoicesFiles(craftableItems, allItems) {
	const fs = require('fs')
	
	// Generate craftable-items.js (for crafting actions)
	const craftableChoices = craftableItems.map(item => ({
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
	craftableChoices.unshift({ 
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
	
	// Generate all-items.js (for Give Items command)
	const allChoices = allItems.map(item => ({
		id: item.itemid,
		label: item.displayName,
		shortname: item.shortname,
		category: item.categoryName || '',
		stackable: item.stackable || 1
	}))
	
	// Add a default "Select item" option
	allChoices.unshift({ 
		id: '', 
		label: 'Select item...', 
		shortname: '',
		category: '',
		stackable: 1
	})
	
	// Generate craftable-items.js file
	const craftableFileContent = `// Auto-generated file - do not edit manually
// Generated on: ${new Date().toISOString()}
// Total craftable items: ${craftableItems.length}
// Source: Rust API (https://rust-api.tafu.casa/api/items)
// Note: This file contains only items with crafting recipes (for crafting actions)

module.exports = ${JSON.stringify(craftableChoices, null, 2)}
`
	
	// Generate all-items.js file
	const allItemsFileContent = `// Auto-generated file - do not edit manually
// Generated on: ${new Date().toISOString()}
// Total items: ${allItems.length}
// Source: Rust API (https://rust-api.tafu.casa/api/items)
// Note: This file contains ALL items from the game (for Give Items command)

module.exports = ${JSON.stringify(allChoices, null, 2)}
`
	
	// Write both files
	fs.writeFileSync('./craftable-items.js', craftableFileContent)
	fs.writeFileSync('./all-items.js', allItemsFileContent)
	
	console.log('✅ Successfully generated craftable-items.js')
	console.log(`📝 File contains ${craftableChoices.length} choices (including "Select item..." option)`)
	console.log('✅ Successfully generated all-items.js')
	console.log(`📝 File contains ${allChoices.length} choices (including "Select item..." option)`)
	
	// Show sample items with their categories and workbench requirements
	const sampleCraftableItems = craftableItems.slice(0, 5).map(item => 
		`${item.displayName} (${item.categoryName}, WB${item.workbenchLevelRequired || 0})`
	)
	console.log(`\n📋 Sample craftable items: ${sampleCraftableItems.join(', ')}`)
	
	const sampleAllItems = allItems.slice(0, 5).map(item => 
		`${item.displayName} (${item.categoryName || 'Unknown'})`
	)
	console.log(`📋 Sample all items: ${sampleAllItems.join(', ')}`)
	
	// Show a few examples of craftable item details for verification
	if (craftableItems.length > 0) {
		console.log('\n🔍 Sample craftable item details:')
		craftableItems.slice(0, 2).forEach(item => {
			console.log(`  ${item.displayName}:`)
			console.log(`    - ID: ${item.itemid}`)
			console.log(`    - Shortname: ${item.shortname}`)
			console.log(`    - Category: ${item.categoryName}`)
			console.log(`    - Workbench Level: ${item.workbenchLevelRequired || 0}`)
			console.log(`    - Craft Time: ${item.craftTime || 0}s`)
			if (item.ingredients && item.ingredients.length > 0) {
				console.log(`    - Ingredients: ${item.ingredients.map(ing => `${ing.amount}x ${ing.itemDef.displayName}`).join(', ')}`)
			}
		})
	}
	
	// Show category breakdown for all items
	const categoryCounts = {}
	allItems.forEach(item => {
		const category = item.categoryName || 'Unknown'
		categoryCounts[category] = (categoryCounts[category] || 0) + 1
	})
	
	console.log('\n📊 Category breakdown (all items):')
	Object.entries(categoryCounts)
		.sort(([,a], [,b]) => b - a)
		.forEach(([category, count]) => {
			console.log(`  ${category}: ${count} items`)
		})
	
	console.log(`\n📈 Summary:`)
	console.log(`  - Craftable items: ${craftableItems.length}`)
	console.log(`  - All items: ${allItems.length}`)
	console.log(`  - Difference: ${allItems.length - craftableItems.length} items can be given but not crafted`)
}

// Run the script
fetchCraftableItems()
