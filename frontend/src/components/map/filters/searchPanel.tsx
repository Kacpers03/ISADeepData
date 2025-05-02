// src/components/filters/SearchPanel.tsx
import React, { useCallback } from 'react'
import styles from '../../../styles/map/filter.module.css'

interface SearchPanelProps {
	searchQuery: string
	setSearchQuery: (query: string) => void
	searchResults: any[]
	setSearchResults: (results: any[]) => void
	showResults: boolean
	setShowResults: (show: boolean) => void
	selectedSearchItem: any
	setSelectedSearchItem: (item: any) => void
	mapData: any
	setFilter: (key: string, value: any) => void
	handleContractorSelect: (id: number | null) => void
	setSelectedContractorId: (id: number | null) => void
	setSelectedCruiseId: (id: number | null) => void
	setDetailPanelType?: (type: string | null) => void
	setShowDetailPanel?: (show: boolean) => void
	setViewBounds?: (bounds: any) => void
	t: any
}

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
	// Handle search query change
	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchQuery(e.target.value)
			if (e.target.value.trim() === '') {
				setSearchResults([])
				setShowResults(false)
			}
		},
		[setSearchQuery, setSearchResults, setShowResults]
	)

	// Search function
	const handleSearch = useCallback(() => {
		if (!searchQuery.trim()) {
			setSearchResults([])
			setShowResults(false)
			return
		}

		console.log('Searching for:', searchQuery)

		const query = searchQuery.toLowerCase()
		const results = []

		// Search contractors with explicit null checks
		if (mapData && mapData.contractors && Array.isArray(mapData.contractors)) {
			console.log('Searching through', mapData.contractors.length, 'contractors')
			mapData.contractors.forEach(contractor => {
				if (contractor && contractor.contractorName) {
					if (contractor.contractorName.toLowerCase().includes(query)) {
						console.log('MATCH found for contractor:', contractor.contractorName)
						results.push({
							type: 'contractor',
							id: contractor.contractorId,
							name: contractor.contractorName,
							sponsoringState: contractor.sponsoringState,
							contractType: contractor.contractType,
						})
					}
				}
			})
		} else {
			console.log('No contractors array found in mapData')
		}

		// Search cruises
		if (mapData && mapData.cruises && Array.isArray(mapData.cruises)) {
			mapData.cruises.forEach(cruise => {
				const cruiseName = cruise.cruiseName || `Cruise #${cruise.cruiseId}`

				// Search by cruise name or ID
				if (
					(cruise.cruiseName && cruise.cruiseName.toLowerCase().includes(query)) ||
					(cruise.cruiseId && cruise.cruiseId.toString().includes(query))
				) {
					// Find the parent contractor for context
					const parentContractor = mapData.contractors?.find(c => c.contractorId === cruise.contractorId)

					results.push({
						type: 'cruise',
						id: cruise.cruiseId,
						name: cruiseName,
						parent: parentContractor ? parentContractor.contractorName : undefined,
						contractorId: cruise.contractorId,
						startDate: cruise.startDate,
						endDate: cruise.endDate,
						vesselName: cruise.researchVessel,
						// Add center coordinates if available
						centerLatitude: cruise.centerLatitude,
						centerLongitude: cruise.centerLongitude,
						// Add first station coordinates as fallback
						stationLatitude: cruise.stations && cruise.stations.length > 0 ? cruise.stations[0].latitude : undefined,
						stationLongitude: cruise.stations && cruise.stations.length > 0 ? cruise.stations[0].longitude : undefined,
					})
				}

				// Search stations within this cruise
				if (cruise.stations && Array.isArray(cruise.stations)) {
					cruise.stations.forEach(station => {
						const stationName = station.stationName || station.stationCode || `Station #${station.stationId}`

						if (
							(station.stationName && station.stationName.toLowerCase().includes(query)) ||
							(station.stationCode && station.stationCode.toLowerCase().includes(query)) ||
							(station.stationId && station.stationId.toString().includes(query)) ||
							(station.location && station.location.toLowerCase().includes(query))
						) {
							results.push({
								type: 'station',
								id: station.stationId,
								name: stationName,
								parent: cruiseName,
								cruiseId: cruise.cruiseId,
								latitude: station.latitude,
								longitude: station.longitude,
								stationType: station.stationType,
								stationObject: station,
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
						const areaName = area.areaName || `Area #${area.areaId}`

						if (
							(area.areaName && area.areaName.toLowerCase().includes(query)) ||
							(area.areaId && area.areaId.toString().includes(query))
						) {
							results.push({
								type: 'area',
								id: area.areaId,
								name: areaName,
								parent: contractor.contractorName,
								contractorId: contractor.contractorId,
								centerLatitude: area.centerLat,
								centerLongitude: area.centerLon,
								// If we have bounds available, use them
								bounds: area.bounds || null,
							})
						}

						// Search blocks
						if (area.blocks && Array.isArray(area.blocks)) {
							area.blocks.forEach(block => {
								const blockName = block.blockName || `Block #${block.blockId}`

								if (
									(block.blockName && block.blockName.toLowerCase().includes(query)) ||
									(block.blockId && block.blockId.toString().includes(query))
								) {
									results.push({
										type: 'block',
										id: block.blockId,
										name: blockName,
										parent: `${areaName} (${contractor.contractorName})`,
										areaId: area.areaId,
										contractorId: contractor.contractorId,
										status: block.status,
										centerLatitude: block.centerLat,
										centerLongitude: block.centerLon,
										// If we have bounds available, use them
										bounds: block.bounds || null,
									})
								}
							})
						}
					})
				}
			})
		}

		console.log('Search results:', results)

		// Set results and show panel
		setSearchResults(results)
		setShowResults(true)
	}, [searchQuery, mapData, setSearchResults, setShowResults])

	// Handle search result click
	const handleResultClick = useCallback(
		(result: any) => {
			console.log('Search result clicked:', result)
			setShowResults(false)
			setSearchQuery('')

			// Store the selected result for highlighting
			setSelectedSearchItem(result)

			// Find the main window object to access mapInstance
			const mainWindow = window as any

			switch (result.type) {
				case 'contractor':
					// Set contractor filter, select it, and show detail panel
					setFilter('contractorId', result.id)

					// Use the provided handler or standard approach
					if (handleContractorSelect) {
						handleContractorSelect(result.id)
					} else {
						setSelectedContractorId(result.id)
					}

					// If the main window has a showDetailPanel function, call it
					if (mainWindow.showContractorDetails) {
						mainWindow.showContractorDetails(result.id)
					}
					break

				case 'cruise':
					// IMPORTANT: Make sure cruises are visible FIRST using the window function
					if (mainWindow.showCruises) {
						console.log('Making cruises visible via window function')
						mainWindow.showCruises(true)
					}

					// Set cruise filter and selected cruise ID
					setFilter('cruiseId', result.id)
					setSelectedCruiseId(result.id)

					if (mainWindow.mapInstance) {
						if (result.centerLatitude && result.centerLongitude) {
							mainWindow.mapInstance.flyTo({
								center: [result.centerLongitude, result.centerLatitude],
								zoom: 15,
								duration: 1000,
							})
						} else if (result.stationLatitude && result.stationLongitude) {
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
							console.log('Ensuring cruises remain visible after search selection')
							mainWindow.showCruises(true)
						}
					}, 200)
					break

				case 'station':
					// Find the station in the map data and display its info panel

					// Also zoom to the station's location
					if (mainWindow.mapInstance && result.latitude && result.longitude) {
						mainWindow.mapInstance.flyTo({
							center: [result.longitude, result.latitude],
							zoom: 20,
							duration: 1000,
						})
					}

					// If station has parent cruise, also set that filter
					if (result.cruiseId) {
						setFilter('cruiseId', result.cruiseId)
						setSelectedCruiseId(result.cruiseId)
					}
					break

				case 'area':
					// Try to use the dedicated function first
					if (mainWindow.zoomToArea) {
						mainWindow.zoomToArea(result.id)
					}
					// Zoom to the area using the coordinates
					else if (mainWindow.mapInstance && result.centerLatitude && result.centerLongitude) {
						mainWindow.mapInstance.flyTo({
							center: [result.centerLongitude, result.centerLatitude],
							zoom: 7, // Appropriate zoom level for an area
							duration: 1000,
						})
					}

					// If the area has bounds, set view bounds
					if (setViewBounds && result.bounds) {
						setViewBounds(result.bounds)
					}

					// If the area has a parent contractor, select it too
					if (result.contractorId) {
						if (handleContractorSelect) {
							handleContractorSelect(result.contractorId)
						} else {
							setSelectedContractorId(result.contractorId)
						}
					}
					break

				case 'block':
					// Show block analytics panel if available
					if (mainWindow.showBlockAnalytics) {
						mainWindow.showBlockAnalytics(result.id)
					} else {
						// Zoom to the block using coordinates
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
						setViewBounds(result.bounds)
					}

					// If the block has a parent contractor, select it too
					if (result.contractorId) {
						if (handleContractorSelect) {
							handleContractorSelect(result.contractorId)
						} else {
							setSelectedContractorId(result.contractorId)
						}
					}
					break

				default:
					console.warn('Unhandled result type:', result.type)
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
		]
	)

	// Handle search on Enter key
	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter') {
				handleSearch()
			}
		},
		[handleSearch]
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
