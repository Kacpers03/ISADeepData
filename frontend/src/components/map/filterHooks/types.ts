// frontend/src/contexts/filterContext/types.ts
import {
	MapFilterParams,
	FilterOptions,
	MapData,
	Station,
	BlockAnalytics,
	ContractorSummary,
} from '../../types/filter-types' // Import shared type definitions

// Main interface for the filter context value - this defines the complete API of the filter context
export interface FilterContextValue {
	// Filter state - basic filter parameters and operations
	filters: MapFilterParams // Current filter criteria (contract type, year, location, etc.)
	setFilter: (key: keyof MapFilterParams, value: any) => void // Function to set a specific filter
	resetFilters: () => void // Function to reset all filters
	userHasSetView?: boolean // Flag indicating if user has manually set the map view
	setUserHasSetView?: (value: boolean) => void // Function to update the userHasSetView flag
	handleContractorSelect?: (contractorId: number | null) => void // Function to handle contractor selection with side effects

	// Options for filter dropdowns - available choices for filters
	filterOptions: FilterOptions | null // Available options for filter dropdowns (contractors, years, etc.)

	// Map data - core data structures for the map
	mapData: MapData | null // Current filtered map data to display
	originalMapData: MapData | null // Original unfiltered map data (for resetting)

	// Map view state - controls the visible area of the map
	viewBounds: { minLat: number; maxLat: number; minLon: number; maxLon: number } | null // Current map view boundaries
	setViewBounds: (bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number }) => void // Function to update view bounds

	// UI state - loading and error indicators
	loading: boolean // Whether data is currently loading
	error: string | null // Error message if data loading failed

	// Selected items - currently selected entities on the map
	selectedContractorId: number | null // ID of selected contractor
	setSelectedContractorId: (id: number | null) => void // Function to select a contractor
	selectedCruiseId: number | null // ID of selected cruise
	setSelectedCruiseId: (id: number | null) => void // Function to select a cruise
	selectedStation: Station | null // Currently selected station
	setSelectedStation: (station: Station | null) => void // Function to select a station

	// Detail panel state - controls the detail panel UI
	showDetailPanel: boolean // Whether to show the detail panel
	setShowDetailPanel: (show: boolean) => void // Function to toggle detail panel
	detailPanelType: 'contractor' | 'cruise' | 'station' | 'blockAnalytics' | 'contractorSummary' | null // Type of content in detail panel
	setDetailPanelType: (
		type: 'contractor' | 'cruise' | 'station' | 'blockAnalytics' | 'contractorSummary' | null
	) => void // Function to set detail panel content type

	// Analytics data - summary data for display
	contractorSummary: ContractorSummary | null // Summary data for contractor
	setContractorSummary: (summary: ContractorSummary | null) => void // Function to update contractor summary
	blockAnalytics: BlockAnalytics | null // Analytics for a specific block
	setBlockAnalytics: (analytics: BlockAnalytics | null) => void // Function to update block analytics

	// Map actions - functions to manipulate the map
	refreshData: () => void // Function to refresh map data from API
}

// Interface for filter state hook result - manages basic filter parameters
export interface FilterStateResult {
	filters: MapFilterParams // Current filter values
	setFilter: (key: keyof MapFilterParams, value: any) => void // Function to update a filter
	resetFilters: () => void // Function to reset all filters
	userHasSetView: boolean // Whether user has manually set the map view
	setUserHasSetView: (value: boolean) => void // Function to update user view state
	viewBounds: { minLat: number; maxLat: number; minLon: number; maxLon: number } | null // Current map view boundaries
	setViewBounds: (bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number }) => void // Function to set view boundaries
}

// Interface for filter data hook result - manages data fetching and processing
export interface FilterDataResult {
	filterOptions: FilterOptions | null // Available options for filter dropdowns
	mapData: MapData | null // Currently filtered map data
	originalMapData: MapData | null // Original unfiltered map data
	loading: boolean // Whether data is currently loading
	error: string | null // Error message if data loading failed
	refreshData: () => Promise<void> // Function to fetch fresh data from API
	filterExistingData: () => void // Function to filter existing data without API call
	updateMapData: (newData: MapData) => void // Function to update map data state
	initialDataLoaded: boolean // Whether initial data has been loaded
}

// Interface for filter selection hook result - manages selected entities
export interface FilterSelectionResult {
	selectedContractorId: number | null // ID of selected contractor
	setSelectedContractorId: (id: number | null) => void // Function to select contractor
	selectedCruiseId: number | null // ID of selected cruise
	setSelectedCruiseId: (id: number | null) => void // Function to select cruise
	selectedStation: Station | null // Selected station object
	setSelectedStation: (station: Station | null) => void // Function to select station
	handleContractorSelect: (contractorId: number | null) => void // Enhanced function to handle contractor selection
}

// Interface for filter panel hook result - manages detail panel UI
export interface FilterPanelResult {
	showDetailPanel: boolean // Whether to show the detail panel
	setShowDetailPanel: (show: boolean) => void // Function to toggle panel visibility
	detailPanelType: 'contractor' | 'cruise' | 'station' | 'blockAnalytics' | 'contractorSummary' | null // Type of panel content
	setDetailPanelType: (
		type: 'contractor' | 'cruise' | 'station' | 'blockAnalytics' | 'contractorSummary' | null
	) => void // Function to set panel type
	contractorSummary: ContractorSummary | null // Summary data for contractor
	setContractorSummary: (summary: ContractorSummary | null) => void // Function to update contractor summary
	blockAnalytics: BlockAnalytics | null // Analytics for a specific block
	setBlockAnalytics: (analytics: BlockAnalytics | null) => void // Function to update block analytics
}
