// frontend/src/types/filter-types.tsx
// TypeScript type definitions for filter system, data models and API responses

// Base filter parameters for map data filtering
export interface MapFilterParams {
	contractorId?: number // Filter by specific contractor ID
	contractTypeId?: number // Filter by contract type (e.g., exploration, reserved)
	contractStatusId?: number // Filter by contract status (e.g., active, expired)
	sponsoringState?: string // Filter by sponsoring country/state
	year?: number // Filter by contractual year
	cruiseId?: number // Filter by specific research cruise
	locationId?: string // Filter by predefined geographic location
	minLat?: number // Minimum latitude boundary
	maxLat?: number // Maximum latitude boundary
	minLon?: number // Minimum longitude boundary
	maxLon?: number // Maximum longitude boundary
}

// GeoJSON feature structure for map rendering
export interface GeoJsonFeature {
	type: 'Feature' // GeoJSON feature type
	properties: Record<string, any> // Properties associated with the feature
	geometry: {
		type: string // Geometry type (e.g., Polygon, MultiPolygon)
		coordinates: number[][][] // Coordinate arrays defining the geometry
	}
}

// Area geographic data with blocks for map display
export interface ContractorAreaGeoData {
	areaId: number // Unique identifier for the area
	areaName: string // Display name for the area
	geoJson: string // GeoJSON string for area boundaries
	centerLat: number // Center latitude for positioning
	centerLon: number // Center longitude for positioning
	totalAreaSizeKm2: number // Total size in square kilometers
	allocationDate: string // Date when area was allocated
	expiryDate: string // Expiration date for the contract
	blocks: ContractorBlockGeoData[] // Blocks within this area
}

// Block geographic data for map display
export interface ContractorBlockGeoData {
	blockId: number // Unique identifier for the block
	blockName: string // Display name for the block
	status: string // Current status (e.g., active, reserved)
	geoJson: string // GeoJSON string for block boundaries
	centerLat: number // Center latitude for positioning
	centerLon: number // Center longitude for positioning
	areaSizeKm2: number // Size in square kilometers
}

// Block within a contractor area
export interface ContractorAreaBlock {
	blockId: number // Unique identifier for the block
	areaId: number // ID of the parent area
	blockName: string // Display name for the block
	blockDescription: string // Detailed description of the block
	status: string // Current status (e.g., active, reserved)
	geoJsonBoundary?: string // Optional GeoJSON string for block boundaries
	centerLatitude?: number // Optional center latitude for positioning
	centerLongitude?: number // Optional center longitude for positioning
	areaSizeKm2?: number // Optional size in square kilometers
}

// Area belonging to a contractor
export interface ContractorArea {
	areaId: number // Unique identifier for the area
	contractorId: number // ID of the contractor who holds rights
	areaName: string // Display name for the area
	areaDescription: string // Detailed description of the area
	geoJsonBoundary?: string // Optional GeoJSON string for area boundaries
	centerLatitude?: number // Optional center latitude for positioning
	centerLongitude?: number // Optional center longitude for positioning
	totalAreaSizeKm2?: number // Optional total size in square kilometers
	allocationDate?: string // Optional date when area was allocated
	expiryDate?: string // Optional expiration date for the contract
	blocks?: ContractorAreaBlock[] // Optional blocks within this area
}

// Filter dropdown options for UI
export interface FilterOptions {
	contractTypes: ContractType[] // Available contract types
	contractStatuses: ContractStatus[] // Available contract statuses
	sponsoringStates: string[] // Available sponsoring states
	contractualYears: number[] // Available contractual years
}

// Contract type for filtering
export interface ContractType {
	contractTypeId: number // Unique identifier for the contract type
	contractTypeName: string // Display name for the contract type
}

// Contract status for filtering
export interface ContractStatus {
	contractStatusId: number // Unique identifier for the contract status
	contractStatusName: string // Display name for the contract status
}

// Contractor data model
export interface Contractor {
	contractorId: number // Unique identifier for the contractor
	contractorName: string // Name of the contractor organization
	contractTypeId: number // ID of the contract type
	contractStatusId: number // ID of the contract status
	contractNumber: string // Reference number for the contract
	sponsoringState: string // Sponsoring country/state
	contractualYear: number // Year when contract was established
	remarks: string // Additional notes or comments
	contractType?: string // Optional contract type name (resolved from ID)
	contractStatus?: string // Optional contract status name (resolved from ID)
	areas?: ContractorArea[] // Optional areas held by this contractor
}

// Research cruise data model
export interface Cruise {
	cruiseId: number // Unique identifier for the cruise
	contractorId: number // ID of the contractor conducting the cruise
	cruiseName: string // Name of the research cruise
	researchVessel: string // Name of the vessel used
	startDate: string // Start date of the cruise
	endDate: string // End date of the cruise
	stations?: Station[] // Optional stations visited during the cruise
}

