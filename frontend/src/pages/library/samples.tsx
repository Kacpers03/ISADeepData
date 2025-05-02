import React, { useState } from 'react'
import { Filter } from 'lucide-react'
import SampleFilter from '../../components/sample/sampleFilter'
import SampleTable from '../../components/sample/sampleTable'
import styles from '../../styles/samples/table.module.css'
import { useLanguage } from '../../contexts/languageContext'

export default function SamplesPage() {
	const { t } = useLanguage()
	// Default filter values
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

	// State for mobile filter visibility
	const [mobileFilterVisible, setMobileFilterVisible] = useState(false)

	// State to store filtered data for filter options
	const [filteredData, setFilteredData] = useState([])

	return (
		<div className={styles.pageWrapper}>
			<div className={styles.headerSection}>
				<h1 className={styles.pageTitle}>{t('library.samples.title') || 'Sample Management'}</h1>
				<p className={styles.pageDescription}>
					{t('library.samples.description') ||
						'Explore all collected samples and their metadata. Filter by sample type, habitat, matrix, or analysis type.'}
				</p>
			</div>

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

				{/* Table Column */}
				<div className={styles.tableColumn}>
					<SampleTable filters={filters} visibleColumns={visibleColumns} setFilteredData={setFilteredData} />
				</div>
			</div>
		</div>
	)
}
