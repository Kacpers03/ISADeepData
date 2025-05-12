// frontend/src/services/api-service.tsx
// Service for handling API requests to the backend with filtering and data retrieval

import { getLocationBoundaryById } from '../constants/locationBoundaries' // Import utility for location boundary lookup

// Interface defining the structure of map filter parameters
export interface MapFilterParams {
	contractorId?: number // Filter by specific contractor ID
	contractTypeId?: number // Filter by contract type (e.g., exploration, reserved)
	contractStatusId?: number // Filter by contract status (e.g., active, expired)
	sponsoringState?: string | null // Filter by sponsoring country/state
	year?: number // Filter by contractual year
	cruiseId?: number // Filter by specific research cruise
	locationId?: string // Filter by predefined geographic location
	minLat?: number // Minimum latitude boundary
	maxLat?: number // Maximum latitude boundary
	minLon?: number // Minimum longitude boundary
	maxLon?: number // Maximum longitude boundary
}

// Interface defining the structure of filter dropdown options
export interface FilterOptions {
	contractTypes: Array<{ contractTypeId: number; contractTypeName: string }> // Contract type options
	contractStatuses: Array<{ contractStatusId: number; contractStatusName: string }> // Contract status options
	sponsoringStates: string[] // List of available sponsoring states
	contractualYears: number[] // List of available contractual years
}

// Configuration for API base URL with fallback to local development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api'

// Utility function to convert filter parameters into URL query string
const buildQueryParams = (params: MapFilterParams): string => {
	// Handle locationId separately if needed
	let modifiedParams = { ...params } // Create a copy of the parameters
	let locationBoundaries = null // Initialize boundaries variable

	// If we have a locationId, convert it to geographic boundaries
	if (params.locationId && params.locationId !== 'all') {
		const locationBoundary = getLocationBoundaryById(params.locationId) // Look up the location
		if (locationBoundary) {
			locationBoundaries = locationBoundary.bounds // Get boundary coordinates
			// Remove locationId as we'll use the boundaries instead
			delete modifiedParams.locationId

			// Add the boundary parameters
			modifiedParams = {
				...modifiedParams,
				minLat: locationBoundaries.minLat,
				maxLat: locationBoundaries.maxLat,
				minLon: locationBoundaries.minLon,
				maxLon: locationBoundaries.maxLon,
			}
		}
	}

	// Convert params to query string, handling null/undefined/empty values
	const queryParams = Object.entries(modifiedParams)
		.filter(([_, value]) => value !== undefined && value !== null && (typeof value !== 'string' || value.trim() !== '')) // Remove empty values
		.map(([key, value]) => `${key}=${encodeURIComponent(value)}`) // Format as key=value with encoding
		.join('&') // Join with ampersands

	return queryParams ? `?${queryParams}` : '' // Add question mark if params exist
}

