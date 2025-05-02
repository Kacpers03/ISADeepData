// frontend/src/utils/dataUtilities.ts

import { MapData } from './dataModels'

/**
 * Case-insensitive property getter - works with both camelCase and PascalCase
 * @param obj Object to get property from
 * @param propName Property name (in camelCase format)
 * @returns The property value or undefined if not found
 */
export function getProp(obj: any, propName: string): any {
	if (!obj || typeof obj !== 'object') return undefined

	// Check direct property access (case-sensitive)
	if (obj[propName] !== undefined) {
		return obj[propName]
	}

	// Try PascalCase version
	const pascalCase = propName.charAt(0).toUpperCase() + propName.slice(1)
	if (obj[pascalCase] !== undefined) {
		return obj[pascalCase]
	}

	// Try case-insensitive search (slower but thorough)
	const lowerPropName = propName.toLowerCase()
	for (const key in obj) {
		if (key.toLowerCase() === lowerPropName) {
			return obj[key]
		}
	}

	return undefined
}

/**
 * Normalizes an object's properties to camelCase for consistent access
 * @param data Object or array to normalize
 * @returns Normalized data with consistent property names
 */
export function normalizeCase(data: any): any {
	if (!data) return data

	if (Array.isArray(data)) {
		return data.map(item => normalizeCase(item))
	}

	if (typeof data === 'object' && data !== null) {
		const result: any = {}

		for (const key in data) {
			// Convert key to camelCase if it's in PascalCase
			const camelKey = key.charAt(0).toLowerCase() + key.slice(1)
			result[camelKey] = normalizeCase(data[key])
		}

		return result
	}

	return data
}

/**
 * Format a numeric value to prevent Excel from misinterpreting it as a date
 * @param value Numeric value to format
 * @returns Formatted string that won't be misinterpreted as a date by Excel
 */
export function formatNumericValue(value: any): string {
	if (value === undefined || value === null) return ''

	// Convert to string for consistency
	const stringValue = value.toString()

	// Check if it's a number that might be misinterpreted as a date (e.g., 10.01, 1.12)
	if (/^\d+\.\d+$/.test(stringValue)) {
		// Format with explicit decimal point and prevent auto-conversion to date
		return `="${stringValue}"`
	}

	return stringValue
}

/**
 * Format a date value for CSV export
 * @param date Date string or Date object
 * @param includeTime Whether to include time in the output
 * @returns Formatted date string
 */
// Corrected formatDateValue function for frontend/src/utils/dataUtilities.ts
export function formatDateValue(date: string | Date | undefined, includeTime: boolean = false): string {
	if (!date) return ''

	try {
		const dateObj = typeof date === 'string' ? new Date(date) : date

		if (includeTime) {
			// Use local time format instead of ISO
			return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(
				dateObj.getDate()
			).padStart(2, '0')}T${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(
				2,
				'0'
			)}:${String(dateObj.getSeconds()).padStart(2, '0')}`
		} else {
			// Use local date format instead of ISO split
			return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(
				dateObj.getDate()
			).padStart(2, '0')}`
		}
	} catch (error) {
		console.error('Error formatting date:', error)
		return ''
	}
}

/**
 * Debug utility to log the exact field names available in the data
 * @param data Any object to analyze
 */
export function debugDataFields(data: any): void {
	if (!data) {
		console.log('No data to debug')
		return
	}

	console.log('--- DEBUG DATA STRUCTURE ---')

	// For each section, log the first item to see its structure
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

/**
 * Recursively traverse the map data to ensure all related data is loaded
 * This helps find any missing data like CTDData, Libraries, etc.
 *
 * @param data MapData object to check
 * @returns Object with counts of each entity type
 */
export function analyzeMapData(data: MapData): any {
	if (!data) return { error: 'No data provided' }

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

	return counts
}
