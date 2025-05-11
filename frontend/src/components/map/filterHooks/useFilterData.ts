// frontend/src/components/map/filterHooks/useFilterData.ts
// This custom hook provides data filtering functionality for the map component
// It handles loading filter options, fetching map data, and applying filters to existing data
// It's structured to maintain both original and filtered map data states

import { useState, useEffect, useCallback } from 'react' // React hooks for state management
import { MapData, FilterOptions } from '../../../types/filter-types' // Types for map data and filter options
import { apiService } from '../../../services/api-service' // Service for API requests
import { isPointInLocation, getLocationBoundaryById } from '../../../constants/locationBoundaries' // Utility functions for location filtering
import { FilterStateResult, FilterDataResult } from './types' // Hook-specific type interfaces

export const useFilterData = (filterState: FilterStateResult): FilterDataResult => {
	// Destructuring filter state from props
	const { filters, resetFilters } = filterState

	// Options for filter dropdowns - loaded from API once
	const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)

	// Map data states - both current filtered view and original unfiltered data
	const [mapData, setMapData] = useState<MapData | null>(null) // Current filtered map data to display
	const [originalMapData, setOriginalMapData] = useState<MapData | null>(null) // Original unfiltered data for cached filtering

	// Flag to track when initial data is loaded - prevents redundant loading
	const [initialDataLoaded, setInitialDataLoaded] = useState<boolean>(false)

	// UI state for loading indicators and error messages
	const [loading, setLoading] = useState<boolean>(false) // Loading state for UI indicators
	const [error, setError] = useState<string | null>(null) // Error state for displaying error messages

	// Helper to ensure map data updates are reactive by creating a new object reference
	const updateMapData = useCallback((newData: MapData) => {
		// Create a new copy to ensure React detects the change in object reference
		setMapData({ ...newData })
	}, [])

	// Load filter options on mount - this data stays constant throughout component lifecycle
	useEffect(() => {
		const loadFilterOptions = async () => {
			try {
				const options = await apiService.getFilterOptions() // Fetch filter options from API
				setFilterOptions(options) // Set options for filter dropdown UI components
			} catch (err) {
				console.error('Failed to load filter options:', err)
				setError('Failed to load filter options. Please try refreshing the page.') // User-friendly error message
			}
		}

		loadFilterOptions() // Execute on component mount
	}, []) // Empty dependency array means this only runs once on mount

	// Diagnostic logging effect - logs map data structure for debugging
	useEffect(() => {
		if (mapData) {
			console.log('Current MapData structure:', {
				contractorsCount: mapData.contractors?.length || 0,
				cruisesCount: mapData.cruises?.length || 0,
				cruisesWithStations: mapData.cruises?.filter(c => c.stations && c.stations.length > 0).length || 0,
				totalStations: mapData.cruises?.reduce((acc, c) => acc + (c.stations?.length || 0), 0) || 0,
			})
		}
	}, [mapData]) // Runs whenever mapData changes

	// Main function to fetch complete fresh data from the API
	const refreshData = useCallback(async () => {
		try {
			setLoading(true) // Set loading state for UI indicators
			setError(null) // Clear any previous errors

			// Prepare filter params (don't include view bounds for regular filtering)
			const apiFilters = { ...filters }

			// Fix Issue #1: Map mineralTypeId to contractTypeId for API call
			// This handles a mismatch between frontend and backend naming conventions
			if (apiFilters.mineralTypeId) {
				apiFilters.contractTypeId = apiFilters.mineralTypeId
				delete apiFilters.mineralTypeId
			}

			console.log('Fetching fresh map data with filters:', apiFilters)
			const data = await apiService.getMapData(apiFilters) // API call to get map data

			// Diagnostic logging to verify received data structure
			console.log('Received data with:', {
				contractors: data?.contractors?.length || 0,
				cruises: data?.cruises?.length || 0,
				stations: data?.cruises?.flatMap(c => c.stations || []).length || 0,
			})

			// Safety check - make sure data is in expected format
			if (data && typeof data === 'object') {
				// Ensure arrays exist even if API returns null/undefined
				if (!data.contractors) data.contractors = []
				if (!data.cruises) data.cruises = []

				// If this is a complete data load (no filters), save it as the original reference data
				if (Object.keys(filters).length === 0) {
					console.log('Saving as original data')
					setOriginalMapData(data) // Save unfiltered data as reference for future client-side filtering
				}

				// Always set as current map data to update the view
				updateMapData(data)

				// Signal that initial data is loaded - prevents redundant loading
				setInitialDataLoaded(true)
			} else {
				// Handle unexpected data format
				console.error('Received invalid data format:', data)
				setError('Received invalid data from server')
			}
		} catch (err) {
			// Handle API errors
			console.error('Failed to load map data:', err)
			setError('Failed to load map data. Please try again later.')

			// Make sure mapData isn't left in an inconsistent state
			updateMapData({ contractors: [], cruises: [] }) // Empty but valid data structure
		} finally {
			setLoading(false) // Always clear loading state when finished
		}
	}, [filters, updateMapData]) // Depends on current filters and updateMapData function

	// Complex function that filters existing data client-side without making new API requests
	const filterExistingData = useCallback(() => {
		if (!originalMapData) {
			console.log('No original data available for filtering')
			return
		}

		console.log('Filtering existing data with:', filters)

		try {
			// Create deep copies to avoid reference issues and prevent mutating original data
			const filteredData = {
				contractors: JSON.parse(JSON.stringify(originalMapData.contractors)),
				cruises: JSON.parse(JSON.stringify(originalMapData.cruises)),
			}

			// Check if contractor filter is active - this is important for relationship logic
			const contractorIdSpecified = !!filters.contractorId

			// STEP 1: Filter contractors based on ALL applied filters simultaneously
			let filteredContractors = [...filteredData.contractors]

			// Filter by contractor ID if specified
			if (contractorIdSpecified) {
				console.log(`Filtering by contractorId: ${filters.contractorId}`)
				filteredContractors = filteredContractors.filter(c => c.contractorId === filters.contractorId)
			}

			// Filter by mineral/contract type if specified
			if (filters.mineralTypeId && filterOptions) {
				const selectedContractType = filterOptions.contractTypes.find(
					type => type.contractTypeId === filters.mineralTypeId
				)

				if (selectedContractType) {
					console.log(`Filtering by mineralType: ${selectedContractType.contractTypeName}`)
					filteredContractors = filteredContractors.filter(
						c => c.contractType === selectedContractType.contractTypeName
					)
				}
			}

			// Filter by contract status if specified
			if (filters.contractStatusId && filterOptions) {
				console.log(`Filtering by contractStatusId: ${filters.contractStatusId}`)
				const selectedStatus = filterOptions.contractStatuses.find(
					status => status.contractStatusId === filters.contractStatusId
				)

				if (selectedStatus) {
					filteredContractors = filteredContractors.filter(c => c.contractStatus === selectedStatus.contractStatusName)
				}
			}

			// Filter by sponsoring state if specified
			if (filters.sponsoringState) {
				console.log(`Filtering by sponsoringState: ${filters.sponsoringState}`)
				filteredContractors = filteredContractors.filter(c => c.sponsoringState === filters.sponsoringState)
			}

			// Filter by year if specified
			if (filters.year) {
				console.log(`Filtering by year: ${filters.year}`)
				filteredContractors = filteredContractors.filter(c => c.contractualYear === filters.year)
			}

			// Filter by geographic location if specified
			if (filters.locationId && filters.locationId !== 'all') {
				console.log(`Filtering by locationId: ${filters.locationId}`)

				// Get the location boundary from constants
				const locationBoundary = getLocationBoundaryById(filters.locationId)

				if (locationBoundary) {
					console.log(`Found location boundary: ${locationBoundary.name}`)

					// Filter contractors that have areas within this location boundary
					filteredContractors = filteredContractors.filter(contractor => {
						// Check if any of the contractor's areas are within the location boundary
						return (
							contractor.areas?.some(area => {
								// If we have center coordinates for the area, use those
								if (area.centerLatitude !== undefined && area.centerLongitude !== undefined) {
									return isPointInLocation(area.centerLatitude, area.centerLongitude, filters.locationId!)
								}

								// If we have blocks with coordinates, check those
								if (area.blocks && area.blocks.length > 0) {
									return area.blocks.some(block => {
										if (block.centerLatitude !== undefined && block.centerLongitude !== undefined) {
											return isPointInLocation(block.centerLatitude, block.centerLongitude, filters.locationId!)
										}
										return false
									})
								}

								return false
							}) || false
						)
					})

					console.log(`Filtered to ${filteredContractors.length} contractors in location ${locationBoundary.name}`)
				}
			}

			// Update the filtered contractors in the result
			filteredData.contractors = filteredContractors

			// STEP 2: CRITICAL FIX - Handle cruises based on contractor filter
			// This maintains proper parent-child relationships in the data
			if (contractorIdSpecified) {
				// ALWAYS keep ALL cruises for the selected contractor, regardless of other filters
				filteredData.cruises = originalMapData.cruises.filter(cruise => cruise.contractorId === filters.contractorId)
				console.log(`Keeping all ${filteredData.cruises.length} cruises for contractor ${filters.contractorId}`)
			} else {
				// For other filter combinations, filter cruises based on filtered contractors
				// This maintains the parent-child relationship between contractors and cruises
				const filteredContractorIds = new Set(filteredContractors.map(c => c.contractorId))
				filteredData.cruises = filteredData.cruises.filter(cruise => filteredContractorIds.has(cruise.contractorId))
			}

			// IMPORTANT FIX: If specific cruise is selected, make sure to include it no matter what
			// This ensures the selected cruise remains visible even with active filters
			if (filters.cruiseId) {
				console.log(`Ensuring selected cruiseId: ${filters.cruiseId} remains visible`)

				// Find the selected cruise from original data
				const selectedCruise = originalMapData.cruises.find(c => c.cruiseId === filters.cruiseId)

				if (selectedCruise) {
					// Check if it's already in the filtered results
					const alreadyIncluded = filteredData.cruises.some(c => c.cruiseId === filters.cruiseId)

					if (!alreadyIncluded) {
						console.log(`Adding selected cruise back to filtered results`)
						// If it's not already included, add it
						filteredData.cruises.push(selectedCruise)

						// Also make sure its contractor is included for data consistency
						if (!filteredContractors.some(c => c.contractorId === selectedCruise.contractorId)) {
							const cruiseContractor = originalMapData.contractors.find(
								c => c.contractorId === selectedCruise.contractorId
							)

							if (cruiseContractor) {
								console.log(`Adding cruise's contractor back to filtered results`)
								filteredData.contractors.push(cruiseContractor)
							}
						}
					}
				}
			}

			// Apply location filter to cruises if needed (only if no contractor is selected)
			// This handles geo-filtering for cruises independently
			if (filters.locationId && filters.locationId !== 'all' && !contractorIdSpecified) {
				const locationBoundary = getLocationBoundaryById(filters.locationId)

				if (locationBoundary) {
					// Keep track of the selected cruise ID to make sure it's retained
					let selectedCruise = null
					if (filters.cruiseId) {
						selectedCruise = filteredData.cruises.find(c => c.cruiseId === filters.cruiseId)
					}

					// Filter cruises by location with multiple strategies for coordinate checking
					filteredData.cruises = filteredData.cruises.filter(cruise => {
						// Always keep the selected cruise
						if (filters.cruiseId && cruise.cruiseId === filters.cruiseId) {
							return true
						}

						// If the cruise has stations, check if any of them are within the location
						if (cruise.stations && cruise.stations.length > 0) {
							return cruise.stations.some(station =>
								isPointInLocation(station.latitude, station.longitude, filters.locationId!)
							)
						}

						// If no stations but has center coordinates, use those
						if (cruise.centerLatitude !== undefined && cruise.centerLongitude !== undefined) {
							return isPointInLocation(cruise.centerLatitude, cruise.centerLongitude, filters.locationId!)
						}

						return false
					})

					// If we have a selected cruise, ensure it's in the results
					if (selectedCruise && !filteredData.cruises.some(c => c.cruiseId === filters.cruiseId)) {
						filteredData.cruises.push(selectedCruise)
					}

					console.log(`Filtered to ${filteredData.cruises.length} cruises in location ${locationBoundary.name}`)
				}
			}

			// Log and set the resulting filtered data
			console.log('Filtered data results:', {
				contractors: filteredData.contractors.length,
				cruises: filteredData.cruises.length,
				stations: filteredData.cruises.flatMap(c => c.stations || []).length,
			})

			// Update the map data with filtered results
			updateMapData(filteredData)
		} catch (error) {
			console.error('Error during filtering:', error)
			// On error, use original data to avoid showing empty data
			if (originalMapData) {
				updateMapData(originalMapData)
			}
		}
	}, [filters, filterOptions, originalMapData, updateMapData]) // Depends on filters, options, and original data

	// Enhanced resetFilters function that handles both state and data
	const enhancedResetFilters = useCallback(() => {
		// Use basic reset from filterState first
		resetFilters()

		// Restore original data if available
		if (originalMapData) {
			console.log('Restoring original data from cache')
			updateMapData(originalMapData)
		} else {
			// If no original data exists, fetch fresh data
			console.log('No original data cached, fetching fresh data')
			refreshData()
		}
	}, [originalMapData, refreshData, resetFilters, updateMapData]) // Depends on data state and functions

	// Main data loading logic - runs once to load initial data
	useEffect(() => {
		const loadInitialData = async () => {
			if (!initialDataLoaded) {
				console.log('Initial load - fetching data')
				await refreshData()
			}
		}

		loadInitialData()
	}, [initialDataLoaded, refreshData]) // Only depends on initialDataLoaded flag and refreshData function

	// Separate effect for handling filter changes after initial data is loaded
	useEffect(() => {
		// Skip on initial load before we have data
		if (!initialDataLoaded || !originalMapData) {
			return
		}

		if (Object.keys(filters).length > 0) {
			console.log('Filters changed, applying filters to data')
			filterExistingData() // Apply client-side filtering for performance
		} else {
			console.log('No filters active, restoring original data')
			// IMPORTANT: Only update if mapData is not already originalMapData
			// This prevents the infinite loop of updates
			if (mapData !== originalMapData) {
				updateMapData(originalMapData)
			}
		}
	}, [filters, initialDataLoaded, originalMapData, filterExistingData, mapData, updateMapData]) // Runs when filters or data change

	// Return all the data and functions needed by the parent component
	return {
		filterOptions, // Options for filter UI components
		mapData, // Current filtered data for display
		originalMapData, // Original unfiltered data for reference
		loading, // Loading state for UI indicators
		error, // Error state for error messages
		refreshData, // Function to fetch fresh data from API
		filterExistingData, // Function to filter existing data client-side
		updateMapData, // Function to update map data safely
		initialDataLoaded, // Flag for tracking initial data load
	}
}