// API Service with robust error handling for all data retrieval operations
export const apiService = {
	// Fetch all filter options for dropdown menus
	async getFilterOptions(): Promise<FilterOptions> {
		try {
			// Define all endpoints to fetch in parallel
			const endpoints = ['contract-types', 'contract-statuses', 'sponsoring-states', 'contractual-years']

			// Fetch all endpoints concurrently for better performance
			const responses = await Promise.all(
				endpoints.map(endpoint =>
					fetch(`${API_BASE_URL}/MapFilter/${endpoint}`).then(res => {
						if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`) // Validate response
						return res.json() // Parse JSON response
					})
				)
			)

			// Combine responses into a single FilterOptions object
			return {
				contractTypes: responses[0], // Contract types from first endpoint
				contractStatuses: responses[1], // Contract statuses from second endpoint
				sponsoringStates: responses[2], // Sponsoring states from third endpoint
				contractualYears: responses[3], // Years from fourth endpoint
			}
		} catch (error) {
			console.error('Error fetching filter options:', error) // Log error for debugging
			throw error // Propagate error to caller
		}
	},

	// Fetch map data with flexible filtering options
	async getMapData(filters: MapFilterParams = {}): Promise<any> {
		try {
			// Sanitize filters to remove empty strings and null values
			const sanitizedFilters = Object.fromEntries(
				Object.entries(filters).filter(
					([_, v]) => v !== undefined && v !== null && (typeof v !== 'string' || v.trim() !== '')
				)
			)

			// Build query string from sanitized filters
			const queryParams = buildQueryParams(sanitizedFilters)

			console.log(`Fetching map data with query: ${queryParams}`) // Log for debugging
			const response = await fetch(`${API_BASE_URL}/MapFilter/map-data${queryParams}`) // Make API request

			// Check for error response
			if (!response.ok) {
				const errorText = await response.text() // Get error details
				throw new Error(`API error: ${response.status} - ${errorText}`) // Throw with details
			}

			return await response.json() // Parse and return JSON data
		} catch (error) {
			console.error('Failed to fetch map data:', error) // Log error for debugging
			throw error // Propagate error to caller
		}
	},

	// Fetch stations with geographic filtering
	async getStations(
		params: {
			cruiseId?: number // Filter by cruise ID
			minLat?: number // Minimum latitude boundary
			maxLat?: number // Maximum latitude boundary
			minLon?: number // Minimum longitude boundary
			maxLon?: number // Maximum longitude boundary
			locationId?: string // Filter by predefined location
		} = {}
	): Promise<any> {
		try {
			// Process locationId if present
			let modifiedParams = { ...params } // Create a copy of parameters
			if (params.locationId && params.locationId !== 'all') {
				const locationBoundary = getLocationBoundaryById(params.locationId) // Look up location
				if (locationBoundary) {
					// Replace locationId with boundary coordinates
					const { bounds } = locationBoundary
					delete modifiedParams.locationId // Remove locationId
					modifiedParams = {
						...modifiedParams,
						minLat: bounds.minLat,
						maxLat: bounds.maxLat,
						minLon: bounds.minLon,
						maxLon: bounds.maxLon,
					}
				}
			}

			// Build query string from parameters
			const queryParams = buildQueryParams(modifiedParams)

			// Make API request
			const response = await fetch(`${API_BASE_URL}/MapFilter/stations${queryParams}`)

			// Check for error response
			if (!response.ok) {
				const errorText = await response.text() // Get error details
				throw new Error(`API error: ${response.status} - ${errorText}`) // Throw with details
			}

			return await response.json() // Parse and return JSON data
		} catch (error) {
			console.error('Failed to fetch stations:', error) // Log error for debugging
			throw error // Propagate error to caller
		}
	},

	// Fetch contractor area GeoJSON with option for location filtering
	async getContractorAreasGeoJson(
		contractorId: number, // Required contractor ID
		params: {
			locationId?: string // Optional location filter
		} = {}
	): Promise<any> {
		try {
			let queryString = '' // Initialize empty query string

			// Add location filtering if specified
			if (params.locationId && params.locationId !== 'all') {
				const locationBoundary = getLocationBoundaryById(params.locationId) // Look up location
				if (locationBoundary) {
					const { bounds } = locationBoundary // Get boundary coordinates
					// Format as query string
					queryString = `?minLat=${bounds.minLat}&maxLat=${bounds.maxLat}&minLon=${bounds.minLon}&maxLon=${bounds.maxLon}`
				}
			}

			// Make API request
			const response = await fetch(`${API_BASE_URL}/MapFilter/contractor-areas-geojson/${contractorId}${queryString}`)

			// Check for error response
			if (!response.ok) {
				const errorText = await response.text() // Get error details
				throw new Error(`API error: ${response.status} - ${errorText}`) // Throw with details
			}

			return await response.json() // Parse and return GeoJSON data
		} catch (error) {
			console.error(`Failed to fetch GeoJSON for contractor ${contractorId}:`, error) // Log error with context
			throw error // Propagate error to caller
		}
	},

	// Fetch block analytics with location context if needed
	async getBlockAnalytics(
		blockId: number, // Required block ID
		params: {
			locationId?: string // Optional location context
		} = {}
	): Promise<any> {
		try {
			let queryString = '' // Initialize empty query string

			// Add location context if specified
			if (params.locationId && params.locationId !== 'all') {
				// Include location as context parameter
				queryString = `?locationContext=${encodeURIComponent(params.locationId)}`
			}

			// Make API request
			const response = await fetch(`${API_BASE_URL}/Analytics/block/${blockId}${queryString}`)

			// Check for error response
			if (!response.ok) {
				const errorText = await response.text() // Get error details
				throw new Error(`API error: ${response.status} - ${errorText}`) // Throw with details
			}

			return await response.json() // Parse and return analytics data
		} catch (error) {
			console.error(`Failed to fetch analytics for block ${blockId}:`, error) // Log error with context
			throw error // Propagate error to caller
		}
	},

	// Fetch contractor summary with location context if needed
	async getContractorSummary(
		contractorId: number, // Required contractor ID
		params: {
			locationId?: string // Optional location context
		} = {}
	): Promise<any> {
		try {
			let queryString = '' // Initialize empty query string

			// Add location context if specified
			if (params.locationId && params.locationId !== 'all') {
				// Include location as context parameter
				queryString = `?locationContext=${encodeURIComponent(params.locationId)}`
			}

			// Make API request
			const response = await fetch(`${API_BASE_URL}/Analytics/contractor/${contractorId}/summary${queryString}`)

			// Check for error response
			if (!response.ok) {
				const errorText = await response.text() // Get error details
				throw new Error(`API error: ${response.status} - ${errorText}`) // Throw with details
			}

			return await response.json() // Parse and return summary data
		} catch (error) {
			console.error(`Failed to fetch summary for contractor ${contractorId}:`, error) // Log error with context
			throw error // Propagate error to caller
		}
	},
}
