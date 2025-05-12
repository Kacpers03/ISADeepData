// frontend/src/components/map/hooks/useMapInteractions.ts
import { useCallback } from 'react' // Import React useCallback hook for memoized functions

// Custom hook for map interactions and event handlers
const useMapInteractions = ({
	mapRef, // Reference to map component
	viewState, // Current map view state
	setViewState, // Function to update view state
	setUserHasSetView, // Function to track if user manually set view
	setViewBounds, // Function to update view bounds
	updateClusters, // Function to update station clusters
	setSelectedCruiseId, // Function to set selected cruise
	setDetailPanelType, // Function to set detail panel type
	setShowDetailPanel, // Function to toggle detail panel
	setPopupInfo, // Function to set popup information
	setSelectedStation, // Function to set selected station
	zoomToCruise, // Function to zoom to cruise
	zoomToArea, // Function to zoom to area
	zoomToBlock, // Function to zoom to block
	setShowCruises, // Function to toggle cruise visibility
	resetFilters, // Function to reset all filters
	fetchBlockAnalytics, // Function to fetch block analytics
	blockAnalytics, // Current block analytics data
	setBlockAnalytics, // Function to set block analytics
	visibleAreaLayers, // Currently visible area layers
	selectedContractorId, // Currently selected contractor ID
	contractorSummary, // Current contractor summary data
	setContractorSummary, // Function to set contractor summary
	fetchContractorSummary, // Function to fetch contractor summary
	setToastMessage, // Function to set toast message
	setShowToast, // Function to toggle toast visibility
}) => {
	// Handle view state change when map moves
	const handleViewStateChange = useCallback(
		evt => {
			setViewState(evt.viewState) // Update view state
			// User has manually changed the view
			setUserHasSetView(true)

			// Update view bounds for future API requests
			if (mapRef.current) {
				const bounds = mapRef.current.getMap().getBounds()
				setViewBounds({
					minLat: bounds.getSouth(),
					maxLat: bounds.getNorth(),
					minLon: bounds.getWest(),
					maxLon: bounds.getEast(),
				})
			}

			// Update clusters when view changes
			updateClusters(evt.viewState)
		},
		[mapRef, setViewState, setUserHasSetView, setViewBounds, updateClusters]
	)

	// Handle cruise click - show details and zoom
	const handleCruiseClick = useCallback(
		cruise => {
			console.log('Cruise clicked:', cruise.cruiseName)

			// First ensure cruises are visible
			setShowCruises(true)

			// Set selected cruise ID
			setSelectedCruiseId(cruise.cruiseId)

			// Make sure user has set view is false to allow our zoom to take effect
			setUserHasSetView(false)

			// Zoom to the cruise immediately (don't wait for effect)
			if (mapRef.current && cruise) {
				// Log information about the cruise for debugging
				console.log(`Zooming to cruise: ${cruise.cruiseName}`, {
					hasCenter: !!cruise.centerLatitude && !!cruise.centerLongitude,
					stationCount: cruise.stations?.length || 0,
					contractorId: cruise.contractorId,
				})

				// Direct zoom call instead of waiting for effect
				zoomToCruise(cruise, setShowCruises)
			}

			// Show detail panel after a small delay to ensure zoom happens first
			setTimeout(() => {
				setDetailPanelType('cruise')
				setShowDetailPanel(true)
				setPopupInfo(null) // Close any open popups
			}, 200) // Increased delay to ensure zoom completes
		},
		[
			setSelectedCruiseId,
			setDetailPanelType,
			setShowDetailPanel,
			setPopupInfo,
			setShowCruises,
			setUserHasSetView,
			zoomToCruise,
			mapRef,
		]
	)

	// Handle marker (station) click - show details
	const handleMarkerClick = useCallback(
		station => {
			setSelectedStation(station)
			setDetailPanelType('station')
			setShowDetailPanel(true)
			setPopupInfo(null) // Close any open popup
		},
		[setSelectedStation, setDetailPanelType, setShowDetailPanel, setPopupInfo]
	)

	// Handle panel close - reset UI state but keep contractor selection
	const handlePanelClose = useCallback(() => {
		// Only reset the UI state, but keep the contractor summary data
		setShowDetailPanel(false)
		setDetailPanelType(null)

		// Only reset station selection, keep contractor selection and data
		setSelectedStation(null)

		// Only reset block analytics
		setBlockAnalytics(null)
	}, [setShowDetailPanel, setDetailPanelType, setSelectedStation, setBlockAnalytics])

	// Handle close all panels - more complete reset of UI state
	const handleCloseAllPanels = useCallback(() => {
		// Close the detail panel
		setShowDetailPanel(false)
		setDetailPanelType(null)

		// Reset selected items
		setSelectedStation(null)

		// Reset analytics data but don't clear selection
		setBlockAnalytics(null)
		setContractorSummary(null)
	}, [setShowDetailPanel, setDetailPanelType, setSelectedStation, setBlockAnalytics, setContractorSummary])

	// View contractor summary - fetch data if needed and show panel
	const handleViewContractorSummary = useCallback(() => {
		if (selectedContractorId && contractorSummary) {
			setDetailPanelType('contractorSummary')
			setShowDetailPanel(true)
		} else if (selectedContractorId) {
			// If we have the ID but no summary, fetch it first
			fetchContractorSummary(selectedContractorId, setContractorSummary, setToastMessage, setShowToast).then(
				summary => {
					if (summary) {
						setDetailPanelType('contractorSummary')
						setShowDetailPanel(true)
					}
				}
			)
		}
	}, [
		selectedContractorId,
		contractorSummary,
		fetchContractorSummary,
		setDetailPanelType,
		setShowDetailPanel,
		setContractorSummary,
		setToastMessage,
		setShowToast,
	])

	// Handle reset filters with smart zooming
	const handleResetFilters = useCallback(() => {
		resetFilters()
		setUserHasSetView(false) // Allow auto-zooming after reset
		// The global view zoom will be handled by the smartZoom effect
	}, [resetFilters, setUserHasSetView])

	// Handle block click - fetch data and show details
	const handleBlockClick = useCallback(
		blockId => {
			fetchBlockAnalytics(
				blockId,
				setBlockAnalytics,
				setDetailPanelType,
				setShowDetailPanel,
				zoomToBlock,
				visibleAreaLayers,
				setToastMessage,
				setShowToast
			)
		},
		[
			fetchBlockAnalytics,
			setBlockAnalytics,
			setDetailPanelType,
			setShowDetailPanel,
			zoomToBlock,
			visibleAreaLayers,
			setToastMessage,
			setShowToast,
		]
	)

	// Handle hover on map features - update cursor
	const handleMapHover = useCallback(
		e => {
			if (!mapRef.current) return

			const map = mapRef.current.getMap()
			const features = map.queryRenderedFeatures(e.point, {
				layers: ['block-fill'],
			})

			// Set cursor based on hovering over interactive elements
			if (features.length > 0) {
				map.getCanvas().style.cursor = 'pointer'
			} else {
				map.getCanvas().style.cursor = ''
			}
		},
		[mapRef]
	)

	// Handle area click - zoom to area
	const handleAreaClick = useCallback(
		areaId => {
			if (!visibleAreaLayers) return

			const area = visibleAreaLayers.find(a => a.areaId === areaId)
			if (area) {
				zoomToArea(area)
			}
		},
		[visibleAreaLayers, zoomToArea]
	)

	// Handle station hover - show/hide popup
	const handleStationHover = useCallback(
		(station, show) => {
			if (show) {
				setPopupInfo(station)
			} else if (setPopupInfo) {
				setPopupInfo(null)
			}
		},
		[setPopupInfo]
	)

	// Toggle display of map summary panel
	const toggleSummaryPanel = useCallback(
		show => {
			setShowDetailPanel(!show) // Hide detail panel when showing summary
		},
		[setShowDetailPanel]
	)

	// Return all handlers
	return {
		handleViewStateChange, // Handle map movement/zoom
		handleCruiseClick, // Handle cruise selection
		handleMarkerClick, // Handle station marker selection
		handlePanelClose, // Handle panel close
		handleCloseAllPanels, // Handle closing all panels
		handleViewContractorSummary, // Handle viewing contractor details
		handleResetFilters, // Handle resetting all filters
		handleBlockClick, // Handle block selection
		handleMapHover, // Handle cursor hover on map
		handleAreaClick, // Handle area selection
		handleStationHover, // Handle station hover
		toggleSummaryPanel, // Toggle summary panel
	}
}

export default useMapInteractions
