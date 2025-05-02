import { useState, useEffect } from 'react'
import Supercluster from 'supercluster'

const useCluster = (mapData, filters, mapRef, getAllStations) => {
	const [clusterIndex, setClusterIndex] = useState(null)
	const [clusters, setClusters] = useState([])
	const [clusterZoom, setClusterZoom] = useState(0)

	// Cluster functionality for stations
	useEffect(() => {
		if (!mapData || !mapData.cruises) return

		// Important: Use getAllStations to get only filtered stations
		const stationsData = getAllStations()

		if (!stationsData.length) {
			// If no stations match filters, we should empty the cluster
			setClusters([])
			return
		}

		const supercluster = new Supercluster({
			radius: 40,
			maxZoom: 16,
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

		supercluster.load(points)
		setClusterIndex(supercluster)

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
	}, [mapData, filters, getAllStations, mapRef])

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
		clusterIndex,
		clusters,
		clusterZoom,
		setClusterZoom,
		updateClusters,
	}
}

export default useCluster
