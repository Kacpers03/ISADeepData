// CsvExportButton.tsx
import React from 'react'
import { convertToCSV, downloadCSV } from '../../utils/csvExportTable'
import { useLanguage } from '../../contexts/languageContext'

interface CsvExportButtonProps {
	data: any[]
	columns?: ExportColumn[]
	filename?: string
	meta?: CSVMeta
}

const CsvExportButton: React.FC<CsvExportButtonProps> = ({ data, columns, filename = 'export.csv', meta }) => {
	const { t } = useLanguage()
	const handleExport = () => {
		const csv = convertToCSV(data, columns, meta)
		downloadCSV(csv, filename)
	}

	return (
		<button onClick={handleExport} className='csvbutton'>
			{t('library.samples.button.exportCSV') || 'Export CSV'}
		</button>
	)
}

export default CsvExportButton
