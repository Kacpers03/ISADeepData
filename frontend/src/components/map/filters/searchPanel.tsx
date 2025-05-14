// src/components/filters/SearchPanel.tsx
import React, { useCallback } from 'react' // Import React and useCallback hook
import styles from '../../../styles/map/filter.module.css' // Import CSS styles for the search panel

// Interface defining search panel properties
interface SearchPanelProps {
	searchQuery: string // Current search query text
	setSearchQuery: (query: string) => void // Function to update search query
	searchResults: any[] // Array of search results
	setSearchResults: (results: any[]) => void // Function to update search results
	showResults: boolean // Whether to show results panel
	setShowResults: (show: boolean) => void // Function to toggle results panel
	selectedSearchItem: any // Currently selected search result
	setSelectedSearchItem: (item: any) => void // Function to set selected result
	mapData: any // Map data to search through
	setFilter: (key: string, value: any) => void // Function to set map filters
	handleContractorSelect: (id: number | null) => void // Function to handle contractor selection
	setSelectedContractorId: (id: number | null) => void // Function to set selected contractor ID
	setSelectedCruiseId: (id: number | null) => void // Function to set selected cruise ID
	setDetailPanelType?: (type: string | null) => void // Optional function to set detail panel type
	setShowDetailPanel?: (show: boolean) => void // Optional function to show/hide detail panel
	setViewBounds?: (bounds: any) => void // Optional function to set map view bounds
	t: any // Translation function from language context
}

