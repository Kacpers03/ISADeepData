import React, { useState, useEffect, useRef } from 'react'
import { Marker, useMap } from 'react-map-gl'
import styles from '../../../styles/map/markers.module.css'
interface StationMarkerProps {
	station: {
		stationId: number
		stationCode: string
		stationType: string
		latitude: number
		longitude: number
		contractorAreaBlockId?: number
	}
	onClick: (station: any) => void
}

const StationMarker: React.FC<StationMarkerProps> = ({ station, onClick }) => {
	const [isHovered, setIsHovered] = useState(false)
	const markerRef = useRef<HTMLDivElement>(null)
	const { current: map } = useMap()

	// Get appropriate icon based on station type
	const getStationIcon = () => {
		switch (station.stationType?.toLowerCase()) {
			case 'sampling':
				return '🧪'
			case 'measurement':
				return '📊'
			case 'monitoring':
				return '📡'
			case 'survey':
				return '🔍'
			case 'observation':
				return '👁️'
			case 'research':
				return '🔬'
			default:
				return ''
		}
	}

	// Update marker size based on zoom level
	useEffect(() => {
		if (!map || !markerRef.current) return

		const updateMarkerSize = () => {
			const zoom = map.getZoom()

			if (markerRef.current) {
				// Scale markers based on zoom level
				if (zoom < 3) {
					markerRef.current.style.setProperty('--marker-scale', '0.6')
				} else if (zoom < 5) {
					markerRef.current.style.setProperty('--marker-scale', '0.8')
				} else if (zoom < 7) {
					markerRef.current.style.setProperty('--marker-scale', '1')
				} else {
					markerRef.current.style.setProperty('--marker-scale', '1.2')
				}
			}
		}

		updateMarkerSize()

		// Add zoom event listener
		map.on('zoom', updateMarkerSize)

		return () => {
			map.off('zoom', updateMarkerSize)
		}
	}, [map])

	return (
		<Marker
			longitude={station.longitude}
			latitude={station.latitude}
			onClick={e => {
				e.originalEvent.stopPropagation()
				onClick(station)
			}}>
			<div
				id={`marker-${station.stationId}`}
				ref={markerRef}
				className={`${styles.mapMarker} ${station.contractorAreaBlockId ? styles.associatedMarker : ''} ${
					isHovered ? styles.markerHover : ''
				}`}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}>
				<div className={styles.markerIcon}>
					{getStationIcon() && <span className={styles.stationTypeIcon}>{getStationIcon()}</span>}
				</div>

				{/* Tooltip appears on hover */}
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
