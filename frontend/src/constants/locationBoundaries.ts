// frontend/src/constants/locationBoundaries.ts
// Defines geographic boundary data for various ocean regions used in the map component

// Interface for location boundary data structure
export interface LocationBoundary {
	id: string // Unique identifier for the location
	name: string // Display name for the location
	bounds: {
		// Geographic boundaries
		minLat: number // Minimum latitude (southern boundary)
		maxLat: number // Maximum latitude (northern boundary)
		minLon: number // Minimum longitude (western boundary)
		maxLon: number // Maximum longitude (eastern boundary)
	}
}

// Array of predefined location boundaries for marine exploration areas
export const locationBoundaries: LocationBoundary[] = [
	{
		id: 'central-indian-ocean',
		name: 'Central Indian Ocean',
		bounds: {
			minLat: -15, // Southern boundary at 15° South
			maxLat: 10, // Northern boundary at 10° North
			minLon: 60, // Western boundary at 60° East
			maxLon: 90, // Eastern boundary at 90° East
		},
	},
	{
		id: 'central-indian-ridge',
		name: 'Central Indian Ridge and Southeast Indian Ridge',
		bounds: {
			minLat: -45, // Southern boundary at 45° South
			maxLat: 0, // Northern boundary at the Equator
			minLon: 65, // Western boundary at 65° East
			maxLon: 110, // Eastern boundary at 110° East
		},
	},
	{
		id: 'clarion-clipperton',
		name: 'Clarion-Clipperton Fracture Zone',
		bounds: {
			minLat: 0, // Southern boundary at the Equator
			maxLat: 20, // Northern boundary at 20° North
			minLon: -150, // Western boundary at 150° West
			maxLon: -115, // Eastern boundary at 115° West
		},
	},
	{
		id: 'indian-ocean',
		name: 'Indian Ocean',
		bounds: {
			minLat: -40, // Southern boundary at 40° South
			maxLat: 25, // Northern boundary at 25° North
			minLon: 40, // Western boundary at 40° East
			maxLon: 110, // Eastern boundary at 110° East
		},
	},
	{
		id: 'indian-ocean-ridge',
		name: 'Indian Ocean Ridge',
		bounds: {
			minLat: -35, // Southern boundary at 35° South
			maxLat: 5, // Northern boundary at 5° North
			minLon: 55, // Western boundary at 55° East
			maxLon: 90, // Eastern boundary at 90° East
		},
	},
	{
		id: 'mid-atlantic-ridge',
		name: 'Mid-Atlantic Ridge',
		bounds: {
			minLat: -40, // Southern boundary at 40° South
			maxLat: 40, // Northern boundary at 40° North
			minLon: -50, // Western boundary at 50° West
			maxLon: -10, // Eastern boundary at 10° West
		},
	},
	{
		id: 'rio-grande-rise',
		name: 'Rio Grande Rise, South Atlantic Ocean',
		bounds: {
			minLat: -35, // Southern boundary at 35° South
			maxLat: -25, // Northern boundary at 25° South
			minLon: -40, // Western boundary at 40° West
			maxLon: -25, // Eastern boundary at 25° West
		},
	},
	{
		id: 'southwest-indian-ridge',
		name: 'Southwest Indian Ridge',
		bounds: {
			minLat: -45, // Southern boundary at 45° South
			maxLat: -25, // Northern boundary at 25° South
			minLon: 25, // Western boundary at 25° East
			maxLon: 70, // Eastern boundary at 70° East
		},
	},
	{
		id: 'pmn-reserved-areas',
		name: 'Variable - PMN Reserved Areas',
		bounds: {
			minLat: -35, // Southern boundary at 35° South
			maxLat: 35, // Northern boundary at 35° North
			minLon: -150, // Western boundary at 150° West
			maxLon: 150, // Eastern boundary at 150° East (covers most of the globe)
		},
	},
	{
		id: 'western-pacific-ocean',
		name: 'Western Pacific Ocean',
		bounds: {
			minLat: -10, // Southern boundary at 10° South
			maxLat: 30, // Northern boundary at 30° North
			minLon: 120, // Western boundary at 120° East
			maxLon: 170, // Eastern boundary at 170° East
		},
	},
]

// Utility function to get a location boundary by its ID
export function getLocationBoundaryById(id: string): LocationBoundary | undefined {
	// Find and return the location that matches the provided ID, or undefined if not found
	return locationBoundaries.find(location => location.id === id)
}

// Utility function to check if a geographic point is within a specified location boundary
export function isPointInLocation(lat: number, lon: number, locationId: string): boolean {
	// Get the location boundary data for the specified ID
	const location = getLocationBoundaryById(locationId)

	// If location doesn't exist, return false
	if (!location) return false

	const { bounds } = location

	// Handle longitude wrap-around for locations that cross the International Date Line
	// If minLon > maxLon, we have a boundary that crosses the 180°/-180° meridian
	if (bounds.minLon > bounds.maxLon) {
		// Check if point is within latitude bounds AND either east of minLon OR west of maxLon
		return lat >= bounds.minLat && lat <= bounds.maxLat && (lon >= bounds.minLon || lon <= bounds.maxLon)
	}

	// Standard case: check if point is within the rectangular boundary
	return lat >= bounds.minLat && lat <= bounds.maxLat && lon >= bounds.minLon && lon <= bounds.maxLon
}
