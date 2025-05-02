// frontend/src/constants/locationBoundaries.ts

export interface LocationBoundary {
	id: string
	name: string
	bounds: {
		minLat: number
		maxLat: number
		minLon: number
		maxLon: number
	}
}

export const locationBoundaries: LocationBoundary[] = [
	{
		id: 'central-indian-ocean',
		name: 'Central Indian Ocean',
		bounds: {
			minLat: -15,
			maxLat: 10,
			minLon: 60,
			maxLon: 90,
		},
	},
	{
		id: 'central-indian-ridge',
		name: 'Central Indian Ridge and Southeast Indian Ridge',
		bounds: {
			minLat: -45,
			maxLat: 0,
			minLon: 65,
			maxLon: 110,
		},
	},
	{
		id: 'clarion-clipperton',
		name: 'Clarion-Clipperton Fracture Zone',
		bounds: {
			minLat: 0,
			maxLat: 20,
			minLon: -150,
			maxLon: -115,
		},
	},
	{
		id: 'indian-ocean',
		name: 'Indian Ocean',
		bounds: {
			minLat: -40,
			maxLat: 25,
			minLon: 40,
			maxLon: 110,
		},
	},
	{
		id: 'indian-ocean-ridge',
		name: 'Indian Ocean Ridge',
		bounds: {
			minLat: -35,
			maxLat: 5,
			minLon: 55,
			maxLon: 90,
		},
	},
	{
		id: 'mid-atlantic-ridge',
		name: 'Mid-Atlantic Ridge',
		bounds: {
			minLat: -40,
			maxLat: 40,
			minLon: -50,
			maxLon: -10,
		},
	},
	{
		id: 'rio-grande-rise',
		name: 'Rio Grande Rise, South Atlantic Ocean',
		bounds: {
			minLat: -35,
			maxLat: -25,
			minLon: -40,
			maxLon: -25,
		},
	},
	{
		id: 'southwest-indian-ridge',
		name: 'Southwest Indian Ridge',
		bounds: {
			minLat: -45,
			maxLat: -25,
			minLon: 25,
			maxLon: 70,
		},
	},
	{
		id: 'pmn-reserved-areas',
		name: 'Variable - PMN Reserved Areas',
		bounds: {
			minLat: -35,
			maxLat: 35,
			minLon: -150,
			maxLon: 150,
		},
	},
	{
		id: 'western-pacific-ocean',
		name: 'Western Pacific Ocean',
		bounds: {
			minLat: -10,
			maxLat: 30,
			minLon: 120,
			maxLon: 170,
		},
	},
]

// Function to get a location boundary by ID
export function getLocationBoundaryById(id: string): LocationBoundary | undefined {
	return locationBoundaries.find(location => location.id === id)
}

// Function to check if a point is within a location boundary
export function isPointInLocation(lat: number, lon: number, locationId: string): boolean {
	const location = getLocationBoundaryById(locationId)

	if (!location) return false

	const { bounds } = location

	// Handle longitude wrap-around for locations that cross the International Date Line
	if (bounds.minLon > bounds.maxLon) {
		return lat >= bounds.minLat && lat <= bounds.maxLat && (lon >= bounds.minLon || lon <= bounds.maxLon)
	}

	return lat >= bounds.minLat && lat <= bounds.maxLat && lon >= bounds.minLon && lon <= bounds.maxLon
}
