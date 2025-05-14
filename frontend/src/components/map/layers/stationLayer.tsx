// frontend/src/components/map/layers/stationLayer.tsx
import React, { useState, useEffect } from 'react' // Import React and hooks
import StationMarker from '../markers/stationMarker' // Import component for single stations
import ClusterMarker from '../markers/clusterMarker' // Import component for station clusters

// Interface defining station layer properties
interface StationLayerProps {
	clusters: any[] // Array of station clusters from Supercluster
	showStations: boolean // Toggle for station visibility
	clusterIndex: any // Supercluster instance for cluster operations
	mapRef: any // Reference to the map component
	onStationClick: (station: any) => void // Click handler for station selection
}

// Component that renders station markers and clusters on the map
const StationLayer: React.FC<StationLayerProps> = ({
	clusters,
	showStations,
	clusterIndex,
	mapRef,
	onStationClick,
}) => {
	// State for tracking the active cluster tooltip
	const [activeClusterId, setActiveClusterId] = useState<string | null>(null)

	// Effect to close active tooltip when map moves significantly
	useEffect(() => {
		if (!mapRef.current || !activeClusterId) return

		const map = mapRef.current.getMap()

		const handleMapMove = () => {
			// Close the tooltip when the map moves
			setActiveClusterId(null)
		}

		// Add event listener for moveend (when map stops moving)
		map.on('moveend', handleMapMove)

		// Clean up listener on unmount or when dependencies change
		return () => {
			map.off('moveend', handleMapMove)
		}
	}, [activeClusterId, mapRef])

	// If stations not visible or no clusters, render nothing
	if (!showStations || !clusters || clusters.length === 0) {
		return null
	}

	return (
		<>
			{clusters.map(cluster => {
				// Check if this is a cluster or an individual station
				const isCluster = cluster.properties.cluster
				const clusterId = isCluster
					? `cluster-${cluster.properties.cluster_id}`
					: `station-${cluster.properties.stationId}`

				if (isCluster) {
					// Handle cluster of stations
					// Get the cluster points if possible
					const clusterPoints = (() => {
						try {
							if (clusterIndex) {
								// Get the points in this cluster (limit to 10 for performance)
								return clusterIndex.getLeaves(
									cluster.properties.cluster_id,
									Math.min(cluster.properties.point_count, 10)
								)
							}
						} catch (err) {
							console.warn('Could not get cluster leaves:', err.message)
						}
						return []
					})()

					return (
						<ClusterMarker
							key={clusterId}
							cluster={{
								id: clusterId,
								longitude: cluster.geometry.coordinates[0],
								latitude: cluster.geometry.coordinates[1],
								count: cluster.properties.point_count,
								// Calculate appropriate zoom level for expanding cluster
								expansionZoom: (() => {
									try {
										return clusterIndex.getClusterExpansionZoom(cluster.properties.cluster_id)
									} catch (err) {
										console.warn('Could not get expansion zoom for cluster:', cluster.properties.cluster_id)
										return Math.min(mapRef.current?.getMap().getZoom() + 2 || 10, 16) // Default zoom increase
									}
								})(),
							}}
							clusterIndex={clusterIndex}
							points={clusterPoints}
							activeClusterId={activeClusterId}
							setActiveClusterId={setActiveClusterId}
							onClick={() => {
								// Zoom in when cluster is clicked
								try {
									const [longitude, latitude] = cluster.geometry.coordinates
									let expansionZoom

									try {
										expansionZoom = clusterIndex.getClusterExpansionZoom(cluster.properties.cluster_id)
									} catch (err) {
										console.warn('Could not get expansion zoom on click:', err.message)
										// Use a default zoom increase as fallback
										expansionZoom = Math.min(mapRef.current.getMap().getZoom() + 2, 16)
									}

									// Animate map to zoom into the cluster
									mapRef.current.flyTo({
										center: [longitude, latitude],
										zoom: expansionZoom,
										duration: 500,
									})

									// Close any active tooltip when zooming
									setActiveClusterId(null)
								} catch (err) {
									console.error('Error handling cluster click:', err)
								}
							}}
						/>
					)
				} else {
					// Handle individual station
					const station = cluster.properties.stationData
					return <StationMarker key={clusterId} station={station} onClick={onStationClick} />
				}
			})}
		</>
	)
}

export default StationLayer
