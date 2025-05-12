// frontend/src/utils/csvExport.ts
// Comprehensive CSV export utility that converts complex map data to properly formatted CSV files

import { MapData } from './dataModels' // Import type definition for map data
import {
	getProp, // Utility for safely accessing properties regardless of case
	normalizeCase, // Utility for normalizing object property cases
	formatNumericValue, // Utility for formatting numeric values safely for Excel
	formatDateValue, // Utility for formatting dates in a consistent format
	debugDataFields, // Utility for logging data structure for debugging
	analyzeMapData, // Utility for analyzing and counting data entities
} from './dataUtilities'

// Converts data to CSV format with all related data
export const convertToCSV = (data: MapData): string => {
	if (!data) return ''

	// Log the data structure to debug
	console.log('Raw data for CSV export:', data)

	// Normalize all data to camelCase for consistent access
	const normalizedData = normalizeCase(data)
	console.log('Normalized data for CSV export:', normalizedData)

	// Use semicolon as delimiter for better Excel compatibility
	const delimiter = ';'

	// Store all rows here
	const allRows: string[] = []

	// SECTION 1: CONTRACTORS - Matching exact column names from DbInitializer.cs
	if (normalizedData.contractors && normalizedData.contractors.length > 0) {
		// Add section title with empty cells for proper column alignment
		allRows.push(['CONTRACTORS', '', '', '', '', '', '', ''].join(delimiter))

		// Column headers - each in its own column matching DbInitializer.cs
		allRows.push(
			[
				'ContractorId',
				'ContractorName',
				'ContractTypeId',
				'ContractStatusId',
				'ContractNumber',
				'SponsoringState',
				'ContractualYear',
				'Remarks',
			].join(delimiter)
		)

		// Add contractor data
		normalizedData.contractors.forEach((contractor: any) => {
			const row = [
				getProp(contractor, 'contractorId'),
				getProp(contractor, 'contractorName') || '',
				getProp(contractor, 'contractType') || '',
				getProp(contractor, 'contractStatus') || '',
				getProp(contractor, 'contractNumber') || '',
				getProp(contractor, 'sponsoringState') || '',
				formatNumericValue(getProp(contractor, 'contractualYear')),
				getProp(contractor, 'remarks') || '',
			]
			allRows.push(row.join(delimiter))
		})

		// Add empty rows as separator
		allRows.push(['', '', '', '', '', '', '', ''].join(delimiter))
		allRows.push(['', '', '', '', '', '', '', ''].join(delimiter))
	}

	// SECTION 2: CONTRACTOR AREAS - Matching exact column names from DbInitializer.cs
	const allAreas = normalizedData.contractors.flatMap((contractor: any) =>
		(getProp(contractor, 'areas') || []).map((area: any) => ({
			...area,
			contractorId: getProp(contractor, 'contractorId'),
			contractorName: getProp(contractor, 'contractorName'),
		}))
	)

	if (allAreas.length > 0) {
		allRows.push(['CONTRACTOR AREAS', '', '', '', '', '', '', '', '', ''].join(delimiter))

		// Headers matching exactly the columns in DbInitializer.cs
		allRows.push(
			[
				'AreaId',
				'ContractorId',
				'AreaName',
				'AreaDescription',
				'CenterLatitude',
				'CenterLongitude',
				'TotalAreaSizeKm2',
				'AllocationDate',
				'ExpiryDate',
			].join(delimiter)
		)

		allAreas.forEach((area: any) => {
			// Log the area object to debug
			console.log('Processing area for CSV:', area)

			const row = [
				getProp(area, 'areaId'),
				getProp(area, 'contractorId'),
				getProp(area, 'areaName') || '',
				getProp(area, 'areaDescription') || '',
				formatNumericValue(getProp(area, 'centerLatitude') ? getProp(area, 'centerLatitude').toFixed(6) : ''),
				formatNumericValue(getProp(area, 'centerLongitude') ? getProp(area, 'centerLongitude').toFixed(6) : ''),
				formatNumericValue(getProp(area, 'totalAreaSizeKm2')),
				formatDateValue(getProp(area, 'allocationDate')),
				formatDateValue(getProp(area, 'expiryDate')),
			]

			allRows.push(row.join(delimiter))
		})

		// Add empty rows as separator
		allRows.push(['', '', '', '', '', '', '', '', '', ''].join(delimiter))
		allRows.push(['', '', '', '', '', '', '', '', '', ''].join(delimiter))
	}

	// SECTION 3: CONTRACTOR AREA BLOCKS - Matching exact column names from DbInitializer.cs
	const allBlocks = allAreas.flatMap((area: any) =>
		(getProp(area, 'blocks') || []).map((block: any) => ({
			...block,
			areaId: getProp(area, 'areaId'),
			areaName: getProp(area, 'areaName'),
			contractorId: getProp(area, 'contractorId'),
			contractorName: getProp(area, 'contractorName'),
		}))
	)

	if (allBlocks.length > 0) {
		allRows.push(['CONTRACTOR AREA BLOCKS', '', '', '', '', '', '', '', ''].join(delimiter))

		// Headers matching exactly the columns in DbInitializer.cs
		allRows.push(
			[
				'BlockId',
				'AreaId',
				'BlockName',
				'BlockDescription',
				'Status',
				'CenterLatitude',
				'CenterLongitude',
				'AreaSizeKm2',
				'Category',
			].join(delimiter)
		)

		allBlocks.forEach((block: any) => {
			// Log the block object to debug
			console.log('Processing block for CSV:', block)

			const row = [
				getProp(block, 'blockId'),
				getProp(block, 'areaId'),
				getProp(block, 'blockName') || '',
				getProp(block, 'blockDescription') || '',
				getProp(block, 'status') || '',
				formatNumericValue(getProp(block, 'centerLatitude') ? getProp(block, 'centerLatitude').toFixed(6) : ''),
				formatNumericValue(getProp(block, 'centerLongitude') ? getProp(block, 'centerLongitude').toFixed(6) : ''),
				formatNumericValue(getProp(block, 'areaSizeKm2')),
				getProp(block, 'category') || '',
			]

			allRows.push(row.join(delimiter))
		})

		// Add empty rows as separator
		allRows.push(['', '', '', '', '', '', '', '', '', '', ''].join(delimiter))
		allRows.push(['', '', '', '', '', '', '', '', '', '', ''].join(delimiter))
	}

	// SECTION 4: CRUISES - Matching exact column names from DbInitializer.cs
	if (normalizedData.cruises && normalizedData.cruises.length > 0) {
		// Add section title with empty cells for proper column alignment
		allRows.push(['CRUISES', '', '', '', '', ''].join(delimiter))

		// Column headers - each in its own column matching DbInitializer.cs
		allRows.push(['CruiseId', 'ContractorId', 'CruiseName', 'ResearchVessel', 'StartDate', 'EndDate'].join(delimiter))

		// Add cruise data
		normalizedData.cruises.forEach((cruise: any) => {
			const row = [
				getProp(cruise, 'cruiseId'),
				getProp(cruise, 'contractorId'),
				getProp(cruise, 'cruiseName') || '',
				getProp(cruise, 'researchVessel') || '',
				formatDateValue(getProp(cruise, 'startDate')),
				formatDateValue(getProp(cruise, 'endDate')),
			]

			allRows.push(row.join(delimiter))
		})

		// Add empty rows as separator
		allRows.push(['', '', '', '', '', ''].join(delimiter))
		allRows.push(['', '', '', '', '', ''].join(delimiter))
	}

	// SECTION 5: STATIONS - Matching exact column names from DbInitializer.cs
	// Collect all stations from all cruises
	const allStations = normalizedData.cruises.flatMap((cruise: any) =>
		(getProp(cruise, 'stations') || []).map((station: any) => ({
			...station,
			cruiseId: getProp(cruise, 'cruiseId'),
			cruiseName: getProp(cruise, 'cruiseName'),
			contractorId: getProp(cruise, 'contractorId'),
		}))
	)

	if (allStations.length > 0) {
		// Add section title with empty cells for proper column alignment
		allRows.push(['STATIONS', '', '', '', '', ''].join(delimiter))

		// Column headers - each in its own column matching DbInitializer.cs
		allRows.push(['StationId', 'CruiseId', 'StationCode', 'StationType', 'Latitude', 'Longitude'].join(delimiter))

		// Add station data
		allStations.forEach((station: any) => {
			const row = [
				getProp(station, 'stationId'),
				getProp(station, 'cruiseId'),
				getProp(station, 'stationCode') || '',
				getProp(station, 'stationType') || '',
				formatNumericValue(getProp(station, 'latitude') ? getProp(station, 'latitude').toFixed(6) : ''),
				formatNumericValue(getProp(station, 'longitude') ? getProp(station, 'longitude').toFixed(6) : ''),
			]

			allRows.push(row.join(delimiter))
		})

		// Add empty rows as separator
		allRows.push(['', '', '', '', '', ''].join(delimiter))
		allRows.push(['', '', '', '', '', ''].join(delimiter))
	}

	// SECTION 6: CTD DATA - Matching exact column names from DbInitializer.cs
	// Collect all CTD data from all stations
	const allCTDData = allStations.flatMap((station: any) =>
		(getProp(station, 'ctdDataSet') || []).map((ctd: any) => ({
			...ctd,
			stationId: getProp(station, 'stationId'),
			stationCode: getProp(station, 'stationCode'),
			cruiseId: getProp(station, 'cruiseId'),
		}))
	)

	if (allCTDData.length > 0) {
		// Add section title
		allRows.push(['CTD DATA', '', '', '', '', '', '', ''].join(delimiter))

		// Column headers matching DbInitializer.cs
		allRows.push(
			[
				'CtdId',
				'StationId',
				'StationCode',
				'DepthM',
				'TemperatureC',
				'Salinity',
				'Oxygen',
				'Ph',
				'MeasurementTime',
			].join(delimiter)
		)

		// Add CTD data
		allCTDData.forEach((ctd: any) => {
			const row = [
				getProp(ctd, 'ctdId'),
				getProp(ctd, 'stationId'),
				getProp(ctd, 'stationCode') || '',
				formatNumericValue(getProp(ctd, 'depthM')),
				formatNumericValue(getProp(ctd, 'temperatureC')),
				formatNumericValue(getProp(ctd, 'salinity')),
				formatNumericValue(getProp(ctd, 'oxygen')),
				formatNumericValue(getProp(ctd, 'ph')),
				formatDateValue(getProp(ctd, 'measurementTime'), true),
			]

			allRows.push(row.join(delimiter))
		})

		// Add empty rows as separator
		allRows.push(['', '', '', '', '', '', '', '', ''].join(delimiter))
		allRows.push(['', '', '', '', '', '', '', '', ''].join(delimiter))
	}

	// SECTION 7: SAMPLES - Matching exact column names from DbInitializer.cs
	// Collect all samples from all stations
	const allSamples = allStations.flatMap((station: any) =>
		(getProp(station, 'samples') || []).map((sample: any) => ({
			...sample,
			stationId: getProp(station, 'stationId'),
			stationCode: getProp(station, 'stationCode'),
			cruiseId: getProp(station, 'cruiseId'),
		}))
	)

	if (allSamples.length > 0) {
		// Add section title
		allRows.push(['SAMPLES', '', '', '', '', '', '', '', '', '', '', '', '', ''].join(delimiter))

		// Column headers matching DbInitializer.cs
		allRows.push(
			[
				'SampleId',
				'StationId',
				'SampleCode',
				'SampleType',
				'MatrixType',
				'HabitatType',
				'SamplingDevice',
				'DepthLower',
				'DepthUpper',
				'SampleDescription',
				'Analysis',
				'Result',
				'Unit',
			].join(delimiter)
		)

		// Add sample data
		allSamples.forEach((sample: any) => {
			// Debug the sample object to see all available properties
			console.log('Processing sample for CSV:', sample)

			const row = [
				getProp(sample, 'sampleId') || '',
				getProp(sample, 'stationId') || '',
				getProp(sample, 'sampleCode') || '',
				getProp(sample, 'sampleType') || '',
				getProp(sample, 'matrixType') || '',
				getProp(sample, 'habitatType') || '',
				getProp(sample, 'samplingDevice') || '',
				formatNumericValue(getProp(sample, 'depthLower')),
				formatNumericValue(getProp(sample, 'depthUpper')),
				getProp(sample, 'sampleDescription') || '',
				getProp(sample, 'analysis') || '',
				formatNumericValue(getProp(sample, 'result')),
				getProp(sample, 'unit') || '',
			]

			allRows.push(row.join(delimiter))
		})

		// Add empty rows as separator
		allRows.push(['', '', '', '', '', '', '', '', '', '', '', '', ''].join(delimiter))
		allRows.push(['', '', '', '', '', '', '', '', '', '', '', '', ''].join(delimiter))
	}

	// SECTION 8: ENVIRONMENTAL RESULTS - Matching exact column names from DbInitializer.cs
	// Collect all environmental results from all samples
	const allEnvResults = allSamples.flatMap((sample: any) =>
		(getProp(sample, 'envResults') || []).map((result: any) => ({
			...result,
			sampleId: getProp(sample, 'sampleId'),
			sampleCode: getProp(sample, 'sampleCode'),
			stationId: getProp(sample, 'stationId'),
			stationCode: getProp(sample, 'stationCode'),
		}))
	)

	if (allEnvResults.length > 0) {
		// Add section title
		allRows.push(['ENVIRONMENTAL RESULTS', '', '', '', '', '', ''].join(delimiter))

		// Column headers matching DbInitializer.cs
		allRows.push(
			['EnvResultId', 'SampleId', 'AnalysisCategory', 'AnalysisName', 'AnalysisValue', 'Units', 'Remarks'].join(
				delimiter
			)
		)

		// Add environmental result data
		allEnvResults.forEach((result: any) => {
			const row = [
				getProp(result, 'envResultId') || '',
				getProp(result, 'sampleId'),
				getProp(result, 'analysisCategory') || '',
				getProp(result, 'analysisName') || '',
				formatNumericValue(getProp(result, 'analysisValue')),
				getProp(result, 'units') || '',
				getProp(result, 'remarks') || '',
			]

			allRows.push(row.join(delimiter))
		})

		// Add empty rows as separator
		allRows.push(['', '', '', '', '', '', ''].join(delimiter))
		allRows.push(['', '', '', '', '', '', ''].join(delimiter))
	}

	// SECTION 9: GEOLOGICAL RESULTS - Matching exact column names from DbInitializer.cs
	// Collect all geological results from all samples
	const allGeoResults = allSamples.flatMap((sample: any) =>
		(getProp(sample, 'geoResults') || []).map((result: any) => ({
			...result,
			sampleId: getProp(sample, 'sampleId'),
			sampleCode: getProp(sample, 'sampleCode'),
			stationId: getProp(sample, 'stationId'),
		}))
	)

	if (allGeoResults.length > 0) {
		// Add section title
		allRows.push(['GEOLOGICAL RESULTS', '', '', '', '', '', '', ''].join(delimiter))

		// Column headers matching DbInitializer.cs
		allRows.push(
			['GeoResultId', 'SampleId', 'Category', 'Analysis', 'Value', 'Units', 'Qualifier', 'Remarks'].join(delimiter)
		)

		// Add geological result data
		allGeoResults.forEach((result: any) => {
			const row = [
				getProp(result, 'geoResultId') || '',
				getProp(result, 'sampleId'),
				getProp(result, 'category') || '',
				getProp(result, 'analysis') || '',
				formatNumericValue(getProp(result, 'value')),
				getProp(result, 'units') || '',
				getProp(result, 'qualifier') || '',
				getProp(result, 'remarks') || '',
			]

			allRows.push(row.join(delimiter))
		})

		// Add empty rows as separator
		allRows.push(['', '', '', '', '', '', '', ''].join(delimiter))
		allRows.push(['', '', '', '', '', '', '', ''].join(delimiter))
	}

	// SECTION 10: PHOTO/VIDEO - Matching exact column names from DbInitializer.cs
	// Collect all media from all samples
	const allMedia = allSamples.flatMap((sample: any) =>
		(getProp(sample, 'photoVideos') || []).map((media: any) => ({
			...media,
			sampleId: getProp(sample, 'sampleId'),
			sampleCode: getProp(sample, 'sampleCode'),
			stationId: getProp(sample, 'stationId'),
		}))
	)

	if (allMedia.length > 0) {
		// Add section title
		allRows.push(['PHOTO_VIDEO', '', '', '', '', '', ''].join(delimiter))

		// Column headers matching DbInitializer.cs
		allRows.push(
			['MediaId', 'SampleId', 'FileName', 'MediaType', 'CameraSpecs', 'CaptureDate', 'Remarks'].join(delimiter)
		)

		// Add media data
		allMedia.forEach((media: any) => {
			const row = [
				getProp(media, 'mediaId') || '',
				getProp(media, 'sampleId'),
				getProp(media, 'fileName') || '',
				getProp(media, 'mediaType') || '',
				getProp(media, 'cameraSpecs') || '',
				formatDateValue(getProp(media, 'captureDate')),
				getProp(media, 'remarks') || '',
			]

			allRows.push(row.join(delimiter))
		})

		// Add empty rows as separator
		allRows.push(['', '', '', '', '', '', ''].join(delimiter))
		allRows.push(['', '', '', '', '', '', ''].join(delimiter))
	}

	// SECTION 11: LIBRARY - Matching exact column names from DbInitializer.cs
	// Collect all library entries from all contractors
	const allLibraries = normalizedData.contractors.flatMap((contractor: any) =>
		(getProp(contractor, 'libraries') || []).map((library: any) => ({
			...library,
			contractorId: getProp(contractor, 'contractorId'),
			contractorName: getProp(contractor, 'contractorName'),
		}))
	)

	if (allLibraries.length > 0) {
		// Add section title
		allRows.push(['LIBRARY', '', '', '', '', '', '', '', '', ''].join(delimiter))

		// Column headers matching DbInitializer.cs
		allRows.push(
			[
				'LibraryId',
				'ContractorId',
				'Theme',
				'FileName',
				'Title',
				'Description',
				'Year',
				'Country',
				'SubmissionDate',
				'IsConfidential',
			].join(delimiter)
		)

		// Add library data
		allLibraries.forEach((library: any) => {
			const row = [
				getProp(library, 'libraryId') || '',
				getProp(library, 'contractorId'),
				getProp(library, 'theme') || '',
				getProp(library, 'fileName') || '',
				getProp(library, 'title') || '',
				getProp(library, 'description') || '',
				formatNumericValue(getProp(library, 'year')),
				getProp(library, 'country') || '',
				formatDateValue(getProp(library, 'submissionDate')),
				getProp(library, 'isConfidential') ? 'true' : 'false',
			]

			allRows.push(row.join(delimiter))
		})
	}

	// Combine all rows into one string
	return allRows.join('\r\n')
}

// Generate and download data as a CSV file with all related data
export const downloadCSV = (data: MapData, filename = 'exploration-data'): boolean => {
	if (!data) {
		console.error('No data provided for CSV export')
		return false
	}

	try {
		// Convert data to CSV format
		const csvString = convertToCSV(data)

		// Add UTF-8 BOM for Excel compatibility
		const bomPrefix = '\uFEFF'
		const fileContent = bomPrefix + csvString

		// Create a Blob with the CSV data
		const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8;' })

		// Create a download URL
		const url = URL.createObjectURL(blob)

		// Add date to filename for uniqueness
		const date = new Date().toISOString().split('T')[0]
		const fullFilename = `${filename}-${date}.csv`

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
		console.error('Error creating CSV export:', error)
		return false
	}
}

// Default export for module
export default {
	convertToCSV,
	downloadCSV,
}
