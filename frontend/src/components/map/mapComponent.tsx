// frontend/src/components/map/MapComponent.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react' // Import React and hooks
import Map, { NavigationControl } from 'react-map-gl' // Import MapBox GL components

// Custom hooks for map functionality - each handles a specific aspect of the map
import useMapData from './hooks/useMapdata' // Hook for fetching and processing map data
import useMapZoom from './hooks/useMapZoom' // Hook for zoom-related behaviors
import useCluster from './hooks/useCluster' // Hook for station clustering functionality
import useMapState from './hooks/useMapState' // Hook for managing map view state
import useMapInteractions from './hooks/useMapInteractions' // Hook for handling map interactions
import useMapExport from './hooks/useMapExport' // Hook for exporting map data

// UI Components and styles
import 'mapbox-gl/dist/mapbox-gl.css' // MapBox GL styles
import { useFilter } from './context/filterContext' // Context hook for filter state
// CSS modules for different aspects of the map UI
import baseStyles from '../../styles/map/base.module.css'
import controlStyles from '../../styles/map/controls.module.css'
import markerStyles from '../../styles/map/markers.module.css'
import layerStyles from '../../styles/map/layers.module.css'
import panelStyles from '../../styles/map/panels.module.css'
import uiStyles from '../../styles/map/ui.module.css'

// Map layers component for rendering map features
import MapLayers from './layers/mapLayers'

// UI Components for the map interface
import { DetailPanel } from './ui/detailPanel' // Panel for showing details about map entities
import { BlockAnalyticsPanel } from './ui/blockAnalyticsPanel' // Panel for block analytics
import { ContractorSummaryPanel } from './ui/contractorSummaryPanel' // Panel for contractor summary
import CompactLayerControls from './ui/layerControls' // Controls for toggling map layers
import SummaryPanel from './ui/summaryPanel' // Panel for overall map statistics
import CoordinateDisplay from './ui/coordinateDisplay' // Display for cursor coordinates
import ToastNotification from './ui/toastNotification' // Toast messages
import LoadingOverlay from './ui/loadingOverlay' // Loading indicator
import ZoomOutButton from './ui/zoomOutButton' // Button to zoom out

// Combine all styles into a single object for convenience
const styles = {
	...baseStyles,
	...controlStyles,
	...markerStyles,
	...layerStyles,
	...panelStyles,
	...uiStyles,
}

