// frontend/src/components/map/hooks/useMapData.ts
import { useState, useCallback, useEffect } from 'react' // Import React hooks for state, effects and callbacks

// Custom hook for handling map data loading and management
const useMapData = (mapData, loading, filters, selectedContractorId) => {
	// Store all loaded GeoJSON data
	const [allAreaLayers, setAllAreaLayers] = useState([]) // State for area layers with GeoJSON
	const [localLoading, setLocalLoading] = useState(false) // State for local data loading operations
	const [contractorSummaryCache, setContractorSummaryCache] = useState({}) // Cache for contractor summary data

	// Helper function to fetch GeoJSON for a contractor
	const fetchContractorGeoJson = useCallback(async contractorId => {
		try {
			const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api' // Get API URL
			const response = await fetch(`${API_BASE_URL}/MapFilter/contractor-areas-geojson/${contractorId}`)

			if (!response.ok) {
				throw new Error('Failed to fetch area data')
			}

			const areasData = await response.json()

			// Add contractorId to each area for filtering later
			return areasData.map(area => ({
				contractorId: contractorId,
				areaId: area.areaId,
				areaName: area.areaName,
				geoJson: typeof area.geoJson === 'string' ? JSON.parse(area.geoJson) : area.geoJson, // Parse if string
				centerLatitude: area.centerLat,
				centerLongitude: area.centerLon,
				totalAreaSizeKm2: area.totalAreaSizeKm2,
				blocks: area.blocks.map(block => ({
					blockId: block.blockId,
					blockName: block.blockName,
					status: block.status,
					geoJson: typeof block.geoJson === 'string' ? JSON.parse(block.geoJson) : block.geoJson, // Parse if string
					centerLatitude: block.centerLat,
					centerLongitude: block.centerLon,
					areaSizeKm2: block.areaSizeKm2,
				})),
			}))
		} catch (error) {
			console.error(`Error fetching GeoJSON for contractor ${contractorId}:`, error)
			return []
		}
	}, [])

	// Get all stations based on current filters
	const getAllStations = useCallback(() => {
		if (!mapData) return []

		// When no filters are applied, show ALL stations
		if (Object.keys(filters).length === 0) {
			return mapData.cruises.flatMap(c => c.stations || [])
		}

		// Get contractors that match current filters
		const filteredContractorIds = mapData.contractors.map(c => c.contractorId)

		// Only get stations from cruises that belong to filtered contractors
		return mapData.cruises
			.filter(cruise => {
				// Only include cruises from contractors that match the filter
				return filteredContractorIds.includes(cruise.contractorId)
			})
			.flatMap(c => c.stations || [])
	}, [mapData, filters])

	// Load all visible contractors' GeoJSON
	const loadAllVisibleContractors = useCallback(async () => {
		if (!mapData?.contractors.length) return

		// Prevent loading if we're already loading
		if (loading || localLoading) {
			console.log('Already loading data, skipping redundant load')
			return
		}

		try {
			setLocalLoading(true)

			// Load GeoJSON for each visible contractor
			const contractorIds = mapData.contractors.map(c => c.contractorId)
			console.log(`Loading GeoJSON for ${contractorIds.length} visible contractors`)

			const promises = contractorIds.map(id => fetchContractorGeoJson(id))

			// Wait for all to complete
			const results = await Promise.allSettled(promises)

			// Collect all successful results
			const allAreas = results
				.filter(result => result.status === 'fulfilled' && result.value)
				.flatMap(result => result.value)

			// Only update if we got new data to prevent unnecessary re-renders
			if (allAreas.length > 0) {
				setAllAreaLayers(prevLayers => {
					// If layers are identical, don't update
					if (
						prevLayers.length === allAreas.length &&
						JSON.stringify(prevLayers.map(a => a.areaId).sort()) === JSON.stringify(allAreas.map(a => a.areaId).sort())
					) {
						return prevLayers
					}
					return allAreas
				})
			}
		} catch (error) {
			console.error('Error loading all contractor GeoJSON:', error)
		} finally {
			setLocalLoading(false)
		}
	}, [mapData?.contractors, fetchContractorGeoJson, loading, localLoading])

	// Fetch contractor summary with caching
	const fetchContractorSummary = async (contractorId, setContractorSummary, setToastMessage, setShowToast) => {
		// Check if we already have this data in cache
		if (contractorSummaryCache[contractorId]) {
			console.log(`Using cached summary for contractor ${contractorId}`)
			setContractorSummary(contractorSummaryCache[contractorId])
			return contractorSummaryCache[contractorId]
		}

		try {
			console.log(`Fetching contractor summary for ${contractorId}`)
			setLocalLoading(true)

			const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api' // Get API URL
			const response = await fetch(`${API_BASE_URL}/Analytics/contractor/${contractorId}/summary`)

			if (!response.ok) {
				throw new Error(`Failed to fetch contractor summary: ${response.status}`)
			}

			const data = await response.json()

			// Update the cache
			setContractorSummaryCache(prev => ({
				...prev,
				[contractorId]: data,
			}))

			// Set the current summary
			setContractorSummary(data)

			// Return the data for chaining
			return data
		} catch (error) {
			console.error('Error fetching contractor summary:', error)
			if (setToastMessage && setShowToast) {
				setToastMessage('Error fetching contractor summary')
				setShowToast(true)
			}
			return null
		} finally {
			setLocalLoading(false)
		}
	}

	// Fetch block analytics with error handling
	const fetchBlockAnalytics = async (
		blockId,
		setBlockAnalytics,
		setDetailPanelType,
		setShowDetailPanel,
		zoomToBlock,
		visibleAreaLayers,
		setToastMessage,
		setShowToast
	) => {
		setLocalLoading(true)

		try {
			console.log(`Fetching analytics for block ${blockId}`)
			const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5062/api' // Get API URL
			const response = await fetch(`${API_BASE_URL}/Analytics/block/${blockId}`)

			if (!response.ok) {
				throw new Error(`Failed to fetch block analytics: ${response.status}`)
			}

			const data = await response.json()
			console.log('Block analytics data received:', data)

			// Ensure data has the expected structure with default values
			const enhancedData = {
				block: data.block || {
					blockId: blockId,
					blockName: `Block ID ${blockId}`,
					status: 'Unknown',
					areaSizeKm2: 0,
					area: {
						areaName: 'Unknown Area',
						contractor: {
							contractorName: 'Unknown Contractor',
						},
					},
				},
				counts: data.counts || {
					stations: 0,
					samples: 0,
					environmentalResults: 0,
					geologicalResults: 0,
				},
				environmentalParameters: data.environmentalParameters || [],
				resourceMetrics: data.resourceMetrics || [],
				sampleTypes: data.sampleTypes || [],
				recentStations: data.recentStations || [],
			}

			// Update the UI
			setBlockAnalytics(enhancedData)
			setDetailPanelType('blockAnalytics')
			setShowDetailPanel(true)

			// Find the block and zoom to it if possible
			const block = visibleAreaLayers.flatMap(area => area.blocks || []).find(b => b.blockId === blockId)

			if (block) {
				zoomToBlock(block)
			} else if (data.block?.centerLatitude && data.block?.centerLongitude) {
				// Use coordinates from the API response if available
				console.log('Block not found in visible layers, zooming using API coordinates')
				if (window.mapInstance) {
					window.mapInstance.flyTo({
						center: [data.block.centerLongitude, data.block.centerLatitude],
						zoom: 9,
						duration: 800,
					})
				}
			} else {
				console.warn(`Block ${blockId} not found in visible layers for zooming`)
			}

			return enhancedData
		} catch (error) {
			console.error('Error fetching block analytics:', error)

			// Create a minimal default structure to avoid rendering errors
			const defaultData = {
				block: {
					blockId: blockId,
					blockName: `Block ID ${blockId}`,
					status: 'Unknown',
					areaSizeKm2: 0,
					area: {
						areaName: 'Unknown Area',
						contractor: {
							contractorName: 'Unknown Contractor',
						},
					},
				},
				counts: {
					stations: 0,
					samples: 0,
					environmentalResults: 0,
					geologicalResults: 0,
				},
				environmentalParameters: [],
				resourceMetrics: [],
				sampleTypes: [],
				recentStations: [],
			}

			// Still update the UI to show something
			setBlockAnalytics(defaultData)
			setDetailPanelType('blockAnalytics')
			setShowDetailPanel(true)

			if (setToastMessage && setShowToast) {
				setToastMessage('Error fetching block data. Showing limited information.')
				setShowToast(true)
			}

			return defaultData
		} finally {
			setLocalLoading(false)
		}
	}

	// Return all data and functions
	return {
		allAreaLayers, // All area layers with GeoJSON
		setAllAreaLayers, // Function to set area layers
		localLoading, // Loading state for data operations
		setLocalLoading, // Function to set loading state
		contractorSummaryCache, // Cache for contractor summaries
		fetchContractorGeoJson, // Function to fetch contractor GeoJSON
		loadAllVisibleContractors, // Function to load all visible contractors
		fetchContractorSummary, // Function to fetch contractor summary
		fetchBlockAnalytics, // Function to fetch block analytics
		getAllStations, // Function to get filtered stations
	}
}

export default useMapData
