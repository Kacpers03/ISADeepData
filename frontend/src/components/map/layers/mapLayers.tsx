// frontend/src/components/map/MapLayers.tsx
import React from 'react' // Import React
import { Popup } from 'react-map-gl' // Import Popup component for tooltips
import panelStyles from '../../../styles/map/panels.module.css' // Import panel styling
import markerStyles from '../../../styles/map/markers.module.css' // Import marker styling

// Import layer components
import AreaLayer from './areaLayer' // Component for area polygons
import BlockLayer from './blockLayer' // Component for block polygons
import StationLayer from './stationLayer' // Component for station markers and clusters
import CruiseLayer from './cruiseLayer' // Component for cruise markers

// Interface defining map layers properties
interface MapLayersProps {
	showAreas: boolean // Toggle for area visibility
	showBlocks: boolean // Toggle for block visibility
	showStations: boolean // Toggle for station visibility
	showCruises: boolean // Toggle for cruise visibility
	areas: any[] // Array of area objects with GeoJSON
	cruises: any[] // Array of cruise objects
	clusters: any[] // Array of station clusters
	clusterIndex: any // Supercluster instance for cluster operations
	mapRef: any // Reference to the map component
	hoveredBlockId: number | null // Currently hovered block ID
	popupInfo: any // Information for currently shown popup
	setPopupInfo: (info: any) => void // Function to set popup info
	onBlockClick: (blockId: number) => void // Click handler for blocks
	onCruiseClick: (cruise: any) => void // Click handler for cruises
	onStationClick: (station: any) => void // Click handler for stations
}

// Combine styles from different modules
const styles = {
	...panelStyles,
	...markerStyles,
}

// Component that manages all map layers
const MapLayers: React.FC<MapLayersProps> = ({
	showAreas,
	showBlocks,
	showStations,
	showCruises,
	areas,
	cruises,
	clusters,
	clusterIndex,
	mapRef,
	hoveredBlockId,
	popupInfo,
	setPopupInfo,
	onBlockClick,
	onCruiseClick,
	onStationClick,
}) => {
	return (
		<>
			{/* Areas Layers - Render each exploration area */}
			{showAreas && areas.map(area => <AreaLayer key={`area-${area.areaId}`} area={area} />)}

			{/* Blocks Layers - Render blocks from all areas */}
			{showBlocks &&
				areas.flatMap(area =>
					area.blocks
						? area.blocks.map(block => (
								<BlockLayer
									key={`block-${block.blockId}`}
									block={block}
									hoveredBlockId={hoveredBlockId}
									onBlockClick={onBlockClick}
								/>
						  ))
						: []
				)}

			{/* Cruises Layer - Render cruise markers */}
			<CruiseLayer cruises={cruises} showCruises={showCruises} onCruiseClick={onCruiseClick} />

			{/* Stations Layer - Render station markers and clusters */}
			<StationLayer
				clusters={clusters}
				showStations={showStations}
				clusterIndex={clusterIndex}
				mapRef={mapRef}
				onStationClick={onStationClick}
			/>

			{/* Popup for station info - shown when hovering over a station */}
			{popupInfo && (
				<Popup
					longitude={popupInfo.longitude}
					latitude={popupInfo.latitude}
					anchor='bottom'
					onClose={() => setPopupInfo(null)}
					className={styles.mapPopup}
					closeOnClick={false}>
					<div className={styles.popupContent}>
						<h3>{popupInfo.stationCode}</h3>
						<div className={styles.popupGrid}>
							<div className={styles.popupItem}>
								<span className={styles.popupLabel}>Type</span>
								<span>{popupInfo.stationType || 'Unknown'}</span>
							</div>
							<div className={styles.popupItem}>
								<span className={styles.popupLabel}>Status</span>
								<span>{popupInfo.contractorAreaBlockId ? 'Associated' : 'Unassociated'}</span>
							</div>
						</div>
						<button className={styles.viewDetailsButton} onClick={() => onStationClick(popupInfo)}>
							View Details
						</button>
					</div>
				</Popup>
			)}
		</>
	)
}

export default MapLayers
