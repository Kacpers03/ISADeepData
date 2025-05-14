// frontend/src/utils/dataUtilities.ts
// Helper library with tools for data manipulation, formatting and debugging

import { MapData } from './dataModels'

export function getProp(obj: any, propName: string): any {
	if (!obj || typeof obj !== 'object') return undefined

	// Check direct property access (case-sensitive)
	if (obj[propName] !== undefined) {
		return obj[propName]
	}

	// Try PascalCase version (first letter uppercase)
	const pascalCase = propName.charAt(0).toUpperCase() + propName.slice(1)
	if (obj[pascalCase] !== undefined) {
		return obj[pascalCase]
	}

	// Try case-insensitive search (slower but thorough)
	// This is especially useful when data may come from different sources with different formatting
	const lowerPropName = propName.toLowerCase()
	for (const key in obj) {
		if (key.toLowerCase() === lowerPropName) {
			return obj[key]
		}
	}

	// No match found
	return undefined
}

export function normalizeCase(data: any): any {
	if (!data) return data

	// Recursively normalize each element in an array
	if (Array.isArray(data)) {
		return data.map(item => normalizeCase(item))
	}

	// Normalize properties in an object
	if (typeof data === 'object' && data !== null) {
		const result: any = {}

		for (const key in data) {
			// Convert key to camelCase if it's in PascalCase
			// This ensures consistent key names for all further data processing
			const camelKey = key.charAt(0).toLowerCase() + key.slice(1)
			result[camelKey] = normalizeCase(data[key]) // Recursively normalize nested objects
		}

		return result
	}

	// For primitive values, return unchanged
	return data
}

export function formatNumericValue(value: any): string {
	if (value === undefined || value === null) return ''

	// Convert to string for consistency
	const stringValue = value.toString()

	// Check if it's a number that might be misinterpreted as a date (e.g., 10.01, 1.12)
	// This is a common issue in Excel which can convert numbers to dates
	if (/^\d+\.\d+$/.test(stringValue)) {
		// Format with explicit decimal point and prevent auto-conversion to date
		// By prefixing with "=" and wrapping in quotes, we force Excel to treat it as text
		return `="${stringValue}"`
	}

	return stringValue
}

export function formatDateValue(date: string | Date | undefined, includeTime: boolean = false): string {
	if (!date) return ''

	try {
		// Convert to Date object if input is a string
		const dateObj = typeof date === 'string' ? new Date(date) : date

		if (includeTime) {
			// Use local time format instead of ISO
			// Format: YYYY-MM-DDThh:mm:ss for compatibility with Excel and most systems
			return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(
				dateObj.getDate()
			).padStart(2, '0')}T${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(
				2,
				'0'
			)}:${String(dateObj.getSeconds()).padStart(2, '0')}`
		} else {
			// Use local date format without time
			// Format: YYYY-MM-DD for better compatibility and readability
			return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(
				dateObj.getDate()
			).padStart(2, '0')}`
		}
	} catch (error) {
		// Log error without crashing the application
		console.error('Error formatting date:', error)
		return ''
	}
}

export function debugDataFields(data: any): void {
	if (!data) {
		console.log('No data to debug')
		return
	}

	console.log('--- DEBUG DATA STRUCTURE ---')

	// For each section, log the first item to see its structure
	// This is useful during development to verify the data structure
	if (data.contractors?.length > 0) {
		console.log('Contractor fields:', Object.keys(data.contractors[0]))

		if (data.contractors[0].areas?.length > 0) {
			console.log('Area fields:', Object.keys(data.contractors[0].areas[0]))

			if (data.contractors[0].areas[0].blocks?.length > 0) {
				console.log('Block fields:', Object.keys(data.contractors[0].areas[0].blocks[0]))
			}
		}
	}

	if (data.cruises?.length > 0) {
		console.log('Cruise fields:', Object.keys(data.cruises[0]))

		if (data.cruises[0].stations?.length > 0) {
			console.log('Station fields:', Object.keys(data.cruises[0].stations[0]))

			if (data.cruises[0].stations[0].samples?.length > 0) {
				console.log('Sample fields:', Object.keys(data.cruises[0].stations[0].samples[0]))
			}
		}
	}
}

export function analyzeMapData(data: MapData): any {
	if (!data) return { error: 'No data provided' }

	// Initialize counters for all entity types
	const counts = {
		contractors: 0,
		areas: 0,
		blocks: 0,
		cruises: 0,
		stations: 0,
		samples: 0,
		ctdData: 0,
		envResults: 0,
		geoResults: 0,
		media: 0,
		libraries: 0,
	}

	// Count contractors
	counts.contractors = getProp(data, 'contractors')?.length || 0

	// Count areas and blocks
	data.contractors?.forEach((contractor: any) => {
		// Count areas
		counts.areas += getProp(contractor, 'areas')?.length || 0

		// Count blocks
		getProp(contractor, 'areas')?.forEach((area: any) => {
			counts.blocks += getProp(area, 'blocks')?.length || 0
		})

		// Count libraries
		counts.libraries += getProp(contractor, 'libraries')?.length || 0
	})

	// Count cruises and stations
	counts.cruises = getProp(data, 'cruises')?.length || 0

	data.cruises?.forEach((cruise: any) => {
		// Count stations
		counts.stations += getProp(cruise, 'stations')?.length || 0

		// Count CTD data
		getProp(cruise, 'stations')?.forEach((station: any) => {
			counts.ctdData += getProp(station, 'ctdDataSet')?.length || 0

			// Count samples
			counts.samples += getProp(station, 'samples')?.length || 0

			// Count sample-related data
			getProp(station, 'samples')?.forEach((sample: any) => {
				counts.envResults += getProp(sample, 'envResults')?.length || 0
				counts.geoResults += getProp(sample, 'geoResults')?.length || 0
				counts.media += getProp(sample, 'photoVideos')?.length || 0
			})
		})
	})

	// Return the count summary object
	return counts
}
