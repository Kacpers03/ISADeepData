// frontend/src/contexts/filterContext/index.tsx
import React, { createContext, useContext, ReactNode, useMemo } from 'react' // Import React and context utilities
import { FilterContextValue } from '../filterHooks/types' // Import type definition for context value
import { useFilterState } from '../filterHooks/useFilterState' // Import hook for managing filter state
import { useFilterData } from '../filterHooks/useFilterData' // Import hook for fetching and managing filter data
import { useFilterSelection } from '../filterHooks/useFilterSelection' // Import hook for managing selection state
import { useFilterPanel } from '../filterHooks/useFilterPanel' // Import hook for managing panel display state
import { useCallback } from 'react' // Import useCallback for memoizing functions

// Create a context for filter-related state and functions
const FilterContext = createContext<FilterContextValue | undefined>(undefined)

// Provider component that wraps parts of the app that need access to filter context
export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	// Get the various pieces of state and functionality from custom hooks
	const filterState = useFilterState() // Basic filter criteria state (e.g. contractor, material types)
	const filterData = useFilterData(filterState) // Data fetching and processing based on filters
	const selectionState = useFilterSelection(filterState, filterData) // Selected items state (e.g. selected contractor)
	const panelState = useFilterPanel() // UI panel state for detail views

	// Create an enhanced reset function that combines all reset actions
	// This is memoized to prevent recreation on each render
	const combinedResetFilters = useCallback(() => {
		console.log('Performing complete reset of filters and state')

		// Clear filters (basic reset from filterState)
		filterState.resetFilters()

		// Reset selection states - clear all selections
		selectionState.setSelectedContractorId(null)
		selectionState.setSelectedCruiseId(null)
		selectionState.setSelectedStation(null)

		// Reset panel states - hide and clear all panels
		panelState.setShowDetailPanel(false)
		panelState.setDetailPanelType(null)
		panelState.setContractorSummary(null)
		panelState.setBlockAnalytics(null)

		// Restore original data if available - use cached data first for performance
		if (filterData.originalMapData) {
			console.log('Restoring original data from cache')
			filterData.updateMapData(filterData.originalMapData)
		} else {
			// If no original data exists, fetch fresh data
			console.log('No original data cached, fetching fresh data')
			filterData.refreshData()
		}

		// Note: The map component will handle zooming after reset
	}, [filterState, selectionState, panelState, filterData]) // Dependencies for the callback

	// Combine all the pieces into one context value
	// This is memoized to prevent unnecessary re-renders of consuming components
	const contextValue: FilterContextValue = useMemo(
		() => ({
			// Filter state - basic filtering criteria
			filters: filterState.filters, // Current filter values
			setFilter: filterState.setFilter, // Function to update a specific filter
			resetFilters: combinedResetFilters, // Use our enhanced reset function
			userHasSetView: filterState.userHasSetView, // Flag for if user manually changed the map view
			setUserHasSetView: filterState.setUserHasSetView, // Function to update user view flag
			handleContractorSelect: selectionState.handleContractorSelect, // Function to handle contractor selection

			// Options for filter dropdowns - available choices
			filterOptions: filterData.filterOptions, // Options for dropdown filters

			// Map data - the actual data displayed on the map
			mapData: filterData.mapData, // Currently filtered map data
			originalMapData: filterData.originalMapData, // Original unfiltered map data (for reset)

			// Map view state - controls the map boundaries
			viewBounds: filterState.viewBounds, // Current map view boundaries
			setViewBounds: filterState.setViewBounds, // Function to update map boundaries

			// UI state - loading and error indicators
			loading: filterData.loading, // Loading state indicator
			error: filterData.error, // Error state for data fetching

			// Selected items - currently selected entities
			selectedContractorId: selectionState.selectedContractorId, // Currently selected contractor ID
			setSelectedContractorId: selectionState.setSelectedContractorId, // Function to select a contractor
			selectedCruiseId: selectionState.selectedCruiseId, // Currently selected cruise ID
			setSelectedCruiseId: selectionState.setSelectedCruiseId, // Function to select a cruise
			selectedStation: selectionState.selectedStation, // Currently selected station
			setSelectedStation: selectionState.setSelectedStation, // Function to select a station

			// Detail panel state - controls the detail panel UI
			showDetailPanel: panelState.showDetailPanel, // Whether to show the detail panel
			setShowDetailPanel: panelState.setShowDetailPanel, // Function to toggle detail panel
			detailPanelType: panelState.detailPanelType, // Type of content in detail panel
			setDetailPanelType: panelState.setDetailPanelType, // Function to set detail panel content type

			// Analytics data - summary data for display
			contractorSummary: panelState.contractorSummary, // Summary data for contractor
			setContractorSummary: panelState.setContractorSummary, // Function to update contractor summary
			blockAnalytics: panelState.blockAnalytics, // Analytics for a specific block
			setBlockAnalytics: panelState.setBlockAnalytics, // Function to update block analytics

			// Map actions - functions to manipulate the map
			refreshData: filterData.refreshData, // Function to refresh map data from API
		}),
		[filterState, filterData, selectionState, panelState, combinedResetFilters] // Dependencies for the memo
	)

	// Provide the context value to children components
	return <FilterContext.Provider value={contextValue}>{children}</FilterContext.Provider>
}

// Custom hook to use the filter context
// This simplifies accessing the context in components
export const useFilter = (): FilterContextValue => {
	const context = useContext(FilterContext) // Get the context value

	// Throw an error if used outside of a provider
	if (!context) {
		throw new Error('useFilter must be used within a FilterProvider')
	}

	return context // Return the context value
}
