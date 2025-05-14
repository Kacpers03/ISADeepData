// frontend/src/components/map/markers/clusterMarker.tsx
import React, { useState, useRef, useEffect } from 'react' // Import React and hooks
import { Marker } from 'react-map-gl' // Import Marker component from react-map-gl
import styles from '../../../styles/map/markers.module.css' // Import marker styles

// Interface defining cluster marker properties
interface ClusterMarkerProps {
	cluster: {
		id: string // Unique ID for the cluster
		longitude: number // Longitude position
		latitude: number // Latitude position
		count: number // Number of points in this cluster
		expansionZoom: number // Zoom level at which cluster expands
	}
	clusterIndex: any // Supercluster instance for getting cluster details
	onClick: () => void // Click handler for cluster expansion
	points?: any[] // Optional array of points in this cluster
	activeClusterId: string | null // ID of currently active cluster
	setActiveClusterId: (id: string | null) => void // Function to set active cluster
}

// Component that renders a cluster of stations on the map
const ClusterMarker: React.FC<ClusterMarkerProps> = ({
	cluster,
	clusterIndex,
	onClick,
	points,
	activeClusterId,
	setActiveClusterId,
}) => {
	const isActive = activeClusterId === cluster.id // Whether this cluster is active
	const tooltipRef = useRef<HTMLDivElement>(null) // Reference to tooltip element
	const markerRef = useRef<HTMLDivElement>(null) // Reference to marker element

	// Calculate marker size based on point count
	const getSize = () => {
		const count = cluster.count
		if (count < 10) return 35 // Small clusters
		if (count < 50) return 45 // Medium clusters
		if (count < 100) return 55 // Large clusters
		return 65 // Very large clusters
	}

	const size = getSize() // Get size for this cluster

	// Get stations that belong to this cluster
	const getClusterStations = () => {
		if (!points || !points.length) {
			// If points aren't provided directly, try to get them from clusterIndex
			try {
				if (clusterIndex) {
					// Get the cluster leaves (stations in this cluster)
					const leaves = clusterIndex.getLeaves(
						parseInt(cluster.id.replace('cluster-', '')), // Extract cluster ID number
						Math.min(cluster.count, 10) // Limit to 10 stations for performance
					)

					return leaves.map(leaf => leaf.properties.stationData)
				}
			} catch (err) {
				console.warn('Could not get cluster stations:', err.message)
			}
			return []
		}

		// If points are directly provided, extract station data
		return points.map(p => p.properties?.stationData).filter(Boolean)
	}

	const stations = getClusterStations() // Get stations for this cluster

	// Handle mouse enter to show tooltip
	const handleMouseEnter = () => {
		setActiveClusterId(cluster.id) // Set this cluster as active
	}

	// Add a global click handler to detect clicks outside the tooltip
	useEffect(() => {
		if (!isActive) return // Only add listener when tooltip is showing

		const handleClickOutside = (event: MouseEvent) => {
			// If the click is outside both the marker and its tooltip, close the tooltip
			if (
				tooltipRef.current &&
				markerRef.current &&
				!tooltipRef.current.contains(event.target as Node) &&
				!markerRef.current.contains(event.target as Node)
			) {
				setActiveClusterId(null) // Clear active cluster
			}
		}

		document.addEventListener('mousedown', handleClickOutside) // Add listener
		return () => {
			document.removeEventListener('mousedown', handleClickOutside) // Remove listener on cleanup
		}
	}, [isActive, setActiveClusterId])

	return (
		<Marker
			longitude={cluster.longitude}
			latitude={cluster.latitude}
			onClick={e => {
				e.originalEvent.stopPropagation() // Prevent map click
				onClick() // Handle cluster click
			}}>
			<div
				ref={markerRef}
				className={`${styles.clusterMarker} ${isActive ? styles.active : ''}`} // Apply active styling if needed
				style={{
					width: `${size}px`, // Set dynamic size
					height: `${size}px`,
				}}
				onMouseEnter={handleMouseEnter}>
				<div className={styles.clusterCount}>{cluster.count}</div> {/* Display station count */}
				{/* Tooltip showing station list - only displayed when active */}
				{isActive && stations.length > 0 && (
					<div
						ref={tooltipRef}
						className={`${styles.clusterTooltip} ${styles.persistentTooltip}`}
						onClick={e => e.stopPropagation()} // Prevent propagation
					>
						<div className={styles.clusterTooltipHeader}>
							<strong>{cluster.count} stations in this area</strong>
							<span className={styles.clusterTooltipSubtext}>Click to zoom in</span>
						</div>
						<div className={styles.clusterTooltipContent}>
							{/* List up to 6 stations in the tooltip */}
							{stations.slice(0, 6).map((station, index) => (
								<div
									key={station?.stationId || index}
									className={styles.clusterStationItem}
									onClick={e => {
										e.stopPropagation() // Prevent propagation
										// If there's a handler for station clicks, call it
										if (typeof window.showStationDetails === 'function' && station?.stationId) {
											window.showStationDetails(station.stationId)
											// Close the tooltip after selecting a station
											setActiveClusterId(null)
										}
									}}>
									<span className={styles.stationCode}>{station?.stationCode || `Station #${station?.stationId}`}</span>
									<span className={styles.stationType}>{station?.stationType || 'Unknown'}</span>
								</div>
							))}
							{/* Show count of remaining stations if there are more than 6 */}
							{cluster.count > 6 && (
								<div className={styles.clusterMoreStations}>+ {cluster.count - 6} more stations...</div>
							)}
						</div>
					</div>
				)}
			</div>
		</Marker>
	)
}

export default ClusterMarker
