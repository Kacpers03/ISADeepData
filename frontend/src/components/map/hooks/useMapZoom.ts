// frontend/src/components/map/hooks/useMapZoom.ts
import { useCallback, useState, useEffect } from 'react' // Import React hooks for state, effects, and callbacks
import { getLocationBoundaryById } from '../../../constants/locationBoundaries' // Import utility to get location data by ID

// Custom hook for map zoom operations and management
const useMapZoom = (mapRef, allAreaLayers, selectedContractorId, filters) => {
	// User has manually set the view (to prevent auto-zooming when unwanted)
	const [userHasSetView, setUserHasSetView] = useState(false) // State to track if user has manually panned/zoomed

	// Track pending zoom operations
	const [pendingZoomContractorId, setPendingZoomContractorId] = useState(null) // Tracks contractor IDs waiting for data to load

	// Smart zoom function to be more robust
	const smartZoom = useCallback(() => {
		if (!mapRef.current) return // Skip if map not ready

		// If a location is selected, prioritize zooming to that location
		if (filters.locationId && filters.locationId !== 'all') {
			const locationBoundary = getLocationBoundaryById(filters.locationId) // Get location data

			if (locationBoundary) {
				// Create a bounds object for the location
				const bounds = [
					[locationBoundary.bounds.minLon, locationBoundary.bounds.minLat], // Southwest corner
					[locationBoundary.bounds.maxLon, locationBoundary.bounds.maxLat], // Northeast corner
				]

				// Fit the map to these bounds with some padding
				mapRef.current.fitBounds(bounds as [[number, number], [number, number]], {
					padding: 80, // Padding around bounds in pixels
					duration: 1000, // Animation duration in milliseconds
					essential: true, // Cannot be interrupted by other camera operations
				})

				console.log(`Smart zoomed to location: ${locationBoundary.name}`) // Log for debugging
				return // Exit early since we've already zoomed
			}
		}

		// If a specific contractor is selected, always zoom to their areas regardless of userHasSetView
		if (selectedContractorId && allAreaLayers.length > 0) {
			const contractorAreas = allAreaLayers.filter(area => area.contractorId === selectedContractorId) // Get areas for contractor

			if (contractorAreas.length > 0) {
				// Calculate bounds manually
				let minLat = 90, // Initialize with extreme values
					maxLat = -90,
					minLon = 180,
					maxLon = -180
				let boundsSet = false // Track if we've found any valid coordinates

				contractorAreas.forEach(area => {
					if (area.geoJson && area.geoJson.geometry && area.geoJson.geometry.coordinates) {
						// For polygon types
						const coordinates = area.geoJson.geometry.coordinates[0] // Get outer ring of polygon
						coordinates.forEach(([lon, lat]) => {
							minLon = Math.min(minLon, lon) // Update min/max values
							maxLon = Math.max(maxLon, lon)
							minLat = Math.min(minLat, lat)
							maxLat = Math.max(maxLat, lat)
							boundsSet = true // We found valid coordinates
						})
					} else if (area.centerLongitude && area.centerLatitude) {
						// Fallback to center coordinates if GeoJSON not available
						minLon = Math.min(minLon, area.centerLongitude)
						maxLon = Math.max(maxLon, area.centerLongitude)
						minLat = Math.min(minLat, area.centerLatitude)
						maxLat = Math.max(maxLat, area.centerLatitude)
						boundsSet = true // We found valid coordinates
					}
				})

				// Only zoom if we have valid bounds
				if (boundsSet && minLon < maxLon && minLat < maxLat) {
					// Add padding for better view
					const pad = 2 // Padding in degrees

					setTimeout(() => {
						mapRef.current.fitBounds(
							[
								[minLon - pad, minLat - pad], // Southwest corner with padding
								[maxLon + pad, maxLat + pad], // Northeast corner with padding
							],
							{ padding: 80, duration: 800, maxZoom: 8, essential: true } // Animation settings
						)
					}, 50) // Small delay for better reliability

					console.log('Smart zoomed to contractor areas') // Log for debugging

					// Clear pending zoom since we've successfully zoomed
					if (pendingZoomContractorId === selectedContractorId) {
						setPendingZoomContractorId(null) // Clear pending zoom
					}

					return // Exit after zooming
				}
			} else if (pendingZoomContractorId !== selectedContractorId) {
				// If we couldn't find any areas for this contractor, set it as pending
				// This will trigger another zoom attempt when the areas are loaded
				console.log(`Setting pending zoom for contractor ${selectedContractorId}`) // Log for debugging
				setPendingZoomContractorId(selectedContractorId) // Set pending zoom
			}
		}

		// Only reset to world view if no specific filters and user hasn't manually set view
		// OR if filters have been completely reset
		if ((Object.keys(filters).length === 0 && !selectedContractorId) || !userHasSetView) {
			setTimeout(() => {
				mapRef.current.fitBounds(
					[
						[-180, -60], // Southwest corner of world
						[180, 85], // Northeast corner of world (avoiding extreme north)
					],
					{ padding: 20, duration: 800, essential: true } // Animation settings
				)
			}, 50) // Small delay for better reliability
			console.log('Reset to world view') // Log for debugging
		}
	}, [
		selectedContractorId,
		allAreaLayers,
		filters,
		userHasSetView,
		pendingZoomContractorId,
		filters.locationId,
		setPendingZoomContractorId,
		mapRef,
	]) // Dependencies for this callback

	// Zoom to specific area
	const zoomToArea = useCallback(
		area => {
			if (!mapRef.current || !area) return // Skip if map or area not ready

			if (area.geoJson && area.geoJson.geometry && area.geoJson.geometry.coordinates) {
				// For polygon types, calculate bounds
				const coordinates = area.geoJson.geometry.coordinates[0] // Get outer ring of polygon
				let minLat = 90, // Initialize with extreme values
					maxLat = -90,
					minLon = 180,
					maxLon = -180

				coordinates.forEach(([lon, lat]) => {
					minLon = Math.min(minLon, lon) // Update min/max values
					maxLon = Math.max(maxLon, lon)
					minLat = Math.min(minLat, lat)
					maxLat = Math.max(maxLat, lat)
				})

				const pad = 1 // Reasonable padding in degrees
				setTimeout(() => {
					mapRef.current.fitBounds(
						[
							[minLon - pad, minLat - pad], // Southwest corner with padding
							[maxLon + pad, maxLat + pad], // Northeast corner with padding
						],
						{ padding: 60, duration: 800, maxZoom: 9, essential: true } // Animation settings
					)
				}, 50) // Small delay for better reliability
				console.log('Zoomed to area:', area.areaName) // Log for debugging
			} else if (area.centerLatitude && area.centerLongitude) {
				// Fallback to center coordinates
				setTimeout(() => {
					mapRef.current.flyTo({
						center: [area.centerLongitude, area.centerLatitude], // Center coordinates
						zoom: 7, // Reasonable zoom level for an area
						duration: 800, // Animation duration
						essential: true, // Cannot be interrupted
					})
				}, 50) // Small delay for better reliability
				console.log('Zoomed to area center:', area.areaName) // Log for debugging
			}
		},
		[mapRef] // Dependencies for this callback
	)

	// Zoom to specific block
	const zoomToBlock = useCallback(
		block => {
			if (!mapRef.current || !block) return // Skip if map or block not ready

			if (block.geoJson && block.geoJson.geometry && block.geoJson.geometry.coordinates) {
				// For polygon types, calculate bounds
				const coordinates = block.geoJson.geometry.coordinates[0] // Get outer ring of polygon
				let minLat = 90, // Initialize with extreme values
					maxLat = -90,
					minLon = 180,
					maxLon = -180

				coordinates.forEach(([lon, lat]) => {
					minLon = Math.min(minLon, lon) // Update min/max values
					maxLon = Math.max(maxLon, lon)
					minLat = Math.min(minLat, lat)
					maxLat = Math.max(maxLat, lat)
				})

				const pad = 0.5 // Smaller padding for blocks (in degrees)
				setTimeout(() => {
					mapRef.current.fitBounds(
						[
							[minLon - pad, minLat - pad], // Southwest corner with padding
							[maxLon + pad, maxLat + pad], // Northeast corner with padding
						],
						{ padding: 60, duration: 800, maxZoom: 10, essential: true } // Animation settings
					)
				}, 50) // Small delay for better reliability
				console.log('Zoomed to block:', block.blockName) // Log for debugging
			} else if (block.centerLatitude && block.centerLongitude) {
				// Fallback to center coordinates
				setTimeout(() => {
					mapRef.current.flyTo({
						center: [block.centerLongitude, block.centerLatitude], // Center coordinates
						zoom: 9, // Higher zoom level for blocks
						duration: 800, // Animation duration
						essential: true, // Cannot be interrupted
					})
				}, 50) // Small delay for better reliability
				console.log('Zoomed to block center:', block.blockName) // Log for debugging
			}
		},
		[mapRef] // Dependencies for this callback
	)

	// Zoom to specific cruise - IMPROVED AND FIXED
	// Added flag to track active zoom operations
	let isZooming = false // Prevent duplicate zoom operations

	const zoomToCruise = useCallback(
		(cruise, setShowCruises) => {
			if (!mapRef.current || !cruise) {
				console.error('Missing mapRef or cruise object') // Log error
				return // Exit if required objects missing
			}

			// Prevent duplicate zoom operations
			if (isZooming) {
				console.log('Zoom already in progress, ignoring new request') // Log for debugging
				return // Exit if already zooming
			}

			// Set zooming flag to prevent interruptions
			isZooming = true

			// Ensure we have a valid map instance
			const mapInstance = mapRef.current.getMap() // Get Mapbox instance
			if (!mapInstance) {
				console.error('Map instance not available') // Log error
				isZooming = false // Reset flag
				return // Exit if map instance not available
			}

			// When zooming to a cruise, make sure cruises are visible FIRST
			setShowCruises(true) // Ensure cruises layer is visible

			// Log cruise information to debug
			console.log(`DEBUG: Zooming to cruise ${cruise.cruiseName}`, {
				hasCenter: !!cruise.centerLatitude && !!cruise.centerLongitude,
				stations: cruise.stations?.length || 0,
			})

			// PRIORITY 1: Use cruise's own centerLatitude and centerLongitude if available
			if (cruise.centerLatitude && cruise.centerLongitude) {
				console.log(`Zooming to coordinates: [${cruise.centerLongitude}, ${cruise.centerLatitude}]`) // Log for debugging

				// Use direct mapInstance reference instead of mapRef.current
				const coordinates = [cruise.centerLongitude, cruise.centerLatitude] // Center coordinates

				// CRITICAL: Lock user interaction during zoom
				mapInstance.once('moveend', () => {
					console.log('Zoom completed successfully') // Log for debugging
					// Reset flag when zoom finishes
					isZooming = false
				})

				// IMPORTANT: Use a direct call without any delay
				try {
					// Force a more aggressive zoom that can't be interrupted
					mapInstance.jumpTo({
						center: coordinates, // Jump to coordinates immediately
					})

					// Then animate to the final zoom level
					mapInstance.easeTo({
						center: coordinates, // Center on coordinates
						zoom: 8, // Appropriate zoom level for cruise
						duration: 1200, // Longer duration for smoother animation
						essential: true, // This ensures the operation can't be interrupted
					})
					console.log('Zoom operation initiated successfully') // Log for debugging
				} catch (error) {
					console.error('Error during zoom:', error) // Log error
					isZooming = false // Reset zooming flag
				}
				return // Exit after zooming
			}

			// PRIORITY 2: If cruise has stations, calculate a bounding box to fit all stations
			if (cruise.stations && cruise.stations.length > 0) {
				// If there's only one station, zoom to it
				if (cruise.stations.length === 1) {
					const station = cruise.stations[0] // Get the single station
					console.log('Zooming to single station of cruise:', cruise.cruiseName) // Log for debugging

					try {
						// Add event listener to track when zoom completes
						mapInstance.once('moveend', () => {
							console.log('Zoom to station completed') // Log for debugging
							isZooming = false // Reset zooming flag
						})

						// Use jumpTo first to ensure the move happens
						mapInstance.jumpTo({
							center: [station.longitude, station.latitude], // Jump to station immediately
						})

						// Then animate to the final zoom level
						mapInstance.easeTo({
							center: [station.longitude, station.latitude], // Center on station
							zoom: 10, // Higher zoom level for single station
							duration: 1200, // Animation duration
							essential: true, // Cannot be interrupted
						})
					} catch (error) {
						console.error('Error zooming to station:', error) // Log error
						isZooming = false // Reset zooming flag
					}
					return // Exit after zooming
				}

				// Calculate bounds from all stations to show the entire cruise path
				console.log('Calculating bounds from all stations of cruise:', cruise.cruiseName) // Log for debugging
				let minLat = 90, // Initialize with extreme values
					maxLat = -90,
					minLon = 180,
					maxLon = -180
				let validCoordinates = false // Track if we've found valid coordinates

				cruise.stations.forEach(station => {
					if (station.latitude !== undefined && station.longitude !== undefined) {
						minLat = Math.min(minLat, station.latitude) // Update min/max values
						maxLat = Math.max(maxLat, station.latitude)
						minLon = Math.min(minLon, station.longitude)
						maxLon = Math.max(maxLon, station.longitude)
						validCoordinates = true // Mark that we found valid coordinates
					}
				})

				// Add padding to the bounds for better visibility
				const padding = 0.5 // Padding in degrees

				// Only use bounds if we have valid coordinates
				if (validCoordinates) {
					console.log('Zooming to bounds of all stations in cruise:', cruise.cruiseName) // Log for debugging

					try {
						// Direct call to fitBounds
						mapInstance.fitBounds(
							[
								[minLon - padding, minLat - padding], // Southwest corner with padding
								[maxLon + padding, maxLat + padding], // Northeast corner with padding
							],
							{
								padding: 50, // Padding in pixels
								duration: 1000, // Animation duration
								maxZoom: 10, // Prevent zooming in too far
								essential: true, // Cannot be interrupted
							}
						)
					} catch (error) {
						console.error('Error during fitBounds:', error) // Log error

						// Fallback to simple flyTo to center of bounds
						try {
							mapInstance.flyTo({
								center: [(minLon + maxLon) / 2, (minLat + maxLat) / 2], // Center of bounds
								zoom: 8, // Reasonable zoom level
								duration: 1000, // Animation duration
								essential: true, // Cannot be interrupted
							})
						} catch (e) {
							console.error('Fallback zoom failed:', e) // Log error
						}
					}
					return // Exit after zooming
				}

				// If we couldn't calculate bounds but have stations, use average position as fallback
				if (cruise.stations.length > 0) {
					let totalLat = 0, // For calculating average position
						totalLon = 0,
						count = 0

					cruise.stations.forEach(station => {
						if (station.latitude !== undefined && station.longitude !== undefined) {
							totalLat += station.latitude // Sum coordinates
							totalLon += station.longitude
							count++ // Count valid stations
						}
					})

					if (count > 0) {
						const avgLat = totalLat / count // Calculate average position
						const avgLon = totalLon / count

						console.log('Zooming to average position of all stations:', cruise.cruiseName) // Log for debugging

						// Direct call without setTimeout
						try {
							mapInstance.flyTo({
								center: [avgLon, avgLat], // Center on average position
								zoom: 8, // Reasonable zoom level
								duration: 1000, // Animation duration
								essential: true, // Cannot be interrupted
							})
						} catch (error) {
							console.error('Error zooming to average position:', error) // Log error
						}
						return // Exit after zooming
					}
				}
			}

			// If all else fails, use default zoom
			console.log('No valid coordinates found, using default zoom') // Log for debugging
			try {
				mapInstance.flyTo({
					center: [0, 0], // Center on prime meridian/equator
					zoom: 2, // Zoomed out to see large area
					duration: 1000, // Animation duration
					essential: true, // Cannot be interrupted
				})
			} catch (error) {
				console.error('Default zoom failed:', error) // Log error
			} finally {
				// Always reset zooming flag when done
				setTimeout(() => {
					isZooming = false // Reset zooming flag
				}, 1500) // Ensure enough time for animation to complete
			}
		},
		[mapRef] // Dependencies for this callback
	)

	// Effect for pendingZoom - attempts zoom when new areas are loaded
	useEffect(() => {
		if (pendingZoomContractorId && allAreaLayers.length > 0) {
			console.log(`Attempting pending zoom for contractor ${pendingZoomContractorId}`) // Log for debugging
			smartZoom() // Try zooming now that areas may be loaded
		}
	}, [allAreaLayers, pendingZoomContractorId, smartZoom]) // Dependencies for this effect

	// Return all zoom-related state and functions
	return {
		userHasSetView, // Whether user has manually set view
		setUserHasSetView, // Function to set manual view flag
		smartZoom, // Function for intelligent zooming
		zoomToArea, // Function to zoom to specific area
		zoomToBlock, // Function to zoom to specific block
		zoomToCruise, // Function to zoom to specific cruise
		pendingZoomContractorId, // ID of contractor waiting for zoom
		setPendingZoomContractorId, // Function to set pending zoom contractor
	}
}

export default useMapZoom