// Component for searching map elements like contractors, cruises, stations, etc.
const SearchPanel: React.FC<SearchPanelProps> = ({
	searchQuery,
	setSearchQuery,
	searchResults,
	setSearchResults,
	showResults,
	setShowResults,
	selectedSearchItem,
	setSelectedSearchItem,
	mapData,
	setFilter,
	handleContractorSelect,
	setSelectedContractorId,
	setSelectedCruiseId,
	setDetailPanelType,
	setShowDetailPanel,
	setViewBounds,
	t,
}) => {
	// Handle search query change from input field
	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchQuery(e.target.value) // Update query text
			if (e.target.value.trim() === '') {
				setSearchResults([]) // Clear results if query is empty
				setShowResults(false) // Hide results panel
			}
		},
		[setSearchQuery, setSearchResults, setShowResults] // Dependencies for memoization
	)

	// Main search function that finds matching items in mapData
	const handleSearch = useCallback(() => {
		if (!searchQuery.trim()) {
			setSearchResults([]) // Clear results if query is empty
			setShowResults(false) // Hide results panel
			return
		}

		console.log('Searching for:', searchQuery) // Log for debugging

		const query = searchQuery.toLowerCase() // Convert to lowercase for case-insensitive search
		const results = [] // Array to store search results

		// Search contractors with explicit null checks for robustness
		if (mapData && mapData.contractors && Array.isArray(mapData.contractors)) {
			console.log('Searching through', mapData.contractors.length, 'contractors') // Log for debugging
			mapData.contractors.forEach(contractor => {
				if (contractor && contractor.contractorName) {
					if (contractor.contractorName.toLowerCase().includes(query)) {
						console.log('MATCH found for contractor:', contractor.contractorName) // Log matches for debugging
						results.push({
							type: 'contractor', // Result type
							id: contractor.contractorId, // Unique identifier
							name: contractor.contractorName, // Display name
							sponsoringState: contractor.sponsoringState, // Additional info
							contractType: contractor.contractType, // Additional info
						})
					}
				}
			})
		} else {
			console.log('No contractors array found in mapData') // Log error for debugging
		}

		// Search cruises with robustness checks
		if (mapData && mapData.cruises && Array.isArray(mapData.cruises)) {
			mapData.cruises.forEach(cruise => {
				const cruiseName = cruise.cruiseName || `Cruise #${cruise.cruiseId}` // Fallback name if no cruise name

				// Search by cruise name or ID
				if (
					(cruise.cruiseName && cruise.cruiseName.toLowerCase().includes(query)) ||
					(cruise.cruiseId && cruise.cruiseId.toString().includes(query))
				) {
					// Find the parent contractor for context
					const parentContractor = mapData.contractors?.find(c => c.contractorId === cruise.contractorId)

					results.push({
						type: 'cruise', // Result type
						id: cruise.cruiseId, // Unique identifier
						name: cruiseName, // Display name
						parent: parentContractor ? parentContractor.contractorName : undefined, // Parent name for context
						contractorId: cruise.contractorId, // Parent ID for navigation
						startDate: cruise.startDate, // Additional info
						endDate: cruise.endDate, // Additional info
						vesselName: cruise.researchVessel, // Additional info
						// Add center coordinates if available for map navigation
						centerLatitude: cruise.centerLatitude,
						centerLongitude: cruise.centerLongitude,
						// Add first station coordinates as fallback for positioning
						stationLatitude: cruise.stations && cruise.stations.length > 0 ? cruise.stations[0].latitude : undefined,
						stationLongitude: cruise.stations && cruise.stations.length > 0 ? cruise.stations[0].longitude : undefined,
					})
				}

				// Search stations within this cruise
				if (cruise.stations && Array.isArray(cruise.stations)) {
					cruise.stations.forEach(station => {
						const stationName = station.stationName || station.stationCode || `Station #${station.stationId}` // Fallback name

						if (
							(station.stationName && station.stationName.toLowerCase().includes(query)) ||
							(station.stationCode && station.stationCode.toLowerCase().includes(query)) ||
							(station.stationId && station.stationId.toString().includes(query)) ||
							(station.location && station.location.toLowerCase().includes(query))
						) {
							results.push({
								type: 'station', // Result type
								id: station.stationId, // Unique identifier
								name: stationName, // Display name
								parent: cruiseName, // Parent name for context
								cruiseId: cruise.cruiseId, // Parent ID for navigation
								latitude: station.latitude, // Position for map navigation
								longitude: station.longitude, // Position for map navigation
								stationType: station.stationType, // Additional info
								stationObject: station, // Full station object for detailed display
							})
						}
					})
				}
			})
		}

		// Search for areas and blocks
		if (mapData && mapData.contractors) {
			mapData.contractors.forEach(contractor => {
				if (contractor.areas && Array.isArray(contractor.areas)) {
					contractor.areas.forEach(area => {
						const areaName = area.areaName || `Area #${area.areaId}` // Fallback name

						if (
							(area.areaName && area.areaName.toLowerCase().includes(query)) ||
							(area.areaId && area.areaId.toString().includes(query))
						) {
							results.push({
								type: 'area', // Result type
								id: area.areaId, // Unique identifier
								name: areaName, // Display name
								parent: contractor.contractorName, // Parent name for context
								contractorId: contractor.contractorId, // Parent ID for navigation
								centerLatitude: area.centerLat, // Position for map navigation
								centerLongitude: area.centerLon, // Position for map navigation
								// If we have bounds available, use them for map navigation
								bounds: area.bounds || null,
							})
						}

						// Search blocks within this area
						if (area.blocks && Array.isArray(area.blocks)) {
							area.blocks.forEach(block => {
								const blockName = block.blockName || `Block #${block.blockId}` // Fallback name

								if (
									(block.blockName && block.blockName.toLowerCase().includes(query)) ||
									(block.blockId && block.blockId.toString().includes(query))
								) {
									results.push({
										type: 'block', // Result type
										id: block.blockId, // Unique identifier
										name: blockName, // Display name
										parent: `${areaName} (${contractor.contractorName})`, // Parent context with hierarchy
										areaId: area.areaId, // Parent ID for navigation
										contractorId: contractor.contractorId, // Root parent ID for navigation
										status: block.status, // Additional info
										centerLatitude: block.centerLat, // Position for map navigation
										centerLongitude: block.centerLon, // Position for map navigation
										// If we have bounds available, use them for map navigation
										bounds: block.bounds || null,
									})
								}
							})
						}
					})
				}
			})
		}

		console.log('Search results:', results) // Log for debugging

		// Set results and show panel
		setSearchResults(results) // Update search results
		setShowResults(true) // Show results panel
	}, [searchQuery, mapData, setSearchResults, setShowResults]) // Dependencies for memoization

	// Handle click on a search result item
	const handleResultClick = useCallback(
		(result: any) => {
			console.log('Search result clicked:', result) // Log for debugging
			setShowResults(false) // Hide results panel
			setSearchQuery('') // Clear search query

			// Store the selected result for highlighting
			setSelectedSearchItem(result)

			// Find the main window object to access mapInstance and global functions
			const mainWindow = window as any

			// Handle different result types with appropriate actions
			switch (result.type) {
				case 'contractor':
					// Set contractor filter, select it, and show detail panel
					setFilter('contractorId', result.id) // Set filter for this contractor

					// Use the provided handler or standard approach
					if (handleContractorSelect) {
						handleContractorSelect(result.id) // Use specialized handler if available
					} else {
						setSelectedContractorId(result.id) // Set selected ID directly
					}

					// If the main window has a showDetailPanel function, call it
					if (mainWindow.showContractorDetails) {
						mainWindow.showContractorDetails(result.id) // Show contractor details on map
					}
					break

				case 'cruise':
					// IMPORTANT: Make sure cruises are visible FIRST using the window function
					if (mainWindow.showCruises) {
						console.log('Making cruises visible via window function') // Log for debugging
						mainWindow.showCruises(true) // Show cruises on map
					}

					// Set cruise filter and selected cruise ID
					setFilter('cruiseId', result.id) // Set filter for this cruise
					setSelectedCruiseId(result.id) // Set selected cruise ID

					if (mainWindow.mapInstance) {
						if (result.centerLatitude && result.centerLongitude) {
							mainWindow.mapInstance.flyTo({
								center: [result.centerLongitude, result.centerLatitude],
								zoom: 15, // Appropriate zoom level for cruise detail
								duration: 1000, // Animation duration in milliseconds
							})
						} else if (result.stationLatitude && result.stationLongitude) {
							// Use first station as fallback if cruise center not available
							mainWindow.mapInstance.flyTo({
								center: [result.stationLongitude, result.stationLatitude],
								zoom: 15,
								duration: 1000,
							})
						}
					}

					// IMPORTANT: Add a delayed call to ensure cruises stay visible
					setTimeout(() => {
						if (mainWindow.showCruises) {
							console.log('Ensuring cruises remain visible after search selection') // Log for debugging
							mainWindow.showCruises(true) // Keep cruises visible after map moves
						}
					}, 200) // Short delay to ensure map has updated
					break

				case 'station':
					// Find the station in the map data and display its info panel

					// Zoom to the station's location
					if (mainWindow.mapInstance && result.latitude && result.longitude) {
						mainWindow.mapInstance.flyTo({
							center: [result.longitude, result.latitude],
							zoom: 20, // Higher zoom level for station detail
							duration: 1000,
						})
					}

					// If station has parent cruise, also set that filter
					if (result.cruiseId) {
						setFilter('cruiseId', result.cruiseId) // Set cruise filter
						setSelectedCruiseId(result.cruiseId) // Set selected cruise ID
					}
					break

				case 'area':
					// Try to use the dedicated function first if available
					if (mainWindow.zoomToArea) {
						mainWindow.zoomToArea(result.id) // Use specialized function
					}
					// Fall back to manual zoom using coordinates
					else if (mainWindow.mapInstance && result.centerLatitude && result.centerLongitude) {
						mainWindow.mapInstance.flyTo({
							center: [result.centerLongitude, result.centerLatitude],
							zoom: 7, // Appropriate zoom level for area overview
							duration: 1000,
						})
					}

					// If the area has bounds, set view bounds
					if (setViewBounds && result.bounds) {
						setViewBounds(result.bounds) // Set map view bounds to show entire area
					}

					// If the area has a parent contractor, select it too
					if (result.contractorId) {
						if (handleContractorSelect) {
							handleContractorSelect(result.contractorId) // Use specialized handler
						} else {
							setSelectedContractorId(result.contractorId) // Set contractor ID directly
						}
					}
					break

				case 'block':
					// Show block analytics panel if available
					if (mainWindow.showBlockAnalytics) {
						mainWindow.showBlockAnalytics(result.id) // Show specialized analytics panel
					} else {
						// Fall back to zooming to the block using coordinates
						if (mainWindow.mapInstance && result.centerLatitude && result.centerLongitude) {
							mainWindow.mapInstance.flyTo({
								center: [result.centerLongitude, result.centerLatitude],
								zoom: 9, // Higher zoom for blocks
								duration: 1000,
							})
						}
					}

					// If the block has bounds, set view bounds
					if (setViewBounds && result.bounds) {
						setViewBounds(result.bounds) // Set map view bounds to show entire block
					}

					// If the block has a parent contractor, select it too
					if (result.contractorId) {
						if (handleContractorSelect) {
							handleContractorSelect(result.contractorId) // Use specialized handler
						} else {
							setSelectedContractorId(result.contractorId) // Set contractor ID directly
						}
					}
					break

				default:
					console.warn('Unhandled result type:', result.type) // Log warning for unexpected result types
			}
		},
		[
			setShowResults,
			setSearchQuery,
			setSelectedSearchItem,
			setFilter,
			handleContractorSelect,
			setSelectedContractorId,
			setSelectedCruiseId,
			setViewBounds,
		] // Dependencies for memoization
	)

	// Handle search on Enter key press in search input
	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter') {
				handleSearch() // Trigger search on Enter key
			}
		},
		[handleSearch] // Dependencies for memoization
	)

	return (
		<div className={styles.searchContainer}>
			<div className={styles.searchInputWrapper}>
				<input
					type='text'
					placeholder={t('map.search.placeholder') || 'Search contractors, areas, blocks, stations...'}
					value={searchQuery}
					onChange={handleSearchChange}
					onKeyPress={handleKeyPress}
					className={styles.searchInput}
				/>
				<button onClick={handleSearch} className={styles.searchButton} aria-label='Search'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='18'
						height='18'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'>
						<circle cx='11' cy='11' r='8'></circle>
						<line x1='21' y1='21' x2='16.65' y2='16.65'></line>
					</svg>
				</button>
			</div>

			{/* Search Results */}
			{showResults && (
				<div id='search-results-panel' className={styles.searchResultsList}>
					<div className={styles.searchResultsHeader}>
						<span>
							{t('map.search.results') || 'Search Results'} ({searchResults.length})
						</span>
						<button className={styles.closeResultsButton} onClick={() => setShowResults(false)}>
							×
						</button>
					</div>

					<div className={styles.searchResultsContent}>
						{searchResults.length === 0 ? (
							<div className={styles.noResults}>
								{t('map.search.noResults') || 'No results found for'} "{searchQuery}"
							</div>
						) : (
							<ul>
								{searchResults.map((result, index) => (
									<li
										key={`${result.type}-${result.id}-${index}`}
										onClick={() => handleResultClick(result)}
										className={
											selectedSearchItem &&
											selectedSearchItem.type === result.type &&
											selectedSearchItem.id === result.id
												? styles.selectedResult
												: ''
										}>
										<div className={styles.resultType}>
											{result.type === 'contractor' && (
												<>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														width='12'
														height='12'
														viewBox='0 0 24 24'
														fill='none'
														stroke='currentColor'
														strokeWidth='2'
														strokeLinecap='round'
														strokeLinejoin='round'>
														<path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
														<circle cx='12' cy='7' r='4'></circle>
													</svg>
													Contractor
												</>
											)}
											{result.type === 'cruise' && (
												<>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														width='12'
														height='12'
														viewBox='0 0 24 24'
														fill='none'
														stroke='currentColor'
														strokeWidth='2'
														strokeLinecap='round'
														strokeLinejoin='round'>
														<path d='M22 18H2a10 10 0 0 1 20 0Z'></path>
														<path d='M6 18v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2'></path>
														<path d='M12 4v9'></path>
													</svg>
													Cruise
												</>
											)}
											{result.type === 'station' && (
												<>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														width='12'
														height='12'
														viewBox='0 0 24 24'
														fill='none'
														stroke='currentColor'
														strokeWidth='2'
														strokeLinecap='round'
														strokeLinejoin='round'>
														<path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
														<circle cx='12' cy='10' r='3'></circle>
													</svg>
													Station
												</>
											)}
											{result.type === 'area' && (
												<>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														width='12'
														height='12'
														viewBox='0 0 24 24'
														fill='none'
														stroke='currentColor'
														strokeWidth='2'
														strokeLinecap='round'
														strokeLinejoin='round'>
														<path d='M3 6h18'></path>
														<path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6'></path>
														<path d='M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path>
													</svg>
													Area
												</>
											)}
											{result.type === 'block' && (
												<>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														width='12'
														height='12'
														viewBox='0 0 24 24'
														fill='none'
														stroke='currentColor'
														strokeWidth='2'
														strokeLinecap='round'
														strokeLinejoin='round'>
														<rect x='2' y='2' width='20' height='20' rx='5'></rect>
													</svg>
													Block
												</>
											)}
										</div>
										<div className={styles.resultName}>{result.name}</div>
										{result.parent && <div className={styles.resultParent}>in {result.parent}</div>}
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			)}

			{/* Selected item indicator - without the X button */}
			{selectedSearchItem && (
				<div className={styles.selectedItemIndicator}>
					<div className={styles.selectedItemType}>
						{selectedSearchItem.type.charAt(0).toUpperCase() + selectedSearchItem.type.slice(1)} Selected:
					</div>
					<div className={styles.selectedItemName}>
						{selectedSearchItem.name}
						{selectedSearchItem.parent && (
							<span className={styles.selectedItemParent}> in {selectedSearchItem.parent}</span>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default SearchPanel
