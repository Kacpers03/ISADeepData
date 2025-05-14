// frontend/src/components/map/layers/blockLayer.tsx
import React from 'react' // Import React
import { Source, Layer } from 'react-map-gl' // Import map components from react-map-gl

// Interface defining block layer properties
interface BlockLayerProps {
	block: {
		blockId: number // Unique identifier for the block
		blockName: string // Display name for the block
		status: string // Status of the block (active, pending, etc.)
		geoJson: any // GeoJSON data for rendering the block
		centerLatitude?: number // Optional center latitude
		centerLongitude?: number // Optional center longitude
		areaSizeKm2?: number // Optional block size in square km
	}
	hoveredBlockId: number | null // Currently hovered block ID for highlighting
	onBlockClick: (blockId: number) => void // Click handler for block selection
}

// Component that renders an exploration block on the map
const BlockLayer: React.FC<BlockLayerProps> = ({ block, hoveredBlockId, onBlockClick }) => {
	// Get appropriate color based on block status
	const getBlockStatusColor = (status: string): string => {
		switch (status?.toLowerCase()) {
			case 'active':
				return '#059669' // Green for active blocks
			case 'pending':
				return '#d97706' // Amber for pending blocks
			case 'inactive':
				return '#6b7280' // Gray for inactive blocks
			case 'reserved':
				return '#3b82f6' // Blue for reserved blocks
			default:
				return '#059669' // Default to green
		}
	}

	return (
		<Source
			key={`block-source-${block.blockId}`}
			id={`block-source-${block.blockId}`}
			type='geojson'
			data={block.geoJson}>
			{/* Block Fill Layer */}
			<Layer
				id={`block-fill-${block.blockId}`}
				type='fill'
				paint={{
					'fill-color': getBlockStatusColor(block.status), // Color based on status
					'fill-opacity': hoveredBlockId === block.blockId ? 0.6 : 0.3, // Highlight on hover
					'fill-outline-color': getBlockStatusColor(block.status), // Outline matches fill color
				}}
				beforeId='settlement-label' // Render before map labels
				onClick={() => onBlockClick(block.blockId)} // Handle click
			/>

			{/* Block Outline Layer */}
			<Layer
				id={`block-line-${block.blockId}`}
				type='line'
				paint={{
					'line-color': getBlockStatusColor(block.status), // Color based on status
					'line-width': hoveredBlockId === block.blockId ? 2 : 1.5, // Thicker on hover
				}}
				beforeId='settlement-label' // Render before map labels
			/>

			{/* Block Label Layer */}
			<Layer
				id={`block-label-${block.blockId}`}
				type='symbol'
				layout={{
					'text-field': block.blockName, // Display block name
					'text-size': [
						'interpolate', // Interpolate text size based on zoom
						['linear'],
						['zoom'],
						4,
						0, // Hide text when zoomed out
						5,
						10, // Start showing small text
						8,
						12, // Larger text when zoomed in
					],
					'text-anchor': 'center', // Center text
					'text-justify': 'center', // Center justified
					'text-allow-overlap': false, // Don't allow text to overlap
					'text-ignore-placement': false, // Honor placement conflicts
					'text-optional': true, // Text can be omitted if it would overlap
				}}
				paint={{
					'text-color': '#1e3a8a', // Dark blue text color
					'text-halo-color': 'rgba(255, 255, 255, 0.9)', // White text halo
					'text-halo-width': 1.5, // Halo width
				}}
				beforeId='settlement-label' // Render before map labels
			/>
		</Source>
	)
}

export default BlockLayer
