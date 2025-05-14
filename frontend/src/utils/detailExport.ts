// frontend/src/utils/detailExport.ts
// Specialized CSV export utilities for entity-specific exports with relationship preservation

import { Station, Cruise, Contractor, MapData } from '../types/filter-types'
import { convertToCSV } from './csvExport'

const findContractor = (mapData: MapData, contractorId: number): Contractor | null => {
	if (!mapData || !mapData.contractors) return null
	return mapData.contractors.find(c => c.contractorId === contractorId) || null
}

const findCruise = (mapData: MapData, cruiseId: number): Cruise | null => {
	if (!mapData || !mapData.cruises) return null
	return mapData.cruises.find(c => c.cruiseId === cruiseId) || null
}

export const exportStationCSV = (station: Station, mapData: MapData, filename = 'station-data'): boolean => {
	if (!station || !station.stationId) {
		console.error('No station ID provided for CSV export')
		return false
	}

	try {
		// Find the cruise that contains this station directly from mapData
		let parentCruise: Cruise | null = null
		let fullStation: Station | null = null

		// Search through all cruises to find the one containing our station
		for (const cruise of mapData.cruises || []) {
			const foundStation = cruise.stations?.find(s => s.stationId === station.stationId)
			if (foundStation) {
				parentCruise = cruise
				fullStation = foundStation
				break
			}
		}

		if (!parentCruise || !fullStation) {
			console.error(`Station with ID ${station.stationId} not found in any cruise`)
			return false
		}

		// Find the contractor if we have a cruise with contractorId
		// This maintains the complete data hierarchy for the export
		const contractorId = parentCruise.contractorId
		const parentContractor = contractorId ? findContractor(mapData, contractorId) : null

		// Create a mini-dataset focused on this station
		// This preserves all relationships while keeping the CSV export focused
		const exportData: MapData = {
			contractors: parentContractor ? [parentContractor] : [],
			cruises: [
				{
					...parentCruise,
					// Only include this specific station
					stations: parentCruise.stations?.filter(s => s.stationId === station.stationId),
				},
			],
		}

		// Add UTF-8 BOM for Excel compatibility
		const bomPrefix = '\uFEFF'

		// Use the standard CSV converter with our focused dataset
		const csvString = convertToCSV(exportData)
		const fileContent = bomPrefix + csvString

		// Create a Blob with the CSV data
		const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8;' })

		// Create a download URL
		const url = URL.createObjectURL(blob)

		// Add date and station code to filename for uniqueness
		// Replace spaces with underscores for better filename compatibility
		const date = new Date().toISOString().split('T')[0]
		const stationCode = fullStation.stationCode || `station-${fullStation.stationId}`
		const fullFilename = `${filename}-${stationCode.replace(/\s+/g, '_')}-${date}.csv`

		// Create and trigger a download link
		const link = document.createElement('a')
		link.setAttribute('href', url)
		link.setAttribute('download', fullFilename)
		link.style.visibility = 'hidden'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)

		// Clean up the URL object
		URL.revokeObjectURL(url)

		return true
	} catch (error) {
		console.error('Error creating station CSV export:', error)
		return false
	}
}

export const exportCruiseCSV = (cruise: Cruise, mapData: MapData, filename = 'cruise-data'): boolean => {
	if (!cruise) {
		console.error('No cruise data provided for CSV export')
		return false
	}

	try {
		// Find the parent contractor to include in export
		// This ensures the full data hierarchy is preserved in the export
		const parentContractor = cruise.contractorId ? findContractor(mapData, cruise.contractorId) : null

		// Create a mini-dataset focused on this cruise with all relationships intact
		const exportData: MapData = {
			contractors: parentContractor ? [parentContractor] : [],
			cruises: [cruise],
		}

		// Add UTF-8 BOM for Excel compatibility
		const bomPrefix = '\uFEFF'

		// Use the standard CSV converter with our focused dataset
		const csvString = convertToCSV(exportData)
		const fileContent = bomPrefix + csvString

		// Create a Blob with the CSV data
		const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8;' })

		// Create a download URL
		const url = URL.createObjectURL(blob)

		// Add date and cruise name to filename for uniqueness
		// Replace spaces with underscores for better filename compatibility
		const date = new Date().toISOString().split('T')[0]
		const cruiseName = cruise.cruiseName || `cruise-${cruise.cruiseId}`
		const fullFilename = `${filename}-${cruiseName.replace(/\s+/g, '_')}-${date}.csv`

		// Create and trigger a download link
		const link = document.createElement('a')
		link.setAttribute('href', url)
		link.setAttribute('download', fullFilename)
		link.style.visibility = 'hidden'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)

		// Clean up the URL object
		URL.revokeObjectURL(url)

		return true
	} catch (error) {
		console.error('Error creating cruise CSV export:', error)
		return false
	}
}

export const exportContractorCSV = (
	contractor: Contractor,
	mapData: MapData,
	filename = 'contractor-data'
): boolean => {
	if (!contractor) {
		console.error('No contractor data provided for CSV export')
		return false
	}

	try {
		// Find all cruises that belong to this contractor
		// This ensures we include all related cruise data in the export
		const contractorCruises = mapData.cruises?.filter(cruise => cruise.contractorId === contractor.contractorId) || []

		// Create a mini-dataset focused on just this contractor and its cruises
		const exportData: MapData = {
			contractors: [contractor],
			cruises: contractorCruises,
		}

		// Add UTF-8 BOM for Excel compatibility
		const bomPrefix = '\uFEFF'

		// Use the standard CSV converter with our focused dataset
		const csvString = convertToCSV(exportData)
		const fileContent = bomPrefix + csvString

		// Create a Blob with the CSV data
		const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8;' })

		// Create a download URL
		const url = URL.createObjectURL(blob)

		// Add date and contractor name to filename for uniqueness
		// Replace spaces with underscores and limit length to avoid too long filenames
		const date = new Date().toISOString().split('T')[0]
		const contractorName = contractor.contractorName || `contractor-${contractor.contractorId}`
		const fullFilename = `${filename}-${contractorName.replace(/\s+/g, '_').substring(0, 30)}-${date}.csv`

		// Create and trigger a download link
		const link = document.createElement('a')
		link.setAttribute('href', url)
		link.setAttribute('download', fullFilename)
		link.style.visibility = 'hidden'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)

		// Clean up the URL object
		URL.revokeObjectURL(url)

		return true
	} catch (error) {
		console.error('Error creating contractor CSV export:', error)
		return false
	}
}

export default {
	exportStationCSV,
	exportCruiseCSV,
	exportContractorCSV,
}
