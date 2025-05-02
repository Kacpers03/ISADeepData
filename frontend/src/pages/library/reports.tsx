import React, { useEffect, useState } from 'react'
import FileFilter from '../../components/files/fileFilter'
import FileTable from '../../components/files/fileTable'
import styles from '../../styles/files/reports.module.css'
import { useLanguage } from '../../contexts/languageContext'

export default function FilesPage() {
	const { t } = useLanguage()
	const [filters, setFilters] = useState({
		country: 'all',
		contractor: 'all',
		year: 'all',
		theme: 'all',
		searchQuery: '',
	})

	const [contractors, setContractors] = useState<{ id: number; name: string }[]>([])
	const [countries, setCountries] = useState<string[]>([])
	const [years, setYears] = useState<string[]>([])
	const [themes, setThemes] = useState<string[]>([])
	const [filteredItems, setFilteredItems] = useState<any[]>([])

	// Fetch contractors
	useEffect(() => {
		const fetchContractors = async () => {
			try {
				const res = await fetch('http://localhost:5062/api/library/contractors')
				const data = await res.json()

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

	// Fetch themes
	useEffect(() => {
		const fetchThemes = async () => {
			try {
				const res = await fetch('http://localhost:5062/api/library/themes')
				const data = await res.json()

				const formattedThemes = Array.isArray(data.result) ? data.result : []
				setThemes(formattedThemes)
			} catch (err) {
				console.error('Error fetching themes:', err)
			}
		}

		fetchThemes()
	}, [])

	// Static test countries/years for now
	useEffect(() => {
		setCountries(['Norway', 'USA', 'Germany', 'China'])
		setYears(['2022', '2023', '2024', '2025'])
	}, [])

	// Handle single filter change
	const handleFilterChange = (key: string, value: string) => {
		setFilters(prev => ({ ...prev, [key]: value }))
	}

	// Reset all filters
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
