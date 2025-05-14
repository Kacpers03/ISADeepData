// frontend/src/components/map/hooks/useMapExport.ts
import { useCallback } from 'react' // Import React useCallback hook for memoized functions

// Custom hook for map data export functionality
const useMapExport = (mapRef, mapData) => {
	// Export current map view as a PNG image
	const exportMapImage = useCallback(() => {
		if (!mapRef.current) return null // Skip if map not available

		const map = mapRef.current.getMap() // Get map instance

		// Get the canvas element
		const canvas = map.getCanvas()

		// Convert the canvas to data URL
		try {
			const dataUrl = canvas.toDataURL('image/png') // Create PNG data URL

			// Create a link and trigger download
			const link = document.createElement('a')
			const timestamp = new Date().toISOString().replace(/[:.]/g, '-') // Format timestamp for filename
			link.download = `map-export-${timestamp}.png` // Set filename
			link.href = dataUrl // Set link URL
			document.body.appendChild(link) // Add to document
			link.click() // Trigger download
			document.body.removeChild(link) // Clean up

			return dataUrl // Return data URL
		} catch (error) {
			console.error('Error exporting map image:', error)
			return null // Return null on error
		}
	}, [mapRef]) // Depends on mapRef

	// Export visible map features as GeoJSON
	const exportGeoJSON = useCallback(() => {
		if (!mapRef.current || !mapData) return null // Skip if map or data not available

		const map = mapRef.current.getMap() // Get map instance

		// Get the current visible extent
		const bounds = map.getBounds()

		// Gather all visible features from specified layers
		const visibleFeatures = map.queryRenderedFeatures({
			layers: ['area-fill', 'block-fill'], // Only export these layers
		})

		// Convert to GeoJSON format
		const geojson = {
			type: 'FeatureCollection',
			features: visibleFeatures,
		}

		// Download as file
		const dataStr = JSON.stringify(geojson, null, 2) // Format with indentation
		const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

		const timestamp = new Date().toISOString().replace(/[:.]/g, '-') // Format timestamp for filename
		const exportFileName = `map-data-${timestamp}.geojson` // Set filename

		const linkElement = document.createElement('a')
		linkElement.setAttribute('href', dataUri) // Set link URL
		linkElement.setAttribute('download', exportFileName) // Set filename
		linkElement.click() // Trigger download

		return geojson // Return GeoJSON data
	}, [mapRef, mapData]) // Depends on mapRef and mapData

	// Export data as CSV file
	const exportCSV = useCallback((data, filename = 'map-data') => {
		if (!data || !Array.isArray(data)) return null // Skip if no valid data

		// Convert data to CSV format
		const headers = Object.keys(data[0]).join(',') // Get column names from first object
		const rows = data.map(item =>
			Object.values(item)
				.map(val => (typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val)) // Escape quotes in strings
				.join(',')
		)

		const csvContent = [headers, ...rows].join('\n') // Join headers and rows with newlines

		// Create download link using Blob for better handling
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
		const url = URL.createObjectURL(blob)
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-') // Format timestamp for filename

		const link = document.createElement('a')
		link.setAttribute('href', url) // Set link URL
		link.setAttribute('download', `${filename}-${timestamp}.csv`) // Set filename
		link.style.visibility = 'hidden' // Hide link
		document.body.appendChild(link) // Add to document
		link.click() // Trigger download
		document.body.removeChild(link) // Clean up

		return csvContent // Return CSV content
	}, []) // No dependencies

	// Return export functions
	return {
		exportMapImage, // Function to export as image
		exportGeoJSON, // Function to export as GeoJSON
		exportCSV, // Function to export as CSV
	}
}

export default useMapExport
