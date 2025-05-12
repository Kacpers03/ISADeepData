// frontend/src/components/map/markers/stationMarker.tsx
import React, { useState, useEffect, useRef } from 'react' // Import React and hooks
import { Marker, useMap } from 'react-map-gl' // Import components from react-map-gl
import styles from '../../../styles/map/markers.module.css' // Import marker styles

// Interface defining station marker properties
interface StationMarkerProps {
	station: {
		stationId: number // Unique ID for the station
		stationCode: string // Display code/name for the station
		stationType: string // Type of station (sampling, measurement, etc.)
		latitude: number // Latitude position
		longitude: number // Longitude position
		contractorAreaBlockId?: number // Optional ID linking station to a block
	}
	onClick: (station: any) => void // Click handler for station selection
}

// Component that renders a single station marker on the map
const StationMarker: React.FC<StationMarkerProps> = ({ station, onClick }) => {
	const [isHovered, setIsHovered] = useState(false) // State to track hover for tooltip
	const markerRef = useRef<HTMLDivElement>(null) // Reference to marker element
	const { current: map } = useMap() // Get map instance from context

	// Get appropriate emoji icon based on station type
	const getStationIcon = () => {
		switch (station.stationType?.toLowerCase()) {
			case 'sampling':
				return '🧪' // Test tube emoji
			case 'measurement':
				return '📊' // Chart emoji
			case 'monitoring':
				return '📡' // Satellite dish emoji
			case 'survey':
				return '🔍' // Magnifying glass emoji
			case 'observation':
				return '👁️' // Eye emoji
			case 'research':
				return '🔬' // Microscope emoji
			default:
				return '' // No icon for unknown types
		}
	}

	// Update marker size based on map zoom level
	useEffect(() => {
		if (!map || !markerRef.current) return // Skip if map or marker not ready

		const updateMarkerSize = () => {
			const zoom = map.getZoom() // Get current zoom level

			if (markerRef.current) {
				// Scale markers based on zoom level using CSS variables
				if (zoom < 3) {
					markerRef.current.style.setProperty('--marker-scale', '0.6') // Small when zoomed out
				} else if (zoom < 5) {
					markerRef.current.style.setProperty('--marker-scale', '0.8') // Medium when partly zoomed
				} else if (zoom < 7) {
					markerRef.current.style.setProperty('--marker-scale', '1') // Normal at moderate zoom
				} else {
					markerRef.current.style.setProperty('--marker-scale', '1.2') // Large when zoomed in
				}
			}
		}

		updateMarkerSize() // Initial size update

		// Add zoom change listener
		map.on('zoom', updateMarkerSize)

		// Clean up listener on unmount
		return () => {
			map.off('zoom', updateMarkerSize)
		}
	}, [map])

	return (
		<Marker
			longitude={station.longitude}
			latitude={station.latitude}
			onClick={e => {
				e.originalEvent.stopPropagation() // Prevent map click
				onClick(station) // Handle station click
			}}>
			<div
				id={`marker-${station.stationId}`}
				ref={markerRef}
				className={`${styles.mapMarker} ${station.contractorAreaBlockId ? styles.associatedMarker : ''} ${
					isHovered ? styles.markerHover : ''
				}`} // Apply different styles based on state
				onMouseEnter={() => setIsHovered(true)} // Show tooltip on hover
				onMouseLeave={() => setIsHovered(false)}>
				{' '}
				{/* Hide tooltip when not hovering */}
				<div className={styles.markerIcon}>
					{getStationIcon() && <span className={styles.stationTypeIcon}>{getStationIcon()}</span>}
				</div>
				{/* Tooltip with station details - visible on hover */}
				<div className={styles.stationTooltip}>
					<strong>{station.stationCode}</strong>
					<div>Type: {station.stationType || 'Unknown'}</div>
					<div>
						Coords: {station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}
					</div>
				</div>
			</div>
		</Marker>
	)
}

export default StationMarker
