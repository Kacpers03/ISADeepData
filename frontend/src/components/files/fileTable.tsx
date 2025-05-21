import React, { useEffect, useMemo, useState, useRef } from 'react' // Import React hooks
import { useLanguage } from '../../contexts/languageContext' // Import language context for translations
import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	getPaginationRowModel,
	flexRender,
	ColumnDef,
} from '@tanstack/react-table' // Import TanStack Table library components
import { Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react' // Import Lucide icons
import styles from '../../styles/files/reports.module.css' // Import CSS module
import { useRouter } from 'next/router' // Import Next.js router for navigation

// Interface defining the file data structure
interface FileData {
	fileName: string
	contractor: string
	country: string
	year: number
	theme: string
	description: string
}

const FileTable: React.FC<{
	filters: {
		country: string
		contractor: string
		year: string
		theme: string
		searchQuery: string
	} // Current filter state
	setFilteredItems?: (items: FileData[]) => void // Optional callback to notify parent of filtered items
}> = ({ filters, setFilteredItems }) => {
	const { t } = useLanguage() // Get translation function
	const [tableData, setTableData] = useState<FileData[]>([]) // State for all table data
	const router = useRouter() // Next.js router for navigation
	const tableScrollRef = useRef<HTMLDivElement>(null) // Ref for table scroll container
	const [scrollPosition, setScrollPosition] = useState(0) // Track scroll position
	const [initialLoad, setInitialLoad] = useState(true) // Flag for initial data load

	// Track previous filter values to detect changes
	const prevFiltersRef = useRef(filters)

	// Fetch file data from API on component mount
	useEffect(() => {
		const fetchFiles = async () => {
			try {
				const response = await fetch('http://localhost:5062/api/library/list') // API endpoint
				if (!response.ok) throw new Error('Network response was not ok')

				const data = await response.json()
				setTableData(data) // Store fetched data
				setInitialLoad(false) // Mark initial load as complete
			} catch (error) {
				console.error('Error fetching files:', error)
				setInitialLoad(false) // Still mark initial load as complete even on error
			}
		}

		fetchFiles()
	}, [])

	// Save scroll position when user scrolls - used to maintain position after filtering
	useEffect(() => {
		const handleScroll = () => {
			if (tableScrollRef.current) {
				setScrollPosition(tableScrollRef.current.scrollTop) // Store current scroll position
			}
		}

		const scrollContainer = tableScrollRef.current
		if (scrollContainer) {
			scrollContainer.addEventListener('scroll', handleScroll) // Add scroll listener
			return () => {
				scrollContainer.removeEventListener('scroll', handleScroll) // Clean up listener on unmount
			}
		}
	}, [])

	// Filter data based on current filters - memoized for performance
	const filteredData = useMemo(() => {
		const filtered = tableData.filter(item => {
			const matchCountry = filters.country === 'all' || item.country?.toLowerCase() === filters.country.toLowerCase()

			const matchContractor =
				filters.contractor === 'all' || item.contractor?.toLowerCase() === filters.contractor.toLowerCase()

			const matchYear = filters.year === 'all' || item.year?.toString() === filters.year

			const matchTheme = filters.theme === 'all' || item.theme?.toLowerCase() === filters.theme.toLowerCase()

			const matchSearch =
				!filters.searchQuery ||
				item.fileName?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
				item.description?.toLowerCase().includes(filters.searchQuery.toLowerCase())

			return matchCountry && matchContractor && matchYear && matchTheme && matchSearch // Item must match all active filters
		})

		// Notify parent component of filtered items if callback provided
		if (setFilteredItems) {
			setFilteredItems(filtered)
		}

		return filtered
	}, [filters, tableData, setFilteredItems]) // Recalculate when filters or data change

	// Get summary statistics for the filter bar - memoized for performance
	const filterSummary = useMemo(() => {
		if (!filteredData.length) return null

		// Calculate unique counts for display
		const uniqueContractors = new Set(filteredData.map(item => item.contractor).filter(Boolean))
		const uniqueCountries = new Set(filteredData.map(item => item.country).filter(Boolean))
		const uniqueThemes = new Set(filteredData.map(item => item.theme).filter(Boolean))

		return {
			contractorCount: uniqueContractors.size,
			countryCount: uniqueCountries.size,
			themeCount: uniqueThemes.size,
		}
	}, [filteredData]) // Recalculate when filtered data changes

	// Restore scroll position when filtered data changes
	useEffect(() => {
		// Only restore scroll if it's not the initial load and filters have changed
		if (
			!initialLoad &&
			tableScrollRef.current &&
			(filters.country !== prevFiltersRef.current.country ||
				filters.contractor !== prevFiltersRef.current.contractor ||
				filters.year !== prevFiltersRef.current.year ||
				filters.theme !== prevFiltersRef.current.theme ||
				filters.searchQuery !== prevFiltersRef.current.searchQuery)
		) {
			// Small delay to ensure the DOM has updated
			setTimeout(() => {
				if (tableScrollRef.current) {
					tableScrollRef.current.scrollTop = scrollPosition // Restore previous scroll position
				}
			}, 0)
		}

		// Update the previous filters reference
		prevFiltersRef.current = filters
	}, [filteredData, initialLoad, scrollPosition, filters])

	// Define table columns with accessors, headers and cell renderers
	const columns: ColumnDef<FileData>[] = useMemo(
		() => [
			{
				accessorKey: 'fileName',
				header: t('library.table.fileName') || 'File Name',
				minWidth: 200,
				cell: info => {
					const fileUrl = info.getValue<string>()
					const fileName = fileUrl?.split('/').pop() || 'Unknown File' // Extract file name from URL
					return (
						<div className={styles.fileLinkContainer}>
							<a
								href={fileUrl}
								target='_blank'
								rel='noopener noreferrer'
								download
								className={styles.fileLink}
								onClick={e => e.stopPropagation()} // Stop event propagation to prevent row click triggering
							>
								<Download className={styles.downloadIcon} size={16} /> {/* Download icon */}
								{fileName}
							</a>
						</div>
					)
				},
			},
			{
				accessorKey: 'contractor',
				header: t('library.table.contractor') || 'Contractorr',
				minWidth: 120,
				cell: info => <span>{info.getValue<string>() || t('library.table.unknown') || 'Unknown'}</span>, // Show "Unknown" for missing values
			},
			{
				accessorKey: 'country',
				header: t('library.table.country') || 'Country',
				minWidth: 120,
				cell: info => <span>{info.getValue<string>() || t('library.table.na') || 'N/A'}</span>, // Show "N/A" for missing values
			},
			{
				accessorKey: 'year',
				header: t('library.table.year') || 'Year',
				minWidth: 80,
				cell: info => <span>{info.getValue<string | number>() || t('library.table.na') || 'N/A'}</span>, // Show "N/A" for missing values
			},
			{
				accessorKey: 'theme',
				header: t('library.table.theme') || 'Theme',
				minWidth: 120,
				cell: info => <span>{info.getValue<string>() || t('library.table.na') || 'N/A'}</span>, // Show "N/A" for missing values
			},
			{
				id: 'description',
				header: t('library.table.description') || 'Description',
				minWidth: 100,
				cell: ({ row }) => {
					const description = row.original.description || t('library.table.noDescription') || 'No description available'
					return (
						<div className={styles.tooltipContainer} onClick={e => e.stopPropagation()}>
							<div className={styles.tooltip}>{description}</div> {/* Tooltip for description */}
						</div>
					)
				},
			},
		],
		[t]
	)

	const [sorting, setSorting] = useState([]) // State for table sorting
	const [pagination, setPagination] = useState({
		pageIndex: 0, // Current page index (0-based)
		pageSize: 10, // Number of items per page
	})

	// Initialize and configure the table
	const table = useReactTable({
		data: filteredData,
		columns,
		getCoreRowModel: getCoreRowModel(), // Basic row model
		getSortedRowModel: getSortedRowModel(), // Adds sorting capability
		getPaginationRowModel: getPaginationRowModel(), // Adds pagination capability
		state: { pagination, sorting }, // Connect state to table
		onSortingChange: setSorting, // Handle sort state changes
		onPaginationChange: setPagination, // Handle pagination state changes
	})

	return (
		<div className={styles.fileTableContainer}>
			{' '}
			{/* Main container */}
			{/* Filter Summary - shows counts of filtered items */}
			{filterSummary && (
				<div className={styles.filterSummary}>
					Showing {filterSummary.contractorCount} contractor{filterSummary.contractorCount !== 1 ? 's' : ''},{' '}
					{filterSummary.countryCount} countr{filterSummary.countryCount !== 1 ? 'ies' : 'y'}, and{' '}
					{filterSummary.themeCount} theme{filterSummary.themeCount !== 1 ? 's' : ''}
				</div>
			)}
			<div
				className={styles.tableScrollContainer}
				ref={tableScrollRef} // Reference for scroll position tracking
				style={{ height: 'auto' }} // Ensure height is based on content
			>
				<table className={styles.table}>
					<thead className={styles.tableHead}>
						{table.getHeaderGroups().map(headerGroup => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map(column => (
									<th
										key={column.id}
										onClick={column.column.getToggleSortingHandler()} // Add click handler for sorting
										className={styles.sortableHeader}
										style={{ minWidth: (column.column.columnDef as any).minWidth }}>
										{' '}
										{/* Apply min width from column definition */}
										{flexRender(column.column.columnDef.header, column.getContext())} {/* Render header content */}
										{column.column.getIsSorted() && (
											<span className={styles.sortIndicator}>
												{column.column.getIsSorted() === 'desc' ? ' ▼' : ' ▲'} {/* Show sort direction indicator */}
											</span>
										)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.length > 0 ? (
							table.getRowModel().rows.map(row => (
								<tr
									key={row.id}
									className={styles.tableRow}
									onClick={() =>
										router.push({
											pathname: '/library/moreinfo',
											query: { data: JSON.stringify(row.original) }, // Navigate to details page with row data
										})
									}
									style={{ cursor: 'pointer' }}>
									{' '}
									{/* Show pointer cursor to indicate clickable */}
									{row.getVisibleCells().map(cell => (
										<td key={cell.id} style={{ minWidth: (cell.column.columnDef as any).minWidth }}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())} {/* Render cell content */}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td colSpan={columns.length} style={{ textAlign: 'center', padding: '32px 20px' }}>
									No results match your current filters {/* Empty state message */}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			{/* Pagination controls */}
			<div className={styles.pagination}>
				<div className={styles.paginationControls}>
					<button
						onClick={() => table.setPageIndex(0)} // Go to first page
						disabled={!table.getCanPreviousPage()} // Disable if already on first page
						className={styles.paginationButton}>
						<ChevronsLeft size={16} /> {/* First page icon */}
					</button>
					<button
						onClick={() => table.previousPage()} // Go to previous page
						disabled={!table.getCanPreviousPage()} // Disable if already on first page
						className={styles.paginationButton}>
						<ChevronLeft size={16} /> {/* Previous page icon */}
					</button>
					<span className={styles.pageInfo}>
						<span className={styles.pageInfo}>
							{t('library.pagination.page') || 'Page'} {table.getState().pagination.pageIndex + 1}{' '}
							{t('library.pagination.of') || 'of'} {Math.max(1, table.getPageCount())}
						</span>
					</span>
					<button
						onClick={() => table.nextPage()} // Go to next page
						disabled={!table.getCanNextPage()} // Disable if already on last page
						className={styles.paginationButton}>
						<ChevronRight size={16} /> {/* Next page icon */}
					</button>
					<button
						onClick={() => table.setPageIndex(table.getPageCount() - 1)} // Go to last page
						disabled={!table.getCanNextPage()} // Disable if already on last page
						className={styles.paginationButton}>
						<ChevronsRight size={16} /> {/* Last page icon */}
					</button>
					<select
						value={table.getState().pagination.pageSize} // Current page size
						onChange={e => table.setPageSize(Number(e.target.value))} // Handle page size change
						className={styles.pageSizeSelect}>
						{[5, 10, 20, 30, 50].map(pageSize => (
							<option key={pageSize} value={pageSize}>
								{t('library.pagination.show') || 'Show'} {pageSize} {/* Page size options */}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	)
}

export default FileTable
