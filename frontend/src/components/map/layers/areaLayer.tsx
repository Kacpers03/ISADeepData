// frontend/src/components/map/layers/areaLayer.tsx
import React, { useMemo } from 'react' // Import React and useMemo hook
import { Source, Layer } from 'react-map-gl' // Import map components from react-map-gl

// Interface defining area layer properties
interface AreaLayerProps {
	area: {
		areaId: number // Unique identifier for the area
		areaName: string // Display name for the area
		geoJson: any // GeoJSON data for rendering the area
		centerLatitude?: number // Optional center latitude
		centerLongitude?: number // Optional center longitude
		totalAreaSizeKm2?: number // Optional area size in square km
	}
}

// Component that renders an exploration area on the map
const AreaLayer: React.FC<AreaLayerProps> = ({ area }) => {
	// Dynamically set layer paint properties based on zoom level
	const getAreaPaint = useMemo(
		() => ({
			'fill-color': '#0077b6', // Blue fill color
			'fill-opacity': [
				'interpolate', // Interpolate opacity based on zoom
				['linear'],
				['zoom'],
				2,
				0.08, // Less opacity when zoomed out
				6,
				0.15, // More opacity when zoomed in
			],
			'fill-outline-color': '#0077b6', // Blue outline color
		}),
		[] // No dependencies, doesn't change
	)

	// Style for area outlines
	const getAreaLinePaint = useMemo(
		() => ({
			'line-color': '#0077b6', // Blue line color
			'line-width': [
				'interpolate', // Interpolate line width based on zoom
				['linear'],
				['zoom'],
				2,
				1.5, // Thinner line when zoomed out
				6,
				2.5, // Thicker line when zoomed in
			],
			'line-dasharray': [3, 2], // Dashed line pattern
		}),
		[] // No dependencies, doesn't change
	)

	return (
		<Source key={`area-source-${area.areaId}`} id={`area-source-${area.areaId}`} type='geojson' data={area.geoJson}>
			{/* Area Fill Layer */}
			<Layer id={`area-fill-${area.areaId}`} type='fill' paint={getAreaPaint} beforeId='settlement-label' />

			{/* Area Outline Layer */}
			<Layer id={`area-line-${area.areaId}`} type='line' paint={getAreaLinePaint} beforeId='settlement-label' />

			{/* Area Label Layer */}
			<Layer
				id={`area-label-${area.areaId}`}
				type='symbol'
				layout={{
					'text-field': area.areaName, // Display area name
					'text-size': [
						'interpolate', // Interpolate text size based on zoom
						['linear'],
						['zoom'],
						2,
						10, // Smaller text when zoomed out
						6,
						14, // Larger text when zoomed in
					],
					'text-anchor': 'center', // Center text
					'text-justify': 'center', // Center justified
					'text-offset': [0, 0], // No offset
					'text-allow-overlap': false, // Don't allow text to overlap
					'text-ignore-placement': false, // Honor placement conflicts
					'text-optional': true, // Text can be omitted if it would overlap
					'symbol-z-order': 'source', // Z-ordering
				}}
				paint={{
					'text-color': '#0077b6', // Blue text color
					'text-halo-color': 'rgba(255, 255, 255, 0.9)', // White text halo
					'text-halo-width': 1.5, // Halo width
				}}
				beforeId='settlement-label' // Render before map labels
			/>
		</Source>
	)
}

export default AreaLayer
