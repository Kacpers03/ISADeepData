// frontend/src/utils/dataModels.ts
// Defines data models that match the backend structure and are used throughout the application

export interface Contractor {
	contractorId: number // Unique identifier for the contractor
	contractorName: string // Name of the contractor/company
	contractType?: string // Type of contract (e.g., "Exploration", "Extraction")
	contractTypeId?: number // Numeric ID for the contract type
	sponsoringState?: string // Country sponsoring/supporting the contract
	contractualYear?: number // Year the contract was established
	contractStatus?: string // Current status of the contract (e.g., "Active", "Terminated")
	contractStatusId?: number // Numeric ID for the contract status
	contractNumber?: string // Unique contract number/reference
	remarks?: string // General remarks about the contractor/contract
	areas?: Area[] // List of geographic areas assigned to this contractor
	cruises?: Cruise[] // List of research cruises conducted by the contractor
	libraries?: Library[] // List of documents in the library related to this contractor
}

export interface Area {
	areaId: number // Unique identifier for the area
	areaName: string // Name of the area
	areaDescription?: string // Description of the area
	contractorId: number // ID of the contractor authorized in this area
	centerLatitude?: number // Center point (latitude) of the area
	centerLongitude?: number // Center point (longitude) of the area
	totalAreaSizeKm2?: number // Total size of the area in square kilometers
	geoJsonBoundary?: string // GeoJSON string defining the area boundaries
	allocationDate?: string // Date the area was allocated to the contractor
	expiryDate?: string // Date the authorization for the area expires
	blocks?: Block[] // List of blocks within this area
}

export interface Block {
	blockId: number // Unique identifier for the block
	blockName: string // Name or code of the block
	blockDescription?: string // Description of the block
	areaId: number // ID of the area the block belongs to
	status?: string // Current status of the block (e.g., "Active", "Under Assessment")
	geoJsonBoundary?: string // GeoJSON string defining the block boundaries
	centerLatitude?: number // Center point (latitude) of the block
	centerLongitude?: number // Center point (longitude) of the block
	areaSizeKm2?: number // Size of the block in square kilometers
	category?: string // Classification or category of the block
}

export interface Cruise {
	cruiseId: number // Unique identifier for the cruise
	cruiseName?: string // Name of the research cruise
	contractorId: number // ID of the contractor conducting the cruise
	researchVessel?: string // Name of the research vessel used
	startDate?: string // Start date of the cruise
	endDate?: string // End date of the cruise
	centerLatitude?: number // Center point (latitude) of the cruise area
	centerLongitude?: number // Center point (longitude) of the cruise area
	stations?: Station[] // List of research stations visited during the cruise
}

export interface Station {
	stationId: number // Unique identifier for the station
	stationCode?: string // Code or reference for the station
	stationType?: string // Type of station (e.g., "CTD", "Coring", "Sampling")
	cruiseId: number // ID of the cruise the station belongs to
	latitude: number // Latitude of the station position
	longitude: number // Longitude of the station position
	samples?: Sample[] // List of samples collected at this station
	ctdDataSet?: CTDData[] // List of CTD data measured at this station
}

export interface Sample {
	sampleId: number // Unique identifier for the sample
	sampleCode?: string // Code or reference for the sample
	sampleType?: string // Type of sample (e.g., "Sediment", "Water", "Biota")
	stationId: number // ID of the station where the sample was taken
	matrixType?: string // Sample matrix type (e.g., "Silt", "Sand", "Clay")
	habitatType?: string // Habitat type where the sample was taken
	samplingDevice?: string // Equipment used for sampling (e.g., "Grabbing", "Coring")
	depthLower?: number // Lower depth for sampling (m)
	depthUpper?: number // Upper depth for sampling (m)
	sampleDescription?: string // Description of the sample
	analysis?: string // Type of analysis performed on the sample
	result?: number // Numeric analysis value
	unit?: string // Measurement unit for the analysis value
	envResults?: EnvResult[] // List of environmental analysis results for this sample
	geoResults?: GeoResult[] // List of geological analysis results for this sample
	photoVideos?: PhotoVideo[] // List of photo/video documentation of the sample
}

export interface EnvResult {
	envResultId: number // Unique identifier for the environmental result
	sampleId: number // ID of the sample the result belongs to
	analysisCategory?: string // Category of the analysis (e.g., "Metals", "PAH", "PCB")
	analysisName?: string // Specific analysis performed
	analysisValue?: number // Value from the analysis
	units?: string // Measurement unit for the analysis value
	remarks?: string // Remarks about the analysis or result
}

export interface GeoResult {
	geoResultId: number // Unique identifier for the geological result
	sampleId: number // ID of the sample the result belongs to
	category?: string // Geological category (e.g., "Mineralogy", "Grain Size")
	analysis?: string // Specific analysis performed
	value?: number // Value from the analysis
	units?: string // Measurement unit for the value
	qualifier?: string // Qualifier for the value (e.g., "<", ">", "~")
	remarks?: string // Remarks about the analysis or result
}

export interface CTDData {
	ctdId: number // Unique identifier for the CTD dataset
	stationId: number // ID of the station where the data was collected
	depthM?: number // Depth where the measurement was taken (meters)
	temperatureC?: number // Temperature (degrees Celsius)
	salinity?: number // Salinity (practical salinity units)
	oxygen?: number // Dissolved oxygen (mg/L or other unit)
	ph?: number // pH value
	measurementTime?: string // Time of the measurement
}

export interface PhotoVideo {
	mediaId: number // Unique identifier for the media file
	sampleId: number // ID of the sample the media is related to
	fileName?: string // File name for the photo or video
	mediaType?: string // Type of media (e.g., "Photo", "Video")
	cameraSpecs?: string // Camera specifications used for the recording
	captureDate?: string // Date and time of the recording
	remarks?: string // Remarks about the media file
}

export interface Library {
	libraryId: number // Unique identifier for the library entry
	contractorId: number // ID of the contractor the document belongs to
	theme?: string // Theme or category for the document
	fileName?: string // File name of the stored document
	title?: string // Title of the document
	description?: string // Description of the document
	year?: number // Publication year
	country?: string // Relevant country for the document
	submissionDate?: string // Date the document was submitted
	isConfidential?: boolean // Flag indicating if the document is confidential
}

export interface MapData {
	contractors: Contractor[] // List of all contractors with associated data
	cruises: Cruise[] // List of all cruises with associated data
}
