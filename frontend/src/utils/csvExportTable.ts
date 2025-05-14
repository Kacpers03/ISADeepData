// frontend/src/utils/csvExportTable.ts
// Generic CSV export utility for tabular data with configurable columns and Excel compatibility

type ExportColumn = {
	label: string // Column header displayed in the CSV file
	key: string // Property key to retrieve data from the object
	format?: (value: any) => string // Optional formatting function for this column
}

type CSVMeta = {
	title?: string // Optional title displayed at the top of the CSV file
	filters?: Record<string, string> // Optional filter information included below the title
}

const escapeCSV = (value: string) => {
	if (value === null || value === undefined) return '""'
	const clean = value
		.toString()
		.replace(/"/g, '""') // Double quotes are escaped with double quotes per CSV spec
		.replace(/\r?\n|\r/g, ' ') // Replace all line breaks with spaces
	return `"${clean}"` // Wrap the value in quotes
}

const padForExcel = (value: string, width: number = 10) => {
	return value?.toString().padEnd(width, ' ')
}

// Check if a value might be interpreted as a date in Excel
// This is important to prevent e.g. "1.23" from being converted to January 23rd
const mightBeDate = (value: string): boolean => {
	// Check for patterns like "1.23", "01.23", "1-23", "01-23" which Excel might convert to dates
	return /^\d{1,2}[.,]\d{1,2}$/.test(value) || /^\d{1,2}[-/]\d{1,2}$/.test(value)
}

// Format values to prevent Excel from misinterpreting them as dates
// Especially important for decimal numbers that might look like date formats
const formatForExcel = (value: any): string => {
	if (value === null || value === undefined) return ''

	const stringValue = String(value)

	// If it's a decimal number that Excel might interpret as a date
	if (mightBeDate(stringValue)) {
		// Prefix with = and wrap in quotes to force Excel to treat it as text/formula
		return `="=${stringValue}"`
	}

	return stringValue
}

export const convertToCSV = (data: any[], columns?: ExportColumn[], meta?: CSVMeta): string => {
	if (!data?.length) return ''

	// Use semicolon as delimiter for better Excel compatibility
	const delimiter = ';'

	// If columns not specified, use all properties from first data object
	const columnDefs =
		columns ??
		Object.keys(data[0]).map(key => ({
			label: key,
			key,
		}))

	// Title row if meta.title is specified
	const titleLine = meta?.title ? escapeCSV(meta.title) : null

	// Filter information if meta.filters is specified
	const filterLine = meta?.filters
		? escapeCSV(
				'Filtered by: ' +
					Object.entries(meta.filters)
						.map(([k, v]) => `${k} = ${v}`)
						.join('; ')
		  )
		: null

	// Generate headers for all columns
	const headers = columnDefs.map(col => escapeCSV(col.label))

	// Convert each data row to CSV format
	const rows = data.map(row =>
		columnDefs
			.map(col => {
				const raw = row[col.key]
				// Use custom formatter if provided, otherwise default Excel-safe formatting
				const formatted = col.format ? col.format(raw) : formatForExcel(raw)
				return escapeCSV(padForExcel(formatted))
			})
			.join(delimiter)
	)

	// Combine all parts of the CSV file
	const csvParts = [
		...(titleLine ? [titleLine] : []), // Title if specified
		...(filterLine ? [filterLine] : []), // Filter information if specified
		'', // Empty line for spacing between metadata and data
		headers.join(delimiter), // Column headers
		...rows, // Data rows
	]

	// Return complete CSV string with line breaks between each part
	return csvParts.join('\n')
}

export const downloadCSV = (csvString: string, filename: string) => {
	// Add UTF-8 BOM (Byte Order Mark) for better Excel compatibility with special characters
	const bomPrefix = '\uFEFF'

	// Create a blob with the CSV content and correct MIME type
	const blob = new Blob([bomPrefix + csvString], { type: 'text/csv;charset=utf-8;' })

	// Generate a URL for the blob
	const url = URL.createObjectURL(blob)

	// Create a temporary anchor element for downloading
	const link = document.createElement('a')
	link.href = url
	link.setAttribute('download', filename)

	// Add anchor element to DOM, click it to start download, and remove it
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)

	// Release the URL object to avoid memory leaks
	URL.revokeObjectURL(url)
}
