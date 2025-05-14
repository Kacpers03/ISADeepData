// frontend/src/pages/library/reports.tsx
// Files/Reports management page with filterable table of documents

import React, { useEffect, useState } from 'react'
import FileFilter from '../../components/files/fileFilter' // Filter component for document filtering
import FileTable from '../../components/files/fileTable' // Table component for displaying document data
import styles from '../../styles/files/reports.module.css' // Component-specific styles
import { useLanguage } from '../../contexts/languageContext' // Language context for internationalization

export default function FilesPage() {
	const { t } = useLanguage() // Translation function for internationalization

	// State for filter criteria
	const [filters, setFilters] = useState({
		country: 'all',
		contractor: 'all',
		year: 'all',
		theme: 'all',
		searchQuery: '',
	})

	// State for filter options
	const [contractors, setContractors] = useState<{ id: number; name: string }[]>([])
	const [countries, setCountries] = useState<string[]>([])
	const [years, setYears] = useState<string[]>([])
	const [themes, setThemes] = useState<string[]>([])

	// State for tracking filtered results
	const [filteredItems, setFilteredItems] = useState<any[]>([])

	// Fetch contractors from API
	useEffect(() => {
		const fetchContractors = async () => {
			try {
				const res = await fetch('http://localhost:5062/api/library/contractors')
				const data = await res.json()

				// Format contractor data for dropdown selection
				const formattedContractors = Array.isArray(data.result)
					? data.result.map((name: string, index: number) => ({
							id: index + 1,
							name,
					  }))
					: []

				setContractors(formattedContractors)
			} catch (err) {
				console.error('Error fetching contractors:', err)
			}
		}

		fetchContractors()
	}, [])

	// Fetch themes from API
	useEffect(() => {
		const fetchThemes = async () => {
			try {
				const res = await fetch('http://localhost:5062/api/library/themes')
				const data = await res.json()

				// Format theme data for dropdown selection
				const formattedThemes = Array.isArray(data.result) ? data.result : []
				setThemes(formattedThemes)
			} catch (err) {
				console.error('Error fetching themes:', err)
			}
		}

		fetchThemes()
	}, [])

	// Static test countries/years for now
	// This would be replaced with API fetching in production
	useEffect(() => {
		setCountries(['Norway', 'USA', 'Germany', 'China'])
		setYears(['2022', '2023', '2024', '2025'])
	}, [])

	// Handler for individual filter changes
	const handleFilterChange = (key: string, value: string) => {
		setFilters(prev => ({ ...prev, [key]: value }))
	}

	// Handler to reset all filters to default values
	const handleResetFilters = () => {
		setFilters({
			country: 'all',
			contractor: 'all',
			year: 'all',
			theme: 'all',
			searchQuery: '',
		})
	}

	return (
		<div className={styles.pageWrapper}>
			{/* Header section with page title and description */}
			<div className={styles.centeredHeaderSection}>
				<h1 className={styles.centeredPageTitle}>{t('library.files.title') || 'File Management Library'}</h1>
				<p className={styles.centeredPageDescription}>
					{t('library.files.description') ||
						'Browse and download official documents from contractors. Use filters to narrow down files by country, contractor, theme, or year.'}
				</p>
				<p className={styles.centeredPageDescription}>
					{t('library.files.instructions') ||
						'Click on any column header to sort the data. Click on a row to view detailed information about the file. The table displays essential metadata for each document, allowing for quick scanning and comparison of available resources.'}
				</p>
			</div>

			{/* Main content with filter panel and file table */}
			<div className={styles.mainContentRow}>
				<FileFilter
					filters={filters}
					onFilterChange={handleFilterChange}
					onResetFilters={handleResetFilters}
					contractors={contractors}
					countries={countries}
					years={years}
					themes={themes}
					currentFilteredItems={filteredItems}
				/>

				<FileTable filters={filters} setFilteredItems={setFilteredItems} />
			</div>
		</div>
	)
}
