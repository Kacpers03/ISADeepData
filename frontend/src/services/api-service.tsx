// frontend/src/services/api-service.tsx
import { getLocationBoundaryById } from '../constants/locationBoundaries'

// Types for filter parameters
export interface MapFilterParams {
	contractorId?: number
	contractTypeId?: number
	contractStatusId?: number
	sponsoringState?: string | null
	year?: number
	cruiseId?: number
	locationId?: string // Added locationId parameter
	minLat?: number
	maxLat?: number
	minLon?: number
	maxLon?: number
}

// Types for filter options
export interface FilterOptions {
	contractTypes: Array<{ contractTypeId: number; contractTypeName: string }>
	contractStatuses: Array<{ contractStatusId: number; contractStatusName: string }>
	sponsoringStates: string[]
	contractualYears: number[]
}

// Configuration for API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api'

// Utility function to build query parameters
const buildQueryParams = (params: MapFilterParams): string => {
	// Handle locationId separately if needed
	let modifiedParams = { ...params }
	let locationBoundaries = null

	// If we have a locationId, convert it to geographic boundaries
	if (params.locationId && params.locationId !== 'all') {
		const locationBoundary = getLocationBoundaryById(params.locationId)
		if (locationBoundary) {
			locationBoundaries = locationBoundary.bounds
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
		.filter(([_, value]) => value !== undefined && value !== null && (typeof value !== 'string' || value.trim() !== ''))
		.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
		.join('&')

	return queryParams ? `?${queryParams}` : ''
}

// API Service with robust error handling
export const apiService = {
	// Fetch all filter options for dropdowns
	async getFilterOptions(): Promise<FilterOptions> {
		try {
			const endpoints = ['contract-types', 'contract-statuses', 'sponsoring-states', 'contractual-years']

			const responses = await Promise.all(
				endpoints.map(endpoint =>
					fetch(`${API_BASE_URL}/MapFilter/${endpoint}`).then(res => {
						if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`)
						return res.json()
					})
				)
			)

			return {
				contractTypes: responses[0],
				contractStatuses: responses[1],
				sponsoringStates: responses[2],
				contractualYears: responses[3],
			}
		} catch (error) {
			console.error('Error fetching filter options:', error)
			throw error
		}
	},

	// Fetch map data with flexible filtering
	async getMapData(filters: MapFilterParams = {}): Promise<any> {
		try {
			// Sanitize filters to remove empty strings
			const sanitizedFilters = Object.fromEntries(
				Object.entries(filters).filter(
					([_, v]) => v !== undefined && v !== null && (typeof v !== 'string' || v.trim() !== '')
				)
			)

			const queryParams = buildQueryParams(sanitizedFilters)

			console.log(`Fetching map data with query: ${queryParams}`)
			const response = await fetch(`${API_BASE_URL}/MapFilter/map-data${queryParams}`)

			if (!response.ok) {
				const errorText = await response.text()
				throw new Error(`API error: ${response.status} - ${errorText}`)
			}

			return await response.json()
		} catch (error) {
			console.error('Failed to fetch map data:', error)
			throw error
		}
	},

	// Fetch stations with geographic filtering
	async getStations(
		params: {
			cruiseId?: number
			minLat?: number
			maxLat?: number
			minLon?: number
			maxLon?: number
			locationId?: string // Added locationId parameter
		} = {}
	): Promise<any> {
		try {
			// Process locationId if present
			let modifiedParams = { ...params }
			if (params.locationId && params.locationId !== 'all') {
				const locationBoundary = getLocationBoundaryById(params.locationId)
				if (locationBoundary) {
					// Replace locationId with boundary coordinates
					const { bounds } = locationBoundary
					delete modifiedParams.locationId
					modifiedParams = {
						...modifiedParams,
						minLat: bounds.minLat,
						maxLat: bounds.maxLat,
						minLon: bounds.minLon,
						maxLon: bounds.maxLon,
					}
				}
			}

			const queryParams = buildQueryParams(modifiedParams)

			const response = await fetch(`${API_BASE_URL}/MapFilter/stations${queryParams}`)

			if (!response.ok) {
				const errorText = await response.text()
				throw new Error(`API error: ${response.status} - ${errorText}`)
			}

			return await response.json()
		} catch (error) {
			console.error('Failed to fetch stations:', error)
			throw error
		}
	},

	// Fetch contractor area GeoJSON with option for location filtering
	async getContractorAreasGeoJson(
		contractorId: number,
		params: {
			locationId?: string
		} = {}
	): Promise<any> {
		try {
			let queryString = ''

			// Add location filtering if specified
			if (params.locationId && params.locationId !== 'all') {
				const locationBoundary = getLocationBoundaryById(params.locationId)
				if (locationBoundary) {
					const { bounds } = locationBoundary
					queryString = `?minLat=${bounds.minLat}&maxLat=${bounds.maxLat}&minLon=${bounds.minLon}&maxLon=${bounds.maxLon}`
				}
			}

			const response = await fetch(`${API_BASE_URL}/MapFilter/contractor-areas-geojson/${contractorId}${queryString}`)

			if (!response.ok) {
				const errorText = await response.text()
				throw new Error(`API error: ${response.status} - ${errorText}`)
			}

			return await response.json()
		} catch (error) {
			console.error(`Failed to fetch GeoJSON for contractor ${contractorId}:`, error)
			throw error
		}
	},

	// Fetch block analytics with location context if needed
	async getBlockAnalytics(
		blockId: number,
		params: {
			locationId?: string
		} = {}
	): Promise<any> {
		try {
			let queryString = ''

			// Add location context if specified
			if (params.locationId && params.locationId !== 'all') {
				queryString = `?locationContext=${encodeURIComponent(params.locationId)}`
			}

			const response = await fetch(`${API_BASE_URL}/Analytics/block/${blockId}${queryString}`)

			if (!response.ok) {
				const errorText = await response.text()
				throw new Error(`API error: ${response.status} - ${errorText}`)
			}

			return await response.json()
		} catch (error) {
			console.error(`Failed to fetch analytics for block ${blockId}:`, error)
			throw error
		}
	},

	// Fetch contractor summary with location context if needed
	async getContractorSummary(
		contractorId: number,
		params: {
			locationId?: string
		} = {}
	): Promise<any> {
		try {
			let queryString = ''

			// Add location context if specified
			if (params.locationId && params.locationId !== 'all') {
				queryString = `?locationContext=${encodeURIComponent(params.locationId)}`
			}

			const response = await fetch(`${API_BASE_URL}/Analytics/contractor/${contractorId}/summary${queryString}`)

			if (!response.ok) {
				const errorText = await response.text()
				throw new Error(`API error: ${response.status} - ${errorText}`)
			}

			return await response.json()
		} catch (error) {
			console.error(`Failed to fetch summary for contractor ${contractorId}:`, error)
			throw error
		}
	},
}
