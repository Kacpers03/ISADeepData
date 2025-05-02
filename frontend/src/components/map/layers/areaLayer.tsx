import React, { useMemo } from 'react'
import { Source, Layer } from 'react-map-gl'

interface AreaLayerProps {
	area: {
		areaId: number
		areaName: string
		geoJson: any
		centerLatitude?: number
		centerLongitude?: number
		totalAreaSizeKm2?: number
	}
}

const AreaLayer: React.FC<AreaLayerProps> = ({ area }) => {
	// Dynamically set layer paint properties based on zoom level
	const getAreaPaint = useMemo(
		() => ({
			'fill-color': '#0077b6',
			'fill-opacity': [
				'interpolate',
				['linear'],
				['zoom'],
				2,
				0.08, // Less opacity when zoomed out
				6,
				0.15, // More opacity when zoomed in
			],
			'fill-outline-color': '#0077b6',
		}),
		[]
	)

	const getAreaLinePaint = useMemo(
		() => ({
			'line-color': '#0077b6',
			'line-width': [
				'interpolate',
				['linear'],
				['zoom'],
				2,
				1.5, // Thinner line when zoomed out
				6,
				2.5, // Thicker line when zoomed in
			],
			'line-dasharray': [3, 2],
		}),
		[]
	)

	return (
		<Source key={`area-source-${area.areaId}`} id={`area-source-${area.areaId}`} type='geojson' data={area.geoJson}>
			{/* Area Fill */}
			<Layer id={`area-fill-${area.areaId}`} type='fill' paint={getAreaPaint} beforeId='settlement-label' />

			{/* Area Outline */}
			<Layer id={`area-line-${area.areaId}`} type='line' paint={getAreaLinePaint} beforeId='settlement-label' />

			{/* Area Label */}
			<Layer
				id={`area-label-${area.areaId}`}
				type='symbol'
				layout={{
					'text-field': area.areaName,
					'text-size': [
						'interpolate',
						['linear'],
						['zoom'],
						2,
						10, // Smaller text when zoomed out
						6,
						14, // Larger text when zoomed in
					],
					'text-anchor': 'center',
					'text-justify': 'center',
					'text-offset': [0, 0],
					'text-allow-overlap': false,
					'text-ignore-placement': false,
					'text-optional': true,
					'symbol-z-order': 'source',
				}}
				paint={{
					'text-color': '#0077b6',
					'text-halo-color': 'rgba(255, 255, 255, 0.9)',
					'text-halo-width': 1.5,
				}}
				beforeId='settlement-label'
			/>
		</Source>
	)
}

export default AreaLayer
