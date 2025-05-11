// frontend/src/contexts/filterContext/useFilterSelection.ts
import { useState, useCallback } from 'react' // Import React hooks
import { Station } from '../../../types/filter-types' // Import Station type definition
import { FilterStateResult, FilterDataResult, FilterSelectionResult } from './types' // Import interface types

// Custom hook for managing selected map entities
// This hook is responsible for tracking which contractor, cruise, or station is selected
export const useFilterSelection = (
	filterState: FilterStateResult, // The filter state from useFilterState
	filterData: FilterDataResult // The filter data from useFilterData
): FilterSelectionResult => {
	const { setFilter, setUserHasSetView } = filterState // Extract functions from filter state

	// Selected items state
	const [selectedContractorId, setSelectedContractorId] = useState<number | null>(null) // ID of selected contractor
	const [selectedCruiseId, setSelectedCruiseId] = useState<number | null>(null) // ID of selected cruise
	const [selectedStation, setSelectedStation] = useState<Station | null>(null) // Selected station object

	// Enhanced contractor selection handler that updates both selection and filters
	// This connects contractor selection to the filter system
	const handleContractorSelect = useCallback(
		(contractorId: number | null) => {
			// Update the filter - this affects the filtering system
			if (contractorId === null) {
				// Remove filter when null is passed (deselection)
				setFilter('contractorId', null)
			} else {
				// Set filter when valid ID is passed (selection)
				setFilter('contractorId', contractorId)
			}

			// Update the selected contractor ID - this tracks selection state
			setSelectedContractorId(contractorId)

			// Always reset userHasSetView to allow the smart zoom to work
			// This is important so the map can automatically zoom to show the contractor area
			setUserHasSetView(false)

			console.log(`Contractor selection changed to: ${contractorId}, enabling smart zoom`)
		},
		[setFilter, setSelectedContractorId, setUserHasSetView] // Dependencies - recreate when these change
	)

	// Return all state and functions needed for selection management
	return {
		selectedContractorId,
		setSelectedContractorId,
		selectedCruiseId,
		setSelectedCruiseId,
		selectedStation,
		setSelectedStation,
		handleContractorSelect, // Include the enhanced contractor selection handler
	}
}
