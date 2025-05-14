// frontend/src/pages/library/samples.tsx
// Sample management page with filterable table of sample data

import React, { useState } from 'react'
import { Filter } from 'lucide-react' // Icon component for filter UI
import SampleFilter from '../../components/sample/sampleFilter' // Filter component for sample filtering
import SampleTable from '../../components/sample/sampleTable' // Table component for displaying sample data
import styles from '../../styles/samples/table.module.css' // Component-specific styles
import { useLanguage } from '../../contexts/languageContext' // Language context for internationalization

export default function SamplesPage() {
	const { t } = useLanguage() // Translation function for internationalization

	// Default filter values
	// These represent all the possible filter categories for sample data
	const defaultFilters = {
		sampleType: 'all',
		matrixType: 'all',
		habitatType: 'all',
		analysis: 'all',
		station: 'all',
		cruise: 'all',
		contractor: 'all',
		searchQuery: '',
	}

	// State for filters and visible columns
	const [filters, setFilters] = useState(defaultFilters)

	// State for controlling which columns are visible in the table
	// This allows users to customize their table view
	const [visibleColumns, setVisibleColumns] = useState([
		'sampleCode',
		'sampleType',
		'matrixType',
		'habitatType',
		'analysis',
		'result',
		'contractor',
		'station',
		'sampleDescription',
	])

	// State for mobile filter visibility - toggle on small screens
	const [mobileFilterVisible, setMobileFilterVisible] = useState(false)

	// State to store filtered data for filter options
	// This is used to populate filter dropdowns based on available data
	const [filteredData, setFilteredData] = useState([])

	return (
		<div className={styles.pageWrapper}>
			{/* Header section with page title and description */}
			<div className={styles.headerSection}>
				<h1 className={styles.pageTitle}>{t('library.samples.title') || 'Sample Management'}</h1>
				<p className={styles.pageDescription}>
					{t('library.samples.description') ||
						'Explore all collected samples and their metadata. Filter by sample type, habitat, matrix, or analysis type.'}
				</p>
			</div>

			{/* Main content with filter panel and sample table */}
			<div className={styles.mainContentRow}>
				{/* Sidebar Filter - Only visible on mobile when toggled */}
				<div className={`${styles.filterColumn} ${mobileFilterVisible ? styles.filterVisible : styles.filterHidden}`}>
					<SampleFilter
						filters={filters}
						setFilters={setFilters}
						defaultFilters={defaultFilters}
						visibleColumns={visibleColumns}
						setVisibleColumns={setVisibleColumns}
						filteredData={filteredData}
					/>
				</div>

				{/* Table Column - Main data display area */}
				<div className={styles.tableColumn}>
					<SampleTable filters={filters} visibleColumns={visibleColumns} setFilteredData={setFilteredData} />
				</div>
			</div>
		</div>
	)
}
