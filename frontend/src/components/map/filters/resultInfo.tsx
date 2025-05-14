// frontend/src/components/map/filters/resultInfo.tsx
import React, { useState } from 'react' // Import React and useState hook
import styles from '../../../styles/map/filter.module.css' // Import CSS module for component styling
import { downloadCSV, analyzeMapData } from '../../../utils' // Import utility functions for CSV export

// Interface defining props for the ResultsInfo component
interface ResultsInfoProps {
	loading: boolean // Loading state to disable export button during data loading
	contractorCount: number // Number of contractors matching current filters
	cruiseCount: number // Number of cruises matching current filters
	stationCount: number // Number of stations matching current filters
	mapData: any // The actual map data to export to CSV
	t: any // Translation function from language context
}

// Component that displays result counts and CSV export button
const ResultsInfo: React.FC<ResultsInfoProps> = ({
	loading,
	contractorCount,
	cruiseCount,
	stationCount,
	mapData,
	t,
}) => {
	const [isExporting, setIsExporting] = useState(false) // State to track CSV export in progress
	const [exportState, setExportState] = useState<string | null>(null) // State to display export progress messages

	// Handler for CSV download with improved error handling and data analysis
	const handleDownloadCSV = async () => {
		if (!mapData || isExporting) return // Skip if no data or already exporting

		setIsExporting(true) // Set export in progress flag
		setExportState('Analyzing data...') // Set initial status message

		try {
			// Check if all data is properly loaded
			const dataCounts = analyzeMapData(mapData) // Analyze data structure and counts
			console.log('Data analysis for export:', dataCounts) // Log analysis for debugging

			// Set status message to show what's being exported
			setExportState(`Preparing CSV with ${dataCounts.contractors} contractors, ${dataCounts.cruises} cruises...`)

			// Use the enhanced utility function to download the CSV
			const result = await downloadCSV(mapData, `exploration-data`) // Trigger CSV download

			if (result) {
				setExportState('CSV downloaded successfully!') // Success message
			} else {
				setExportState('Error during download') // Generic error message
			}
		} catch (error) {
			console.error('Error exporting CSV:', error) // Log detailed error for debugging
			setExportState('Error: ' + (error.message || 'Failed to export data')) // User-friendly error message
		} finally {
			// Reset state after a delay to show feedback momentarily
			setTimeout(() => {
				setIsExporting(false) // Clear export in progress flag
				setExportState(null) // Clear status message
			}, 2000) // 2 second delay
		}
	}

	return (
		<div className={styles.resultsInfoWrapper}>
			{/* Results info showing filtered items by category */}
			<div className={styles.resultsInfo}>
				{loading ? (
					<span>Loading data...</span>
				) : (
					<span>
						Showing {contractorCount} contractor{contractorCount !== 1 ? 's' : ''}, {cruiseCount} cruise
						{cruiseCount !== 1 ? 's' : ''}, and {stationCount} station{stationCount !== 1 ? 's' : ''}
					</span>
				)}
			</div>

			{/* CSV Export Button with improved loading state and feedback */}
			<button
				className={styles.downloadButton}
				onClick={handleDownloadCSV}
				disabled={loading || contractorCount === 0 || isExporting}
				title='Download complete data as CSV file'>
				{isExporting ? (
					<>
						<span className={styles.buttonSpinner}></span>
						<span>{exportState || t('map.results.exporting') || 'Exporting...'}</span>
					</>
				) : (
					<>{t('map.results.downloadCSV') || 'Download CSV'}</>
				)}
			</button>
		</div>
	)
}

export default ResultsInfo
