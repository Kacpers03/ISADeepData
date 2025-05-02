import { useCallback, useState, useEffect } from 'react'
import { getLocationBoundaryById } from '../../../constants/locationBoundaries'

const useMapZoom = (mapRef, allAreaLayers, selectedContractorId, filters) => {
	// User has manually set the view (to prevent auto-zooming when unwanted)
	const [userHasSetView, setUserHasSetView] = useState(false)

	// Track pending zoom operations
	const [pendingZoomContractorId, setPendingZoomContractorId] = useState(null)

	// Smart zoom function to be more robust
	const smartZoom = useCallback(() => {
		if (!mapRef.current) return

		// If a location is selected, prioritize zooming to that location
		if (filters.locationId && filters.locationId !== 'all') {
			const locationBoundary = getLocationBoundaryById(filters.locationId)

			if (locationBoundary) {
				// Create a bounds object for the location
				const bounds = [
					[locationBoundary.bounds.minLon, locationBoundary.bounds.minLat],
					[locationBoundary.bounds.maxLon, locationBoundary.bounds.maxLat],
				]

				// Fit the map to these bounds with some padding
				mapRef.current.fitBounds(bounds as [[number, number], [number, number]], {
					padding: 80,
					duration: 1000,
					essential: true,
				})

				console.log(`Smart zoomed to location: ${locationBoundary.name}`)
				return // Exit early since we've already zoomed
			}
		}

		// If a specific contractor is selected, always zoom to their areas regardless of userHasSetView
		if (selectedContractorId && allAreaLayers.length > 0) {
			const contractorAreas = allAreaLayers.filter(area => area.contractorId === selectedContractorId)

			if (contractorAreas.length > 0) {
				// Calculate bounds manually
				let minLat = 90,
					maxLat = -90,
					minLon = 180,
					maxLon = -180
				let boundsSet = false

				contractorAreas.forEach(area => {
					if (area.geoJson && area.geoJson.geometry && area.geoJson.geometry.coordinates) {
						// For polygon types
						const coordinates = area.geoJson.geometry.coordinates[0]
						coordinates.forEach(([lon, lat]) => {
							minLon = Math.min(minLon, lon)
							maxLon = Math.max(maxLon, lon)
							minLat = Math.min(minLat, lat)
							maxLat = Math.max(maxLat, lat)
							boundsSet = true
						})
					} else if (area.centerLongitude && area.centerLatitude) {
						// Fallback to center coordinates
						minLon = Math.min(minLon, area.centerLongitude)
						maxLon = Math.max(maxLon, area.centerLongitude)
						minLat = Math.min(minLat, area.centerLatitude)
						maxLat = Math.max(maxLat, area.centerLatitude)
						boundsSet = true
					}
				})

				// Only zoom if we have valid bounds
				if (boundsSet && minLon < maxLon && minLat < maxLat) {
					// Add padding for better view
					const pad = 2 // Increased padding for a better view

					setTimeout(() => {
						mapRef.current.fitBounds(
							[
								[minLon - pad, minLat - pad],
								[maxLon + pad, maxLat + pad],
							],
							{ padding: 80, duration: 800, maxZoom: 8, essential: true }
						)
					}, 50)

					console.log('Smart zoomed to contractor areas')

					// Clear pending zoom since we've successfully zoomed
					if (pendingZoomContractorId === selectedContractorId) {
						setPendingZoomContractorId(null)
					}

					return
				}
			} else if (pendingZoomContractorId !== selectedContractorId) {
				// If we couldn't find any areas for this contractor, set it as pending
				// This will trigger another zoom attempt when the areas are loaded
				console.log(`Setting pending zoom for contractor ${selectedContractorId}`)
				setPendingZoomContractorId(selectedContractorId)
			}
		}

		// Only reset to world view if no specific filters and user hasn't manually set view
		// OR if filters have been completely reset
		if ((Object.keys(filters).length === 0 && !selectedContractorId) || !userHasSetView) {
			setTimeout(() => {
				mapRef.current.fitBounds(
					[
						[-180, -60],
						[180, 85],
					],
					{ padding: 20, duration: 800, essential: true }
				)
			}, 50)
			console.log('Reset to world view')
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
	])

	// Zoom to specific area
	const zoomToArea = useCallback(
		area => {
			if (!mapRef.current || !area) return

			if (area.geoJson && area.geoJson.geometry && area.geoJson.geometry.coordinates) {
				// For polygon types, calculate bounds
				const coordinates = area.geoJson.geometry.coordinates[0]
				let minLat = 90,
					maxLat = -90,
					minLon = 180,
					maxLon = -180

				coordinates.forEach(([lon, lat]) => {
					minLon = Math.min(minLon, lon)
					maxLon = Math.max(maxLon, lon)
					minLat = Math.min(minLat, lat)
					maxLat = Math.max(maxLat, lat)
				})

				const pad = 1 // Reasonable padding
				setTimeout(() => {
					mapRef.current.fitBounds(
						[
							[minLon - pad, minLat - pad],
							[maxLon + pad, maxLat + pad],
						],
						{ padding: 60, duration: 800, maxZoom: 9, essential: true }
					)
				}, 50)
				console.log('Zoomed to area:', area.areaName)
			} else if (area.centerLatitude && area.centerLongitude) {
				// Fallback to center coordinates
				setTimeout(() => {
					mapRef.current.flyTo({
						center: [area.centerLongitude, area.centerLatitude],
						zoom: 7,
						duration: 800,
						essential: true,
					})
				}, 50)
				console.log('Zoomed to area center:', area.areaName)
			}
		},
		[mapRef]
	)

	// Zoom to specific block
	const zoomToBlock = useCallback(
		block => {
			if (!mapRef.current || !block) return

			if (block.geoJson && block.geoJson.geometry && block.geoJson.geometry.coordinates) {
				// For polygon types, calculate bounds
				const coordinates = block.geoJson.geometry.coordinates[0]
				let minLat = 90,
					maxLat = -90,
					minLon = 180,
					maxLon = -180

				coordinates.forEach(([lon, lat]) => {
					minLon = Math.min(minLon, lon)
					maxLon = Math.max(maxLon, lon)
					minLat = Math.min(minLat, lat)
					maxLat = Math.max(maxLat, lat)
				})

				const pad = 0.5 // Smaller padding for blocks
				setTimeout(() => {
					mapRef.current.fitBounds(
						[
							[minLon - pad, minLat - pad],
							[maxLon + pad, maxLat + pad],
						],
						{ padding: 60, duration: 800, maxZoom: 10, essential: true }
					)
				}, 50)
				console.log('Zoomed to block:', block.blockName)
			} else if (block.centerLatitude && block.centerLongitude) {
				// Fallback to center coordinates
				setTimeout(() => {
					mapRef.current.flyTo({
						center: [block.centerLongitude, block.centerLatitude],
						zoom: 9,
						duration: 800,
						essential: true,
					})
				}, 50)
				console.log('Zoomed to block center:', block.blockName)
			}
		},
		[mapRef]
	)

	// Zoom to specific cruise - IMPROVED AND FIXED
	// Added flag to track active zoom operations
	let isZooming = false

	const zoomToCruise = useCallback(
		(cruise, setShowCruises) => {
			if (!mapRef.current || !cruise) {
				console.error('Missing mapRef or cruise object')
				return
			}

			// Prevent duplicate zoom operations
			if (isZooming) {
				console.log('Zoom already in progress, ignoring new request')
				return
			}

			// Set zooming flag to prevent interruptions
			isZooming = true

			// Ensure we have a valid map instance
			const mapInstance = mapRef.current.getMap()
			if (!mapInstance) {
				console.error('Map instance not available')
				isZooming = false
				return
			}

			// When zooming to a cruise, make sure cruises are visible FIRST
			setShowCruises(true)

			// Log cruise information to debug
			console.log(`DEBUG: Zooming to cruise ${cruise.cruiseName}`, {
				hasCenter: !!cruise.centerLatitude && !!cruise.centerLongitude,
				stations: cruise.stations?.length || 0,
			})

			// PRIORITY 1: Use cruise's own centerLatitude and centerLongitude if available
			if (cruise.centerLatitude && cruise.centerLongitude) {
				console.log(`Zooming to coordinates: [${cruise.centerLongitude}, ${cruise.centerLatitude}]`)

				// Use direct mapInstance reference instead of mapRef.current
				const coordinates = [cruise.centerLongitude, cruise.centerLatitude]

				// CRITICAL: Lock user interaction during zoom
				mapInstance.once('moveend', () => {
					console.log('Zoom completed successfully')
					// Reset flag when zoom finishes
					isZooming = false
				})

				// IMPORTANT: Use a direct call without any delay
				try {
					// Force a more aggressive zoom that can't be interrupted
					mapInstance.jumpTo({
						center: coordinates,
					})

					// Then animate to the final zoom level
					mapInstance.easeTo({
						center: coordinates,
						zoom: 8,
						duration: 1200, // Longer duration
						essential: true, // This ensures the operation can't be interrupted
					})
					console.log('Zoom operation initiated successfully')
				} catch (error) {
					console.error('Error during zoom:', error)
					isZooming = false
				}
				return
			}

			// PRIORITY 2: If cruise has stations, calculate a bounding box to fit all stations
			if (cruise.stations && cruise.stations.length > 0) {
				// If there's only one station, zoom to it
				if (cruise.stations.length === 1) {
					const station = cruise.stations[0]
					console.log('Zooming to single station of cruise:', cruise.cruiseName)

					try {
						// Add event listener to track when zoom completes
						mapInstance.once('moveend', () => {
							console.log('Zoom to station completed')
							isZooming = false
						})

						// Use jumpTo first to ensure the move happens
						mapInstance.jumpTo({
							center: [station.longitude, station.latitude],
						})

						// Then animate to the final zoom level
						mapInstance.easeTo({
							center: [station.longitude, station.latitude],
							zoom: 10,
							duration: 1200,
							essential: true,
						})
					} catch (error) {
						console.error('Error zooming to station:', error)
						isZooming = false
					}
					return
				}

				// Calculate bounds from all stations to show the entire cruise path
				console.log('Calculating bounds from all stations of cruise:', cruise.cruiseName)
				let minLat = 90,
					maxLat = -90,
					minLon = 180,
					maxLon = -180
				let validCoordinates = false

				cruise.stations.forEach(station => {
					if (station.latitude !== undefined && station.longitude !== undefined) {
						minLat = Math.min(minLat, station.latitude)
						maxLat = Math.max(maxLat, station.latitude)
						minLon = Math.min(minLon, station.longitude)
						maxLon = Math.max(maxLon, station.longitude)
						validCoordinates = true
					}
				})

				// Add padding to the bounds for better visibility
				const padding = 0.5 // degrees

				// Only use bounds if we have valid coordinates
				if (validCoordinates) {
					console.log('Zooming to bounds of all stations in cruise:', cruise.cruiseName)

					try {
						// Direct call to fitBounds
						mapInstance.fitBounds(
							[
								[minLon - padding, minLat - padding],
								[maxLon + padding, maxLat + padding],
							],
							{
								padding: 50,
								duration: 1000,
								maxZoom: 10, // Prevent zooming in too far
								essential: true,
							}
						)
					} catch (error) {
						console.error('Error during fitBounds:', error)

						// Fallback to simple flyTo to center of bounds
						try {
							mapInstance.flyTo({
								center: [(minLon + maxLon) / 2, (minLat + maxLat) / 2],
								zoom: 8,
								duration: 1000,
								essential: true,
							})
						} catch (e) {
							console.error('Fallback zoom failed:', e)
						}
					}
					return
				}

				// If we couldn't calculate bounds but have stations, use average position as fallback
				if (cruise.stations.length > 0) {
					let totalLat = 0,
						totalLon = 0,
						count = 0

					cruise.stations.forEach(station => {
						if (station.latitude !== undefined && station.longitude !== undefined) {
							totalLat += station.latitude
							totalLon += station.longitude
							count++
						}
					})

					if (count > 0) {
						const avgLat = totalLat / count
						const avgLon = totalLon / count

						console.log('Zooming to average position of all stations:', cruise.cruiseName)

						// Direct call without setTimeout
						try {
							mapInstance.flyTo({
								center: [avgLon, avgLat],
								zoom: 8,
								duration: 1000,
								essential: true,
							})
						} catch (error) {
							console.error('Error zooming to average position:', error)
						}
						return
					}
				}
			}

			// If all else fails, use default zoom
			console.log('No valid coordinates found, using default zoom')
			try {
				mapInstance.flyTo({
					center: [0, 0],
					zoom: 2,
					duration: 1000,
					essential: true,
				})
			} catch (error) {
				console.error('Default zoom failed:', error)
			} finally {
				// Always reset zooming flag when done
				setTimeout(() => {
					isZooming = false
				}, 1500)
			}
		},
		[mapRef]
	)

	// Effect for pendingZoom
	useEffect(() => {
		if (pendingZoomContractorId && allAreaLayers.length > 0) {
			console.log(`Attempting pending zoom for contractor ${pendingZoomContractorId}`)
			smartZoom()
		}
	}, [allAreaLayers, pendingZoomContractorId, smartZoom])

	return {
		userHasSetView,
		setUserHasSetView,
		smartZoom,
		zoomToArea,
		zoomToBlock,
		zoomToCruise,
		pendingZoomContractorId,
		setPendingZoomContractorId,
	}
}

export default useMapZoom
