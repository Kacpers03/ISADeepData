// frontend/src/components/map/hooks/useCluster.ts
import { useState, useEffect } from 'react' // Import React hooks for state and effects
import Supercluster from 'supercluster' // Import library for point clustering

// Custom hook that manages station clustering for the map
const useCluster = (mapData, filters, mapRef, getAllStations) => {
	const [clusterIndex, setClusterIndex] = useState(null) // Supercluster instance state
	const [clusters, setClusters] = useState([]) // Current visible clusters state
	const [clusterZoom, setClusterZoom] = useState(0) // Current zoom level for clustering

	// Cluster functionality for stations
	useEffect(() => {
		if (!mapData || !mapData.cruises) return // Skip if no map data available

		// Important: Use getAllStations to get only filtered stations
		const stationsData = getAllStations()

		if (!stationsData.length) {
			// If no stations match filters, we should empty the cluster
			setClusters([])
			return
		}

		const supercluster = new Supercluster({
			radius: 40, // Clustering radius in pixels
			maxZoom: 16, // Maximum zoom level for clustering
		})

		// Format points for supercluster
		const points = stationsData.map(station => ({
			type: 'Feature',
			properties: {
				stationId: station.stationId,
				stationData: station,
			},
			geometry: {
				type: 'Point',
				coordinates: [station.longitude, station.latitude],
			},
		}))

		supercluster.load(points) // Load points into the cluster index
		setClusterIndex(supercluster) // Update cluster index state

		// Important: When filtering changes, immediately update the clusters
		if (mapRef.current) {
			const map = mapRef.current.getMap()
			const zoom = Math.round(map.getZoom())
			const bounds = map.getBounds()
			const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()]

			try {
				const clusterData = supercluster.getClusters(bbox, Math.floor(zoom))
				setClusters(clusterData)
				setClusterZoom(zoom)
			} catch (err) {
				console.warn('Error getting clusters after filter:', err.message)
				setClusters([])
			}
		}
	}, [mapData, filters, getAllStations, mapRef]) // Dependencies for recalculation

	// Update clusters when the map moves or zoom changes
	const updateClusters = viewState => {
		if (!clusterIndex || !mapRef.current) return

		try {
			const map = mapRef.current.getMap()
			const zoom = Math.round(map.getZoom())

			// Only recalculate clusters if zoom has changed significantly
			if (Math.abs(zoom - clusterZoom) > 0.5) {
				setClusterZoom(zoom)

				const bounds = map.getBounds()
				const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()]

				// Get clusters with error handling
				try {
					const clusterData = clusterIndex.getClusters(bbox, Math.floor(zoom))
					setClusters(clusterData)
				} catch (err) {
					console.warn('Error getting clusters:', err.message)
					// Keep existing clusters instead of setting empty
				}
			}
		} catch (err) {
			console.error('Error updating clusters:', err)
		}
	}

	return {
		clusterIndex, // Supercluster instance
		clusters, // Current visible clusters
		clusterZoom, // Current zoom level used for clustering
		setClusterZoom, // Function to manually set cluster zoom
		updateClusters, // Function to update clusters on view change
	}
}

export default useCluster