// Research station data model
export interface Station {
	stationId: number // Unique identifier for the station
	cruiseId: number // ID of the cruise that visited this station
	stationCode: string // Code/identifier for the station
	stationType: string // Type of station (e.g., sampling, observation)
	latitude: number // Latitude coordinate
	longitude: number // Longitude coordinate
	contractorAreaBlockId?: number // Optional ID of the block containing this station
	samples?: Sample[] // Optional samples collected at this station
}

// Sample data model
export interface Sample {
	sampleId: number // Unique identifier for the sample
	stationId: number // ID of the station where sample was collected
	sampleCode: string // Code/identifier for the sample
	sampleType: string // Type of sample (e.g., sediment, water)
	matrixType: string // Matrix type (e.g., solid, liquid)
	habitatType: string // Habitat type where sample was collected
	samplingDevice: string // Device used for sampling
	depthLower: number // Lower depth boundary in meters
	depthUpper: number // Upper depth boundary in meters
	sampleDescription: string // Detailed description of the sample
	PhotoVideos: Media[] // Media associated with this sample
}

// Media data model for photos and videos
export interface Media {
	mediaId: number // Unique identifier for the media
	sampleId: number // ID of the sample associated with this media
	fileName: string // File name of the media
	mediaType: string // Type of media (e.g., photo, video)
	cameraSpecs: string // Camera specifications used
	captureDate: string // Date when media was captured
	remarks: string // Additional notes or comments
}

// Complete map data response from API
export interface MapData {
	contractors: Contractor[] // Array of contractors
	cruises: Cruise[] // Array of cruises
}

// Block analytics data for detailed block information
export interface BlockAnalytics {
	block: {
		// Block details
		blockId: number // Unique identifier for the block
		blockName: string // Display name for the block
		status: string // Current status
		areaSizeKm2: number // Size in square kilometers
		area: {
			// Parent area information
			areaId: number // Unique identifier for the area
			areaName: string // Display name for the area
			contractor: {
				// Contractor information
				contractorId: number // Unique identifier for the contractor
				contractorName: string // Name of the contractor
			}
		}
	}
	counts: {
		// Summary counts
		stations: number // Number of stations in the block
		samples: number // Number of samples collected
		environmentalResults: number // Number of environmental results
		geologicalResults: number // Number of geological results
	}
	environmentalParameters: Array<{
		// Environmental data categories
		category: string // Category name (e.g., "Water Quality")
		parameters: Array<{
			// Parameters in this category
			name: string // Parameter name (e.g., "Temperature")
			averageValue: number // Average value
			minValue: number // Minimum value
			maxValue: number // Maximum value
			unit: string // Unit of measurement
			count: number // Number of measurements
		}>
	}>
	resourceMetrics: Array<{
		// Resource assessment data
		category: string // Resource category (e.g., "Metals")
		analyses: Array<{
			// Analysis results
			analysis: string // Analysis name
			averageValue: number // Average value
			minValue: number // Minimum value
			maxValue: number // Maximum value
			unit: string // Unit of measurement
			count: number // Number of analyses
		}>
	}>
	sampleTypes: Array<{
		// Sample type distribution
		sampleType: string // Type of sample
		count: number // Number of samples of this type
		depthRange: {
			// Depth range for this sample type
			min: number // Minimum depth
			max: number // Maximum depth
		}
	}>
	recentStations: Array<{
		// Recent stations visited
		stationId: number // Unique identifier for the station
		stationCode: string // Code/identifier for the station
		stationType: string // Type of station
		latitude: number // Latitude coordinate
		longitude: number // Longitude coordinate
	}>
}

// Contractor summary data for detailed contractor information
export interface ContractorSummary {
	contractor: {
		// Contractor details
		contractorId: number // Unique identifier for the contractor
		contractorName: string // Name of the contractor
		contractType: string // Type of contract
		status: string // Current status
		sponsoringState: string // Sponsoring country/state
		contractualYear: number // Year when contract was established
		contractDuration: number // Duration of contract in years
	}
	summary: {
		// Summary statistics
		totalAreas: number // Total number of areas
		totalBlocks: number // Total number of blocks
		totalAreaKm2: number // Total area size in square kilometers
		totalCruises: number // Total number of cruises
		totalStations: number // Total number of stations
		totalSamples: number // Total number of samples
		earliestCruise: string // Date of earliest cruise
		latestCruise: string // Date of latest cruise
		expeditionDays: number // Total days of expedition
	}
	areas: Array<{
		// Area summaries
		areaId: number // Unique identifier for the area
		areaName: string // Display name for the area
		totalAreaSizeKm2: number // Total size in square kilometers
		blockCount: number // Number of blocks in this area
	}>
}
