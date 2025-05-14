// frontend/src/components/map/filters/filterPanel.tsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react' // Import React and hooks
import { useFilter } from '../context/filterContext' // Import filter context for state management
import styles from '../../../styles/map/filter.module.css' // Import CSS module for component styling
import { CustomDropdown } from './CustomDropdown' // Import CustomDropdown component
import { locationBoundaries } from '../../../constants/locationBoundaries' // Import location data
import SearchPanel from './searchPanel' // Import SearchPanel component
import FilterOptions from './filterOptions' // Import FilterOptions component
import ResultsInfo from './resultInfo' // Import ResultsInfo component
import { downloadCSV } from '../../../utils/csvExport' // Import CSV export utility
import { useLanguage } from '../../../contexts/languageContext' // Import language context for translations

// Custom debounce function to limit how often filter changes are processed
// Prevents excessive state updates during rapid changes
const debounce = (func, wait) => {
	let timeout
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout)
			func(...args)
		}
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
	}
}

// Main filter panel component that assembles all filter UI components
export const ImprovedFilterPanel = () => {
	// Get filter context values and functions
	const {
		filters, // Current filter state
		setFilter, // Function to update individual filters
		resetFilters, // Function to reset all filters
		filterOptions, // Available filter options from API
		loading, // Loading state
		mapData, // Filtered map data
		originalMapData, // Original unfiltered map data
		viewBounds, // Current map view bounds
		setViewBounds, // Function to set map view bounds
		refreshData, // Function to refresh data from API
		selectedContractorId, // Currently selected contractor ID
		setSelectedContractorId, // Function to set selected contractor
		selectedCruiseId, // Currently selected cruise ID
		setSelectedCruiseId, // Function to set selected cruise
		handleContractorSelect, // Function to handle contractor selection with side effects
		setDetailPanelType, // Function to set detail panel type
		setShowDetailPanel, // Function to show/hide detail panel
	} = useFilter()

	const { t } = useLanguage() // Get translation function from language context

	// State for filtered dropdown options - these change based on other selected filters
	const [filteredContractors, setFilteredContractors] = useState([]) // Filtered contractor options
	const [filteredMineralTypes, setFilteredMineralTypes] = useState([]) // Filtered mineral type options
	const [filteredContractStatuses, setFilteredContractStatuses] = useState([]) // Filtered contract status options
	const [filteredSponsoringStates, setFilteredSponsoringStates] = useState([]) // Filtered sponsoring state options
	const [filteredYears, setFilteredYears] = useState([]) // Filtered year options

	// State for search functionality
	const [searchQuery, setSearchQuery] = useState('') // Current search query text
	const [searchResults, setSearchResults] = useState([]) // Search results array
	const [showResults, setShowResults] = useState(false) // Whether to show search results panel
	const [selectedSearchItem, setSelectedSearchItem] = useState(null) // Currently selected search result

	// Reference to keep track of previous filters for proper reset behavior
	const previousFiltersRef = useRef(null)

	// Count active filters - memoized for performance
	const activeFilterCount = useMemo(
		() => Object.keys(filters).filter(key => filters[key] !== undefined && filters[key] !== null).length,
		[filters]
	)

	// Count results if available - memoized for performance
	const contractorCount = useMemo(() => mapData?.contractors?.length || 0, [mapData]) // Count of contractors
	const cruiseCount = useMemo(() => mapData?.cruises?.length || 0, [mapData]) // Count of cruises
	const stationCount = useMemo(
		() => mapData?.cruises?.reduce((total, cruise) => total + (cruise.stations?.length || 0), 0) || 0, // Sum all stations across cruises
		[mapData]
	)

	// Update dropdown options whenever mapData, originalMapData, or filterOptions change
	useEffect(() => {
		if (!originalMapData || !filterOptions) return // Skip if data not loaded yet

		// Process the available options based on current data
		updateFilteredOptions()
	}, [originalMapData, filterOptions, mapData, filters]) // Dependencies for when to update

	// Store previous filters before reset for potential undo functionality
	useEffect(() => {
		previousFiltersRef.current = { ...filters }
	}, [filters])

	// This function updates all the dropdown options based on the original data
	// while highlighting which options are currently available based on other filters
	const updateFilteredOptions = useCallback(() => {
		if (!originalMapData || !filterOptions) return // Skip if data not loaded

		// Get the full set of data from originalMapData
		// and the filtered set from mapData
		const allContractors = originalMapData.contractors
		const filteredContractors = mapData?.contractors || []

		// Create sets to track what values are available in the filtered data
		const filteredMineralTypes = new Set() // Set of available mineral types
		const filteredContractStatuses = new Set() // Set of available contract statuses
		const filteredSponsoringStates = new Set() // Set of available sponsoring states
		const filteredYears = new Set() // Set of available years
		const filteredContractorIds = new Set() // Set of available contractor IDs

		// Collect all values that exist in the filtered data
		filteredContractors.forEach(contractor => {
			if (contractor.contractType) filteredMineralTypes.add(contractor.contractType) // Add mineral type if exists
			if (contractor.contractStatus) filteredContractStatuses.add(contractor.contractStatus) // Add contract status if exists
			if (contractor.sponsoringState) filteredSponsoringStates.add(contractor.sponsoringState) // Add sponsoring state if exists
			if (contractor.contractualYear) filteredYears.add(contractor.contractualYear) // Add year if exists
			filteredContractorIds.add(contractor.contractorId) // Always add contractor ID
		})

		// Get all possible values from the original data
		const allMineralTypes = new Set() // Set of all mineral types
		const allContractStatuses = new Set() // Set of all contract statuses
		const allSponsoringStates = new Set() // Set of all sponsoring states
		const allYears = new Set() // Set of all years

		allContractors.forEach(contractor => {
			if (contractor.contractType) allMineralTypes.add(contractor.contractType) // Add mineral type if exists
			if (contractor.contractStatus) allContractStatuses.add(contractor.contractStatus) // Add contract status if exists
			if (contractor.sponsoringState) allSponsoringStates.add(contractor.sponsoringState) // Add sponsoring state if exists
			if (contractor.contractualYear) allYears.add(contractor.contractualYear) // Add year if exists
		})

		// Count active filters to determine when we have a single filter
		const activeFilterCount = Object.keys(filters).filter(
			key => filters[key] !== undefined && filters[key] !== null
		).length

		// Check which filter types are currently active
		const isMineralTypeActive = filters.mineralTypeId !== undefined // Is mineral type filter active
		const isContractStatusActive = filters.contractStatusId !== undefined // Is contract status filter active
		const isSponsoringStateActive = filters.sponsoringState !== undefined // Is sponsoring state filter active
		const isYearActive = filters.year !== undefined // Is year filter active
		const isContractorActive = filters.contractorId !== undefined // Is contractor filter active

		// Update mineral types - if mineralTypeId is the only active filter, show all options
		if (filterOptions.contractTypes) {
			const updatedMineralTypes = filterOptions.contractTypes.map(type => {
				// If mineralTypeId is the only active filter, don't disable any options
				const shouldCheckAvailability = activeFilterCount > 1 || !isMineralTypeActive

				// Check if this mineral type exists in the filtered data (only if needed)
				const isAvailable = !shouldCheckAvailability || filteredMineralTypes.has(type.contractTypeName)

				return {
					value: type.contractTypeId.toString(),
					label: type.contractTypeName,
					disabled: !isAvailable, // Disable if not available in current filtered data
				}
			})
			setFilteredMineralTypes(updatedMineralTypes) // Update state with new options
		}

		// Update contract statuses - similar approach to mineral types
		if (filterOptions.contractStatuses) {
			const updatedContractStatuses = filterOptions.contractStatuses.map(status => {
				// If contractStatusId is the only active filter, don't disable any options
				const shouldCheckAvailability = activeFilterCount > 1 || !isContractStatusActive

				const isAvailable = !shouldCheckAvailability || filteredContractStatuses.has(status.contractStatusName)

				return {
					value: status.contractStatusId.toString(),
					label: status.contractStatusName,
					disabled: !isAvailable, // Disable if not available in current filtered data
				}
			})
			setFilteredContractStatuses(updatedContractStatuses) // Update state with new options
		}

		// Update sponsoring states
		if (filterOptions.sponsoringStates) {
			// If sponsoringState is the only active filter, don't disable any options
			const updatedSponsoringStates = filterOptions.sponsoringStates.map(state => {
				const shouldCheckAvailability = activeFilterCount > 1 || !isSponsoringStateActive

				const isAvailable = !shouldCheckAvailability || filteredSponsoringStates.has(state)

				return {
					value: state,
					label: state,
					disabled: !isAvailable, // Disable if not available in current filtered data
				}
			})
			setFilteredSponsoringStates(updatedSponsoringStates) // Update state with new options
		}

		// Update years options
		if (filterOptions.contractualYears) {
			const updatedYears = filterOptions.contractualYears.map(year => {
				// If year is the only active filter, don't disable any options
				const shouldCheckAvailability = activeFilterCount > 1 || !isYearActive

				const isAvailable = !shouldCheckAvailability || filteredYears.has(year)

				return {
					value: year.toString(),
					label: year.toString(),
					disabled: !isAvailable, // Disable if not available in current filtered data
				}
			})
			setFilteredYears(updatedYears) // Update state with new options
		}

		// Update contractor options from both datasets
		// First get all contractors from original data
		const contractorOptions = allContractors.map(contractor => {
			// If contractorId is the only active filter, don't disable any options
			const shouldCheckAvailability = activeFilterCount > 1 || !isContractorActive

			// Check if this contractor is in the filtered dataset
			const isAvailable = !shouldCheckAvailability || filteredContractorIds.has(contractor.contractorId)

			return {
				value: contractor.contractorId.toString(),
				label: contractor.contractorName,
				disabled: !isAvailable, // Disable if not available in current filtered data
			}
		})

		setFilteredContractors(contractorOptions) // Update state with new options
	}, [originalMapData, mapData, filterOptions, filters]) // Dependencies for recomputation

	// Handle select change with proper type conversion between string/number
	const handleSelectChange = useCallback(
		(key, value) => {
			if (value === 'all') {
				// When "All" is selected, just remove the filter
				setFilter(key, undefined)

				// If we're resetting the contractorId, also clear the selection
				if (key === 'contractorId') {
					// Use the context function if available, otherwise use the standard approach
					if (handleContractorSelect) {
						handleContractorSelect(null) // Clear selection with special handler
					} else {
						setSelectedContractorId(null) // Clear selection directly
					}
				}
			} else {
				// For number values - convert string values to numbers
				if (['mineralTypeId', 'contractStatusId', 'year', 'cruiseId'].includes(key)) {
					setFilter(key, parseInt(value, 10)) // Set filter with numeric value

					// Special handling for cruiseId to keep cruises visible
					if (key === 'cruiseId') {
						setSelectedCruiseId(parseInt(value, 10)) // Set selected cruise ID

						// Make sure cruises are visible and zoom to the selected cruise
						if (window.showCruiseDetails) {
							window.showCruiseDetails(parseInt(value, 10)) // Call global function
						}
					}
				}
				// Special handling for contractorId to enable smart zooming
				else if (key === 'contractorId') {
					const contractorId = parseInt(value, 10) // Convert to number
					setFilter(key, contractorId) // Set filter

					// Use the context function if available, otherwise use the standard approach
					if (handleContractorSelect) {
						handleContractorSelect(contractorId) // Use special handler
					} else {
						setSelectedContractorId(contractorId) // Set directly
					}
				}
				// For string values - keep as strings
				else {
					setFilter(key, value) // Set filter with string value
				}
			}
		},
		[setFilter, setSelectedContractorId, setSelectedCruiseId, handleContractorSelect] // Dependencies
	)

	// Debounced select change handler to prevent rapid state updates
	// Only processes changes after a short delay to improve performance
	const debouncedSelectChange = useMemo(
		() =>
			debounce((key, value) => {
				handleSelectChange(key, value)
			}, 300), // 300ms delay
		[handleSelectChange] // Recreate when handler changes
	)

	// Enhanced reset filters function that also clears selected search item
	const handleResetFilters = useCallback(() => {
		// Clear the selected search item
		setSelectedSearchItem(null)

		// Reset all filters using the context function
		resetFilters()
	}, [resetFilters]) // Dependency on resetFilters function

	// CSV export functionality
	const handleDownloadCSV = useCallback(() => {
		if (!mapData) return // Skip if no data
		// Use our CSV export utility
		downloadCSV(mapData, `exploration-data`) // Export data to CSV file
	}, [mapData]) // Dependency on mapData

	// If filter options aren't loaded yet, show loading state
	if (!filterOptions) {
		return <div className={styles.filterPanelLoading}>Loading filter options...</div>
	}

	// Format options for custom dropdowns with "All" option first
	const contractorOptions = [
		{ value: 'all', label: t('map.filter.allContractors') || 'All Contractors' }, // All option with translation
		...filteredContractors, // Spread in filtered contractor options
	]

	const mineralTypeOptions = [
		{ value: 'all', label: t('map.filter.allMineralTypes') || 'All Mineral Types' }, // All option with translation
		...filteredMineralTypes, // Spread in filtered mineral type options
	]

	const contractStatusOptions = [
		{ value: 'all', label: t('map.filter.allStatuses') || 'All Statuses' }, // All option with translation
		...filteredContractStatuses, // Spread in filtered contract status options
	]

	const sponsoringStateOptions = [
		{ value: 'all', label: t('map.filter.allStates') || 'All States' }, // All option with translation
		...filteredSponsoringStates, // Spread in filtered sponsoring state options
	]

	const yearOptions = [
		{ value: 'all', label: t('map.filter.allYears') || 'All Years' }, // All option with translation
		...filteredYears, // Spread in filtered year options
	]

	const locationOptions = [
		{ value: 'all', label: t('map.filter.allLocations') || 'All Locations' }, // All option with translation
		...locationBoundaries.map(location => ({
			value: location.id,
			label: location.name,
		})), // Map location boundaries to dropdown options
	]

	return (
		<div className={styles.improvedFilterPanel}>
			{' '}
			{/* Main filter panel container */}
			<div className={styles.filterContent}>
				{' '}
				{/* Filter content area */}
				<div className={styles.filterHeader}>
					{' '}
					{/* Header with title and reset button */}
					<h2>{t('map.filter.title') || 'Exploration Filters'}</h2> {/* Title with translation */}
					{activeFilterCount > 0 && (
						<button className={styles.resetButton} onClick={handleResetFilters} disabled={loading}>
							{t('map.filter.reset') || 'Reset'} ({activeFilterCount}) {/* Reset button with active filter count */}
						</button>
					)}
				</div>
				{/* Search Component for finding contractors, cruises, stations, etc. */}
				<SearchPanel
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					searchResults={searchResults}
					setSearchResults={setSearchResults}
					showResults={showResults}
					setShowResults={setShowResults}
					selectedSearchItem={selectedSearchItem}
					setSelectedSearchItem={setSelectedSearchItem}
					mapData={mapData}
					setFilter={setFilter}
					handleContractorSelect={handleContractorSelect}
					setSelectedContractorId={setSelectedContractorId}
					setSelectedCruiseId={setSelectedCruiseId}
					setDetailPanelType={setDetailPanelType}
					setShowDetailPanel={setShowDetailPanel}
					setViewBounds={setViewBounds}
					t={t}
				/>
				{/* Filter Options Component with all filter dropdowns */}
				<FilterOptions
					contractorOptions={contractorOptions}
					mineralTypeOptions={mineralTypeOptions}
					contractStatusOptions={contractStatusOptions}
					sponsoringStateOptions={sponsoringStateOptions}
					yearOptions={yearOptions}
					locationOptions={locationOptions}
					filters={filters}
					debouncedSelectChange={debouncedSelectChange}
					loading={loading}
					t={t}
				/>
			</div>
			{/* Results Info Component with counts and Download CSV button */}
			<ResultsInfo
				loading={loading}
				contractorCount={contractorCount}
				cruiseCount={cruiseCount}
				stationCount={stationCount}
				mapData={mapData} // Pass the actual mapData for use in CSV export
				t={t}
			/>
		</div>
	)
}

export default ImprovedFilterPanel
