// frontend/src/contexts/filterContext/useFilterState.ts
import { useState, useCallback } from 'react'
import { MapFilterParams } from '../../../types/filter-types'
import { FilterStateResult } from './types'

export const useFilterState = (): FilterStateResult => {
	// Filter state
	const [filters, setFilters] = useState<MapFilterParams>({})
	const [userHasSetView, setUserHasSetView] = useState<boolean>(false)

	// Map view state
	const [viewBounds, setViewBounds] = useState<{
		minLat: number
		maxLat: number
		minLon: number
		maxLon: number
	} | null>(null)

	// Improved set filter function - optimized to handle "All" selections efficiently
	const setFilter = useCallback((key: keyof MapFilterParams, value: any) => {
		try {
			console.log(`Setting filter: ${key} = ${value}`)

			setFilters(prev => {
				const newFilters = { ...prev }

				// Handle "All" selection specially
				if (value === undefined || value === null || value === '' || value === 'all') {
					console.log(`Removing filter: ${key}`)
					delete newFilters[key]

					// No need to trigger full refresh when removing a filter
					// We'll let the effect handle this more efficiently
				} else {
					// If we're already filtering on this key and it's the only active filter,
					// we should allow changing it directly without requiring a reset
					if (prev[key] !== undefined && Object.keys(prev).length === 1) {
						console.log(`Switching value for single filter ${key} from ${prev[key]} to ${value}`)

						// For single filter case, we'll update directly - this allows switching between options
						newFilters[key] = value
					} else {
						// Multi-filter case or adding a new filter - set the new filter value normally
						newFilters[key] = value
					}
				}

				console.log(`Updated filters:`, newFilters)
				return newFilters
			})
		} catch (error) {
			console.error('Error setting filter:', error)
		}
	}, [])

	// Reset filters function (basic version, enhanced in useFilterData)
	const resetFilters = useCallback(() => {
		console.log('Resetting all filters')
		setFilters({})
	}, [])

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
