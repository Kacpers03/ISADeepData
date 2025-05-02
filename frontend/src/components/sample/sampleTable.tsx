import React, { useEffect, useMemo, useState } from 'react'
import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	getPaginationRowModel,
	flexRender,
} from '@tanstack/react-table'
import styles from '../../styles/samples/table.module.css'
import CsvExportButton from './CSVButton'
import { formatNumericValue } from '../../utils/dataUtilities'
import { useLanguage } from '../../contexts/languageContext'

const SampleTable = ({ filters, visibleColumns, setFilteredData }) => {
	const { t } = useLanguage()
	const [tableData, setTableData] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchSamples = async () => {
			setLoading(true)
			try {
				const response = await fetch('http://localhost:5062/api/sample/list')
				if (!response.ok) throw new Error('Network response was not ok')
				const data = await response.json()
				setTableData(data.result || [])
			} catch (error) {
				console.error('Error fetching samples:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchSamples()
	}, [])

	const filteredData = useMemo(() => {
		const filtered = tableData.filter(item => {
			const matchSampleType =
				filters.sampleType === 'all' || item.sampleType?.toLowerCase() === filters.sampleType?.toLowerCase()

			const matchMatrixType =
				filters.matrixType === 'all' || item.matrixType?.toLowerCase() === filters.matrixType?.toLowerCase()

			const matchHabitatType =
				filters.habitatType === 'all' || item.habitatType?.toLowerCase() === filters.habitatType?.toLowerCase()

			const matchAnalysis =
				filters.analysis === 'all' || item.analysis?.toLowerCase() === filters.analysis?.toLowerCase()

			const matchSearch =
				!filters.searchQuery ||
				item.sampleCode?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
				item.sampleDescription?.toLowerCase().includes(filters.searchQuery.toLowerCase())

			const matchStation = filters.station === 'all' || item.stationCode === filters.station

			const matchCruise = filters.cruise === 'all' || item.cruiseName === filters.cruise

			const matchContractor = filters.contractor === 'all' || item.contractorName === filters.contractor

			return (
				matchSampleType &&
				matchMatrixType &&
				matchHabitatType &&
				matchAnalysis &&
				matchSearch &&
				matchStation &&
				matchCruise &&
				matchContractor
			)
		})

		// Update the filtered data in the parent component
		setFilteredData(filtered)

		return filtered
	}, [filters, tableData, setFilteredData])

	// Get summary statistics for the filter bar
	const filterSummary = useMemo(() => {
		if (!filteredData.length) return null

		const uniqueContractors = new Set(filteredData.map(item => item.contractorName).filter(Boolean))
		const uniqueCruises = new Set(filteredData.map(item => item.cruiseName).filter(Boolean))
		const uniqueStations = new Set(filteredData.map(item => item.stationCode).filter(Boolean))

		return {
			contractorCount: uniqueContractors.size,
			cruiseCount: uniqueCruises.size,
			stationCount: uniqueStations.size,
		}
	}, [filteredData])

	// Define all possible columns with improved cell rendering
	const allColumns = {
		sampleCode: {
			accessorKey: 'sampleCode',
			header: t('library.samples.table.sampleCode') || 'Sample Code',
			cell: info => info.getValue() ?? '-',
		},
		station: {
			accessorKey: 'stationCode',
			header: t('library.samples.table.station') || 'Station',
			cell: info => info.getValue() ?? '-',
		},
		cruise: {
			accessorKey: 'cruiseName',
			header: t('library.samples.table.cruise') || 'Cruise',
			cell: info => info.getValue() ?? '-',
		},
		contractor: {
			accessorKey: 'contractorName',
			header: t('library.samples.table.contractor') || 'Contractor',
			cell: info => info.getValue() ?? '-',
		},
		sampleType: {
			accessorKey: 'sampleType',
			header: t('library.samples.table.sampleType') || 'Sample Type',
			cell: info => info.getValue() ?? '-',
		},
		matrixType: {
			accessorKey: 'matrixType',
			header: t('library.samples.table.matrixType') || 'Matrix Type',
			cell: info => info.getValue() ?? '-',
		},
		habitatType: {
			accessorKey: 'habitatType',
			header: t('library.samples.table.habitatType') || 'Habitat Type',
			cell: info => info.getValue() ?? '-',
		},
		analysis: {
			accessorKey: 'analysis',
			header: t('library.samples.table.analysis') || 'Analysis',
			cell: info => info.getValue() ?? '-',
		},
		result: {
			accessorKey: 'result',
			header: t('library.samples.table.result') || 'Result',
			cell: info => info.getValue() ?? '-',
		},
		sampleDescription: {
			accessorKey: 'sampleDescription',
			header: t('library.samples.table.description') || 'Description',
			// Special cell rendering for description to handle long text
			cell: info => <div className={styles.descriptionCell}>{info.getValue() ?? '-'}</div>,
		},
	}

	// Only include columns the user selected
	const columns = useMemo(() => {
		return Object.keys(allColumns)
			.filter(key => visibleColumns.includes(key))
			.map(key => allColumns[key])
	}, [visibleColumns])

	const [sorting, setSorting] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

	const table = useReactTable({
		data: filteredData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: { sorting, pagination },
		onSortingChange: setSorting,
		onPaginationChange: setPagination,
	})

	// Export columns for CSV export
	const exportColumns = useMemo(() => {
		if (!filteredData.length) return []

		// Define formatters for specific fields to prevent Excel date conversion issues
		const formatters = {
			result: val => formatNumericValue(val),
			depthLower: val => formatNumericValue(val),
			depthUpper: val => formatNumericValue(val),
		}

		return Object.keys(filteredData[0]).map(key => ({
			label: key,
			key,
			format: formatters[key] || (val => (val !== null && val !== undefined ? String(val) : '')),
		}))
	}, [filteredData])

	if (loading) {
		return (
			<div className={styles.fileTableContainer}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						padding: '40px',
						color: '#475569',
					}}>
					{t('library.samples.table.loading') || 'Loading sample data...'}
				</div>
			</div>
		)
	}

	return (
		<div className={styles.fileTableContainer}>
			{/* Filter Summary */}
			{filterSummary && (
				<div className={styles.filterSummary}>
					Showing {filterSummary.contractorCount} contractor{filterSummary.contractorCount !== 1 ? 's' : ''},{' '}
					{filterSummary.cruiseCount} cruise{filterSummary.cruiseCount !== 1 ? 's' : ''}, and{' '}
					{filterSummary.stationCount} station{filterSummary.stationCount !== 1 ? 's' : ''}
				</div>
			)}

			<CsvExportButton
				data={filteredData}
				columns={exportColumns}
				filename='filtered-samples.csv'
				meta={{
					title: 'Samples',
					filters: {
						'Sample Type': filters.sampleType,
						'Matrix Type': filters.matrixType,
						'Habitat Type': filters.habitatType,
						Analysis: filters.analysis,
						Station: filters.station,
						Cruise: filters.cruise,
						Contractor: filters.contractor,
					},
				}}
			/>

			{filteredData.length === 0 ? (
				<div
					style={{
						textAlign: 'center',
						padding: '40px',
						color: '#64748b',
						backgroundColor: '#f8fafc',
						borderRadius: '8px',
						marginTop: '16px',
					}}>
					{t('library.samples.table.noResults') || 'No samples match your filter criteria. Try adjusting your filters.'}
				</div>
			) : (
				<div className={styles.tableWrapper}>
					<div className={styles.tableContainer}>
						<table className={styles.table}>
							<thead className={styles.tableHead}>
								{table.getHeaderGroups().map(headerGroup => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map(header => (
											<th
												key={header.id}
												onClick={header.column.getToggleSortingHandler()}
												className={styles.sortableHeader}
												style={{
													width: header.column.columnDef.accessorKey === 'sampleDescription' ? '300px' : 'auto',
												}}>
												{flexRender(header.column.columnDef.header, header.getContext())}
												{header.column.getIsSorted() && (
													<span className={styles.sortIndicator}>
														{header.column.getIsSorted() === 'desc' ? ' ▼' : ' ▲'}
													</span>
												)}
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody>
								{table.getRowModel().rows.map(row => (
									<tr key={row.id} className={styles.tableRow}>
										{row.getVisibleCells().map(cell => (
											<td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					<div className={styles.pagination}>
						<div className={styles.paginationControls}>
							<button
								onClick={() => table.setPageIndex(0)}
								disabled={!table.getCanPreviousPage()}
								className={styles.paginationButton}
								aria-label='First page'>
								{'<<'}
							</button>
							<button
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
								className={styles.paginationButton}
								aria-label='Previous page'>
								{'<'}
							</button>
							<span className={styles.pageInfo}>
								Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
							</span>
							<button
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
								className={styles.paginationButton}
								aria-label='Next page'>
								{'>'}
							</button>
							<button
								onClick={() => table.setPageIndex(table.getPageCount() - 1)}
								disabled={!table.getCanNextPage()}
								className={styles.paginationButton}
								aria-label='Last page'>
								{'>>'}
							</button>
							<select
								value={table.getState().pagination.pageSize}
								onChange={e => table.setPageSize(Number(e.target.value))}
								className={styles.pageSizeSelect}
								aria-label='Items per page'>
								{[10, 20, 30, 40, 50].map(size => (
									<option key={size} value={size}>
										Show {size}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default SampleTable
