// frontend/src/contexts/filterContext/useFilterState.ts
import { useState, useCallback } from 'react' // Import React hooks
import { MapFilterParams } from '../../../types/filter-types' // Import filter parameters type
import { FilterStateResult } from './types' // Import result interface

// Custom hook for managing basic filter state
// This hook is responsible for the core filter state management
export const useFilterState = (): FilterStateResult => {
	// Filter state - stores all active filter criteria
	const [filters, setFilters] = useState<MapFilterParams>({}) // Initialize with empty filters object

	// Tracks whether the user has manually set the map view
	// This is used to determine if smart zoom should be applied
	const [userHasSetView, setUserHasSetView] = useState<boolean>(false)

	// Map view state - tracks the current boundaries of the map view
	const [viewBounds, setViewBounds] = useState<{
		minLat: number // Minimum latitude (southern boundary)
		maxLat: number // Maximum latitude (northern boundary)
		minLon: number // Minimum longitude (western boundary)
		maxLon: number // Maximum longitude (eastern boundary)
	} | null>(null) // Initialize as null (no boundaries set)

	// Improved set filter function - optimized to handle "All" selections efficiently
	// This handles the logic for updating individual filters
	const setFilter = useCallback((key: keyof MapFilterParams, value: any) => {
		try {
			console.log(`Setting filter: ${key} = ${value}`) // Log for debugging

			setFilters(prev => {
				const newFilters = { ...prev } // Create a copy of the current filters

				// Handle "All" selection specially - these values mean "no filter"
				if (value === undefined || value === null || value === '' || value === 'all') {
					console.log(`Removing filter: ${key}`)
					delete newFilters[key] // Remove the filter entirely
					// This is more efficient than setting it to a default value
				} else {
					// Special case: if we're already filtering on this key and it's the only active filter,
					// we should allow changing it directly without requiring a reset
					if (prev[key] !== undefined && Object.keys(prev).length === 1) {
						console.log(`Switching value for single filter ${key} from ${prev[key]} to ${value}`)
						// For single filter case, update directly - this allows switching between options
						newFilters[key] = value
					} else {
						// Multi-filter case or adding a new filter - set the new filter value normally
						newFilters[key] = value
					}
				}

				console.log(`Updated filters:`, newFilters) // Log updated filters for debugging
				return newFilters
			})
		} catch (error) {
			console.error('Error setting filter:', error) // Log errors for debugging
		}
	}, []) // No dependencies - this function never needs to be recreated

	// Reset filters function (basic version)
	// Note: This is enhanced in useFilterData to also reset the data
	const resetFilters = useCallback(() => {
		console.log('Resetting all filters')
		setFilters({}) // Set filters back to empty object - no active filters
	}, []) // No dependencies - this function never needs to be recreated

	// Return all state and functions needed for filter state management
	return {
		filters,
		setFilter,
		resetFilters,
		userHasSetView,
		setUserHasSetView,
		viewBounds,
		setViewBounds,
	}
}
