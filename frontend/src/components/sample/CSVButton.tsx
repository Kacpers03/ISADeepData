// CsvExportButton.tsx
import React from 'react' // Import React library
import { convertToCSV, downloadCSV } from '../../utils/csvExportTable' // Import utility functions for CSV conversion and download
import { useLanguage } from '../../contexts/languageContext' // Import language context for translations

// Interface defining component props
interface CsvExportButtonProps {
	data: any[] // Array of data to be exported to CSV
	columns?: ExportColumn[] // Optional column definitions for customizing exported CSV
	filename?: string // Optional custom filename for the downloaded CSV
	meta?: CSVMeta // Optional metadata to include in the CSV header
}

const CsvExportButton: React.FC<CsvExportButtonProps> = ({ data, columns, filename = 'export.csv', meta }) => {
	const { t } = useLanguage() // Get translation function from language context

	// Handle export button click
	const handleExport = () => {
		const csv = convertToCSV(data, columns, meta) // Convert data to CSV format using utility function
		downloadCSV(csv, filename) // Trigger CSV download with specified filename
	}

	return (
		<button onClick={handleExport} className='csvbutton'>
			{' '}
			{/* Export button with click handler */}
			{t('library.samples.button.exportCSV') || 'Export CSV'} {/* Button text with translation fallback */}
		</button>
	)
}

export default CsvExportButton