const MapComponent = () => {
	// Get filter context state and functions - primary state management for the map
	const {
		mapData, // All map data (contractors, cruises, etc.)
		loading, // Global loading state
		error, // Error state
		viewBounds, // Map view boundaries
		setViewBounds, // Function to set view boundaries
		selectedStation, // Currently selected station
		setSelectedStation, // Function to select a station
		selectedContractorId, // Currently selected contractor ID
		setSelectedContractorId, // Function to select a contractor
		selectedCruiseId, // Currently selected cruise ID
		setSelectedCruiseId, // Function to select a cruise
		showDetailPanel, // Whether to show the detail panel
		setShowDetailPanel, // Function to toggle detail panel
		detailPanelType, // Type of content in detail panel
		setDetailPanelType, // Function to set detail panel content type
		filters, // Current filter state
		setFilter, // Function to set a specific filter
		refreshData, // Function to refresh map data
		resetFilters, // Function to reset all filters
		originalMapData, // Original unfiltered map data
	} = useFilter()

	// Use custom hook for map state management
	const {
		viewState, // Current map view state (zoom, center, etc.)
		setViewState, // Function to update view state
		mapRef, // Reference to the map component
		initialLoadComplete, // Whether initial map load is complete
		setInitialLoadComplete, // Function to mark initial load as complete
		cursorPosition, // Current cursor position
		setCursorPosition, // Function to update cursor position
		mapStyle, // Current map style
		setMapStyle, // Function to change map style
	} = useMapState()

	// Layer visibility state - controls which map layers are shown
	const [showAreas, setShowAreas] = useState(true) // Show contract areas
	const [showBlocks, setShowBlocks] = useState(true) // Show blocks within areas
	const [showStations, setShowStations] = useState(true) // Show sampling stations
	const [showCruises, setShowCruises] = useState(true) // Show cruise paths

	// UI state for notifications and panels
	const [showToast, setShowToast] = useState(false) // Show toast notification
	const [toastMessage, setToastMessage] = useState('') // Toast message content
	const [showSummaryPanel, setShowSummaryPanel] = useState(false) // Show summary panel
	const [summaryData, setSummaryData] = useState(null) // Data for summary panel

	// Analytics state for detailed information
	const [selectedContractorInfo, setSelectedContractorInfo] = useState(null) // Detailed info about selected contractor
	const [blockAnalytics, setBlockAnalytics] = useState(null) // Analytics for a selected block
	const [contractorSummary, setContractorSummary] = useState(null) // Summary for a contractor
	const [hoveredBlockId, setHoveredBlockId] = useState(null) // ID of block being hovered
	const [popupInfo, setPopupInfo] = useState(null) // Info for map popups

	// Use custom hook for map data management
	const {
		allAreaLayers, // All area layers for the map
		setAllAreaLayers, // Function to update area layers
		localLoading, // Local loading state
		setLocalLoading, // Function to set local loading state
		contractorSummaryCache, // Cache for contractor summaries
		fetchContractorGeoJson, // Function to fetch contractor GeoJSON
		loadAllVisibleContractors, // Function to load all visible contractors
		fetchContractorSummary, // Function to fetch contractor summary
		fetchBlockAnalytics, // Function to fetch block analytics
		getAllStations, // Function to get all stations
	} = useMapData(mapData, loading, filters, selectedContractorId)

	// Use custom hook for zoom behavior
	const {
		userHasSetView, // Whether user has manually set the view
		setUserHasSetView, // Function to update user view state
		smartZoom, // Function for intelligent zooming
		zoomToArea, // Function to zoom to an area
		zoomToBlock, // Function to zoom to a block
		zoomToCruise, // Function to zoom to a cruise
		pendingZoomContractorId, // ID of contractor pending zoom
		setPendingZoomContractorId, // Function to set pending zoom contractor
	} = useMapZoom(mapRef, allAreaLayers, selectedContractorId, filters)

	// Use custom hook for station clustering
	const { clusterIndex, clusters, updateClusters } = useCluster(mapData, filters, mapRef, getAllStations)

	// Memoize visible area layers with improved filtering - important for performance
	const visibleAreaLayers = useMemo(() => {
		if (!allAreaLayers.length) return [] // Return empty array if no layers

		// If no filters are applied, return all layers (or only the selected contractor's layers)
		if (Object.keys(filters).length === 0) {
			if (selectedContractorId) {
				return allAreaLayers.filter(area => area.contractorId === selectedContractorId)
			}
			return allAreaLayers
		}

		// Get contractors that match the current filters
		const filteredContractors =
			mapData?.contractors.filter(contractor => {
				// Apply mineral type filter (contractType)
				if (
					filters.contractType &&
					filters.contractType !== 'all' &&
					contractor.contractType !== filters.contractType
				) {
					return false
				}

				// Apply sponsoring state filter
				if (
					filters.sponsoringState &&
					filters.sponsoringState !== 'all' &&
					contractor.sponsoringState !== filters.sponsoringState
				) {
					return false
				}

				// Apply year filter (if it exists in your filter object)
				if (
					filters.contractualYear &&
					filters.contractualYear !== 'all' &&
					contractor.contractualYear !== filters.contractualYear
				) {
					return false
				}

				// If all filters pass, include this contractor
				return true
			}) || []

		// Get the IDs of contractors that match filters
		const filteredContractorIds = filteredContractors.map(c => c.contractorId)

		// If we have a specific contractor selected, only show that one's areas
		// regardless of other filters
		if (selectedContractorId) {
			return allAreaLayers.filter(area => area.contractorId === selectedContractorId)
		}

		// Otherwise filter area layers to only those belonging to the filtered contractors
		return allAreaLayers.filter(area => filteredContractorIds.includes(area.contractorId))
	}, [allAreaLayers, mapData?.contractors, filters, selectedContractorId]) // Dependencies for the memo

	// Use custom hook for map interactions
	const {
		handleViewStateChange, // Handle map view changes
		handleCruiseClick, // Handle clicks on cruise lines
		handleMarkerClick, // Handle clicks on markers
		handlePanelClose, // Handle closing panels
		handleCloseAllPanels, // Handle closing all panels
		handleViewContractorSummary, // Handle viewing contractor summary
		handleResetFilters, // Handle resetting filters
		handleBlockClick, // Handle clicks on blocks
		handleMapHover, // Handle map hover events
		handleAreaClick, // Handle clicks on areas
		handleStationHover, // Handle hovering on stations
		toggleSummaryPanel, // Toggle the summary panel
	} = useMapInteractions({
		mapRef,
		viewState,
		setViewState,
		setUserHasSetView,
		setViewBounds,
		updateClusters,
		setSelectedCruiseId,
		setDetailPanelType,
		setShowDetailPanel,
		setPopupInfo,
		setSelectedStation,
		zoomToCruise,
		zoomToArea,
		zoomToBlock,
		setShowCruises,
		resetFilters,
		fetchBlockAnalytics,
		blockAnalytics,
		setBlockAnalytics,
		visibleAreaLayers, // Use visibleAreaLayers, not allAreaLayers
		selectedContractorId,
		contractorSummary,
		setContractorSummary,
		fetchContractorSummary,
		setToastMessage,
		setShowToast,
	})

	// Get selected entities from map data
	const selectedContractor = mapData?.contractors.find(c => c.contractorId === selectedContractorId) || null
	const selectedCruise = mapData?.cruises.find(c => c.cruiseId === selectedCruiseId) || null

	// Ensure cruises are visible when a cruise is selected
	useEffect(() => {
		if (selectedCruiseId) {
			setShowCruises(true) // Make cruises visible if one is selected
		}
	}, [selectedCruiseId])

	// Zoom to selected location boundary if a location filter is applied
	useEffect(() => {
		if (mapRef.current && filters.locationId && filters.locationId !== 'all') {
			smartZoom() // Zoom to fit filtered location
		}
	}, [filters.locationId, smartZoom])

	// Effect for smart zooming when contractor selection changes
	useEffect(() => {
		if (mapRef.current) {
			smartZoom() // Zoom to fit selected contractor area
		}
	}, [selectedContractorId, smartZoom])

	// Effect for handling cruise selection with zooming
	useEffect(() => {
		if (selectedCruiseId && mapData && mapRef.current) {
			// We'll only make cruises visible here but NOT trigger another zoom
			// since zooming is now handled directly in the click handlers
			setShowCruises(true)

			// Only zoom if userHasSetView is false (first load or reset)
			if (!userHasSetView) {
				const selectedCruise = mapData.cruises.find(c => c.cruiseId === selectedCruiseId)
				if (selectedCruise) {
					zoomToCruise(selectedCruise, setShowCruises)
				}
			}
		}
	}, [selectedCruiseId, mapData, zoomToCruise, userHasSetView])

	// Load GeoJSON when filters change
	useEffect(() => {
		if (mapData?.contractors && initialLoadComplete) {
			const shouldReloadLayers =
				(allAreaLayers.length === 0 && mapData.contractors.length > 0) ||
				mapData.contractors.some(c => !allAreaLayers.some(area => area.contractorId === c.contractorId))

			if (shouldReloadLayers) {
				loadAllVisibleContractors() // Load contractor GeoJSON data
			}
		}
	}, [filters, mapData?.contractors, allAreaLayers, loadAllVisibleContractors, initialLoadComplete])

	// Update summary data based on visible area layers - calculates statistics for the summary panel
	useEffect(() => {
		if (mapData) {
			// Calculate summary statistics from the mapData
			const summary = {
				contractorCount: mapData.contractors.length,
				areaCount: 0,
				blockCount: 0,
				stationCount: 0,
				cruiseCount: mapData.cruises?.length || 0,
				totalAreaSizeKm2: 0,
				contractTypes: {},
				sponsoringStates: {},
			}

			// Calculate station count from cruises
			summary.stationCount = mapData.cruises.reduce((total, c) => total + (c.stations?.length || 0), 0)

			// Use visibleAreaLayers for area calculations rather than mapData.contractors
			// This ensures we have the complete data including totalAreaSizeKm2
			if (visibleAreaLayers && visibleAreaLayers.length > 0) {
				// Count areas
				summary.areaCount = visibleAreaLayers.length

				// Calculate total area directly from visibleAreaLayers
				summary.totalAreaSizeKm2 = visibleAreaLayers.reduce((total, area) => {
					const areaSize = area.totalAreaSizeKm2
					return total + (typeof areaSize === 'number' && !isNaN(areaSize) ? areaSize : 0)
				}, 0)

				// Count blocks
				summary.blockCount = visibleAreaLayers.reduce((total, area) => total + (area.blocks?.length || 0), 0)
			} else {
				// If area data isn't loaded yet, check database values as fallback
				// Based on DbInitializer.cs, we know the total should be approximately 390,000 km²
				const contractorAreas = {
					1: 75000, // Exploration Area 1 (BGR)
					2: 70000, // Exploration Area 1 (COMRA)
					3: 73000, // Exploration Area 1 (CMM)
					4: 68000, // Exploration Area 1 (BPHDC)
					5: 75000, // Exploration Area 1 (DORD)
					6: 10000, // Mid-Atlantic Ridge Exploration Zone
					7: 10000, // Central Indian Ridge Exploration Area
					8: 9000, // Western Pacific Seamount Chain
				}

				// Calculate area and block counts from the contractors that are visible
				mapData.contractors.forEach(contractor => {
					if (selectedContractorId && contractor.contractorId !== selectedContractorId) {
						return
					}

					// Add estimated area from known values
					if (contractorAreas[contractor.contractorId]) {
						summary.totalAreaSizeKm2 += contractorAreas[contractor.contractorId]
					}

					// Count areas as best we can from mapData
					const areasCount = contractor.areas?.length || 0
					summary.areaCount += areasCount

					// Count blocks as best we can from mapData
					const blocksCount =
						contractor.areas?.reduce((total, area) => {
							return total + (area.blocks?.length || 0)
						}, 0) || 0
					summary.blockCount += blocksCount
				})
			}

			// Process contractors based on selection for metadata like types and states
			mapData.contractors.forEach(contractor => {
				// If a specific contractor is selected, only process that one
				if (selectedContractorId && contractor.contractorId !== selectedContractorId) {
					return
				}

				// Count by contract type
				if (contractor.contractType) {
					summary.contractTypes[contractor.contractType] = (summary.contractTypes[contractor.contractType] || 0) + 1
				}

				// Count by sponsoring state
				if (contractor.sponsoringState) {
					summary.sponsoringStates[contractor.sponsoringState] =
						(summary.sponsoringStates[contractor.sponsoringState] || 0) + 1
				}
			})

			setSummaryData(summary) // Update summary data state
		}
	}, [mapData, selectedContractorId, visibleAreaLayers]) // Added visibleAreaLayers as dependency

	// Effect for global map functions - exposed to window for external access
	useEffect(() => {
		if (mapRef.current) {
			window.mapInstance = mapRef.current.getMap() // Expose map instance to window

			// Function to control cruise visibility
			window.showCruises = show => {
				setShowCruises(show) // Set cruise visibility
			}

			// Function to associate stations with blocks based on spatial relationship
			window.associateStationsWithBlocks = async () => {
				try {
					setLocalLoading(true)
					setToastMessage('Associating stations with blocks...')
					setShowToast(true)

					const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api'
					const response = await fetch(`${API_BASE_URL}/Analytics/associate-stations-blocks`, {
						method: 'POST',
					})

					if (!response.ok) {
						throw new Error('Failed to associate stations with blocks')
					}

					setToastMessage('Stations successfully associated with blocks!')
					setShowToast(true)

					// Refresh data to show updated associations
					refreshData()
				} catch (error) {
					console.error('Error associating stations with blocks:', error)
					setToastMessage('Error associating stations with blocks')
					setShowToast(true)
				} finally {
					setLocalLoading(false)
				}
			}

			// Function to show block analytics with spatial awareness
			window.showBlockAnalytics = async blockId => {
				// Set loading state immediately for user feedback
				setLocalLoading(true)

				try {
					console.log(`Fetching analytics for block ${blockId}`)

					// First, call the API to associate stations with blocks based on coordinates
					// This ensures we catch any stations that are geographically within the block boundaries
					await window.associateStationsWithBlocks()

					// Now find the block in visible layers if possible
					const block = visibleAreaLayers.flatMap(area => area.blocks || []).find(b => b.blockId === blockId)

					if (block) {
						console.log(`Block ${blockId} found in visible layers`)
						zoomToBlock(block) // Zoom to the block
					}

					// Fetch analytics with the updated associations
					const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api'
					const response = await fetch(`${API_BASE_URL}/Analytics/block/${blockId}`)

					if (!response.ok) {
						throw new Error(`Failed to fetch block analytics: ${response.status}`)
					}

					const data = await response.json()
					console.log('Block analytics data received:', data)

					// Now we should have proper data with spatial associations included
					setBlockAnalytics(data)
					setDetailPanelType('blockAnalytics')
					setShowDetailPanel(true)

					// If we didn't find the block in visible layers, try to find it in all data
					if (!block) {
						console.log('Block not in visible layers, finding in all data')
						const allBlocks = mapData?.contractors?.flatMap(c => c.areas || [])?.flatMap(a => a.blocks || []) || []

						const fullBlock = allBlocks.find(b => b.blockId === blockId)

						if (fullBlock) {
							// If we find the block, select its contractor for context
							if (fullBlock.contractorId) {
								handleContractorSelect(fullBlock.contractorId)
							}

							// And zoom to it
							if (fullBlock.centerLatitude && fullBlock.centerLongitude) {
								mapRef.current.flyTo({
									center: [fullBlock.centerLongitude, fullBlock.centerLatitude],
									zoom: 9,
									duration: 800,
								})
							}
						} else if (data.block?.centerLongitude && data.block?.centerLatitude) {
							// Fallback to API coordinates
							mapRef.current.flyTo({
								center: [data.block.centerLongitude, data.block.centerLatitude],
								zoom: 9,
								duration: 800,
							})
						}
					}
				} catch (error) {
					console.error('Error in showBlockAnalytics:', error)
					setToastMessage('Error retrieving block data')
					setShowToast(true)
				} finally {
					setLocalLoading(false)
				}
			}

			// Function for showing cruise details with enhanced zooming
			window.showCruiseDetails = (cruiseId, showDetails = false) => {
				// Find cruise
				const cruise = mapData?.cruises.find(c => c.cruiseId === cruiseId)
				if (cruise) {
					console.log(`Showing cruise details for ${cruise.cruiseName}`)

					// Ensure cruises are visible first
					setShowCruises(true)

					// Set selected cruise ID
					setSelectedCruiseId(cruiseId)

					// Make sure user has set view is false to allow our zoom to take effect
					setUserHasSetView(false)

					// Perform zoom immediately, don't wait for effect
					if (mapRef.current) {
						// Log information about the cruise for debugging
						console.log(`Zooming to cruise: ${cruise.cruiseName}`, {
							hasCenter: !!cruise.centerLatitude && !!cruise.centerLongitude,
							stationCount: cruise.stations?.length || 0,
							contractorId: cruise.contractorId,
						})

						zoomToCruise(cruise, setShowCruises)
					}

					// Show detail panel only if showDetails is true
					if (showDetails) {
						// Increased delay to ensure zoom happens first
						setTimeout(() => {
							setDetailPanelType('cruise')
							setShowDetailPanel(true)
						}, 200)
					}
				} else {
					console.warn(`Cruise with ID ${cruiseId} not found`)
				}
			}

			// Function for showing station details
			window.showStationDetails = stationId => {
				console.log(`Looking for station with ID: ${stationId}`)

				// First make sure stations and cruises are visible
				setShowStations(true)
				setShowCruises(true)

				// Find the station in the full list of stations
				const station = getAllStations().find(s => s.stationId === stationId)

				if (station) {
					console.log(`Found station: ${station.stationCode || station.stationName || `Station #${station.stationId}`}`)

					// Set selected station state
					setSelectedStation(station)
					setDetailPanelType('station')
					setShowDetailPanel(true)

					// If the station is part of a cruise, select that cruise too for context
					if (station.cruiseId) {
						setSelectedCruiseId(station.cruiseId)

						// Find the parent cruise
						const parentCruise = mapData?.cruises?.find(c => c.cruiseId === station.cruiseId)
						if (parentCruise && parentCruise.contractorId) {
							// Set the parent contractor too for complete context
							setSelectedContractorId(parentCruise.contractorId)
						}
					}

					// Zoom to the station's position with a small delay to ensure the map has updated
					if (mapRef.current && station.latitude && station.longitude) {
						setTimeout(() => {
							mapRef.current.flyTo({
								center: [station.longitude, station.latitude],
								zoom: 12,
								duration: 800,
								essential: true,
							})

							// Display a toast confirmation
							setToastMessage(
								`Showing station: ${station.stationCode || station.stationName || `#${station.stationId}`}`
							)
							setShowToast(true)
						}, 100)
					}
				} else {
					console.warn(`Station with ID ${stationId} not found in map data`)

					// Check if we have coordinates in sessionStorage as fallback
					if (typeof window !== 'undefined') {
						const coordinatesStr = sessionStorage.getItem('showStationCoordinates')
						if (coordinatesStr) {
							try {
								const coordinates = JSON.parse(coordinatesStr)
								mapRef.current.flyTo({
									center: [coordinates.longitude, coordinates.latitude],
									zoom: 12,
									duration: 800,
									essential: true,
								})

								// Display a toast noting we're showing the location but couldn't find details
								const stationName = sessionStorage.getItem('showStationName') || `Station #${stationId}`
								setToastMessage(`Showing location of ${stationName} (limited details available)`)
								setShowToast(true)
							} catch (e) {
								console.error('Error parsing station coordinates:', e)
							}
						} else {
							setToastMessage(`Station with ID ${stationId} not found`)
							setShowToast(true)
						}
					}
				}
			}
		}

		return () => {
			// Clean up global objects
			window.mapInstance = null
			window.showBlockAnalytics = null
			window.showCruiseDetails = null
			window.showStationDetails = null
			window.showCruises = null
		}
	}, [
		mapRef.current,
		visibleAreaLayers,
		mapData,
		zoomToBlock,
		zoomToCruise,
		getAllStations,
		fetchBlockAnalytics,
		setSelectedStation,
		setSelectedCruiseId,
		setDetailPanelType,
		setShowDetailPanel,
	])

	// Effect for pendingZoom
	useEffect(() => {
		if (pendingZoomContractorId && allAreaLayers.length > 0) {
			smartZoom() // Trigger zoom when areas are loaded
		}
	}, [allAreaLayers, pendingZoomContractorId, smartZoom])

	// Effect to ensure cruises and stations are visible when a contractor is selected
	useEffect(() => {
		if (selectedContractorId) {
			setShowCruises(true) // Important! Ensure cruises are shown
			setShowStations(true) // Important! Ensure stations are shown
			console.log(`Contractor ${selectedContractorId} selected - ensuring cruises and stations are visible`)
		}
	}, [selectedContractorId])

	// Effect to expose a diagnostic function for debugging
	useEffect(() => {
		// Expose a diagnostic function that can be run from the console
		window.diagnoseMapData = () => {
			const data = {
				originalMapData,
				currentMapData: mapData,
				filters,
				contractorCount: mapData?.contractors?.length || 0,
				cruiseCount: mapData?.cruises?.length || 0,
				stationCount: mapData?.cruises?.reduce((acc, c) => acc + (c.stations?.length || 0), 0) || 0,
				selectedContractorId,
				showCruises, // Check if cruises are set to be shown
				showStations, // Check if stations are set to be shown
			}
			console.log('Map Data Diagnostics:', data)
			return data
		}

		return () => {
			window.diagnoseMapData = undefined // Clean up on unmount
		}
	}, [mapData, originalMapData, filters, selectedContractorId, showCruises, showStations])

	// Loading/error states
	if (loading && !mapData) {
		return <div className={styles.mapLoading}>Loading map data...</div>
	}

	if (error) {
		return <div className={styles.mapError}>Error: {error}</div>
	}

	return (
		<div className={styles.mapContainer}>
			{' '}
			{/* Main container for the map and UI */}
			{/* Summary Panel - statistics and overview */}
			{showSummaryPanel && (
				<SummaryPanel
					data={summaryData}
					onClose={() => setShowSummaryPanel(false)}
					selectedContractorInfo={selectedContractorId ? selectedContractorInfo : null}
					contractorSummary={selectedContractorId ? contractorSummary : null}
					onViewContractorSummary={handleViewContractorSummary}
					mapData={mapData}
					setSelectedCruiseId={setSelectedCruiseId}
					setDetailPanelType={setDetailPanelType}
					setShowDetailPanel={setShowDetailPanel}
				/>
			)}
			{/* Layer Controls - toggle visibility of map features */}
			<CompactLayerControls
				showAreas={showAreas}
				setShowAreas={setShowAreas}
				showBlocks={showBlocks}
				setShowBlocks={setShowBlocks}
				showStations={showStations}
				setShowStations={setShowStations}
				showCruises={showCruises}
				setShowCruises={setShowCruises}
				mapStyle={mapStyle}
				setMapStyle={setMapStyle}
				showSummary={showSummaryPanel}
				setShowSummary={setShowSummaryPanel}
			/>
			{/* THE MAP - Main MapBox GL component */}
			<Map
				{...viewState} // Spread current view state (zoom, center, etc.)
				ref={mapRef} // Reference for accessing map methods
				onMove={handleViewStateChange} // Handle pan/zoom
				onMouseMove={evt => {
					setCursorPosition({
						latitude: evt.lngLat.lat.toFixed(6),
						longitude: evt.lngLat.lng.toFixed(6),
					})
				}} // Update cursor coordinates
				style={{ width: '100%', height: '100%' }}
				mapStyle={mapStyle} // Current map style (satellite, streets, etc.)
				mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} // MapBox API token
				interactiveLayerIds={visibleAreaLayers.flatMap(
					area => area.blocks?.map(block => `block-fill-${block.blockId}`) || []
				)} // Layers that can be clicked
				onLoad={() => {
					console.log('Map onLoad triggered')
					window.mapInstance = mapRef.current?.getMap()

					// Initial view on first load - only once
					if (!initialLoadComplete && mapRef.current) {
						setInitialLoadComplete(true)

						// Check if we need to show a station from gallery
						if (typeof window !== 'undefined') {
							console.log('Checking for station data in sessionStorage')

							// Check for our special map prefix to avoid conflicts
							const stationId = sessionStorage.getItem('mapShowStationId')
							const coordinatesStr = sessionStorage.getItem('mapShowCoordinates')
							const lat = sessionStorage.getItem('mapShowLatitude')
							const lon = sessionStorage.getItem('mapShowLongitude')

							if ((stationId && lat && lon) || coordinatesStr) {
								console.log('Found station data to show on map load')

								// First make sure stations are visible
								setShowStations(true)
								setShowCruises(true)

								// Get zoom level
								const zoomLevel = parseInt(sessionStorage.getItem('mapShowZoomLevel') || '16')

								// Parse coordinates in multiple ways for redundancy
								let latitude, longitude

								if (lat && lon) {
									// Direct values
									latitude = parseFloat(lat)
									longitude = parseFloat(lon)
								} else if (coordinatesStr) {
									// JSON object
									try {
										const coords = JSON.parse(coordinatesStr)
										latitude = coords.latitude
										longitude = coords.longitude
									} catch (e) {
										console.error('Error parsing coordinates:', e)
									}
								}

								if (latitude && longitude) {
									console.log(`Will zoom to: ${longitude}, ${latitude} at zoom ${zoomLevel}`)

									// Use a long delay to ensure map is fully loaded and ready
									setTimeout(() => {
										console.log('Executing zoom now')

										// Use direct map instance method for most reliable zooming
										const map = mapRef.current.getMap()
										if (map) {
											// First jump to the rough location immediately
											map.jumpTo({
												center: [longitude, latitude],
											})

											// Then smoothly zoom to the final view
											map.easeTo({
												center: [longitude, latitude],
												zoom: zoomLevel,
												duration: 1200,
												essential: true,
											})

											// Display a toast notification
											const stationName = sessionStorage.getItem('mapShowStationName') || `Location`
											setToastMessage(`Showing ${stationName}`)
											setShowToast(true)

											// If we have a station ID, try to select it after zooming
											if (stationId && window.showStationDetails) {
												setTimeout(() => {
													window.showStationDetails(parseInt(stationId))
												}, 1500)
											}
										} else {
											console.error('Map instance not available for zooming')
										}
									}, 1000) // Long delay to ensure map is ready

									// Clean up all sessionStorage values
									sessionStorage.removeItem('mapShowStationId')
									sessionStorage.removeItem('mapShowCoordinates')
									sessionStorage.removeItem('mapShowLatitude')
									sessionStorage.removeItem('mapShowLongitude')
									sessionStorage.removeItem('mapShowStationName')
									sessionStorage.removeItem('mapShowZoomLevel')
									sessionStorage.removeItem('mapShowCruiseId')
									sessionStorage.removeItem('mapShowContractorId')

									return // Skip smart zoom
								}
							}
						}

						// Default behavior if no station to show
						smartZoom()
					}
				}}>
				{/* Navigation controls for zooming and panning */}
				<NavigationControl position='top-right' showCompass={true} showZoom={true} />

				{/* Coordinates display for showing cursor position */}
				<CoordinateDisplay latitude={cursorPosition.latitude} longitude={cursorPosition.longitude} />

				{/* Map Layers Component - renders all map features */}
				<MapLayers
					showAreas={showAreas}
					showBlocks={showBlocks}
					showStations={showStations}
					showCruises={showCruises}
					areas={visibleAreaLayers} // Using filtered layers for performance
					cruises={mapData?.cruises || []}
					clusters={clusters}
					clusterIndex={clusterIndex}
					mapRef={mapRef}
					hoveredBlockId={hoveredBlockId}
					onBlockClick={handleBlockClick}
					onCruiseClick={handleCruiseClick}
					onStationClick={handleMarkerClick}
					popupInfo={popupInfo}
					setPopupInfo={setPopupInfo}
				/>

				{/* Button to zoom out to default view */}
				<ZoomOutButton mapRef={mapRef} resetToDefaultView={true} />

				{/* Loading overlay shown during data fetching */}
				{(loading || localLoading) && <LoadingOverlay />}
			</Map>
			{/* Detail panels for showing information about selected items */}
			{/* Station detail panel */}
			{showDetailPanel && detailPanelType === 'station' && (
				<DetailPanel
					type={'station'}
					station={selectedStation}
					contractor={null}
					cruise={null}
					onClose={handlePanelClose}
					mapData={mapData}
				/>
			)}
			{/* Contractor detail panel */}
			{showDetailPanel && detailPanelType === 'contractor' && (
				<DetailPanel
					type={'contractor'}
					station={null}
					contractor={selectedContractor}
					cruise={null}
					onClose={handlePanelClose}
					mapData={mapData}
				/>
			)}
			{/* Cruise detail panel */}
			{showDetailPanel && detailPanelType === 'cruise' && (
				<DetailPanel
					type={'cruise'}
					station={null}
					contractor={null}
					cruise={selectedCruise}
					onClose={handlePanelClose}
					mapData={mapData}
				/>
			)}
			{/* Block analytics panel */}
			{showDetailPanel && detailPanelType === 'blockAnalytics' && blockAnalytics && (
				<BlockAnalyticsPanel data={blockAnalytics} onClose={handlePanelClose} />
			)}
			{/* Contractor summary panel */}
			{showDetailPanel && detailPanelType === 'contractorSummary' && contractorSummary && (
				<ContractorSummaryPanel data={contractorSummary} onClose={handlePanelClose} onCloseAll={handleCloseAllPanels} />
			)}
			{/* Toast notification for short messages */}
			{showToast && <ToastNotification message={toastMessage} onClose={() => setShowToast(false)} />}
		</div>
	)
}

export default MapComponent
